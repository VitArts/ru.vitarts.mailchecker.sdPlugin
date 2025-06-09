const path = require('path');
const fs = require('fs-extra');

console.log('Начало сборки...');

const currentDir = __dirname;

// Путь к родительскому каталогу
const parentDir = path.join(currentDir, '..');
// Название родительского каталога
const PluginName = path.basename(parentDir);


const PluginPath = path.join(process.env.APPDATA, 'HotSpot/StreamDock/plugins', PluginName);

try {
    // Удалить старый каталог плагина, если он существует
    fs.removeSync(PluginPath);

    // Убедится, что папка для плагина существует
    fs.ensureDirSync(path.dirname(PluginPath));

    // Скопировать текущий каталог в папку с плагинами без node_modules
    fs.copySync(path.resolve(__dirname, '..'), PluginPath, {
        filter: (src) => {
            const relativePath = path.relative(path.resolve(__dirname, '..'), src);
            // Исключите "node_modules" и".каталог git и его вложенные файлы
            return !relativePath.startsWith('plugin\\node_modules') 
                 &&!relativePath.startsWith('plugin\\index.js')
                 &&!relativePath.startsWith('plugin\\package.json')
                 &&!relativePath.startsWith('plugin\\package-lock.json')
                 &&!relativePath.startsWith('plugin\\pnpm-lock.yaml')
                 &&!relativePath.startsWith('plugin\\yarn.lock')
                 &&!relativePath.startsWith('plugin\\build')
                 &&!relativePath.startsWith('plugin\\log')
                 &&!relativePath.startsWith('.git')
                 &&!relativePath.startsWith('.vscode');
        }
    });
    
    fs.copySync( path.join(__dirname, "build"), path.join(PluginPath,'plugin'))

    console.log(`Плагин создан - "${PluginName}" "${PluginPath}"`);
    console.log('Успешно!');
} catch (err) {
    console.error(`Ошибка "${PluginName}":`, err);
}