var http = require('http');
var fs = require('fs');

const PORT = 8080;

fs.readFile('./public/index.html', (err, html) => {
	if (err) throw err;

	http.createServer((request, response) => {
		response.writeHeader(200, { 'Content-Type': 'text/html' });
		response.write(html);
		response.end();
	}).listen(PORT);
});

console.log('\n\nPage is hosted on http://localhost:' + PORT + '\n\n');
