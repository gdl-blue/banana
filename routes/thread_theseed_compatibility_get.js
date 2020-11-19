wiki.get('/thread/:tnum/:id', async function dropThreadData(req, res) {
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const tnum = req.params["tnum"];
	const tid = req.params["id"];
	
	await curs.execute("select topic from threads where deleted = '1' and tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	if(curs.fetchall().length && !getperm(req, 'developer', ip_check(req))) {
		res.send(await showError(req, "thread_not_found")); return;
	}
	
	await curs.execute("select id from res where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }
	
	await curs.execute("select username from res where tnum = ? and (id = '1') and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	const fstusr = curs.fetchall()[0]['username'];
	
	await curs.execute("select title, topic, status from threads where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	const title = curs.fetchall()[0]['title'];
	const topic = curs.fetchall()[0]['topic'];
	const status = curs.fetchall()[0]['status'];
	
	if(!await getacl(req, title, 'read')) {
		res.send(await showError(req, 'insufficient_privileges_read'));
		
		return;
	}
	
	content = ``;
	
	content = await getThreadData(req, tnum, tid);
	
	res.send(content);
});