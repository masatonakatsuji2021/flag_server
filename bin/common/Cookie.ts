import * as querystring from "querystring";

export default class Cookie{

    private req = null;
    private res = null;
    private setCookies = [];

    public constructor(req, res){
        this.req = req;
        this.res = res;
    }

    /**
     * get
     * get Cookie data.
     * @param {string} name? get cookie name 
     * @returns 
     */
    public get(name? : string){    
        const _cookie = this.req.headers.cookie;
    
        if(!_cookie){
            return;
        }
    
        const cookie = querystring.parse(_cookie,"; ");
    
        if(name){
            if(cookie[name]){
                return cookie[name];
            }
        }
        else{
            return cookie;
        }
    }

    /**
     * set
     * This is a function to prepare cookies
     * @param {sring} name setting cookie name
     * @param {any} value setting cookie value
     * @param {any} option? cookie option
     * @returns 
     */
    public set(name : string, value : any, option? : any){
        let cookieStr =  name + "=" + value;

        if(!option){
            option = {};
        }

        if(option.expires !== undefined){
            cookieStr += "; Expires=" + option.expires;
        }

        if(option.maxAge !== undefined){
            cookieStr += "; Max-Age=" + option.maxAge;
        }

        if(option.domain !== undefined){
            cookieStr += "; Domain=" + option.domain;
        }

        if(option.path !== undefined){
            cookieStr += "; Path=" + option.path;
        }

        if(option.secure !== undefined){
            cookieStr += "; Secure";
        }

        if(option.httpOnly !== undefined){
            cookieStr += "; HttpOnly";
        }

        this.setCookies.push(cookieStr);

        this.res.setHeader("set-cookie", this.setCookies);

        return this;
    }

    public delete(name : string){
        this.set(name, null, {
            maxAge: 0,
        });
    }
}
