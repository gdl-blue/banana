wiki.post('/check/thread/:tnum', async function notifyEvent(req, res) {
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	var tnum = req.params["tnum"];
	
	await curs.execute("select topic from threads where deleted = '1' and tnum = ?", [tnum]);
	if(curs.fetchall().length && !getperm(req, 'developer', ip_check(req))) {
		res.send(await showError(req, "thread_not_found")); return;
	}
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }
	
	await curs.execute("select id from res where tnum = ? order by cast(time as integer) desc limit 1", [tnum]);
	
	res.json({
		"id": Number(curs.fetchall()[0]['id'])
	});
});