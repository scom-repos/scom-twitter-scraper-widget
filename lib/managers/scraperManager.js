"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperManager = void 0;
const auth_1 = __importDefault(require("../utils/auth"));
const const_1 = require("../const");
const cookie_1 = __importDefault(require("../utils/cookie"));
const parser_1 = __importDefault(require("../utils/parser"));
const API_1 = __importDefault(require("../utils/API"));
class ScraperManager {
    constructor() {
        this.parser = new parser_1.default();
        this.cookie = new cookie_1.default();
        this.auth = new auth_1.default(this.cookie);
        this.api = new API_1.default(this.auth, this.cookie);
    }
    async getProfile(username) {
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
                    responsive_web_graphql_timeline_navigation_enabled: true
                },
                fieldToggles: {
                    withAuxiliaryUserLabels: false
                }
            };
            const result = await this.api.fetchAnonymous(const_1.GET_USER_BY_SCREENAME, 'GET', params);
            const user = result.data.user.result;
            return this.parser.parseProfile(user.legacy, user.is_blue_verified);
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async getUserIdByScreenName(username) {
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
                    responsive_web_graphql_timeline_navigation_enabled: true
                },
                fieldToggles: {
                    withAuxiliaryUserLabels: false
                }
            };
            const result = await this.api.fetchAnonymous(const_1.GET_USER_BY_SCREENAME, 'GET', params);
            return result.data.user.result['rest_id'];
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async searchTweets(credentials, query, maxTweets = 50) {
        await this.auth.login(credentials.username, credentials.password);
        return this.getTweetTimeline(query, maxTweets, (query, maxTweets, cursor) => {
            return this.fetchSearchTweets(query, maxTweets, cursor);
        });
    }
    async fetchSearchTweets(query, maxTweets = 50, cursor) {
        const timeline = await this.getSearchTimeline(query, maxTweets, cursor);
        return this.parser.parseSearchTimelineUsers(timeline);
    }
    async getTweetsByUserName(username, maxTweets) {
        await this.auth.updateGuestToken();
        const result = await this.getTweetTimeline(username, maxTweets, async (q, mt, c) => {
            const userId = await this.getUserIdByScreenName(username);
            if (!userId)
                return null;
            return this.fetchTweets(userId, mt, c);
        });
        console.log('result', result);
        return result;
    }
    async fetchTweets(userId, maxTweets, cursor) {
        const params = {
            variables: {
                count: maxTweets ?? 200,
                includePromotedContent: true,
                userId,
                withQuickPromoteEligibilityTweetFields: true,
                withV2Timeline: true,
                withVoice: true
            },
            features: {
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
            }
        };
        if (cursor != null && cursor != '') {
            params.variables['cursor'] = cursor;
        }
        const result = await this.api.fetchAnonymous(const_1.GET_TWEETS_BY_USER_ID, 'GET', params);
        return this.parser.parseTimelineTweetsV2(result);
    }
    async getTweetByTweetId(tweetId) {
        await this.auth.updateGuestToken();
        const params = {
            variables: {
                "tweetId": tweetId,
                "includePromotedContent": false,
                "withCommunity": false,
                "withVoice": false,
            },
            features: {
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
            }
        };
        const result = await this.api.fetchAnonymous(const_1.GET_TWEET_BY_ID, 'GET', params);
        return this.parser.parseTimelineEntryItemContentRaw(result.data, tweetId);
    }
    async getFollowersByUserName(credentials, username, count) {
        const userId = await this.getUserIdByScreenName(username);
        if (!userId)
            return null;
        return this.getFollowersByUserId(credentials, userId, count);
    }
    async getFollowersByUserId(credentials, userId, count) {
        await this.auth.login(credentials.username, credentials.password);
        const followers = await this.getUserTimeline(userId, 50, this.fetchProfileFollowers.bind(this));
        return followers;
    }
    async fetchProfileFollowers(userId, count = 50, cursor) {
        const variableObj = {
            "userId": userId,
            "count": count ?? 20,
            "includePromotedContent": false
        };
        if (cursor != null && cursor != '') {
            variableObj['cursor'] = cursor;
        }
        const params = {
            variables: variableObj,
            features: {
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
            }
        };
        const result = await this.api.fetch(const_1.GET_FOLLOWERS_BY_USER_ID, 'GET', params);
        return this.parser.parseRelationshipTimeline(result);
    }
    async getFollowingByUserName(credentials, username, count) {
        const userId = await this.getUserIdByScreenName(username);
        if (!userId)
            return null;
        return this.getFollowersByUserId(credentials, userId, count);
    }
    async getFollowingByUserId(credentials, userId, count) {
        await this.auth.login(credentials.username, credentials.password);
        const followers = await this.getUserTimeline(userId, 50, this.fetchProfileFollowering.bind(this));
        return followers;
    }
    async fetchProfileFollowering(userId, count = 50, cursor) {
        const variableObj = {
            "userId": userId,
            "count": count ?? 20,
            "includePromotedContent": false
        };
        if (cursor != null && cursor != '') {
            variableObj['cursor'] = cursor;
        }
        const params = {
            variables: variableObj,
            features: {
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
            }
        };
        const result = await this.api.fetch(const_1.GET_FOLLOWING_BY_USER_ID, 'GET', params);
        return this.parser.parseRelationshipTimeline(result);
    }
    async getUserTimeline(userId, maxProfiles = 50, fetchFunc) {
        let nProfiles = 0;
        let cursor = undefined;
        let consecutiveEmptyBatches = 0;
        while (nProfiles < maxProfiles) {
            const batch = await fetchFunc(userId, maxProfiles, cursor);
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
    async getTweetTimeline(query, maxTweets = 50, fetchFunc) {
        let nTweets = 0;
        let cursor = undefined;
        const tweetsList = [];
        while (nTweets < maxTweets) {
            const batch = await fetchFunc(query, maxTweets, cursor);
            const { tweets, next } = batch;
            if (tweets.length === 0) {
                break;
            }
            for (const tweet of tweets) {
                if (nTweets < maxTweets) {
                    cursor = next;
                    tweetsList.push(tweet);
                }
                else {
                    break;
                }
                nTweets++;
            }
        }
        return tweetsList;
    }
    async getSearchTimeline(query, maxItems, cursor, searchMode) {
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
        const params = {
            variables: variableObj,
            features: {
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
            },
            fieldToggles: {
                withArticleRichContentState: false,
            }
        };
        return this.api.fetch(const_1.SEARCH_TIMELINE, 'GET', params);
    }
}
exports.ScraperManager = ScraperManager;
