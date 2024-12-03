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
define("@scom/scom-twitter-scraper-widget/translations.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-twitter-scraper-widget/translations.json.ts'/> 
    exports.default = {
        "en": {
            "username_is_required": "Username is required.",
            "internal_server_error": "Internal Server Error.",
            "failed_to_scrap_tweets": "Failed to scrap tweets.",
            "please_fill_in_the_date_range": "Please fill in the date range.",
            "the_start_date_should_be_set_before_the_end_date": "The start date should be set before the end date.",
            "maximum_tweets": "Maximum tweets",
            "sync_tweets_between": "Sync tweets between",
            "to": "To",
            "search": "Search",
            "back": "Back",
            "import": "Import",
            "tweets_found": "Tweets found: ",
            "selected": "Selected: ",
            "select_all": "Select all",
            "import_tweets_to_your_community": "Import tweets to your community",
            "x_username": "X username",
            "your_x_username": "Your X username",
            "warning_search_without_a_limit_may_take_a_long_time_if_the_account_has_a_lot_of_posts": "Warning, search without a limit may take a long time if the account has a lot of posts.",
            "created_on": "Created on ",
            "please_enter_maximum_tweets": "Please enter maximum tweets.",
            "fetching_tweets_from_x": "Fetching tweets from X",
            "the_max_number_of_tweets_will_be_included_starting_from_the_latest_tweet": "The max number of tweets will be included, starting from the latest tweet",
            "tweets_before_or_after_than_this_date_range_will_not_be_included": "Tweets before or after than this date range will not be included.",
        },
        "zh-hant": {
            "username_is_required": "用戶名為必填項。",
            "internal_server_error": "內部伺服器錯誤。",
            "failed_to_scrap_tweets": "無法獲取推文。",
            "please_fill_in_the_date_range": "請填寫日期範圍。",
            "the_start_date_should_be_set_before_the_end_date": "開始日期應在結束日期之前設置。",
            "maximum_tweets": "最大推文數",
            "sync_tweets_between": "在以下同步推文",
            "to": "至",
            "search": "搜索",
            "back": "返回",
            "import": "導入",
            "tweets_found": "找到推文：",
            "select_all": "全選",
            "selected": "已選擇：",
            "import_tweets_to_your_community": "導入推文到您的社群",
            "x_username": "X 用戶名",
            "your_x_username": "您的 X 用戶名",
            "warning_search_without_a_limit_may_take_a_long_time_if_the_account_has_a_lot_of_posts": "警告，如果帳戶有很多帖子，無限制搜索可能需要很長時間。",
            "created_on": "創建於",
            "please_enter_maximum_tweets": "請輸入最大推文數。",
            "fetching_tweets_from_x": "正在從 X 獲取推文",
            "the_max_number_of_tweets_will_be_included_starting_from_the_latest_tweet": "最大推文數將從最新推文開始包含",
            "tweets_before_or_after_than_this_date_range_will_not_be_included": "此日期範圍之前或之後的推文將不包括在內。",
        },
        "vi": {
            "username_is_required": "Tên người dùng là bắt buộc.",
            "internal_server_error": "Lỗi máy chủ nội bộ.",
            "failed_to_scrap_tweets": "Lỗi khi lấy tweet.",
            "please_fill_in_the_date_range": "Vui lòng điền phạm vi thời gian.",
            "the_start_date_should_be_set_before_the_end_date": "Ngày bắt đầu phải được đặt trước ngày kết thúc.",
            "maximum_tweets": "Số lượng tweet tối đa",
            "sync_tweets_between": "Đồng bộ giữa các tweet",
            "to": "đến",
            "search": "Tìm kiếm",
            "back": "Quay lại",
            "import": "Nhập về",
            "tweets_found": "Các tweet được tìm thấy:",
            "selected": "Đã chọn:",
            "select_all": "Chọn tất cả",
            "import_tweets_to_your_community": "Nhập tweet vào cộng đồng của bạn",
            "x_username": "Tên người dùng X",
            "your_x_username": "Tên người dùng X của bạn",
            "warning_search_without_a_limit_may_take_a_long_time_if_the_account_has_a_lot_of_posts": "Cảnh báo, việc tìm kiếm không có giới hạn có thể mất nhiều thời gian nếu tài khoản có nhiều bài đăng.",
            "created_on": "Được tạo ngày",
            "please_enter_maximum_tweets": "Vui lòng nhập số lượng tweet tối đa.",
            "fetching_tweets_from_x": "Đang lấy tweet từ X",
            "the_max_number_of_tweets_will_be_included_starting_from_the_latest_tweet": "Số lượng tweet tối đa sẽ được bao gồm, bắt đầu từ tweet mới nhất.",
            "tweets_before_or_after_than_this_date_range_will_not_be_included": "Không bao gồm các tweet trước hoặc sau khoảng thời gian này.",
        }
    };
});
define("@scom/scom-twitter-scraper-widget", ["require", "exports", "@ijstech/components", "@scom/scom-twitter-scraper-widget/index.css.ts", "@scom/scom-twitter-scraper-widget/translations.json.ts"], function (require, exports, components_2, index_css_1, translations_json_1) {
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
            this.i18n.init({ ...translations_json_1.default });
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
                this.lbDateRangeError.caption = "$please_fill_in_the_date_range";
                isFormInvalid = true;
            }
            else if (dateRangeEnabled && since && til && since.isAfter(til)) {
                this.lbDateRangeError.visible = true;
                this.lbDateRangeError.caption = "$the_start_date_should_be_set_before_the_end_date";
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
                this.lbFailedMessage.caption = '$failed_to_scrap_tweets';
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
                        this.$render("i-label", { caption: `${this.i18n.get('$created_on')} ${(0, components_2.moment)(tweet.timeParsed).format('DD/MM/YYYY')}`, font: { color: Theme.text.secondary, style: "italic" } })),
                    this.$render("i-label", { caption: tweet.text.replace(linkRegex, '') })));
            gridLayout.prepend(checkbox);
            return gridLayout;
        }
        render() {
            return (this.$render("i-stack", { direction: 'vertical', padding: { top: '1.5rem' }, margin: { bottom: '0.5rem' }, gap: '2rem' },
                this.$render("i-stack", { direction: "vertical", id: "pnlSearch", gap: "0.25rem" },
                    this.$render("i-stack", { id: "pnlInfo", direction: "vertical", gap: "1rem" },
                        this.$render("i-stack", { id: "pnlName", direction: "vertical", gap: "0.5rem" },
                            this.$render("i-hstack", { verticalAlignment: 'center', gap: "0.25rem" },
                                this.$render("i-label", { display: "inline", caption: "$x_username" }),
                                this.$render("i-label", { display: "inline", caption: "*", font: { color: Theme.colors.error.main } })),
                            this.$render("i-input", { id: "edtName", width: "100%", height: 32, padding: { left: '0.5rem', right: '0.5rem' }, border: { radius: 5 }, maxLength: 150, onChanged: this.onNameChanged, placeholder: "elonmusk" }),
                            this.$render("i-label", { id: "lblNameHint", caption: "$your_x_username", font: { size: '0.875rem', color: Theme.text.secondary } })),
                        this.$render("i-stack", { direction: "vertical", gap: "0.5rem" },
                            this.$render("i-stack", { id: "pnlLeaderboard", direction: "vertical", gap: "1rem" },
                                this.$render("i-stack", { direction: "horizontal", gap: 10, alignItems: "center" },
                                    this.$render("i-switch", { id: "switchMaxTweets", onChanged: this.handleSwitchMaxTweetsChanged, checked: true }),
                                    this.$render("i-stack", { direction: "vertical", gap: 5, width: '100%' },
                                        this.$render("i-stack", { direction: "horizontal", gap: 5 },
                                            this.$render("i-label", { caption: "$maximum_tweets" }),
                                            this.$render("i-icon", { name: "question-circle", width: Theme.typography.fontSize, height: Theme.typography.fontSize, tooltip: { content: "$the_max_number_of_tweets_will_be_included_starting_from_the_latest_tweet", placement: "rightTop" } })),
                                        this.$render("i-input", { id: "edtMaxTweets", width: "100%", height: 32, padding: { left: '0.5rem', right: '0.5rem' }, border: { radius: 5 }, maxLength: 150, value: "50" }),
                                        this.$render("i-label", { id: "lbMaxTweetsError", visible: false, caption: "$please_enter_maximum_tweets", font: { color: Theme.colors.error.main } }),
                                        this.$render("i-label", { id: "lbWarn", visible: false, caption: "$warning_search_without_a_limit_may_take_a_long_time_if_the_account_has_a_lot_of_posts", font: { color: Theme.colors.warning.main } }))),
                                this.$render("i-stack", { direction: "horizontal", gap: 10, alignItems: "center" },
                                    this.$render("i-switch", { id: "switchSince", onChanged: this.handleSwitchSinceChanged, uncheckedTrackColor: Theme.action.focusBackground, checkedTrackColor: Theme.colors.info.main }),
                                    this.$render("i-stack", { direction: "vertical", gap: 5, width: '100%' },
                                        this.$render("i-stack", { direction: "horizontal", gap: 5 },
                                            this.$render("i-label", { caption: "$sync_tweets_between" }),
                                            this.$render("i-icon", { name: "question-circle", width: Theme.typography.fontSize, height: Theme.typography.fontSize, tooltip: { content: "$tweets_before_or_after_than_this_date_range_will_not_be_included", placement: "rightTop" } })),
                                        this.$render("i-stack", { direction: "horizontal", width: '100%', gap: 10, alignItems: "center" },
                                            this.$render("i-stack", { direction: "vertical", gap: 2 },
                                                this.$render("i-datepicker", { id: "edtSince", width: "100%", height: 32, padding: { left: '0.5rem', right: '0.5rem' }, border: { radius: 5 }, enabled: false, background: { color: Theme.action.disabledBackground } })),
                                            this.$render("i-label", { caption: "$to", width: 50, class: index_css_1.textCenterStyle }),
                                            this.$render("i-stack", { direction: "vertical", gap: 2 },
                                                this.$render("i-datepicker", { id: "edtTil", width: "100%", height: 32, padding: { left: '0.5rem', right: '0.5rem' }, border: { radius: 5 }, enabled: false, background: { color: Theme.action.disabledBackground } }))),
                                        this.$render("i-label", { id: "lbDateRangeError", visible: false, font: { color: Theme.colors.error.main } })))))),
                    this.$render("i-stack", { direction: 'horizontal', justifyContent: 'end', alignItems: 'center', gap: "0.25rem" },
                        this.$render("i-button", { id: "btnSearch", enabled: false, minHeight: 36, minWidth: 120, caption: "$search", border: { radius: 18 }, padding: { top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem' }, margin: { top: '0.25rem', bottom: '0.5rem' }, font: { color: Theme.colors.primary.contrastText, bold: true }, onClick: this.handleSearch }))),
                this.$render("i-panel", { id: "pnlLoading", visible: false, height: 200 },
                    this.$render("i-stack", { height: "100%", direction: "vertical", gap: "0.5rem", alignItems: "center", justifyContent: 'center' },
                        this.$render("i-icon", { name: "spinner", width: 24, height: 24, spin: true }),
                        this.$render("i-label", { caption: "$fetching_tweets_from_x", font: { size: "24px" } }))),
                this.$render("i-panel", { id: "pnlFailed", visible: false, height: 200 },
                    this.$render("i-stack", { height: "100%", direction: "vertical", gap: "0.5rem", alignItems: "center", justifyContent: 'center' },
                        this.$render("i-icon", { name: "times-circle", width: 24, height: 24, fill: Theme.colors.error.main }),
                        this.$render("i-label", { id: "lbFailedMessage", font: { size: "24px" } }))),
                this.$render("i-stack", { id: "pnlResult", visible: false, direction: "vertical", gap: "0.25rem" },
                    this.$render("i-stack", { direction: "vertical", gap: "0.5rem" },
                        this.$render("i-stack", { direction: "horizontal", justifyContent: 'space-between' },
                            this.$render("i-stack", { direction: "horizontal", gap: "0.25rem" },
                                this.$render("i-label", { caption: "$tweets_found" }),
                                this.$render("i-label", { id: "lbTweetsCount", caption: "" })),
                            this.$render("i-stack", { direction: "horizontal", gap: "0.25rem" },
                                this.$render("i-label", { caption: "$selected" }),
                                this.$render("i-label", { id: "lbSelectedTweetsCount", caption: "0" }))),
                        this.$render("i-checkbox", { id: "chkAll", onChanged: this.handleCheckAllChanged, caption: "$select_all" }),
                        this.$render("i-stack", { id: "tweetsList", gap: "0.5rem", direction: "vertical" }),
                        this.$render("i-stack", { direction: "horizontal", justifyContent: "center" },
                            this.$render("i-pagination", { id: "pgnTweets", class: index_css_1.paginationStyle }))),
                    this.$render("i-stack", { direction: 'horizontal', justifyContent: 'end', alignItems: 'center', gap: "0.25rem", margin: { top: 5 } },
                        this.$render("i-button", { id: "btnBack", enabled: true, minHeight: 36, minWidth: 120, caption: "$back", border: { radius: 18 }, padding: { top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem' }, margin: { top: '0.25rem', bottom: '0.5rem' }, font: { color: Theme.colors.primary.contrastText, bold: true }, onClick: this.handleBackClick }),
                        this.$render("i-button", { id: "btnImport", enabled: false, minHeight: 36, minWidth: 120, caption: "$import", border: { radius: 18 }, padding: { top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem' }, margin: { top: '0.25rem', bottom: '0.5rem' }, font: { color: Theme.colors.primary.contrastText, bold: true }, onClick: this.handleSubmit })))));
        }
    };
    ImportTweetsModule = __decorate([
        (0, components_2.customElements)('i-scom-import-tweets-module')
    ], ImportTweetsModule);
    exports.ImportTweetsModule = ImportTweetsModule;
});
