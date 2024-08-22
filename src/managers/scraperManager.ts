import Auth from "../utils/auth";
import Parser from "../utils/parser";
import { IAccount, IConfig, ICredential, ITweet } from "../utils/interface";
import ScraperManager from "@scom/scom-scraper";
import fs from "fs";
import path from "path";
import { sleep } from "../utils";
// import path from "path";
// import { sleep } from "../utils";
// import {
//     BEARER_TOKEN,
//     GET_FOLLOWERS_BY_USER_ID,
//     GET_FOLLOWING_BY_USER_ID,
//     GET_TWEET_BY_ID,
//     GET_TWEETS_BY_USER_ID,
//     GET_USER_BY_SCREENAME, SEARCH_TIMELINE
// } from "../const";
// import Cookie from "../utils/cookie";
// import API from "../utils/API";

const TWITTER_COOKIES_JSON_FILE_PATH = path.join(process.cwd(), 'data', 'twitter_cookies.json');

class TwitterManager {
    private parser: Parser;
    private auth: Auth;
    // private cookie: Cookie;
    // private api: API;
    private _config: IConfig;
    private _currentAccount: IAccount;
    private _currentAccountIndex: number = -1;
    private scraperManager: ScraperManager;
    constructor(config?: IConfig) {
        this.parser = new Parser();
        // this.cookie = new Cookie();
        // this.auth = new Auth(this.cookie);
        // this.api = new API(this.auth, this.cookie);
        this.scraperManager = new ScraperManager();
        this._config = config;
        if (config.twitterAccounts?.length > 0) {
            this._currentAccount = config.twitterAccounts[0];
            this._currentAccountIndex = 0;
        }
    }

    async init() {
        // const scraper = await this.scraperManager.getBrowserAndPage();
        // if (!scraper) {
        //     throw new Error('cannot open browser and page');
        // }
        await this.scraperManager.init();
    }

    async checkIsLogin() {
        await this.redirect('https://x.com/home');
        try {
            await this.scraperManager.waitForSelector('[data-testid="SideNav_AccountSwitcher_Button"]', 15000);
        }
        catch (e) {
            return false;
        }
        return true;
    }

    async exit() {
        await this.scraperManager.destroy();
        // await this.logout(page);
        // await browser.close();
    }

    private hasMoreTweets = (data: any) => {
        const instructions = data.data.user.result.timeline_v2.timeline.instructions;
        const timelineAddEntries = instructions.filter(v => v.type === "TimelineAddEntries");
        if (timelineAddEntries.length === 0) return false;
        return timelineAddEntries[0].entries?.length > 2;
    }

    private async enterUserName(username: string) {
        const usernameSelector = '[name="text"]';
        // const usernameInput = await page.$(usernameSelector);
        // await usernameInput.type(username);
        await this.scraperManager.waitForSelector(usernameSelector);
        await this.scraperManager.type(usernameSelector, username);
        console.log('Entering username');
        await this.scraperManager.keyboard.press("Enter");
    }

    private async enterPassword(password: string) {
        const passwordSelector = '[name="password"]';
        // const passwordInput = await page.$(passwordSelector);
        // await passwordInput.type(password);
        await this.scraperManager.waitForSelector(passwordSelector);
        await this.scraperManager.type(passwordSelector, password);
        console.log('Entering password');
        await this.scraperManager.keyboard.press("Enter");
    }

    private async enterEmailAddress(emailAddress: string) {
        const emailAddressSelector = '[data-testid="ocfEnterTextTextInput"]';
        // const emailAddressInput = await page.$(emailAddressSelector);
        // await emailAddressInput.type(emailAddress);
        await this.scraperManager.waitForSelector(emailAddressSelector);
        await this.scraperManager.type(emailAddressSelector, emailAddress);
        console.log('Entering email address');
        await this.scraperManager.keyboard.press("Enter");
    }

    private async loginWithCookie() {
        const exist = fs.existsSync(TWITTER_COOKIES_JSON_FILE_PATH);
        if (exist) {
            const storedCookies = fs.readFileSync(TWITTER_COOKIES_JSON_FILE_PATH);
            if (storedCookies) {
                const storedCookiesList = JSON.parse(storedCookies.toString());
                await this.scraperManager.setCookie(...storedCookiesList);
            }
        }
        const isLogin = await this.checkIsLogin();
        if (!isLogin) {
            let loginSuccess = await this.login();
            while (!loginSuccess) {
                console.log('Trying another account...')
                this.useNextTwitterAccount();
                loginSuccess = await this.login();
            }
            if (loginSuccess) {
                console.log('Writing cookies into local storage...');
                const cookies = await this.scraperManager.getCookies();
                fs.writeFileSync(TWITTER_COOKIES_JSON_FILE_PATH, JSON.stringify(cookies, null, 2));
            }
        }
    }

