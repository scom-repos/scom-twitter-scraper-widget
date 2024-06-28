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
        var _a;
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
                var _a, _b, _c, _d;
                for (const entity of (_b = (_a = tweet.entities) === null || _a === void 0 ? void 0 : _a.urls) !== null && _b !== void 0 ? _b : []) {
                    if (tco === entity.url && entity.expanded_url != null) {
                        return `<a href="${entity.expanded_url}">${tco}</a>`;
                    }
                }
                for (const entity of (_d = (_c = tweet.extended_entities) === null || _c === void 0 ? void 0 : _c.media) !== null && _d !== void 0 ? _d : []) {
                    if (tco === entity.url && entity.media_url_https != null) {
                        foundedMedia.push(entity.media_url_https);
                        return `<br><a href="${tco}"><img src="${entity.media_url_https}"/></a>`;
                    }
                }
                return tco;
            };
        }
        const media = [];
        let html = (_a = tweet.full_text) !== null && _a !== void 0 ? _a : '';
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
        var _a, _b;
        const video = {
            id: m.id_str,
            preview: m.media_url_https,
        };
        let maxBitrate = 0;
        const variants = (_b = (_a = m.video_info) === null || _a === void 0 ? void 0 : _a.variants) !== null && _b !== void 0 ? _b : [];
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
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
        const hashtags = (_b = (_a = tweet.entities) === null || _a === void 0 ? void 0 : _a.hashtags) !== null && _b !== void 0 ? _b : [];
        const mentions = (_d = (_c = tweet.entities) === null || _c === void 0 ? void 0 : _c.user_mentions) !== null && _d !== void 0 ? _d : [];
        const media = (_f = (_e = tweet.extended_entities) === null || _e === void 0 ? void 0 : _e.media) !== null && _f !== void 0 ? _f : [];
        const pinnedTweets = new Set((_g = user.pinned_tweet_ids_str) !== null && _g !== void 0 ? _g : []);
        const urls = (_j = (_h = tweet.entities) === null || _h === void 0 ? void 0 : _h.urls) !== null && _j !== void 0 ? _j : [];
        const { photos, videos, sensitiveContent } = this.parseMediaGroups(media);
        let text = tweet.full_text;
        const textUrls = text.match(/\bhttps?:\/\/\S+/gi) || [];
        for (const url of textUrls) {
            const _url = urls.find(v => v.url === url);
            text = text.replaceAll(url, (_url === null || _url === void 0 ? void 0 : _url.expanded_url) || '');
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
        if ((_k = tweet.place) === null || _k === void 0 ? void 0 : _k.id) {
            tw.place = tweet.place;
        }
        const quotedStatusIdStr = tweet.quoted_status_id_str;
        const inReplyToStatusIdStr = tweet.in_reply_to_status_id_str;
        const retweetedStatusIdStr = tweet.retweeted_status_id_str;
        const retweetedStatusResult = (_l = tweet.retweeted_status_result) === null || _l === void 0 ? void 0 : _l.result;
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
                const parsedResult = this.parseLegacyTweet((_p = (_o = (_m = retweetedStatusResult === null || retweetedStatusResult === void 0 ? void 0 : retweetedStatusResult.core) === null || _m === void 0 ? void 0 : _m.user_results) === null || _o === void 0 ? void 0 : _o.result) === null || _p === void 0 ? void 0 : _p.legacy, retweetedStatusResult === null || retweetedStatusResult === void 0 ? void 0 : retweetedStatusResult.legacy);
                if (parsedResult.success) {
                    tw.retweetedStatus = parsedResult.tweet;
                }
            }
        }
        const views = parseInt((_r = (_q = tweet.ext_views) === null || _q === void 0 ? void 0 : _q.count) !== null && _r !== void 0 ? _r : '');
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
        var _a, _b, _c, _d;
        const result = (_b = (_a = content.tweet_results) === null || _a === void 0 ? void 0 : _a.result) !== null && _b !== void 0 ? _b : (_c = content.tweetResult) === null || _c === void 0 ? void 0 : _c.result;
        if ((result === null || result === void 0 ? void 0 : result.__typename) === 'Tweet') {
            if (result.legacy) {
                result.legacy.id_str =
                    (_d = result.rest_id) !== null && _d !== void 0 ? _d : entryId.replace('conversation-', '').replace('tweet-', '');
            }
            const tweetResult = this.parseResult(result);
            if (tweetResult.success) {
                if (isConversation) {
                    if ((content === null || content === void 0 ? void 0 : content.tweetDisplayType) === 'SelfThread') {
                        tweetResult.tweet.isSelfThread = true;
                    }
                }
                return tweetResult.tweet;
            }
        }
        return null;
    }
    parseResult(result) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const noteTweetResultText = (_c = (_b = (_a = result === null || result === void 0 ? void 0 : result.note_tweet) === null || _a === void 0 ? void 0 : _a.note_tweet_results) === null || _b === void 0 ? void 0 : _b.result) === null || _c === void 0 ? void 0 : _c.text;
        if ((result === null || result === void 0 ? void 0 : result.legacy) && noteTweetResultText) {
            result.legacy.full_text = noteTweetResultText;
        }
        const tweetResult = this.parseLegacyTweet((_f = (_e = (_d = result === null || result === void 0 ? void 0 : result.core) === null || _d === void 0 ? void 0 : _d.user_results) === null || _e === void 0 ? void 0 : _e.result) === null || _f === void 0 ? void 0 : _f.legacy, result === null || result === void 0 ? void 0 : result.legacy);
        if (!tweetResult.success) {
            return tweetResult;
        }
        if (!tweetResult.tweet.views && ((_g = result === null || result === void 0 ? void 0 : result.views) === null || _g === void 0 ? void 0 : _g.count)) {
            const views = parseInt(result.views.count);
            if (!isNaN(views)) {
                tweetResult.tweet.views = views;
            }
        }
        const quotedResult = (_h = result === null || result === void 0 ? void 0 : result.quoted_status_result) === null || _h === void 0 ? void 0 : _h.result;
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
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const expectedEntryTypes = ['tweet', 'profile-conversation'];
        let bottomCursor;
        let topCursor;
        const tweets = [];
        const instructions = (_f = (_e = (_d = (_c = (_b = (_a = timeline.data) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.result) === null || _c === void 0 ? void 0 : _c.timeline_v2) === null || _d === void 0 ? void 0 : _d.timeline) === null || _e === void 0 ? void 0 : _e.instructions) !== null && _f !== void 0 ? _f : [];
        for (const instruction of instructions) {
            const entries = (_g = instruction.entries) !== null && _g !== void 0 ? _g : [];
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
                        if ((_h = item.item) === null || _h === void 0 ? void 0 : _h.itemContent) {
                            this.parseAndPush(tweets, item.item.itemContent, idStr);
                        }
                    }
                }
            }
        }
        return { tweets, next: bottomCursor, previous: topCursor };
    }
    parseRelationshipTimeline(timeline) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        let bottomCursor;
        let topCursor;
        const profiles = [];
        const instructions = (_f = (_e = (_d = (_c = (_b = (_a = timeline.data) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.result) === null || _c === void 0 ? void 0 : _c.timeline) === null || _d === void 0 ? void 0 : _d.timeline) === null || _e === void 0 ? void 0 : _e.instructions) !== null && _f !== void 0 ? _f : [];
        for (const instruction of instructions) {
            if (instruction.type === 'TimelineAddEntries' ||
                instruction.type === 'TimelineReplaceEntry') {
                if (((_h = (_g = instruction.entry) === null || _g === void 0 ? void 0 : _g.content) === null || _h === void 0 ? void 0 : _h.cursorType) === 'Bottom') {
                    bottomCursor = instruction.entry.content.value;
                    continue;
                }
                if (((_k = (_j = instruction.entry) === null || _j === void 0 ? void 0 : _j.content) === null || _k === void 0 ? void 0 : _k.cursorType) === 'Top') {
                    topCursor = instruction.entry.content.value;
                    continue;
                }
                const entries = (_l = instruction.entries) !== null && _l !== void 0 ? _l : [];
                for (const entry of entries) {
                    const itemContent = (_m = entry.content) === null || _m === void 0 ? void 0 : _m.itemContent;
                    if ((itemContent === null || itemContent === void 0 ? void 0 : itemContent.userDisplayType) === 'User') {
                        const userResultRaw = (_o = itemContent.user_results) === null || _o === void 0 ? void 0 : _o.result;
                        if (userResultRaw === null || userResultRaw === void 0 ? void 0 : userResultRaw.legacy) {
                            const profile = this.parseProfile(userResultRaw.legacy, userResultRaw.is_blue_verified);
                            if (!profile.userId) {
                                profile.userId = userResultRaw.rest_id;
                            }
                            profiles.push(profile);
                        }
                    }
                    else if (((_p = entry.content) === null || _p === void 0 ? void 0 : _p.cursorType) === 'Bottom') {
                        bottomCursor = entry.content.value;
                    }
                    else if (((_q = entry.content) === null || _q === void 0 ? void 0 : _q.cursorType) === 'Top') {
                        topCursor = entry.content.value;
                    }
                }
            }
        }
        return { profiles, next: bottomCursor, previous: topCursor };
    }
    parseProfile(user, isBlueVerified) {
        var _a, _b, _c;
        const profile = {
            avatar: this.getAvatarOriginalSizeUrl(user.profile_image_url_https),
            banner: user.profile_banner_url,
            biography: user.description,
            followersCount: user.followers_count,
            followingCount: user.friends_count,
            friendsCount: user.friends_count,
            mediaCount: user.media_count,
            isPrivate: (_a = user.protected) !== null && _a !== void 0 ? _a : false,
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
            isBlueVerified: isBlueVerified !== null && isBlueVerified !== void 0 ? isBlueVerified : false,
            canDm: user.can_dm,
        };
        if (user.created_at != null) {
            profile.joined = new Date(Date.parse(user.created_at));
        }
        const urls = (_c = (_b = user.entities) === null || _b === void 0 ? void 0 : _b.url) === null || _c === void 0 ? void 0 : _c.urls;
        if ((urls === null || urls === void 0 ? void 0 : urls.length) != null && (urls === null || urls === void 0 ? void 0 : urls.length) > 0) {
            profile.website = urls[0].expanded_url;
        }
        return profile;
    }
    parseSearchTimelineUsers(timeline) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        let bottomCursor;
        let topCursor;
        const tweets = [];
        const instructions = (_e = (_d = (_c = (_b = (_a = timeline.data) === null || _a === void 0 ? void 0 : _a.search_by_raw_query) === null || _b === void 0 ? void 0 : _b.search_timeline) === null || _c === void 0 ? void 0 : _c.timeline) === null || _d === void 0 ? void 0 : _d.instructions) !== null && _e !== void 0 ? _e : [];
        for (const instruction of instructions) {
            if (instruction.type === 'TimelineAddEntries' ||
                instruction.type === 'TimelineReplaceEntry') {
                if (((_g = (_f = instruction.entry) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.cursorType) === 'Bottom') {
                    bottomCursor = instruction.entry.content.value;
                    continue;
                }
                else if (((_j = (_h = instruction.entry) === null || _h === void 0 ? void 0 : _h.content) === null || _j === void 0 ? void 0 : _j.cursorType) === 'Top') {
                    topCursor = instruction.entry.content.value;
                    continue;
                }
                const entries = (_k = instruction.entries) !== null && _k !== void 0 ? _k : [];
                for (const entry of entries) {
                    const itemContent = (_l = entry.content) === null || _l === void 0 ? void 0 : _l.itemContent;
                    if ((itemContent === null || itemContent === void 0 ? void 0 : itemContent.tweetDisplayType) === 'Tweet') {
                        const tweetResultRaw = (_m = itemContent.tweet_results) === null || _m === void 0 ? void 0 : _m.result;
                        const tweetResult = this.parseLegacyTweet((_q = (_p = (_o = tweetResultRaw === null || tweetResultRaw === void 0 ? void 0 : tweetResultRaw.core) === null || _o === void 0 ? void 0 : _o.user_results) === null || _p === void 0 ? void 0 : _p.result) === null || _q === void 0 ? void 0 : _q.legacy, tweetResultRaw === null || tweetResultRaw === void 0 ? void 0 : tweetResultRaw.legacy);
                        if (tweetResult.success) {
                            if (!tweetResult.tweet.views && ((_r = tweetResultRaw === null || tweetResultRaw === void 0 ? void 0 : tweetResultRaw.views) === null || _r === void 0 ? void 0 : _r.count)) {
                                const views = parseInt(tweetResultRaw.views.count);
                                if (!isNaN(views)) {
                                    tweetResult.tweet.views = views;
                                }
                            }
                            tweets.push(tweetResult.tweet);
                        }
                    }
                    else if (((_s = entry.content) === null || _s === void 0 ? void 0 : _s.cursorType) === 'Bottom') {
                        bottomCursor = entry.content.value;
                    }
                    else if (((_t = entry.content) === null || _t === void 0 ? void 0 : _t.cursorType) === 'Top') {
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
