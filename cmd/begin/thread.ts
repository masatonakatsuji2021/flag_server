import * as os from "os";
import * as cluster from "cluster";
import FlagCLI from "@flagfw/flag/bin/Cli";
import ServerUtil from "@flagfw/server/bin/common/Util";
import http from "./http";
import https from "./https";

// @ts-ignore
if(cluster.isPrimary){

    if(ServerUtil.getServers(0).length == 0){
        FlagCLI.red("[ERROR] ").outn("Terminate server LISten because there are no servers to deploy.");
        process.exit();
    }

    let workers = [];
    const loadCluster = ()=>{

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
            workers.push(c);
        }

        (async()=>{

            FlagCLI.br();
    
            let cmd;
            while(!cmd){
                cmd = await FlagCLI.in(" > ");
    
                if(cmd == "exit"){
                    FlagCLI.outn("....Exit");
                    process.exit();
                }
                else if(cmd == "reload"){
                    for(let n = 0 ; n < workers.length ; n++){
                        const worker = workers[n];
                        worker.kill();
                    }
                    FlagCLI.outn("....Reload").br();
                    loadCluster();
                }
                else{
                    cmd = null;
                }           
            }
    
        })();
    };
    
    loadCluster();    

}
else{
    http();
    https();
}