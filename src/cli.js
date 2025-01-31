const FolderScanner = require('./scanner');
const ConfigManager = require('./config');
const path = require('path');

function showHelp() {
    console.log(`
Использование: npm run scan -- [опции]

Опции:
  --dir <путь>      Путь к директории для сканирования
  --config <путь>   Путь к файлу конфигурации (по умолчанию: .scanner-config.json)
  --init           Создать файл конфигурации в текущей директории
  --debug          Показывать отладочную информацию
  --help           Показать эту справку

Примеры:
  npm run scan -- --init                    # Создать конфиг
  npm run scan -- --dir ./my-project        # Сканировать директорию
  npm run scan -- --config ./my-config.json # Использовать другой конфиг
    `);
}

async function main() {
    const args = process.argv.slice(2);
    const options = {
        dir: null,
        config: '.scanner-config.json',
        debug: false,
        init: false
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--dir':
                options.dir = args[++i];
                break;
            case '--config':
                options.config = args[++i];
                break;
            case '--debug':
                options.debug = true;
                break;
            case '--init':
                options.init = true;
                break;
            case '--help':
                showHelp();
                return;
        }
    }

    const configManager = new ConfigManager();

    if (options.init) {
        await configManager.createDefault();
        console.log('Создан файл конфигурации:', configManager.configPath);
        console.log('Вы можете отредактировать его для настройки сканера.');
        return;
    }

    if (!options.dir) {
        console.error('Необходимо указать директорию через --dir');
        showHelp();
        return;
    }

    const config = await configManager.load();

    if (options.debug) {
        console.log('Текущая конфигурация:', config);
    }

    const absolutePath = path.resolve(options.dir);
    console.log('Сканируемая директория:', absolutePath);

    const scanner = new FolderScanner({
        ...config,
        debug: options.debug
    });

    try {
        console.log('Начинаем сканирование...');
        if (options.debug) {
            console.log('Игнорируемые папки:', scanner.ignoredDirs);
            console.log('Игнорируемые файлы:', scanner.ignoredFiles);
        }

        await scanner.scan(absolutePath);
        console.log('Сканирование завершено!');
    } catch (error) {
        console.error('Ошибка при сканировании:', error);
        process.exit(1);
    }
}

main().catch(console.error);