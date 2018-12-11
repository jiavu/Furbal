let http = require('http');
let fs = require('fs');
let dir = "./Furbal.html";

http.createServer(function(req, res) {

    fs.readFile(dir, function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });

}).listen(8080);