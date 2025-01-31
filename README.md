# File Collector

Утилита для сканирования директорий и сохранения содержимого файлов с их путями.

## Быстрый старт

```bash
# Создайте конфигурацию перед первым использованием
npm run scan -- --init

# Запустите сканирование
npm run scan -- --dir ./путь/к/вашей/папке

# Посмотреть все опции
npm run scan -- --help
```

## Конфигурация

После запуска `--init` создаётся файл `.scanner-config.json` со следующими настройками:
```json
{
  "outputFile": "output.txt",
  "ignoredDirs": [
    "node_modules",
    ".git",
    "dist",
    "build",
    ".idea",
    "coverage",
    ".next",
    ".vscode"
  ],
  "ignoredFiles": [
    ".DS_Store",
    ".env",
    "*.log",
    ".gitignore",
    "*.map",
    "*.min.js",
    "*.min.css",
    "package-lock.json",
    "yarn.lock"
  ]
}
```

## Опции командной строки

- `--dir <путь>` - путь к директории для сканирования
- `--config <путь>` - путь к файлу конфигурации (по умолчанию: .scanner-config.json)
- `--init` - создать файл конфигурации в текущей директории
- `--debug` - показывать отладочную информацию
- `--help` - показать справку

## Примеры использования

```bash
# Базовое сканирование
npm run scan -- --dir ./my-project

# С включенной отладкой
npm run scan -- --dir ./my-project --debug

# С другим конфиг-файлом
npm run scan -- --dir ./my-project --config ./custom-config.json
```
