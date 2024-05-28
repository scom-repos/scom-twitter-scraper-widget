"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Parser {
    htmlToMarkdown(html) {
        let markdown = '';
        html = html.replace(/<br\s*\/?>/gi, '\n');
        html = html.replace(/<(strong|b)\b[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**');
        html = html.replace(/<(em|i)\b[^>]*>(.*?)<\/(em|i)>/gi, '*$2*');
        html = html.replace(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*>(.*?)<\/a>/gi, '[$3]($2)');
        html = html.replace(/<img\b[^>]+?alt=(['"])(.*?)\1[^>]+?src=(['"])(.*?)\3[^>]*>/gi, '![alt]($4)');
        for (let i = 6; i >= 1; i--) {
            html = html.replace(new RegExp('<h' + i + '\\b[^>]*>(.*?)</h' + i + '>', 'gi'), '#$1\n');
        }
        html = html.replace(/<p\b[^>]*>(.*?)<\/p>/gi, '$1\n');
        html = html.replace(/<ul\b[^>]*>(.*?)<\/ul>/gi, (_, content) => {
            return content.replace(/<li\b[^>]*>(.*?)<\/li>/gi, '- $1\n');
        });
        html = html.replace(/<ol\b[^>]*>(.*?)<\/ol>/gi, (_, content) => {
            let index = 0;
            return content.replace(/<li\b[^>]*>(.*?)<\/li>/gi, (_, item) => {
                index++;
                return `${index}. ${item}\n`;
            });
        });
        html = html.replace(/<[^>]*>/g, '');
        markdown += html;
        return markdown;
    }
    reconstructTweetHtml(tweet, photos, videos) {
        const reHashtag = /\B(\#\S+\b)/g;
        const reCashtag = /\B(\$\S+\b)/g;
        const reTwitterUrl = /https:(\/\/t\.co\/([A-Za-z0-9]|[A-Za-z]){10})/g;
        const reUsername = /\B(\@\S{1,15}\b)/g;
        function linkHashtagHtml(hashtag) {
            return `<a href="https://twitter.com/hashtag/${hashtag.replace('#', '')}">${hashtag}</a>`;
        }
        function linkCashtagHtml(cashtag) {
            return `<a href="https://twitter.com/search?q=%24${cashtag.replace('$', '')}">${cashtag}</a>`;
        }
        function linkUsernameHtml(username) {
            return `<a href="https://twitter.com/${username.replace('@', '')}">${username}</a>`;
        }
        function unwrapTcoUrlHtml(tweet, foundedMedia) {
            return function (tco) {
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
        const media = [];
        let html = tweet.full_text ?? '';
        html = html.replace(reHashtag, linkHashtagHtml);
        html = html.replace(reCashtag, linkCashtagHtml);
        html = html.replace(reUsername, linkUsernameHtml);
        html = html.replace(reTwitterUrl, unwrapTcoUrlHtml(tweet, media));
        for (const { url } of photos) {
            if (media.indexOf(url) !== -1) {
                continue;
            }
            html += `<br><img src="${url}"/>`;
        }
        for (const { preview: url } of videos) {
            if (media.indexOf(url) !== -1) {
                continue;
            }
            html += `<br><img src="${url}"/>`;
        }
        html = html.replace(/\n/g, '<br>');
        return html;
    }
    parseVideo(m) {
        const video = {
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
    parseMediaGroups(media) {
        const photos = [];
        const videos = [];
        let sensitiveContent = undefined;
        for (const m of media
            .filter((m) => m['id_str'] != null)
            .filter((m) => m['media_url_https'] != null)) {
            if (m.type === 'photo') {
                photos.push({
                    id: m.id_str,
                    url: m.media_url_https,
                    alt_text: m.ext_alt_text,
                });
            }
            else if (m.type === 'video') {
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
        return { sensitiveContent, photos, videos };
    }
    parseLegacyTweet(user, tweet) {
        console.log(tweet);
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
        const { photos, videos, sensitiveContent } = this.parseMediaGroups(media);
        let text = tweet.full_text;
        for (const u of urls) {
            text = text.replaceAll(u.url, u.expanded_url);
        }
        if (photos.length > 0) {
            for (const photo of photos) {
                text += ` \n${photo.url}`;
            }
        }
        const tw = {
            conversationId: tweet.conversation_id_str,
            id: tweet.id_str,
            hashtags: hashtags
                .filter((hashtag) => hashtag['text'] != null)
                .map((hashtag) => hashtag.text),
            likes: tweet.favorite_count,
            mentions: mentions.filter((mention) => mention['id_str'] != null).map((mention) => ({
                id: mention.id_str,
                username: mention.screen_name,
                name: mention.name,
            })),
            name: user.name,
            permanentUrl: `https://twitter.com/${user.screen_name}/status/${tweet.id_str}`,
            photos,
            replies: tweet.reply_count,
            retweets: tweet.retweet_count,
            text: text,
            thread: [],
            urls: urls
                .filter((url) => url['expanded_url'] != null)
                .map((url) => url.expanded_url),
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
            tw.isPin = true;
        }
        if (sensitiveContent) {
            tw.sensitiveContent = true;
        }
        tw.html = this.reconstructTweetHtml(tweet, tw.photos, tw.videos);
        tw.markdown = this.htmlToMarkdown(tw.html);
        return { success: true, tweet: tw };
    }
    parseAndPush(tweets, content, entryId, isConversation = false) {
        const tweet = this.parseTimelineEntryItemContentRaw(content, entryId, isConversation);
        if (tweet) {
            tweets.push(tweet);
        }
    }
    parseTimelineEntryItemContentRaw(content, entryId, isConversation = false) {
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
    parseResult(result) {
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
    parseTimelineTweetsV2(timeline) {
        const expectedEntryTypes = ['tweet', 'profile-conversation'];
        let bottomCursor;
        let topCursor;
        const tweets = [];
        const instructions = timeline.data?.user?.result?.timeline_v2?.timeline?.instructions ?? [];
        for (const instruction of instructions) {
            const entries = instruction.entries ?? [];
            for (const entry of entries) {
                const entryContent = entry.content;
                if (!entryContent)
                    continue;
                if (entryContent.cursorType === 'Bottom') {
                    bottomCursor = entryContent.value;
                    continue;
                }
                else if (entryContent.cursorType === 'Top') {
                    topCursor = entryContent.value;
                    continue;
                }
                const idStr = entry.entryId;
                if (!expectedEntryTypes.some((entryType) => idStr.startsWith(entryType))) {
                    continue;
                }
                if (entryContent.itemContent) {
                    this.parseAndPush(tweets, entryContent.itemContent, idStr);
                }
                else if (entryContent.items) {
                    for (const item of entryContent.items) {
                        if (item.item?.itemContent) {
                            this.parseAndPush(tweets, item.item.itemContent, idStr);
                        }
                    }
                }
            }
        }
        return { tweets, next: bottomCursor, previous: topCursor };
    }
    parseRelationshipTimeline(timeline) {
        let bottomCursor;
        let topCursor;
        const profiles = [];
        const instructions = timeline.data?.user?.result?.timeline?.timeline?.instructions ?? [];
        for (const instruction of instructions) {
            if (instruction.type === 'TimelineAddEntries' ||
                instruction.type === 'TimelineReplaceEntry') {
                if (instruction.entry?.content?.cursorType === 'Bottom') {
                    bottomCursor = instruction.entry.content.value;
                    continue;
                }
                if (instruction.entry?.content?.cursorType === 'Top') {
                    topCursor = instruction.entry.content.value;
                    continue;
                }
                const entries = instruction.entries ?? [];
                for (const entry of entries) {
                    const itemContent = entry.content?.itemContent;
                    if (itemContent?.userDisplayType === 'User') {
                        const userResultRaw = itemContent.user_results?.result;
                        if (userResultRaw?.legacy) {
                            const profile = this.parseProfile(userResultRaw.legacy, userResultRaw.is_blue_verified);
                            if (!profile.userId) {
                                profile.userId = userResultRaw.rest_id;
                            }
                            profiles.push(profile);
                        }
                    }
                    else if (entry.content?.cursorType === 'Bottom') {
                        bottomCursor = entry.content.value;
                    }
                    else if (entry.content?.cursorType === 'Top') {
                        topCursor = entry.content.value;
                    }
                }
            }
        }
        return { profiles, next: bottomCursor, previous: topCursor };
    }
    parseProfile(user, isBlueVerified) {
        const profile = {
            avatar: this.getAvatarOriginalSizeUrl(user.profile_image_url_https),
            banner: user.profile_banner_url,
            biography: user.description,
            followersCount: user.followers_count,
            followingCount: user.friends_count,
            friendsCount: user.friends_count,
            mediaCount: user.media_count,
            isPrivate: user.protected ?? false,
            isVerified: user.verified,
            likesCount: user.favourites_count,
            listedCount: user.listed_count,
            location: user.location,
            name: user.name,
            pinnedTweetIds: user.pinned_tweet_ids_str,
            tweetsCount: user.statuses_count,
            url: `https://twitter.com/${user.screen_name}`,
            userId: user.id_str,
            username: user.screen_name,
            isBlueVerified: isBlueVerified ?? false,
            canDm: user.can_dm,
        };
        if (user.created_at != null) {
            profile.joined = new Date(Date.parse(user.created_at));
        }
        const urls = user.entities?.url?.urls;
        if (urls?.length != null && urls?.length > 0) {
            profile.website = urls[0].expanded_url;
        }
        return profile;
    }
    parseSearchTimelineUsers(timeline) {
        let bottomCursor;
        let topCursor;
        const tweets = [];
        const instructions = timeline.data?.search_by_raw_query?.search_timeline?.timeline
            ?.instructions ?? [];
        for (const instruction of instructions) {
            if (instruction.type === 'TimelineAddEntries' ||
                instruction.type === 'TimelineReplaceEntry') {
                if (instruction.entry?.content?.cursorType === 'Bottom') {
                    bottomCursor = instruction.entry.content.value;
                    continue;
                }
                else if (instruction.entry?.content?.cursorType === 'Top') {
                    topCursor = instruction.entry.content.value;
                    continue;
                }
                const entries = instruction.entries ?? [];
                for (const entry of entries) {
                    const itemContent = entry.content?.itemContent;
                    if (itemContent?.tweetDisplayType === 'Tweet') {
                        const tweetResultRaw = itemContent.tweet_results?.result;
                        const tweetResult = this.parseLegacyTweet(tweetResultRaw?.core?.user_results?.result?.legacy, tweetResultRaw?.legacy);
                        if (tweetResult.success) {
                            if (!tweetResult.tweet.views && tweetResultRaw?.views?.count) {
                                const views = parseInt(tweetResultRaw.views.count);
                                if (!isNaN(views)) {
                                    tweetResult.tweet.views = views;
                                }
                            }
                            tweets.push(tweetResult.tweet);
                        }
                    }
                    else if (entry.content?.cursorType === 'Bottom') {
                        bottomCursor = entry.content.value;
                    }
                    else if (entry.content?.cursorType === 'Top') {
                        topCursor = entry.content.value;
                    }
                }
            }
        }
        return { tweets, next: bottomCursor, previous: topCursor };
    }
    getAvatarOriginalSizeUrl(avatarUrl) {
        return avatarUrl ? avatarUrl.replace('_normal', '') : undefined;
    }
}
exports.default = Parser;
