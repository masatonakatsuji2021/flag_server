import * as querystring from "querystring";

const GetBody = (result) : Promise<Object> => {

    return new Promise((resolve)=> {
        if(!result.req){
            return;
        }
        let dataStr = "";
        result.req.on("data", (d_) => {
            dataStr += d_;
        });

        result.req.on("end", () => {
            // @ts-ignore
            const contentType = result.req.headers["content-type"];

            if(!contentType){
                return resolve(null);
            }

            let data = null;
            if(contentType == "application/x-www-form-urlencoded"){
                data = querystring.parse(dataStr);
                const c = Object.keys(data);
                for(let n = 0 ; n < c.length ; n++){
                    const key = c[n];
                    let val = data[key];
                    val = decodeURIComponent(val);
                    data[key] = val;
                }
            }
            else if(contentType.indexOf("multipart/form-data") === 0){
                let data = {};
                const boundary = contentType.split("boundary=")[1];
                const dataBuffer = dataStr.split(boundary);
                for(let n = 0 ; n < dataBuffer.length ; n++){
                    const db_ = dataBuffer[n];

                    if(db_.indexOf("--") === 0){
                        continue;
                    }

                    const databuffer2 = db_.split("\r\n");

                    let value = null;
                    let name = null;
                    for(let n2 = 0 ; n2< databuffer2.length ; n2++){
                        const db2_ = databuffer2[n2];

                        if(!db2_ || db2_ == "--"){
                            continue;
                        }

                        if(db2_.indexOf("name=\"") > -1){
                            name = db2_.split("name=\"")[1].split("\"").join("");
                        }
                        else{
                            value = db2_;
                        }
                    }

                    data[name] = value;
                }

                console.log(data);
            }
            else if(contentType == "text/plain"){
                data = querystring.parse(dataStr);
            }

            resolve(data);
        });
    });

};
export default GetBody;