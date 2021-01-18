wiki.get(/^\/w\/(.*)/, async function viewDocument(req, res) {
	const title = req.params[0];
	
	if(title.replace(/\s/g, '') == '') res.redirect('/w/' + config.getString('front_page'));
	
	var rawContent = await curs.execute("select content from documents where title = ? and ((title like '사용자:%') or (subwikiid = ? and not title like '사용자:%'))", [title, (title.startsWith('사용자:') ? '' : subwiki(req))]);
	
	var content = '';
	
	var httpstat = 200;
	var viewname = 'wiki';
	var error = false;
	
	var isUserDoc = false;
	
	var lstedt = undefined;
	
	var rev = undefined;
	
	var end = 0;
	
	try {
		if(!await getacl(req, title, 'read')) {
			httpstat = 403;
			error = true;
			content = `<h2>이 문서를 읽을 수 있는 권한이 없습니다. 관리자에게 문의하십시오.</h2>`;
		} else {
			if(req.query['rev']) {
				rev = req.query['rev'];
				
				rawContent = await curs.execute("select content from history where rev = ? and title = ? and ((title like '사용자:%') or (subwikiid = ? and not title like '사용자:%'))", [rev, title, (title.startsWith('사용자:') ? '' : subwiki(req))]);
				
				if(!rawContent.length) {
					res.send(await showError(req, 'rev_not_found'));
					return;
				}
			}
			
			if(!rawContent.length) {
				throw Error("문서 없음");
				return;
			}
			
			const contnt = rawContent[0]['content'].replace(/\r\n/g, '\n').replace(/\r/g, '\n');
			if(contnt.startsWith('#redirect ')) {
				const ntitle = contnt.split('\n')[0].replace('#redirect ', '');
				
				if(req.query['noredirect'] != '1' && !req.query['from']) {
					return res.redirect('/w/' + encodeURIComponent(ntitle) + '?from=' + title);
				} else {
					content = '[이 문서는 <a href="/w/' + encodeURIComponent(ntitle) + '">' + html.escape(ntitle) + '</a>(으)로 넘겨주기 처리되어 있습니다.]';
				}
			} else
			
			content = await JSnamumark(title, rawContent[0]['content'], req.query['rev'] ? 0 : 1, req.query['rev'] ? null : req);
			
			content = '<div class=wiki-inner-content>' + content + '</div>';
			
			if(title.startsWith('파일')) {
				content = `
					<img src="/file/${(title.replace(/^파일[:]/, ''))}" />
				` + content;
			}
			
			if(title.startsWith("사용자:")) {
				try {
					// 이 기능은 그냥 없어도 될 듯
					throw 1;
					
					const trb = await curs.execute("select tribe from users where username = ?", [title.replace(/^사용자[:]/, '')]);
					const tdp = (await curs.execute("select alias from tribes where id = ?", [trb[0]['tribe']]))[0]['alias'];
					
					if(trb[0]['tribe'] != '0') {
						content = `
							<div style="border-width: 5px 1px 1px; border-style: solid; border-color: rgb(170, 215, 255) gray gray; padding: 10px; margin-bottom: 10px;" onmouseover="this.style.borderTopColor=\'#00C8C8\';" onmouseout="this.style.borderTopColor=\'rgb(170, 215, 255)\';">
								<span style="font-size: 14pt;">이 사용자는 ${tdp}족 입니다.</span><br />
							</div>
						` + content;
					}
				} catch(e) {}
			}
			
			if(title.startsWith("사용자:") && await ban_check(req, 'author', title.replace(/^사용자[:]/, ''))) {
				content = `
					<div style="border-width: 5px 1px 1px; border-style: solid; border-color: crimson gray gray; padding: 10px; margin-bottom: 10px;" onmouseover="this.style.borderTopColor=\'darkred\';" onmouseout="this.style.borderTopColor=\'crimson\';">
						<span style="font-size: 14pt;">차단된 사용자입니다. 관리자에게 문의하십시오.</span><br />
						사유 내용
					</div>
				` + content;
			}
			
			if(title.startsWith("사용자:") && (getperm(req, 'admin', title.replace(/^사용자[:]/, '')) || getperm(req, 'bot', title.replace(/^사용자[:]/, '')) || getperm(req, 'fake_admin', title.replace(/^사용자[:]/, '')))) {
				content = `
					<div style="border-width: 5px 1px 1px; border-style: solid; border-color: orange gray gray; padding: 10px; margin-bottom: 10px;" onmouseover="this.style.borderTopColor=\'${getperm(req, 'admin', title.replace(/^사용자[:]/, '')) ? 'red' : 'blue'}\';" onmouseout="this.style.borderTopColor=\'orange\';">
						<span style="font-size: 14pt;">이 사용자는 특수 권한을 가지고 있습니다.</span>
					</div>
				` + content;
			}
			
			if(rev) {
				content = `
					<form method=get>
						<div class=form-group>
							<label>리비전:</label><br />
							<input type=number name=rev class=form-control value="${rev}" />
						</div>
						
						<div class=btns>
							<a class="btn btn-secondary" href="/w/${encodeURIComponent(title)}?rev=1">&lt;&lt;</a>
							<a class="btn btn-secondary ${rev == '1' ? 'disabled' : ''}" ${rev == '1' ? 'disabled' : ''} href="/w/${encodeURIComponent(title)}?rev=${atoi(rev) - 1}">&lt; ${rev == '1' ? '' : atoi(rev) - 1}</a>
							<button type=submit class="btn btn-info">이동</button>
							<a class="btn btn-secondary" href="/w/${encodeURIComponent(title)}?rev=${atoi(rev) + 1}">${atoi(rev) + 1} &gt;</a>
							<a class="btn btn-secondary" href="/w/${encodeURIComponent(title)}">&gt;&gt;</a>
						</div>
					</form>
				` + content;
			}
			
			if(req.query['from']) {
				content = alertBalloon('[알림]', req.query['from'] + ' 문서에서 이 문서로 넘어왔습니다.', 'info') + content;
			}
			
			await curs.execute("select time from history where title = ? and ((title like '사용자:%') or (subwikiid = ? and not title like '사용자:%')) order by cast(rev as integer) desc limit 1", [title, (title.startsWith('사용자:') ? '' : subwiki(req))]);
			lstedt = Number(curs.fetchall()[0]['time']);
		}
	} catch(e) {
		end = 1;
		
		viewname = 'notfound';
		
		print(`[오류!] ${e.stack}`);
		
		httpstat = 404;
		content = `
			<p>문서가 존재하지 않습니다.
			
			<ul class=wiki-list>
				<li><a href="/edit/${encodeURIComponent(title)}">[새로 작성하기]</a></li>
				<li><a href="/history/${encodeURIComponent(title)}">[역사 조회]</a></li>
			</ul>
		`;
	}
	
	if(title.startsWith('사용자:')) isUserDoc = true;
	
	res.status(httpstat).send(await render(req, title, content, {
		star_count: (await curs.execute("select title from stars where title = ? and ((title like '사용자:%') or (subwikiid = ? and not title like '사용자:%'))", [title, (title.startsWith('사용자:') ? '' : subwiki(req))])).length,
		starred: ((await curs.execute("select title from stars where title = ? and username = ? and ((title like '사용자:%') or (subwikiid = ? and not title like '사용자:%'))", [title, ip_check(req), (title.startsWith('사용자:') ? '' : subwiki(req))])).length ? true : false),
		date: lstedt,
		user: isUserDoc,
		category: [],
		discuss_progress: (await curs.execute("select topic from threads where title = ? and ((title like '사용자:%') or (subwikiid = ? and not title like '사용자:%')) and status = 'normal'", [title, (title.startsWith('사용자:') ? '' : subwiki(req))])).length,
		rev: rev,
		st: 1
	}, _, error, viewname));
});