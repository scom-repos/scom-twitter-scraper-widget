"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramsToObject = exports.objectToParams = void 0;
const objectToParams = (data) => {
    return encodeURIComponent(JSON.stringify(data));
};
exports.objectToParams = objectToParams;
const paramsToObject = (params) => {
    return JSON.parse(decodeURIComponent(JSON.parse(params)));
};
exports.paramsToObject = paramsToObject;
