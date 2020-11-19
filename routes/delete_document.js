wiki.get(/\/delete\/(.*)/, async(req, res) => {
	const title = req.params[0];
	
	if(!await getacl(req, title, 'read')) {
		return res.send(await showError(req, 'insuffisient_privileges_read'));
	}
	
	if(!await getacl(req, title, 'edit')) {
		return res.send(await showError(req, 'insuffisient_privileges_edit'));
	}
	
	if(!await getacl(req, title, 'delete')) {
		return res.send(await showError(req, 'insuffisient_privileges_delete'));
	}
	
	const o_o = await curs.execute("select content from documents where title = ?", [title]);
	if(!o_o.length) {
		return res.send(await showError(req, 'document_not_found'));
	}
	
	captcha = generateCaptcha(req, 1);
	
	var content = `
		<form method="post" action="/delete/${encodeURIComponent(title)}" data-title="${title}" data-recaptcha="0">
			<div class=form-group>
				<label>사유: </label>
				<input type=text class=form-control id=logInput name=log />
			</div>
			
			<label><input type=checkbox name=agree> 문서 제목을 변경하는 것이 아님에 동의합니다.</label>
			
			<div class=form-group>
				${captcha}
			</div>
			
			<div class=btns>
				<button class="btn btn-danger" style="width: 100px;">문서 삭제</button>
			</div>
		</form>
	`;
	
	res.send(await render(req, title, content, {}, ' 문서 지우기', _, 'delete'));
});

wiki.post(/\/delete\/(.*)/, async (req, res) => {
	const title = req.params[0];
	
	if(title.startsWith('사용자:')) {
		return res.send(await showError(req, 'invalid'));
	}
	
	if(!await getacl(req, title, 'read')) {
		return res.send(await showError(req, 'insuffisient_privileges_read'));
	}
	
	if(!await getacl(req, title, 'edit')) {
		return res.send(await showError(req, 'insuffisient_privileges_edit'));
	}
	
	if(!await getacl(req, title, 'delete')) {
		return res.send(await showError(req, 'insuffisient_privileges_delete'));
	}
	
	if(!req.body['agree']) {
		return res.send(await showError(req, 'invalid_value'));
	}
	
	const o_o = await curs.execute("select content from documents where title = ?", [title]);
	if(!o_o.length) {
		return res.send(await showError(req, 'document_not_found'));
	}
	
	const _recentRev = await curs.execute("select content, rev from history where title = ? order by cast(rev as integer) desc limit 1", [title]);
	const recentRev = _recentRev[0];
	
	await curs.execute("delete from documents where title = ?", [title]);
	const rawChanges = 0 - recentRev.content.length;
	curs.execute("insert into history (title, content, rev, username, time, changes, log, iserq, erqnum, ismember, advance) \
					values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
		title, '', String(Number(recentRev.rev) + 1), ip_check(req), getTime(), itoa(rawChanges), req.body['log'] || '', '0', '-1', islogin(req) ? 'author' : 'ip', '(문서 지움)'
	]);
	
	res.redirect('/w/' + encodeURIComponent(title));
});