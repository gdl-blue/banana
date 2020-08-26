wiki.get(/\/revert\/(.*)/, async (req, res) => {
	const title = req.params[0];
	
	if(!await getacl(req, title, 'read')) {
		return res.send(await showError(req, 'insuffisient_privileges_read'));
	}
	
	if(!await getacl(req, title, 'edit')) {
		return res.send(await showError(req, 'insuffisient_privileges_edit'));
	}
	
	if(!await getacl(req, title, 'revert')) {
		return res.send(await showError(req, 'insuffisient_privileges_revert'));
	}
	
	const rev = req.query['rev'];
	if(!rev) {
		return res.send(await showError(req, 'revision_not_specified'));
	}
	
	if(isNaN(atoi(rev))) {
		return res.send(await showError(req, 'invalid_value'));
	}
	
	const dbdata = await curs.execute("select content, time, username from history where title = ? and rev = ?", [title, rev]);
	if(!dbdata.length) {
		return res.send(await showError(req, 'revision_not_found'));
	}
	
	const revdata = dbdata[0];
	
	var content = `
		<form method=get>
			<div class=form-group>
				<label>리비전:</label><br />
				<input type=number name=rev class=form-control value="${rev}" />
			</div>
			
			<div class=btns>
				<a class="btn btn-secondary" href="/revert/${encodeURIComponent(title)}?rev=1">&lt;&lt;</a>
				<a class="btn btn-secondary ${rev == '1' ? 'disabled' : ''}" ${rev == '1' ? 'disabled' : ''} href="/revert/${encodeURIComponent(title)}?rev=${atoi(rev) - 1}">&lt; ${rev == '1' ? '' : atoi(rev) - 1}</a>
				<button type=submit class="btn btn-info">이동</button>
				<a class="btn btn-secondary" href="/revert/${encodeURIComponent(title)}?rev=${atoi(rev) + 1}">${atoi(rev) + 1} &gt;</a>
				<a class="btn btn-secondary" href="/delete/${encodeURIComponent(title)}">×</a>
			</div>
		</form>
		
		<form>
			<div class=form-group>
				<label>날짜 (UTC):</label><br />
				<input type=text readonly class=form-control value="${html.escape(toDate(revdata.time))}" />
			</div>
			
			<div class=form-group>
				<label>기여자:</label><br />
				<input type=text readonly class=form-control value="${html.escape(revdata.username)}" />
			</div>
			
			<div class=form-group>
				<label>미리 보기:</label><br />
				<textarea class=form-control rows=15 readonly>${revdata.content}</textarea>
			</div>
		</form>
		
		<form method=post>
			<div class=form-group>
				<label>사유:</label><br>
				<input type=text class=form-control name=log />
			</div>
			
			<div class=btns>
				<button type=submit class="btn btn-primary" style="width: 100px;">확인</button>
			</div>
		</form>
	`;
	
	res.send(await render(req, title, content, {
		rev: rev,
		text: revdata.content
	}, ' (' + rev + '판으로 복원)', _, 'revert'))
});