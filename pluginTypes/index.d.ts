/// <amd-module name="@scom/scom-twitter-scraper-widget/index.css.ts" />
declare module "@scom/scom-twitter-scraper-widget/index.css.ts" {
    export const tweetPreviewStyle: string;
    export const paginationStyle: string;
    export const textCenterStyle: string;
}
/// <amd-module name="@scom/scom-twitter-scraper-widget/interface.ts" />
declare module "@scom/scom-twitter-scraper-widget/interface.ts" {
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
/// <amd-module name="@scom/scom-twitter-scraper-widget/translations.json.ts" />
declare module "@scom/scom-twitter-scraper-widget/translations.json.ts" {
    const _default: {
        en: {
            back: string;
            created_on: string;
            failed_to_scrap_tweets: string;
            fetching_tweets_from_x: string;
            import_tweets_to_your_community: string;
            import: string;
            internal_server_error: string;
            maximum_tweets: string;
            please_enter_maximum_tweets: string;
            please_fill_in_the_date_range: string;
            search: string;
            select_all: string;
            selected: string;
            sync_tweets_between: string;
            the_max_number_of_tweets_will_be_included_starting_from_the_latest_tweet: string;
            the_start_date_should_be_set_before_the_end_date: string;
            to: string;
            tweets_before_or_after_than_this_date_range_will_not_be_included: string;
            tweets_found: string;
            username_is_required: string;
            warning_search_without_a_limit_may_take_a_long_time_if_the_account_has_a_lot_of_posts: string;
            x_username: string;
            your_x_username: string;
        };
        "zh-hant": {
            back: string;
            created_on: string;
            failed_to_scrap_tweets: string;
            fetching_tweets_from_x: string;
            import_tweets_to_your_community: string;
            import: string;
            internal_server_error: string;
            maximum_tweets: string;
            please_enter_maximum_tweets: string;
            please_fill_in_the_date_range: string;
            search: string;
            select_all: string;
            selected: string;
            sync_tweets_between: string;
            the_max_number_of_tweets_will_be_included_starting_from_the_latest_tweet: string;
            the_start_date_should_be_set_before_the_end_date: string;
            to: string;
            tweets_before_or_after_than_this_date_range_will_not_be_included: string;
            tweets_found: string;
            username_is_required: string;
            warning_search_without_a_limit_may_take_a_long_time_if_the_account_has_a_lot_of_posts: string;
            x_username: string;
            your_x_username: string;
        };
        vi: {
            back: string;
            created_on: string;
            failed_to_scrap_tweets: string;
            fetching_tweets_from_x: string;
            import_tweets_to_your_community: string;
            import: string;
            internal_server_error: string;
            maximum_tweets: string;
            please_enter_maximum_tweets: string;
            please_fill_in_the_date_range: string;
            search: string;
            select_all: string;
            selected: string;
            sync_tweets_between: string;
            the_max_number_of_tweets_will_be_included_starting_from_the_latest_tweet: string;
            the_start_date_should_be_set_before_the_end_date: string;
            to: string;
            tweets_before_or_after_than_this_date_range_will_not_be_included: string;
            tweets_found: string;
            username_is_required: string;
            warning_search_without_a_limit_may_take_a_long_time_if_the_account_has_a_lot_of_posts: string;
            x_username: string;
            your_x_username: string;
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-twitter-scraper-widget" />
declare module "@scom/scom-twitter-scraper-widget" {
    import { ControlElement, Module, Container } from '@ijstech/components';
    import { ITweet, IPhoto } from "@scom/scom-twitter-scraper-widget/interface.ts";
    interface ImportTweetsModuleElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-import-tweets-module']: ImportTweetsModuleElement;
            }
        }
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
        constructor(parent?: Container, options?: any);
        static create(options?: ImportTweetsModuleElement, parent?: Container): Promise<ImportTweetsModule>;
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
