interface IScraperManager {
    getUserIdByUserName: (username: string) => Promise<string>;
    getTweetsByUserName: (username: string) => Promise<string>;
}
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
declare class ScraperManager {
    private parser;
    private auth;
    private cookie;
    private api;
    constructor();
    getProfile(username: string): Promise<void>;
    getUserIdByScreenName(username: string): Promise<string>;
    searchTweets(credentials: ICredential, query: string, maxTweets?: number): Promise<any>;
    private fetchSearchTweets;
    getTweetsByUserName(username: string, maxTweets?: number): Promise<ITweets[]>;
    getTweetByTweetId(tweetId: string): Promise<ITweets>;
    getFollowersByUserName(username: string, credentials: ICredential, count?: number): Promise<any>;
    getFollowersByUserId(credentials: ICredential, userId: string, count?: number): Promise<any>;
    private fetchProfileFollowers;
    getFollowingByUserName(username: string, credentials: ICredential, count?: number): Promise<any>;
    getFollowingByUserId(credentials: ICredential, userId: string, count?: number): Promise<any>;
    private fetchProfileFollowering;
    private getUserTimeline;
    private getTweetTimeline;
    private getSearchTimeline;
}
export default ScraperManager;
export { ITweets, IScraperManager };
