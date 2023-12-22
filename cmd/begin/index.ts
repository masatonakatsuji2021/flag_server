import FlagCLI from "@flagfw/flag/bin/Cli";

export default ()=>{
    FlagCLI.outn("server begin");
    require("./thread.js");
};