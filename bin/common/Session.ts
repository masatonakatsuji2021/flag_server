import Util from "@flagfw/flag/bin/Util";
import Cookie from "@flagfw/server/bin/common/Cookie";
import * as fs from "fs";

interface SSIDCheck{
    status: number,
    path: string,
}

export default class Session{

    private wsidName : string  = "wsid";

    private wsid : string = null;

    private wsidLength : number = 64;

    private wsidChangeTime : number = 3600;

    private cookie : Cookie;

    public writePath : string = "./.sessions";

    public constructor(req ,res){
        this.cookie = new Cookie(req, res);

        this.wsid = this.cookie.get(this.wsidName);
        
        if(!this.wsid){
            this.wsid = Util.uniqId(this.wsidLength);
            this.cookie.set(this.wsidName, this.wsid,{
                maxAge: this.wsidChangeTime,
            });
        }
    }

    private getWritePath(){
        let spath = this.writePath + "/" + this.wsid;
        spath = spath.split("//").join("/");
        return spath;
    }

    public ssidCheck(){
        const spath = this.getWritePath();

        if(!fs.existsSync(this.writePath)){
            fs.mkdirSync(this.writePath,{
                recursive: true,
            });
        }

        if(!this.cookie.get(this.wsidName)){

        }

        if(this.cookie.get(this.wsidName) !== this.wsid){

        }

    }

    public get(name? : string){
        const spath = this.getWritePath();

        if(!fs.existsSync(spath)){
            return;
        }

        let getSession = fs.readFileSync(spath).toString();
        getSession = JSON.parse(getSession);

        if(name){
            return getSession[name];
        }
        else{
            return getSession;
        }
    }

    public set(name : string, value : any){
        let spath = this.writePath + "/" + this.wsid;
        spath = spath.split("//").join("/");

        let sdata = this.get();
        if(!sdata){
            sdata = {};
        }

        sdata[name] = value;

        sdata = JSON.stringify(sdata);
        fs.writeFileSync(spath, sdata);
        return this;
    }
}