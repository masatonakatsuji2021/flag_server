import * as fs from "fs";

export default class ServerUtil{

    public static sinit = "/sinit.js";

    public static getHome(){
        return process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"] + "/flag_servers";
    }

    public static getServers(status : number){

        let servers = [];

        const search = fs.readdirSync(ServerUtil.getHome());
        
        for(let n = 0 ; n < search.length ; n++){
            const sinit = ServerUtil.getServer(search[n]);

            if(!sinit){
                continue;
            }

            if(status == 1){
                if(sinit.ssl){
                    continue;
                }
            }
            else if(status == 2){
                if(!sinit.ssl){
                    continue;
                }
            }

            if(!sinit.port){
                if(sinit.ssl){
                    sinit.port = 443;
                }
                else{
                    sinit.port = 80;
                }
            }

            if(!sinit.host){
                sinit.host = "*";
            }

            servers.push(sinit);
        }

        return servers;
    }

    public static getServer(serverName : string){
        const initPath = ServerUtil.getHome() + "/" + serverName+ "/" + ServerUtil.sinit;

        if(!fs.existsSync(initPath)){
            return;
        }

        const sinit = require(initPath);
        if(!sinit){
            return;
        }

        if(!sinit.default){
            return;
        }

        sinit.default.rootDir = ServerUtil.getHome() + "/" + serverName;

        return sinit.default;
    }

    public static getUsePorts(status? : number){

        let ports = [];

        const search = fs.readdirSync(ServerUtil.getHome());
        
        for(let n = 0 ; n < search.length ; n++){
            const sinit = ServerUtil.getServer(search[n]);

            if(!sinit){
                continue;
            }

            if(status === 1){
                if(sinit.ssl){
                    continue;
                }
            }
            else if(status == 2){
                if(!sinit.ssl){
                    continue;
                }
            }

            if(ports.indexOf(sinit.port) === -1){
                ports.push(sinit.port);
            }
        }

        return ports;
    }
}