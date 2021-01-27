wiki.get('/RecentChanges', async(req, res) => {
	if(config.getString('disable_recentchanges', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	var flag = req.query['logtype'];
	if(!flag) flag = 'all';
	
	switch(flag) {
		case 'create':
			await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where (edittype = 'create' or advance like '(문서 생성)' or advance like '<i>(새 문서)</i>') order by cast(time as integer) desc limit 100");
		break;case 'delete':
			await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where (edittype = 'create' advance like '(삭제)' or advance like '<i>(삭제)</i>') order by cast(time as integer) desc limit 100");
		break;case 'move':
			await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where (edittype = 'create' advance like '(%제목 변경)' or advance like '<i>(%이동)</i>') order by cast(time as integer) desc limit 100");
		break;case 'revert':
			await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where (edittype = 'create' advance like '(%복원)' or advance like '<i>(%로 되돌림)</i>') order by cast(time as integer) desc limit 100");
		break;case 'modify':
			await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where not title like '사용자:%' and (advance = '' or edittype = 'modify') order by cast(time as integer) desc limit 100");
		break;default:
			await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where not title like '사용자:%' order by cast(time as integer) desc limit 100");
	}
	
	var content = `
		<div class=control-panel>
		  <div class=settings-section>
			<table>
			  <tr>
				<td style="vertical-align: top;">
				  <h4 style="margin: 0; color: white;">실시간 갱신</h4>

				  <table>
					<tr>
					  <td colspan=2>
						<label>갱신 주기 (초):</label><br />
						<input type=text id=intervalInput value=3 />
					  </td>
					</tr>

					<tr>
					  <td>
						<button id=refreshNow>지금 갱신</button>
					  </td>

					  <td>
						<label style="margin: 0 0 0 5px;">
						  <input type=checkbox id=refreshing />
						  <span class=checkbox></span>
						  자동 갱신
						</label>
					  </td>
					</tr>
				  </table>
				</td>

				<td style="vertical-align: top;">
				  <h4 style="margin: 0; color: white;">필터 [미구현]</h4>

				  <form method=get>
					<table>
					  <colgroup>
						<col style="width: 150px;">
						<col>
					  </colgroup>

					  <tr style="width: auto;">
						<td style="padding: 0;">
						  <select style="width: 100%;" name=target>
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

						<td>
						  <input style="width: 100%;" type=text name=query />
						</td>
					  </tr>
					</table>

					<div>
					  <button type=submit style="float: right;">이동</button>
					</div>
				  </form>
				</td>
			  </tr>
			</table>
		  </div>
		</div>

		<ol class="breadcrumb link-nav">
			<li><a href="?logtype=all">[전체 내역]</a></li>
			<li><a href="?logtype=modify">[일반 편집]</a></li>
			<li><a href="?logtype=create">[새로 작성]</a></li>
			<li><a href="?logtype=delete">[문서 지움]</a></li>
			<li><a href="?logtype=move">[제목변경]</a></li>
			<li><a href="?logtype=revert">[되돌림]</a></li>
		</ol>
	`;
	
	var tabledata = `
		<table class="table table-hover">
			<colgroup>
				<col style="width: 100px;">
				<col style="width: 22%;">
				<col>
			</colgroup>
			
			<thead id>
				<tr>
					<th>시간</th>
					<th>이름</th>
					<th>문서</th>
				</tr>
			</thead>
			
			<tbody id>
	`;
	
	for(row of curs.fetchall()) {
		tabledata += `
				<tr${(row['log'].length > 0 || row['advance'].length > 0 ? ' class=no-line' : '')}>
					<td>
						${generateTime(toDate(row['time']), 'H시 i분')}
					</td>
					
					<td>
						${ip_pas(req, row['username'], row['ismember'])}
					</td>
					
					<td>
						<strong>r${row['rev']}</strong> <a href="/w/${encodeURIComponent(row['title'])}">${html.escape(row['title'])}</a> 
						( <a href="/history/${encodeURIComponent(row['title'])}">역사</a> 
						${
								Number(row['rev']) > 1
								? ' | <a \href="/diff/' + encodeURIComponent(row['title']) + '?rev=' + row['rev'] + '&oldrev=' + String(Number(row['rev']) - 1) + '">비교</a>'
								: ''
						} 
						| <a href="/revert/${encodeURIComponent(row['title'])}?rev=${atoi(row['rev']) - 1}">롤백</a>
						| <a href="/edit/${encodeURIComponent(row['title'])}">편집</a> )
						
						[<span style="color: ${
							(
								Number(row['changes']) > 0
								? 'green'
								: (
									Number(row['changes']) < 0
									? 'red'
									: 'gray'
								)
							)
							
						}; ${Math.abs(Number(row['changes'])) >= 1000 ? 'font-weight: bold;' : ''}">${row['changes']}</span>]
					</td>
				</tr>
		`;
		
		if(row['log'].length > 0 || row['advance'].length > 0) {
			tabledata += `
				<td colspan="3" style="padding-left: 1.5rem;">
					${row['log']} <i>${row['advance']}</i>
				</td>
			`;
		}
	}
	
	tabledata += `
			</tbody>
		</table>
	`;
	
	if(req.query['tableonly'] == '1') return res.send(tabledata);
	
	res.send(await render(req, '최근 문서 편집', content + tabledata, {}, _, _, 'recent'));
});
