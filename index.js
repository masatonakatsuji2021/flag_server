"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cli_1 = require("@flagfw/flag/bin/Cli");
const create_1 = require("./cmd/create");
const begin_1 = require("./cmd/begin");
const setting_1 = require("./cmd/setting");
exports.default = () => {
    Cli_1.default.outn("---- FLAG SERVER ---------------------");
    const args = Cli_1.default.getArgs();
    const mainCommand = args[1];
    if (mainCommand == "create") {
        (0, create_1.default)();
    }
    else if (mainCommand == "begin") {
        (0, begin_1.default)();
    }
    else if (mainCommand == "setting") {
        (0, setting_1.default)();
    }
    else {
    }
};
