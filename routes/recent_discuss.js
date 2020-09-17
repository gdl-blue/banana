wiki.get('/RecentDiscuss', async function recentDicsuss(req, res) {
	if(config.getString('disable_recentdiscuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	var logtype = req.query['logtype'];
	if(!logtype) logtype = 'all';
	
	var content = `
		<ol class="breadcrumb link-nav">
			<li><a href="?logtype=normal_thread">[최근 토론]</a></li>
			<li><a href="?logtype=old_thread">[오래된 토론]</a></li>
			<li><a href="?logtype=closed_thread">[닫힌 토론]</a></li>
		</ol>
		
		<table class="table table-hover">
			<colgroup>
				<col style="width: 100px;">
				<col style="width: 22%;">
				<col>
			</colgroup>
			<thead>
				<tr>
					<th>시간</th>
					<th>작성자</th>
					<th>토론</th>
				</tr>
			</thead>
			
			<tbody id>
	`;
	
	switch(logtype) {
		case 'normal_thread':
			await curs.execute("select title, topic, time, tnum from threads where status = 'normal' order by cast(time as integer) desc limit 120");
		break;case 'old_thread':
			await curs.execute("select title, topic, time, tnum from threads where status = 'normal' order by cast(time as integer) asc limit 120");
		break;case 'closed_thread':
			await curs.execute("select title, topic, time, tnum from threads where status = 'close' order by cast(time as integer) desc limit 120");
		break;default:
			await curs.execute("select title, topic, time, tnum from threads where status = 'normal' order by cast(time as integer) desc limit 120");
	}
	
	const trds = curs.fetchall();
	
	for(trd of trds) {
		await curs.execute("select topic from threads where deleted = '1' and tnum = ?", [trd['tnum']]);
		if((curs.fetchall().length) && !getperm('developer', ip_check(req))) {
			continue;
		}
		
		await curs.execute("select username, content, hidden, ismember from res where tnum = ? order by cast(id as integer) desc limit 1", [trd['tnum']]);
		const _0x123456 = curs.fetchall();
		
		var prv = '', un = '', im = 'author';
		
		if(_0x123456.length) {
			if(_0x123456[0]['content'].length > 80) prv = _0x123456[0]['content'].slice(0, 80) + '...';
			else prv = _0x123456[0]['content'];
			
			un = _0x123456[0]['username'];
			im = _0x123456[0]['ismember'];
			
			if(_0x123456[0]['hidden'] == '1') prv = '[숨겨진 글]';
		}
		
		content += `
			<tr>
				<td>
					${generateTime(toDate(trd['time']), 'H시 i분')}
				</td>
				
				<td>
					${ip_pas(un, im)}
				</td>
				
				<td>
					<a href="/thread/${trd['tnum']}">${html.escape(trd['topic'])}</a> (<a href="/discuss/${encodeURIComponent(trd['title'])}">${html.escape(trd['title'])}</a>)
				</td>
			</tr>
			
			<tr>
				<td colspan=3>
					${html.escape(prv)}
				</td>
			</tr>
		`;
	}
	
	content += `
			</tbody>
		</table>
	`;
	
	res.send(await render(req, "최근 토론", content, {}));
});