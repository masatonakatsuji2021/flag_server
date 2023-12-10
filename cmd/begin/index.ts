import FlagCLI from "@flagfw/flag/bin/Cli";
import ServerUtil from "@flagfw/server/bin/common/Util";

export default ()=>{

    FlagCLI.outn("server begin");;  
    require("./thread.js");
};