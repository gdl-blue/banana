wiki.get(/^\/raw\/(.*)/, async function API_viewRaw_v2(req, res) {
	const title = req.params[0];
	const rev = req.query['rev'];
	
	if(title.replace(/\s/g, '') === '') {
		res.send(await showError(req, 'invalid_title'));
		return;
	}
	
	if(rev) {
		await curs.execute("select content from history where title = ? and rev = ?", [title, rev]);
	} else {
		await curs.execute("select content from documents where title = ?", [title]);
	}
	const rawContent = curs.fetchall();

	var content = '';
	
	var httpstat = 200;
	var viewname = 'wiki';
	var error = false;
	
	var isUserDoc = false;
	
	var lstedt = undefined;
	
	try {
		if(!await getacl(req, title, 'read')) {
			httpstat = 403;
			error = true;
			
			res.send(await showError(req, 'insufficient_privileges_read'));
			
			return;
		} else {
			content = rawContent[0]['content'];
		}
	} catch(e) {
		viewname = 'notfound';
		
		httpstat = 404;
		content = '';
	}
	
	res.send('<pre>' + html.escape(content) + '</pre>');
});