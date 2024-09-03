export interface IPhoto {
    id: string;
    url: string;
}

export interface ITweet {
    conversationId: string;
    hashtags: any[],
    html: string;
    id: string;
    isPin: boolean;
    isQuoted: boolean;
    isReply: boolean;
    isRetweet: boolean;
    likes: number;
    markdown: string;
    mentions: any[];
    name: string;
    permanentUrl: string;
    photos: IPhoto[];
    replies: number;
    retweets: number;
    sensitiveContent: boolean;
    text: string;
    thread: any[];
    timeParsed: string;
    timestamp: number;
    urls: any[];
    userId: string;
    username: string;
    videos: any[];
    views: number;
}