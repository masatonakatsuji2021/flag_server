import * as http from "http";
import listen from "./listen";
import ListenResult from "@flagfw/server/bin/common/ListenResult";
import ServerUtil from "@flagfw/server/bin/common/Util";

export default ()=>{
    
    const ports = ServerUtil.getUsePorts(1);
    for(let n = 0 ; n < ports.length ; n++){
        const port = ports[n];
        const Http = http.createServer((req: http.IncomingMessage, res : http.ServerResponse<http.IncomingMessage>) => {
            let listenObject : ListenResult= {
                req: req,
                res: res,
                port: port,
            }
            listen(listenObject);
        });
        Http.listen(port);
    }
};