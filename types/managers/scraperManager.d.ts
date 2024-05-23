interface ICredential {
    username: string;
    password: string;
}
type IConfig = {
    SCRAPER_API_KEY: string;
    TWITTER_USERNAME: string;
    TWITTER_PASSWORD: string;
    TWITTER_EMAIL_ADDRESS: string;
};
declare class ScraperManager {
    private parser;
    private auth;
    private cookie;
    private api;
    private scraperAPIKey;
    private twitterUserName;
    private twitterPassword;
    private twitterEmail;
    constructor(config?: IConfig);
    getProfile(username: string): Promise<any>;
    loginAndGetHeader(username: string, password: string, email?: string, twoFactorSecret?: string): Promise<{
        authorization: string;
        cookie: string;
    }>;
    getUserIdByScreenName(username: string): Promise<string>;
    searchTweets(credentials: ICredential, query: string, maxTweets?: number): Promise<any[]>;
    private fetchSearchTweets;
    getTweetsByUserName2(username: string): Promise<any[]>;
    getTweetsByUserName(username: string, maxTweets?: number): Promise<any[]>;
    fetchTweets(userId: string, maxTweets: number, cursor: string): Promise<{
        tweets: any[];
        next: any;
        previous: any;
    }>;
    getTweetByTweetId(tweetId: string): Promise<any>;
    getFollowersByUserName(credentials: ICredential, username: string, count?: number): Promise<any>;
    getFollowersByUserId(credentials: ICredential, userId: string, count?: number): Promise<any>;
    private fetchProfileFollowers;
    getFollowingByUserName(credentials: ICredential, username: string, count?: number): Promise<any>;
    getFollowingByUserId(credentials: ICredential, userId: string, count?: number): Promise<any>;
    private fetchProfileFollowering;
    private getUserTimeline;
    private getTweetTimeline;
    private getSearchTimeline;
    private installCsrfToken;
}
export { ScraperManager };
