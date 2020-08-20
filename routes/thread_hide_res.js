wiki.get('/admin/thread/:tnum/:id/show', async function showHiddenComment(req, res) {
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const tnum = req.params["tnum"];
	const tid = req.params["id"];
	
	await curs.execute("select topic from threads where deleted = '1' and tnum = ?", [tnum]);
	if(curs.fetchall().length && !getperm('developer', ip_check(req))) {
		res.send(await showError(req, "thread_not_found")); return;
	}
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }
	
	if((rs['username'] == ip_check(req) && rs['ismember'] == (islogin(req) ? 'author' : 'ip') && atoi(getTime()) - atoi(rs['time']) > 180000)) {
		if(!getperm('blind_thread_comment', ip_check(req))) {
			res.send(await showError(req, 'h_time_expired'));
			return;
		}
	}
	
	if(!getperm('blind_thread_comment', ip_check(req)) && !((getperm('blind_thread_comment', ip_check(req))) || (rs['username'] == ip_check(req) && rs['ismember'] == (islogin(req) ? 'author' : 'ip') && atoi(getTime()) - atoi(rs['time']) <= 180000))) {
		if(!getperm('blind_thread_comment', ip_check(req))) {
			res.send(await showError(req, 'h_time_expired'));
			return;
		}
	}
	
	curs.execute("update res set hidden = '0', hider = '' where tnum = ? and id = ?", [tnum, tid]);
	
	res.redirect('/thread/' + tnum);
});

wiki.get('/admin/thread/:tnum/:id/hide', async function hideComment(req, res) {
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const tnum = req.params["tnum"];
	const tid = req.params["id"];
	
	await curs.execute("select topic from threads where deleted = '1' and tnum = ?", [tnum]);
	if(curs.fetchall().length && !getperm('developer', ip_check(req))) {
		res.send(await showError(req, "thread_not_found")); return;
	}
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }
	
	const rs = await curs.execute("select username, ismember from res where tnum = ? and id = ?", [tnum, tid]);
	
	if((rs['username'] == ip_check(req) && rs['ismember'] == (islogin(req) ? 'author' : 'ip') && atoi(getTime()) - atoi(rs['time']) > 180000)) {
		if(!getperm('blind_thread_comment', ip_check(req))) {
			res.send(await showError(req, 'h_time_expired'));
			return;
		}
	}
	
	if(!getperm('hide_thread_comment', ip_check(req)) && !((getperm('hide_thread_comment', ip_check(req))) || (rs['username'] == ip_check(req) && rs['ismember'] == (islogin(req) ? 'author' : 'ip') && atoi(getTime()) - atoi(rs['time']) <= 180000))) {
		if(!getperm('blind_thread_comment', ip_check(req))) {
			res.send(await showError(req, 'h_time_expired'));
			return;
		}
	}
	
	curs.execute("update res set hidden = '1', hider = ? where tnum = ? and id = ?", [ip_check(req), tnum, tid]);
	
	res.redirect('/thread/' + tnum);
});