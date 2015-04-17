var bs     = require("browser-sync").create();
var client = require("./");
client["plugin:name"] = "client:script";

bs.use(client);

bs.init({
    server: "test/fixtures",
    open: false,
    minify: false
});

