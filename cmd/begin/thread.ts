import * as os from "os";
import cluster from "cluster";
import http from "./http";
import https from "./https";

if(cluster.isPrimary){

    let threadLength = os.cpus().length;

    for(let n = 0 ; n < threadLength ; n++){
        cluster.setupPrimary({
            exec: __dirname + "/thread.js",
            args: ["-number", n.toString()],
        });
        cluster.fork();
    }
}
else{
    http();
    https();
}