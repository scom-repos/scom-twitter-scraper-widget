var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-twitter-scraper-widget/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.textCenterStyle = exports.paginationStyle = exports.tweetPreviewStyle = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    exports.tweetPreviewStyle = components_1.Styles.style({
        padding: '10px',
        alignItems: 'center',
        borderRadius: '10px',
        background: Theme.background.paper,
        gridTemplateColumns: "30px 1fr",
        width: '100%',
        $nest: {
            'i-label': {
                whiteSpace: 'pre-wrap'
            }
        }
    });
    exports.paginationStyle = components_1.Styles.style({
        textAlign: 'center'
    });
    exports.textCenterStyle = components_1.Styles.style({
        textAlign: 'center'
    });
});
define("@scom/scom-twitter-scraper-widget/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-twitter-scraper-widget", ["require", "exports", "@ijstech/components", "@scom/scom-twitter-scraper-widget/index.css.ts"], function (require, exports, components_2, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImportTweetsModule = void 0;
    const Theme = components_2.Styles.Theme.ThemeVars;
    const pageSize = 5;
    let ImportTweetsModule = class ImportTweetsModule extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.checkedTweets = [];
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        init() {
            super.init();
        }
        clear() {
        }
        set scraperBotApiBaseUrl(value) {
            this._scraperBotApiBaseUrl = value;
        }
        get scraperBotApiBaseUrl() {
            return this._scraperBotApiBaseUrl;
        }
        async getTweets(username, since, until, maxTweets) {
            if (!username) {
                throw new Error("Username is required.");
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
                throw new Error("Internal Server Error.");
            }
        }
        async handleSearch() {
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
                this.lbDateRangeError.caption = "Please fill in the date range.";
                isFormInvalid = true;
            }
            else if (dateRangeEnabled && since && til && since.isAfter(til)) {
                this.lbDateRangeError.visible = true;
                this.lbDateRangeError.caption = "The start date should be set before the end date.";
                isFormInvalid = true;
            }
            else {
                this.lbDateRangeError.visible = false;
            }
            if (isFormInvalid)
                return;
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
                this.lbFailedMessage.caption = 'Failed to scrap tweets.';
                setTimeout(() => {
                    this.lbFailedMessage.caption = '';
                    this.pnlFailed.visible = false;
                    this.pnlSearch.visible = true;
                }, 3000);
            }
        }
        handlePageChange(target, lastActivePage) {
            this.tweetsList.clearInnerHTML();
            const currentPage = target.currentPage;
            const tweets = [...this.allTweets];
            const currentPageTweets = tweets.splice((currentPage - 1) * pageSize, pageSize);
            for (const tweet of currentPageTweets) {
                this.tweetsList.append(this.renderTweet(tweet));
            }
        }
        handleBackClick() {
            this.pnlResult.visible = false;
            this.pnlSearch.visible = true;
        }
        async handleSubmit() {
            this.enableInputs(false);
            this.btnImport.rightIcon.spin = true;
            this.btnImport.rightIcon.visible = true;
            this.isImporting = true;
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
        resetInputs() {
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
        enableInputs(isEnabled = true) {
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
        onNameChanged() {
            this.btnSearch.enabled = !!this.edtName.value;
        }
        async handleSwitchMaxTweetsChanged(control) {
            const checked = control.checked;
            this.edtMaxTweets.enabled = checked;
            this.lbWarn.visible = !checked;
        }
        async handleSwitchSinceChanged(control) {
            const checked = control.checked;
            this.edtSince.enabled = checked;
            this.edtSince.background = { color: checked ? Theme.action.activeBackground : Theme.action.disabledBackground };
            this.edtTil.enabled = checked;
            this.edtTil.background = { color: checked ? Theme.action.activeBackground : Theme.action.disabledBackground };
        }
        async handleTweetCheckboxChanged(checked, tweet) {
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
        async handleCheckAllChanged(control) {
            const checked = control.checked;
            if (checked) {
                this.checkedTweets = this.allTweets;
            }
            else {
                this.checkedTweets = [];
            }
            // Update current page checkbox
            this.tweetsList.querySelectorAll('i-checkbox').forEach(v => {
                v.checked = checked;
            });
            this.btnImport.enabled = !this.isImporting && this.checkedTweets.length > 0;
            this.lbSelectedTweetsCount.caption = this.checkedTweets.length.toString();
        }
        renderTweet(tweet) {
            const linkRegex = /https?:\/\/\S+/g;
            const checkbox = this.$render("i-checkbox", { checked: this.checkedTweets.filter(v => v.id === tweet.id)?.length > 0, onChanged: (control) => this.handleTweetCheckboxChanged(control.checked, tweet) });
            const gridLayout = this.$render("i-grid-layout", { class: index_css_1.tweetPreviewStyle, onClick: () => {
                    checkbox.checked = !checkbox.checked;
                    this.handleTweetCheckboxChanged(checkbox.checked, tweet);
                } },
                this.$render("i-stack", { direction: "vertical", gap: "0.25rem" },
                    this.$render("i-stack", { direction: "horizontal", justifyContent: "end" },
                        this.$render("i-label", { caption: `Created on ${(0, components_2.moment)(tweet.timeParsed).format('DD/MM/YYYY')}`, font: { color: Theme.text.secondary, style: "italic" } })),
                    this.$render("i-label", { caption: tweet.text.replace(linkRegex, '') })));
            gridLayout.prepend(checkbox);
            return gridLayout;
        }
        render() {
            return (this.$render("i-stack", { direction: 'vertical', padding: { top: '1.5rem' }, margin: { bottom: '0.5rem' }, gap: '2rem' },
                this.$render("i-stack", { direction: "vertical", id: "pnlSearch", gap: "0.25rem" },
                    this.$render("i-stack", { id: "pnlInfo", direction: "vertical", gap: "1rem" },
                        this.$render("i-stack", { id: "pnlName", direction: "vertical", gap: "0.5rem" },
                            this.$render("i-panel", null,
                                this.$render("i-label", { display: "inline", caption: "X username " }),
                                this.$render("i-label", { display: "inline", caption: "*", font: { color: Theme.colors.error.main } })),
                            this.$render("i-input", { id: "edtName", width: "100%", height: 32, padding: { left: '0.5rem', right: '0.5rem' }, border: { radius: 5 }, maxLength: 150, onChanged: this.onNameChanged, placeholder: "elonmusk" }),
                            this.$render("i-label", { id: "lblNameHint", caption: "Your X username", font: { size: '0.875rem', color: Theme.text.secondary } })),
                        this.$render("i-stack", { direction: "vertical", gap: "0.5rem" },
                            this.$render("i-stack", { id: "pnlLeaderboard", direction: "vertical", gap: "1rem" },
                                this.$render("i-stack", { direction: "horizontal", gap: 10, alignItems: "center" },
                                    this.$render("i-switch", { id: "switchMaxTweets", onChanged: this.handleSwitchMaxTweetsChanged, checked: true }),
                                    this.$render("i-stack", { direction: "vertical", gap: 5, width: '100%' },
                                        this.$render("i-stack", { direction: "horizontal", gap: 5 },
                                            this.$render("i-label", { caption: "Maximum tweets" }),
                                            this.$render("i-icon", { name: "question-circle", width: Theme.typography.fontSize, height: Theme.typography.fontSize, tooltip: { content: "The max number of tweet will be included, starting from the latest tweet", placement: "rightTop" } })),
                                        this.$render("i-input", { id: "edtMaxTweets", width: "100%", height: 32, padding: { left: '0.5rem', right: '0.5rem' }, border: { radius: 5 }, maxLength: 150, value: "50" }),
                                        this.$render("i-label", { id: "lbMaxTweetsError", visible: false, caption: "Please enter maximum tweets.", font: { color: Theme.colors.error.main } }),
                                        this.$render("i-label", { id: "lbWarn", visible: false, caption: "Warning, search without a limit may take a long time if the account has a lot of posts.", font: { color: Theme.colors.warning.main } }))),
                                this.$render("i-stack", { direction: "horizontal", gap: 10, alignItems: "center" },
                                    this.$render("i-switch", { id: "switchSince", onChanged: this.handleSwitchSinceChanged, uncheckedTrackColor: Theme.action.focusBackground, checkedTrackColor: Theme.colors.info.main }),
                                    this.$render("i-stack", { direction: "vertical", gap: 5, width: '100%' },
                                        this.$render("i-stack", { direction: "horizontal", gap: 5 },
                                            this.$render("i-label", { caption: "Sync tweets between" }),
                                            this.$render("i-icon", { name: "question-circle", width: Theme.typography.fontSize, height: Theme.typography.fontSize, tooltip: { content: "Tweets before or after than this date range will not be included.", placement: "rightTop" } })),
                                        this.$render("i-stack", { direction: "horizontal", width: '100%', gap: 10, alignItems: "center" },
                                            this.$render("i-stack", { direction: "vertical", gap: 2 },
                                                this.$render("i-datepicker", { id: "edtSince", width: "100%", height: 32, padding: { left: '0.5rem', right: '0.5rem' }, border: { radius: 5 }, enabled: false, background: { color: Theme.action.disabledBackground } })),
                                            this.$render("i-label", { caption: "To", width: 50, class: index_css_1.textCenterStyle }),
                                            this.$render("i-stack", { direction: "vertical", gap: 2 },
                                                this.$render("i-datepicker", { id: "edtTil", width: "100%", height: 32, padding: { left: '0.5rem', right: '0.5rem' }, border: { radius: 5 }, enabled: false, background: { color: Theme.action.disabledBackground } }))),
                                        this.$render("i-label", { id: "lbDateRangeError", visible: false, font: { color: Theme.colors.error.main } })))))),
                    this.$render("i-stack", { direction: 'horizontal', justifyContent: 'end', alignItems: 'center', gap: "0.25rem" },
                        this.$render("i-button", { id: "btnSearch", enabled: false, minHeight: 36, minWidth: 120, caption: "Search", border: { radius: 18 }, padding: { top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem' }, margin: { top: '0.25rem', bottom: '0.5rem' }, font: { color: Theme.colors.primary.contrastText, bold: true }, onClick: this.handleSearch }))),
                this.$render("i-panel", { id: "pnlLoading", visible: false, height: 200 },
                    this.$render("i-stack", { height: "100%", direction: "vertical", gap: "0.5rem", alignItems: "center", justifyContent: 'center' },
                        this.$render("i-icon", { name: "spinner", width: 24, height: 24, spin: true }),
                        this.$render("i-label", { caption: "Fetching tweets from X", font: { size: "24px" } }))),
                this.$render("i-panel", { id: "pnlFailed", visible: false, height: 200 },
                    this.$render("i-stack", { height: "100%", direction: "vertical", gap: "0.5rem", alignItems: "center", justifyContent: 'center' },
                        this.$render("i-icon", { name: "times-circle", width: 24, height: 24, fill: Theme.colors.error.main }),
                        this.$render("i-label", { id: "lbFailedMessage", font: { size: "24px" } }))),
                this.$render("i-stack", { id: "pnlResult", visible: false, direction: "vertical", gap: "0.25rem" },
                    this.$render("i-stack", { direction: "vertical", gap: "0.5rem" },
                        this.$render("i-stack", { direction: "horizontal", justifyContent: 'space-between' },
                            this.$render("i-stack", { direction: "horizontal", gap: "0.25rem" },
                                this.$render("i-label", { caption: "Tweets found: " }),
                                this.$render("i-label", { id: "lbTweetsCount", caption: "" })),
                            this.$render("i-stack", { direction: "horizontal", gap: "0.25rem" },
                                this.$render("i-label", { caption: "Selected: " }),
                                this.$render("i-label", { id: "lbSelectedTweetsCount", caption: "0" }))),
                        this.$render("i-checkbox", { id: "chkAll", onChanged: this.handleCheckAllChanged, caption: "Select all" }),
                        this.$render("i-stack", { id: "tweetsList", gap: "0.5rem", direction: "vertical" }),
                        this.$render("i-stack", { direction: "horizontal", justifyContent: "center" },
                            this.$render("i-pagination", { id: "pgnTweets", class: index_css_1.paginationStyle }))),
                    this.$render("i-stack", { direction: 'horizontal', justifyContent: 'end', alignItems: 'center', gap: "0.25rem", margin: { top: 5 } },
                        this.$render("i-button", { id: "btnBack", enabled: true, minHeight: 36, minWidth: 120, caption: "Back", border: { radius: 18 }, padding: { top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem' }, margin: { top: '0.25rem', bottom: '0.5rem' }, font: { color: Theme.colors.primary.contrastText, bold: true }, onClick: this.handleBackClick }),
                        this.$render("i-button", { id: "btnImport", enabled: false, minHeight: 36, minWidth: 120, caption: "Import", border: { radius: 18 }, padding: { top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem' }, margin: { top: '0.25rem', bottom: '0.5rem' }, font: { color: Theme.colors.primary.contrastText, bold: true }, onClick: this.handleSubmit })))));
        }
    };
    ImportTweetsModule = __decorate([
        (0, components_2.customElements)('i-scom-import-tweets-module')
    ], ImportTweetsModule);
    exports.ImportTweetsModule = ImportTweetsModule;
});
