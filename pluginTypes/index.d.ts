/// <amd-module name="@scom/scom-twitter-scraper-ui/index.css.ts" />
declare module "@scom/scom-twitter-scraper-ui/index.css.ts" {
    export const tweetPreviewStyle: string;
    export const paginationStyle: string;
    export const textCenterStyle: string;
}
/// <amd-module name="@scom/scom-twitter-scraper-ui/interface.ts" />
declare module "@scom/scom-twitter-scraper-ui/interface.ts" {
    export interface IPhoto {
        id: string;
        url: string;
    }
    export interface ITweet {
        conversationId: string;
        hashtags: any[];
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
}
/// <amd-module name="@scom/scom-twitter-scraper-ui" />
declare module "@scom/scom-twitter-scraper-ui" {
    import { ControlElement, Module } from '@ijstech/components';
    import { ITweet, IPhoto } from "@scom/scom-twitter-scraper-ui/interface.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-import-tweets-module']: ImportTweetsModuleElement;
            }
        }
    }
    interface ImportTweetsModuleElement extends ControlElement {
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
        constructor();
        init(): void;
        clear(): void;
        set scraperBotApiBaseUrl(value: string);
        get scraperBotApiBaseUrl(): string;
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
    export { ITweet, IPhoto };
}
