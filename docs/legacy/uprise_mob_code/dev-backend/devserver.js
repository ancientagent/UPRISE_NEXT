const http = require('http'); const url = require('url');
const host = '0.0.0.0'; const port = parseInt(process.env.PORT||'8080',10);
const server = http.createServer((req,res)=>{ const p=url.parse(req.url,true).pathname||'/';
res.setHeader('Access-Control-Allow-Origin','*');
res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');
res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization, X-Requested-With');
if (req.method==='OPTIONS') { res.writeHead(204); return res.end(); }
if (req.method==='GET' && p==='/health') { res.writeHead(200,{'Content-Type':'application/json'}); return res.end(JSON.stringify({ok:true,service:'uprise-api',time:new Date().toISOString()})); }
let payload = {};
if (p.toLowerCase().includes('config')) payload = {features:{},env:'dev'};
else if (p.toLowerCase().includes('session')) payload = {authenticated:false};
else if (p==='/me') payload = {id:'dev-user',roles:[],displayName:'Dev User'};
else if (/genres|feed|discovery|radio|events|promos/i.test(p)) payload = [];
res.writeHead(200,{'Content-Type':'application/json'}); res.end(JSON.stringify(payload));
}); server.listen(port,host,()=>console.log(`dev-backend on ${host}:${port}`));