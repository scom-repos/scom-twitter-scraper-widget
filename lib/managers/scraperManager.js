"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterManager = void 0;
const parser_1 = __importDefault(require("../utils/parser"));
class TwitterManager {
    constructor(scraperEngine, config) {
        this._currentAccountIndex = -1;
        this.hasMoreTweets = (data) => {
            const instructions = data.data.user.result.timeline_v2.timeline.instructions;
            const timelineAddEntries = instructions.filter(v => v.type === "TimelineAddEntries");
            if (timelineAddEntries.length === 0)
                return false;
            return timelineAddEntries[0].entries?.length > 2;
        };
        this.parser = new parser_1.default();
        this.scraperEngine = scraperEngine;
        this._config = config;
        if (config.twitterAccounts?.length > 0) {
            this._currentAccount = config.twitterAccounts[0];
            this._currentAccountIndex = 0;
        }
    }
    async init() {
        await this.scraperEngine.init();
    }
    async checkIsLogin() {
        await this.redirect('https://x.com/home');
        try {
            await this.scraperEngine.waitForSelector('[data-testid="SideNav_AccountSwitcher_Button"]', 15000);
        }
        catch (e) {
            return false;
        }
        return true;
    }
    async exit() {
        await this.scraperEngine.destroy();
    }
    async enterUserName(username) {
        const usernameSelector = '[name="text"]';
        await this.scraperEngine.waitForSelector(usernameSelector);
        await this.scraperEngine.type(usernameSelector, username);
        console.log('Entering username');
        await this.scraperEngine.keyboard.press("Enter");
    }
    async enterPassword(password) {
        const passwordSelector = '[name="password"]';
        await this.scraperEngine.waitForSelector(passwordSelector);
        await this.scraperEngine.type(passwordSelector, password);
        console.log('Entering password');
        await this.scraperEngine.keyboard.press("Enter");
    }
    async enterEmailAddress(emailAddress) {
        const emailAddressSelector = '[data-testid="ocfEnterTextTextInput"]';
        await this.scraperEngine.waitForSelector(emailAddressSelector);
        await this.scraperEngine.type(emailAddressSelector, emailAddress);
        console.log('Entering email address');
        await this.scraperEngine.keyboard.press("Enter");
    }
    async loginWithCookie() {
        const fs = require('fs');
        const path = require('path');
        const TWITTER_COOKIES_JSON_FILE_PATH = path.join(process.cwd(), 'data', 'twitter_cookies.json');
        const exist = fs.existsSync(TWITTER_COOKIES_JSON_FILE_PATH);
        if (exist) {
            const storedCookies = fs.readFileSync(TWITTER_COOKIES_JSON_FILE_PATH);
            if (storedCookies) {
                const storedCookiesList = JSON.parse(storedCookies.toString());
                await this.scraperEngine.setCookie(...storedCookiesList);
            }
        }
        const isLogin = await this.checkIsLogin();
        if (!isLogin) {
            let loginSuccess = await this.login();
            while (!loginSuccess) {
                console.log('Trying another account...');
                this.useNextTwitterAccount();
                loginSuccess = await this.login();
            }
            if (loginSuccess) {
                console.log('Writing cookies into local storage...');
                const cookies = await this.scraperEngine.getCookies();
                fs.writeFileSync(TWITTER_COOKIES_JSON_FILE_PATH, JSON.stringify(cookies, null, 2));
            }
        }
    }
    async login() {
        return new Promise(async (resolve, reject) => {
            try {
                const timeout = setTimeout(() => {
                    resolve(false);
                }, 30000);
                console.log('Logging in...');
                await this.redirect('https://x.com/i/flow/login');
                this.scraperEngine.on('response', async (response) => {
                    if (response.url() !== 'https://api.x.com/1.1/onboarding/task.json')
                        return;
                    if (response.ok() && response.request().method() === 'POST') {
                        console.log(`[${response.request().method()}] ${response.url()} - ${response.ok()}`);
                        try {
                            const data = await response.json();
                            if (data.subtasks?.length > 0) {
                                switch (data.subtasks[0].subtask_id) {
                                    case "LoginEnterUserIdentifierSSO":
                                        await this.enterUserName(this._currentAccount.username);
                                        break;
                                    case "LoginEnterPassword":
                                        await this.enterPassword(this._currentAccount.password);
                                        break;
                                    case "LoginEnterAlternateIdentifierSubtask":
                                    case "LoginAcid": {
                                        await this.enterEmailAddress(this._currentAccount.emailAddress);
                                        break;
                                    }
                                    case "LoginSuccessSubtask": {
                                        clearTimeout(timeout);
                                        this.scraperEngine.removeAllListeners('response');
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
            }
        });
    }
    async logout() {
        const logoutButtonSelector = '[data-testid="confirmationSheetConfirm"]';
        console.log('Logging out...');
        await this.scraperEngine.goto('https://x.com/logout');
        await this.scraperEngine.waitForSelector(logoutButtonSelector);
        await this.scraperEngine.click(logoutButtonSelector);
        await this.scraperEngine.waitForNavigation();
        console.log('Logged out.');
    }
    async redirect(url) {
        return this.scraperEngine.goto(url);
    }
    useNextTwitterAccount() {
        const newIndex = ++this._currentAccountIndex;
        this._currentAccount = newIndex >= this._config.twitterAccounts.length ? this._config.twitterAccounts[0] : this._config.twitterAccounts[newIndex];
        return false;
    }
    async scrapTweets(username, since = 0, til, maxTweets) {
        return new Promise(async (resolve, reject) => {
            console.log('username', username);
            console.log('since', since);
            console.log('til', til);
            console.log('maxTweets', maxTweets);
            if (!username) {
                return resolve({
                    success: false,
                    message: "Username is empty."
                });
            }
            if (since && til && since > til) {
                return resolve({
                    success: false,
                    message: "Start date should be less or equal than end date."
                });
            }
            await this.loginWithCookie();
            let tweets = [];
            let hasMore = true;
            let scrolldownTimer;
            this.scraperEngine.on('response', async (response) => {
                if (response.url().indexOf('UserByScreenName') >= 0 && response.request().method() === 'GET') {
                    console.log(response.url());
                    if (!response.ok()) {
                        console.log('Failed to get screenname', await response.text());
                    }
                    const userInfo = await response.json();
                    if (userInfo.data.user === undefined) {
                        this.scraperEngine.removeAllListeners('response');
                        this.exit();
                        return resolve({
                            success: false,
                            message: 'User does not exist.'
                        });
                    }
                }
                if (response.url().indexOf('UserTweets') >= 0 && response.request().method() === 'GET') {
                    if (scrolldownTimer) {
                        clearTimeout(scrolldownTimer);
                    }
                    if (!response.ok()) {
                        await this.logout();
                        this.useNextTwitterAccount();
                        await this.login();
                        await this.redirect(`https://x.com/${username}`);
                        await this.scraperEngine.waitForNavigation(30000);
                    }
                    else {
                        const responseData = await response.json();
                        const content = this.parser.parseTimelineTweetsV2(responseData);
                        tweets = [...tweets, ...content.tweets];
                        let isTimeValid = true;
                        if (since && til && tweets.length) {
                            const oldestTweet = tweets.sort((a, b) => b.timestamp - a.timestamp)[0];
                            isTimeValid = (oldestTweet.timestamp * 1000) > since;
                        }
                        hasMore = isTimeValid && (!maxTweets || tweets.length < maxTweets) && this.hasMoreTweets(responseData);
                        if (hasMore) {
                            console.log("Scrolling down");
                            scrolldownTimer = setTimeout(async () => {
                                await this.scraperEngine.scrollToBottom();
                            }, 2000);
                        }
                        else {
                            if (maxTweets) {
                                tweets = tweets.slice(0, maxTweets);
                            }
                            if (since && til) {
                                tweets = tweets.filter(v => (v.timestamp * 1000) >= since && (v.timestamp * 1000) <= til);
                            }
                            console.log('Tweets scraped. Total scraped: ', tweets.length);
                            this.scraperEngine.removeAllListeners('response');
                            this.exit();
                            return resolve({
                                success: true,
                                tweets
                            });
                        }
                    }
                }
            });
            console.log("Redirecting to target page...");
            await this.redirect(`https://x.com/${username}`);
        });
    }
    async getTweetsByUserName(username, since = 0, til, maxTweets) {
        let tweets = [];
        try {
            const result = await this.scrapTweets(username, since, til, maxTweets);
            return result;
        }
        catch (e) {
            console.log(e);
            return {
                success: false,
                message: e.message
            };
        }
        finally {
        }
    }
}
exports.TwitterManager = TwitterManager;
