"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperManager = exports.DataSyncManager = void 0;
const dataSyncManager_1 = __importDefault(require("./dataSyncManager"));
exports.DataSyncManager = dataSyncManager_1.default;
const scraperManager_1 = __importDefault(require("./scraperManager"));
exports.ScraperManager = scraperManager_1.default;
