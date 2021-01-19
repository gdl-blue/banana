wiki.post(/\/plugins\/enable/, async function API_enablePlugin_v3(req, res) {
	try {
		const name = req.body['name'];
		const picfg = require('./plugins/' + name + '/config.json');
		
		picfg['enabled'] = true;
		
		fs.writeFileSync('./plugins/' + name + '/config.json', JSON.stringify(picfg));
		
		res.json({
			'status': 'success'
		});
	} catch(e) {
		res.json({
			'status': 'error'
		});
	}
});

wiki.post(/\/plugins\/disable/, async function API_disablePlugin_v3(req, res) {
	try {
		const test = 6;
		
		const name = req.body['name'];
		const picfg = require('./plugins/' + name + '/config.json');
		
		if(picfg['type'] == 'acl') test = 7;
		
		picfg['enabled'] = false;
		
		fs.writeFileSync('./plugins/' + name + '/config.json', JSON.stringify(picfg));
		
		res.json({
			'status': 'success'
		});
	} catch(e) {
		res.json({
			'status': 'error'
		});
	}
});
