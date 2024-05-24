"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapflyClient = void 0;
var errors = require("./errors");
var result_1 = require("./result");
var axios_1 = require("axios");
var axios_retry_1 = require("axios-retry");
var logger_1 = require("./logger");
axios_1.default.defaults.timeout = 160000; // 160 seconds
(0, axios_retry_1.default)(axios_1.default, {
    retries: 3,
    retryDelay: function (retryCount) {
        return retryCount * 1000;
    },
    // note: default retryCondition is isNetworkOrIdempotentRequestError and it works us
});
var ScrapflyClient = /** @class */ (function () {
    function ScrapflyClient(options) {
        this.HOST = 'https://api.scrapfly.io';
        if (typeof options.key !== 'string' || options.key.trim() === '') {
            throw new errors.BadApiKeyError('Invalid key. Key must be a non-empty string');
        }
        this.key = options.key;
        this.ua = 'Typescript Scrapfly SDK';
    }
    /**
     * Raise appropriate error for given response and scrape result
     */
    ScrapflyClient.prototype.errResult = function (response, result) {
        var _a, _b, _c, _d, _e;
        var error = result.result.error;
        var message = (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : '';
        var args = {
            code: result.result.status,
            http_status_code: result.result.status_code,
            is_retryable: (_b = error === null || error === void 0 ? void 0 : error.retryable) !== null && _b !== void 0 ? _b : false,
            api_response: result,
            resource: result.result.status ? result.result.status.split('::')[1] : null,
            retry_delay: (error === null || error === void 0 ? void 0 : error.retryable) ? 5 : (_d = ((_c = response.headers) !== null && _c !== void 0 ? _c : {})['X-Retry']) !== null && _d !== void 0 ? _d : 5,
            retry_times: 3,
            documentation_url: (_e = error === null || error === void 0 ? void 0 : error.doc_url) !== null && _e !== void 0 ? _e : 'https://scrapfly.io/docs/scrape-api/errors#api',
        };
        var resourceErrMap = {
            SCRAPE: errors.ScrapflyScrapeError,
            WEBHOOK: errors.ScrapflyWebhookError,
            PROXY: errors.ScrapflyProxyError,
            SCHEDULE: errors.ScrapflyScheduleError,
            ASP: errors.ScrapflyAspError,
            SESSION: errors.ScrapflySessionError,
        };
        var httpStatusErrMap = {
            401: errors.BadApiKeyError,
            429: errors.TooManyRequests,
        };
        if (result.result.success === true) {
            if (args.http_status_code >= 500) {
                return new errors.ApiHttpServerError(message, args);
            }
            if (httpStatusErrMap[args.http_status_code]) {
                return new httpStatusErrMap[args.http_status_code](message, args);
            }
            if (args.resource != null && resourceErrMap[args.resource]) {
                return new resourceErrMap[args.resource](message, args);
            }
            return new errors.ApiHttpClientError(message, args);
        }
        else {
            if (args.code === 'ERR::SCRAPE::BAD_UPSTREAM_RESPONSE') {
                if (args.http_status_code >= 500) {
                    return new errors.UpstreamHttpServerError(message, args);
                }
                if (args.http_status_code >= 400) {
                    return new errors.UpstreamHttpClientError(message, args);
                }
            }
            if (args.resource != null && resourceErrMap[args.resource]) {
                return new resourceErrMap[args.resource](message, args);
            }
            throw new errors.ScrapflyError(message, args);
        }
    };
    /**
     * Turn scrapfly API response to ScrapeResult or raise one of ScrapflyError
     */
    ScrapflyClient.prototype.handleResponse = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var data, result;
            return __generator(this, function (_a) {
                data = response.data;
                result = new result_1.ScrapeResult(data);
                logger_1.log.debug('scrape log url: ', result.result.log_url);
                // success
                if (result.result.status === 'DONE' && result.result.success === true) {
                    return [2 /*return*/, result];
                }
                // something went wrong
                throw this.errResult(response, result);
            });
        });
    };
    /**
     * Retrieve Scrapfly account details
     */
    ScrapflyClient.prototype.account = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.log.debug('retrieving account info');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.request({
                                method: 'GET',
                                url: this.HOST + '/account',
                                headers: {
                                    'user-agent': this.ua,
                                    'accept-ecoding': 'gzip, deflate, br',
                                    accept: 'application/json',
                                },
                                params: { key: this.key },
                            })];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 3:
                        e_1 = _a.sent();
                        logger_1.log.error('error', e_1);
                        if (e_1.response && e_1.response.status === 401) {
                            throw new errors.BadApiKeyError(JSON.stringify(e_1.response.data));
                        }
                        throw new errors.HttpError("failed to get account details; status code ".concat(e_1.response.status), e_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Issue a single scrape command from a given scrape configuration
     */
    ScrapflyClient.prototype.scrape = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_2, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.log.debug('scraping', { method: config.method, url: config.url });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.request({
                                method: config.method,
                                url: this.HOST + '/scrape',
                                headers: {
                                    'user-agent': this.ua,
                                    'content-type': config.method === 'POST' ? (config.headers && config.headers['content-type']) : 'application/json',
                                    'accept-ecoding': 'gzip, deflate, br',
                                    accept: 'application/json',
                                },
                                params: config.toApiParams({ key: this.key }),
                                data: config.body,
                            })];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        logger_1.log.error('error', e_2);
                        if (e_2.response && e_2.response.status === 401) {
                            throw new errors.BadApiKeyError(JSON.stringify(e_2.response.data));
                        }
                        throw e_2;
                    case 4: return [4 /*yield*/, this.handleResponse(response)];
                    case 5:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
        Concurrently scrape multiple configs
        This is a async generator call it like this:
  
          const results = [];
          const errors = [];
          for await (const resultOrError of client.concurrentScrape(configs)) {
              if (resultOrError instanceof Error) {
                  errors.push(resultOrError);
              } else {
                  results.push(resultOrError);
              }
          }
        
         @param concurrencyLimit: if not set it will be taken from your account info
       */
    ScrapflyClient.prototype.concurrentScrape = function (configs, concurrencyLimit) {
        return __asyncGenerator(this, arguments, function concurrentScrape_1() {
            var account, activePromises, configsIterator, startNewScrape, i, resultOrError;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(concurrencyLimit === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, __await(this.account())];
                    case 1:
                        account = _a.sent();
                        if (account.subscription)
                            concurrencyLimit = account.subscription.usage.scrape.concurrent_limit;
                        logger_1.log.info("concurrency not provided - setting it to ".concat(concurrencyLimit, " from account info"));
                        _a.label = 2;
                    case 2:
                        activePromises = new Set();
                        configsIterator = configs[Symbol.iterator]();
                        startNewScrape = function () {
                            var _a = configsIterator.next(), config = _a.value, done = _a.done;
                            if (done)
                                return; // No more configs
                            var promise = _this.scrape(config).catch(function (error) { return error; }); // Catch errors and return them
                            activePromises.add(promise);
                            promise.finally(function () {
                                activePromises.delete(promise);
                                // After each scrape, start a new one if there are remaining configs
                                startNewScrape();
                            });
                        };
                        // Initially start as many scrapes as the concurrency limit
                        for (i = 0; i < concurrencyLimit; i++) {
                            startNewScrape();
                        }
                        _a.label = 3;
                    case 3:
                        if (!(activePromises.size > 0)) return [3 /*break*/, 7];
                        logger_1.log.debug("concurrently scraping ".concat(activePromises.size, "/").concat(configs.length, "}"));
                        return [4 /*yield*/, __await(Promise.race(activePromises))];
                    case 4:
                        resultOrError = _a.sent();
                        return [4 /*yield*/, __await(resultOrError)];
                    case 5: return [4 /*yield*/, _a.sent()];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return ScrapflyClient;
}());
exports.ScrapflyClient = ScrapflyClient;
