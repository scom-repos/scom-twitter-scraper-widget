import {
    Button,
    Checkbox,
    ControlElement,
    customElements,
    Module,
    Styles,
    Input,
    Label,
    StackLayout,
    Datepicker,
    Pagination,
    moment,
    Switch,
    Container
} from '@ijstech/components';
import { paginationStyle, tweetPreviewStyle, textCenterStyle } from './index.css';
import {ITweet, IPhoto} from "./interface";
import translations from './translations.json';

const Theme = Styles.Theme.ThemeVars;
const pageSize = 5;

interface ImportTweetsModuleElement extends ControlElement {
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-import-tweets-module']: ImportTweetsModuleElement;
        }
    }
}

@customElements('i-scom-import-tweets-module')
export class ImportTweetsModule extends Module {
    private btnSearch: Button;
    private btnBack: Button;
    private btnImport: Button;
    private edtName: Input;
    private lbWarn: Label;
    private switchMaxTweets: Switch;
    private edtMaxTweets: Input;
    private switchSince: Switch;
    private edtSince: Datepicker;
    private edtTil: Datepicker;
    private pnlSearch: StackLayout;
    private pnlLoading: StackLayout;
    private pnlFailed: StackLayout;
    private lbFailedMessage: Label;
    private lbDateRangeError: Label;
    private lbMaxTweetsError: Label;
    private pnlResult: StackLayout;
    private tweetsList: StackLayout;
    private lbTweetsCount: Label;
    private lbSelectedTweetsCount: Label;
    private chkAll: Checkbox;
    private pgnTweets: Pagination;

