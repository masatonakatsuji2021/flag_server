"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const listen_1 = require("./listen");
exports.default = () => {
    const Http = http.createServer((req, res) => {
        let listenObject = {
            req: req,
            res: res,
            port: 80,
        };
        (0, listen_1.default)(listenObject);
    });
    Http.listen(80);
};
