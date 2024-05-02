export class ParameterError extends Error {
    constructor(...params) {
        super(...params);
    }
}

export class Validators {
    isFunction(data): boolean {
        return typeof data === "function";
    }

    isNonEmptyString(data): boolean {
        return this.isString(data) && data !== "";
    }

    isDate(data): boolean {
        return this.isInstanceStrict(data, Date) && this.isInteger(data.getTime());
    }

    isEmptyString(data): boolean {
        return data === "" || (data instanceof String && data.toString() === "");
    }

    isString(data): boolean {
        return typeof data === "string" || data instanceof String;
    }

    isObject(data): boolean {
        return toString.call(data) === "[object Object]";
    }

    isInstanceStrict(data, prototype): boolean {
        try {
            return data instanceof prototype;
        } catch (error) {
            return false;
        }
    }

    isInteger(data): boolean {
        return typeof data === "number" && data % 1 === 0;
    }

    /* End validation functions */

    validate(bool: boolean, cb, options?: any) {
        if (!this.isFunction(cb)) {
            options = cb;
            cb = null;
        }
        if (!this.isObject(options)) options = {Error: "Failed Check"};
        if (!bool) {
            if (cb) {
                cb(new ParameterError(options));
            } else {
                throw new ParameterError(options);
            }
        }
    }

}
