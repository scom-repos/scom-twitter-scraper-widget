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
const TWITTER_COOKIES_JSON_FILE_PATH = path_1.default.join(process.cwd(), 'data', 'twitter_cookies.json');
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
    }
    async checkIsLogin(page) {
        await this.redirect(page, 'https://x.com/home');
        try {
            await page.waitForSelector('[data-testid="SideNav_AccountSwitcher_Button"]', { timeout: 15000 });
        }
        catch (e) {
            return false;
        }
        await page.screenshot({ path: 'homepage_screenshot.png' });
        return true;
    }
    async exit(browser, page) {
        await browser.close();
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
    async loginWithCookie(page) {
        const exist = fs_1.default.existsSync(TWITTER_COOKIES_JSON_FILE_PATH);
        if (exist) {
            const storedCookies = fs_1.default.readFileSync(TWITTER_COOKIES_JSON_FILE_PATH);
            if (storedCookies) {
                const storedCookiesList = JSON.parse(storedCookies.toString());
                await page.setCookie(...storedCookiesList);
            }
        }
        const isLogin = await this.checkIsLogin(page);
        if (!isLogin) {
            let loginSuccess = await this.login(page);
            while (!loginSuccess) {
                console.log('Trying another account...');
                this.useNextTwitterAccount();
                loginSuccess = await this.login(page);
            }
            if (loginSuccess) {
                console.log('Writing cookies into local storage...');
                const cookies = await page.cookies();
                fs_1.default.writeFileSync(TWITTER_COOKIES_JSON_FILE_PATH, JSON.stringify(cookies, null, 2));
            }
        }
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
                    var _a;
                    if (response.url() !== 'https://api.x.com/1.1/onboarding/task.json')
                        return;
                    if (response.ok() && response.request().method() === 'POST') {
                        console.log(`[${response.request().method()}] ${response.url()} - ${response.ok()}`);
                        try {
                            const data = await response.json();
                            if (((_a = data.subtasks) === null || _a === void 0 ? void 0 : _a.length) > 0) {
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
            catch (_a) {
                console.log('Failed to login');
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
    async scrapTweets(username, since = 0, til, maxTweets) {
        return new Promise(async (resolve, reject) => {
            console.log('username', username);
            console.log('since', since);
            console.log('til', til);
            console.log('maxTweets', maxTweets);
            const { browser, page } = await this.scraperManager.getBrowserAndPage();
            await this.loginWithCookie(page);
            let tweets = [];
            let hasMore = true;
            let scrolldownTimer;
            page.on('response', async (response) => {
                if (response.url().indexOf('UserByScreenName') >= 0 && response.request().method() === 'GET') {
                    console.log(response.url());
                    if (!response.ok()) {
                        console.log('Failed to get screenname', await response.text());
                    }
                    const userInfo = await response.json();
                    if (userInfo.data.user === undefined) {
                        page.removeAllListeners('response');
                        this.exit(browser, page);
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
                        await this.logout(page);
                        this.useNextTwitterAccount();
                        await this.login(page);
                        await this.redirect(page, `https://x.com/${username}`);
                        await page.waitForNavigation({ timeout: 30000 });
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
                                await page.evaluate(() => {
                                    window.scrollTo(0, document.body.scrollHeight);
                                });
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
                            page.removeAllListeners('response');
                            this.exit(browser, page);
                            return resolve({
                                success: true,
                                tweets
                            });
                        }
                    }
                }
            });
            console.log("Redirecting to target page...");
            await this.redirect(page, `https://x.com/${username}`);
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
