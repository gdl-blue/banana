wiki.get('/admin/thread/:tnum/delete', async function deleteThread(req, res) {
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const tnum = req.params["tnum"];
	
	await curs.execute("select topic from threads where deleted = '1' and tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	if(curs.fetchall().length && !getperm(req, 'developer', ip_check(req))) {
		res.send(await showError(req, "thread_not_found")); return;
	}
	
	await curs.execute("select id from res where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }
	
	if(!getperm(req, 'delete_thread', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	await curs.execute("select title, topic, status from threads where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	const title = curs.fetchall()[0]['title'];
	const topic = curs.fetchall()[0]['topic'];
	const status = curs.fetchall()[0]['status'];
	
	curs.execute("update threads set deleted = '1' where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	
	res.redirect('/discuss/' + encodeURIComponent(title));
});

wiki.get('/admin/thread/:tnum/restore', async function deleteThread(req, res) {
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	if(!getperm(req, 'developer', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	const tnum = req.params["tnum"];
	
	await curs.execute("select id from res where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }
	
	await curs.execute("select title, topic, status from threads where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	const title = curs.fetchall()[0]['title'];
	const topic = curs.fetchall()[0]['topic'];
	const status = curs.fetchall()[0]['status'];
	
	curs.execute("update threads set deleted = '0' where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	
	res.redirect('/discuss/' + encodeURIComponent(title));
});

wiki.get('/admin/thread/:tnum/permanant_delete', async function deleteThread(req, res) {
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	if(!getperm(req, 'developer', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	const tnum = req.params["tnum"];
	
	await curs.execute("select id from res where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }
	
	await curs.execute("select title, topic, status from threads where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	const title = curs.fetchall()[0]['title'];
	const topic = curs.fetchall()[0]['topic'];
	const status = curs.fetchall()[0]['status'];
	
	curs.execute("delete from threads where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	curs.execute("delete from res where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	
	res.redirect('/discuss/' + encodeURIComponent(title));
});