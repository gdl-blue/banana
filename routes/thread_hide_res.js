wiki.get('/admin/thread/:tnum/:id/show', async function showHiddenComment(req, res) {
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
	
	var rs = await curs.execute("select username, ismember, time from res where tnum = ? and id = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, tid, subwiki(req)]);
	if(!rs.length) {
		res.send(await showError(req, "res_not_found")); return;
	}
	rs = rs[0];
	
	if((rs['username'] == ip_check(req) && rs['ismember'] == (islogin(req) ? 'author' : 'ip') && atoi(getTime()) - atoi(rs['time']) > 180000)) {
		if(!getperm(req, 'blind_thread_comment', ip_check(req))) {
			res.send(await showError(req, 'h_time_expired'));
			return;
		}
	}
	
	if(!getperm(req, 'blind_thread_comment', ip_check(req)) && !((getperm(req, 'blind_thread_comment', ip_check(req))) || (rs['username'] == ip_check(req) && rs['ismember'] == (islogin(req) ? 'author' : 'ip') && atoi(getTime()) - atoi(rs['time']) <= 180000))) {
		if(!getperm(req, 'blind_thread_comment', ip_check(req))) {
			res.send(await showError(req, 'h_time_expired'));
			return;
		}
	}
	
	curs.execute("update res set hidden = '0', hider = '' where tnum = ? and id = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, tid, subwiki(req)]);
	
	res.redirect('/thread/' + tnum);
});

wiki.get('/admin/thread/:tnum/:id/hide', async function hideComment(req, res) {
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
	
	var rs = await curs.execute("select username, ismember, time from res where tnum = ? and id = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, tid, subwiki(req)]);
	if(!rs.length) {
		res.send(await showError(req, "res_not_found")); return;
	}
	rs = rs[0];
	
	if((rs['username'] == ip_check(req) && rs['ismember'] == (islogin(req) ? 'author' : 'ip') && atoi(getTime()) - atoi(rs['time']) > 180000)) {
		if(!getperm(req, 'blind_thread_comment', ip_check(req))) {
			res.send(await showError(req, 'h_time_expired'));
			return;
		}
	}
	
	if(!getperm(req, 'hide_thread_comment', ip_check(req)) && !((getperm(req, 'hide_thread_comment', ip_check(req))) || (rs['username'] == ip_check(req) && rs['ismember'] == (islogin(req) ? 'author' : 'ip') && atoi(getTime()) - atoi(rs['time']) <= 180000))) {
		if(!getperm(req, 'blind_thread_comment', ip_check(req))) {
			res.send(await showError(req, 'h_time_expired'));
			return;
		}
	}
	
	curs.execute("update res set hidden = '1', hider = ? where tnum = ? and id = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [ip_check(req), tnum, tid, subwiki(req)]);
	
	res.redirect('/thread/' + tnum);
});

wiki.get('/admin/thread/:tnum/:id/unspam', async function showHiddenComment(req, res) {
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
	
	var rs = await curs.execute("select username, ismember, time from res where tnum = ? and id = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, tid, subwiki(req)]);
	if(!rs.length) {
		res.send(await showError(req, "res_not_found")); return;
	}
	rs = rs[0];
	
	if(!getperm(req, 'blind_thread_comment', ip_check(req))) {
		return res.send(await showError(req, 'insufficient_prigiveges'));
	}
	
	curs.execute("update res set spam = '0', hider = '' where tnum = ? and id = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, tid, subwiki(req)]);
	
	res.redirect('/thread/' + tnum);
});

wiki.get('/admin/thread/:tnum/:id/spam', async function showHiddenComment(req, res) {
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
	
	var rs = await curs.execute("select username, ismember, time from res where tnum = ? and id = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, tid, subwiki(req)]);
	if(!rs.length) {
		res.send(await showError(req, "res_not_found")); return;
	}
	rs = rs[0];
	
	if(!getperm(req, 'blind_thread_comment', ip_check(req))) {
		return res.send(await showError(req, 'insufficient_prigiveges'));
	}
	
	curs.execute("update res set spam = '1', hider = ? where tnum = ? and id = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [ip_check(req), tnum, tid, subwiki(req)]);
	
	res.redirect('/thread/' + tnum);
});