"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scraperManager_1 = __importDefault(require("./scraperManager"));
class DataSyncManager {
    constructor() {
        this.scraperManager = new scraperManager_1.default();
    }
    async subscribe() {
    }
    async unSubscribe() {
    }
    async syncTweetsToNostrByUserId(userName) {
        const tweets = await this.scraperManager.getTweetsByUserName(userName);
        console.log('tweets', tweets);
    }
}
exports.default = DataSyncManager;
