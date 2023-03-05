const http = require('http');
const fs = require('fs');

http.createServer(function (req, res) {
    const url = req.url.substring(1);
    const method = req.method;

    /*
    basic router
    */
    // if (name === 'cat') {
    //     res.write('hey cat');
    // } else if (name === 'dog') {
    //     res.write('hey dawg');
    // } else {
    //     res.write('unknown endpoint');
    // }


    /*
    post body parser
    */
    // if (url ==='cat') {
    //     if (method === 'POST') {
            
    //         let data ='';

    //         req.on('data', chunk => {
    //             data += chunk;
    //         });
    //         req.on('end', ()=> {
    //             console.log(data);
    //         });

    //     } else if (method === 'GET') {
    //         console.log('cat get');
    //     }
    // }

    /*
    reading and returning file
    */
    let file;
    try {
        file = fs.readFileSync(`./client/${url}`, 'utf8');
    } catch (err) {
        res.statusCode = 404;
        res.write('file not found');
        res.end();
        return;
    }

    res.write(file);
      
    res.end();

}).listen(8080);
