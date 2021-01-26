wiki.get(/^\/file\/(.+)/, function(req, res) {
	const filename = req.params[0];
	const realname = sha3(path.parse(filename).name) + path.extname(filename);
	
	var content
});