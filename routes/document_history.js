wiki.get(/^\/history\/(.*)/, async function viewHistory(req, res) {
	if(config.getString('disable_history', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const title = req.params[0];
	const from = req.query['from'];
	const until = req.query['until'];
	const target = req.query['target'];
	const query = req.query['query'];
	
	if(!await getacl(req, title, 'read')) {
		res.send(await showError(req, 'insufficient_privileges_read'));
		
		return;
	}
	
	var content = '', dbdata;
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
	} else if(target && query) {
		content += '<p>처음 1,000개의 검색 결과입니다.</p>';
		
		switch(target.toLowerCase()) {
			case 'username':
				dbdata = await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and username = ? order by cast(rev as integer) desc limit 1000 COLLATE NOCASE",
						[title, query]);
			break; case 'count':
				if(isNaN(Number(query))) return res.send(await showError(req, 'invalid_value'));
				dbdata = await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and cast(changes as integer) = ? order by cast(rev as integer) desc limit 1000",
						[title, Number(query)]);
			break; case 'biggercount':
				if(isNaN(Number(query))) return res.send(await showError(req, 'invalid_value'));
				dbdata = await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and cast(changes as integer) > ? order by cast(rev as integer) desc limit 1000",
						[title, Number(query)]);
			break; case 'smallercount':
				if(isNaN(Number(query))) return res.send(await showError(req, 'invalid_value'));
				dbdata = await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and cast(changes as integer) < ? order by cast(rev as integer) desc limit 1000",
						[title, Number(query)]);
			break; case 'editrequest':
				dbdata = await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and iserq = '1' order by cast(rev as integer) desc limit 1000",
						[title]);
			break; case 'log':
				dbdata = await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and log like ? order by cast(rev as integer) desc limit 1000 COLLATE NOCASE",
						[title, query.replace('*', '%').replace('?', '_')]);
			break; case 'logmatch':
				dbdata = await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and log = ? order by cast(rev as integer) desc limit 1000 COLLATE NOCASE",
						[title, query.replace('*', '%').replace('?', '_')]);
			break; default:
				return res.send(await showError(req, 'invalid_value'));
		}
	} else {
		dbdata = await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? order by cast(rev as integer) desc limit 30",
						[title]);
	}
	
	if(!dbdata.length && !(target && query)) {
		res.send(await showError(req, 'document_not_found'));
		return;
	}
	
	var set = 0, lr, fr;
	
	content += `
		<form method=get>
			<label>필터:</label>
			<table>
				<colgroup>
					<col style="width: 150px;">
					<col>
					<col style="width: 100px;">
				</colgroup>
				
				<tr>
					<td style="padding: 0;">
						<select class="form-control" name=target>
							<option value=username>사용자</option>
							<option value=date hidden>날짜</option>
							<option value=beforedate hidden>날짜 이전</option>
							<option value=afterdate hidden>날짜 이후</option>
							<option value=count>글자 변경점</option>
							<option value=biggercount>변경점 초과</option>
							<option value=smallercount>변경점 미만</option>
							<option value=editrequest>편집요청</option>
							<option value=log>요약</option>
							<option value=logmatch>요약 완전일치</option>
						</select>
					</td>
					
					<td style="padding: 0 0 0 20px;">
						<input class="form-control" name=query />
					</td>
					
					<td style="padding: 0 0 0 20px;">
						<button type=submit class="btn btn-info">이동</button>
					</td>
				</tr>
			</table>
		</form>
	
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
		
		${target && query ? '' : (navbtn('/history/' + encodeURIComponent(title), lr, fr))}
	`;
	
	res.send(await render(req, title, content, {
		st: 7
	}, '의 역사', error = false, viewname = 'history'));
});