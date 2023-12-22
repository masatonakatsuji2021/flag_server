"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cli_1 = require("@flagfw/flag/bin/Cli");
exports.default = () => {
    Cli_1.default.outn("server begin");
    require("./thread.js");
};
