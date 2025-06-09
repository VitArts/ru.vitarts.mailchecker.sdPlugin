const { Plugins, Actions, log } = require('./utils/plugin');
const { execSync } = require('child_process');
const imaps = require('imap-simple');
const plugin = new Plugins('mailchecker');
const createSvg = require('./func/createSvg')

// Хранилище состояния по контекстам
const watchers = {};

/**
 * Рекурсивно собирает пути всех папок почты.
 * @param {object} boxes — объект со структурой папок от imap-simple
 * @param {string} prefix — префикс для вложенных папок (начало пути)
 * @returns {string[]} — массив строк с полными именами папок
 */
function flattenBoxes(boxes, prefix = '') {
  const folders = [];
  for (const name in boxes) {
    const box = boxes[name];
    // Пропускаем папки с атрибутом \Noselect (нельзя открыть)
    if (box.attribs && box.attribs.includes('\\Noselect')) continue;
    // Формируем полный путь: если есть префикс, добавляем разделитель
    const path = prefix ? `${prefix}${box.delimiter}${name}` : name;
    folders.push(path);
    // Если есть вложенные папки — обходим их рекурсивно
    if (box.children) {
      folders.push(...flattenBoxes(box.children, path));
    }
  }
  return folders;
}

/**
 * Запускает проверку почты для данного контекста.
 * @param {string} context — уникальный идентификатор экземпляра плагина
 * @param {object} settings — настройки подключения (user, password и т.п.)
 */
async function startMailCheck(context, settings) {
  log.info(`Starting mail check for context=${context}`);
  // Сначала останавливаем предыдущий таймер/соединение для этого контекста
  stopMailCheck(context);

  // Конфигурация для подключения к IMAP
  const config = {
    imap: {
      user: settings.user,
      password: settings.password,
      host: settings.host,
      port: settings.port || 993,       // порт по умолчанию 993
      tls: settings.tls ?? true,        // использовать TLS
      tlsOptions: { rejectUnauthorized: false }, // игнорировать ошибки сертификата
      authTimeout: 10000                // время таймаута в мс
    }
  };

  // Набор имён системных папок, которые не проверяем
  const exclude = new Set([
    'Удаленные','Исходящие','Отправленные','Спам',
    'Deleted','Outbox','Sent','Spam', 'Trash'
  ]);

  // Создаём объект состояния: connection — соединение, timer — таймер, reconnecting — флаг
  const state = { connection: null, timer: null, reconnecting: false };
  watchers[context] = state;

  // Функция обработки ошибки соединения:
  function onError() {
    const svgErr = createSvg('ERR');                         
    plugin.setImage(context, svgErr);
    settings.isLogin = false;                                 
    plugin.setSettings(context, settings);                    
  }

  // Функция обновляет UI с новым числом непрочитанных писем
  async function updateUI(total) {
    log.info(`Updating UI: ${total} unseen emails`);
    const svg = createSvg(total.toString());
    plugin.setImage(context, `data:image/svg+xml;charset=utf8,${svg}`);
    settings.isLogin = true;
    plugin.setSettings(context, settings);
  }

  // Основная проверка всех папок
  async function checkAll() {
    const connection = state.connection;
    if (!connection) return;                 

    log.info('Running checkAll');
    let total = 0;
    try {
      const boxes = await connection.getBoxes();    
      const all = flattenBoxes(boxes);              

      for (const folder of all) {
        // имя папки — после последнего разделителя
        const delim = (boxes['INBOX'] && boxes['INBOX'].delimiter) || '/';
        const name = folder.split(delim).pop();
        if (exclude.has(name)) continue;            

        try {
          await connection.openBox(folder);                  
          const results = await connection.search(['UNSEEN']); 
          log.info(`Folder "${folder}": ${results.length} unseen`);
          total += results.length;
        } catch (err) {
          log.error(`Error in folder "${folder}":`, err);
          // если соединение сброшено — пытаемся переподключиться
          if (err.code === 'ECONNRESET' || err.textCode === 'CLIENTBUG') {
            return reconnect();
          }
        } finally {
          // закрываем папку, если была открыта
          try { await connection.closeBox(); } catch {}
        }
      }

      // Обновляем интерфейс
      await updateUI(total);

    } catch (err) {
      log.error('Error in checkAll:', err);
      if (err.code === 'ECONNRESET') reconnect();  // при сбросе соединения
    }
  }

  // Функция переподключения: ставит паузу и заново запускает startMailCheck
  function reconnect() {
    if (state.reconnecting) return;        
    state.reconnecting = true;
    log.info('Reconnecting IMAP');
    stopMailCheck(context);                
    setTimeout(() => {
      state.reconnecting = false;
      startMailCheck(context, settings);   
    }, 5000);                              
  }

  // Настройка и создание соединения с IMAP-сервером
  async function setupConnection() {
    try {
      log.info('Connecting to IMAP server');
      const connection = await imaps.connect(config);
      state.connection = connection;

      // Обработчики событий самого соединения
      connection.on('error', err => {
        log.error('IMAP error:', err);
        if (err.code === 'ECONNRESET') reconnect();
      });
      connection.on('close', hadError => {
        log.info(`IMAP closed${hadError ? ' due to error' : ''}`);
        reconnect();
      });

      await connection.openBox('INBOX');
      log.info('Opened INBOX');
      await checkAll();                     

      // Запускаем таймер, который будет проверять почту каждую минуту
      state.timer = setInterval(checkAll, 60 * 1000);
      log.info('Periodic timer started');
    } catch (err) {
      log.error('Connection setup error:', err);
      onError();                            // показываем ошибку в UI
    }
  }

  setupConnection();  // запускаем всё вышеописанное
}

/**
 * Останавливает проверку почты для данного контекста:
 * • очищает таймер
 * • закрывает соединение
 * • удаляет состояние
 */
function stopMailCheck(context) {
  const w = watchers[context];
  if (w) {
    log.info(`Stopping mail watch for context=${context}`);
    if (w.timer) clearInterval(w.timer);
    if (w.connection) {
      try { w.connection.end(); }
      catch (err) { log.error('Error ending connection:', err); }
    }
    delete watchers[context];
  }
}

/**
 * Открывает URL в браузере в зависимости от ОС.
 * process.platform может быть 'win32', 'darwin' или другое (Linux).
 */
function openInBrowser(url) {
  log.info(`Opening URL: ${url}`);
  try {
    if (process.platform === 'win32') execSync(`start "" "${url}"`);
    else if (process.platform === 'darwin') execSync(`open "${url}"`);
    else execSync(`xdg-open "${url}"`);
  } catch (err) {
    log.error('Cannot open URL:', err);
  }
}

// Регистрируем действия плагина:
// • _willAppear — когда плагин появляется на экране
// • _willDisappear — когда исчезает
// • keyDown — при нажатии на кнопку
// • didReceiveSettings — когда меняются настройки
plugin.mailchecker = new Actions({
  async _willAppear({ context, payload }) {
    startMailCheck(context, payload.settings || {}); // запускаем проверку
  },

  _willDisappear({ context }) {
    stopMailCheck(context);                          // останавливаем проверку
  },

  keyDown({ payload }) {
    openInBrowser(payload.settings.url);             // открываем URL из настроек
  },

  async didReceiveSettings({ context, payload }) {
    // при обновлении настроек — перезапускаем проверку
    startMailCheck(context, payload.settings || {});
  }
});

// Экспортируем плагин, чтобы пульт его подключал
module.exports = plugin;
