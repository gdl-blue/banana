wiki.get(/\/complete\/(.*)/, (req, res) => {
	// 초성검색은 나중에
	const query = req.params[0];
	curs.execute("select title from documents where title like ? || '%' limit 10", [query])
	.then(data => {
		var ret = [];
		for(i of data) {
			ret.push(i['title']);
		}
		
		res.json(ret);
	})
	.catch(e => {
		print(e.stack);
		res.status(500).send('문제가 발생했습니다!');
	});
});

wiki.get(/\/go\/(.*)/, (req, res) => {
	const query = req.params[0];
	curs.execute("select title from documents where title = ? COLLATE NOCASE", [query])
	.then(data => {
		if(data.length) res.redirect('/w/' + data[0]['title']);
		else res.redirect('/search/' + query);
	})
	.catch(e => {
		print(e.stack);
		res.redirect('/search/' + query);
	});
});

wiki.get(/\/search\/(.*)/, async (req, res) => {
	const startTime = getTime();
	
	const query = req.params[0];
	const page  = atoi(req.query['page'] || '1') || 1;
	curs.execute("select title, content from documents where title like '%' || ? || '%' or content like '%' || ? || '%' order by title asc limit 20 COLLATE NOCASE", [query, query])
	.then(async data => {
		var navbar = `
			<ol class="breadcrumb link-nav">
				<li><a href="?logtype=all">[전체]</a></li>
				<li><a href="?logtype=title">[제목]</a></li>
				<li><a href="?logtype=content">[내용]</a></li>
				<li>&nbsp;</li>
				<li><a href="?namuspace=-">[모든 문서]</a></li>
				<li><a href="?namuspace=사용자">[사용자 문서]</a></li>
				<li><a href="?namuspace=파일">[파일]</a></li>
				<li>&nbsp;</li>
				<li><a href="?page=${page - 1}">&lt; 이전</a></li>
				<li><strong>${page}쪽</strong></li>
				<li><a href="?page=${page + 1}">다음 &gt;</a></li>
				<li>&nbsp;</li>
		`;
		
		var content = `
			<section class="search-section multicol-2">
		`;
		
		for(item of data) {
			if(!(await getacl(req, item.title, 'read'))) item.content = '[이 문서를 읽을 수 있는 권한이 없습니다.]';
			
			content += `
				<div class=search-item>
					<h4 class=item-title><a href="/w/${encodeURIComponent(item.title)}">${html.escape(item.title).replaceAll(html.escape(query), '<span class=search-highlight>' + html.escape(query) + '</span>')}</a></h4>
					<div class=item-content>
						${html.escape(item.content.slice(item.content.indexOf(query) - 80, 180)).replaceAll(html.escape(query), '<span class=search-highlight>' + html.escape(query) + '</span>')}
					</div>
				</div>
			`;
		}
		
		content += '</section>';
		
		const endTime = getTime();
		
		const processedTime = (endTime - startTime) / 1000;
		const count = (await curs.execute("select count(title) from documents where title like '%' || ? || '%' or content like '%' || ? || '%' COLLATE NOCASE", [query, query])).length;
	
		navbar += `
				<li>총 ${count}건</li>
				<li>-</li>
				<li>${processedTime}초 소요</li>
			</ol>
		`;
		
		content = navbar + content;
		
		res.send(await render(req, '검색결과 - ' + query, content, {}, _, _, 'search'));
	})
	.catch(async e => {
		res.send(await showError(req, 'search_failed'));
	});
});