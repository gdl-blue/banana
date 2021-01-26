wiki.get(/^\/diff\/(.*)/, async (req, res) => {
	const title  = req.params[0];
	const rev    = req.query ['rev'];
	const oldrev = req.query ['oldrev'];
	
	if(!rev || !oldrev || atoi(rev) <= atoi(oldrev)) {
		return res.send(await showError(req, 'revision_not_found'));
	}
	
	if(!await getacl(req, title, 'read')) {
		return res.send(await showError(req, 'insuffisient_privileges_read'));
	}
	
	if(!await getacl(req, title, 'diff')) {
		return res.send(await showError(req, 'insuffisient_privileges_diff'));
	}
	
	var dbdata = await curs.execute("select content from history where title = ? and rev = ?", [title, rev]);
	if(!dbdata.length) {
		return res.send(await showError(req, 'revision_not_found'));
	}
	
	const revdata   = dbdata[0];
	
	var dbdata = await curs.execute("select content from history where title = ? and rev = ?", [title, oldrev]);
	if(!dbdata.length) {
		return res.send(await showError(req, 'revision_not_found'));
	}
	const oldrevdata = dbdata[0];
	
	const diffoutput = difflib.diff(oldrevdata.content, revdata.content, oldrev + '판', rev + '판');
	
	var content = `
		<form method=get>
			<div class=form-inline>
				<div class=form-group style="float: left; width: 49%;">
					<label class=control-label>신판: </label><br />
					<div>
						<input type=number name=rev class=form-control value="${rev}" />
					</div>
				</div>
				
				<div class=form-group style="float: right; width: 49%;">
					<label class=control-label>구판: </label><br />
					<div>
						<input type=number name=oldrev class=form-control value="${oldrev}" />
					</div>
				</div>
			</div>
				
			<div class=btns>
				<a class="btn btn-secondary" href="/diff/${encodeURIComponent(title)}?rev=1">&lt;</a>
				<a class="btn btn-secondary ${oldrev == '1' ? 'disabled' : ''}" ${oldrev == '1' ? 'disabled' : ''} href="/diff/${encodeURIComponent(title)}?rev=${atoi(rev) - 1}">&lt; ${rev == '1' ? '' : atoi(rev) - 1}</a>
				<button type=submit class="btn btn-info">이동</button>
				<a class="btn btn-secondary" href="/diff/${encodeURIComponent(title)}?rev=${atoi(rev) + 1}">${atoi(rev) + 1} &gt;</a>
				<a class="btn btn-secondary" href="/diff/${encodeURIComponent(title)}">&gt;</a>
			</div>
		</form>
		
		<div>
			${diffoutput}
		</div>
	`;
	
	res.send(await render(req, title, content, {
		rev: rev,
		oldrev: oldrev,
		diffoutput: diffoutput
	}, ` (${oldrev}판 vs. ${rev}판 비교)`, _, 'diff'))
});