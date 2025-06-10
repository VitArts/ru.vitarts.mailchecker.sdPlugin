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

module.exports = openInBrowser;