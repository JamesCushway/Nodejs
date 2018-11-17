const fs = require('fs');

const requestListener = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    fs.readFile('./Views/greeting.html', function (err, data){
      res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
      res.write(data);
      return res.end();
    });
  } else if (url === '/users') {
    fs.readFile('./Views/list.html', function (err, data){
      res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
      res.write(data);
      return res.end();
    });
  } else if (url === '/create-user' && method === 'POST') {
    const data = [];
    req.on('data', (chunk) => {
      data.push(chunk);
    });
    req.on('end', () => {
      const parsedData = Buffer.concat(data).toString();
      console.log(parsedData.split('=')[1]);
    });
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }
}

module.exports = requestListener;