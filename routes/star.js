wiki.get(/\/member\/star\/(.*)/, async (req, res) => {
	const title = req.params[0];
	if(!islogin(req)) return res.redirect('/member/login?redirect=' + encodeURIComponent('/member/star/' + title));
	
	// 'stars': ['title', 'username', 'lastedit', 'category']
	// 'star_categories': ['name', 'username']
	
	var dbdata = await curs.execute("select title from stars where username = ? and title = ?", [ip_check(req), title]);
	if(dbdata.length) {
		return res.send(await showError(req, 'already_starred'));
	}
	
	var dbdata = await curs.execute("select time from history where title = ? order by cast(rev as integer) desc limit 1", [title]);
	if(!dbdata.length) {
		return res.send(await showError(req, 'document_not_found'));
	}
	
	await curs.execute('insert into stars (title, username, lastedit, category) values (?, ?, ?, ?)', [title, ip_check(req), dbdata[0]['time'], '분류되지 않은 문서']);

	res.redirect('/w/' + encodeURIComponent(title));
});

wiki.get(/\/member\/unstar\/(.*)/, async (req, res) => {
	const title = req.params[0];
	if(!islogin(req)) return res.redirect('/member/login?redirect=' + encodeURIComponent('/member/star/' + title));
	
	// 'stars': ['title', 'username', 'lastedit', 'category']
	// 'star_categories': ['name', 'username']
	
	var dbdata = await curs.execute("select title from stars where username = ? and title = ?", [ip_check(req), title]);
	if(!dbdata.length) {
		return res.send(await showError(req, 'not_starred'));
	}
	
	/*
	var dbdata = await curs.execute("select time from history where title = ? order by cast(rev as integer) desc limit 1", [title]);
	if(!dbdata.length) {
		return res.send(await showError(req, 'document_not_found'));
	}
	*/
	
	await curs.execute('delete from stars where title = ? and username = ?', [title, ip_check(req)]);

	res.redirect('/w/' + encodeURIComponent(title));
});


wiki.get('/member/starred_documents', async (req, res) => {
	if(!islogin(req)) return res.redirect('/member/login?redirect=' + encodeURIComponent('/member/starred_documents'));
	
	// 'stars': ['title', 'username', 'lastedit', 'category']
	// 'star_categories': ['name', 'username']
	
	var content = '';
	var navbar = `
		<ol class="breadcrumb link-nav">
			<li><a href="/member/starred_documents/categories">[분류 관리]</a></li>
			<li><a href="/member/starred_documents">[전체]</a></li>
	`;
	
	var dbdata = await curs.execute("select name from star_categories where username = ?", [ip_check(req)]);
	dbdata.push({ name: '분류되지 않은 문서' });
	
	for(cate of dbdata) {
		navbar += '<li><a href="/member/starred_documents?category=' + encodeURIComponent(cate.name) + '">[' + html.escape(cate.name) + ']</a></li>';
		
		if(req.query['category'] && cate.name != req.query['category']) continue;
		
		content += '<h2 class=wiki-heading>' + cate['name'] + '</h2> <div class=wiki-heading-content><ul class=wiki-list>';
		
		for(doc of (await curs.execute("select title, lastedit from stars where username = ? and category = ? order by cast(lastedit as integer) desc", [ip_check(req), cate['name']]))) {
			content += `
				<li>
					${generateTime(toDate(doc.lastedit), 'm월 d일 h시 i분')}에 수정됨 - <a href="${encodeURIComponent(doc.title)}">${html.escape(doc.title)}</a>
					<a href="/member/starred_documents/categorize?document=${encodeURIComponent(doc.title)}"> [분류 변경]</a>
					<a href="/member/unstar/${encodeURIComponent(doc.title)}"> [주시 해제]</a>
					<a href="/history/${encodeURIComponent(doc.title)}"> [역사]</a>
				</li>
			`;
		}
		
		content += '</ul></div>';
	}
	
	navbar += '</ol>';

	res.send(await render(req, '주시문서 목록', navbar + content));
});

