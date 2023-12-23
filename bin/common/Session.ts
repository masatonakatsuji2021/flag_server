import Util from "@flagfw/flag/bin/Util";
import Cookie from "@flagfw/server/bin/common/Cookie";
import * as fs from "fs";

export default class Session{

    private wsidName : string  = "wsid";

    private wsid : string = null;

    private wsidLength : number = 64;

    private wsidCheckTime : number = 60;

    private wsidMaxLimit : number = 3600 * 24 * 14;

    private cookie : Cookie;

    public writePath : string = "/opt/.sessions";

    public constructor(req ,res){
        this.cookie = new Cookie(req, res);
        this.wsid = this.cookie.get(this.wsidName);
    }

    private getWritePath(){
        let spath = this.writePath + "/" + this.wsid;
        spath = spath.split("//").join("/");
        return spath;
    }

    public wsidCheck(){

        if(!fs.existsSync(this.writePath)){
            fs.mkdirSync(this.writePath,{
                recursive: true,
            });
        }

        let now = new Date();

        if(!this.wsid){
            this.wsidRefresh();
            return;
        }

        const spath = this.getWritePath();
        
        if(!fs.existsSync(spath)){
            this.wsidRefresh();
            return;
        }
    
        let getSessionStr = fs.readFileSync(spath).toString();
        let getSession = JSON.parse(getSessionStr);    

        const limitTime = getSession.limitTime;
            
        if(now.getTime() > limitTime){
            this.wsidRefresh();
        }
    }

    public wsidRefresh(){
        const newWsid = Util.uniqId(this.wsidLength);
        const now = new Date();

        let newPath = this.writePath + "/" + newWsid;
        newPath = newPath.split("//").join("/");

        let sdata;
        if(this.wsid){
            let oldPath = this.writePath + "/" + this.wsid;
            oldPath = oldPath.split("//").join("/");
            
            if(fs.existsSync(oldPath)){
                fs.renameSync(oldPath, newPath);
                const sdataStr = fs.readFileSync(newPath).toString();
                sdata = JSON.parse(sdataStr);
            }
            else{
                sdata = {};
            }
        }
        else{
            sdata = {};
        }

        const limitTime = now.getTime() + ( this.wsidCheckTime * 1000);

        sdata.limitTime = limitTime;

        fs.writeFileSync(newPath, JSON.stringify(sdata));

        this.wsid = newWsid;
        this.cookie.set(this.wsidName, this.wsid, {
            maxAge: this.wsidMaxLimit,
        });
    }

    public get(name? : string){
        this.wsidCheck();

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
        this.wsidCheck();

        const spath = this.getWritePath();

        let sdata = this.get();
        if(!sdata){
            sdata = {};
        }

        sdata[name] = value;

        sdata = JSON.stringify(sdata);
        fs.writeFileSync(spath, sdata);
        return this;
    }

    public delete(name : string){
        this.wsidCheck();

        const spath = this.getWritePath();

        let sdata = this.get();
        if(!sdata){
            sdata = {};
        }

        delete sdata[name];

        sdata = JSON.stringify(sdata);
        fs.writeFileSync(spath, sdata);
        return this;
    }
}