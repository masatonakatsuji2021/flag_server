export default interface ServerInit{
    rootDir?: string,
    disable?: boolean,
    name?: string,
    host?: string,
    ssl?: boolean,
    sslKey?: string,
    sslCert?: string,
    sslCa?: Array<string>,
    port?: number,
    timeout?: number,
    callback?: Function,
    modules?: any,
}