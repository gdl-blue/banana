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
					if(ltid > 3 && crid != 1 && (crid < ltid - 1)) {
						if(!ambx) {
							content += `
								<br>
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
			
			var rawContent = await curs.execute("select content from documents where title = ?", [title]);
			
			content += `
				<br><br>
				
				<h4 class="wiki-heading">토론 발제하기</h4>
				
				<form method=post id=new-thread-form>
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
											${rawContent.length ? '<option value=edit_request>편집요청</option>' : ''}
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
					
					<div class=form-group>
						<label>내 의견:</label><br />
						<textarea name=text class=form-control rows=5></textarea>
					</div>
					
					<div class=form-group id=editRequestForm style="display: none;">
						<ul class="nav nav-tabs" role=tablist style="height: 38px;">
							<li class=nav-item>
								<a class="nav-link active" data-toggle=tab href="#edit" role=tab aria-expanded=true>편집</a>
							</li>
							
							<li class=nav-item>
								<a class=nav-link data-editrequest data-toggle=tab href="#preview" role=tab aria-expanded=true>미리보기</a>
							</li>
						</ul>
						
						<div class="tab-content bordered">
							<div id=edit class="tab-pane active" role=tabpanel aria-expanded=true>
								<textarea name=raw class=form-control rows=20>${rawContent.length ? rawContent[0].content : ''}</textarea>
							</div>
							
							<div id=preview class=tab-pane role=tabpanel aria-expanded=true></div>
						</div>
					</div>

					<div class="btns">
						<button id="createBtn" class="btn btn-info" style="width: 120px;">발제!</button>
					</div>
				</form>
			`;
			
			subtitle = ' (토론 목록)';
			viewname = 'thread_list'
	}
	
	res.send(await render(req, title, content, {
		st: 3
	}, subtitle, false, viewname));
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
	
	const adjectives = [
		'beautiful',
		'blue',
		'red',
		'giantic',
		'small',
		'soft',
		'hard',
		'difficult',
		'fluffy',
		'cloudy',
		'clear',
		'green',
		'pale',
		'closed',
		'opened',
		'working',
		'broken',
		'written',
		'found',
		'founded',
		'sad',
		'happy',
		'angry',
		'orange',
		'unclassifiable',
		'invalid',
		'valid',
		'yellow',
		'glossy',
		'flat',
		'white',
		'checked',
		'unchecked',
		'marked',
		'known',
		'unknown',
		'rabid',
		'rapid'
	];
	
	const nouns = [
		'computer',
		'diskette',
		'disk',
		'cd',
		'dvd',
		'mouse',
		'rat',
		'cat',
		'puppy',
		'key',
		'theme',
		'syntax',
		'command',
		'speaker',
		'media',
		'video',
		'music',
		'song',
		'window',
		'hub',
		'balloon',
		'air',
		'network',
		'navigator',
		'field',
		'box',
		'sound',
		'smash',
		'railway',
		'train',
		'bus',
		'car',
		'airplane',
		'plane',
		'keyboard',
		'board',
		'cable',
		'streak',
		'ship',
		'boat',
		'ufo',
		'object',
		'obstacle',
		'cage',
		'rabbit',
		'client', 
		'server'
	];
	
	// 경우의 수: 38 * 45 * 16^8 = 7,344,394,076,160가지
	var tnum = random.choice(adjectives) + '-' + random.choice(nouns) + '-' + rndval('abcdef0123456789', 8);
	
	while(1) {
		await curs.execute("select tnum from threads where tnum = ?", [tnum]);
		if(!curs.fetchall().length) break;
		tnum = random.choice(adjectives) + '-' + random.choice(nouns) + '-' + rndval('abcdef0123456789', 8);
	}
	
	if(req.body['type'] == 'edit_request') {
		if(!await getacl(req, title, 'edit_request')) {
			res.send(await showError(req, 'insufficient_privileges'));
			
			return;
		}
		
		var rawContent = await curs.execute("select content from documents where title = ?", [title]);
		if(!rawContent.length) {
			return res.send(await showError(req,' document_not_found'));
		}
		
		curs.execute("insert into threads (title, topic, status, time, tnum, type) values (?, ?, ?, ?, ?, 'edit_request')",
						[title, req.body['topic'], 'normal', getTime(), tnum]);
		
		curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin) values \
						(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
						['1', req.body['text'], ip_check(req), getTime(), '0', '', '0', tnum, islogin(req) ? 'author' : 'ip', getperm('admin', ip_check(req)) || getperm('fake_admin', ip_check(req)) ? '1' : '0']);
	} else {
		if(!await getacl(req, title, 'create_thread')) {
			res.send(await showError(req, 'insufficient_privileges'));
			
			return;
		}
		
		curs.execute("insert into threads (title, topic, status, time, tnum) values (?, ?, ?, ?, ?)",
						[title, req.body['topic'], 'normal', getTime(), tnum]);
		
		curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin) values \
						(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
						['1', req.body['text'], ip_check(req), getTime(), '0', '', '0', tnum, islogin(req) ? 'author' : 'ip', getperm('admin', ip_check(req)) || getperm('fake_admin', ip_check(req)) ? '1' : '0']);
	}
					
	res.redirect('/thread/' + tnum);
});