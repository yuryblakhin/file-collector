# File Collector

Утилита для сканирования директорий и сохранения содержимого файлов с их путями.

## Установка

```bash
# Клонируйте репозиторий
git clone [https://github.com/yuryblakhin/file-collector]

# Перейдите в директорию проекта
cd folder-scanner

# Установите зависимости
npm install
```

## Использование

### Создание конфигурации

Перед первым использованием создайте файл конфигурации:

```bash
npm run scan -- --init
```

Это создаст файл `.scanner-config.json` со следующими настройками по умолчанию:
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

### Сканирование директории

```bash
# Базовое использование
npm run scan -- --dir ./my-project

# С включенной отладкой
npm run scan -- --dir ./project --debug

# С указанием другого конфиг-файла
npm run scan -- --dir ./project --config ./custom-config.json
```

### Опции командной строки

- `--dir <путь>` - путь к директории для сканирования
- `--config <путь>` - путь к файлу конфигурации (по умолчанию: .scanner-config.json)
- `--init` - создать файл конфигурации в текущей директории
- `--debug` - показывать отладочную информацию
- `--help` - показать справку
