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
	
	var dbdata = await curs.execute("select time from history where title = ? order by cast(rev as integer) desc limit 1", [title]);
	if(!dbdata.length) {
		return res.send(await showError(req, 'document_not_found'));
	}
	
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
	`;
	
	var dbdata = await curs.execute("select name from star_categories where username = ?", [ip_check(req)]);
	dbdata.push({ name: '분류되지 않은 문서' });
	
	for(cate of dbdata) {
		content += '<h2 class=wiki-heading>' + cate['name'] + '</h2> <div class=wiki-heading-content><ul class=wiki-list>';
		
		navbar += '<li><a href="/member/starred_documents?category=' + encodeURIComponent(cate.name) + '">[' + html.escape(cate.name) + ']</a></li>';
		
		for(doc of (await curs.execute("select title, lastedit from stars where username = ? and category = ?", [ip_check(req), cate['name']]))) {
			content += `
				<li>
					${generateTime(toDate(doc.lastedit), 'm월 d일 h시 i분')}에 수정됨 - <a href="${encodeURIComponent(doc.title)}">${html.escape(doc.title)}</a>
					<a href="/member/starred_documents/categorize?document=${encodeURIComponent(doc.title)}"> [분류 이동]</a>
					<a href="/member/starred_documents/remove?document=${encodeURIComponent(doc.title)}"> [제거]</a>
				</li>
			`;
		}
		
		content += '</ul></div>';
	}
	
	navbar += '</ol>';

	res.send(await render(req, '주시문서 목록', navbar + content));
});
