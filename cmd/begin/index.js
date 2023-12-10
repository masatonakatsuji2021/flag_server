"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cli_1 = require("@flagfw/flag/bin/Cli");
const Util_1 = require("@flagfw/server/bin/common/Util");
exports.default = () => {
    console.log(Util_1.default.getUsePorts());
    console.log(Util_1.default.getUsePorts(1));
    console.log(Util_1.default.getUsePorts(2));
    Cli_1.default.outn("server begin");
    ;
    //    require("./thread.js");
};
