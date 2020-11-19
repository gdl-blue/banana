wiki.post('/admin/thread/:tnum/status', async function updateThreadStatus(req, res) {
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
	
	await curs.execute("select status from threads where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	const ostatus = curs.fetchall()[0]['status'];
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }

	var newstatus = req.body['status'];
	if(!['close', 'pause', 'normal'].includes(newstatus)) newstatus = 'normal';
	
	if(!getperm(req, 'update_thread_status', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		return;
	}
	
	if(ostatus == newstatus) {
		res.send(await showError(req, 'no_change'));
		return;
	}
	
	curs.execute("update threads set status = ? where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [newstatus, tnum, subwiki(req)]);
	
	await curs.execute("select subwikiid from threads where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	const sid = curs.fetchall()[0]['subwikiid'] == 'global';
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin, stype, subwikiid) \
					values (?, ?, ?, ?, '0', '', '1', ?, ?, ?, 'status', ?)", [
						String(rescount + 1), newstatus, ip_check(req), getTime(), tnum, islogin(req) ? 'author' : 'ip', getperm(req, 'admin', ip_check(req)) || getperm(req, 'fake_admin', ip_check(req)) ? '1' : '0', sid ? 'global' : subwiki(req)
					]);
	
	res.json({});
});

wiki.post('/admin/thread/:tnum/document', async function updateThreadDocument(req, res) {
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

	var newdoc = req.body['document'];
	if(!newdoc.length) {
		res.send('');
		return;
	}
	
	if(!getperm(req, 'update_thread_document', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	curs.execute("update threads set title = ? where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [newdoc, tnum, subwiki(req)]);
	
	await curs.execute("select subwikiid from threads where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	const sid = curs.fetchall()[0]['subwikiid'] == 'global';
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin, stype, subwikiid) \
					values (?, ?, ?, ?, '0', '', '1', ?, ?, ?, 'document', ?)", [
						String(rescount + 1), newdoc, ip_check(req), getTime(), tnum, islogin(req) ? 'author' : 'ip', getperm(req, 'admin', ip_check(req)) || getperm(req, 'fake_admin', ip_check(req)) ? '1' : '0', sid ? 'global' : subwiki(req)
					]);
	
	res.json({});
});

wiki.post('/admin/thread/:tnum/topic', async function updateThreadTopic(req, res) {
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

	var newtopic = req.body['topic'];
	if(!newtopic.length) {
		res.send('');
		return;
	}
	
	if(!getperm(req, 'update_thread_topic', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	curs.execute("update threads set topic = ? where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [newtopic, tnum, subwiki(req)]);
	
	await curs.execute("select subwikiid from threads where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
	const sid = curs.fetchall()[0]['subwikiid'] == 'global';
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin, stype, subwikiid) \
					values (?, ?, ?, ?, '0', '', '1', ?, ?, ?, 'topic', ?)", [
						String(rescount + 1), newtopic, ip_check(req), getTime(), tnum, islogin(req) ? 'author' : 'ip', getperm(req, 'admin', ip_check(req)) || getperm(req, 'fake_admin', ip_check(req)) ? '1' : '0', sid ? 'global' : subwiki(req)
					]);
	
	res.json({});
});