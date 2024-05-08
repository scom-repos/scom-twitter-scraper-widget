import ScraperManager from "./scraperManager";

export default class DataSyncManager {

    private scraperManager: ScraperManager;
    constructor() {
        this.scraperManager = new ScraperManager();
    }

    async subscribe() {

    }

    async unSubscribe() {

    }

    async syncTweetsToNostrByUserId(userName: string) {
        const tweets = await this.scraperManager.getTweetsByUserName(userName);
        console.log('tweets', tweets);
    }
}
