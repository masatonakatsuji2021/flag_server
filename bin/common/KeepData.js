"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeepData {
    static get(domain) {
        if (KeepData.__data__[domain]) {
            return KeepData.__data__[domain];
        }
    }
    static set(domain, value) {
        KeepData.__data__[domain] = value;
    }
}
KeepData.__data__ = {};
exports.default = KeepData;
