wiki.get('/EditRanking', async function editRankingView(req, res) {
	await curs.execute("select count(username), ismember, username from history where not title like '사용자:%' and (advance = '' or advance = '(새 문서)') order by count(username) desc limit 100");
	
	var content = `
		<p>편집 순위 (사용자 문서 편집 제외)
	
		<ol class=wiki-list>
	`;
	
	for(usr of curs.fetchall()) {
		await curs.execute("select value from user_settings where key = 'exclude_from_ranking' and username = ?", [usr['username']]);
		const data = curs.fetchall();
		
		if(data.length && data[0]['value'] == '1') {
			content += `
				<li>(숨겨진 사용자)</li>
			`;
		}
		
		content += `
			<li><a href="${usr['ismember'] == 'author' ? '/w/' + encodeURIComponent('사용자:' + usr['username']) : '/contribution/ip/' + encodeURIComponent(usr['username']) + '/document'}" style="${usr['ismember'] == 'author' ? 'font-weight: bold;' : ''}">${usr['username']}</a> (${usr['count(username)']}회)</li>
		`
	}
	
	res.send(await render(req, '편집 순위', content));
});