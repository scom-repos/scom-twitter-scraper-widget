"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterManager = void 0;
const parser_1 = __importDefault(require("../utils/parser"));
const scom_scraper_1 = __importDefault(require("@scom/scom-scraper"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class TwitterManager {
    constructor(config) {
        var _a;
        this._currentAccountIndex = -1;
        this.hasMoreTweets = (data) => {
            var _a;
            const instructions = data.data.user.result.timeline_v2.timeline.instructions;
            const timelineAddEntries = instructions.filter(v => v.type === "TimelineAddEntries");
            if (timelineAddEntries.length === 0)
                return false;
            return ((_a = timelineAddEntries[0].entries) === null || _a === void 0 ? void 0 : _a.length) > 2;
        };
        this.parser = new parser_1.default();
        this.scraperManager = new scom_scraper_1.default();
        this._config = config;
        if (((_a = config.twitterAccounts) === null || _a === void 0 ? void 0 : _a.length) > 0) {
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
        const twitterCookiesJsonFilePath = path_1.default.join(__dirname, '../twitter_cookies.json');
        const exist = fs_1.default.existsSync(twitterCookiesJsonFilePath);
        if (exist) {
            const storedCookies = fs_1.default.readFileSync(twitterCookiesJsonFilePath);
            if (storedCookies) {
                const storedCookiesList = JSON.parse(storedCookies.toString());
                await page.setCookie(...storedCookiesList);
            }
        }
        const isLogin = await this.checkIsLogin();
        if (!isLogin) {
            let loginSuccess = await this.login();
            console.log('loginSuccess', loginSuccess);
            while (!loginSuccess) {
                console.log('Trying another account...');
                this.useNextTwitterAccount();
                loginSuccess = await this.login();
            }
            if (loginSuccess) {
                console.log('Writing cookies into local storage...');
                const cookies = await page.cookies();
                fs_1.default.writeFileSync(twitterCookiesJsonFilePath, JSON.stringify(cookies, null, 2));
            }
        }
    }
    async checkIsLogin() {
        await this.redirect('https://x.com/home');
        try {
            await this._page.waitForSelector('[data-testid="SideNav_AccountSwitcher_Button"]', { timeout: 3000 });
        }
        catch (e) {
            return false;
        }
        await this._page.screenshot({ path: 'homepage_screenshot.png' });
        return true;
    }
    async exit() {
        await this.logout();
        await this._browser.close();
    }
    async enterUserName(username) {
        const usernameSelector = '[name="text"]';
        await this._page.waitForSelector(usernameSelector);
        await this._page.type(usernameSelector, username);
        console.log('Entering username');
        await this._page.keyboard.press("Enter");
    }
    async enterPassword(password) {
        const passwordSelector = '[name="password"]';
        await this._page.waitForSelector(passwordSelector);
        await this._page.type(passwordSelector, password);
        console.log('Entering password');
        await this._page.keyboard.press("Enter");
    }
    async enterEmailAddress(emailAddress) {
        const emailAddressSelector = '[data-testid="ocfEnterTextTextInput"]';
        await this._page.waitForSelector(emailAddressSelector);
        await this._page.type(emailAddressSelector, emailAddress);
        console.log('Entering email address');
        await this._page.keyboard.press("Enter");
    }
    async login() {
        return new Promise(async (resolve, reject) => {
            try {
                const timeout = setTimeout(() => {
                    resolve(false);
                }, 30000);
                console.log('Logging in...');
                await this.redirect('https://x.com/i/flow/login');
                this._page.on('response', async (response) => {
                    var _a;
                    if (response.url() !== 'https://api.x.com/1.1/onboarding/task.json')
                        return;
                    if (response.ok() && response.request().method() === 'POST') {
                        console.log(`[${response.request().method()}] ${response.url()} - ${response.ok()}`);
                        try {
                            const data = await response.json();
                            console.log(data);
                            if (((_a = data.subtasks) === null || _a === void 0 ? void 0 : _a.length) > 0) {
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
                                        this._page.removeAllListeners('response');
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
            catch (_a) {
                console.log('Failed to login');
            }
        });
    }
    async logout() {
        const logoutButtonSelector = '[data-testid="confirmationSheetConfirm"]';
        console.log('Logging out...');
        await this._page.goto('https://x.com/logout');
        await this._page.waitForSelector(logoutButtonSelector);
        await this._page.click(logoutButtonSelector);
        await this._page.waitForNavigation();
        console.log('Logged out.');
    }
    async redirect(url) {
        return this._page.goto(url);
    }
    useNextTwitterAccount() {
        const newIndex = ++this._currentAccountIndex;
        this._currentAccount = newIndex >= this._config.twitterAccounts.length ? this._config.twitterAccounts[0] : this._config.twitterAccounts[newIndex];
        return false;
    }
    async scrapTweets(username, since = 0, maxTweets) {
        return new Promise(async (resolve, reject) => {
            let tweets = [];
            let hasMore = true;
            let scrolldownTimer;
            this._page.on('response', async (response) => {
                if (response.url().indexOf('UserTweets') >= 0 && response.request().method() === 'GET') {
                    if (scrolldownTimer) {
                        clearTimeout(scrolldownTimer);
                    }
                    if (!response.ok()) {
                        await this.logout();
                        this.useNextTwitterAccount();
                        await this.login();
                        await this.redirect(`https://x.com/${username}`);
                        await this._page.waitForNavigation();
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
                        hasMore = isTimeValid && (!maxTweets || tweets.length < maxTweets) && this.hasMoreTweets(responseData);
                        if (hasMore) {
                            console.log("Scrolling down");
                            scrolldownTimer = setTimeout(async () => {
                                await this._page.evaluate(() => {
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
                            this._page.removeAllListeners('response');
                            return resolve(tweets);
                        }
                    }
                }
            });
            console.log("Redirecting to target page...");
            await this.redirect(`https://x.com/${username}`);
        });
    }
    async getTweetsByUserName(username, since = 0, maxTweets) {
        let tweets = [];
        try {
            tweets = await this.scrapTweets(username, since, maxTweets);
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
