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
			await curs.execute("select topic, tnum from threads where title = ? and status = 'close' and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global') order by cast(time as integer) desc", [title, subwiki(req)]);
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
				
			await curs.execute("select topic, tnum from threads where title = ? and not status = 'close' and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global') order by cast(time as integer) desc", [title, subwiki(req)]);
			trdlst = curs.fetchall();
			
			cnt = 0;
			for(trd of trdlst) {
				await curs.execute("select topic from threads where deleted = '1' and tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [trd['tnum'], subwiki(req)]);
				if((curs.fetchall().length) && !getperm(req, 'developer', ip_check(req))) {
					continue;
				}
				
				content += `
					<h3 class=wiki-heading id="${++cnt}">
						${cnt}. <a href="/thread/${trd['tnum']}">${html.escape(trd['topic'])}</a>
					</h3>
					
					<div class=topic-discuss>
				`;
				
				await curs.execute("select id, content, username, time, hidden, hider, status, ismember from res where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global') order by cast(id as integer) asc", [trd['tnum'], subwiki(req)]);
				const td = curs.fetchall();
				await curs.execute("select id from res where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global') order by cast(id as integer) desc limit 1", [trd['tnum'], subwiki(req)]);
				const ltid = Number(curs.fetchall()[0]['id']);
				
				var ambx = false;
				
				await curs.execute("select username from res where tnum = ? and (id = '1') and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [trd['tnum'], subwiki(req)]);
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
									<span class=num>${rs['id']}.</span> ${ip_pas(req, rs['username'])} <span style="float: right;">${generateTime(toDate(rs['time']), timeFormat)}</span>
								</div>
								
								<div class="r-body${rs['hidden'] == '1' ? ' r-hidden-body' : ''}">
									${
										rs['hidden'] == '1'
										? (
											getperm(req, 'hide_thread_comment', ip_check(req))
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
			
			var rawContent = await curs.execute("select content, rev from history where title = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global') order by cast(rev as integer) desc limit 1", [title, subwiki(req)]);
			
			content += `
				<br><br>
				
				<h4 class="wiki-heading">토론 발제하기</h4>
				
				<form method=post id=new-thread-form>
					<input type=hidden name=identifier value="${islogin(req) ? 'm' : 'i'}:${ip_check(req)}">
					
					<table>
						<colgroup>
							<col style="width: 130px;">
							<col>
						</colgroup>
					
						<tbody>
							<tr>
								<td style="padding: 0 5px 0 0;">
									<div class="form-group">
										<label>유형:</label>
										<select class="form-control" name=type>
											<option value=global>전역 토론</option>
											<option value=normal selected>지역 토론</option>
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
					
					<div class=form-group id=editRequestForm style="display: none;">
						<input type=hidden name=baserev value="${rawContent.length ? rawContent[0]['rev'] : ''}" />
						
						<tabpage>
              <titlebar>편집 요청 내용</titlebar>

              <tabframe>
                <tabbar id=editor centered>
                  <tools>
                    <a 
                      title="굵게"
                      data-default-value="내용"
                      class=insert-markup

                      data-start="'''"
                      data-end="'''"
                    ><strong>B</strong></a>

                    <a 
                      title="기울임"
                      data-default-value="내용"
                      class=insert-markup

                      data-start="''"
                      data-end="''"
                    ><i>I</i></a>

                    <a 
                      title="밑줄"
                      data-default-value="내용"
                      class=insert-markup

                      data-start="__"
                      data-end="__"
                    ><u>U</u></a>

                    <a 
                      title="취소선"
                      data-default-value="내용"
                      class=insert-markup

                      data-start="--"
                      data-end="--"
                    ><strike>S</strike></a>

                    <a 
                      title="글자 색"
                      data-default-value="내용"
                      class=insert-markup

                      data-start="{{{#색이름 "
                      data-end="}}}"
                    ><font color=red>C</font></a>

                    <a 
                      title="글자 크기"
                      data-default-value="내용"
                      class=insert-markup

                      data-start="{{{+수치 "
                      data-end="}}}"
                    ><font size=3>A+</font></a>

                    <a 
                      title="링크"
                      data-default-value="문서명"
                      class=insert-markup

                      data-start="[["
                      data-end="]]"
                    ><u><font color=blue>∞</font></u></a>
                  </tools>

                  <tabs>
                    <tab active page=edit><t>편집기</t></tab
                    ><tab page=preview id=previewLink><t>미리보기</t></tab
                    ><tab page=diff id=diffLink><t>비교</t></tab
                    ><tab newtab nomobile text="메모" content='&lt;textarea style="width: 100%;" rows=19&gt;&lt;/textarea&gt;' '=""><t>+</t></tab
                  ></tabs>
                </tabbar>

                <tabcontent tab=editor>
                  <page id=edit active>
                    <textarea id=textInput name=raw style="width: 100%;" rows=19>${rawContent.length ? html.escape(rawContent[0].content) : ''}</textarea>
                    <textarea id=originalContent style="display: none;">${rawContent.length ? html.escape(rawContent[0].content) : ''}</textarea>
                  </page>
                  <page id=preview>
                    <iframe id=previewFrame name=previewFrame style="width: 100%; height: 400px;">렌더링 중...</iframe>
                  </page>
                  <page id=diff>비교 표를 그리는 중...</page>
                </tabcontent>
              </tabframe>
            </tabpage>
					</div>
					
					<div class=form-group>
						<label>내 의견:</label><br />
						<textarea name=text class=form-control rows=5></textarea>
					</div>

					<div class="btns">
						<button id="createBtn" class="btn btn-info" style="width: 120px;">발제!</button>
					</div>
				</form>
			`;
			
			if(!islogin(req)) {
				content += `<p style="font-weight: bold; color: red;">로그인하지 않았습니다. 토론 댓글에 IP 주소를 영구히 기록하는 것에 동의하는 것으로 간주합니다.</p>`;
			}
			
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
		'beautiful',      'blue',      'red',
		'giantic',        'small',     'soft',
		'hard',           'difficult', 'fluffy',
		'cloudy',         'clear',     'green',
		'pale',           'closed',    'opened',
		'working',        'broken',    'written',
		'found',          'founded',   'sad',
		'happy',          'angry',     'orange',
		'unclassifiable', 'invalid',   'valid',
		'yellow',         'glossy',    'flat',
		'white',          'checked',   'unchecked',
		'marked',         'known',     'unknown',
		'rabid',          'rapid'
	];
	
	const nouns = [
		'computer', 'diskette', 'disk',     'cd',
		'dvd',      'mouse',    'rat',      'cat',
		'puppy',    'key',      'theme',    'syntax',
		'command',  'speaker',  'media',    'video',
		'music',    'song',     'window',   'hub',
		'balloon',  'air',      'network',  'navigator',
		'field',    'box',      'sound',    'smash',
		'railway',  'train',    'bus',      'car',
		'airplane', 'plane',    'keyboard', 'board',
		'cable',    'streak',   'ship',     'boat',
		'ufo',      'object',   'obstacle', 'cage',
		'rabbit',   'client',   'server'
	];
	
	// 경우의 수: 38 * 45 * 16^8 = 7,344,394,076,160가지
	var tnum = random.choice(adjectives) + '-' + random.choice(nouns) + '-' + rndval('abcdef0123456789', 8);
	
	while(1) {
		await curs.execute("select tnum from threads where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
		if(!curs.fetchall().length) break;
		tnum = random.choice(adjectives) + '-' + random.choice(nouns) + '-' + rndval('abcdef0123456789', 8);
	}
	
	if(req.body['type'] == 'edit_request') {
		if(!await getacl(req, title, 'edit_request')) {
			res.send(await showError(req, 'insufficient_privileges'));
			
			return;
		}
		
		const rev = req.body['baserev'];
		if(!rev) {
			return res.send(await showError('revision_not_specified'));
		}
		
		if(!req.body['raw']) {
			return res.send(await showError(req, 'invalid_request_body'));
		}
		
		var rawContent = await curs.execute("select content from history where title = ? and rev = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [title, rev, subwiki(req)]);
		if(!rawContent.length) {
			return res.send(await showError(req,'revision_not_found'));
		}
		
		await curs.execute("insert into threads (title, topic, status, time, tnum, type, ncontent, ocontent, baserev, subwikiid) values (?, ?, ?, ?, ?, 'edit_request', ?, ?, ?, ?)",
						[title, req.body['topic'], 'normal', getTime(), tnum, req.body['raw'], rawContent[0]['content'], rev, subwiki(req)]);
		
		await curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin, subwikiid) values \
						(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
						['1', req.body['text'], ip_check(req), getTime(), '0', '', '0', tnum, islogin(req) ? 'author' : 'ip', getperm(req, 'admin', ip_check(req)) || getperm(req, 'fake_admin', ip_check(req)) ? '1' : '0', subwiki(req)]);
	} else {
		if(!await getacl(req, title, 'create_thread')) {
			res.send(await showError(req, 'insufficient_privileges'));
			
			return;
		}
		
		const swi = (req.body['type'] && req.body['type'].toLowerCase() == 'global') ? 'global' : subwiki(req);
		
		await curs.execute("insert into threads (title, topic, status, time, tnum, subwikiid) values (?, ?, ?, ?, ?, ?)",
						[title, req.body['topic'], 'normal', getTime(), tnum, swi]);
		
		await curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin, subwikiid) values \
						(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
						['1', req.body['text'], ip_check(req), getTime(), '0', '', '0', tnum, islogin(req) ? 'author' : 'ip', getperm(req, 'admin', ip_check(req)) || getperm(req, 'fake_admin', ip_check(req)) ? '1' : '0', swi]);
	}
					
	res.redirect('/thread/' + tnum);
});
