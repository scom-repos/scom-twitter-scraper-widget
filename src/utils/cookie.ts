import {Validators} from "./validators";

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

type CookieObject = {
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    maxAge?: number;
    sameSite?: "strict" | "lax" | "none";
    expires?: Date;
    path?: string;
    extensions?: string[];
}

export default class Cookie {
    private cookie: CookieObject = {};
    private cookieStr: string;

    updateCookie(cookieStr: string) {
        const cookies: CookieObject[] = this.parseCookie(cookieStr);
        for(const cookie of cookies) {
            const {extensions, ...rest} = cookie;
            this.cookie = {...this.cookie, ...rest};
            if(!this.cookie.extensions)
                this.cookie.extensions = [];
            for(let i = 0; i < extensions.length; i++) {
                const extension = extensions[i];
                const key = extension.split('=')[0].trim().toLowerCase();
                const value = extension.split('=')[1];
                let keyFoundIndex = -1;
                for(const ext of this.cookie.extensions) {
                    const key2 = ext.split('=')[0].trim().toLowerCase();
                    if(key === key2) {
                        keyFoundIndex = i;
                    }
                }
                if(keyFoundIndex === -1)
                    this.cookie.extensions.push(extension);
                else if(keyFoundIndex >= 0) {
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

    getExtByKey(key: string) {
        const data = this.cookie.extensions?.filter(extension => extension.split('=')[0].trim().toLowerCase() === key)[0];
        return data ? data.split('=')[1] : null
    }

    private parseCookie(cookieStr: string): CookieObject[] {
        const cookies = this.splitCookiesString(cookieStr);
        const cookieList: CookieObject[] = [];
        for(const cookie of cookies) {
            const cookiePairs = cookie.split(';');
            const cookieObj: CookieObject = {};
            for(const pair of cookiePairs) {
                const key = pair.split('=')[0].trim().toLowerCase();
                const value = pair.split('=')[1];
                if(key === 'expires') {
                    const date = new Date(value);
                    cookieObj.expires = date;
                }

                else if(key === 'max-age') {
                    if (/^-?[0-9]+$/.test(value)) {
                        const delta = parseInt(value, 10);
                        cookieObj.maxAge = delta;
                    }
                }
                else if(key === 'domain') {
                    cookieObj.domain = value.trim().replace(/^\./, "");
                }
                else if(key === 'path') {
                    cookieObj.path = value && value[0] === "/" ? value : null;
                }
                else if(key === 'secure') {
                    cookieObj.secure = true;
                }
                else if(key === 'httponly') {
                    cookieObj.httpOnly = true;
                }
                else if(key === 'samesite') {
                    const acceptableValues = ['strict', 'lax', 'none'];
                    if(acceptableValues.indexOf(value.toLowerCase()) >= 0)
                        cookieObj.sameSite = value.toLowerCase();
                    else
                        cookieObj.sameSite = undefined;
                }
                else {
                    if(!cookieObj.extensions)
                        cookieObj.extensions = [];
                    cookieObj.extensions.push(pair);
                }
            }
            cookieList.push(cookieObj);
        }
        return cookieList;
    }

    private splitCookiesString(cookiesString: string) {
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
                    } else {
                        // in param ',' or param separator ';',
                        // we continue from that comma
                        pos = lastComma + 1;
                    }
                } else {
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
