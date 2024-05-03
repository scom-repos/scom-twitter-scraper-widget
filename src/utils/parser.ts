import {ITweets} from "../managers/scraperManager";

export default class Parser {

    reconstructTweetHtml(tweet: any, photos: any, videos: any) {
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

    parseVideo(m: any) {
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

    parseMediaGroups(media: any) {
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

    parseLegacyTweet(user: any, tweet: any) {
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

    parseAndPush(tweets: any, content: any, entryId: any, isConversation = false) {
        const tweet = this.parseTimelineEntryItemContentRaw(content, entryId, isConversation);
        if (tweet) {
            tweets.push(tweet);
        }
    }

    parseTimelineEntryItemContentRaw(content: any, entryId: string, isConversation = false) {
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

    parseResult(result: any) {
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

    parseTimelineTweetsV2(timeline: any): ITweets[] {
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

    parseRelationshipTimeline(timeline: any) {
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

    parseProfile(user: any, isBlueVerified?: boolean) {
        const profile: any = {
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

    private getAvatarOriginalSizeUrl(avatarUrl: string) {
        return avatarUrl ? avatarUrl.replace('_normal', '') : undefined;
    }
}
