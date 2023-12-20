import * as querystring from "querystring";

const GetQuery = (option) => {
    if(!option.req){
        return;
    }

    const queryBuff = option.req.url.split("?")[1];

    if(!queryBuff){
        return;
    }

    let query = querystring.parse(queryBuff);

    return query;
};
export default GetQuery;