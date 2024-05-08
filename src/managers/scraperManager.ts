import Auth from "../utils/auth";
import {objectToParams} from "../utils";
import {
    BEARER_TOKEN,
    GET_FOLLOWERS_BY_USER_ID, GET_FOLLOWING_BY_USER_ID,
    GET_TWEET_BY_ID,
    GET_TWEETS_BY_USER_ID,
    GET_USER_BY_SCREENAME
} from "../const";
import Cookie from "../utils/cookie";
import Parser from "../utils/parser";
import API from "../utils/API";

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
    private api: API;

    constructor() {
        this.parser = new Parser();
        this.cookie = new Cookie();
        this.auth = new Auth(this.cookie);
        this.api = new API(this.auth, this.cookie);
    }

    async getProfile(username: string) {

    }

    async getUserIdByScreenName(username: string): Promise<string> {
        await this.auth.updateGuestToken();
        try {
            const params = {
                variables: {
                    'screen_name': username,
                    withSafetyModeUserFields: true
                },
                features: {
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
                },
                fieldToggles: {
                    withAuxiliaryUserLabels: false
                }
            }
            const result = await this.api.fetchAnonymous(GET_USER_BY_SCREENAME, 'GET', params)
            return result.data.user.result['rest_id'];
        }
        catch(e) {
            console.log(e);
            throw e;
        }
    }

    async searchTweets(credentials: ICredential, query: string, maxTweets: number = 50) {
        await this.auth.login(credentials.username, credentials.password);
        await this.getTweetTimeline(query, maxTweets, (query: string, maxTweets: number, cursor: string) => {
            return this.fetchSearchTweets(query, maxTweets, cursor);
        })
    }

    private async fetchSearchTweets(query: string, maxTweets: number = 50, cursor: string) {
        const timeline = await this.getSearchTimeline(query, maxTweets, cursor);
        console.log('timeline', timeline)
        const data = this.parser.parseSearchTimelineUsers(timeline);
        console.log('data', data)
        return data;
    }

    async getTweetsByUserName(username: string, maxTweets?: number): Promise<ITweets[]> {
        await this.auth.updateGuestToken();
        const guestToken = this.auth.getGuestToken();
        if (!guestToken) return null;
        const userId = await this.getUserIdByScreenName(username);
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
        await this.auth.updateGuestToken();
        const guestToken = this.auth.getGuestToken();
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
        const userId = await this.getUserIdByScreenName(username);
        if (!userId) return null;
        return this.getFollowersByUserId(credentials, userId, count);
    }

    async getFollowersByUserId(credentials: ICredential, userId: string, count?: number) {
        // Sign In
        await this.auth.login(credentials.username, credentials.password);
        const followers = await this.getUserTimeline(userId, 50, this.fetchProfileFollowers.bind(this));
        return followers;
    }

    private async fetchProfileFollowers(userId: string, count: number = 50, cursor: string) {
        const variableObj = {
            "userId": userId,
            "count": count ?? 20,
            "includePromotedContent": false
        };
        if (cursor != null && cursor != '') {
            variableObj['cursor'] = cursor;
        }
        const variables = objectToParams(variableObj);
        const features = objectToParams({
            "android_graphql_skip_api_media_color_palette": false,
            "blue_business_profile_image_shape_enabled": false,
            "creator_subscriptions_subscription_count_enabled": false,
            "creator_subscriptions_tweet_preview_api_enabled": true,
            "freedom_of_speech_not_reach_fetch_enabled": true,
            "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
            "longform_notetweets_consumption_enabled": true,
            "longform_notetweets_inline_media_enabled": true,
            "longform_notetweets_rich_text_read_enabled": true,
            "responsive_web_edit_tweet_api_enabled": true,
            "responsive_web_enhance_cards_enabled": false,
            "responsive_web_graphql_exclude_directive_enabled": true,
            "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
            "responsive_web_graphql_timeline_navigation_enabled": true,
            "responsive_web_media_download_video_enabled": false,
            "responsive_web_twitter_article_tweet_consumption_enabled": false,
            "rweb_lists_timeline_redesign_enabled": true,
            "standardized_nudges_misinfo": true,
            "subscriptions_verification_info_enabled": true,
            "subscriptions_verification_info_reason_enabled": true,
            "subscriptions_verification_info_verified_since_enabled": true,
            "super_follow_badge_privacy_enabled": false,
            "super_follow_exclusive_tweet_notifications_enabled": false,
            "super_follow_tweet_api_enabled": false,
            "super_follow_user_api_enabled": false,
            "tweet_awards_web_tipping_enabled": false,
            "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
            "tweetypie_unmention_optimization_enabled": true,
            "unified_cards_ad_metadata_container_dynamic_card_content_query_enabled": false,
            "verified_phone_label_enabled": false,
            "view_counts_everywhere_api_enabled": true
        });

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
        const timeline = this.parser.parseRelationshipTimeline(result);
        return timeline;
    }

    async getFollowingByUserName(username: string, credentials: ICredential, count?: number) {
        const userId = await this.getUserIdByScreenName(username);
        if (!userId) return null;
        return this.getFollowersByUserId(credentials, userId, count);
    }

    async getFollowingByUserId(credentials: ICredential, userId: string, count?: number) {
        await this.auth.login(credentials.username, credentials.password);
        const followers = await this.getUserTimeline(userId, 50, this.fetchProfileFollowering.bind(this));
        return followers;
    }

    private async fetchProfileFollowering(userId: string, count: number = 50, cursor: string) {
        const variableObj = {
            "userId": userId,
            "count": count ?? 20,
            "includePromotedContent": false
        };
        if (cursor != null && cursor != '') {
            variableObj['cursor'] = cursor;
        }
        const variables = objectToParams(variableObj);
        const features = objectToParams({
            "android_graphql_skip_api_media_color_palette": false,
            "blue_business_profile_image_shape_enabled": false,
            "creator_subscriptions_subscription_count_enabled": false,
            "creator_subscriptions_tweet_preview_api_enabled": true,
            "freedom_of_speech_not_reach_fetch_enabled": true,
            "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
            "longform_notetweets_consumption_enabled": true,
            "longform_notetweets_inline_media_enabled": true,
            "longform_notetweets_rich_text_read_enabled": true,
            "responsive_web_edit_tweet_api_enabled": true,
            "responsive_web_enhance_cards_enabled": false,
            "responsive_web_graphql_exclude_directive_enabled": true,
            "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
            "responsive_web_graphql_timeline_navigation_enabled": true,
            "responsive_web_media_download_video_enabled": false,
            "responsive_web_twitter_article_tweet_consumption_enabled": false,
            "rweb_lists_timeline_redesign_enabled": true,
            "standardized_nudges_misinfo": true,
            "subscriptions_verification_info_enabled": true,
            "subscriptions_verification_info_reason_enabled": true,
            "subscriptions_verification_info_verified_since_enabled": true,
            "super_follow_badge_privacy_enabled": false,
            "super_follow_exclusive_tweet_notifications_enabled": false,
            "super_follow_tweet_api_enabled": false,
            "super_follow_user_api_enabled": false,
            "tweet_awards_web_tipping_enabled": false,
            "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
            "tweetypie_unmention_optimization_enabled": true,
            "unified_cards_ad_metadata_container_dynamic_card_content_query_enabled": false,
            "verified_phone_label_enabled": false,
            "view_counts_everywhere_api_enabled": true
        });

        const headers = {
            authorization: `Bearer ${BEARER_TOKEN}`,
            cookie: this.cookie.getCookieExtensionStr(),
        }
        this.installCsrfToken(headers);
        const response = await fetch(`${GET_FOLLOWING_BY_USER_ID}?variables=${variables}&features=${features}`, {
            method: 'GET',
            headers
        });
        if (!response.ok) {
            console.log('Failed to fetch followers', await response.text())
        }
        const result = await response.json();
        const timeline = this.parser.parseRelationshipTimeline(result);
        return timeline;
    }

    private async getUserTimeline(userId: string, maxProfiles: number = 50, fetchFunc: (q, mt, c) => Promise<any>) {
        let nProfiles = 0;
        let cursor = undefined;
        let consecutiveEmptyBatches = 0;
        while (nProfiles < maxProfiles) {
            const batch = await fetchFunc(userId, maxProfiles, cursor);
            const {profiles, next} = batch;
            cursor = next;
            if (profiles.length === 0) {
                consecutiveEmptyBatches++;
                if (consecutiveEmptyBatches > 5)
                    break;
            } else
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

    private async getTweetTimeline(query, maxTweets: number = 50, fetchFunc: (query: string, maxTweets: number, cursor: string) => Promise<any>) {
        let nTweets = 0;
        let cursor = undefined;
        while (nTweets < maxTweets) {
            const batch = await fetchFunc(query, maxTweets, cursor);
            const {tweets, next} = batch;
            if (tweets.length === 0) {
                break;
            }
            for (const tweet of tweets) {
                if (nTweets < maxTweets) {
                    cursor = next;
                    return tweet;
                } else {
                    break;
                }
                nTweets++;
            }
        }
    }

    private async getSearchTimeline(query: string, maxItems: number, cursor: string, searchMode?: string) {
        // if (!this.auth.isLoggedIn()) {
        //     throw new Error('Scraper is not logged-in for search.');
        // }
        if (!searchMode)
            searchMode = "Latest";
        if (maxItems > 50) {
            maxItems = 50;
        }
        const variableObj = {
            rawQuery: query,
            count: maxItems,
            querySource: 'typed_query',
            product: 'Top',
        };
        const features = objectToParams({
            "longform_notetweets_inline_media_enabled": true,
            "responsive_web_enhance_cards_enabled": false,
            "responsive_web_media_download_video_enabled": false,
            "responsive_web_twitter_article_tweet_consumption_enabled": false,
            "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
            "interactive_text_enabled": false,
            "responsive_web_text_conversations_enabled": false,
            "vibe_api_enabled": false,
            freedom_of_speech_not_reach_fetch_enabled: false,
            responsive_web_graphql_exclude_directive_enabled: false,
            tweetypie_unmention_optimization_enabled: false,
            longform_notetweets_consumption_enabled: false,
            responsive_web_edit_tweet_api_enabled: false,
            standardized_nudges_misinfo: false,
            longform_notetweets_rich_text_read_enabled: false,
            responsive_web_graphql_timeline_navigation_enabled: false,
            graphql_is_translatable_rweb_tweet_is_translatable_enabled: false,
            view_counts_everywhere_api_enabled: false,
            tweet_awards_web_tipping_enabled: false,
            verified_phone_label_enabled: false,
            responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
            blue_business_profile_image_shape_enabled: false
        });
        const fieldToggles = objectToParams({
            withArticleRichContentState: false,
        });
        if (cursor != null && cursor != '') {
            variableObj['cursor'] = cursor;
        }
        switch (searchMode) {
            case "Latest":
                variableObj.product = 'Latest';
                break;
            case "Photos":
                variableObj.product = 'Photos';
                break;
            case "Videos":
                variableObj.product = 'Videos';
                break;
            case "Users":
                variableObj.product = 'People';
                break;
            default:
                break;
        }
        const variables = objectToParams(variableObj);
        const headers = {
            authorization: `Bearer ${BEARER_TOKEN}`,
            cookie: this.cookie.getCookieExtensionStr()
        }
        this.installCsrfToken(headers);
        const response = await fetch(`https://api.twitter.com/graphql/gkjsKepM6gl_HmFWoWKfgg/SearchTimeline?variables=${variables}&fieldToggles=${fieldToggles}&features=${features}`, {
            method: 'GET',
            headers
        });
        if (!response.ok) {
            console.log('failed to search tweets response', await response.text());
        }
        const result = await response.json();
        return result;
    }

    installCsrfToken(headers) {
        const ct0 = this.cookie.getExtByKey('ct0');
        if (ct0) {
            headers['x-csrf-token'] = ct0;
        }
    }


}

export default ScraperManager;
export {ITweets, IScraperManager}
