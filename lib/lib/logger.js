"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
})(LogLevel || (LogLevel = {}));
var Logger = /** @class */ (function () {
    function Logger(name, level) {
        if (level === void 0) { level = LogLevel.INFO; }
        this.name = name;
        this.level = level;
    }
    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.level <= LogLevel.DEBUG) {
            console.log.apply(console, args);
        }
    };
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.level <= LogLevel.INFO) {
            console.info.apply(console, args);
        }
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.level <= LogLevel.WARN) {
            console.warn.apply(console, args);
        }
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.level <= LogLevel.ERROR) {
            console.error.apply(console, args);
        }
    };
    Logger.prototype.setLevel = function (level) {
        if (level.toUpperCase() === 'DEBUG') {
            this.level = LogLevel.DEBUG;
        }
        if (level.toUpperCase() === 'INFO') {
            this.level = LogLevel.INFO;
        }
        if (level.toUpperCase() === 'WARN') {
            this.level = LogLevel.WARN;
        }
        if (level.toUpperCase() === 'ERROR') {
            this.level = LogLevel.ERROR;
        }
        else {
            console.error("Invalid log level: ".concat(level));
        }
    };
    return Logger;
}());
var log = new Logger('scrapfly');
exports.log = log;
exports.default = Logger;
