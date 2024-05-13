export default class Parser {
    htmlToMarkdown(html: string): string;
    reconstructTweetHtml(tweet: any, photos: any, videos: any): any;
    parseVideo(m: any): any;
    parseMediaGroups(media: any): {
        sensitiveContent: any;
        photos: any[];
        videos: any[];
    };
    parseLegacyTweet(user: any, tweet: any): {
        success: boolean;
        err: Error;
        tweet?: undefined;
    } | {
        success: boolean;
        tweet: any;
        err?: undefined;
    };
    parseAndPush(tweets: any, content: any, entryId: any, isConversation?: boolean): void;
    parseTimelineEntryItemContentRaw(content: any, entryId: string, isConversation?: boolean): any;
    parseResult(result: any): {
        success: boolean;
        err: Error;
        tweet?: undefined;
    } | {
        success: boolean;
        tweet: any;
        err?: undefined;
    };
    parseTimelineTweetsV2(timeline: any): any[];
    parseRelationshipTimeline(timeline: any): {
        profiles: any[];
        next: any;
        previous: any;
    };
    parseProfile(user: any, isBlueVerified?: boolean): any;
    parseSearchTimelineUsers(timeline: any): {
        tweets: any[];
        next: any;
        previous: any;
    };
    private getAvatarOriginalSizeUrl;
}
