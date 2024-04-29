import { ITweets } from "./scraperManager";
declare class TwitterManager {
    private scraperManager;
    constructor();
    fetchTwitterUserIdByUsername(username: string): Promise<string>;
    fetchTweetsByUsername(username: string, maxTweets?: number): Promise<ITweets[]>;
}
export { TwitterManager };
