wiki.get(/^\/discuss\/(.*)/, async function threadList(req, res) {
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const title = req.params[0];
	
	var state = req.query['state'];
	if(!state) state = '';
	
	if(!await getacl(req, title, 'read')) {
		res.send(await showError(req, 'insufficient_privileges_read'));
		
		return;
	}
	
	var content = '';
	
	var trdlst;
	
	var subtitle = '';
	var viewname = '';
	
	switch(state) {
		case 'close':
			content += '<ul class=wiki-list>';
			
			var cnt = 0;
			await curs.execute("select topic, tnum from threads where title = ? and status = 'close' order by cast(time as integer) desc", [title]);
			trdlst = curs.fetchall();
			
			for(trd of trdlst) {
				content += `<li><a href="#${++cnt}">${cnt}</a>. <a href="/thread/${trd['tnum']}">${html.escape(trd['topic'])}</a></li>`;
			}
			
			content += '</ul>';
			
			subtitle = ' (닫힌 토론)';
			
			viewname = 'thread_list_close'
		break;default:
			content += `
				<h2 class="wiki-heading">열린 토론 목록</h2>
				<div class=wiki-heading-content>
			`;
				
			await curs.execute("select topic, tnum from threads where title = ? and not status = 'close' order by cast(time as integer) desc", [title]);
			trdlst = curs.fetchall();
			
			cnt = 0;
			for(trd of trdlst) {
				await curs.execute("select topic from threads where deleted = '1' and tnum = ?", [trd['tnum']]);
				if((curs.fetchall().length) && !getperm('developer', ip_check(req))) {
					continue;
				}
				
				content += `
					<h3 class=wiki-heading id="${++cnt}">
						${cnt}. <a href="/thread/${trd['tnum']}">${html.escape(trd['topic'])}</a>
					</h3>
					
					<div class=topic-discuss>
				`;
				
				await curs.execute("select id, content, username, time, hidden, hider, status, ismember from res where tnum = ? order by cast(id as integer) asc", [trd['tnum']]);
				const td = curs.fetchall();
				await curs.execute("select id from res where tnum = ? order by cast(id as integer) desc limit 1", [trd['tnum']]);
				const ltid = Number(curs.fetchall()[0]['id']);
				
				var ambx = false;
				
				await curs.execute("select username from res where tnum = ? and (id = '1')", [trd['tnum']]);
				const fstusr = curs.fetchall()[0]['username'];
				
				for(rs of td) {
					const crid = Number(rs['id']);
					if(ltid > 4 && crid != 1 && (crid < ltid - 3)) {
						if(!ambx) {
							content += `
								<div>
									<a class=more-box href="/thread/${trd['tnum']}">더보기...</a>
								</div>
							`;
							
							ambx = true;
						}
						continue;
					}
					
					content += `
						<div class=res-wrapper>
							<div class="res res-type-${rs['status'] == '1' ? 'status' : 'normal'}">
								<div class="r-head${rs['username'] == fstusr ? " first-author" : ''}">
									<span class=num>${rs['id']}.</span> ${ip_pas(rs['username'])} <span style="float: right;">${generateTime(toDate(rs['time']), timeFormat)}</span>
								</div>
								
								<div class="r-body${rs['hidden'] == '1' ? ' r-hidden-body' : ''}">
									${
										rs['hidden'] == '1'
										? (
											getperm('hide_thread_comment', ip_check(req))
											? '[' + rs['hider'] + '가 숨긴 댓글입니다.]<br>' + markdown(rs['content'], rs['ismember'])
											: '[' + rs['hider'] + '가 숨긴 댓글입니다.]'
										  )
										: markdown(rs['content'], rs['ismember'])
									}
								</div>
							</div>
						</div>
					`;
				}
				
				content += '</div>';
			}
			content += '<a href="?state=close">[닫힌 토론 목록]</a>';
			
			content += `
				<br><br>
				
				<h4 class="wiki-heading">토론 발제하기</h4>
				
				<form method=post class=new-thread-form>
					<input type=hidden name=identifier value="${islogin(req) ? 'm' : 'i'}:${ip_check(req)}">
					
					<table>
						<colgroup>
							<col style="width: 120px;">
							<col>
						</colgroup>
					
						<tbody>
							<tr>
								<td style="padding: 0 5px 0 0;">
									<div class="form-group">
										<label>유형:</label>
										<select class="form-control" name=type>
											<option value=normal>토론</option>
											<option value=edit_request disabled>편집요청</option>
										</select>
									</div>
								</td>
								
								<td style="padding: 0 0 0 5px;">
									<div class="form-group">
										<label>토론할 주제:</label>
										<input type="text" class="form-control" name="topic">
									</div>
								</td>
							</tr>
						</tbody>
					</table>

					<div class="form-group">
						<label>내 의견:</label>
						<textarea name="text" class="form-control" rows="5"></textarea>
					</div>
					
					<div class=form-group style="display: none;">
						<label>문서 수정: </label>
						<textarea name=raw class=form-control rows=20></textarea>
					</div>

					<div class="btns">
						<button id="createBtn" class="btn btn-info" style="width: 120px;">발제!</button>
					</div>
				</form>
			`;
			
			subtitle = ' (토론 목록)';
			viewname = 'thread_list'
	}
	
	res.send(await render(req, title, content, _, subtitle, false, viewname));
});

wiki.post(/^\/discuss\/(.*)/, async function createThread(req, res) {
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	if(!req.body['topic'] || !req.body['text']) {
		res.send(await showError(req, 'invalid_request_body'));
		return;
	}
	
	const title = req.params[0];
	
	if(!await getacl(req, title, 'read')) {
		res.send(showError('insufficient_privileges_read'));
		
		return;
	}
	
	if(!await getacl(req, title, 'create_thread')) {
		res.send(await showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	var tnum = rndval('abcdef0123456789', 32);
	
	while(1) {
		await curs.execute("select tnum from threads where tnum = ?", [tnum]);
		if(!curs.fetchall().length) break;
		tnum = rndval('abcdef0123456789', 32);
	}
	
	curs.execute("insert into threads (title, topic, status, time, tnum) values (?, ?, ?, ?, ?)",
					[title, req.body['topic'], 'normal', getTime(), tnum]);
	
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin) values \
					(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
					['1', req.body['text'], ip_check(req), getTime(), '0', '', '0', tnum, islogin(req) ? 'author' : 'ip', getperm('admin', ip_check(req)) ? '1' : '0']);
					
	res.redirect('/thread/' + tnum);
});