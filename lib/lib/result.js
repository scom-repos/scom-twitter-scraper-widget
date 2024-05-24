"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountData = exports.ScrapeResult = void 0;
var errors = require("./errors");
var cheerio = require("cheerio");
var ScrapeResult = /** @class */ (function () {
    function ScrapeResult(data) {
        this.config = data.config;
        this.context = data.context;
        this.result = data.result;
        this.uuid = data.uuid;
    }
    Object.defineProperty(ScrapeResult.prototype, "selector", {
        get: function () {
            if (!this._selector) {
                if (!this.result.response_headers['content-type'].includes('text/html')) {
                    throw new errors.ContentTypeError("Cannot use selector on non-html content-type, received: ".concat(this.result.response_headers['content-type']));
                }
                this._selector = cheerio.load(this.result.content);
            }
            return this._selector;
        },
        enumerable: false,
        configurable: true
    });
    return ScrapeResult;
}());
exports.ScrapeResult = ScrapeResult;
var AccountData = /** @class */ (function () {
    function AccountData() {
        this.acount = null;
        this.project = null;
        this.subscription = null;
    }
    return AccountData;
}());
exports.AccountData = AccountData;
