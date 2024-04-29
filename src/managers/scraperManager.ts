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

const BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAFQODgEAAAAAVHTp76lzh3rFzcHbmHVvQxYYpTw%3DckAlMINMjmCwxUcaXbAN4XqJVdgMJaHqNOFgPMK0zN1qLqLQCF';
const ACTIVATE_GUEST_API = 'https://api.twitter.com/1.1/guest/activate.json';
const GET_USER_BY_SCREENAME = 'https://twitter.com/i/api/graphql/G3KGOASz96M-Qu0nwmGXNg/UserByScreenName';
const GET_TWEETS_BY_USER_ID = 'https://twitter.com/i/api/graphql/H8OOoI-5ZE4NxgRr8lfyWg/UserTweets';
const GET_TWEET_BY_ID = 'https://twitter.com/i/api/graphql/DJS3BdhUhcaEpZ7B7irJDg/TweetResultByRestId';
const GET_FOLLOWERS_BY_USER_ID = 'https://twitter.com/i/api/graphql/8_LQHLk29Jl_i_hfSC25AA/Followers';
const SEARCH_API = 'https://twitter.com/i/api/2/search/adaptive.json';

class ScraperManager {

    async getUserIdByUserName(username: string): Promise<string> {
        const variables = encodeURIComponent(JSON.stringify({'screen_name': username, withSafetyModeUserFields: true}));
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
        const guestToken = await this.getGuestToken();
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
        console.log('getGuestToken')
        const guestToken = await this.getGuestToken();
        console.log('guestToken', guestToken)
        if (!guestToken) return null;
        const userId = await this.getUserIdByUserName(username);
        if (!userId)
            return null;
        const variables = encodeURIComponent(JSON.stringify({
            count: maxTweets ?? 200,
            includePromotedContent: true,
            userId,
            withQuickPromoteEligibilityTweetFields: true,
            withV2Timeline: true,
            withVoice: true
        }))
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
        const response = await fetch(`${GET_TWEETS_BY_USER_ID}?variables=${variables}&features=${features}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${BEARER_TOKEN}`,
                'x-guest-token': guestToken
            }
        });
        if (!response.ok) return null;
        const result = await response.json();
        const tweets = this.parseTimelineTweetsV2(result);
        return tweets;
    }


    async getTweetByTweetId(tweetId: string): Promise<ITweets> {
        const guestToken = await this.getGuestToken();
        if (!guestToken) return null;
        const variables = encodeURIComponent(JSON.stringify({
            "tweetId": tweetId,
            "includePromotedContent": false,
            "withCommunity": false,
            "withVoice": false,
        }));
        const features = encodeURIComponent(JSON.stringify({
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
        }));
        const response = await fetch(`${GET_TWEET_BY_ID}?variables=${variables}&features=${features}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${BEARER_TOKEN}`,
                'x-guest-token': guestToken
            }
        });
        if (!response.ok) return null;
        const result = await response.json();
        const data = this.parseTimelineEntryItemContentRaw(result.data, tweetId);
        return data;
    }

    async getFollowersByUserId(userId: string, count?: number) {
        const guestToken = await this.getGuestToken();
        if (!guestToken) return null;
        const variables = encodeURIComponent(JSON.stringify({
            "userId": userId,
            "count": count ?? 20,
            "includePromotedContent": false,
            "withSuperFollowsUserFields": true,
            "withDownvotePerspective": false,
            "withReactionsMetadata": false,
            "withReactionsPerspective": false,
            "withSuperFollowsTweetFields": true,
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
        const response = await fetch(`${GET_FOLLOWERS_BY_USER_ID}?variables=${variables}&features=${features}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${BEARER_TOKEN}`,
                'x-guest-token': guestToken
            }
        });
        console.log('response', response)
        if (!response.ok) return null;
    }


    private async getGuestToken(): Promise<string> {
        const response = await fetch(ACTIVATE_GUEST_API, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${BEARER_TOKEN}`,
            }
        });
        if (response.ok) {
            const result = await response.json();
            return result['guest_token'];
        } else return null;
    }

    // Result Parser
    private reconstructTweetHtml(tweet: any, photos: any, videos: any) {
        const reHashtag = /\B(\#\S+\b)/g;
        const reCashtag = /\B(\$\S+\b)/g;
        const reTwitterUrl = /https:(\/\/t\.co\/([A-Za-z0-9]|[A-Za-z]){10})/g;
        const reUsername = /\B(\@\S{1,15}\b)/g;

        function linkHashtagHtml(hashtag: string) {
            return `<a href="https://twitter.com/hashtag/${hashtag.replace('#', '')}">${hashtag}</a>`;
        }

        function linkCashtagHtml(cashtag: string) {
            return `<a href="https://twitter.com/search?q=%24${cashtag.replace('$', '')}">${cashtag}</a>`;
        }

        function linkUsernameHtml(username: string) {
            return `<a href="https://twitter.com/${username.replace('@', '')}">${username}</a>`;
        }

        function unwrapTcoUrlHtml(tweet: any, foundedMedia: any[]) {
            return function (tco: string) {
                for (const entity of tweet.entities?.urls ?? []) {
                    if (tco === entity.url && entity.expanded_url != null) {
                        return `<a href="${entity.expanded_url}">${tco}</a>`;
                    }
                }
                for (const entity of tweet.extended_entities?.media ?? []) {
                    if (tco === entity.url && entity.media_url_https != null) {
                        foundedMedia.push(entity.media_url_https);
                        return `<br><a href="${tco}"><img src="${entity.media_url_https}"/></a>`;
                    }
                }
                return tco;
            };
        }

        const media: any[] = [];
        // HTML parsing with regex :)
        let html = tweet.full_text ?? '';
        html = html.replace(reHashtag, linkHashtagHtml);
        html = html.replace(reCashtag, linkCashtagHtml);
        html = html.replace(reUsername, linkUsernameHtml);
        html = html.replace(reTwitterUrl, unwrapTcoUrlHtml(tweet, media));
        for (const {url} of photos) {
            if (media.indexOf(url) !== -1) {
                continue;
            }
            html += `<br><img src="${url}"/>`;
        }
        for (const {preview: url} of videos) {
            if (media.indexOf(url) !== -1) {
                continue;
            }
            html += `<br><img src="${url}"/>`;
        }
        html = html.replace(/\n/g, '<br>');
        return html;
    }

    private parseVideo(m: any) {
        const video: any = {
            id: m.id_str,
            preview: m.media_url_https,
        };
        let maxBitrate = 0;
        const variants = m.video_info?.variants ?? [];
        for (const variant of variants) {
            const bitrate = variant.bitrate;
            if (bitrate != null && bitrate > maxBitrate && variant.url != null) {
                let variantUrl = variant.url;
                const stringStart = 0;
                const tagSuffixIdx = variantUrl.indexOf('?tag=10');
                if (tagSuffixIdx !== -1) {
                    variantUrl = variantUrl.substring(stringStart, tagSuffixIdx + 1);
                }
                video.url = variantUrl;
                maxBitrate = bitrate;
            }
        }
        return video;
    }

    private parseMediaGroups(media: any) {
        const photos = [];
        const videos = [];
        let sensitiveContent = undefined;
        for (const m of media
            .filter((m: any) => m['id_str'] != null)
            .filter((m: any) => m['media_url_https'] != null)) {
            if (m.type === 'photo') {
                photos.push({
                    id: m.id_str,
                    url: m.media_url_https,
                    alt_text: m.ext_alt_text,
                });
            } else if (m.type === 'video') {
                videos.push(this.parseVideo(m));
            }
            const sensitive = m.ext_sensitive_media_warning;
            if (sensitive != null) {
                sensitiveContent =
                    sensitive.adult_content ||
                    sensitive.graphic_violence ||
                    sensitive.other;
            }
        }
        return {sensitiveContent, photos, videos};
    }

    private parseLegacyTweet(user: any, tweet: any) {
        if (tweet == null) {
            return {
                success: false,
                err: new Error('Tweet was not found in the timeline object.'),
            };
        }
        if (user == null) {
            return {
                success: false,
                err: new Error('User was not found in the timeline object.'),
            };
        }
        if (!tweet.id_str) {
            if (!tweet.conversation_id_str) {
                return {
                    success: false,
                    err: new Error('Tweet ID was not found in object.'),
                };
            }
            tweet.id_str = tweet.conversation_id_str;
        }
        const hashtags = tweet.entities?.hashtags ?? [];
        const mentions = tweet.entities?.user_mentions ?? [];
        const media = tweet.extended_entities?.media ?? [];
        const pinnedTweets = new Set(user.pinned_tweet_ids_str ?? []);
        const urls = tweet.entities?.urls ?? [];
        const {photos, videos, sensitiveContent} = this.parseMediaGroups(media);
        const tw: any = {
            conversationId: tweet.conversation_id_str,
            id: tweet.id_str,
            hashtags: hashtags
                .filter((hashtag: any) => hashtag['text'] != null)
                .map((hashtag: any) => hashtag.text),
            likes: tweet.favorite_count,
            mentions: mentions.filter((mention: any) => mention['id_str'] != null).map((mention: any) => ({
                id: mention.id_str,
                username: mention.screen_name,
                name: mention.name,
            })),
            name: user.name,
            permanentUrl: `https://twitter.com/${user.screen_name}/status/${tweet.id_str}`,
            photos,
            replies: tweet.reply_count,
            retweets: tweet.retweet_count,
            text: tweet.full_text,
            thread: [],
            urls: urls
                .filter((url: any) => url['expanded_url'] != null)
                .map((url: any) => url.expanded_url),
            userId: tweet.user_id_str,
            username: user.screen_name,
            videos,
            isQuoted: false,
            isReply: false,
            isRetweet: false,
            isPin: false,
            sensitiveContent: false,
        };
        if (tweet.created_at) {
            tw.timeParsed = new Date(Date.parse(tweet.created_at));
            tw.timestamp = Math.floor(tw.timeParsed.valueOf() / 1000);
        }
        if (tweet.place?.id) {
            tw.place = tweet.place;
        }
        const quotedStatusIdStr = tweet.quoted_status_id_str;
        const inReplyToStatusIdStr = tweet.in_reply_to_status_id_str;
        const retweetedStatusIdStr = tweet.retweeted_status_id_str;
        const retweetedStatusResult = tweet.retweeted_status_result?.result;
        if (quotedStatusIdStr) {
            tw.isQuoted = true;
            tw.quotedStatusId = quotedStatusIdStr;
        }
        if (inReplyToStatusIdStr) {
            tw.isReply = true;
            tw.inReplyToStatusId = inReplyToStatusIdStr;
        }
        if (retweetedStatusIdStr || retweetedStatusResult) {
            tw.isRetweet = true;
            tw.retweetedStatusId = retweetedStatusIdStr;
            if (retweetedStatusResult) {
                const parsedResult = this.parseLegacyTweet(retweetedStatusResult?.core?.user_results?.result?.legacy, retweetedStatusResult?.legacy);
                if (parsedResult.success) {
                    tw.retweetedStatus = parsedResult.tweet;
                }
            }
        }
        const views = parseInt(tweet.ext_views?.count ?? '');
        if (!isNaN(views)) {
            tw.views = views;
        }
        if (pinnedTweets.has(tweet.id_str)) {
            // TODO: Update tests so this can be assigned at the tweet declaration
            tw.isPin = true;
        }
        if (sensitiveContent) {
            // TODO: Update tests so this can be assigned at the tweet declaration
            tw.sensitiveContent = true;
        }
        tw.html = this.reconstructTweetHtml(tweet, tw.photos, tw.videos);
        return {success: true, tweet: tw};
    }

    private parseAndPush(tweets: any, content: any, entryId: any, isConversation = false) {
        const tweet = this.parseTimelineEntryItemContentRaw(content, entryId, isConversation);
        if (tweet) {
            tweets.push(tweet);
        }
    }

    private parseTimelineEntryItemContentRaw(content: any, entryId: string, isConversation = false) {
        const result = content.tweet_results?.result ?? content.tweetResult?.result;
        if (result?.__typename === 'Tweet') {
            if (result.legacy) {
                result.legacy.id_str =
                    result.rest_id ??
                    entryId.replace('conversation-', '').replace('tweet-', '');
            }
            const tweetResult = this.parseResult(result);
            if (tweetResult.success) {
                if (isConversation) {
                    if (content?.tweetDisplayType === 'SelfThread') {
                        tweetResult.tweet.isSelfThread = true;
                    }
                }
                return tweetResult.tweet;
            }
        }
        return null;
    }

    private parseResult(result: any) {
        const noteTweetResultText = result?.note_tweet?.note_tweet_results?.result?.text;
        if (result?.legacy && noteTweetResultText) {
            result.legacy.full_text = noteTweetResultText;
        }
        const tweetResult = this.parseLegacyTweet(result?.core?.user_results?.result?.legacy, result?.legacy);
        if (!tweetResult.success) {
            return tweetResult;
        }
        if (!tweetResult.tweet.views && result?.views?.count) {
            const views = parseInt(result.views.count);
            if (!isNaN(views)) {
                tweetResult.tweet.views = views;
            }
        }
        const quotedResult = result?.quoted_status_result?.result;
        if (quotedResult) {
            if (quotedResult.legacy && quotedResult.rest_id) {
                quotedResult.legacy.id_str = quotedResult.rest_id;
            }
            const quotedTweetResult = this.parseResult(quotedResult);
            if (quotedTweetResult.success) {
                tweetResult.tweet.quotedStatus = quotedTweetResult.tweet;
            }
        }
        return tweetResult;
    }

    private parseTimelineTweetsV2(timeline: any): ITweets[] {
        const expectedEntryTypes = ['tweet', 'profile-conversation'];
        let bottomCursor;
        let topCursor;
        const tweets: ITweets[] = [];
        const instructions = timeline.data?.user?.result?.timeline_v2?.timeline?.instructions ?? [];
        for (const instruction of instructions) {
            const entries = instruction.entries ?? [];
            for (const entry of entries) {
                const entryContent = entry.content;
                if (!entryContent)
                    continue;
                // Handle pagination
                if (entryContent.cursorType === 'Bottom') {
                    bottomCursor = entryContent.value;
                    continue;
                } else if (entryContent.cursorType === 'Top') {
                    topCursor = entryContent.value;
                    continue;
                }
                const idStr = entry.entryId;
                if (!expectedEntryTypes.some((entryType) => idStr.startsWith(entryType))) {
                    continue;
                }
                if (entryContent.itemContent) {
                    // Typically TimelineTimelineTweet entries
                    this.parseAndPush(tweets, entryContent.itemContent, idStr);
                } else if (entryContent.items) {
                    // Typically TimelineTimelineModule entries
                    for (const item of entryContent.items) {
                        if (item.item?.itemContent) {
                            this.parseAndPush(tweets, item.item.itemContent, idStr);
                        }
                    }
                }
            }
        }
        return tweets;
    }
}

export default ScraperManager;
export {ITweets, IScraperManager}
