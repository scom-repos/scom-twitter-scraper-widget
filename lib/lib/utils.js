"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlsafe_b64encode = void 0;
var urlsafe_b64encode = function (data) {
    return Buffer.from(data, 'utf-8').toString('base64').replace('+', '-').replace('/', '_').replace(/=+$/, '');
};
exports.urlsafe_b64encode = urlsafe_b64encode;
