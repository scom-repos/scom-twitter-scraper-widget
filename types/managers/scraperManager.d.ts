import { IConfig, ICredential, ITweet } from "../utils/interface";
declare class TwitterManager {
    private parser;
    private auth;
    private cookie;
    private api;
    private _config;
    private _currentAccount;
    private _currentAccountIndex;
    private scraperManager;
    constructor(config?: IConfig);
    getProfile(username: string): Promise<any>;
    loginAndGetHeader(username: string, password: string, email?: string, twoFactorSecret?: string): Promise<{
        authorization: string;
        cookie: string;
    }>;
    getUserIdByScreenName(username: string): Promise<string>;
    searchTweets(credentials: ICredential, query: string, maxTweets?: number): Promise<any[]>;
    private fetchSearchTweets;
    private hasMoreTweets;
    private enterUserName;
    private enterPassword;
    private enterEmailAddress;
    private login;
    private logout;
    private redirect;
    private useNextTwitterAccount;
    private scrapTweets;
    getTweetsByUserName2(username: string, since?: number, maxTweets?: number): Promise<ITweet[]>;
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
export { TwitterManager };
