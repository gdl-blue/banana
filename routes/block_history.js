/*
'blockhistory': ['ismember', 'type', 'blocker', 'username', 'durationstring', 'startingdate', 'endingdate', 'al', 'blockview', 'fake', 'note']
'rb': ['block', 'end', 'today', 'blocker', 'why', 'band', 'ipacl'] 
*/

wiki.get('/BlockHistory', async function(req, res) {
	await curs.execute("select ismember, type, blocker, username, startingdate, endingdate, note from blockhistory order by cast(startingdate as integer) limit 100");
	
	var content = `
		<table class="table table-hover">
			<colgroup>
				<col style="width: 180px;">
				<col>
				<col>
				<col style="width: 180px;">
				<col style="width: 150px;">
			</colgroup>
			
			<thead>
				<tr>
					<th>날짜</th>
					<th>차단자</th>
					<th>피차단자</th>
					<th>만료일</th>
					<th>유형</th>
				</tr>
			</thead>
			
			<tbody>
	`;
	
	for(row of curs.fetchall()) {
		content += `
			<tr>
				<td>${generateTime(toDate(row.startingdate), timeFormat)}</td>
				<td>${ip_pas(row.blocker, 'author')}</td>
				<td>${row.username}</td>
				<td>${generateTime(toDate(row.endingdate), timeFormat)}</td>
				<td>${
					row.type == 'suspend' ? (
						'계정 차단'
					) : (
						row.type == 'unsuspend' ? (
							'계정 차단해제'
						) : (
							row.type == 'ipacl_add' ? (
								'IP 차단'
							) : (
								row.type == 'login_history' ? (
									'로그인 내역 조회'
								) : (
									row.type == 'grant' ? (
										'권한 부여'
									) : (
										row.type == 'ipacl_remove' ? (
											'IP 차단 해제'
										) : (
											'불분명'
										)
									)
								)
							)
						)
					)
				}</td>
			</tr>
			
			<tr>
				<td colspan=5>
					${row.note}
				</td>
			</tr>
		`;
	}
	
	content += `
			</tbody>
		</table>
	`;
	
	res.send(await render(req, '차단 기록', content, {}, _, _, 'blockhistory'));
});

wiki.get('/LegacyBlockHistory', async function(req, res) {
	await curs.execute("select block, end, today, blocker, why, band, ipacl from rb order by today desc limit 100");
	
	var content = `
		<ul class=wiki-list>
	`;
	
	for(row of curs.fetchall()) {
		content += `
			<li>
				${generateTime(toDate(row.today), timeFormat)}
				${ip_pas(row.blocker, 'author')}가
				${row.block}
				${
					row.end == 'lh' ? (
						'사용자의 로그인 내역 조회'
					) : (
						row.end == 'grant' ? (
							'사용자에게 권한 부여'
						) : (
							row.end == 'release' ? (
								row.ipacl == '1' ? (
									'IP 차단 해제'
								) : (
									'사용자 차단 해제'
								)
							) : (
								row.ipacl == '1' ? (
									'IP 차단'
								) : (
									'사용자 차단'
								)
							)
						)
					)
				}
				${
					!(isNaN(Number(row.end))) ? (
						row.end == '0' ? (
							'(영구)'
						) : (
							'(' + row.end + '초 동안)'
						)
					) : ''
				}
				"${row.why}"
			</li>
		`;
	}
	
	content += `
		</ul>
		
		${navbtn(0, 0, 0, 0)}
	`;
	
	res.send(await render(req, '이전 차단 내역', content));
});