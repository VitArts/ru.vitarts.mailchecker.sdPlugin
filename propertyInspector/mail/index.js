/// <reference path="../utils/common.js" />
/// <reference path="../utils/action.js" />

// $local 是否国际化
// $back 是否自行决定回显时机
// $dom 获取文档元素 - 不是动态的都写在这里面
const $local = true, $back = false, $dom = {
    main: $('.sdpi-wrapper'),
    loginBtn: $('#loginBtn'),
    // host: $('#host'),
    // port: $('#port'),
    // tls: $('#tls'),
    // email: $('#email'),
    // password: $('#password'),
};

const $propEvent = {
    didReceiveGlobalSettings({ settings }) {
        console.log(settings);
    },
    didReceiveSettings(data) {
        const loggedIn = Boolean(data.settings.isLogin);
        const hasHost  = data.settings.hasOwnProperty('host');

        loginBtn.disabled = false
        isLogin.style.display = 'none'

        if (loggedIn) {
            isLoginTrue.style.display = 'block';
        } else if (!loggedIn && hasHost) {
            isLoginFalse.style.display = 'block';
        }

        host.value = data.settings.host || ''
        port.value = data.settings.port || ''
        email.value = data.settings.user || ''
        url.value = data.settings.url || ''
    },
    sendToPropertyInspector(data) {
        console.log(data)
    }
};

// Нажатие на кнопку отправки данных
loginBtn.addEventListener('click', (e) => {
   // Предотвратить перезагрузку страницы
    e.preventDefault();

    // Формируем объект настроек
    const settings = {
        host: host.value.trim(),
        port: port.value.trim(),
        tls: tls.checked,
        user: email.value.trim(),
        password: password.value.trim(),
        isLogin: false,
        url: url.value.trim()
    };

    // Отправляем настройки (например, в Stream Deck плагин)
    $websocket.setSettings(settings);
    loginBtn.disabled = true
    isLogin.style.display = 'block'
    isLoginTrue.style.display = 'none'
    isLoginFalse.style.display = 'none'
});