const fs = require('fs').promises;
const path = require('path');

class FolderScanner {
    constructor(options = {}) {
        this.ignoredDirs = options.ignoredDirs || ['node_modules', '.git'];
        this.ignoredFiles = options.ignoredFiles || ['.DS_Store'];
        this.outputFile = options.outputFile || 'output.txt';
        this.debug = options.debug || false;
    }

    async scan(dirPath) {
        try {
            if (this.debug) {
                console.log('Начальная директория:', dirPath);
            }
            await fs.writeFile(this.outputFile, '');
            await this.processDirectory(dirPath);
            return true;
        } catch (error) {
            console.error('Ошибка сканирования:', error);
            return false;
        }
    }

    async processDirectory(currentPath) {
        try {
            if (this.debug) {
                console.log('Обработка директории:', currentPath);
            }

            const items = await fs.readdir(currentPath, { withFileTypes: true });

            for (const item of items) {
                const fullPath = path.join(currentPath, item.name);

                if (this.shouldIgnore(fullPath, item.isDirectory())) {
                    if (this.debug) {
                        console.log('Игнорируем:', fullPath);
                    }
                    continue;
                }

                if (item.isDirectory()) {
                    await this.processDirectory(fullPath);
                } else {
                    await this.processFile(fullPath);
                }
            }
        } catch (error) {
            console.error(`Ошибка при обработке директории ${currentPath}:`, error);
        }
    }

    async processFile(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            const fileEntry = this.formatFileEntry(filePath, content);
            await fs.appendFile(this.outputFile, fileEntry);
            if (this.debug) {
                console.log('Обработан файл:', filePath);
            }
            return true;
        } catch (error) {
            console.error(`Ошибка при обработке файла ${filePath}:`, error);
            return false;
        }
    }

    formatFileEntry(filePath, content) {
        const separator = '_'.repeat(80) + '\n';
        const fileHeader = `${filePath}\n`;
        return fileHeader + separator + content + '\n\n';
    }

    shouldIgnore(fullPath, isDirectory) {
        const normalizedPath = path.normalize(fullPath);

        const pathParts = normalizedPath.split(path.sep);

        for (const dir of this.ignoredDirs) {
            if (pathParts.includes(dir)) {
                if (this.debug) {
                    console.log(`Игнорируем путь ${fullPath} (содержит ${dir})`);
                }
                return true;
            }
        }

        if (!isDirectory) {
            const fileName = path.basename(fullPath);

            for (const pattern of this.ignoredFiles) {
                if (fileName === pattern) {
                    if (this.debug) {
                        console.log(`Игнорируем файл ${fileName} (точное совпадение с ${pattern})`);
                    }
                    return true;
                }

                if (pattern.startsWith('.') && fileName.endsWith(pattern)) {
                    if (this.debug) {
                        console.log(`Игнорируем файл ${fileName} (расширение ${pattern})`);
                    }
                    return true;
                }

                if (pattern.startsWith('*') && fileName.endsWith(pattern.slice(1))) {
                    if (this.debug) {
                        console.log(`Игнорируем файл ${fileName} (паттерн ${pattern})`);
                    }
                    return true;
                }
            }
        }

        return false;
    }
}

module.exports = FolderScanner;