import Auth from "../utils/auth";
import {objectToParams} from "../utils";
import {
    BEARER_TOKEN,
    GET_FOLLOWERS_BY_USER_ID,
    GET_TWEET_BY_ID,
    GET_TWEETS_BY_USER_ID,
    GET_USER_BY_SCREENAME
} from "../const";
import Cookie from "../utils/cookie";
import Parser from "../utils/parser";

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

class ScraperManager {
    private parser: Parser;
    private auth: Auth;
    private cookie: Cookie;

    constructor() {
        this.parser = new Parser();
        this.cookie = new Cookie();
        this.auth = new Auth(this.cookie);
    }

    async getUserIdByUserName(username: string): Promise<string> {
        await this.auth.updateGuestToken();
        const guestToken = this.auth.getGuestToken();
        if(!guestToken) return null;

        const variables = objectToParams({'screen_name': username, withSafetyModeUserFields: true})
        const features = encodeURIComponent(JSON.stringify({
            hidden_profile_likes_enabled: false,
            hidden_profile_subscriptions_enabled: false,
            responsive_web_graphql_exclude_directive_enabled: true,
            verified_phone_label_enabled: false,
            subscriptions_verification_info_is_identity_verified_enabled: false,
            subscriptions_verification_info_verified_since_enabled: true,
            highlights_tweets_tab_ui_enabled: true,
            creator_subscriptions_tweet_preview_api_enabled: true,
            responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
            responsive_web_graphql_timeline_navigation_enabled: true,
        }))
        const fieldToggles = encodeURIComponent(JSON.stringify({withAuxiliaryUserLabels: false}));

        if (!guestToken) return null;
        const response = await fetch(`${GET_USER_BY_SCREENAME}?variables=${variables}&features=${features}&fieldToggles=${fieldToggles}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${BEARER_TOKEN}`,
                'x-guest-token': guestToken
            }
        });
        if (!response.ok) return null;
        const result = await response.json();
        return result.data.user.result['rest_id'];
    }

    async getTweetsByUserName(username: string, maxTweets?: number): Promise<ITweets[]> {
        await this.auth.updateGuestToken();
        const guestToken = this.auth.getGuestToken();
        if (!guestToken) return null;
        const userId = await this.getUserIdByUserName(username);
        if (!userId)
            return null;
        const variables = objectToParams({
            count: maxTweets ?? 200,
            includePromotedContent: true,
            userId,
            withQuickPromoteEligibilityTweetFields: true,
            withV2Timeline: true,
            withVoice: true
        })
        const features = objectToParams({
            "responsive_web_graphql_exclude_directive_enabled": true,
            "verified_phone_label_enabled": false,
            "creator_subscriptions_tweet_preview_api_enabled": true,
            "responsive_web_graphql_timeline_navigation_enabled": true,
            "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
            "tweetypie_unmention_optimization_enabled": true,
            "responsive_web_edit_tweet_api_enabled": true,
            "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
            "view_counts_everywhere_api_enabled": true,
            "longform_notetweets_consumption_enabled": true,
            "responsive_web_twitter_article_tweet_consumption_enabled": false,
            "tweet_awards_web_tipping_enabled": false,
            "freedom_of_speech_not_reach_fetch_enabled": true,
            "standardized_nudges_misinfo": true,
            "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
            "longform_notetweets_rich_text_read_enabled": true,
            "longform_notetweets_inline_media_enabled": true,
            "responsive_web_media_download_video_enabled": false,
            "responsive_web_enhance_cards_enabled": false
        })
        const response = await fetch(`${GET_TWEETS_BY_USER_ID}?variables=${variables}&features=${features}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${BEARER_TOKEN}`,
                'x-guest-token': guestToken
            }
        });
        if (!response.ok) return null;
        const result = await response.json();
        const tweets = this.parser.parseTimelineTweetsV2(result);
        return tweets;
    }

    async getTweetByTweetId(tweetId: string): Promise<ITweets> {
        // await this.login('CheukJohnn835', 'Since1994');
        await this.auth.updateGuestToken();
        const guestToken = this.auth.getGuestToken();
        // if (!guestToken) return null;
        const variables = objectToParams({
            "tweetId": tweetId,
            "includePromotedContent": false,
            "withCommunity": false,
            "withVoice": false,
        });
        const features = objectToParams({
            "creator_subscriptions_tweet_preview_api_enabled": true,
            "tweetypie_unmention_optimization_enabled": true,
            "responsive_web_edit_tweet_api_enabled": true,
            "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
            "view_counts_everywhere_api_enabled": true,
            "longform_notetweets_consumption_enabled": true,
            "responsive_web_twitter_article_tweet_consumption_enabled": false,
            "tweet_awards_web_tipping_enabled": false,
            "freedom_of_speech_not_reach_fetch_enabled": true,
            "standardized_nudges_misinfo": true,
            "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
            "longform_notetweets_rich_text_read_enabled": true,
            "longform_notetweets_inline_media_enabled": true,
            "responsive_web_graphql_exclude_directive_enabled": true,
            "verified_phone_label_enabled": false,
            "responsive_web_media_download_video_enabled": false,
            "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
            "responsive_web_graphql_timeline_navigation_enabled": true,
            "responsive_web_enhance_cards_enabled": false
        });
        const response = await fetch(`${GET_TWEET_BY_ID}?variables=${variables}&features=${features}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${BEARER_TOKEN}`,
                'x-guest-token': guestToken,
                // cookie: this.cookie.getCookieExtensionStr()
            }
        });
        if (!response.ok) return null;
        const result = await response.json();
        const data = this.parser.parseTimelineEntryItemContentRaw(result.data, tweetId);
        return data;
    }

    async getFollowersByUserName(username: string, credentials: ICredential, count?: number) {
        const userId = await this.getUserIdByUserName(username);
        if(!userId) return null;
        return this.getFollowersByUserId(userId, credentials, count);
    }

    async getFollowersByUserId(userId: string, credentials: ICredential, count?: number) {
        // Sign In
        await this.login(credentials.username, credentials.password);

        const variables = encodeURIComponent(JSON.stringify({
            "userId": userId,
            "count": count ?? 20,
            "includePromotedContent": false,
            "withSuperFollowsUserFields": true,
            "withDownvotePerspective": false,
            "withReactionsMetadata": false,
            "withReactionsPerspective": false,
            "withSuperFollowsTweetFields": true,
            "withTweetQuoteCount": true,
            "withBirdwatchPivots": true,
            "__fs_interactive_text": false,
            "__fs_responsive_web_uc_gql_enabled": false,
            "__fs_dont_mention_me_view_api_enabled": false
        }));
        const features = encodeURIComponent(JSON.stringify({
            "responsive_web_graphql_exclude_directive_enabled": true,
            "verified_phone_label_enabled": false,
            "creator_subscriptions_tweet_preview_api_enabled": true,
            "responsive_web_graphql_timeline_navigation_enabled": true,
            "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
            "tweetypie_unmention_optimization_enabled": true,
            "responsive_web_edit_tweet_api_enabled": true,
            "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
            "view_counts_everywhere_api_enabled": true,
            "longform_notetweets_consumption_enabled": true,
            "responsive_web_twitter_article_tweet_consumption_enabled": false,
            "tweet_awards_web_tipping_enabled": false,
            "freedom_of_speech_not_reach_fetch_enabled": true,
            "standardized_nudges_misinfo": true,
            "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
            "longform_notetweets_rich_text_read_enabled": true,
            "longform_notetweets_inline_media_enabled": true,
            "responsive_web_media_download_video_enabled": false,
            "responsive_web_enhance_cards_enabled": false
        }));
        const headers = {
            authorization: `Bearer ${BEARER_TOKEN}`,
            cookie: this.cookie.getCookieExtensionStr(),
        }
        this.installCsrfToken(headers);
        const response = await fetch(`${GET_FOLLOWERS_BY_USER_ID}?variables=${variables}&features=${features}`, {
            method: 'GET',
            headers
        });
        if (!response.ok) {
            console.log('Failed to fetch followers', await response.text())
        }
        const result = await response.json();
        console.log('result', result.data.user.result.timeline);
        const timeline = this.parser.parseRelationshipTimeline(result);
        const followers = await this.getUserTimeline(20, timeline);
        return followers;
    }

    private async getUserTimeline(maxProfiles: number = 20, fetchFunc: () => Promise<any>) {
        let nProfiles = 0;
        let cursor = undefined;
        let consecutiveEmptyBatches = 0;
        while (nProfiles < maxProfiles) {
            const batch = await fetchFunc();
            console.log('batch', batch)
            const { profiles, next } = batch;
            cursor = next;
            if (profiles.length === 0) {
                consecutiveEmptyBatches++;
                if (consecutiveEmptyBatches > 5)
                    break;
            }
            else
                consecutiveEmptyBatches = 0;
            for (const profile of profiles) {
                if (nProfiles < maxProfiles)
                    return profile;
                else
                    break;
                nProfiles++;
            }
            if (!next)
                break;
        }
    }

    async initLogin() {
        return await this.executeFlowTask({
            flow_name: 'login',
            input_flow_data: {
                flow_context: {
                    debug_overrides: {},
                    start_location: {
                        location: 'splash_screen',
                    },
                },
            },
        });
    }

    async login(username: string, password: string, email?: string, twoFactorSecret?: string) {
        await this.auth.updateGuestToken();
        let next = await this.initLogin();
        while ('subtask' in next && next.subtask) {
            if (next.subtask.subtask_id === 'LoginJsInstrumentationSubtask') {
                next = await this.handleJsInstrumentationSubtask(next);
            }
            else if (next.subtask.subtask_id === 'LoginEnterUserIdentifierSSO') {
                next = await this.handleEnterUserIdentifierSSO(next, username);
            }
            else if (next.subtask.subtask_id === 'LoginEnterPassword') {
                next = await this.handleEnterPassword(next, password);
            }
            else if (next.subtask.subtask_id === 'AccountDuplicationCheck') {
                next = await this.handleAccountDuplicationCheck(next);
            }
            else if(next.subtask.subtask_id === 'LoginEnterAlternateIdentifierSubtask') {
                next = await this.handleEnterAlternateIdentifierSubtask(next, username);
            }
            // else if (next.subtask.subtask_id === 'LoginTwoFactorAuthChallenge') {
            //     if (twoFactorSecret) {
            //         next = await this.handleTwoFactorAuthChallenge(next, twoFactorSecret);
            //     }
            //     else {
            //         throw new Error('Requested two factor authentication code but no secret provided');
            //     }
            // }
            else if (next.subtask.subtask_id === 'LoginAcid') {
                next = await this.handleAcid(next, email);
            }
            else if (next.subtask.subtask_id === 'LoginSuccessSubtask') {
                next = await this.handleSuccessSubtask(next);
            }
            else {
                throw new Error(`Unknown subtask ${next.subtask.subtask_id}`);
            }
        }
        if ('err' in next) {
            throw next.err;
        }
    }

    async logout() {
        if (!this.isLoggedIn()) {
            return;
        }
        const response = await fetch('https://api.twitter.com/1.1/account/logout.json', {
            method: 'POST',
            headers: {
                authorization: `Bearer ${BEARER_TOKEN}`,
                // 'x-guest-token': guestToken
            }
        });
        // this.deleteToken();
        // this.jar = new tough_cookie_1.CookieJar();
    }

    async isLoggedIn() {
        // const res = await (0, api_1.requestApi)('https://api.twitter.com/1.1/account/verify_credentials.json', this);
        const response = await fetch('https://api.twitter.com/1.1/account/verify_credentials.json', {
            method: 'GET',
            headers: {
                authorization: `Bearer ${BEARER_TOKEN}`
            }
        })
        if (!response.ok) {
            return false;
        }
        const result = await response.json();
        const { value: verify } = result;
        return verify && !verify.errors?.length;
    }

    // Flow Task
    async handleJsInstrumentationSubtask(prev) {
        return await this.executeFlowTask({
            flow_token: prev.flowToken,
            subtask_inputs: [
                {
                    subtask_id: 'LoginJsInstrumentationSubtask',
                    js_instrumentation: {
                        response: '{}',
                        link: 'next_link',
                    },
                },
            ],
        });
    }
    async handleEnterUserIdentifierSSO(prev, username) {
        return await this.executeFlowTask({
            flow_token: prev.flowToken,
            subtask_inputs: [
                {
                    subtask_id: 'LoginEnterUserIdentifierSSO',
                    settings_list: {
                        setting_responses: [
                            {
                                key: 'user_identifier',
                                response_data: {
                                    text_data: { result: username },
                                },
                            },
                        ],
                        link: 'next_link',
                    },
                },
            ],
        });
    }
    async handleEnterPassword(prev, password) {
        return await this.executeFlowTask({
            flow_token: prev.flowToken,
            subtask_inputs: [
                {
                    subtask_id: 'LoginEnterPassword',
                    enter_password: {
                        password,
                        link: 'next_link',
                    },
                },
            ],
        });
    }
    async handleAccountDuplicationCheck(prev) {
        return await this.executeFlowTask({
            flow_token: prev.flowToken,
            subtask_inputs: [
                {
                    subtask_id: 'AccountDuplicationCheck',
                    check_logged_in_account: {
                        link: 'AccountDuplicationCheck_false',
                    },
                },
            ],
        });
    }
    async handleEnterAlternateIdentifierSubtask(prev, username) {
        return await this.executeFlowTask({
            flow_token: prev.flowToken,
            subtask_inputs: [{
                enter_text: {
                    link: 'next_link',
                    text: username// or phone number
                },
                subtask_id: 'LoginEnterAlternateIdentifierSubtask'
            }]
        })
    }
    // async handleTwoFactorAuthChallenge(prev, secret) {
    //     const totp = new OTPAuth.TOTP({ secret });
    //     let error;
    //     for (let attempts = 1; attempts < 4; attempts += 1) {
    //         try {
    //             return await this.executeFlowTask({
    //                 flow_token: prev.flowToken,
    //                 subtask_inputs: [
    //                     {
    //                         subtask_id: 'LoginTwoFactorAuthChallenge',
    //                         enter_text: {
    //                             link: 'next_link',
    //                             text: totp.generate(),
    //                         },
    //                     },
    //                 ],
    //             });
    //         }
    //         catch (err) {
    //             error = err;
    //             await new Promise((resolve) => setTimeout(resolve, 2000 * attempts));
    //         }
    //     }
    //     throw error;
    // }
    async handleAcid(prev, email) {
        return await this.executeFlowTask({
            flow_token: prev.flowToken,
            subtask_inputs: [
                {
                    subtask_id: 'LoginAcid',
                    enter_text: {
                        text: email,
                        link: 'next_link',
                    },
                },
            ],
        });
    }
    async handleSuccessSubtask(prev) {
        return await this.executeFlowTask({
            flow_token: prev.flowToken,
            subtask_inputs: [],
        });
    }
    installCsrfToken(headers) {
        const ct0 = this.cookie.getExtByKey('ct0');
        if(ct0) {
            headers['x-csrf-token'] = ct0;
        }
    }
    async executeFlowTask(data) {
        const onboardingTaskUrl = 'https://api.twitter.com/1.1/onboarding/task.json';
        const guestToken = this.auth.getGuestToken();
        if (guestToken == null) {
            throw new Error('Authentication token is null or undefined.');
        }
        const headers = {
            authorization: `Bearer ${BEARER_TOKEN}`,
            cookie: this.cookie.getCookieExtensionStr(),
            'content-type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Nokia G20) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Mobile Safari/537.36',
            'x-guest-token': guestToken,
            'x-twitter-auth-type': 'OAuth2Client',
            'x-twitter-active-user': 'yes',
            'x-twitter-client-language': 'en',
        };
        this.installCsrfToken(headers);
        const res = await fetch(onboardingTaskUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        });

        // await (0, requests_1.updateCookieJar)(this.jar, res.headers);
        if (!res.ok) {
            return { status: 'error', err: new Error(await res.text()) };
        }
        this.cookie.updateCookie(res.headers.get('set-cookie'))
        const flow = await res.json();
        if (flow?.flow_token == null) {
            return { status: 'error', err: new Error('flow_token not found.') };
        }
        if (flow.errors?.length) {
            return {
                status: 'error',
                err: new Error(`Authentication error (${flow.errors[0].code}): ${flow.errors[0].message}`),
            };
        }
        if (typeof flow.flow_token !== 'string') {
            return {
                status: 'error',
                err: new Error('flow_token was not a string.'),
            };
        }
        const subtask = flow.subtasks?.length ? flow.subtasks[0] : undefined;
        if (subtask && subtask.subtask_id === 'DenyLoginSubtask') {
            return {
                status: 'error',
                err: new Error('Authentication error: DenyLoginSubtask'),
            };
        }
        return {
            status: 'success',
            subtask,
            flowToken: flow.flow_token,
        };
    }
}

export default ScraperManager;
export {ITweets, IScraperManager}
