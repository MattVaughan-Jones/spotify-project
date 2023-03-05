const fs = require('fs');
const path = require('path');
const router = require('find-my-way')({
    defaultRoute: (req, res) => {
        res.statusCode = 404
        res.end('Not here')
    },
    onBadUrl: (path, req, res) => {
        res.statusCode = 400
        res.end(`Bad path: ${path}`)
    }
  })

router.on('GET', '/users', (req, res, params) => {
  res.end('{"message":"hello world"}')
})

router.on('GET', '/users/:userID/:contactID', (req, res, params) => {
    console.log(params)
    res.end('{"message":"hello world"}')
})

// serving files
router.on('GET', '/*', (req, res, params) => {
    const url = req.url.substring(1);
    console.log(url);
    let file;
    try {
        file = fs.readFileSync(path.resolve(__dirname, `../client/${url}`), 'utf8');
    } catch (err) {
        console.log(err);
        res.statusCode = 404;
        res.write('file not found');
        res.end();
        return;
    }

    res.write(file);
    res.end();
})

module.exports = router;