"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const listen_1 = require("./listen");
const Util_1 = require("@flagfw/server/bin/common/Util");
exports.default = () => {
    const ports = Util_1.default.getUsePorts(1);
    for (let n = 0; n < ports.length; n++) {
        const port = ports[n];
        const Http = http.createServer((req, res) => {
            let listenObject = {
                req: req,
                res: res,
                port: port,
            };
            (0, listen_1.default)(listenObject);
        });
        Http.listen(port);
    }
};
