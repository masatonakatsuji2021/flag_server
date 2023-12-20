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
const Util_1 = require("@flagfw/server/bin/common/Util");
exports.default = (result) => __awaiter(void 0, void 0, void 0, function* () {
    const servers = Util_1.default.getServers(1);
    let decisionServer = null;
    for (let n = 0; n < servers.length; n++) {
        const server = servers[n];
        // port check
        if (server.port !== result.port) {
            continue;
        }
        // disable
        if (server.disable) {
            continue;
        }
        decisionServer = server;
    }
    if (!decisionServer) {
        result.res.writeHead(404);
        result.res.end();
        return;
    }
    // module load...
    if (decisionServer.modules) {
        const c = Object.keys(decisionServer.modules);
        for (let n2 = 0; n2 < c.length; n2++) {
            const moduleName = c[n2];
            const moduleData = decisionServer.modules[moduleName];
            let modulePath;
            try {
                const buffer = "@flagfw/server_module_" + moduleName;
                modulePath = require.resolve(buffer);
            }
            catch (err) { }
            try {
                const buffer = moduleName;
                modulePath = require.resolve(buffer);
            }
            catch (err) { }
            if (!modulePath) {
                continue;
            }
            const _module = require(modulePath);
            if (!_module.default) {
                continue;
            }
            yield _module.default(result, moduleData, decisionServer);
            if (result.res.writableEnded) {
                return;
            }
        }
    }
    // callback...
    if (decisionServer.callback) {
        yield decisionServer.callback(result);
        if (result.res.writableEnded) {
            return;
        }
    }
    // finally...
    result.res.writeHead(404);
    result.res.end();
});
