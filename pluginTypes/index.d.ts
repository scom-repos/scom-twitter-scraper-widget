/// <amd-module name="@scom/scom-twitter-scraper/utils/interface.ts" />
declare module "@scom/scom-twitter-scraper/utils/interface.ts" {
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
    export { IAccount, ITweet, IConfig, ICredential };
}
/// <amd-module name="@scom/scom-twitter-scraper/index.css.ts" />
declare module "@scom/scom-twitter-scraper/index.css.ts" {
    export const tweetPreviewStyle: string;
    export const paginationStyle: string;
    export const textCenterStyle: string;
}
/// <amd-module name="@scom/scom-twitter-scraper" />
declare module "@scom/scom-twitter-scraper" {
    import { ControlElement, Module } from '@ijstech/components';
    import { ITweet } from "@scom/scom-twitter-scraper/utils/interface.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['scom-social--import-tweets-module']: ImportTweetsModuleElement;
            }
        }
    }
    interface ImportTweetsModuleElement extends ControlElement {
        refreshPosts: () => Promise<void>;
        onSubmit: (tweets: ITweet) => Promise<void>;
    }
    interface IImportTweetsOption {
        scraperBotApiBaseUrl: string;
    }
    export class ImportTweetsModule extends Module {
        private btnSearch;
        private btnBack;
        private btnImport;
        private edtName;
        private lbWarn;
        private switchMaxTweets;
        private edtMaxTweets;
        private switchSince;
        private edtSince;
        private edtTil;
        private pnlSearch;
        private pnlLoading;
        private pnlFailed;
        private lbFailedMessage;
        private lbDateRangeError;
        private lbMaxTweetsError;
        private pnlResult;
        private tweetsList;
        private lbTweetsCount;
        private lbSelectedTweetsCount;
        private chkAll;
        private pgnTweets;
        private allTweets;
        private checkedTweets;
        private isImporting;
        private _scraperBotApiBaseUrl;
        onSubmit: (tweets: ITweet[]) => Promise<void>;
        refreshPosts: () => Promise<void>;
        constructor(options: IImportTweetsOption);
        init(): void;
        clear(): void;
        private getTweets;
        private handleSearch;
        private handlePageChange;
        private handleBackClick;
        private handleSubmit;
        private resetInputs;
        private enableInputs;
        private onNameChanged;
        private handleSwitchMaxTweetsChanged;
        private handleSwitchSinceChanged;
        private handleTweetCheckboxChanged;
        private handleCheckAllChanged;
        renderTweet(tweet: any): any;
        render(): any;
    }
}
