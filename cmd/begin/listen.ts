import ServerUtil from "@flagfw/server/bin/common/Util";

export default async (result) => {

    const servers = ServerUtil.getServers(1);

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
        
        // module load...
        if(server.modules){
            const c = Object.keys(server.modules);
            for(let n2 = 0 ; n2 < c.length ; n2++){
                const moduleName = c[n2];
                const moduleData = server.modules[moduleName];

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
                await _module.default(result, moduleData);
            }
        }

        // callback...
        if(server.callback){
            //await server.callback(result);
        }
    }

    // finally
    result.res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
    result.res.end();   
};