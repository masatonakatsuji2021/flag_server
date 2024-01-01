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
const os = require("os");
const cluster = require("cluster");
const Cli_1 = require("@flagfw/flag/bin/Cli");
const Util_1 = require("@flagfw/server/bin/common/Util");
const http_1 = require("./http");
const https_1 = require("./https");
// @ts-ignore
if (cluster.isPrimary) {
    if (Util_1.default.getServers(0).length == 0) {
        Cli_1.default.red("[ERROR] ").outn("Terminate server LISten because there are no servers to deploy.");
        process.exit();
    }
    let workers = [];
    const loadCluster = () => {
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
            workers.push(c);
        }
        (() => __awaiter(void 0, void 0, void 0, function* () {
            Cli_1.default.br();
            let cmd;
            while (!cmd) {
                cmd = yield Cli_1.default.in(" > ");
                if (cmd == "exit") {
                    Cli_1.default.outn("....Exit");
                    process.exit();
                }
                else if (cmd == "reload") {
                    for (let n = 0; n < workers.length; n++) {
                        const worker = workers[n];
                        worker.kill();
                    }
                    Cli_1.default.outn("....Reload").br();
                    loadCluster();
                }
                else {
                    cmd = null;
                }
            }
        }))();
    };
    loadCluster();
}
else {
    (0, http_1.default)();
    (0, https_1.default)();
}
