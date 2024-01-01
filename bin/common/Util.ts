import * as fs from "fs";
import ServerInit from "./ServerInit";
import Setting from "./Setting";

export default class ServerUtil{

    public static sinit = "/sinit.js";
    public static setting = "/setting.json";

    public static getHome(){
        return process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"] + "/flag_servers";
    }

    public static getSetting() : Setting{
        const filePath = ServerUtil.getHome() + ServerUtil.setting;

        if(!fs.existsSync(filePath)){
            return;
        }

        const _setting = require(filePath);

        if(!_setting){
            return;
        }

        const setting : Setting = _setting;

        return setting;
    }

    public static getServers(status : number) : Array<ServerInit>{

        let servers = [];

        if(!fs.existsSync(ServerUtil.getHome())) {
            return servers;
        }

        const search = fs.readdirSync(ServerUtil.getHome());
        
        for(let n = 0 ; n < search.length ; n++){
            const serverName = search[n];
            if(("/" + serverName) == ServerUtil.setting){
                continue;
            }
            
            const sinit : ServerInit = ServerUtil.getServer(search[n], status);

            if(!sinit){
                continue;
            }

            servers.push(sinit);
        }

        return servers;
    }

    public static getServer(serverName : string, status? : number) : ServerInit{
        const initPath : string = ServerUtil.getHome() + "/" + serverName+ "/" + ServerUtil.sinit;

        if(!fs.existsSync(initPath)){
            return;
        }

        const _sinit = require(initPath);
        if(!_sinit){
            return;
        }

        if(!_sinit.default){
            return;
        }

        const sinit : ServerInit  = _sinit.default;

        sinit.rootDir = ServerUtil.getHome() + "/" + serverName;

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

        if(status == 1){
            if(sinit.ssl){
                return;
            }
        }
        else if(status == 2){
            if(!sinit.ssl){
                return;
            }
        }

        return sinit;
    }

    public static getUsePorts(status? : number){

        let ports = [];

        if(!fs.existsSync(ServerUtil.getHome())) {
            return ports;
        }

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