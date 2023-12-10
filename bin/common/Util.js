"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerUtil {
    static getHome() {
        return process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
    }
    static getPort(status) {
    }
}
exports.default = ServerUtil;
