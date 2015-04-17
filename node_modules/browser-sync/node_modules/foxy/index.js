/**
 *
 * Foxy - proxy with response moddin'
 * https://github.com/shakyShane/foxy
 *
 */

var httpProxy  = require("http-proxy");
var http       = require("http");
var Immutable  = require("immutable");

var conf       = require("./lib/config");
var foxyServer = require("./lib/server");
var utils      = require("./lib/utils");

/**
 * @param {String} target - a url such as http://www.bbc.co.uk or http://localhost:8181
 * @param {Object} [userConfig]
 * @returns {http.Server}
 */
function foxy(target, userConfig) {

    /**
     * Merge/transform config with defaults
     */
    var config = conf(target, userConfig);

    var userConfig = function () {
        return config;
    };

    /**
     * Create basic httpProxy server
     */
    var proxy = httpProxy.createProxyServer();

    /**
     * Create HTTP server & pass proxyServer for parsing
     */
    var server = http.createServer(foxyServer(proxy, userConfig));

    /**
     * Handle proxy errors
     */
    proxy.on("error",    config.get("errHandler"));
    server.on("error",   config.get("errHandler"));

    /**
     * Modify Proxy responses
     */
    proxy.on("proxyRes", utils.proxyRes(config));

    /**
     * return the proxy server ready for .listen();
     */

    server.app = {
        use: function (path, fn) {
            if (!config.get("staticFiles").has(path)) {
                config = config.setIn(["staticFiles", path], fn);
            }
        }
    };

    return server;
}

module.exports = foxy;
module.exports.init = foxy; // backwards compatibility

