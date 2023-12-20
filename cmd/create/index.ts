import FlagCLI from "@flagfw/flag/bin/Cli";
import ServerInit from "@flagfw/server/bin/common/ServerInit";
import ServerUtil from "@flagfw/server/bin/common/Util";

export default async ()=>{

    FlagCLI.outn("create server").br().indent(2);

    let server : ServerInit = {};

    let name;
    while(!name){

        name = (await FlagCLI.in("Q. Enter server name.")).toString();

        if(!name){
            FlagCLI.red("[ERROR] ").outn("No server name was entered. Please retry.");
            continue;
        }

        const already = ServerUtil.getServer(name);

        if(already){
            FlagCLI.red("[ERROR] ").outn("The same server name already exists. Please specify a different name.");
            name = null;
            continue;
        }
    }

    server.name = name;

    // host name
    let host = (await FlagCLI.in("Q. Enter host name (domain). (*)")).toString();

    if(!host){
        host = "*";
    }

    server.host = host;

    // ssl
    let ssl = await FlagCLI.in("Q. Do you want to make an SSL connection? [y/n] (y)");

    server.ssl = false;
    if(
        !ssl ||
        ssl == "y" ||
        ssl == "Y"
    ){
        server.ssl = true;
    }

    if(server.ssl){

        FlagCLI.indent(4);

        // ssl key
        const defaultSslKey = ServerUtil.getHome() + "/" + server.name + "/server.key";
        let sslKey = (await FlagCLI.in("Q. Specify the private key path of the server certificate. (" + defaultSslKey + ")")).toString();

        if(!sslKey){
            sslKey = defaultSslKey;
        }

        server.sslKey = sslKey;

        // ssl cert
        const defaultSslCert = ServerUtil.getHome() + "/" + server.name + "/server.crt";
        let sslCert = (await FlagCLI.in("Q. Specify server certificate path. (" + defaultSslCert + ")")).toString();

        if(!sslCert){
            sslCert = defaultSslCert;
        }
    
        server.sslCert = sslCert;

        // ssl ca
        let sslCa = (await FlagCLI.in("Q. Specify if there is a server intermediate certificate (CA). ()")).toString();
        server.sslCa = [];
        if(sslCa){
            server.sslCa.push(sslCa);
        }
        
        FlagCLI.indent(2);
    }

    // port number
    let defaultPort = 80;
    if(server.ssl){
        defaultPort = 443;
    }
    let port = parseInt((await FlagCLI.in("Q. Specify port number. (" + defaultPort + ")")).toString(), 10);

    if(!port){
        port = defaultPort;
    }

    server.port = port;

    FlagCLI.br().outData({
        "Server Name": server.name,
        "Host (Domain)": server.host,
        "SSL" : server.ssl,
        "SSL Key" : server.sslKey ? server.sslKey : "",
        "SSL Cert": server.sslCert ? server.sslCert : "",
        "SSL CA" : server.sslCa ? server.sslCa : "",
        "Port Number" : server.port,
    }).br();

    const juge = await FlagCLI.in("Create a server with the above contents. Is it OK? [y/n] (y)");

    if(
        !juge ||
        juge == "y" ||
        juge == "y"
    ){



    }
    else{
        FlagCLI.br().redn("...Server Create Cancel!");
    }

};