"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require("querystring");
class Cookie {
    constructor(req, res) {
        this.req = null;
        this.res = null;
        this.setCookies = [];
        this.req = req;
        this.res = res;
    }
    /**
     * get
     * get Cookie data.
     * @param {string} name? get cookie name
     * @returns
     */
    get(name) {
        const _cookie = this.req.headers.cookie;
        if (!_cookie) {
            return;
        }
        const cookie = querystring.parse(_cookie, "; ");
        if (name) {
            if (cookie[name]) {
                return cookie[name];
            }
        }
        else {
            return cookie;
        }
    }
    /**
     * set
     * This is a function to prepare cookies
     * @param {sring} name setting cookie name
     * @param {any} value setting cookie value
     * @param {any} option? cookie option
     * @returns
     */
    set(name, value, option) {
        let cookieStr = name + "=" + value;
        if (!option) {
            option = {};
        }
        if (option.expires !== undefined) {
            cookieStr += "; Expires=" + option.expires;
        }
        if (option.maxAge !== undefined) {
            cookieStr += "; Max-Age=" + option.maxAge;
        }
        if (option.domain !== undefined) {
            cookieStr += "; Domain=" + option.domain;
        }
        if (option.path !== undefined) {
            cookieStr += "; Path=" + option.path;
        }
        if (option.secure !== undefined) {
            cookieStr += "; Secure";
        }
        if (option.httpOnly !== undefined) {
            cookieStr += "; HttpOnly";
        }
        this.setCookies.push(cookieStr);
        this.res.setHeader("set-cookie", this.setCookies);
        return this;
    }
    delete(name) {
        this.set(name, null, {
            maxAge: 0,
        });
    }
}
exports.default = Cookie;
