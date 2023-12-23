"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("@flagfw/flag/bin/Util");
const Cookie_1 = require("@flagfw/server/bin/common/Cookie");
const fs = require("fs");
class Session {
    constructor(req, res) {
        this.wsidName = "wsid";
        this.wsid = null;
        this.wsidLength = 64;
        this.wsidCheckTime = 60;
        this.wsidMaxLimit = 3600 * 24 * 14;
        this.writePath = "/opt/.sessions";
        this.cookie = new Cookie_1.default(req, res);
        this.wsid = this.cookie.get(this.wsidName);
    }
    getWritePath() {
        let spath = this.writePath + "/" + this.wsid;
        spath = spath.split("//").join("/");
        return spath;
    }
    wsidCheck() {
        if (!fs.existsSync(this.writePath)) {
            fs.mkdirSync(this.writePath, {
                recursive: true,
            });
        }
        let now = new Date();
        if (!this.wsid) {
            this.wsidRefresh();
            return;
        }
        const spath = this.getWritePath();
        if (!fs.existsSync(spath)) {
            this.wsidRefresh();
            return;
        }
        let getSessionStr = fs.readFileSync(spath).toString();
        let getSession = JSON.parse(getSessionStr);
        const limitTime = getSession.limitTime;
        if (now.getTime() > limitTime) {
            this.wsidRefresh();
        }
    }
    wsidRefresh() {
        const newWsid = Util_1.default.uniqId(this.wsidLength);
        const now = new Date();
        let newPath = this.writePath + "/" + newWsid;
        newPath = newPath.split("//").join("/");
        let sdata;
        if (this.wsid) {
            let oldPath = this.writePath + "/" + this.wsid;
            oldPath = oldPath.split("//").join("/");
            if (fs.existsSync(oldPath)) {
                fs.renameSync(oldPath, newPath);
                const sdataStr = fs.readFileSync(newPath).toString();
                sdata = JSON.parse(sdataStr);
            }
            else {
                sdata = {};
            }
        }
        else {
            sdata = {};
        }
        const limitTime = now.getTime() + (this.wsidCheckTime * 1000);
        sdata.limitTime = limitTime;
        fs.writeFileSync(newPath, JSON.stringify(sdata));
        this.wsid = newWsid;
        this.cookie.set(this.wsidName, this.wsid, {
            maxAge: this.wsidMaxLimit,
        });
    }
    get(name) {
        this.wsidCheck();
        const spath = this.getWritePath();
        if (!fs.existsSync(spath)) {
            return;
        }
        let getSession = fs.readFileSync(spath).toString();
        getSession = JSON.parse(getSession);
        if (name) {
            return getSession[name];
        }
        else {
            return getSession;
        }
    }
    set(name, value) {
        this.wsidCheck();
        const spath = this.getWritePath();
        let sdata = this.get();
        if (!sdata) {
            sdata = {};
        }
        sdata[name] = value;
        sdata = JSON.stringify(sdata);
        fs.writeFileSync(spath, sdata);
        return this;
    }
    delete(name) {
        this.wsidCheck();
        const spath = this.getWritePath();
        let sdata = this.get();
        if (!sdata) {
            sdata = {};
        }
        delete sdata[name];
        sdata = JSON.stringify(sdata);
        fs.writeFileSync(spath, sdata);
        return this;
    }
}
exports.default = Session;
