"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("../const");
class Auth {
    constructor(cookie) {
        this.cookie = cookie;
    }
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
        var _a;
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
        return !!result && !((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length);
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
                        text: username
                    },
                    subtask_id: 'LoginEnterAlternateIdentifierSubtask'
                }]
        });
    }
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
        var _a, _b;
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
        if ((flow === null || flow === void 0 ? void 0 : flow.flow_token) == null) {
            return { status: 'error', err: new Error('flow_token not found.') };
        }
        if ((_a = flow.errors) === null || _a === void 0 ? void 0 : _a.length) {
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
        const subtask = ((_b = flow.subtasks) === null || _b === void 0 ? void 0 : _b.length) ? flow.subtasks[0] : undefined;
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