wiki.get('/member/starred_documents/categories', async (req, res) => {
	if(!islogin(req)) return res.redirect('/member/login?redirect=' + encodeURIComponent('/member/starred_documents'));
	
	// 간단히 정보만 쓰면 HTML 만들어주는 마법사 하나 만들까..
	var content = `
		<form method=post class=settings-section>
			<div class=form-group>
				<label>분류 이름:</label><br>
				<input type=text class=form-control name=category id=categoryInput>
			</div>
			
			<div class=btns>
				<button type=submit class="btn btn-info" style="width: 100px;">추가</button>
			</div>
		</form>
		
		<table class=table>
			<colgroup>
				<col>
				<col style="width: 80px;">
			</colgroup>
			
			<thead>
				<tr>
					<th>이름</th>
					<th>삭제</th>
				</tr>
			</thead>
			
			<tbody>
	`;
	
	var dbdata = await curs.execute("select name from star_categories where username = ?", [ip_check(req)]);
	
	for(cate of dbdata) {
		content += `
			<tr>
				<td>${html.escape(cate.name)}</td>
				<td>
					<form method=post onsubmit="return confirm('분류 안의 문서들까지 지워집니다.');">
						<input type=hidden name=category value="${html.escape(cate.name)}">
						<input type=hidden name=submittype value=delete>
						<button type=submit class="btn btn-danger btn-sm">삭제</button>
					</form>
				</td>
			</tr>
		`;
	}
	
	content += '</tbody></table>';
	
	res.send(await render(req, '분류 관리', content));
});

wiki.post('/member/starred_documents/categories', async (req, res) => {
	if(!islogin(req)) return res.redirect('/member/login?redirect=' + encodeURIComponent('/member/starred_documents'));
	
	if(req.body['category'].replace(/^\s{0,}/, '').replace(/\s{0,}$/, '') == '분류되지 않은 문서') {
		return res.send(await showError(req, 'invalid_category_name'));
	}
	
	if(req.body['submittype'] == 'delete') {
		await curs.execute("delete from star_categories where username = ? and name = ?", [ip_check(req), req.body['category']]);
		await curs.execute("delete from stars where username = ? and category = ?", [ip_check(req), req.body['category']]);
	} else {
		if((await curs.execute("select name from star_categories where username = ? and name = ?", [ip_check(req), req.body['category']])).length) {
			return res.send(await showError(req, 'category_exists'));
		}
		if((await curs.execute("select name from star_categories where username = ?", [ip_check(req)])).length > 120) {
			return res.send(await showError(req, 'category_overflow'));
		}
		
		await curs.execute("insert into star_categories (name, username) values (?, ?)", [req.body['category'], ip_check(req)]);
	}
	
	res.redirect('/member/starred_documents/categories');
});

wiki.get('/member/starred_documents/categorize', async (req, res) => {
	if(!islogin(req)) return res.redirect('/member/login?redirect=' + encodeURIComponent('/member/starred_documents'));
	
	const title = req.query['document'];
	if(!title) return res.send(await showError(req, 'invalid_body'));  // body는 아님
	
	var options = '';
	
	var dbdata = await curs.execute("select name from star_categories where username = ?", [ip_check(req)]);
	dbdata.push({ name: '분류되지 않은 문서' });
	
	for(cate of dbdata) {
		options += '<option>' + cate.name + '</option>';
	}
	
	res.send(await render(req, '문서 분류 변경', `
		<form method=post class=settings-section>
			<div class=form-group>
				<label>분류 이름:</label><br>
				<select size=10 class=form-control id=categorySelect name=category>
					${options}
				</select>
			</div>
			
			<div class=btns>
				<button type=submit class="btn btn-info" style="width: 100px;">확인</button>
			</div>
		</form>
	`));
});

wiki.post('/member/starred_documents/categorize', async (req, res) => {
	if(!islogin(req)) return res.redirect('/member/login?redirect=' + encodeURIComponent('/member/starred_documents'));
	
	const title    = req.query['document'];
	const category = req.body['category'];
	if(!title || !category) return res.send(await showError(req, 'invalid_body'));  // body는 아님
	
	if(!(await curs.execute("select name from star_categories where username = ? and name = ?", [ip_check(req), category])).length) {
		if(!(await curs.execute("select name from star_categories where username = ?", [ip_check(req)])).length > 120) {
			await curs.execute("insert into star_categories (name, username) values (?, ?)", [category, ip_check(req)]);
		}
	}
	
	await curs.execute("update stars set category = ? where username = ? and title = ?", [category, ip_check(req), title]);
	
	res.redirect('/member/starred_documents');
});
