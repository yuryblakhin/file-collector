const fs = require('fs').promises;
const path = require('path');

class ConfigManager {
    constructor() {
        this.configPath = path.resolve('.scanner-config.json');
        this.defaultConfig = {
            outputFile: 'output.txt',
            ignoredDirs: [
                'node_modules',
                '.git',
                'dist',
                'build',
                '.idea',
                'coverage',
                '.next',
                '.vscode'
            ],
            ignoredFiles: [
                '.DS_Store',
                '.env',
                '*.log',
                '.gitignore',
                '*.map',
                '*.min.js',
                '*.min.css',
                'package-lock.json',
                'yarn.lock'
            ],
            lastDirectory: './'
        };
        this.config = { ...this.defaultConfig };
    }

    async load() {
        try {
            try {
                const content = await fs.readFile(this.configPath, 'utf8');
                console.log('Используется локальный конфиг:', this.configPath);
                this.config = { ...this.defaultConfig, ...JSON.parse(content) };
                return this.config;
            } catch (localError) {
                console.log('Локальный конфиг не найден, создаем новый');
                await this.save();
            }
        } catch (error) {
            console.error('Ошибка при работе с конфигом:', error);
            await this.save();
        }
        return this.config;
    }

    async save() {
        try {
            await fs.writeFile(
                this.configPath,
                JSON.stringify(this.config, null, 2)
            );
            console.log('Конфиг сохранен в:', this.configPath);
            return true;
        } catch (error) {
            console.error('Ошибка сохранения конфигурации:', error);
            return false;
        }
    }

    async update(newConfig) {
        this.config = { ...this.config, ...newConfig };
        await this.save();
    }

    async createDefault() {
        this.config = { ...this.defaultConfig };
        await this.save();
        return this.config;
    }
}

module.exports = ConfigManager;