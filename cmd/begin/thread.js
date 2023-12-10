"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const cluster_1 = require("cluster");
const http_1 = require("./http");
const https_1 = require("./https");
if (cluster_1.default.isPrimary) {
    let threadLength = os.cpus().length;
    for (let n = 0; n < threadLength; n++) {
        cluster_1.default.setupPrimary({
            exec: __dirname + "/thread.js",
            args: ["-number", n.toString()],
        });
        cluster_1.default.fork();
    }
}
else {
    (0, http_1.default)();
    (0, https_1.default)();
}
