"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cookie_1 = require("@flagfw/server/bin/common/Cookie");
class Session {
    constructor(req, res) {
        this.cookie = new Cookie_1.default(req, res);
    }
}
exports.default = Session;
