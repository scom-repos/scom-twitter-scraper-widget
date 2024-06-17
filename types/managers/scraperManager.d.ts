import ScraperManager, { IScraperConfig } from "@scom/scom-scraper";
interface ITweets {
    conversationId: string;
    id: string;
    hashtags: any[];
    likes: number;
    mentions: any[];
    name: string;
    permanentUrl: string;
    photos: any[];
    replies: number;
    retweets: number;
    text: string;
    thread: any[];
    urls: [];
    userId: string;
    username: string;
    videos: any[];
    isQuoted: boolean;
    isReply: boolean;
    isRetweet: boolean;
    isPin: boolean;
    sensitiveContent: boolean;
    timeParsed: Date;
    timestamp: number;
    html: string;
    views: number;
}
interface ICredential {
    username: string;
    password: string;
}
declare class TwitterManager {
    private parser;
    private auth;
    private cookie;
    private api;
    private twitterUserName;
    private twitterPassword;
    private twitterEmail;
    private scraperManager;
    constructor(config?: IScraperConfig);
    getProfile(username: string): Promise<any>;
    loginAndGetHeader(username: string, password: string, email?: string, twoFactorSecret?: string): Promise<{
        authorization: string;
        cookie: string;
    }>;
    getUserIdByScreenName(username: string): Promise<string>;
    searchTweets(credentials: ICredential, query: string, maxTweets?: number): Promise<any[]>;
    private fetchSearchTweets;
    getTweetsByUserName2(username: string, pages?: number): Promise<ITweets[]>;
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
export { TwitterManager, ScraperManager };
