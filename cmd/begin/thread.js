"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const cluster = require("cluster");
const Cli_1 = require("@flagfw/flag/bin/Cli");
const Util_1 = require("@flagfw/server/bin/common/Util");
const http_1 = require("./http");
const https_1 = require("./https");
// @ts-ignore
if (cluster.isPrimary) {
    const setting = Util_1.default.getSetting();
    let threadLength = os.cpus().length;
    if (setting) {
        if (setting.thread) {
            threadLength = setting.thread;
        }
    }
    Cli_1.default.outn("Thread = " + threadLength);
    for (let n = 0; n < threadLength; n++) {
        // @ts-ignore
        cluster.setupPrimary({
            exec: __dirname + "/thread.js",
            args: ["-number", n.toString()],
        });
        // @ts-ignore
        const c = cluster.fork();
        Cli_1.default.outn("Listen Thread(" + n + ") PID = " + c.process.pid);
    }
}
else {
    (0, http_1.default)();
    (0, https_1.default)();
}
