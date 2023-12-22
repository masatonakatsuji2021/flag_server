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
const fs = require("fs");
const Cli_1 = require("@flagfw/flag/bin/Cli");
const Util_1 = require("@flagfw/server/bin/common/Util");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    Cli_1.default.outn("create server").br().indent(2);
    let server = {};
    let name;
    while (!name) {
        name = (yield Cli_1.default.in("Q. Enter server name.")).toString();
        if (!name) {
            Cli_1.default.red("[ERROR] ").outn("No server name was entered. Please retry.");
            continue;
        }
        const already = Util_1.default.getServer(name);
        if (already) {
            Cli_1.default.red("[ERROR] ").outn("The same server name already exists. Please specify a different name.");
            name = null;
            continue;
        }
    }
    server.name = name;
    // host name
    let host = (yield Cli_1.default.in("Q. Enter host name (domain). (*)")).toString();
    if (!host) {
        host = "*";
    }
    server.host = host;
    // ssl
    let ssl = yield Cli_1.default.in("Q. Do you want to make an SSL connection? [y/n] (y)");
    server.ssl = false;
    if (!ssl ||
        ssl == "y" ||
        ssl == "Y") {
        server.ssl = true;
    }
    if (server.ssl) {
        Cli_1.default.indent(4);
        // ssl key
        const defaultSslKey = Util_1.default.getHome() + "/" + server.name + "/server.key";
        let sslKey = (yield Cli_1.default.in("Q. Specify the private key path of the server certificate. (" + defaultSslKey + ")")).toString();
        if (!sslKey) {
            sslKey = defaultSslKey;
        }
        server.sslKey = sslKey;
        // ssl cert
        const defaultSslCert = Util_1.default.getHome() + "/" + server.name + "/server.crt";
        let sslCert = (yield Cli_1.default.in("Q. Specify server certificate path. (" + defaultSslCert + ")")).toString();
        if (!sslCert) {
            sslCert = defaultSslCert;
        }
        server.sslCert = sslCert;
        // ssl ca
        let sslCa = (yield Cli_1.default.in("Q. Specify if there is a server intermediate certificate (CA). ()")).toString();
        server.sslCa = [];
        if (sslCa) {
            server.sslCa.push(sslCa);
        }
        Cli_1.default.indent(2);
    }
    // port number
    let defaultPort = 80;
    if (server.ssl) {
        defaultPort = 443;
    }
    let port = parseInt((yield Cli_1.default.in("Q. Specify port number. (" + defaultPort + ")")).toString(), 10);
    if (!port) {
        port = defaultPort;
    }
    server.port = port;
    Cli_1.default.br().outData({
        "Server Name": server.name,
        "Host (Domain)": server.host,
        "SSL": server.ssl,
        "SSL Key": server.sslKey ? server.sslKey : "",
        "SSL Cert": server.sslCert ? server.sslCert : "",
        "SSL CA": server.sslCa ? server.sslCa : "",
        "Port Number": server.port,
    }).br();
    const juge = yield Cli_1.default.in("Create a server with the above contents. Is it OK? [y/n] (y)");
    if (!juge ||
        juge == "y" ||
        juge == "y") {
        let initStr = fs.readFileSync(__dirname + "/sinitsample.js").toString();
        initStr = initStr.split("{name}").join(server.name);
        initStr = initStr.split("{host}").join(server.host);
        initStr = initStr.split("{ssl}").join(server.ssl.toString());
        initStr = initStr.split("{sslKey}").join(server.sslKey);
        initStr = initStr.split("{sslCert}").join(server.sslCert);
        if (server.sslCa.length) {
            let caStr = "\"" + server.sslCa.toString() + "\"";
            initStr = initStr.split("{sslCa}").join(caStr);
        }
        else {
            initStr = initStr.split("{sslCa}").join("");
        }
        initStr = initStr.split("{port}").join(server.port.toString());
        fs.mkdirSync(Util_1.default.getHome() + "/" + server.name, {
            recursive: true,
        });
        fs.writeFileSync(Util_1.default.getHome() + "/" + server.name + "/" + Util_1.default.sinit, initStr);
        Cli_1.default.br().green("....Server Create Complete!");
    }
    else {
        Cli_1.default.br().redn("...Server Create Cancel!");
    }
});
