wiki.get(/^\/edit\/(.*)/, async function editDocument(req, res) {
	const title = req.params[0];
	
	if(!await getacl(req, title, 'read')) {
		res.status(403).send(await showError(req, 'insufficient_privileges_read'));
		
		return;
	}
	
	await curs.execute("select content from documents where title = ?", [title]);
	var rawContent = curs.fetchall();
	
	if(!rawContent[0]) rawContent = '';
	else rawContent = rawContent[0]['content'];
	
	var error = false;
	var content = '';
	
	var token = rndval('abcdef1234567890', 64);
	
	var baserev;
	
	await curs.execute("select rev from history where title = ? order by CAST(rev AS INTEGER) desc limit 1", [title]);
	try {
		baserev = curs.fetchall()[0]['rev'];
	} catch(e) {
		baserev = 0;
	}
	
	var captcha = '';
	
	if(!req.cookies.dooly) {
		captcha = generateCaptcha(req, 1);
	}
	
	if(!await getacl(req, title, 'edit')) {
		error = true;
		content = `
			${alertBalloon('[권한 부족]', '편집할 권한이 없습니다. 토론에서 편집할 내용을 올리십시오.', 'danger', true)}
		
			<textarea id="textInput" name="text" wrap="soft" class="form-control" readonly=readonly>${html.escape(rawContent)}</textarea>
		`;
	} else {
		content = `
			<ul class="nav nav-pills" role=tablist>
				<li class="nav-item">
					<a class="nav-link active" data-toggle="tab" href="#edit" role="tab" aria-expanded=true>편집기</a>
				</li>
				
				<li class="nav-item">
					<a id="previewLink" class="nav-link" data-toggle="tab" href="#preview" role="tab" aria-expanded=true>미리보기</a>
				</li>
				
				<li class="nav-item">
					<a id=diffLink class="nav-link" data-toggle="tab" href="#diff" role="tab" aria-expanded=true>비교</a>
				</li>
				
				<li class="nav-item">
					<a class="nav-link" data-toggle="tab" href="#delete" role="tab" aria-expanded=true>삭제</a>
				</li>
				
				<li class="nav-item">
					<a class="nav-link" data-toggle="tab" href="#move" role="tab" aria-expanded=true>이동</a>
				</li>
			</ul>
			
			<div class="tab-content bordered">
				<div class="tab-pane active" id="edit" role="tabpanel">
					<form method="post" id="editForm" data-title="${html.escape(title)}" data-recaptcha="0">
						<input type="hidden" name="token" value="">
						<input type="hidden" name="identifier" value="${islogin(req) ? 'm' : 'i'}:${ip_check(req)}">
						<input type="hidden" name="baserev" value="${baserev}">
						<input type=hidden name=submittype value="edit">
						
						<textarea id=originalContent style="display: none;">${html.escape(rawContent)}</textarea>
						<textarea id="textInput" name="text" wrap="soft" class="form-control">${html.escape(rawContent)}</textarea>

						<div class="form-group" style="margin-top: 1rem;">
							<label class="control-label" for="summaryInput">편집 메모:</label>
							<input type="text" class="form-control" id="logInput" name="log" value="">
						</div>
						
						<div class=form-group>
							${captcha}
						</div>
						
						<div class="btns">
							<button id="editBtn" class="btn btn-primary" style="width: 100px;">저장</button>
						</div>
					</form>
				</div>
				
				<div class="tab-pane" id="preview" role="tabpanel">
					<iframe id=previewFrame name=previewFrame></iframe>
				</div>
				
				<div class="tab-pane" id=diff role="tabpanel">
				
				</div>
				
				<div class="tab-pane" id="delete" role="tabpanel">
					<form method="post" action="/delete/${encodeURIComponent(title)}" data-title="${title}" data-recaptcha="0">
						<input type="hidden" name="token" value="">
						<input type="hidden" name="identifier" value="${islogin(req) ? 'm' : 'i'}:${ip_check(req)}">
						<input type="hidden" name="baserev" value="${baserev}">
						<input type=hidden name=submittype value=delete>

						<div class="form-group" style="margin-top: 1rem;">
							<label>사유: </label>
							<input type="text" class="form-control" id="logInput" name="log" value="">
						</div>
						
						<label><input type=checkbox name=agree> 문서 제목을 변경하는 것이 아님에 동의합니다.</label>
						
						<div class=form-group>
							${captcha}
						</div>
						
						<div class="btns">
							<button class="btn btn-danger" style="width: 100px;">문서 삭제</button>
						</div>
					</form>
				</div>
				
				<div class="tab-pane" id="move" role="tabpanel">
					<form method="post" id="editForm" data-title="${title}" data-recaptcha="0">
						<input type="hidden" name="token" value="">
						<input type="hidden" name="identifier" value="${islogin(req) ? 'm' : 'i'}:${ip_check(req)}">
						<input type="hidden" name="baserev" value="${baserev}">
						<input type=hidden name=submittype value=move>

						<div class="form-group" style="margin-top: 1rem;">
							<label>제목: </label>
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
				</div>
			</div>
		`;
	}
	
	if(!islogin(req)) {
		content += `<p style="font-weight: bold; color: red;">로그인하지 않았습니다. 역사에 IP(${ip_check(req)})를 영구히 기록하는 것에 동의하는 것으로 간주합니다.</p>`;
	}

	var httpstat = 200;
	
	res.status(httpstat).send(await render(req, title, content, {
		token: token,
		captcha: 0,
		body: {
			baserev: baserev,
			text: rawContent,
			section: null,
			error: error
		},
		st: 2
	}, ' (편집)', error, 'edit'));
});

