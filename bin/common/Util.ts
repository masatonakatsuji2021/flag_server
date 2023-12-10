import * as fs from "fs";

export default class ServerUtil{

    public static sinit = "/sinit.js";

    public static getHome(){
        return process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"] + "/flag_servers";
    }

    public static getPort(status? : number){

        const search = fs.readdirSync(ServerUtil.getHome() + "/" + ServerUtil.sinit);
        
        for(let n = 0 ; n < search.length ; n++){
            const s_ = ServerUtil.getHome() + "/" + search[n] + "/" + ServerUtil.sinit;

            if(!fs.existsSync(s_)){
                continue;
            }

            const sinit = require(s_);

            if(status === 1){
                if(sinit.ssl){
                    continue;
                }
            }
            else{

            }

        }



    }
}