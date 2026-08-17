const http = require('http');
let complaints = [{ id: "1", residentName: "Rakesh Sharma", roomNumber: "A-304", contactInfo: "98765", category: "Plumbing", priority: "High", description: "Water leak", status: "Pending", date: new Date() }];
const HEADERS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Content-Type': 'application/json' };

http.createServer((req, res) => {
    if (req.method === 'OPTIONS') return res.writeHead(204, HEADERS).end();
    if (req.url === '/api/complaints') {
        if (req.method === 'GET') {
            return res.writeHead(200, HEADERS).end(JSON.stringify(complaints));
        }
        if (req.method === 'POST') {
            let body = '';
            req.on('data', c => body += c);
            req.on('end', () => {
                const data = JSON.parse(body || '{}');
                data.id = Date.now().toString();
                data.status = 'Pending';
                data.date = new Date().toISOString();
                complaints.push(data);
                res.writeHead(201, HEADERS).end(JSON.stringify(data));
            });
            return;
        }
    }
    res.writeHead(404, HEADERS).end(JSON.stringify({ error: "Not found" }));
}).listen(3001, () => console.log("Server running on port 3001"));
