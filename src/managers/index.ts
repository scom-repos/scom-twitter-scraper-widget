import ScraperManager, {IScraperManager, ITweets} from "./scraperManager";

class TwitterManager {

    private scraperManager: ScraperManager;

    constructor() {
        this.scraperManager = new ScraperManager();
    }

    async fetchTwitterUserIdByUsername(username: string) {
        return this.scraperManager.getUserIdByUserName(username);
    }

    async fetchTweetsByUsername(username: string, maxTweets?: number) {
        return this.scraperManager.getTweetsByUserName(username, maxTweets);
    }
}

export {
    TwitterManager
}
