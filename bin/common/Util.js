"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class ServerUtil {
    static getHome() {
        return process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"] + "/flag_servers";
    }
    static getServers(status) {
        let servers = [];
        const search = fs.readdirSync(ServerUtil.getHome());
        for (let n = 0; n < search.length; n++) {
            const sinit = ServerUtil.getServer(search[n]);
            if (!sinit) {
                continue;
            }
            if (status == 1) {
                if (sinit.ssl) {
                    continue;
                }
            }
            else if (status == 2) {
                if (!sinit.ssl) {
                    continue;
                }
            }
            if (!sinit.port) {
                if (sinit.ssl) {
                    sinit.port = 443;
                }
                else {
                    sinit.port = 80;
                }
            }
            if (!sinit.host) {
                sinit.host = "*";
            }
            servers.push(sinit);
        }
        return servers;
    }
    static getServer(serverName) {
        const initPath = ServerUtil.getHome() + "/" + serverName + "/" + ServerUtil.sinit;
        if (!fs.existsSync(initPath)) {
            return;
        }
        const sinit = require(initPath);
        if (!sinit) {
            return;
        }
        if (!sinit.default) {
            return;
        }
        sinit.default.rootDir = ServerUtil.getHome() + "/" + serverName;
        return sinit.default;
    }
    static getUsePorts(status) {
        let ports = [];
        const search = fs.readdirSync(ServerUtil.getHome());
        for (let n = 0; n < search.length; n++) {
            const sinit = ServerUtil.getServer(search[n]);
            if (!sinit) {
                continue;
            }
            if (status === 1) {
                if (sinit.ssl) {
                    continue;
                }
            }
            else if (status == 2) {
                if (!sinit.ssl) {
                    continue;
                }
            }
            if (ports.indexOf(sinit.port) === -1) {
                ports.push(sinit.port);
            }
        }
        return ports;
    }
}
ServerUtil.sinit = "/sinit.js";
exports.default = ServerUtil;
