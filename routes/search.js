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
  
  var flags = '';
  var flarr = [];
  var from = req.query['from'], until = req.query['until'];
  var namespace = req.query['namespace'];
  if(from) {
    flarr = [from];
    flags = ' and title >= ?';
  }
  else if(until) {
    flarr = [until];
    flags = ' and title < ?';
  }
  if(namespace && namespace !== '-') {
    flarr = flarr.concat([namespace]);
    flags = " and title like ? || ':%'";
  }
  
	curs.execute("select title, content from documents where (title like '%' || ? || '%' or content like '%' || ? || '%') " + flags + " order by title asc limit 20 COLLATE NOCASE", [query, query].concat(flarr))
	.then(async data => {
		var content = `
			<section class="search-section multicol-2">
		`;
    
    var chk = 0;
    var first = '';
    var last = '';
    
    var count = 0;
    
    try {
      first = data[0]['title'];
    } catch(e) {}
		
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
      chk = 1;
      last = item.title;
      count++;
		}
    
    if(!chk) {
      content += '찾은 문서가 없습니다.';
    }
		
		content += '</section>';
		
		const endTime = getTime();
		
		const processedTime = (endTime - startTime) / 1000;
		
		content = `
			<ol class="breadcrumb link-nav">
				<li><a href="?logtype=all">[전체]</a></li>
				<li><a href="?logtype=title">[제목]</a></li>
				<li><a href="?logtype=content">[내용]</a></li>
				<li>&nbsp;</li>
				<li><a href="?namespace=-">[모든 문서]</a></li>
				<li><a href="?namespace=사용자">[사용자 문서]</a></li>
				<li><a href="?namespace=파일">[파일]</a></li>
				<li>&nbsp;</li>
				<li><a href="?until=${encodeURIComponent(first)}">&lt; 앞쪽</a></li>
				<li><a href="?from=${encodeURIComponent(last)}">뒤쪽 &gt;</a></li>
				<li>&nbsp;</li>
				<li><a href="/w/${encodeURIComponent(query)}">[문서로]</a></li>
				<li>&nbsp;</li>
        <li>총 ${count}건</li>
				<li>-</li>
				<li>${processedTime}초 소요</li>
			</ol>
		` + content;
		
		res.send(await render(req, '키워드 `' + query + '`로 찾은 문서', content, {}, _, _, 'search'));
	})
	.catch(async e => {
		res.send(await showError(req, 'search_failed'));
	});
});