    private async login(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                const timeout = setTimeout(() => {
                    resolve(false);
                }, 30000)
                console.log('Logging in...');
                await this.redirect('https://x.com/i/flow/login');
                this.scraperManager.on('response', async (response) => {
                    if (response.url() !== 'https://api.x.com/1.1/onboarding/task.json') return;
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
                                        this.scraperManager.removeAllListeners('response');
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
                })
                // const response = await page.waitForResponse("https://api.x.com/1.1/onboarding/task.json");
                // if (response.ok && response.request().method() === 'POST') {
                //     const data = await response.json();
                //     if (data.subtasks?.length > 0) {
                //         switch (data.subtasks[0].subtask_id) {
                //             case "LoginEnterUserIdentifierSSO":
                //                 await this.enterUserName(page, this._currentAccount.username);
                //                 break;
                //             case "LoginEnterPassword":
                //                 await this.enterPassword(page, this._currentAccount.password);
                //                 break;
                //             case "LoginEnterAlternateIdentifierSubtask":
                //             case "LoginAcid": {
                //                 await this.enterEmailAddress(page, this._currentAccount.emailAddress);
                //                 break;
                //             }
                //             case "LoginSuccessSubtask": {
                //                 return;
                //             }
                //         }
                //     }
                // }
            } catch {
                console.log('Failed to login');
            }
        })

    }

    private async logout() {
        const logoutButtonSelector = '[data-testid="confirmationSheetConfirm"]';
        console.log('Logging out...');
        await this.scraperManager.goto('https://x.com/logout');
        // const logoutButton = await page.$(logoutButtonSelector);
        // await logoutButton.click();
        await this.scraperManager.waitForSelector(logoutButtonSelector);
        await this.scraperManager.click(logoutButtonSelector);
        await this.scraperManager.waitForNavigation();
        console.log('Logged out.');
    }

    private async redirect(url: string) {
        return this.scraperManager.goto(url);
    }

    private useNextTwitterAccount(): boolean {
        const newIndex = ++this._currentAccountIndex;
        this._currentAccount = newIndex >= this._config.twitterAccounts.length ? this._config.twitterAccounts[0] : this._config.twitterAccounts[newIndex];
        return false;
        // if (newIndex >= this._config.twitterAccounts.length) {
        //     this._cur
        // }
        // this._currentAccount = this._config.twitterAccounts[newIndex];
        // return false;
    }

    private async scrapTweets(username: string, since: number = 0, til?: number, maxTweets?: number): Promise<{ success: boolean; message?: string; tweets?: ITweet[] }> {
        return new Promise(async (resolve, reject) => {
            console.log('username', username);
            console.log('since', since);
            console.log('til', til);
            console.log('maxTweets', maxTweets);
            if(!username) {
                return resolve({
                    success: false,
                    message: "Username is empty."
                });
            }
            if(since && til && since > til) {
                return resolve({
                    success: false,
                    message: "Start date should be less or equal than end date."
                })
            }
            
            const { browser, page } = await this.scraperManager.getBrowserAndPage();
            await this.loginWithCookie();
            let tweets: ITweet[] = [];
            // console.log('scrapTweets', this._currentAccount);
            // console.log("Logging in...");
            // await this.login(page);
            // try {
            //     await page.waitForNavigation();
            // } catch {
            //     const accountDepleted = this.useNextTwitterAccount();
            //     if (accountDepleted) {
            //         console.log('Account depleted.');
            //         return [];
            //     }
            //     return await this.scrapTweets(browser, page, username, since, maxTweets);
            // }
            // let response = null;
            let hasMore = true;
            let scrolldownTimer;
            this.scraperManager.on('response', async (response) => {
                if (response.url().indexOf('UserByScreenName') >= 0 && response.request().method() === 'GET') {
                    console.log(response.url());
                    if (!response.ok()) {
                        console.log('Failed to get screenname', await response.text());
                    }
                    const userInfo = await response.json();
                    if (userInfo.data.user === undefined) {
                        this.scraperManager.removeAllListeners('response');
                        this.exit();
                        return resolve({
                            success: false,
                            message: 'User does not exist.'
                        })
                    }
                }
                if (response.url().indexOf('UserTweets') >= 0 && response.request().method() === 'GET') {
                    if (scrolldownTimer) {
                        clearTimeout(scrolldownTimer)
                    }
                    if (!response.ok()) {
                        await this.logout();
                        this.useNextTwitterAccount();
                        await this.login();
                        await this.redirect(`https://x.com/${username}`);
                        await this.scraperManager.waitForNavigation(30000);
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
                                await this.scraperManager.scrollToBottom();
                            }, 2000)
                        }
                        else {
                            if (maxTweets) {
                                tweets = tweets.slice(0, maxTweets);
                            }
                            if (since && til) {
                                tweets = tweets.filter(v => (v.timestamp * 1000) >= since && (v.timestamp * 1000) <= til);
                            }
                            console.log('Tweets scraped. Total scraped: ', tweets.length)
                            this.scraperManager.removeAllListeners('response');
                            this.exit();
                            return resolve({
                                success: true,
                                tweets
                            });
                        }
                    }
                }
            })

            console.log("Redirecting to target page...");
            await this.redirect(`https://x.com/${username}`);
            // do {
            //     try {
            //         try {
            //             response = await page.waitForResponse(res => res.url().indexOf('UserTweets') >= 0 && res.request().method() === 'GET');
            //         }
            //         catch (e) {
            //             if (tweets.length > 0)
            //                 return tweets;
            //         }
            //         await page.screenshot({path: 'response_screenshot.png'});
            //         if (!response.ok()) {
            //             console.log('Failed', await response.text());
            //             await this.logout(page);
            //             this.useNextTwitterAccount();
            //             console.log('switchig account...', this._currentAccount)
            //             await this.login(page);
            //             const tweets = await this.scrapTweets(browser, page, username, since, maxTweets);
            //             return resolve(tweets);
            //         }
            //         const responseData = await response.json();
            //         const content = this.parser.parseTimelineTweetsV2(responseData);
            //         tweets = [...tweets, ...content.tweets];
            //         let isTimeValid = true;
            //         if (since && tweets.length) {
            //             const oldestTweet = tweets.sort((a, b) => b.timestamp - a.timestamp)[0];
            //             isTimeValid = (oldestTweet.timestamp * 1000) > since;
            //         }
            //         hasMore = isTimeValid && (!maxTweets || tweets.length < maxTweets) && this.hasMoreTweets(responseData);
            //         if (hasMore) {
            //             console.log("Scrolling down");
            //             await sleep(2000)
            //             await page.evaluate(() => {
            //                 window.scrollTo(0, document.body.scrollHeight);
            //             });
            //         }
            //     }
            //     catch (e) {
            //         console.log(e);
            //         await this.logout(page);
            //         this.useNextTwitterAccount();
            //         await this.login(page);
            //         const tweets = this.scrapTweets(browser, page, username, since, maxTweets);
            //         return resolve(tweets);
            //     }

            // } while (hasMore);
            // if (maxTweets) {
            //     tweets = tweets.slice(0, maxTweets);
            // }
            // if (since) {
            //     tweets = tweets.filter(v => (v.timestamp * 1000) >= since);
            // }
            // console.log('Tweets scraped. Total scraped: ', tweets.length)
            // return resolve(tweets);
        });
    }

    async getTweetsByUserName(username: string, since: number = 0, til?: number, maxTweets?: number): Promise<{ success: boolean; message?: string; tweets?: ITweet[] }> {
        let tweets: ITweet[] = [];
        // const scraper = await this.scraperManager.getBrowserAndPage();
        // if (!scraper) {
        //     console.log('cannot open browser and page');
        //     return tweets;
        // }
        // const { browser, page } = scraper;
        try {
            const result = await this.scrapTweets(username, since, til, maxTweets);
            return result;
        } catch (e) {
            console.log(e);
            return {
                success: false,
                message: e.message
            }
        } finally {
            // await browser.close();
        }
    }

    // async getProfile(username: string) {
    //     await this.auth.updateGuestToken();
    //     try {
    //         const params = {
    //             variables: {
    //                 'screen_name': username,
    //                 withSafetyModeUserFields: true
    //             },
    //             features: {
    //                 hidden_profile_likes_enabled: false,
    //                 hidden_profile_subscriptions_enabled: false,
    //                 responsive_web_graphql_exclude_directive_enabled: true,
    //                 verified_phone_label_enabled: false,
    //                 subscriptions_verification_info_is_identity_verified_enabled: false,
    //                 subscriptions_verification_info_verified_since_enabled: true,
    //                 highlights_tweets_tab_ui_enabled: true,
    //                 creator_subscriptions_tweet_preview_api_enabled: true,
    //                 responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
    //                 responsive_web_graphql_timeline_navigation_enabled: true
    //             },
    //             fieldToggles: {
    //                 withAuxiliaryUserLabels: false
    //             }
    //         }
    //         const result = await this.api.fetchAnonymous(GET_USER_BY_SCREENAME, 'GET', params)
    //         const user = result.data.user.result;
    //         return this.parser.parseProfile(user.legacy, user.is_blue_verified);
    //     }
    //     catch (e) {
    //         console.log(e);
    //         throw e;
    //     }
    // }

    // async loginAndGetHeader(username: string, password: string, email?: string, twoFactorSecret?: string) {
    //     await this.auth.login(username, password, email, twoFactorSecret);
    //     const headers = {
    //         authorization: `Bearer ${BEARER_TOKEN}`,
    //         cookie: this.cookie.getCookieExtensionStr()
    //     };
    //     this.installCsrfToken(headers);
    //     return headers;
    // }

    // async getUserIdByScreenName(username: string): Promise<string> {
    //     await this.auth.updateGuestToken();
    //     try {
    //         const params = {
    //             variables: {
    //                 'screen_name': username,
    //                 withSafetyModeUserFields: true
    //             },
    //             features: {
    //                 hidden_profile_likes_enabled: false,
    //                 hidden_profile_subscriptions_enabled: false,
    //                 responsive_web_graphql_exclude_directive_enabled: true,
    //                 verified_phone_label_enabled: false,
    //                 subscriptions_verification_info_is_identity_verified_enabled: false,
    //                 subscriptions_verification_info_verified_since_enabled: true,
    //                 highlights_tweets_tab_ui_enabled: true,
    //                 creator_subscriptions_tweet_preview_api_enabled: true,
    //                 responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
    //                 responsive_web_graphql_timeline_navigation_enabled: true
    //             },
    //             fieldToggles: {
    //                 withAuxiliaryUserLabels: false
    //             }
    //         }
    //         const result = await this.api.fetchAnonymous(GET_USER_BY_SCREENAME, 'GET', params)
    //         return result.data.user.result['rest_id'];
    //     }
    //     catch (e) {
    //         console.log(e);
    //         throw e;
    //     }
    // }

    // async searchTweets(credentials: ICredential, query: string, maxTweets: number = 50) {
    //     await this.auth.login(credentials.username, credentials.password);
    //     return this.getTweetTimeline(query, maxTweets, (query: string, maxTweets: number, cursor: string) => {
    //         return this.fetchSearchTweets(query, maxTweets, cursor);
    //     })
    // }

    // private async fetchSearchTweets(query: string, maxTweets: number = 50, cursor: string) {
    //     const timeline = await this.getSearchTimeline(query, maxTweets, cursor);
    //     return this.parser.parseSearchTimelineUsers(timeline);
    // }



    // async getTweetsByUserName(username: string, maxTweets?: number) {
    //     await this.auth.updateGuestToken();
    //     const result = await this.getTweetTimeline(username, maxTweets, async (q, mt, c) => {
    //         const userId = await this.getUserIdByScreenName(username);
    //         if (!userId)
    //             return null;
    //         return this.fetchTweets(userId, mt, c)
    //     });
    //     return result;
    // }

    // async fetchTweets(userId: string, maxTweets: number, cursor: string) {

    //     const params = {
    //         variables: {
    //             count: maxTweets ?? 200,
    //             includePromotedContent: true,
    //             userId,
    //             withQuickPromoteEligibilityTweetFields: true,
    //             withV2Timeline: true,
    //             withVoice: true
    //         },
    //         features: {
    //             "responsive_web_graphql_exclude_directive_enabled": true,
    //             "verified_phone_label_enabled": true,
    //             "creator_subscriptions_tweet_preview_api_enabled": true,
    //             "responsive_web_graphql_timeline_navigation_enabled": true,
    //             "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
    //             "tweetypie_unmention_optimization_enabled": true,
    //             "responsive_web_edit_tweet_api_enabled": true,
    //             "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
    //             "view_counts_everywhere_api_enabled": true,
    //             "longform_notetweets_consumption_enabled": true,
    //             "responsive_web_twitter_article_tweet_consumption_enabled": true,
    //             "tweet_awards_web_tipping_enabled": false,
    //             "freedom_of_speech_not_reach_fetch_enabled": true,
    //             "standardized_nudges_misinfo": true,
    //             "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
    //             "longform_notetweets_rich_text_read_enabled": true,
    //             "longform_notetweets_inline_media_enabled": true,
    //             "responsive_web_media_download_video_enabled": true,
    //             "responsive_web_enhance_cards_enabled": true
    //         }
    //     }
    //     if (cursor != null && cursor != '') {
    //         params.variables['cursor'] = cursor;
    //     }
    //     const result = await this.api.fetchAnonymous(GET_TWEETS_BY_USER_ID, 'GET', params);
    //     return this.parser.parseTimelineTweetsV2(result);
    // }

    // async getTweetByTweetId(tweetId: string) {
    //     await this.auth.updateGuestToken();
    //     const params = {
    //         variables: {
    //             "tweetId": tweetId,
    //             "includePromotedContent": false,
    //             "withCommunity": false,
    //             "withVoice": false,
    //         },
    //         features: {
    //             "creator_subscriptions_tweet_preview_api_enabled": true,
    //             "tweetypie_unmention_optimization_enabled": true,
    //             "responsive_web_edit_tweet_api_enabled": true,
    //             "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
    //             "view_counts_everywhere_api_enabled": true,
    //             "longform_notetweets_consumption_enabled": true,
    //             "responsive_web_twitter_article_tweet_consumption_enabled": false,
    //             "tweet_awards_web_tipping_enabled": false,
    //             "freedom_of_speech_not_reach_fetch_enabled": true,
    //             "standardized_nudges_misinfo": true,
    //             "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
    //             "longform_notetweets_rich_text_read_enabled": true,
    //             "longform_notetweets_inline_media_enabled": true,
    //             "responsive_web_graphql_exclude_directive_enabled": true,
    //             "verified_phone_label_enabled": false,
    //             "responsive_web_media_download_video_enabled": false,
    //             "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
    //             "responsive_web_graphql_timeline_navigation_enabled": true,
    //             "responsive_web_enhance_cards_enabled": false
    //         }
    //     }
    //     const result = await this.api.fetchAnonymous(GET_TWEET_BY_ID, 'GET', params)
    //     return this.parser.parseTimelineEntryItemContentRaw(result.data, tweetId);
    // }

    // async getFollowersByUserName(credentials: ICredential, username: string, count?: number) {
    //     const userId = await this.getUserIdByScreenName(username);
    //     if (!userId) return null;
    //     return this.getFollowersByUserId(credentials, userId, count);
    // }

    // async getFollowersByUserId(credentials: ICredential, userId: string, count?: number) {
    //     // Sign In
    //     await this.auth.login(credentials.username, credentials.password);
    //     const followers = await this.getUserTimeline(userId, 50, this.fetchProfileFollowers.bind(this));
    //     return followers;
    // }

    // private async fetchProfileFollowers(userId: string, count: number = 50, cursor: string) {
    //     const variableObj = {
    //         "userId": userId,
    //         "count": count ?? 20,
    //         "includePromotedContent": false
    //     };
    //     if (cursor != null && cursor != '') {
    //         variableObj['cursor'] = cursor;
    //     }
    //     const params = {
    //         variables: variableObj,
    //         features: {
    //             "android_graphql_skip_api_media_color_palette": false,
    //             "blue_business_profile_image_shape_enabled": false,
    //             "creator_subscriptions_subscription_count_enabled": false,
    //             "creator_subscriptions_tweet_preview_api_enabled": true,
    //             "freedom_of_speech_not_reach_fetch_enabled": true,
    //             "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
    //             "longform_notetweets_consumption_enabled": true,
    //             "longform_notetweets_inline_media_enabled": true,
    //             "longform_notetweets_rich_text_read_enabled": true,
    //             "responsive_web_edit_tweet_api_enabled": true,
    //             "responsive_web_enhance_cards_enabled": false,
    //             "responsive_web_graphql_exclude_directive_enabled": true,
    //             "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
    //             "responsive_web_graphql_timeline_navigation_enabled": true,
    //             "responsive_web_media_download_video_enabled": false,
    //             "responsive_web_twitter_article_tweet_consumption_enabled": false,
    //             "rweb_lists_timeline_redesign_enabled": true,
    //             "standardized_nudges_misinfo": true,
    //             "subscriptions_verification_info_enabled": true,
    //             "subscriptions_verification_info_reason_enabled": true,
    //             "subscriptions_verification_info_verified_since_enabled": true,
    //             "super_follow_badge_privacy_enabled": false,
    //             "super_follow_exclusive_tweet_notifications_enabled": false,
    //             "super_follow_tweet_api_enabled": false,
    //             "super_follow_user_api_enabled": false,
    //             "tweet_awards_web_tipping_enabled": false,
    //             "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
    //             "tweetypie_unmention_optimization_enabled": true,
    //             "unified_cards_ad_metadata_container_dynamic_card_content_query_enabled": false,
    //             "verified_phone_label_enabled": false,
    //             "view_counts_everywhere_api_enabled": true
    //         }
    //     }
    //     const result = await this.api.fetch(GET_FOLLOWERS_BY_USER_ID, 'GET', params);
    //     return this.parser.parseRelationshipTimeline(result);
    // }

    // async getFollowingByUserName(credentials: ICredential, username: string, count?: number) {
    //     const userId = await this.getUserIdByScreenName(username);
    //     if (!userId) return null;
    //     return this.getFollowersByUserId(credentials, userId, count);
    // }

    // async getFollowingByUserId(credentials: ICredential, userId: string, count?: number) {
    //     await this.auth.login(credentials.username, credentials.password);
    //     const followers = await this.getUserTimeline(userId, 50, this.fetchProfileFollowering.bind(this));
    //     return followers;
    // }

    // private async fetchProfileFollowering(userId: string, count: number = 50, cursor: string) {
    //     const variableObj = {
    //         "userId": userId,
    //         "count": count ?? 20,
    //         "includePromotedContent": false
    //     };
    //     if (cursor != null && cursor != '') {
    //         variableObj['cursor'] = cursor;
    //     }
    //     const params = {
    //         variables: variableObj,
    //         features: {
    //             "android_graphql_skip_api_media_color_palette": false,
    //             "blue_business_profile_image_shape_enabled": false,
    //             "creator_subscriptions_subscription_count_enabled": false,
    //             "creator_subscriptions_tweet_preview_api_enabled": true,
    //             "freedom_of_speech_not_reach_fetch_enabled": true,
    //             "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
    //             "longform_notetweets_consumption_enabled": true,
    //             "longform_notetweets_inline_media_enabled": true,
    //             "longform_notetweets_rich_text_read_enabled": true,
    //             "responsive_web_edit_tweet_api_enabled": true,
    //             "responsive_web_enhance_cards_enabled": false,
    //             "responsive_web_graphql_exclude_directive_enabled": true,
    //             "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
    //             "responsive_web_graphql_timeline_navigation_enabled": true,
    //             "responsive_web_media_download_video_enabled": false,
    //             "responsive_web_twitter_article_tweet_consumption_enabled": false,
    //             "rweb_lists_timeline_redesign_enabled": true,
    //             "standardized_nudges_misinfo": true,
    //             "subscriptions_verification_info_enabled": true,
    //             "subscriptions_verification_info_reason_enabled": true,
    //             "subscriptions_verification_info_verified_since_enabled": true,
    //             "super_follow_badge_privacy_enabled": false,
    //             "super_follow_exclusive_tweet_notifications_enabled": false,
    //             "super_follow_tweet_api_enabled": false,
    //             "super_follow_user_api_enabled": false,
    //             "tweet_awards_web_tipping_enabled": false,
    //             "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
    //             "tweetypie_unmention_optimization_enabled": true,
    //             "unified_cards_ad_metadata_container_dynamic_card_content_query_enabled": false,
    //             "verified_phone_label_enabled": false,
    //             "view_counts_everywhere_api_enabled": true
    //         }
    //     }
    //     const result = await this.api.fetch(GET_FOLLOWING_BY_USER_ID, 'GET', params)
    //     return this.parser.parseRelationshipTimeline(result);
    // }

    // private async getUserTimeline(userId: string, maxProfiles: number = 50, fetchFunc: (q, mt, c) => Promise<any>) {
    //     let nProfiles = 0;
    //     let cursor = undefined;
    //     let consecutiveEmptyBatches = 0;
    //     while (nProfiles < maxProfiles) {
    //         const batch = await fetchFunc(userId, maxProfiles, cursor);
    //         const { profiles, next } = batch;
    //         cursor = next;
    //         if (profiles.length === 0) {
    //             consecutiveEmptyBatches++;
    //             if (consecutiveEmptyBatches > 5)
    //                 break;
    //         } else
    //             consecutiveEmptyBatches = 0;
    //         for (const profile of profiles) {
    //             if (nProfiles < maxProfiles)
    //                 return profile;
    //             else
    //                 break;
    //             nProfiles++;
    //         }
    //         if (!next)
    //             break;
    //     }
    // }

    // private async getTweetTimeline(query, maxTweets: number = 50, fetchFunc: (query: string, maxTweets: number, cursor: string) => Promise<any>) {
    //     let nTweets = 0;
    //     let cursor = undefined;
    //     const tweetsList = [];
    //     while (nTweets < maxTweets) {
    //         const batch = await fetchFunc(query, maxTweets, cursor);
    //         const { tweets, next } = batch;
    //         if (tweets.length === 0) {
    //             break;
    //         }
    //         for (const tweet of tweets) {
    //             if (nTweets < maxTweets) {
    //                 cursor = next;
    //                 tweetsList.push(tweet);
    //             }
    //             else {
    //                 break;
    //             }
    //             nTweets++;
    //         }
    //     }
    //     return tweetsList
    // }

    // private async getSearchTimeline(query: string, maxItems: number, cursor: string, searchMode?: string) {
    //     // if (!this.auth.isLoggedIn()) {
    //     //     throw new Error('Scraper is not logged-in for search.');
    //     // }
    //     if (!searchMode)
    //         searchMode = "Latest";
    //     if (maxItems > 50) {
    //         maxItems = 50;
    //     }
    //     const variableObj = {
    //         rawQuery: query,
    //         count: maxItems,
    //         querySource: 'typed_query',
    //         product: 'Top',
    //     };
    //     if (cursor != null && cursor != '') {
    //         variableObj['cursor'] = cursor;
    //     }
    //     switch (searchMode) {
    //         case "Latest":
    //             variableObj.product = 'Latest';
    //             break;
    //         case "Photos":
    //             variableObj.product = 'Photos';
    //             break;
    //         case "Videos":
    //             variableObj.product = 'Videos';
    //             break;
    //         case "Users":
    //             variableObj.product = 'People';
    //             break;
    //         default:
    //             break;
    //     }
    //     const params = {
    //         variables: variableObj,
    //         features: {
    //             "longform_notetweets_inline_media_enabled": true,
    //             "responsive_web_enhance_cards_enabled": false,
    //             "responsive_web_media_download_video_enabled": false,
    //             "responsive_web_twitter_article_tweet_consumption_enabled": false,
    //             "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
    //             "interactive_text_enabled": false,
    //             "responsive_web_text_conversations_enabled": false,
    //             "vibe_api_enabled": false,
    //             freedom_of_speech_not_reach_fetch_enabled: false,
    //             responsive_web_graphql_exclude_directive_enabled: false,
    //             tweetypie_unmention_optimization_enabled: false,
    //             longform_notetweets_consumption_enabled: false,
    //             responsive_web_edit_tweet_api_enabled: false,
    //             standardized_nudges_misinfo: false,
    //             longform_notetweets_rich_text_read_enabled: false,
    //             responsive_web_graphql_timeline_navigation_enabled: false,
    //             graphql_is_translatable_rweb_tweet_is_translatable_enabled: false,
    //             view_counts_everywhere_api_enabled: false,
    //             tweet_awards_web_tipping_enabled: false,
    //             verified_phone_label_enabled: false,
    //             responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
    //             blue_business_profile_image_shape_enabled: false
    //         },
    //         fieldToggles: {
    //             withArticleRichContentState: false,
    //         }
    //     }
    //     return this.api.fetch(SEARCH_TIMELINE, 'GET', params);
    // }

    // private installCsrfToken(headers) {
    //     const ct0 = this.cookie.getExtByKey('ct0');
    //     if (ct0) {
    //         headers['x-csrf-token'] = ct0;
    //     }
    // }
}

export { TwitterManager };
