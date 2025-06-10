const { exec } = require('child_process');

/**
 * Открывает URL в браузере в зависимости от ОС.
 * process.platform может быть 'win32', 'darwin' или другое (Linux).
 */
function openInBrowser(url) {
  log.info(`Opening URL: ${url}`);
  try {
    if (process.platform === 'win32') exec(`start "" "${url}"`);
    else if (process.platform === 'darwin') exec(`open "${url}"`);
    else exec(`xdg-open "${url}"`);
  } catch (err) {
    log.error('Cannot open URL:', err);
  }
}

module.exports = openInBrowser;