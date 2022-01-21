var http = require('http');
var fs = require('fs');

const PORT = 8080;

// TODO ::: fix types here

fs.readFile('./public/index.html', (err: any, html: any) => {
	if (err) throw err;

	http.createServer((request: any, response: any) => {
		response.writeHeader(200, { 'Content-Type': 'text/html' });
		response.write(html);
		response.end();
	}).listen(PORT);
});

console.log('\n\nPage is hosted on http://localhost:' + PORT + '\n\n');
