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
declare class ScraperManager {
    getUserIdByUserName(username: string): Promise<string>;
    getTweetsByUserName(username: string, maxTweets?: number): Promise<ITweets[]>;
    private getGuestToken;
    private reconstructTweetHtml;
    private parseVideo;
    private parseMediaGroups;
    private parseLegacyTweet;
    private parseAndPush;
    private parseTimelineEntryItemContentRaw;
    private parseResult;
    private parseTimelineTweetsV2;
}
export default ScraperManager;
export { ITweets, IScraperManager };
