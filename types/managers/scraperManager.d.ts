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
    getTweetsByUserName(username: string, maxTweets?: number): Promise<any[]>;
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
}
export { ScraperManager };
