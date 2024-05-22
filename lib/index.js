"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.ScraperManager = void 0;
const managers_1 = require("./managers");
Object.defineProperty(exports, "ScraperManager", { enumerable: true, get: function () { return managers_1.ScraperManager; } });
const parser_1 = __importDefault(require("./utils/parser"));
exports.Parser = parser_1.default;
