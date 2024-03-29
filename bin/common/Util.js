"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class ServerUtil {
    static getHome() {
        return process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"] + "/flag_servers";
    }
    static getSetting() {
        const filePath = ServerUtil.getHome() + ServerUtil.setting;
        if (!fs.existsSync(filePath)) {
            return;
        }
        const _setting = require(filePath);
        if (!_setting) {
            return;
        }
        const setting = _setting;
        return setting;
    }
    static getServers(status) {
        let servers = [];
        if (!fs.existsSync(ServerUtil.getHome())) {
            return servers;
        }
        const search = fs.readdirSync(ServerUtil.getHome());
        for (let n = 0; n < search.length; n++) {
            const serverName = search[n];
            if (("/" + serverName) == ServerUtil.setting) {
                continue;
            }
            const sinit = ServerUtil.getServer(search[n], status);
            if (!sinit) {
                continue;
            }
            servers.push(sinit);
        }
        return servers;
    }
    static getServer(serverName, status) {
        const initPath = ServerUtil.getHome() + "/" + serverName + "/" + ServerUtil.sinit;
        if (!fs.existsSync(initPath)) {
            return;
        }
        const _sinit = require(initPath);
        if (!_sinit) {
            return;
        }
        if (!_sinit.default) {
            return;
        }
        const sinit = _sinit.default;
        sinit.rootDir = ServerUtil.getHome() + "/" + serverName;
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
        if (status == 1) {
            if (sinit.ssl) {
                return;
            }
        }
        else if (status == 2) {
            if (!sinit.ssl) {
                return;
            }
        }
        return sinit;
    }
    static getUsePorts(status) {
        let ports = [];
        if (!fs.existsSync(ServerUtil.getHome())) {
            return ports;
        }
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
ServerUtil.setting = "/setting.json";
exports.default = ServerUtil;
