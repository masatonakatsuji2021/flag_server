/**
 * Server Initial (sinit)
 */
exports.default = {

    /**
     * Server Name
     */
    name: "{name}", 

    /**
     * disable
     * If you do not use the server temporarily, uncomment this and set it to "true".
     */
    // disable: true,
 
    /**
     * Listen Server Host
     */
    host: "{host}", 
 
    /**
     * SSL Enable
     * Set this to true to enable SSL connection.
     * For various certificates and private keys, 
     * you need to uncomment the following settings 
     * and specify the file path.
     */
    ssl: {ssl}, 
 
    /**
     * SSL Cert Key
     * If SSL connection is required, 
     * specify the path where the private key of the server certificate resides.
     */
    sslKey: "{sslKey}", 
 
    /**
     * SSL Cert
     * If SSL connection is required,
     * specify the path where the server certificate resides.
     */
    sslCert: "{sslCert}", 
 
    /**
     * SSL Cert CA
     * If SSL connection is required, specify the path where the server certificate resides.
     */
    sslCa: [{sslCa}], 
 
    /**
     * Port Number 
     * Specify connection port number.
     * If the specification is omitted, 
     * the port number depending on whether SSL is enabled or not will be specified by default.
     * If there is no SSL connection : 80.
     * If SSL connection is available : 443
     */
    port: {port}, 
    
    /**
     * timeout
     * Optionally change the timeout period (ms) when no response is sent after receiving a request.
     */
    // timeout: 5000,

    /**
     * Callback
     * If you want to directly receive a request and implement processing,
     * Use the callback function below.
     * This callback will not be executed if the server module is used to receive the request and complete the response.
     * @param {*} result http module arguments and receiving port number
     * - **req**: http.IncomingMessage,
     * - **res**: http.ServerResponse<http.IncomingMessage>,
     * - **port**: number,
     */    
    callback: async (result)=>{
        const res = result.res;
        res.writeHead(200);
        res.write("Hallo Flag Server Listen!");
        res.end();
    },
 
    /**
     * modules
     * Specify the server module to use and its configuration parameters here.
     */
    modules: {},
 };