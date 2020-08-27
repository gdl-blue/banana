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
	var dbdata;
	if(from) {
		dbdata = await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and (cast(rev as integer) <= ? AND cast(rev as integer) > ?) \
						order by cast(rev as integer) desc",
						[title, Number(from), Number(from) - 30]);
	} else if(until) {
		dbdata = await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and (cast(rev as integer) >= ? AND cast(rev as integer) < ?) \
						order by cast(rev as integer) desc",
						[title, Number(until), Number(until) + 30]);
	} else {
		dbdata = await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? order by cast(rev as integer) desc limit 30",
						[title]);
	}
	
	if(!dbdata.length) {
		res.send(await showError(req, 'document_not_found'));
		return;
	}
	
	var set = 0, lr, fr;
	
	var content = `
		<table class="table table-hover">
			<thead>
				<tr>
					<th>
						시간
					</th>
					
					<th>
						수정자
					</th>
					
					<th>
						버전
					</th>
				</tr>
			</thead>
			
			<tbody id>
	`;
	
	var trlist = '';
	
	for(row of dbdata) {
		if(!set) { fr = row.rev; set = 1 }
		lr = row.rev;
		
		var data = `
				<tr>
					<td>
						${generateTime(toDate(row['time']), timeFormat)} 
					</td>
					
					<td>
						${ip_pas(row['username'], row['ismember'])}
					</td>
					
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
				</tr>
		`;
		
		try {
			if(row['log'].length > 0 || row['advance'].length > 0) {
				data += `
					<td colspan="3" style="padding-left: 1.5rem;">
						${row['log']} <i>${row['advance']}</i>
					</td>
				`;
			}
		} catch(e) {}
		
		trlist += data;
	}
	
	content += `
				${trlist}
			</tbody>
		</table>
		
		${navbtn('/history/' + encodeURIComponent(title), lr, fr)}
	`;
	
	res.send(await render(req, title, content, {
		st: 7
	}, '의 역사', error = false, viewname = 'history'));
});