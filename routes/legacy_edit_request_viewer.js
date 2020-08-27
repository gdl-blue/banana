wiki.get('/edit_request/:num', async (req, res) => {
	const num = req.params['num'];
	
	var dbdata = await curs.execute("select name, num, send, leng, data, user, state, time, closer, y, pan, why, ap  from old_edit_requests where num = ?", [num]);
	
	if(!dbdata.length) {
		return res.send(await showError(req, 'edit_request_not_found'));
	}
	
	const request = dbdata[0];
	
	var dbdata = await curs.execute("select content, time, username from history where title = ? and rev = ?", [request.name, request.pan]);
	const _baserev = dbdata;
	var baserev;
	
	try {
		baserev = _baserev[0];
	} catch(e) {
		return res.send(await showError(req, 'internal_error'));
	}
	
	var content = `
		<form>
			<div class=form-group>
				요청자: ${html.escape(request.user)}
				<br />
				변경점: ${atoi(request.leng) > 0 ? '+' + request.leng : request.leng}
				<br />
				기준: r${request.pan}
				<br />
				<br />
				${request.state == 'open' ? '편집 요청이 열려있습니다.' : (request.state == 'close' ? '편집 요청이 ' + request.closer + '에 의해 ' + generateTime(toDate(request.y), timeFormat) + '에 닫혔습니다. (' + request.why + ')' : '편집 요청이 ' + request.closer + '에 의해 ' + generateTime(toDate(request.y), timeFormat) + '에 r' + request.ap + '로 적용되었습니다.')}
			</div>
		
			<div class=form-group>
				<label>요약:</label><br />
				<input type=text class=form-control readonly value="${request.send}" />
			</div>
		
			<ul class="nav nav-tabs" role=tablist style="height: 38px;">
				<li class=nav-item>
					<a class="nav-link active" data-toggle=tab href="#preview" role=tab aria-expanded=true>미리보기</a>
				</li>
				
				<li class=nav-item>
					<a class=nav-link data-toggle=tab href="#raw" role=tab aria-expanded=true>날내용</a>
				</li>
				
				<li class=nav-item>
					<a class=nav-link data-toggle=tab href="#diff" role=tab aria-expanded=true>비교</a>
				</li>
			</ul>
			
			<div class="tab-content bordered">
				<div id=preview class="tab-pane active" role=tabpanel aria-expanded=true>
					${await JSnamumark(request.name, request.data.replace(/\r\n/g, '\n').replace(/\r/g, '\n'))}
				</div>
				
				<div id=raw class=tab-pane role=tabpanel aria-expanded=true>
					<textarea class=form-control rows=15 readonly>${request.data}</textarea>
				</div>
				
				<div id=diff class=tab-pane role=tabpanel aria-expanded=true>
					${difflib.diff(baserev.content.replace(/\r\n/g, '\n').replace(/\r/g, '\n'), request.data.replace(/\r\n/g, '\n').replace(/\r/g, '\n'), request.pan + '판', '편집 요청 ' + num)}
				</div>
			</div>
		</form>
	`;
	
	res.send(await render(req, request.name, content, _, ' - 구 편집 요청 뷰어 (요청 #' + request.num + ')', _, 'edit_request'));
});