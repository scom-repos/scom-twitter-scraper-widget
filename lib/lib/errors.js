"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotaLimitReached = exports.TooManyConcurrentRequests = exports.ScrapflySessionError = exports.ScrapflyWebhookError = exports.ScrapflyScheduleError = exports.ScrapflyAspError = exports.ScrapflyThrottleError = exports.ScrapflyProxyError = exports.ScrapflyScrapeError = exports.ApiHttpServerError = exports.TooManyRequests = exports.BadApiKeyError = exports.ApiHttpClientError = exports.UpstreamHttpServerError = exports.UpstreamHttpClientError = exports.UpstreamHttpError = exports.HttpError = exports.ContentTypeError = exports.EncodeError = exports.ScrapeConfigError = exports.ScrapflyError = void 0;
var ScrapflyError = /** @class */ (function (_super) {
    __extends(ScrapflyError, _super);
    function ScrapflyError(message, args) {
        var _this = _super.call(this, message) || this;
        _this.args = args;
        return _this;
    }
    return ScrapflyError;
}(Error));
exports.ScrapflyError = ScrapflyError;
// raised when scrape config is invalid
var ScrapeConfigError = /** @class */ (function (_super) {
    __extends(ScrapeConfigError, _super);
    function ScrapeConfigError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ScrapeConfigError;
}(ScrapflyError));
exports.ScrapeConfigError = ScrapeConfigError;
// raised when scrape parameters cannot be encoded
var EncodeError = /** @class */ (function (_super) {
    __extends(EncodeError, _super);
    function EncodeError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EncodeError;
}(ScrapflyError));
exports.EncodeError = EncodeError;
var ContentTypeError = /** @class */ (function (_super) {
    __extends(ContentTypeError, _super);
    function ContentTypeError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ContentTypeError;
}(ScrapflyError));
exports.ContentTypeError = ContentTypeError;
// Base error for all http related operations
var HttpError = /** @class */ (function (_super) {
    __extends(HttpError, _super);
    function HttpError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HttpError;
}(ScrapflyError));
exports.HttpError = HttpError;
var UpstreamHttpError = /** @class */ (function (_super) {
    __extends(UpstreamHttpError, _super);
    function UpstreamHttpError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpstreamHttpError;
}(HttpError));
exports.UpstreamHttpError = UpstreamHttpError;
var UpstreamHttpClientError = /** @class */ (function (_super) {
    __extends(UpstreamHttpClientError, _super);
    function UpstreamHttpClientError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpstreamHttpClientError;
}(UpstreamHttpError));
exports.UpstreamHttpClientError = UpstreamHttpClientError;
var UpstreamHttpServerError = /** @class */ (function (_super) {
    __extends(UpstreamHttpServerError, _super);
    function UpstreamHttpServerError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpstreamHttpServerError;
}(UpstreamHttpClientError));
exports.UpstreamHttpServerError = UpstreamHttpServerError;
var ApiHttpClientError = /** @class */ (function (_super) {
    __extends(ApiHttpClientError, _super);
    function ApiHttpClientError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ApiHttpClientError;
}(HttpError));
exports.ApiHttpClientError = ApiHttpClientError;
// raised when API key provided to client is not valid or not existant
var BadApiKeyError = /** @class */ (function (_super) {
    __extends(BadApiKeyError, _super);
    function BadApiKeyError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BadApiKeyError;
}(ApiHttpClientError));
exports.BadApiKeyError = BadApiKeyError;
var TooManyRequests = /** @class */ (function (_super) {
    __extends(TooManyRequests, _super);
    function TooManyRequests() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TooManyRequests;
}(HttpError));
exports.TooManyRequests = TooManyRequests;
var ApiHttpServerError = /** @class */ (function (_super) {
    __extends(ApiHttpServerError, _super);
    function ApiHttpServerError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ApiHttpServerError;
}(HttpError));
exports.ApiHttpServerError = ApiHttpServerError;
var ScrapflyScrapeError = /** @class */ (function (_super) {
    __extends(ScrapflyScrapeError, _super);
    function ScrapflyScrapeError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ScrapflyScrapeError;
}(HttpError));
exports.ScrapflyScrapeError = ScrapflyScrapeError;
// raised when proxy settings don't match available proxies (e.g. invalid proxy pool, country setting)
var ScrapflyProxyError = /** @class */ (function (_super) {
    __extends(ScrapflyProxyError, _super);
    function ScrapflyProxyError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ScrapflyProxyError;
}(HttpError));
exports.ScrapflyProxyError = ScrapflyProxyError;
var ScrapflyThrottleError = /** @class */ (function (_super) {
    __extends(ScrapflyThrottleError, _super);
    function ScrapflyThrottleError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ScrapflyThrottleError;
}(HttpError));
exports.ScrapflyThrottleError = ScrapflyThrottleError;
// raised when ScrapFly fails to bypass anti-scraping protection
var ScrapflyAspError = /** @class */ (function (_super) {
    __extends(ScrapflyAspError, _super);
    function ScrapflyAspError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ScrapflyAspError;
}(HttpError));
exports.ScrapflyAspError = ScrapflyAspError;
var ScrapflyScheduleError = /** @class */ (function (_super) {
    __extends(ScrapflyScheduleError, _super);
    function ScrapflyScheduleError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ScrapflyScheduleError;
}(HttpError));
exports.ScrapflyScheduleError = ScrapflyScheduleError;
// raised when Webhook is invalid or cannot be fulfilled (i.e. full queue)
var ScrapflyWebhookError = /** @class */ (function (_super) {
    __extends(ScrapflyWebhookError, _super);
    function ScrapflyWebhookError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ScrapflyWebhookError;
}(HttpError));
exports.ScrapflyWebhookError = ScrapflyWebhookError;
// raised when session is access concurrently
var ScrapflySessionError = /** @class */ (function (_super) {
    __extends(ScrapflySessionError, _super);
    function ScrapflySessionError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ScrapflySessionError;
}(HttpError));
exports.ScrapflySessionError = ScrapflySessionError;
// raised when concurrent requests exceed account limits
var TooManyConcurrentRequests = /** @class */ (function (_super) {
    __extends(TooManyConcurrentRequests, _super);
    function TooManyConcurrentRequests() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TooManyConcurrentRequests;
}(HttpError));
exports.TooManyConcurrentRequests = TooManyConcurrentRequests;
// raised when account is out of scrape credits
var QuotaLimitReached = /** @class */ (function (_super) {
    __extends(QuotaLimitReached, _super);
    function QuotaLimitReached() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QuotaLimitReached;
}(HttpError));
exports.QuotaLimitReached = QuotaLimitReached;
