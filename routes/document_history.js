wiki.get(/^\/history\/(.*)/, async function viewHistory(req, res) {
	if(config.getString('disable_history', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const title = req.params[0];
	const from = req.query['from'];
	const until = req.query['until'];
	
	if(!await getacl(req, title, 'read')) {
		res.send(await showError(req, 'insufficient_privileges_read'));
		
		return;
	}
	
	if(from) { // 더시드에서 from이 더 우선임
		await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and (cast(rev as integer) <= ? AND cast(rev as integer) > ?) \
						order by cast(rev as integer) desc",
						[title, Number(from), Number(from) - 30]);
	} else if(until) {
		await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and (cast(rev as integer) >= ? AND cast(rev as integer) < ?) \
						order by cast(rev as integer) desc",
						[title, Number(until), Number(until) + 30]);
	} else {
		await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? order by cast(rev as integer) desc limit 30",
						[title]);
	}
	
	if(!curs.fetchall().length) res.send(await showError(req, 'document_dont_exists'));
	
	const navbtns = navbtn(0, 0, 0, 0);
	
	var content = `
		<table class="table table-hover">
			<thead>
				<tr>
					<td>
						<strong>버전</strong>
					</td>
					
					<td>
						<strong>수정자</strong>
					</td>
					
					<td>
						<strong>시간</strong>
					</td>
				</tr>
			</thead>
			
			<tbody id>
	`;
	
	for(row of curs.fetchall()) {
		content += `
				<tr>
					<td>
						<strong>r${row['rev']}</strong> | <a rel=nofollow href="/w/${encodeURIComponent(title)}?rev=${row['rev']}">읽기</a> |
							<a rel=nofollow href="/raw/${encodeURIComponent(title)}?rev=${row['rev']}">날내용</a> |
							<a rel=nofollow href="/revert/${encodeURIComponent(title)}?rev=${row['rev']}">여기로 되돌리기</a>${
								Number(row['rev']) > 1
								? ' | <a rel=nofollow href="/diff/' + encodeURIComponent(title) + '?rev=' + row['rev'] + '&oldrev=' + String(Number(row['rev']) - 1) + '">비교하기</a>'
								: ''
							}
							
							(<span style="color: ${
								(
									Number(row['changes']) > 0
									? 'green'
									: (
										Number(row['changes']) < 0
										? 'red'
										: 'gray'
									)
								)
								
							};">${row['changes']}</span>)
					</td>
					
					<td>
						${ip_pas(row['username'], row['ismember'])}
					</td>
					
					<td>
						${generateTime(toDate(row['time']), timeFormat)} 
					</td>
				</tr>
		`;
		
		if(row['log'].length > 0 || row['advance'].length > 0) {
			content += `
				<td colspan="3" style="padding-left: 1.5rem;">
					${row['log']} <i>${row['advance']}</i>
				</td>
			`;
		}
	}
	
	content += `
			</tbody>
		</table>
		
		${navbtns}
	`;
	
	res.send(await render(req, title, content, _, '의 역사', error = false, viewname = 'history'));
});