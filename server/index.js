const http = require('http');
const router = require('../router');

module.exports = function(){
    const server = http.createServer(function (req, res) {
        router.lookup(req, res);
    });
    
    return server.listen(process.env.PORT);

};
