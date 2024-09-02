import { IConfig, ITweet } from "../utils/interface";
import { IScraperEngine } from "@scom/scom-scraper";
declare class TwitterManager {
    private parser;
    private auth;
    private _config;
    private _currentAccount;
    private _currentAccountIndex;
    private scraperEngine;
    constructor(scraperEngine: IScraperEngine, config?: IConfig);
    init(): Promise<void>;
    checkIsLogin(): Promise<boolean>;
    exit(): Promise<void>;
    private hasMoreTweets;
    private enterUserName;
    private enterPassword;
    private enterEmailAddress;
    private loginWithCookie;
    private login;
    private logout;
    private redirect;
    private useNextTwitterAccount;
    private scrapTweets;
    getTweetsByUserName(username: string, since?: number, til?: number, maxTweets?: number): Promise<{
        success: boolean;
        message?: string;
        tweets?: ITweet[];
    }>;
}
export { TwitterManager };