    private allTweets: ITweet[];
    private checkedTweets: ITweet[] = [];
    private isImporting: boolean;
    private _scraperBotApiBaseUrl: string;
    onSubmit: (tweets: ITweet[]) => Promise<void>;
    refreshPosts: () => Promise<void>;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    static async create(options?: ImportTweetsModuleElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    init() {
        this.i18n.init({...translations});
        super.init();
    }

    clear() {
    }

    set scraperBotApiBaseUrl(value: string) {
        this._scraperBotApiBaseUrl = value;
    }

    get scraperBotApiBaseUrl() {
        return this._scraperBotApiBaseUrl;
    }

    private async getTweets(username: string, since?: number, until?: number, maxTweets?: number): Promise<ITweet[]> {
        if (!username) {
            throw new Error("$username_is_required");
        }
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.set('name', username);
        if (since !== undefined && until !== undefined) {
            urlSearchParams.set('since', since.toString());
            urlSearchParams.set('until', until.toString());
        }
        if (maxTweets !== undefined) {
            urlSearchParams.set('maxTweets', maxTweets.toString());
        }
        const response = await fetch(`${this._scraperBotApiBaseUrl}/get-tweets?${urlSearchParams.toString()}`);
        if (response.ok) {
            const responseData = await response.json();
            if (responseData.success) {
                return responseData.tweets;
            }
            else {
                throw new Error(responseData.message);
            }
        }
        else {
            throw new Error("$internal_server_error");
        }
    }

    private async handleSearch() {
        const xUsername = this.edtName.value;
        const maxTweetsEnabled = this.switchMaxTweets.checked;
        const maxTweets = this.edtMaxTweets.value;
        const dateRangeEnabled = this.switchSince.checked;
        const since = this.edtSince.value;
        const til = this.edtTil.value;
        let isFormInvalid = false;
        if (maxTweetsEnabled && !maxTweets) {
            this.lbMaxTweetsError.visible = true;
            isFormInvalid = true;
        }
        else {
            this.lbMaxTweetsError.visible = false;
        }

        if (dateRangeEnabled && (!since || !til)) {
            this.lbDateRangeError.visible = true;
            this.lbDateRangeError.caption = "$please_fill_in_the_date_range"
            isFormInvalid = true;
        }
        else if (dateRangeEnabled && since && til && since.isAfter(til)) {
            this.lbDateRangeError.visible = true;
            this.lbDateRangeError.caption = "$the_start_date_should_be_set_before_the_end_date"
            isFormInvalid = true;
        }
        else {
            this.lbDateRangeError.visible = false;
        }

        if (isFormInvalid) return;
        this.pnlSearch.visible = false;
        this.pnlLoading.visible = true;
        this.tweetsList.clearInnerHTML();
        this.checkedTweets = [];
        this.chkAll.checked = false;
        this.lbSelectedTweetsCount.caption = '0';
        try {
            const tweets = await this.getTweets(xUsername, (dateRangeEnabled && since ? +since.toDate() : undefined), (dateRangeEnabled && til ? +til.toDate() : undefined), maxTweetsEnabled ? maxTweets : undefined);
            this.pnlLoading.visible = false;
            this.allTweets = tweets;

            this.pgnTweets.pageSize = pageSize;
            this.pgnTweets.totalPages = Math.ceil(tweets.length / 5);
            this.pgnTweets.currentPage = 1;
            this.pgnTweets.onPageChanged = this.handlePageChange.bind(this);

            this.pnlResult.visible = true;
            this.lbTweetsCount.caption = tweets?.length.toString();
            // for (const tweet of tweets) {
            //     this.tweetsList.append(this.renderTweet(tweet));
            // }
            const clonedTweets = [...tweets];
            const currentPageTweets = clonedTweets.splice(0, 5);
            for (const tweet of currentPageTweets) {
                this.tweetsList.append(this.renderTweet(tweet));
            }

        }
        catch (e) {
            this.pnlLoading.visible = false;
            this.pnlFailed.visible = true;
            this.lbFailedMessage.caption = '$failed_to_scrap_tweets';
            setTimeout(() => {
                this.lbFailedMessage.caption = '';
                this.pnlFailed.visible = false;
                this.pnlSearch.visible = true;
            }, 3000)
        }
    }

    private handlePageChange(target: Pagination, lastActivePage: number) {
        this.tweetsList.clearInnerHTML();
        const currentPage = target.currentPage;
        const tweets = [...this.allTweets];
        const currentPageTweets = tweets.splice((currentPage - 1) * pageSize, pageSize);
        for (const tweet of currentPageTweets) {
            this.tweetsList.append(this.renderTweet(tweet));
        }
    }

    private handleBackClick() {
        this.pnlResult.visible = false;
        this.pnlSearch.visible = true;
    }

    private async handleSubmit() {
        this.enableInputs(false);
        this.btnImport.rightIcon.spin = true;
        this.btnImport.rightIcon.visible = true;
        this.isImporting = true

        if (this.onSubmit) {
            await this.onSubmit(this.checkedTweets);
        }

        this.btnImport.rightIcon.spin = false;
        this.btnImport.rightIcon.visible = false;
        this.isImporting = false;
        this.resetInputs();
        this.closeModal();
        if (this.refreshPosts) {
            await this.refreshPosts();
        }

        // const xUsername = this.edtName.value;
        // const isMaxTweetsChecked = this.chkMaxTweets.checked;
        // const isSinceChecked = this.chkSince.checked;
        // const maxTweets = this.edtMaxTweets.value;
        // const since = this.edtSince.value;
        // this.enableInputs(false);
        // this.btnImport.rightIcon.spin = true;
        // this.btnImport.rightIcon.visible = true;
        // if (this._communityId && this._creatorId) {
        //     const data: ISyncTweetsToCommunityInfo = {
        //         username: xUsername,
        //         communityId: this._communityId,
        //         creatorId: this._creatorId
        //     }
        //     if (isMaxTweetsChecked && maxTweets) {
        //         data.maxTweets = maxTweets;
        //     }
        //     if (isSinceChecked && since) {
        //         data.since = +since.toDate();
        //     }
        //     const isSynced = await syncTweetsToCommunity(data);
        //     console.log('isSynced', isSynced);
        // }
        // else {
        //     const data: ISyncTweetsToNostrInfo = {
        //         username: xUsername
        //     }
        //     if (isMaxTweetsChecked && maxTweets) {
        //         data.maxTweets = maxTweets;
        //     }
        //     if (isSinceChecked && since) {
        //         data.since = +since.toDate();
        //     }
        //     const isSynced = await syncTweetsToNostr(data);
        //     console.log('isSynced', isSynced);
        // }
        // this.btnImport.rightIcon.spin = false;
        // this.btnImport.rightIcon.visible = false;
        // this.resetInputs();
        // this.closeModal();
    }

    private resetInputs() {
        this.btnSearch.enabled = false;
        this.edtName.value = '';
        this.switchMaxTweets.checked = true;
        this.switchSince.checked = false;
        this.edtMaxTweets.enabled = true;
        this.edtMaxTweets.value = '50';
        this.edtSince.enabled = false;
        this.edtTil.enabled = false;
        this.edtSince.value = null;
        this.enableInputs();
        this.pnlResult.visible = false;
        this.pnlSearch.visible = true;
    }

    private enableInputs(isEnabled: boolean = true) {
        this.btnBack.enabled = isEnabled;
        this.edtName.enabled = isEnabled;
        this.switchMaxTweets.enabled = isEnabled;
        this.switchSince.enabled = isEnabled;
        this.edtMaxTweets.enabled = isEnabled && this.switchMaxTweets.checked;
        this.edtSince.enabled = isEnabled && this.switchSince.checked;
        this.edtSince.background = { color: this.switchSince.checked ? Theme.action.activeBackground : Theme.action.disabledBackground };
        this.edtTil.enabled = isEnabled && this.switchSince.checked;
        this.edtTil.background = { color: this.switchSince.checked ? Theme.action.activeBackground : Theme.action.disabledBackground };
    }

    private onNameChanged() {
        this.btnSearch.enabled = !!this.edtName.value;
    }

    private async handleSwitchMaxTweetsChanged(control: Switch) {
        const checked = control.checked;
        this.edtMaxTweets.enabled = checked;
        this.lbWarn.visible = !checked;
    }

    private async handleSwitchSinceChanged(control: Switch) {
        const checked = control.checked;
        this.edtSince.enabled = checked;
        this.edtSince.background = { color: checked ? Theme.action.activeBackground : Theme.action.disabledBackground };
        this.edtTil.enabled = checked;
        this.edtTil.background = { color: checked ? Theme.action.activeBackground : Theme.action.disabledBackground };
    }

    private async handleTweetCheckboxChanged(checked: boolean, tweet: ITweet) {
        if (checked) {
            this.checkedTweets.push(tweet);
        }
        else {
            this.checkedTweets = this.checkedTweets.filter(v => v.id !== tweet.id);
        }
        this.btnImport.enabled = !this.isImporting && this.checkedTweets.length > 0;
        this.chkAll.checked = this.checkedTweets.length === this.allTweets.length;
        this.lbSelectedTweetsCount.caption = this.checkedTweets.length.toString();
    }

    private async handleCheckAllChanged(control: Checkbox) {
        const checked = (control as Checkbox).checked;
        if (checked) {
            this.checkedTweets = this.allTweets;
        }
        else {
            this.checkedTweets = [];
        }

        // Update current page checkbox
        this.tweetsList.querySelectorAll('i-checkbox').forEach(v => {
            (v as Checkbox).checked = checked;
        })

        this.btnImport.enabled = !this.isImporting && this.checkedTweets.length > 0;
        this.lbSelectedTweetsCount.caption = this.checkedTweets.length.toString();
    }

    renderTweet(tweet) {
        const linkRegex = /https?:\/\/\S+/g
        const checkbox = <i-checkbox checked={this.checkedTweets.filter(v => v.id === tweet.id)?.length > 0} onChanged={(control) => this.handleTweetCheckboxChanged((control as Checkbox).checked, tweet)} />
        const gridLayout = <i-grid-layout class={tweetPreviewStyle} onClick={() => {
            checkbox.checked = !checkbox.checked;
            this.handleTweetCheckboxChanged(checkbox.checked, tweet);
        }}>
            <i-stack direction="vertical" gap="0.25rem">
                <i-stack direction="horizontal" justifyContent="end">
                    <i-label
                        caption={`${this.i18n.get('$created_on')} ${moment(tweet.timeParsed).format('DD/MM/YYYY')}`}
                        font={{ color: Theme.text.secondary, style: "italic" }}
                    />
                </i-stack>
                <i-label caption={tweet.text.replace(linkRegex, '')} />
            </i-stack>
        </i-grid-layout>
        gridLayout.prepend(checkbox);
        return gridLayout;
    }

    render() {
        return (
            <i-stack direction='vertical' padding={{ top: '1.5rem' }} margin={{ bottom: '0.5rem' }} gap='2rem'>
                <i-stack direction="vertical" id="pnlSearch" gap="0.25rem">
                    <i-stack id="pnlInfo" direction="vertical" gap="1rem">
                        <i-stack id="pnlName" direction="vertical" gap="0.5rem">
                            <i-hstack verticalAlignment='center' gap="0.25rem">
                                <i-label display="inline" caption="$x_username"></i-label>
                                <i-label display="inline" caption="*" font={{ color: Theme.colors.error.main }}></i-label>
                            </i-hstack>
                            <i-input id="edtName" width="100%" height={32} padding={{ left: '0.5rem', right: '0.5rem' }} border={{ radius: 5 }} maxLength={150} onChanged={this.onNameChanged} placeholder="elonmusk"></i-input>
                            <i-label id="lblNameHint" caption="$your_x_username" font={{ size: '0.875rem', color: Theme.text.secondary }}></i-label>
                        </i-stack>
                        <i-stack direction="vertical" gap="0.5rem">
                            <i-stack id="pnlLeaderboard" direction="vertical" gap="1rem">
                                <i-stack direction="horizontal" gap={10} alignItems="center">
                                    <i-switch id="switchMaxTweets" onChanged={this.handleSwitchMaxTweetsChanged} checked={true}></i-switch>
                                    <i-stack direction="vertical" gap={5} width={'100%'}>
                                        <i-stack direction="horizontal" gap={5}>
                                            <i-label caption="$maximum_tweets" />
                                            <i-icon name="question-circle" width={Theme.typography.fontSize} height={Theme.typography.fontSize} tooltip={{ content: "$the_max_number_of_tweets_will_be_included_starting_from_the_latest_tweet", placement: "rightTop" }} />
                                        </i-stack>
                                        <i-input id="edtMaxTweets" width="100%" height={32} padding={{ left: '0.5rem', right: '0.5rem' }} border={{ radius: 5 }} maxLength={150} value="50"></i-input>
                                        <i-label id="lbMaxTweetsError" visible={false} caption="$please_enter_maximum_tweets" font={{ color: Theme.colors.error.main }} />
                                        <i-label id="lbWarn" visible={false} caption="$warning_search_without_a_limit_may_take_a_long_time_if_the_account_has_a_lot_of_posts" font={{ color: Theme.colors.warning.main }} />
                                    </i-stack>
                                </i-stack>

                                {/* <i-checkbox id="chkSince" caption="Sync tweets created after" onChanged={this.handleChkSinceChanged.bind(this)}></i-checkbox> */}
                                <i-stack direction="horizontal" gap={10} alignItems="center">
                                    <i-switch id="switchSince" onChanged={this.handleSwitchSinceChanged} uncheckedTrackColor={Theme.action.focusBackground} checkedTrackColor={Theme.colors.info.main} />
                                    <i-stack direction="vertical" gap={5} width={'100%'}>
                                        <i-stack direction="horizontal" gap={5}>
                                            <i-label caption="$sync_tweets_between" />
                                            <i-icon
                                                name="question-circle"
                                                width={Theme.typography.fontSize}
                                                height={Theme.typography.fontSize}
                                                tooltip={{ content: "$tweets_before_or_after_than_this_date_range_will_not_be_included", placement: "rightTop" }}
                                            />
                                        </i-stack>
                                        <i-stack direction="horizontal" width={'100%'} gap={10} alignItems="center">
                                            <i-stack direction="vertical" gap={2}>
                                                <i-datepicker id="edtSince" width="100%" height={32} padding={{ left: '0.5rem', right: '0.5rem' }} border={{ radius: 5 }} enabled={false} background={{ color: Theme.action.disabledBackground }}></i-datepicker>
                                            </i-stack>
                                            <i-label caption="$to" width={50} class={textCenterStyle} />
                                            <i-stack direction="vertical" gap={2}>
                                                <i-datepicker id="edtTil" width="100%" height={32} padding={{ left: '0.5rem', right: '0.5rem' }} border={{ radius: 5 }} enabled={false} background={{ color: Theme.action.disabledBackground }}></i-datepicker>
                                            </i-stack>
                                        </i-stack>
                                        <i-label id="lbDateRangeError" visible={false} font={{ color: Theme.colors.error.main }} />
                                    </i-stack>
                                </i-stack>
                            </i-stack>
                        </i-stack>
                    </i-stack>
                    <i-stack direction='horizontal' justifyContent='end' alignItems='center' gap={"0.25rem"}>
                        <i-button
                            id="btnSearch"
                            enabled={false}
                            minHeight={36}
                            minWidth={120}
                            caption="$search"
                            border={{ radius: 18 }}
                            padding={{ top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem' }}
                            margin={{ top: '0.25rem', bottom: '0.5rem' }}
                            font={{ color: Theme.colors.primary.contrastText, bold: true }}
                            onClick={this.handleSearch}
                        ></i-button>
                        {/* <i-button
                            id="btnImport"
                            enabled={false}
                            minHeight={36}
                            minWidth={120}
                            caption="Submit"
                            border={{ radius: 18 }}
                            padding={{ top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem' }}
                            margin={{ top: '0.25rem', bottom: '0.5rem' }}
                            font={{ color: Theme.colors.primary.contrastText, bold: true }}
                            onClick={this.handleSubmit.bind(this)}
                        ></i-button> */}
                    </i-stack>
                </i-stack>
                <i-panel id="pnlLoading" visible={false} height={200}>
                    <i-stack height="100%" direction="vertical" gap="0.5rem" alignItems="center" justifyContent='center'>
                        <i-icon name="spinner" width={24} height={24} spin={true} />
                        <i-label caption="$fetching_tweets_from_x" font={{ size: "24px" }} />
                    </i-stack>
                </i-panel>
                <i-panel id="pnlFailed" visible={false} height={200}>
                    <i-stack height="100%" direction="vertical" gap="0.5rem" alignItems="center" justifyContent='center'>
                        <i-icon name="times-circle" width={24} height={24} fill={Theme.colors.error.main} />
                        <i-label id="lbFailedMessage" font={{ size: "24px" }} />
                    </i-stack>
                </i-panel>
                <i-stack id="pnlResult" visible={false} direction="vertical" gap="0.25rem">
                    <i-stack direction="vertical" gap="0.5rem">
                        <i-stack direction="horizontal" justifyContent='space-between'>
                            <i-stack direction="horizontal" gap="0.25rem">
                                <i-label caption="$tweets_found" />
                                <i-label id="lbTweetsCount" caption="" />
                            </i-stack>
                            <i-stack direction="horizontal" gap="0.25rem">
                                <i-label caption="$selected" />
                                <i-label id="lbSelectedTweetsCount" caption="0" />
                            </i-stack>
                        </i-stack>
                        <i-checkbox id="chkAll" onChanged={this.handleCheckAllChanged} caption="$select_all" />
                        <i-stack id="tweetsList" gap="0.5rem" direction="vertical" />
                        <i-stack direction="horizontal" justifyContent="center">
                            <i-pagination id="pgnTweets" class={paginationStyle} />
                        </i-stack>
                    </i-stack>
                    <i-stack direction='horizontal' justifyContent='end' alignItems='center' gap={"0.25rem"} margin={{ top: 5 }}>
                        <i-button
                            id="btnBack"
                            enabled={true}
                            minHeight={36}
                            minWidth={120}
                            caption="$back"
                            border={{ radius: 18 }}
                            padding={{ top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem' }}
                            margin={{ top: '0.25rem', bottom: '0.5rem' }}
                            font={{ color: Theme.colors.primary.contrastText, bold: true }}
                            onClick={this.handleBackClick}
                        ></i-button>
                        <i-button
                            id="btnImport"
                            enabled={false}
                            minHeight={36}
                            minWidth={120}
                            caption="$import"
                            border={{ radius: 18 }}
                            padding={{ top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem' }}
                            margin={{ top: '0.25rem', bottom: '0.5rem' }}
                            font={{ color: Theme.colors.primary.contrastText, bold: true }}
                            onClick={this.handleSubmit}
                        ></i-button>
                    </i-stack>
                </i-stack>
            </i-stack>
        )
    }
}

export {
    ITweet,
    IPhoto
}