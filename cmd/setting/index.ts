import FlagCLI from "@flagfw/flag/bin/Cli";
import ServerUtil from "@flagfw/server/bin/common/Util";
import Setting from "@flagfw/server/bin/common/Setting";
import * as os from "os";

export default async ()=>{

    FlagCLI.outn("Server Setting.").br().indent(2);

    let setting : Setting = ServerUtil.getSetting();

    if(!setting){
        setting = {};
    }

    let defaultThread;
    if(setting.thread){
        defaultThread = setting.thread;
    }
    else{
        defaultThread = os.cpus().length;
    }

    FlagCLI.outn("Currently starting server with " + defaultThread + " threads.").br();

    let thread = (await FlagCLI.in("Q. If you want to fix the number of threads, enter. ()")).toString();

    if(thread){
        setting.thread = parseInt(thread);
    }
    else{
        setting.thread = null;
    }

    let rootDir = (await FlagCLI.in("Q. If you want to change the root path, enter. ()")).toString();

    setting.rootDir = rootDir;

    FlagCLI.br().outData({
        "Thread": setting.thread ? setting.thread.toString() : "",
        "rootPath": setting.rootDir,
    }).br();

    let juge = await FlagCLI.in("Save the settings with the above contents. Is it OK? [y/n] (y)");
    let status = false;
    if(
        !juge ||
        juge == "y" ||
        juge == "Y"
    ){
        status = true;
    }

    if(status){


    }  
    else{
        FlagCLI.redn("..... Server Setting Cancal!");
    }

};