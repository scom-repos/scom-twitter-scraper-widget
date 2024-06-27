import { IConfig, ITweet } from "../utils/interface";
declare class TwitterManager {
    private parser;
    private auth;
    private cookie;
    private api;
    private _config;
    private _currentAccount;
    private _currentAccountIndex;
    private scraperManager;
    private _browser;
    private _page;
    constructor(config?: IConfig);
    init(): Promise<void>;
    exit(): Promise<void>;
    private hasMoreTweets;
    private enterUserName;
    private enterPassword;
    private enterEmailAddress;
    private login;
    private logout;
    private redirect;
    private useNextTwitterAccount;
    private scrapTweets;
    getTweetsByUserName(username: string, since?: number, maxTweets?: number): Promise<ITweet[]>;
}
export { TwitterManager };
