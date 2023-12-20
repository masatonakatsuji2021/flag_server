import * as http from "http";

export default interface ListenResult{
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>,
    port: number,
}