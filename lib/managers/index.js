"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterManager = void 0;
const scraperManager_1 = __importDefault(require("./scraperManager"));
class TwitterManager {
    constructor() {
        this.scraperManager = new scraperManager_1.default();
    }
    async fetchTwitterUserIdByUsername(username) {
        return this.scraperManager.getUserIdByUserName(username);
    }
    async fetchTweetsByUsername(username, maxTweets) {
        return this.scraperManager.getTweetsByUserName(username, maxTweets);
    }
}
exports.TwitterManager = TwitterManager;
