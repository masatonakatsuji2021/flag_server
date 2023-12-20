import * as fs from "fs";
import ServerUtil from "@flagfw/server/bin/common/Util";
import ListenResult from "@flagfw/server/bin/common/ListenResult";
import ServerInit from "@flagfw/server/bin/common/ServerInit";

export default async (result : ListenResult) => {

    const servers = ServerUtil.getServers(1);

    let decisionServer : ServerInit = null;

    for(let n = 0 ; n < servers.length ; n++){
        const server = servers[n];

        // port check
        if(server.port !== result.port){
            continue;
        }

        // disable
        if(server.disable){
            continue;
        }

        decisionServer = server;
    }

    if(!decisionServer){
        result.res.writeHead(404);
        result.res.end();
        return;
    }
    
    // module load...
    if(decisionServer.modules){
        const c = Object.keys(decisionServer.modules);
        for(let n2 = 0 ; n2 < c.length ; n2++){
            const moduleName = c[n2];
            const moduleData = decisionServer.modules[moduleName];

            let modulePath;
            try{
                const buffer = "@flagfw/server_module_" + moduleName;
                modulePath = require.resolve(buffer);
            }catch(err){}
                
            try{
                const buffer = moduleName;
                modulePath = require.resolve(buffer);
            }catch(err){}

            if(!modulePath){
                continue;
            }

            const _module = require(modulePath);
            if(!_module.default){
                continue;
            }
            await _module.default(result, moduleData, decisionServer);

            if(result.res.writableEnded){
                return;
            }
        }
    }

    // callback...
    if(decisionServer.callback){
        await decisionServer.callback(result);
        if(result.res.writableEnded){
            return;
        }
    }

    // finally...
    result.res.writeHead(404);
    result.res.end();
};