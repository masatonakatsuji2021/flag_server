"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cli_1 = require("@flagfw/flag/bin/Cli");
const Util_1 = require("@flagfw/server/bin/common/Util");
const os = require("os");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    Cli_1.default.outn("Server Setting.").br().indent(2);
    let setting = Util_1.default.getSetting();
    if (!setting) {
        setting = {};
    }
    let defaultThread;
    if (setting.thread) {
        defaultThread = setting.thread;
    }
    else {
        defaultThread = os.cpus().length;
    }
    Cli_1.default.outn("Currently starting server with " + defaultThread + " threads.").br();
    let thread = (yield Cli_1.default.in("Q. If you want to fix the number of threads, enter. ()")).toString();
    if (thread) {
        setting.thread = parseInt(thread);
    }
    else {
        setting.thread = null;
    }
    let rootDir = (yield Cli_1.default.in("Q. If you want to change the root path, enter. ()")).toString();
    setting.rootDir = rootDir;
    console.log(setting);
    Cli_1.default.br().outData({
        "Thread": setting.thread ? setting.thread.toString() : "",
        "rootPath": setting.rootDir,
    }).br();
    let juge = yield Cli_1.default.in("Save the settings with the above contents. Is it OK? [y/n] (y)");
    let status = false;
    if (!juge ||
        juge == "y" ||
        juge == "Y") {
        status = true;
    }
    if (status) {
    }
    else {
        Cli_1.default.redn("..... Server Setting Cancal!");
    }
});
