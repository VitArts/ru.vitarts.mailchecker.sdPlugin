const path = require('path');
const fs = require('fs-extra');

console.log('Начало сборки...');

const currentDir = __dirname;

// 获取父文件夹的路径
const parentDir = path.join(currentDir, '..');
// 获取父文件夹的名称
const PluginName = path.basename(parentDir);


const PluginPath = path.join(process.env.APPDATA, 'HotSpot/StreamDock/plugins', PluginName);

try {
    // 删除旧的插件目录
    fs.removeSync(PluginPath);

    // 确保目标目录存在
    fs.ensureDirSync(path.dirname(PluginPath));

    // 复制当前目录到目标路径，排除 node_modules
    fs.copySync(path.resolve(__dirname, '..'), PluginPath, {
        filter: (src) => {
            const relativePath = path.relative(path.resolve(__dirname, '..'), src);
            // 排除 'node_modules' 和 '.git' 目录及其子文件
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