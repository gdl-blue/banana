wiki.get(/^\/w\/(.*)/, async function viewDocument(req, res) {
	const title = req.params[0];
	
	if(title.replace(/\s/g, '') == '') res.redirect('/w/' + config.getString('front_page'));
	
	var rawContent = await curs.execute("select content from documents where title = ?", [title]);
	
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
			res.status(403).send(await showError(req, 'insufficient_privileges_read'));
			
			return;
		} else {
			if(req.query['rev']) {
				rev = req.query['rev'];
				
				await curs.execute("select content from history where rev = ? and title = ?", [rev, title]);
				rawContent = curs.fetchall();
				
				if(!rawContent.length) {
					res.send(await showError(req, 'rev_not_found'));
					return;
				}
			}
			
			if(!rawContent.length) {
				throw Error("빠라빠라 빠라밤");
			}
			
			content = await JSnamumark(title, rawContent[0]['content'], 1);
			
			if(title.startsWith("사용자:")) {
				try {
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
						<span style="font-size: 14pt;">이 사용자는 차단되었습니다. 관리자에게 문의하십시오.</span><br />
						사유 내용
					</div>
				` + content;
			}
			
			if(title.startsWith("사용자:") && (getperm('admin', title.replace(/^사용자[:]/, '')) || getperm('bot', title.replace(/^사용자[:]/, '')) || getperm('fake_admin', title.replace(/^사용자[:]/, '')))) {
				content = `
					<div style="border-width: 5px 1px 1px; border-style: solid; border-color: orange gray gray; padding: 10px; margin-bottom: 10px;" onmouseover="this.style.borderTopColor=\'${getperm('admin', title.replace(/^사용자[:]/, '')) ? 'red' : 'blue'}\';" onmouseout="this.style.borderTopColor=\'orange\';">
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
			
			await curs.execute("select time from history where title = ? order by cast(rev as integer) desc limit 1", [title]);
			lstedt = Number(curs.fetchall()[0]['time']);
		}
	} catch(e) {
		end = 1;
		
		viewname = 'notfound';
		
		print(`[오류!] ${e.stack}`);
		
		httpstat = 404;
		content = `
			<h2>문서가 존재하지 않습니다. 새로 작성하려면 <a href="/edit/${encodeURIComponent(title)}">여기</a>를 클릭하십시오.</h2>
		`;
	}
	
	if(title.startsWith('사용자:')) isUserDoc = true;
	
	res.status(httpstat).send(await render(req, title, content, {
		star_count: (await curs.execute("select title from stars where title = ?", [title])).length,
		starred: ((await curs.execute("select title from stars where title = ? and username = ?", [title, ip_check(req)])).length ? true : false),
		date: lstedt,
		user: isUserDoc,
		category: [],
		discuss_progress: 0,
		rev: rev,
		st: 1
	}, _, error, viewname));
});