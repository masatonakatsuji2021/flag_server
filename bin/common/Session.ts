import Cookie from "@flagfw/server/bin/common/Cookie";

export default class Session{

    private cookie : Cookie;

    public constructor(req ,res){
        this.cookie = new Cookie(req, res);
    }


}