wiki.get(/\/move\/(.*)/, async(req, res) => {
	const title = req.params[0];
	
	if(!await getacl(req, title, 'read')) {
		return res.send(await showError(req, 'insuffisient_privileges_read'));
	}
	
	if(!await getacl(req, title, 'edit')) {
		return res.send(await showError(req, 'insuffisient_privileges_edit'));
	}
	
	if(!await getacl(req, title, 'move')) {
		return res.send(await showError(req, 'insuffisient_privileges_move'));
	}
	
	const o_o = await curs.execute("select content from history where title = ?", [title]);
	if(!o_o.length) {
		return res.send(await showError(req, 'document_not_found'));
	}
	
	captcha = generateCaptcha(req, 1);
	
	var content = `
		<form method="post" action="/move/${encodeURIComponent(title)}" data-title="${title}" data-recaptcha="0">
			<div class="form-group" style="margin-top: 1rem;">
				<label>새로운 제목: </label>
				<input type=text class=form-control name=newtitle>
			</div>

			<div class="form-group" style="margin-top: 1rem;">
				<label>사유: </label>
				<input type="text" class="form-control" id="logInput" name="log" value="">
			</div>
			
			<div class=form-group>
				${captcha}
			</div>
			
			<div class="btns">
				<button class="btn btn-warning" style="width: 100px;">문서 이동</button>
			</div>
		</form>
	`;
	
	res.send(await render(req, title, content, {}, ' 문서 지우기', _, 'delete'));
});

wiki.post(/\/move\/(.*)/, async (req, res) => {
	const title = req.params[0];
	
	if(!await getacl(req, title, 'read')) {
		return res.send(await showError(req, 'insuffisient_privileges_read'));
	}
	
	if(!await getacl(req, title, 'edit')) {
		return res.send(await showError(req, 'insuffisient_privileges_edit'));
	}
	
	if(!await getacl(req, title, 'move')) {
		return res.send(await showError(req, 'insuffisient_privileges_move'));
	}
	
	const newtitle = req.body['newtitle'] || req.body['title'];
	
	if(!newtitle) {
		return res.send(await showError(req, 'invalid_value'));
	}
	
	const o_o = await curs.execute("select content from history where title = ?", [title]);
	if(!o_o.length) {
		return res.send(await showError(req, 'document_not_found'));
	}
	
	const p_q = await curs.execute("select content from history where title = ?", [newtitle]);
	if(p_q.length) {
		return res.send(await showError(req, 'document_exists'));
	}
	
	const _recentRev = await curs.execute("select content, rev from history where title = ? order by cast(rev as integer) desc limit 1", [title]);
	const recentRev = _recentRev[0];
	
	await curs.execute("update documents set title = ? where title = ?", [newtitle, title]);
	const rawChanges = 0;
	curs.execute("insert into history (title, content, rev, username, time, changes, log, iserq, erqnum, ismember, advance) \
					values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
		title, '', String(Number(recentRev.rev) + 1), ip_check(req), getTime(), itoa(rawChanges), req.body['log'] || '', '0', '-1', islogin(req) ? 'author' : 'ip', '(' + title + '에서 ' + newtitle + '(으)로 문서 제목 변경)'
	]).then(x => {
		curs.execute("update history set title = ? where title = ?", [newtitle, title]);
	}).catch(console.error);
	
	res.redirect('/w/' + encodeURIComponent(newtitle));
});