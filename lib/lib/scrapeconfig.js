"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapeConfig = void 0;
var utils_1 = require("./utils");
var logger_1 = require("./logger");
var errors_1 = require("./errors");
var ScrapeConfig = /** @class */ (function () {
    function ScrapeConfig(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
        this.retry = true;
        this.method = 'GET';
        this.country = null;
        this.render_js = false;
        this.cache = false;
        this.cache_clear = false;
        this.cost_budget = null;
        this.ssl = false;
        this.dns = false;
        this.asp = false;
        this.debug = false;
        this.raise_on_upstream_error = true;
        this.cache_ttl = null;
        this.proxy_pool = null;
        this.session = null;
        this.tags = new Set();
        this.correlation_id = null;
        this.cookies = null;
        this.body = null;
        this.data = null;
        this.headers = null;
        this.js = null;
        this.rendering_wait = null;
        this.wait_for_selector = null;
        this.session_sticky_proxy = false;
        this.screenshots = null;
        this.webhook = null;
        this.timeout = null; // in milliseconds
        this.js_scenario = null;
        this.extract = null;
        this.lang = null;
        this.os = null;
        this.auto_scroll = null;
        this.url = options.url;
        this.retry = (_a = options.retry) !== null && _a !== void 0 ? _a : this.retry;
        this.method = (_b = options.method) !== null && _b !== void 0 ? _b : this.method;
        this.country = (_c = options.country) !== null && _c !== void 0 ? _c : this.country;
        this.session_sticky_proxy = (_d = options.session_sticky_proxy) !== null && _d !== void 0 ? _d : this.session_sticky_proxy;
        this.render_js = (_e = options.render_js) !== null && _e !== void 0 ? _e : this.render_js;
        this.cache = (_f = options.cache) !== null && _f !== void 0 ? _f : this.cache;
        this.cache_clear = (_g = options.cache_clear) !== null && _g !== void 0 ? _g : this.cache_clear;
        this.cost_budget = (_h = options.cost_budget) !== null && _h !== void 0 ? _h : this.cost_budget;
        this.asp = (_j = options.asp) !== null && _j !== void 0 ? _j : this.asp;
        this.headers = options.headers
            ? Object.fromEntries(Object.entries(options.headers).map(function (_a) {
                var k = _a[0], v = _a[1];
                return [k.toLowerCase(), v];
            }))
            : {};
        this.raise_on_upstream_error = (_k = options.raise_on_upstream_error) !== null && _k !== void 0 ? _k : this.raise_on_upstream_error;
        this.cache_ttl = (_l = options.cache_ttl) !== null && _l !== void 0 ? _l : this.cache_ttl;
        this.proxy_pool = (_m = options.proxy_pool) !== null && _m !== void 0 ? _m : this.proxy_pool;
        this.session = (_o = options.session) !== null && _o !== void 0 ? _o : this.session;
        this.tags = (_p = new Set(options.tags)) !== null && _p !== void 0 ? _p : this.tags;
        this.correlation_id = (_q = options.correlation_id) !== null && _q !== void 0 ? _q : this.correlation_id;
        this.cookies = options.cookies
            ? Object.fromEntries(Object.entries(options.cookies).map(function (_a) {
                var k = _a[0], v = _a[1];
                return [k.toLowerCase(), v];
            }))
            : {};
        this.body = (_r = options.body) !== null && _r !== void 0 ? _r : this.body;
        this.data = (_s = options.data) !== null && _s !== void 0 ? _s : this.data;
        this.js = (_t = options.js) !== null && _t !== void 0 ? _t : this.js;
        this.rendering_wait = (_u = options.rendering_wait) !== null && _u !== void 0 ? _u : this.rendering_wait;
        this.wait_for_selector = (_v = options.wait_for_selector) !== null && _v !== void 0 ? _v : this.wait_for_selector;
        this.screenshots = (_w = options.screenshots) !== null && _w !== void 0 ? _w : this.screenshots;
        this.webhook = (_x = options.webhook) !== null && _x !== void 0 ? _x : this.webhook;
        this.timeout = (_y = options.timeout) !== null && _y !== void 0 ? _y : this.timeout;
        this.js_scenario = (_z = options.js_scenario) !== null && _z !== void 0 ? _z : this.js_scenario;
        this.extract = (_0 = options.extract) !== null && _0 !== void 0 ? _0 : this.extract;
        this.os = (_1 = options.os) !== null && _1 !== void 0 ? _1 : this.os;
        this.lang = (_2 = options.lang) !== null && _2 !== void 0 ? _2 : this.lang;
        this.auto_scroll = (_3 = options.auto_scroll) !== null && _3 !== void 0 ? _3 : this.auto_scroll;
        this.dns = (_4 = options.dns) !== null && _4 !== void 0 ? _4 : this.dns;
        this.ssl = (_5 = options.ssl) !== null && _5 !== void 0 ? _5 : this.ssl;
        this.debug = (_6 = options.debug) !== null && _6 !== void 0 ? _6 : this.debug;
        if (this.body && this.data) {
            throw new errors_1.ScrapeConfigError('Cannot set both body and data');
        }
        if (['POST', 'PUT', 'PATCH'].includes(this.method)) {
            if (this.data && !this.body) {
                if (!this.headers['content-type']) {
                    this.headers['content-type'] = 'application/x-www-form-urlencoded';
                    this.body = new URLSearchParams(this.data).toString();
                }
                else {
                    if ((_7 = this.headers['content-type']) === null || _7 === void 0 ? void 0 : _7.includes('application/json')) {
                        this.body = JSON.stringify(this.data);
                    }
                    else if ((_8 = this.headers['content-type']) === null || _8 === void 0 ? void 0 : _8.includes('application/x-www-form-urlencoded')) {
                        this.body = new URLSearchParams(this.data).toString();
                    }
                    else {
                        throw new errors_1.ScrapeConfigError("Content-Type \"".concat(this.headers['content-type'], "\" not supported, use body parameter to pass pre encoded body according to your content type"));
                    }
                }
            }
            else if (this.body && !this.data) {
                this.headers['content-type'] = 'text/plain';
            }
        }
    }
    ScrapeConfig.prototype.toApiParams = function (options) {
        var _this = this;
        var params = {
            key: options.key,
            url: this.url
        };
        if (this.country) {
            params.country = this.country;
        }
        if (this.headers != null && Object.keys(this.headers).length > 0) {
            Object.entries(this.headers).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                params["headers[".concat(key, "]")] = value;
            });
        }
        if (this.cookies != null && Object.keys(this.cookies).length > 0) {
            var cookiesAsHeader = __spreadArray([], Object.entries(this.cookies), true).map(function (_a) {
                var key = _a[0], value = _a[1];
                return "".concat(key, "=").concat(value);
            })
                .join('; ');
            if (params['headers[cookie]']) {
                // if current cookie value doesn't have a ';' at the end, add it.
                if (params['headers[cookie]'][params['headers[cookie]'].length - 1] !== ';') {
                    params['headers[cookie]'] += ';';
                }
                params['headers[cookie]'] += " ".concat(cookiesAsHeader);
            }
            else {
                params['headers[cookie]'] = cookiesAsHeader;
            }
        }
        if (this.webhook) {
            params.webhook_name = this.webhook;
        }
        if (this.timeout) {
            params.timeout = this.timeout;
        }
        if (this.render_js === true) {
            params.render_js = true;
            if (this.wait_for_selector !== null) {
                params.wait_for_selector = this.wait_for_selector;
            }
            if (this.js !== null) {
                params.js = (0, utils_1.urlsafe_b64encode)(this.js);
            }
            if (this.js_scenario !== null) {
                params.js_scenario = (0, utils_1.urlsafe_b64encode)(JSON.stringify(this.js_scenario));
            }
            if (this.rendering_wait !== null) {
                params.rendering_wait = this.rendering_wait;
            }
            if (this.screenshots) {
                Object.keys(this.screenshots).forEach(function (key) {
                    if (_this.screenshots != null)
                        params["screenshots[".concat(key, "]")] = _this.screenshots[key];
                });
            }
            if (this.auto_scroll !== null) {
                params.auto_scroll = this.auto_scroll;
            }
        }
        else {
            if (this.wait_for_selector !== null) {
                logger_1.log.warn('Params "wait_for_selector" is ignored. Works only if render_js is enabled');
            }
            if (this.screenshots !== null) {
                logger_1.log.warn('Params "screenshots" is ignored. Works only if render_js is enabled');
            }
            if (this.js_scenario !== null) {
                logger_1.log.warn('Params "js_scenario" is ignored. Works only if render_js is enabled');
            }
            if (this.js !== null) {
                logger_1.log.warn('Params "js" is ignored. Works only if render_js is enabled');
            }
            if (this.rendering_wait !== null) {
                logger_1.log.warn('Params "rendering_wait" is ignored. Works only if render_js is enabled');
            }
        }
        if (this.asp === true) {
            params.asp = true;
        }
        if (this.retry === false) {
            params.retry = false;
        }
        if (this.cache === true) {
            params.cache = true;
            if (this.cache_clear) {
                params.cache_clear = true;
            }
            if (this.cache_ttl) {
                params.cache_ttl = this.cache_ttl;
            }
        }
        else {
            if (this.cache_clear) {
                logger_1.log.warn('Params "cache_clear" is ignored. Works only if cache is enabled');
            }
            if (this.cache_ttl) {
                logger_1.log.warn('Params "cache_ttl" is ignored. Works only if cache is enabled');
            }
        }
        if (this.dns === true) {
            params.dns = true;
        }
        if (this.ssl === true) {
            params.ssl = true;
        }
        if (this.tags.size > 0) {
            params.tags = Array.from(this.tags).join(',');
        }
        if (this.correlation_id) {
            params.correlation_id = this.correlation_id;
        }
        if (this.session) {
            params.session = this.session;
            if (this.session_sticky_proxy) {
                params.session_sticky_proxy = true;
            }
        }
        else {
            if (this.session_sticky_proxy) {
                logger_1.log.warn('Params "session_sticky_proxy" is ignored. Works only if session is enabled');
            }
        }
        if (this.debug === true) {
            params.debug = true;
        }
        if (this.proxy_pool) {
            params.proxy_pool = this.proxy_pool;
        }
        if (this.lang !== null) {
            params.lang = this.lang.join(',');
        }
        if (this.os !== null) {
            params.os = this.os;
        }
        // XXX: mising this.extract(?)
        return params;
    };
    ScrapeConfig.PUBLIC_DATACENTER_POOL = 'public_datacenter_pool';
    ScrapeConfig.PUBLIC_RESIDENTIAL_POOL = 'public_residential_pool';
    return ScrapeConfig;
}());
exports.ScrapeConfig = ScrapeConfig;
