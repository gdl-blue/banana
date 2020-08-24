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
	if(!islogin(req)) return res.redirect('/member/login?redirect=' + encodeURIComponent('/member/star/' + title));
	
	// 'stars': ['title', 'username', 'lastedit', 'category']
	// 'star_categories': ['name', 'username']
	
	var content = '';
	
	var dbdata = await curs.execute("select name from star_categories where username = ?", [ip_check(req)]);
	dbdata.concat([{ name: '분류되지 않은 문서' }]);
	for(cate of dbdata) {
		content += '<h2 class=wiki-heading>' + cate['name'] + '</h2> <div class=wiki-heading-content><ul class=wiki-list>';
		
		for(doc of (await curs.execute("select title, lastedit from stars where username = ? and category = ?", [ip_check(req), cate['name']]))) {
			content += `
				<li>${generateTime(toDate(doc.lastedit), timeFormat)}에 수정 - <a href="${encodeURIComponent(doc.title)}">${html.escape(doc.title)}</a></li>
			`;
		}
		
		content += '</ul></div>';
	}

	res.send(await render(req, '주시문서 목록', content));
});
