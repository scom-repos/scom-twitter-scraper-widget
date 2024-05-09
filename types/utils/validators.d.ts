export declare class ParameterError extends Error {
    constructor(...params: any[]);
}
export declare class Validators {
    isFunction(data: any): boolean;
    isNonEmptyString(data: any): boolean;
    isDate(data: any): boolean;
    isEmptyString(data: any): boolean;
    isString(data: any): boolean;
    isObject(data: any): boolean;
    isInstanceStrict(data: any, prototype: any): boolean;
    isInteger(data: any): boolean;
    validate(bool: boolean, cb: any, options?: any): void;
}
