import FlagCLI from "@flagfw/flag/bin/Cli";
import create from "./cmd/create";
import begin from "./cmd/begin";
import setting from "./cmd/setting";

export default ()=>{

    FlagCLI.outn("---- FLAG SERVER ---------------------");

    const args = FlagCLI.getArgs();

    const mainCommand = args[1];

    if(mainCommand == "create"){
        create();
    }
    else if(mainCommand == "begin"){
        begin();
    }
    else if(mainCommand == "setting"){
        setting();
    }
    else{


        
    }
};