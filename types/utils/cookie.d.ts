type CookieObject = {
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    maxAge?: number;
    sameSite?: "strict" | "lax" | "none";
    expires?: Date;
    path?: string;
    extensions?: string[];
};
export default class Cookie {
    private cookie;
    private cookieStr;
    updateCookie(cookieStr: string): void;
    getCookie(): CookieObject;
    getCookieExtensionStr(): string;
    getExtByKey(key: string): string;
    private parseCookie;
    private splitCookiesString;
}
export {};
