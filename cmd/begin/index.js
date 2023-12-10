"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cli_1 = require("@flagfw/flag/bin/Cli");
const Util_1 = require("@flagfw/server/bin/common/Util");
exports.default = () => {
    Cli_1.default.outn("server begin");
    ;
    console.log(Util_1.default.getHome());
    //    require("./thread.js");
};
