"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
            const { extensions } = cookie, rest = __rest(cookie, ["extensions"]);
            this.cookie = Object.assign(Object.assign({}, this.cookie), rest);
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
        }
        this.cookieStr = cookieStr;
    }
    getCookie() {
        return this.cookie;
    }
    getCookieExtensionStr() {
        var _a;
        return ((_a = this.cookie.extensions) === null || _a === void 0 ? void 0 : _a.join('; ')) || '';
    }
    getExtByKey(key) {
        var _a;
        const data = (_a = this.cookie.extensions) === null || _a === void 0 ? void 0 : _a.filter(extension => extension.split('=')[0].trim().toLowerCase() === key)[0];
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
                    lastComma = pos;
                    pos += 1;
                    skipWhitespace();
                    nextStart = pos;
                    while (pos < cookiesString.length && notSpecialChar()) {
                        pos += 1;
                    }
                    if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                        cookiesSeparatorFound = true;
                        pos = nextStart;
                        cookiesStrings.push(cookiesString.substring(start, lastComma));
                        start = pos;
                    }
                    else {
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
