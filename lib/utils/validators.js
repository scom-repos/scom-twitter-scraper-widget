"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validators = exports.ParameterError = void 0;
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