wiki.post(/^\/edit\/(.*)/, async function saveDocument(req, res) {
	const title = req.params[0];
	
	if(!await getacl(req, title, 'edit') || !await getacl(req, title, 'read')) {
		res.send(await showError(req, 'insufficient_privileges_edit'));
		
		return;
	}
	
	if(!req.cookies.dooly && config.getString('enable_captcha', '1') != '0') {
		try {
			if(req.body['captcha'].replace(/\s/g, '') != req.session.captcha) {
				res.send(await showError(req, 'invalid_captcha_number'));
				return;
			} else {
				res.cookie('dooly', 0, {
					maxAge: 30 * 24 * 60 * 60 * 1000, 
					httpOnly: false 
				});
			}
		} catch(e) {
			res.send(await showError(req, 'captcha_check_fail'));
			return;
		}
	}
	
	await curs.execute("select content from documents where title = ?", [title]);
	var original = curs.fetchall();
	
	if(!original[0]) original = '';
	else original = original[0]['content'];
	
	const content = req.body['text'];
	const rawChanges = content.length - original.length;
	
	try {
		markdown(content);
	} catch(e) {
		print(e);
		res.send(await showError(req, 'syntax_error'));
		return;
	}
	
	const changes = (rawChanges > 0 ? '+' : '') + String(rawChanges);
	
	const log = req.body['log'];
	
	const agree = req.body['agree'];
	
	const baserev = req.body['baserev'];
	
	const ismember = islogin(req) ? 'author' : 'ip';
	
	var advance = '';
	
	await curs.execute("select title from documents where title = ?", [title]);
	
	if(!curs.fetchall().length) {
		advance = '(문서 생성)';
		curs.execute("insert into documents (title, content) values (?, ?)", [title, content]);
	} else {
		curs.execute("update documents set content = ? where title = ?", [content, title]);
		curs.execute("update stars set lastedit = ? where title = ?", [getTime(), title]);
	}
	
	curs.execute("insert into history (title, content, rev, username, time, changes, log, iserq, erqnum, ismember, advance) \
					values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
		title, content, String(Number(baserev) + 1), ip_check(req), getTime(), changes, log, '0', '-1', ismember, advance
	]);
	
	res.redirect('/w/' + title + (req.query['section'] ? '#s-' + req.query['section'] : ''));
});

wiki.post(/\/preview\/(.*)/, async (req, res) => {
	try {
		res.send(await JSnamumark(req.params[0], req.body['text']));
	} catch(e) {
		res.send(await showError('invalid_request_body'));
	}
});
