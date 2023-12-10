import * as http from "http";
import listen from "./listen";

export default ()=>{
    const Http = http.createServer((req: http.IncomingMessage, res : http.ServerResponse<http.IncomingMessage>) => {
        let listenObject = {
            req: req,
            res: res,
            port: 80,
        }        
        listen(listenObject);
    });
    Http.listen(80);
};