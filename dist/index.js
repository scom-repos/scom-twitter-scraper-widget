var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-twitter-scraper/const.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BEARER_TOKEN = exports.SEARCH_API = exports.SEARCH_TIMELINE = exports.GET_FOLLOWING_BY_USER_ID = exports.GET_FOLLOWERS_BY_USER_ID = exports.GET_USER_BY_SCREENAME = exports.GET_TWEETS_BY_USER_ID = exports.GET_TWEET_BY_ID = exports.ACTIVATE_GUEST_API = void 0;
    ///<amd-module name='@scom/scom-twitter-scraper/const.ts'/> 
    const ACTIVATE_GUEST_API = 'https://api.twitter.com/1.1/guest/activate.json';
    exports.ACTIVATE_GUEST_API = ACTIVATE_GUEST_API;
    const GET_USER_BY_SCREENAME = 'https://twitter.com/i/api/graphql/G3KGOASz96M-Qu0nwmGXNg/UserByScreenName';
    exports.GET_USER_BY_SCREENAME = GET_USER_BY_SCREENAME;
    const GET_TWEETS_BY_USER_ID = 'https://twitter.com/i/api/graphql/H8OOoI-5ZE4NxgRr8lfyWg/UserTweets';
    exports.GET_TWEETS_BY_USER_ID = GET_TWEETS_BY_USER_ID;
    const GET_TWEET_BY_ID = 'https://twitter.com/i/api/graphql/DJS3BdhUhcaEpZ7B7irJDg/TweetResultByRestId';
    exports.GET_TWEET_BY_ID = GET_TWEET_BY_ID;
    const GET_FOLLOWERS_BY_USER_ID = 'https://twitter.com/i/api/graphql/rRXFSG5vR6drKr5M37YOTw/Followers';
    exports.GET_FOLLOWERS_BY_USER_ID = GET_FOLLOWERS_BY_USER_ID;
    const GET_FOLLOWING_BY_USER_ID = 'https://twitter.com/i/api/graphql/iSicc7LrzWGBgDPL0tM_TQ/Following';
    exports.GET_FOLLOWING_BY_USER_ID = GET_FOLLOWING_BY_USER_ID;
    const SEARCH_TIMELINE = 'https://api.twitter.com/graphql/gkjsKepM6gl_HmFWoWKfgg/SearchTimeline';
    exports.SEARCH_TIMELINE = SEARCH_TIMELINE;
    const SEARCH_API = 'https://twitter.com/i/api/2/search/adaptive.json';
    exports.SEARCH_API = SEARCH_API;
    const BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAFQODgEAAAAAVHTp76lzh3rFzcHbmHVvQxYYpTw%3DckAlMINMjmCwxUcaXbAN4XqJVdgMJaHqNOFgPMK0zN1qLqLQCF';
    exports.BEARER_TOKEN = BEARER_TOKEN;
});
define("@scom/scom-twitter-scraper/utils/validators.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Validators = exports.ParameterError = void 0;
    ///<amd-module name='@scom/scom-twitter-scraper/utils/validators.ts'/> 
    class ParameterError extends Error {
        constructor(...params) {
            super(...params);
        }
    }
    exports.ParameterError = ParameterError;
    class Validators {
        isFunction(data) {
            return typeof data === "function";
        }
        isNonEmptyString(data) {
            return this.isString(data) && data !== "";
        }
        isDate(data) {
            return this.isInstanceStrict(data, Date) && this.isInteger(data.getTime());
        }
        isEmptyString(data) {
            return data === "" || (data instanceof String && data.toString() === "");
        }
        isString(data) {
            return typeof data === "string" || data instanceof String;
        }
        isObject(data) {
            return toString.call(data) === "[object Object]";
        }
        isInstanceStrict(data, prototype) {
            try {
                return data instanceof prototype;
            }
            catch (error) {
                return false;
            }
        }
        isInteger(data) {
            return typeof data === "number" && data % 1 === 0;
        }
        /* End validation functions */
        validate(bool, cb, options) {
            if (!this.isFunction(cb)) {
                options = cb;
                cb = null;
            }
            if (!this.isObject(options))
                options = { Error: "Failed Check" };
            if (!bool) {
                if (cb) {
                    cb(new ParameterError(options));
                }
                else {
                    throw new ParameterError(options);
                }
            }
        }
    }
    exports.Validators = Validators;
});
define("@scom/scom-twitter-scraper/utils/cookie.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const MONTH_TO_NUM = {
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dec: 11
    };
    const TERMINATORS = ["\n", "\r", "\0"];
    const DATE_DELIM = /[\x09\x20-\x2F\x3B-\x40\x5B-\x60\x7B-\x7E]/;
    const CONTROL_CHARS = /[\x00-\x1F]/;
    class Cookie {
        constructor() {
            this.cookie = {};
        }
        updateCookie(cookieStr) {
            const cookies = this.parseCookie(cookieStr);
            for (const cookie of cookies) {
                const { extensions, ...rest } = cookie;
                this.cookie = { ...this.cookie, ...rest };
                if (!this.cookie.extensions)
                    this.cookie.extensions = [];
                for (let i = 0; i < extensions.length; i++) {
                    const extension = extensions[i];
                    const key = extension.split('=')[0].trim().toLowerCase();
                    const value = extension.split('=')[1];
                    let keyFoundIndex = -1;
                    for (const ext of this.cookie.extensions) {
                        const key2 = ext.split('=')[0].trim().toLowerCase();
                        if (key === key2) {
                            keyFoundIndex = i;
                        }
                    }
                    if (keyFoundIndex === -1)
                        this.cookie.extensions.push(extension);
                    else if (keyFoundIndex >= 0) {
                        this.cookie.extensions.splice(keyFoundIndex, 1);
                        this.cookie.extensions.push(extension);
                    }
                }
                // this.cookies[`${cookie.secure ? 'https' : 'http'}://${cookie.domain}${cookie.path}`] = cookie;
            }
            this.cookieStr = cookieStr;
        }
        getCookie() {
            return this.cookie;
        }
        getCookieExtensionStr() {
            return this.cookie.extensions?.join('; ') || '';
        }
        getExtByKey(key) {
            const data = this.cookie.extensions?.filter(extension => extension.split('=')[0].trim().toLowerCase() === key)[0];
            return data ? data.split('=')[1] : null;
        }
        parseCookie(cookieStr) {
            const cookies = this.splitCookiesString(cookieStr);
            const cookieList = [];
            for (const cookie of cookies) {
                const cookiePairs = cookie.split(';');
                const cookieObj = {};
                for (const pair of cookiePairs) {
                    const key = pair.split('=')[0].trim().toLowerCase();
                    const value = pair.split('=')[1];
                    if (key === 'expires') {
                        const date = new Date(value);
                        cookieObj.expires = date;
                    }
                    else if (key === 'max-age') {
                        if (/^-?[0-9]+$/.test(value)) {
                            const delta = parseInt(value, 10);
                            cookieObj.maxAge = delta;
                        }
                    }
                    else if (key === 'domain') {
                        cookieObj.domain = value.trim().replace(/^\./, "");
                    }
                    else if (key === 'path') {
                        cookieObj.path = value && value[0] === "/" ? value : null;
                    }
                    else if (key === 'secure') {
                        cookieObj.secure = true;
                    }
                    else if (key === 'httponly') {
                        cookieObj.httpOnly = true;
                    }
                    else if (key === 'samesite') {
                        const acceptableValues = ['strict', 'lax', 'none'];
                        if (acceptableValues.indexOf(value.toLowerCase()) >= 0)
                            cookieObj.sameSite = value.toLowerCase();
                        else
                            cookieObj.sameSite = undefined;
                    }
                    else {
                        if (!cookieObj.extensions)
                            cookieObj.extensions = [];
                        cookieObj.extensions.push(pair);
                    }
                }
                cookieList.push(cookieObj);
            }
            return cookieList;
        }
        splitCookiesString(cookiesString) {
            if (Array.isArray(cookiesString)) {
                return cookiesString;
            }
            if (typeof cookiesString !== "string") {
                return [];
            }
            var cookiesStrings = [];
            var pos = 0;
            var start;
            var ch;
            var lastComma;
            var nextStart;
            var cookiesSeparatorFound;
            function skipWhitespace() {
                while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
                    pos += 1;
                }
                return pos < cookiesString.length;
            }
            function notSpecialChar() {
                ch = cookiesString.charAt(pos);
                return ch !== "=" && ch !== ";" && ch !== ",";
            }
            while (pos < cookiesString.length) {
                start = pos;
                cookiesSeparatorFound = false;
                while (skipWhitespace()) {
                    ch = cookiesString.charAt(pos);
                    if (ch === ",") {
                        // ',' is a cookie separator if we have later first '=', not ';' or ','
                        lastComma = pos;
                        pos += 1;
                        skipWhitespace();
                        nextStart = pos;
                        while (pos < cookiesString.length && notSpecialChar()) {
                            pos += 1;
                        }
                        // currently special character
                        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                            // we found cookies separator
                            cookiesSeparatorFound = true;
                            // pos is inside the next cookie, so back up and return it.
                            pos = nextStart;
                            cookiesStrings.push(cookiesString.substring(start, lastComma));
                            start = pos;
                        }
                        else {
                            // in param ',' or param separator ';',
                            // we continue from that comma
                            pos = lastComma + 1;
                        }
                    }
                    else {
                        pos += 1;
                    }
                }
                if (!cookiesSeparatorFound || pos >= cookiesString.length) {
                    cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
                }
            }
            return cookiesStrings;
        }
    }
    exports.default = Cookie;
});
define("@scom/scom-twitter-scraper/utils/auth.ts", ["require", "exports", "@scom/scom-twitter-scraper/const.ts"], function (require, exports, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Auth {
        constructor(cookie) {
            this.cookie = cookie;
        }
        // Guest Token
        async updateGuestToken() {
            const response = await fetch(const_1.ACTIVATE_GUEST_API, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${const_1.BEARER_TOKEN}`,
                }
            });
            if (response.ok) {
                this.cookie.updateCookie(response.headers.get('set-cookie'));
                const result = await response.json();
                this.guestToken = result['guest_token'];
            }
            else
                return null;
        }
        getGuestToken() {
            return this.guestToken;
        }
        // User Authentication
        async login(username, password, email, twoFactorSecret) {
            await this.updateGuestToken();
            let next = await this.initLogin();
            while ('subtask' in next && next.subtask) {
                if (next.subtask.subtask_id === 'LoginJsInstrumentationSubtask') {
                    next = await this.handleJsInstrumentationSubtask(next);
                }
                else if (next.subtask.subtask_id === 'LoginEnterUserIdentifierSSO') {
                    next = await this.handleEnterUserIdentifierSSO(next, username);
                }
                else if (next.subtask.subtask_id === 'LoginEnterPassword') {
                    next = await this.handleEnterPassword(next, password);
                }
                else if (next.subtask.subtask_id === 'AccountDuplicationCheck') {
                    next = await this.handleAccountDuplicationCheck(next);
                }
                else if (next.subtask.subtask_id === 'LoginEnterAlternateIdentifierSubtask') {
                    next = await this.handleEnterAlternateIdentifierSubtask(next, username);
                }
                // else if (next.subtask.subtask_id === 'LoginTwoFactorAuthChallenge') {
                //     if (twoFactorSecret) {
                //         next = await this.handleTwoFactorAuthChallenge(next, twoFactorSecret);
                //     }
                //     else {
                //         throw new Error('Requested two factor authentication code but no secret provided');
                //     }
                // }
                else if (next.subtask.subtask_id === 'LoginAcid') {
                    next = await this.handleAcid(next, email);
                }
                else if (next.subtask.subtask_id === 'LoginSuccessSubtask') {
                    next = await this.handleSuccessSubtask(next);
                }
                else {
                    throw new Error(`Unknown subtask ${next.subtask.subtask_id}`);
                }
            }
            if ('err' in next) {
                throw next.err;
            }
        }
        async logout() {
            if (!this.isLoggedIn()) {
                return;
            }
            const headers = {
                authorization: `Bearer ${const_1.BEARER_TOKEN}`,
                cookie: this.cookie.getCookieExtensionStr()
            };
            this.installCsrfToken(headers);
            await fetch('https://api.twitter.com/1.1/account/logout.json', {
                method: 'POST',
                headers
            });
        }
        async isLoggedIn() {
            const headers = {
                authorization: `Bearer ${const_1.BEARER_TOKEN}`,
                cookie: this.cookie.getCookieExtensionStr()
            };
            this.installCsrfToken(headers);
            const response = await fetch('https://api.twitter.com/1.1/account/verify_credentials.json', {
                method: 'GET',
                headers
            });
            if (!response.ok) {
                return false;
            }
            const result = await response.json();
            return !!result && !result.errors?.length;
        }
        async initLogin() {
            return await this.executeFlowTask({
                flow_name: 'login',
                input_flow_data: {
                    flow_context: {
                        debug_overrides: {},
                        start_location: {
                            location: 'splash_screen',
                        },
                    },
                },
            });
        }
        // Flow Task
        async handleJsInstrumentationSubtask(prev) {
            return await this.executeFlowTask({
                flow_token: prev.flowToken,
                subtask_inputs: [
                    {
                        subtask_id: 'LoginJsInstrumentationSubtask',
                        js_instrumentation: {
                            response: '{}',
                            link: 'next_link',
                        },
                    },
                ],
            });
        }
        async handleEnterUserIdentifierSSO(prev, username) {
            return await this.executeFlowTask({
                flow_token: prev.flowToken,
                subtask_inputs: [
                    {
                        subtask_id: 'LoginEnterUserIdentifierSSO',
                        settings_list: {
                            setting_responses: [
                                {
                                    key: 'user_identifier',
                                    response_data: {
                                        text_data: { result: username },
                                    },
                                },
                            ],
                            link: 'next_link',
                        },
                    },
                ],
            });
        }
        async handleEnterPassword(prev, password) {
            return await this.executeFlowTask({
                flow_token: prev.flowToken,
                subtask_inputs: [
                    {
                        subtask_id: 'LoginEnterPassword',
                        enter_password: {
                            password,
                            link: 'next_link',
                        },
                    },
                ],
            });
        }
        async handleAccountDuplicationCheck(prev) {
            return await this.executeFlowTask({
                flow_token: prev.flowToken,
                subtask_inputs: [
                    {
                        subtask_id: 'AccountDuplicationCheck',
                        check_logged_in_account: {
                            link: 'AccountDuplicationCheck_false',
                        },
                    },
                ],
            });
        }
        async handleEnterAlternateIdentifierSubtask(prev, username) {
            return await this.executeFlowTask({
                flow_token: prev.flowToken,
                subtask_inputs: [{
                        enter_text: {
                            link: 'next_link',
                            text: username // or phone number
                        },
                        subtask_id: 'LoginEnterAlternateIdentifierSubtask'
                    }]
            });
        }
        // async handleTwoFactorAuthChallenge(prev, secret) {
        //     const totp = new OTPAuth.TOTP({ secret });
        //     let error;
        //     for (let attempts = 1; attempts < 4; attempts += 1) {
        //         try {
        //             return await this.executeFlowTask({
        //                 flow_token: prev.flowToken,
        //                 subtask_inputs: [
        //                     {
        //                         subtask_id: 'LoginTwoFactorAuthChallenge',
        //                         enter_text: {
        //                             link: 'next_link',
        //                             text: totp.generate(),
        //                         },
        //                     },
        //                 ],
        //             });
        //         }
        //         catch (err) {
        //             error = err;
        //             await new Promise((resolve) => setTimeout(resolve, 2000 * attempts));
        //         }
        //     }
        //     throw error;
        // }
        async handleAcid(prev, email) {
            return await this.executeFlowTask({
                flow_token: prev.flowToken,
                subtask_inputs: [
                    {
                        subtask_id: 'LoginAcid',
                        enter_text: {
                            text: email,
                            link: 'next_link',
                        },
                    },
                ],
            });
        }
        async handleSuccessSubtask(prev) {
            return await this.executeFlowTask({
                flow_token: prev.flowToken,
                subtask_inputs: [],
            });
        }
        async executeFlowTask(data) {
            const onboardingTaskUrl = 'https://api.twitter.com/1.1/onboarding/task.json';
            const guestToken = this.getGuestToken();
            if (guestToken == null) {
                throw new Error('Authentication token is null or undefined.');
            }
            const headers = {
                authorization: `Bearer ${const_1.BEARER_TOKEN}`,
                cookie: this.cookie.getCookieExtensionStr(),
                'content-type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Nokia G20) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Mobile Safari/537.36',
                'x-guest-token': guestToken,
                'x-twitter-auth-type': 'OAuth2Client',
                'x-twitter-active-user': 'yes',
                'x-twitter-client-language': 'en',
            };
            this.installCsrfToken(headers);
            const res = await fetch(onboardingTaskUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                return { status: 'error', err: new Error(await res.text()) };
            }
            this.cookie.updateCookie(res.headers.get('set-cookie'));
            const flow = await res.json();
            if (flow?.flow_token == null) {
                return { status: 'error', err: new Error('flow_token not found.') };
            }
            if (flow.errors?.length) {
                return {
                    status: 'error',
                    err: new Error(`Authentication error (${flow.errors[0].code}): ${flow.errors[0].message}`),
                };
            }
            if (typeof flow.flow_token !== 'string') {
                return {
                    status: 'error',
                    err: new Error('flow_token was not a string.'),
                };
            }
            const subtask = flow.subtasks?.length ? flow.subtasks[0] : undefined;
            if (subtask && subtask.subtask_id === 'DenyLoginSubtask') {
                return {
                    status: 'error',
                    err: new Error('Authentication error: DenyLoginSubtask'),
                };
            }
            return {
                status: 'success',
                subtask,
                flowToken: flow.flow_token,
            };
        }
        installCsrfToken(headers) {
            const ct0 = this.cookie.getExtByKey('ct0');
            if (ct0) {
                headers['x-csrf-token'] = ct0;
            }
        }
    }
    exports.default = Auth;
});
///<amd-module name='@scom/scom-twitter-scraper/utils/parser.ts'/> 
// import {ITweets} from "../managers/scraperManager";
define("@scom/scom-twitter-scraper/utils/parser.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Parser {
        htmlToMarkdown(html) {
            let markdown = '';
            // Replace <br> with newline
            html = html.replace(/<br\s*\/?>/gi, '\n');
            // Replace <strong> and <b> tags with **
            html = html.replace(/<(strong|b)\b[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**');
            // Replace <em> and <i> tags with *
            html = html.replace(/<(em|i)\b[^>]*>(.*?)<\/(em|i)>/gi, '*$2*');
            // Replace <a> tags with [text](href)
            html = html.replace(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*>(.*?)<\/a>/gi, '[$3]($2)');
            // Replace <img> tags with ![alt](src)
            html = html.replace(/<img\b[^>]+?alt=(['"])(.*?)\1[^>]+?src=(['"])(.*?)\3[^>]*>/gi, '![alt]($4)');
            // Replace <h1> to <h6> tags with corresponding #
            for (let i = 6; i >= 1; i--) {
                html = html.replace(new RegExp('<h' + i + '\\b[^>]*>(.*?)</h' + i + '>', 'gi'), '#$1\n');
            }
            // Replace <p> tags with newline
            html = html.replace(/<p\b[^>]*>(.*?)<\/p>/gi, '$1\n');
            // Replace <ul> and <ol> with list Markdown
            html = html.replace(/<ul\b[^>]*>(.*?)<\/ul>/gi, (_, content) => {
                return content.replace(/<li\b[^>]*>(.*?)<\/li>/gi, '- $1\n');
            });
            html = html.replace(/<ol\b[^>]*>(.*?)<\/ol>/gi, (_, content) => {
                let index = 0;
                return content.replace(/<li\b[^>]*>(.*?)<\/li>/gi, (_, item) => {
                    index++;
                    return `${index}. ${item}\n`;
                });
            });
            // Convert remaining tags to text
            html = html.replace(/<[^>]*>/g, '');
            markdown += html;
            return markdown;
        }
        reconstructTweetHtml(tweet, photos, videos) {
            const reHashtag = /\B(\#\S+\b)/g;
            const reCashtag = /\B(\$\S+\b)/g;
            const reTwitterUrl = /https:(\/\/t\.co\/([A-Za-z0-9]|[A-Za-z]){10})/g;
            const reUsername = /\B(\@\S{1,15}\b)/g;
            function linkHashtagHtml(hashtag) {
                return `<a href="https://twitter.com/hashtag/${hashtag.replace('#', '')}">${hashtag}</a>`;
            }
            function linkCashtagHtml(cashtag) {
                return `<a href="https://twitter.com/search?q=%24${cashtag.replace('$', '')}">${cashtag}</a>`;
            }
            function linkUsernameHtml(username) {
                return `<a href="https://twitter.com/${username.replace('@', '')}">${username}</a>`;
            }
            function unwrapTcoUrlHtml(tweet, foundedMedia) {
                return function (tco) {
                    for (const entity of tweet.entities?.urls ?? []) {
                        if (tco === entity.url && entity.expanded_url != null) {
                            return `<a href="${entity.expanded_url}">${tco}</a>`;
                        }
                    }
                    for (const entity of tweet.extended_entities?.media ?? []) {
                        if (tco === entity.url && entity.media_url_https != null) {
                            foundedMedia.push(entity.media_url_https);
                            return `<br><a href="${tco}"><img src="${entity.media_url_https}"/></a>`;
                        }
                    }
                    return tco;
                };
            }
            const media = [];
            // HTML parsing with regex :)
            let html = tweet.full_text ?? '';
            html = html.replace(reHashtag, linkHashtagHtml);
            html = html.replace(reCashtag, linkCashtagHtml);
            html = html.replace(reUsername, linkUsernameHtml);
            html = html.replace(reTwitterUrl, unwrapTcoUrlHtml(tweet, media));
            for (const { url } of photos) {
                if (media.indexOf(url) !== -1) {
                    continue;
                }
                html += `<br><img src="${url}"/>`;
            }
            for (const { preview: url } of videos) {
                if (media.indexOf(url) !== -1) {
                    continue;
                }
                html += `<br><img src="${url}"/>`;
            }
            html = html.replace(/\n/g, '<br>');
            return html;
        }
        parseVideo(m) {
            const video = {
                id: m.id_str,
                preview: m.media_url_https,
            };
            let maxBitrate = 0;
            const variants = m.video_info?.variants ?? [];
            for (const variant of variants) {
                const bitrate = variant.bitrate;
                if (bitrate != null && bitrate > maxBitrate && variant.url != null) {
                    let variantUrl = variant.url;
                    const stringStart = 0;
                    const tagSuffixIdx = variantUrl.indexOf('?tag=10');
                    if (tagSuffixIdx !== -1) {
                        variantUrl = variantUrl.substring(stringStart, tagSuffixIdx + 1);
                    }
                    video.url = variantUrl;
                    maxBitrate = bitrate;
                }
            }
            return video;
        }
        parseMediaGroups(media) {
            const photos = [];
            const videos = [];
            let sensitiveContent = undefined;
            for (const m of media
                .filter((m) => m['id_str'] != null)
                .filter((m) => m['media_url_https'] != null)) {
                if (m.type === 'photo') {
                    photos.push({
                        id: m.id_str,
                        url: m.media_url_https,
                        alt_text: m.ext_alt_text,
                    });
                }
                else if (m.type === 'video') {
                    videos.push(this.parseVideo(m));
                }
                const sensitive = m.ext_sensitive_media_warning;
                if (sensitive != null) {
                    sensitiveContent =
                        sensitive.adult_content ||
                            sensitive.graphic_violence ||
                            sensitive.other;
                }
            }
            return { sensitiveContent, photos, videos };
        }
        parseLegacyTweet(user, tweet) {
            if (tweet == null) {
                return {
                    success: false,
                    err: new Error('Tweet was not found in the timeline object.'),
                };
            }
            if (user == null) {
                return {
                    success: false,
                    err: new Error('User was not found in the timeline object.'),
                };
            }
            if (!tweet.id_str) {
                if (!tweet.conversation_id_str) {
                    return {
                        success: false,
                        err: new Error('Tweet ID was not found in object.'),
                    };
                }
                tweet.id_str = tweet.conversation_id_str;
            }
            const hashtags = tweet.entities?.hashtags ?? [];
            const mentions = tweet.entities?.user_mentions ?? [];
            const media = tweet.extended_entities?.media ?? [];
            const pinnedTweets = new Set(user.pinned_tweet_ids_str ?? []);
            const urls = tweet.entities?.urls ?? [];
            const { photos, videos, sensitiveContent } = this.parseMediaGroups(media);
            let text = tweet.full_text;
            const textUrls = text.match(/\bhttps?:\/\/\S+/gi) || [];
            for (const url of textUrls) {
                const _url = urls.find(v => v.url === url);
                text = text.replaceAll(url, _url?.expanded_url || '');
            }
            if (photos.length > 0) {
                for (const photo of photos) {
                    text += ` \n${photo.url}`;
                }
            }
            const tw = {
                conversationId: tweet.conversation_id_str,
                id: tweet.id_str,
                hashtags: hashtags
                    .filter((hashtag) => hashtag['text'] != null)
                    .map((hashtag) => hashtag.text),
                likes: tweet.favorite_count,
                mentions: mentions.filter((mention) => mention['id_str'] != null).map((mention) => ({
                    id: mention.id_str,
                    username: mention.screen_name,
                    name: mention.name,
                })),
                name: user.name,
                permanentUrl: `https://twitter.com/${user.screen_name}/status/${tweet.id_str}`,
                photos,
                replies: tweet.reply_count,
                retweets: tweet.retweet_count,
                text: text,
                thread: [],
                urls: urls
                    .filter((url) => url['expanded_url'] != null)
                    .map((url) => url.expanded_url),
                userId: tweet.user_id_str,
                username: user.screen_name,
                videos,
                isQuoted: false,
                isReply: false,
                isRetweet: false,
                isPin: false,
                sensitiveContent: false,
            };
            if (tweet.created_at) {
                tw.timeParsed = new Date(Date.parse(tweet.created_at));
                tw.timestamp = Math.floor(tw.timeParsed.valueOf() / 1000);
            }
            if (tweet.place?.id) {
                tw.place = tweet.place;
            }
            const quotedStatusIdStr = tweet.quoted_status_id_str;
            const inReplyToStatusIdStr = tweet.in_reply_to_status_id_str;
            const retweetedStatusIdStr = tweet.retweeted_status_id_str;
            const retweetedStatusResult = tweet.retweeted_status_result?.result;
            if (quotedStatusIdStr) {
                tw.isQuoted = true;
                tw.quotedStatusId = quotedStatusIdStr;
            }
            if (inReplyToStatusIdStr) {
                tw.isReply = true;
                tw.inReplyToStatusId = inReplyToStatusIdStr;
            }
            if (retweetedStatusIdStr || retweetedStatusResult) {
                tw.isRetweet = true;
                tw.retweetedStatusId = retweetedStatusIdStr;
                if (retweetedStatusResult) {
                    const parsedResult = this.parseLegacyTweet(retweetedStatusResult?.core?.user_results?.result?.legacy, retweetedStatusResult?.legacy);
                    if (parsedResult.success) {
                        tw.retweetedStatus = parsedResult.tweet;
                    }
                }
            }
            const views = parseInt(tweet.ext_views?.count ?? '');
            if (!isNaN(views)) {
                tw.views = views;
            }
            if (pinnedTweets.has(tweet.id_str)) {
                // TODO: Update tests so this can be assigned at the tweet declaration
                tw.isPin = true;
            }
            if (sensitiveContent) {
                // TODO: Update tests so this can be assigned at the tweet declaration
                tw.sensitiveContent = true;
            }
            tw.html = this.reconstructTweetHtml(tweet, tw.photos, tw.videos);
            tw.markdown = this.htmlToMarkdown(tw.html);
            return { success: true, tweet: tw };
        }
        parseAndPush(tweets, content, entryId, isConversation = false) {
            const tweet = this.parseTimelineEntryItemContentRaw(content, entryId, isConversation);
            if (tweet) {
                tweets.push(tweet);
            }
        }
        parseTimelineEntryItemContentRaw(content, entryId, isConversation = false) {
            const result = content.tweet_results?.result ?? content.tweetResult?.result;
            if (result?.__typename === 'Tweet') {
                if (result.legacy) {
                    result.legacy.id_str =
                        result.rest_id ??
                            entryId.replace('conversation-', '').replace('tweet-', '');
                }
                const tweetResult = this.parseResult(result);
                if (tweetResult.success) {
                    if (isConversation) {
                        if (content?.tweetDisplayType === 'SelfThread') {
                            tweetResult.tweet.isSelfThread = true;
                        }
                    }
                    return tweetResult.tweet;
                }
            }
            return null;
        }
        parseResult(result) {
            const noteTweetResultText = result?.note_tweet?.note_tweet_results?.result?.text;
            if (result?.legacy && noteTweetResultText) {
                result.legacy.full_text = noteTweetResultText;
            }
            const tweetResult = this.parseLegacyTweet(result?.core?.user_results?.result?.legacy, result?.legacy);
            if (!tweetResult.success) {
                return tweetResult;
            }
            if (!tweetResult.tweet.views && result?.views?.count) {
                const views = parseInt(result.views.count);
                if (!isNaN(views)) {
                    tweetResult.tweet.views = views;
                }
            }
            const quotedResult = result?.quoted_status_result?.result;
            if (quotedResult) {
                if (quotedResult.legacy && quotedResult.rest_id) {
                    quotedResult.legacy.id_str = quotedResult.rest_id;
                }
                const quotedTweetResult = this.parseResult(quotedResult);
                if (quotedTweetResult.success) {
                    tweetResult.tweet.quotedStatus = quotedTweetResult.tweet;
                }
            }
            return tweetResult;
        }
        parseTimelineTweetsV2(timeline) {
            const expectedEntryTypes = ['tweet', 'profile-conversation'];
            let bottomCursor;
            let topCursor;
            const tweets = [];
            const instructions = timeline.data?.user?.result?.timeline_v2?.timeline?.instructions ?? [];
            for (const instruction of instructions) {
                const entries = instruction.entries ?? [];
                for (const entry of entries) {
                    const entryContent = entry.content;
                    if (!entryContent)
                        continue;
                    // Handle pagination
                    if (entryContent.cursorType === 'Bottom') {
                        bottomCursor = entryContent.value;
                        continue;
                    }
                    else if (entryContent.cursorType === 'Top') {
                        topCursor = entryContent.value;
                        continue;
                    }
                    const idStr = entry.entryId;
                    if (!expectedEntryTypes.some((entryType) => idStr.startsWith(entryType))) {
                        continue;
                    }
                    if (entryContent.itemContent) {
                        // Typically TimelineTimelineTweet entries
                        this.parseAndPush(tweets, entryContent.itemContent, idStr);
                    }
                    else if (entryContent.items) {
                        // Typically TimelineTimelineModule entries
                        for (const item of entryContent.items) {
                            if (item.item?.itemContent) {
                                this.parseAndPush(tweets, item.item.itemContent, idStr);
                            }
                        }
                    }
                }
            }
            return { tweets, next: bottomCursor, previous: topCursor };
        }
        parseRelationshipTimeline(timeline) {
            let bottomCursor;
            let topCursor;
            const profiles = [];
            const instructions = timeline.data?.user?.result?.timeline?.timeline?.instructions ?? [];
            for (const instruction of instructions) {
                if (instruction.type === 'TimelineAddEntries' ||
                    instruction.type === 'TimelineReplaceEntry') {
                    if (instruction.entry?.content?.cursorType === 'Bottom') {
                        bottomCursor = instruction.entry.content.value;
                        continue;
                    }
                    if (instruction.entry?.content?.cursorType === 'Top') {
                        topCursor = instruction.entry.content.value;
                        continue;
                    }
                    const entries = instruction.entries ?? [];
                    for (const entry of entries) {
                        const itemContent = entry.content?.itemContent;
                        if (itemContent?.userDisplayType === 'User') {
                            const userResultRaw = itemContent.user_results?.result;
                            if (userResultRaw?.legacy) {
                                const profile = this.parseProfile(userResultRaw.legacy, userResultRaw.is_blue_verified);
                                if (!profile.userId) {
                                    profile.userId = userResultRaw.rest_id;
                                }
                                profiles.push(profile);
                            }
                        }
                        else if (entry.content?.cursorType === 'Bottom') {
                            bottomCursor = entry.content.value;
                        }
                        else if (entry.content?.cursorType === 'Top') {
                            topCursor = entry.content.value;
                        }
                    }
                }
            }
            return { profiles, next: bottomCursor, previous: topCursor };
        }
        parseProfile(user, isBlueVerified) {
            const profile = {
                avatar: this.getAvatarOriginalSizeUrl(user.profile_image_url_https),
                banner: user.profile_banner_url,
                biography: user.description,
                followersCount: user.followers_count,
                followingCount: user.friends_count,
                friendsCount: user.friends_count,
                mediaCount: user.media_count,
                isPrivate: user.protected ?? false,
                isVerified: user.verified,
                likesCount: user.favourites_count,
                listedCount: user.listed_count,
                location: user.location,
                name: user.name,
                pinnedTweetIds: user.pinned_tweet_ids_str,
                tweetsCount: user.statuses_count,
                url: `https://twitter.com/${user.screen_name}`,
                userId: user.id_str,
                username: user.screen_name,
                isBlueVerified: isBlueVerified ?? false,
                canDm: user.can_dm,
            };
            if (user.created_at != null) {
                profile.joined = new Date(Date.parse(user.created_at));
            }
            const urls = user.entities?.url?.urls;
            if (urls?.length != null && urls?.length > 0) {
                profile.website = urls[0].expanded_url;
            }
            return profile;
        }
        parseSearchTimelineUsers(timeline) {
            let bottomCursor;
            let topCursor;
            const tweets = [];
            const instructions = timeline.data?.search_by_raw_query?.search_timeline?.timeline
                ?.instructions ?? [];
            for (const instruction of instructions) {
                if (instruction.type === 'TimelineAddEntries' ||
                    instruction.type === 'TimelineReplaceEntry') {
                    if (instruction.entry?.content?.cursorType === 'Bottom') {
                        bottomCursor = instruction.entry.content.value;
                        continue;
                    }
                    else if (instruction.entry?.content?.cursorType === 'Top') {
                        topCursor = instruction.entry.content.value;
                        continue;
                    }
                    const entries = instruction.entries ?? [];
                    for (const entry of entries) {
                        const itemContent = entry.content?.itemContent;
                        if (itemContent?.tweetDisplayType === 'Tweet') {
                            const tweetResultRaw = itemContent.tweet_results?.result;
                            const tweetResult = this.parseLegacyTweet(tweetResultRaw?.core?.user_results?.result?.legacy, tweetResultRaw?.legacy);
                            if (tweetResult.success) {
                                if (!tweetResult.tweet.views && tweetResultRaw?.views?.count) {
                                    const views = parseInt(tweetResultRaw.views.count);
                                    if (!isNaN(views)) {
                                        tweetResult.tweet.views = views;
                                    }
                                }
                                tweets.push(tweetResult.tweet);
                            }
                        }
                        else if (entry.content?.cursorType === 'Bottom') {
                            bottomCursor = entry.content.value;
                        }
                        else if (entry.content?.cursorType === 'Top') {
                            topCursor = entry.content.value;
                        }
                    }
                }
            }
            return { tweets, next: bottomCursor, previous: topCursor };
        }
        getAvatarOriginalSizeUrl(avatarUrl) {
            return avatarUrl ? avatarUrl.replace('_normal', '') : undefined;
        }
    }
    exports.default = Parser;
});
define("@scom/scom-twitter-scraper/utils/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-twitter-scraper/managers/scraperManager.ts", ["require", "exports", "@scom/scom-twitter-scraper/utils/parser.ts"], function (require, exports, parser_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TwitterManager = void 0;
    class TwitterManager {
        constructor(scraperEngine, config) {
            this._currentAccountIndex = -1;
            this.hasMoreTweets = (data) => {
                const instructions = data.data.user.result.timeline_v2.timeline.instructions;
                const timelineAddEntries = instructions.filter(v => v.type === "TimelineAddEntries");
                if (timelineAddEntries.length === 0)
                    return false;
                return timelineAddEntries[0].entries?.length > 2;
            };
            this.parser = new parser_1.default();
            // this.cookie = new Cookie();
            // this.auth = new Auth(this.cookie);
            // this.api = new API(this.auth, this.cookie);
            this.scraperEngine = scraperEngine;
            this._config = config;
            if (config.twitterAccounts?.length > 0) {
                this._currentAccount = config.twitterAccounts[0];
                this._currentAccountIndex = 0;
            }
        }
        async init() {
            // const scraper = await this.scraperManager.getBrowserAndPage();
            // if (!scraper) {
            //     throw new Error('cannot open browser and page');
            // }
            await this.scraperEngine.init();
        }
        async checkIsLogin() {
            await this.redirect('https://x.com/home');
            try {
                await this.scraperEngine.waitForSelector('[data-testid="SideNav_AccountSwitcher_Button"]', 15000);
            }
            catch (e) {
                return false;
            }
            return true;
        }
        async exit() {
            await this.scraperEngine.destroy();
            // await this.logout(page);
            // await browser.close();
        }
        async enterUserName(username) {
            const usernameSelector = '[name="text"]';
            // const usernameInput = await page.$(usernameSelector);
            // await usernameInput.type(username);
            await this.scraperEngine.waitForSelector(usernameSelector);
            await this.scraperEngine.type(usernameSelector, username);
            console.log('Entering username');
            await this.scraperEngine.keyboard.press("Enter");
        }
        async enterPassword(password) {
            const passwordSelector = '[name="password"]';
            // const passwordInput = await page.$(passwordSelector);
            // await passwordInput.type(password);
            await this.scraperEngine.waitForSelector(passwordSelector);
            await this.scraperEngine.type(passwordSelector, password);
            console.log('Entering password');
            await this.scraperEngine.keyboard.press("Enter");
        }
        async enterEmailAddress(emailAddress) {
            const emailAddressSelector = '[data-testid="ocfEnterTextTextInput"]';
            // const emailAddressInput = await page.$(emailAddressSelector);
            // await emailAddressInput.type(emailAddress);
            await this.scraperEngine.waitForSelector(emailAddressSelector);
            await this.scraperEngine.type(emailAddressSelector, emailAddress);
            console.log('Entering email address');
            await this.scraperEngine.keyboard.press("Enter");
        }
        async loginWithCookie() {
            // @ts-ignore
            const fs = require('fs');
            // @ts-ignore
            const path = require('path');
            // @ts-ignore
            const TWITTER_COOKIES_JSON_FILE_PATH = path.join(process.cwd(), 'data', 'twitter_cookies.json');
            const exist = fs.existsSync(TWITTER_COOKIES_JSON_FILE_PATH);
            if (exist) {
                const storedCookies = fs.readFileSync(TWITTER_COOKIES_JSON_FILE_PATH);
                if (storedCookies) {
                    const storedCookiesList = JSON.parse(storedCookies.toString());
                    await this.scraperEngine.setCookie(...storedCookiesList);
                }
            }
            const isLogin = await this.checkIsLogin();
            if (!isLogin) {
                let loginSuccess = await this.login();
                while (!loginSuccess) {
                    console.log('Trying another account...');
                    this.useNextTwitterAccount();
                    loginSuccess = await this.login();
                }
                if (loginSuccess) {
                    console.log('Writing cookies into local storage...');
                    const cookies = await this.scraperEngine.getCookies();
                    fs.writeFileSync(TWITTER_COOKIES_JSON_FILE_PATH, JSON.stringify(cookies, null, 2));
                }
            }
        }
        async login() {
            return new Promise(async (resolve, reject) => {
                try {
                    const timeout = setTimeout(() => {
                        resolve(false);
                    }, 30000);
                    console.log('Logging in...');
                    await this.redirect('https://x.com/i/flow/login');
                    this.scraperEngine.on('response', async (response) => {
                        if (response.url() !== 'https://api.x.com/1.1/onboarding/task.json')
                            return;
                        if (response.ok() && response.request().method() === 'POST') {
                            console.log(`[${response.request().method()}] ${response.url()} - ${response.ok()}`);
                            try {
                                const data = await response.json();
                                if (data.subtasks?.length > 0) {
                                    switch (data.subtasks[0].subtask_id) {
                                        case "LoginEnterUserIdentifierSSO":
                                            await this.enterUserName(this._currentAccount.username);
                                            break;
                                        case "LoginEnterPassword":
                                            await this.enterPassword(this._currentAccount.password);
                                            break;
                                        case "LoginEnterAlternateIdentifierSubtask":
                                        case "LoginAcid": {
                                            await this.enterEmailAddress(this._currentAccount.emailAddress);
                                            break;
                                        }
                                        case "LoginSuccessSubtask": {
                                            clearTimeout(timeout);
                                            this.scraperEngine.removeAllListeners('response');
                                            resolve(true);
                                            break;
                                        }
                                    }
                                }
                            }
                            catch (e) {
                                console.log(e);
                            }
                        }
                    });
                    // const response = await page.waitForResponse("https://api.x.com/1.1/onboarding/task.json");
                    // if (response.ok && response.request().method() === 'POST') {
                    //     const data = await response.json();
                    //     if (data.subtasks?.length > 0) {
                    //         switch (data.subtasks[0].subtask_id) {
                    //             case "LoginEnterUserIdentifierSSO":
                    //                 await this.enterUserName(page, this._currentAccount.username);
                    //                 break;
                    //             case "LoginEnterPassword":
                    //                 await this.enterPassword(page, this._currentAccount.password);
                    //                 break;
                    //             case "LoginEnterAlternateIdentifierSubtask":
                    //             case "LoginAcid": {
                    //                 await this.enterEmailAddress(page, this._currentAccount.emailAddress);
                    //                 break;
                    //             }
                    //             case "LoginSuccessSubtask": {
                    //                 return;
                    //             }
                    //         }
                    //     }
                    // }
                }
                catch {
                    console.log('Failed to login');
                }
            });
        }
        async logout() {
            const logoutButtonSelector = '[data-testid="confirmationSheetConfirm"]';
            console.log('Logging out...');
            await this.scraperEngine.goto('https://x.com/logout');
            // const logoutButton = await page.$(logoutButtonSelector);
            // await logoutButton.click();
            await this.scraperEngine.waitForSelector(logoutButtonSelector);
            await this.scraperEngine.click(logoutButtonSelector);
            await this.scraperEngine.waitForNavigation();
            console.log('Logged out.');
        }
        async redirect(url) {
            return this.scraperEngine.goto(url);
        }
        useNextTwitterAccount() {
            const newIndex = ++this._currentAccountIndex;
            this._currentAccount = newIndex >= this._config.twitterAccounts.length ? this._config.twitterAccounts[0] : this._config.twitterAccounts[newIndex];
            return false;
            // if (newIndex >= this._config.twitterAccounts.length) {
            //     this._cur
            // }
            // this._currentAccount = this._config.twitterAccounts[newIndex];
            // return false;
        }
        async scrapTweets(username, since = 0, til, maxTweets) {
            return new Promise(async (resolve, reject) => {
                console.log('username', username);
                console.log('since', since);
                console.log('til', til);
                console.log('maxTweets', maxTweets);
                if (!username) {
                    return resolve({
                        success: false,
                        message: "Username is empty."
                    });
                }
                if (since && til && since > til) {
                    return resolve({
                        success: false,
                        message: "Start date should be less or equal than end date."
                    });
                }
                await this.loginWithCookie();
                let tweets = [];
                // console.log('scrapTweets', this._currentAccount);
                // console.log("Logging in...");
                // await this.login(page);
                // try {
                //     await page.waitForNavigation();
                // } catch {
                //     const accountDepleted = this.useNextTwitterAccount();
                //     if (accountDepleted) {
                //         console.log('Account depleted.');
                //         return [];
                //     }
                //     return await this.scrapTweets(browser, page, username, since, maxTweets);
                // }
                // let response = null;
                let hasMore = true;
                let scrolldownTimer;
                this.scraperEngine.on('response', async (response) => {
                    if (response.url().indexOf('UserByScreenName') >= 0 && response.request().method() === 'GET') {
                        console.log(response.url());
                        if (!response.ok()) {
                            console.log('Failed to get screenname', await response.text());
                        }
                        const userInfo = await response.json();
                        if (userInfo.data.user === undefined) {
                            this.scraperEngine.removeAllListeners('response');
                            this.exit();
                            return resolve({
                                success: false,
                                message: 'User does not exist.'
                            });
                        }
                    }
                    if (response.url().indexOf('UserTweets') >= 0 && response.request().method() === 'GET') {
                        if (scrolldownTimer) {
                            clearTimeout(scrolldownTimer);
                        }
                        if (!response.ok()) {
                            await this.logout();
                            this.useNextTwitterAccount();
                            await this.login();
                            await this.redirect(`https://x.com/${username}`);
                            await this.scraperEngine.waitForNavigation(30000);
                        }
                        else {
                            const responseData = await response.json();
                            const content = this.parser.parseTimelineTweetsV2(responseData);
                            tweets = [...tweets, ...content.tweets];
                            let isTimeValid = true;
                            if (since && til && tweets.length) {
                                const oldestTweet = tweets.sort((a, b) => b.timestamp - a.timestamp)[0];
                                isTimeValid = (oldestTweet.timestamp * 1000) > since;
                            }
                            hasMore = isTimeValid && (!maxTweets || tweets.length < maxTweets) && this.hasMoreTweets(responseData);
                            if (hasMore) {
                                console.log("Scrolling down");
                                scrolldownTimer = setTimeout(async () => {
                                    await this.scraperEngine.scrollToBottom();
                                }, 2000);
                            }
                            else {
                                if (maxTweets) {
                                    tweets = tweets.slice(0, maxTweets);
                                }
                                if (since && til) {
                                    tweets = tweets.filter(v => (v.timestamp * 1000) >= since && (v.timestamp * 1000) <= til);
                                }
                                console.log('Tweets scraped. Total scraped: ', tweets.length);
                                this.scraperEngine.removeAllListeners('response');
                                this.exit();
                                return resolve({
                                    success: true,
                                    tweets
                                });
                            }
                        }
                    }
                });
                console.log("Redirecting to target page...");
                await this.redirect(`https://x.com/${username}`);
                // do {
                //     try {
                //         try {
                //             response = await page.waitForResponse(res => res.url().indexOf('UserTweets') >= 0 && res.request().method() === 'GET');
                //         }
                //         catch (e) {
                //             if (tweets.length > 0)
                //                 return tweets;
                //         }
                //         await page.screenshot({path: 'response_screenshot.png'});
                //         if (!response.ok()) {
                //             console.log('Failed', await response.text());
                //             await this.logout(page);
                //             this.useNextTwitterAccount();
                //             console.log('switchig account...', this._currentAccount)
                //             await this.login(page);
                //             const tweets = await this.scrapTweets(browser, page, username, since, maxTweets);
                //             return resolve(tweets);
                //         }
                //         const responseData = await response.json();
                //         const content = this.parser.parseTimelineTweetsV2(responseData);
                //         tweets = [...tweets, ...content.tweets];
                //         let isTimeValid = true;
                //         if (since && tweets.length) {
                //             const oldestTweet = tweets.sort((a, b) => b.timestamp - a.timestamp)[0];
                //             isTimeValid = (oldestTweet.timestamp * 1000) > since;
                //         }
                //         hasMore = isTimeValid && (!maxTweets || tweets.length < maxTweets) && this.hasMoreTweets(responseData);
                //         if (hasMore) {
                //             console.log("Scrolling down");
                //             await sleep(2000)
                //             await page.evaluate(() => {
                //                 window.scrollTo(0, document.body.scrollHeight);
                //             });
                //         }
                //     }
                //     catch (e) {
                //         console.log(e);
                //         await this.logout(page);
                //         this.useNextTwitterAccount();
                //         await this.login(page);
                //         const tweets = this.scrapTweets(browser, page, username, since, maxTweets);
                //         return resolve(tweets);
                //     }
                // } while (hasMore);
                // if (maxTweets) {
                //     tweets = tweets.slice(0, maxTweets);
                // }
                // if (since) {
                //     tweets = tweets.filter(v => (v.timestamp * 1000) >= since);
                // }
                // console.log('Tweets scraped. Total scraped: ', tweets.length)
                // return resolve(tweets);
            });
        }
        async getTweetsByUserName(username, since = 0, til, maxTweets) {
            let tweets = [];
            // const scraper = await this.scraperManager.getBrowserAndPage();
            // if (!scraper) {
            //     console.log('cannot open browser and page');
            //     return tweets;
            // }
            // const { browser, page } = scraper;
            try {
                const result = await this.scrapTweets(username, since, til, maxTweets);
                return result;
            }
            catch (e) {
                console.log(e);
                return {
                    success: false,
                    message: e.message
                };
            }
            finally {
                // await browser.close();
            }
        }
    }
    exports.TwitterManager = TwitterManager;
});
define("@scom/scom-twitter-scraper/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.paginationStyle = exports.tweetPreviewStyle = void 0;
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
});
define("@scom/scom-twitter-scraper", ["require", "exports", "@ijstech/components", "@scom/scom-twitter-scraper/managers/scraperManager.ts", "@scom/scom-twitter-scraper/utils/parser.ts", "@scom/scom-twitter-scraper/index.css.ts"], function (require, exports, components_2, scraperManager_1, parser_2, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Parser = exports.TwitterManager = exports.ImportTweetsModule = void 0;
    Object.defineProperty(exports, "TwitterManager", { enumerable: true, get: function () { return scraperManager_1.TwitterManager; } });
    exports.Parser = parser_2.default;
    const Theme = components_2.Styles.Theme.ThemeVars;
    const pageSize = 5;
    const textCenterStyle = components_2.Styles.style({
        textAlign: 'center'
    });
    let ImportTweetsModule = class ImportTweetsModule extends components_2.Module {
        constructor() {
            super();
            this.checkedTweets = [];
        }
        init() {
            super.init();
        }
        clear() {
        }
        async getTweets(username, since, until, maxTweets) {
            if (!username) {
                throw new Error("Username is required.");
            }
            const urlSearchParams = new URLSearchParams();
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
                                            this.$render("i-label", { caption: "To", width: 50, class: textCenterStyle }),
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
        (0, components_2.customElements)('scom-social--import-tweets-module')
    ], ImportTweetsModule);
    exports.ImportTweetsModule = ImportTweetsModule;
});
