import * as os from "os";
import * as cluster from "cluster";
import FlagCLI from "@flagfw/flag/bin/Cli";
import ServerUtil from "@flagfw/server/bin/common/Util";
import http from "./http";
import https from "./https";

// @ts-ignore
if(cluster.isPrimary){

    const setting = ServerUtil.getSetting();

    let threadLength = os.cpus().length;
    if(setting){
        if(setting.thread){
            threadLength = setting.thread;
        }
    }

    FlagCLI.outn("Thread = " + threadLength);

    for(let n = 0 ; n < threadLength ; n++){
        // @ts-ignore
        cluster.setupPrimary({
            exec: __dirname + "/thread.js",
            args: ["-number", n.toString()],
        });
        // @ts-ignore
        const c = cluster.fork();
        FlagCLI.outn("Listen Thread(" + n + ") PID = " + c.process.pid);
    }
}
else{
    http();
    https();
}