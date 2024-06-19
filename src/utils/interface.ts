interface IAccount {
    username: string;
    password: string;
    emailAddress: string;
}

interface IConfig {
    twitterAccounts: IAccount[];
}

interface ICredential {
    username: string;
    password: string;
}

interface ITweet {
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

export {
    IAccount,
    ITweet,
    IConfig,
    ICredential
}