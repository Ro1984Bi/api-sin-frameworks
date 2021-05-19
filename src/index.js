const http = require('http');
const { bodyParser } = require('./lib/bodyParser')

let db = [];

function getTaskHandler(req,res) {
    res.writeHead(200,{'Content-type': 'application/json'});
    res.write(JSON.stringify(db));
    res.end();
} 

async function createTaskHandler(req, res) {
    
    try {
        await bodyParser(req);
        db.push(req.body);
        res.writeHead(200,{'Content-type': 'application/json'});
        res.write(JSON.stringify(db));
        res.end();
    } catch (error) {
        res.writeHead(200,{'Content-type': 'text/plain'});
        res.write('internal error');
        res.end();
    }
}

async function updateTaskHandler(req, res) {

try {
    let {url} = req;

    let idQuery = url.split('?')[1]
    let idKey = idQuery.split('=')[0]
    let idValue = idQuery.split('=')[1]
   
   if (idKey === 'id') {
       await bodyParser(req);
       db[idValue - 1] = req.body;
       res.writeHead(200,{'Content-type': 'application/json'});
       res.write(JSON.stringify(db));
       res.end();
   }else {
       res.writeHead(200,{'Content-type': 'text/plain'});
       res.write('bad request');
       res.end();
   
   }
    
} catch (error) {
    res.writeHead(400,{'Content-type': 'text/plain'});
    res.write('bad request', error.message);
    res.end();
    
}

  
}

async function deleteTaskHandler(req, res) {
    let {url} = req;

    let idQuery = url.split('?')[1]
    let idKey = idQuery.split('=')[0]
    let idValue = idQuery.split('=')[1]

    if (idKey === 'id') { 
        db.splice(idValue - 1 ,1 );
        res.writeHead(200,{'Content-type': 'text/plain'});
        res.write('delete success');
        res.end();
    } else {
        res.writeHead(400,{'Content-type': 'text/plain'});
        res.write('invalid query');
        res.end();
    }
}

const server = http.createServer((req, res) => {

    const { url , method } = req;

    //logger
    console.log(`URL: ${url} - METHOD: ${method}`);
     
  

    switch(method) {
        case "GET":
            if (url === '/') {
                res.writeHead(200,{'Content-type': 'application/json'});
                res.write(JSON.stringify({message: 'hello'}));
                res.end();

            }
            if (url === '/tasks') {
                getTaskHandler(req, res);

            } 
            break;
        case "POST":
            if (url === '/tasks') {
                createTaskHandler(req, res);
            }
            break;
        case "PUT": 
            updateTaskHandler(req, res);
            break;
        case "DELETE":
            deleteTaskHandler(req, res);
            break;
            default:
                res.writeHead(200,{'Content-type': 'text/plain'});
                res.write('not found');
                res.end();

    }


});
server.listen(3000); 
console.log('Server on port', 3000);