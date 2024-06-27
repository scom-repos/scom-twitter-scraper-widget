"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterManager = void 0;
const auth_1 = __importDefault(require("../utils/auth"));
const cookie_1 = __importDefault(require("../utils/cookie"));
const parser_1 = __importDefault(require("../utils/parser"));
const API_1 = __importDefault(require("../utils/API"));
const scom_scraper_1 = __importDefault(require("@scom/scom-scraper"));
class TwitterManager {
    constructor(config) {
        this._currentAccountIndex = -1;
        this.hasMoreTweets = (data) => {
            const instructions = data.data.user.result.timeline_v2.timeline.instructions;
            const timelineAddEntries = instructions.filter(v => v.type === "TimelineAddEntries");
            if (timelineAddEntries.length === 0)
                return false;
            return timelineAddEntries[0].entries?.length > 2;
        };
        this.parser = new parser_1.default();
        this.cookie = new cookie_1.default();
        this.auth = new auth_1.default(this.cookie);
        this.api = new API_1.default(this.auth, this.cookie);
        this.scraperManager = new scom_scraper_1.default();
        this._config = config;
        if (config.twitterAccounts?.length > 0) {
            this._currentAccount = config.twitterAccounts[0];
            this._currentAccountIndex = 0;
        }
    }
    async init() {
        const scraper = await this.scraperManager.getBrowserAndPage();
        if (!scraper) {
            throw new Error('cannot open browser and page');
        }
        const { browser, page } = scraper;
        this._browser = browser;
        this._page = page;
        let loginSuccess = await this.login(page);
        console.log('loginSuccess', loginSuccess);
        while (!loginSuccess) {
            console.log('Trying another account...');
            this.useNextTwitterAccount();
            loginSuccess = await this.login(page);
        }
    }
    async exit() {
        await this.logout(this._page);
        await this._browser.close();
    }
    async enterUserName(page, username) {
        const usernameSelector = '[name="text"]';
        await page.waitForSelector(usernameSelector);
        await page.type(usernameSelector, username);
        console.log('Entering username');
        await page.keyboard.press("Enter");
    }
    async enterPassword(page, password) {
        const passwordSelector = '[name="password"]';
        await page.waitForSelector(passwordSelector);
        await page.type(passwordSelector, password);
        console.log('Entering password');
        await page.keyboard.press("Enter");
    }
    async enterEmailAddress(page, emailAddress) {
        const emailAddressSelector = '[data-testid="ocfEnterTextTextInput"]';
        await page.waitForSelector(emailAddressSelector);
        await page.type(emailAddressSelector, emailAddress);
        console.log('Entering email address');
        await page.keyboard.press("Enter");
    }
    async login(page) {
        return new Promise(async (resolve, reject) => {
            try {
                const timeout = setTimeout(() => {
                    resolve(false);
                }, 30000);
                console.log('Logging in...');
                await this.redirect(page, 'https://x.com/i/flow/login');
                page.on('response', async (response) => {
                    if (response.url() !== 'https://api.x.com/1.1/onboarding/task.json')
                        return;
                    if (response.ok() && response.request().method() === 'POST') {
                        console.log(`[${response.request().method()}] ${response.url()} - ${response.ok()}`);
                        try {
                            const data = await response.json();
                            console.log(data);
                            if (data.subtasks?.length > 0) {
                                switch (data.subtasks[0].subtask_id) {
                                    case "LoginEnterUserIdentifierSSO":
                                        await this.enterUserName(page, this._currentAccount.username);
                                        break;
                                    case "LoginEnterPassword":
                                        await this.enterPassword(page, this._currentAccount.password);
                                        break;
                                    case "LoginEnterAlternateIdentifierSubtask":
                                    case "LoginAcid": {
                                        await this.enterEmailAddress(page, this._currentAccount.emailAddress);
                                        break;
                                    }
                                    case "LoginSuccessSubtask": {
                                        clearTimeout(timeout);
                                        page.removeAllListeners('response');
                                        resolve(true);
                                        break;
                                    }
                                }
                            }
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                });
            }
            catch {
                console.log('Failed to login');
                await page.screenshot({ path: 'bug_screenshot.png' });
            }
        });
    }
    async logout(page) {
        const logoutButtonSelector = '[data-testid="confirmationSheetConfirm"]';
        console.log('Logging out...');
        await page.goto('https://x.com/logout');
        await page.waitForSelector(logoutButtonSelector);
        await page.click(logoutButtonSelector);
        await page.waitForNavigation();
        console.log('Logged out.');
    }
    async redirect(page, url) {
        return page.goto(url);
    }
    useNextTwitterAccount() {
        const newIndex = ++this._currentAccountIndex;
        this._currentAccount = newIndex >= this._config.twitterAccounts.length ? this._config.twitterAccounts[0] : this._config.twitterAccounts[newIndex];
        return false;
    }
    async scrapTweets(browser, page, username, since = 0, maxTweets) {
        return new Promise(async (resolve, reject) => {
            let tweets = [];
            console.log("Redirecting to target page...");
            await this.redirect(page, `https://x.com/${username}`);
            let hasMore = true;
            let scrolldownTimer;
            page.on('response', async (response) => {
                if (response.url().indexOf('UserTweets') >= 0 && response.request().method() === 'GET') {
                    if (scrolldownTimer) {
                        clearTimeout(scrolldownTimer);
                    }
                    if (!response.ok()) {
                        await this.logout(page);
                        this.useNextTwitterAccount();
                        await this.login(page);
                        await this.redirect(page, `https://x.com/${username}`);
                        await page.waitForNavigation();
                    }
                    else {
                        const responseData = await response.json();
                        const content = this.parser.parseTimelineTweetsV2(responseData);
                        tweets = [...tweets, ...content.tweets];
                        let isTimeValid = true;
                        if (since && tweets.length) {
                            const oldestTweet = tweets.sort((a, b) => b.timestamp - a.timestamp)[0];
                            isTimeValid = (oldestTweet.timestamp * 1000) > since;
                        }
                        await page.screenshot({ path: 'on_response_screenshot.png' });
                        hasMore = isTimeValid && (!maxTweets || tweets.length < maxTweets) && this.hasMoreTweets(responseData);
                        if (hasMore) {
                            console.log("Scrolling down");
                            scrolldownTimer = setTimeout(async () => {
                                await page.evaluate(() => {
                                    window.scrollTo(0, document.body.scrollHeight);
                                });
                            }, 2000);
                        }
                        else {
                            if (maxTweets) {
                                tweets = tweets.slice(0, maxTweets);
                            }
                            if (since) {
                                tweets = tweets.filter(v => (v.timestamp * 1000) >= since);
                            }
                            console.log('Tweets scraped. Total scraped: ', tweets.length);
                            if (tweets.length === 0) {
                                await page.screenshot({ path: '0_tweets_screenshot.png' });
                                console.log('responseData', responseData.data.user.result.timeline_v2.timeline.instructions);
                            }
                            page.removeAllListeners('response');
                            return resolve(tweets);
                        }
                    }
                }
            });
        });
    }
    async getTweetsByUserName(username, since = 0, maxTweets) {
        let tweets = [];
        try {
            tweets = await this.scrapTweets(this._browser, this._page, username, since, maxTweets);
        }
        catch (e) {
            console.log(e);
        }
        finally {
        }
        return tweets;
    }
}
exports.TwitterManager = TwitterManager;
