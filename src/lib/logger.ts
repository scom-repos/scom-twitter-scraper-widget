enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR"
}
class Logger {
    private level;
    name;
    constructor(name: string, level: LogLevel = LogLevel.INFO) {
        this.name = name;
        this.level = level;
    }
    debug(...args: any[]): void {
        if (this.level <= LogLevel.DEBUG) {
            console.log(...args);
        }
    }
    info(...args: any[]): void {
        if (this.level <= LogLevel.INFO) {
            console.info(...args);
        }
    }
    warn(...args: any[]): void {
        if (this.level <= LogLevel.WARN) {
            console.warn(...args);
        }
    }
    error(...args: any[]): void {
        if (this.level <= LogLevel.ERROR) {
            console.error(...args);
        }
    }
    setLevel(level: string): void {
        if(level.toUpperCase() === 'DEBUG') {
            this.level = LogLevel.DEBUG;
        }
        if(level.toUpperCase() === 'INFO') {
            this.level = LogLevel.INFO;
        }
        if(level.toUpperCase() === 'WARN') {
            this.level = LogLevel.WARN;
        }
        if(level.toUpperCase() === 'ERROR') {
            this.level = LogLevel.ERROR;
        }
        else {
            console.error(`Invalid log level: ${level}`);
        }
    }
}
const log = new Logger('scrapfly');
export default Logger;
export {log};
