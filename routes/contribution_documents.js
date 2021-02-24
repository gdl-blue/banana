wiki.get(/^\/contribution\/(ip|author)\/(.*)\/document$/, async function documentContribution(req, res) {
	if(config.getString('disable_contribution_list', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const ismember = req.params[0];
	const username = req.params[1];
	
	if(ismember == 'ip' && config.getString('ip2md5', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	var flag = '';
	
	switch(req.query['logtype']) {
		case 'create':
			flag = " and (advance = '(새 문서)' or advance = '<i>(새 문서)</i>' or advance = '(문서 생성)')";
		break; case 'revert':
			flag = " and (advance = '(%되돌림)' or advance = '<i>(%되돌림)</i>')";
	}
	
	var dbdata = await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
				where ismember = ? and username = ? " + flag + " and ((title like '사용자:%') or (subwikiid = ? and not title like '사용자:%')) order by cast(time as integer) desc limit 2400", [
					ismember, username, subwiki(req)
				]);
	
//			<li><a href="/contribution/${ismember}/${username}/document">[문서]</a></li>
//			<li><a href="/contribution/${ismember}/${username}/discuss">[토론]</a></li>
	
	var content = `
    <p>최근 2,400개의 기여 목록입니다.

		<div>
			<ol class="breadcrumb link-nav blue">
				<li><strong>[문서 편집]</strong></li>
				<li><a href="/contribution/${ismember}/${username}/discuss">[토론 참여]</a></li>
				<li><a href="/contribution/${ismember}/${username}/requests">[편집 요청 생성]</a></li>
				<li><a href="/contribution/${ismember}/${username}/accept">[편집 요청 승인]</a></li>
				<li><a href="/contribution/${ismember}/${username}/reject">[편집 요청 거절]</a></li>
				<li>&nbsp;</li>
				<li><a href="?logtype=create">[새 문서]</a></li>
				<li><a href="?logtype=revert">[되돌림]</a></li>
			</ol>
		</div>
		
		<table class="table table-hover">
			<colgroup>
				<col style="width: 240px;">
				<col style="width: 25%;">
				<col>
			</colgroup>
			
			<thead id>
				<tr>
					<th>시간</th>
					<th>수정자</th>
					<th>문서명</th>
				</tr>
			</thead>
			
			<tbody id>
	`;
	
	for(var row of dbdata) {
		content += `
				<tr${(row['log'].length > 0 || row['advance'].length > 0 ? ' class=no-line' : '')}>
					<td>
						${generateTime(toDate(row['time']), 'Y-m-d H시 i분')}
					</td>
					
					<td>
						${ip_pas(req, row['username'], row['ismember'])}
					</td>
					
					<td>
						<a href="/w/${encodeURIComponent(row['title'])}">${html.escape(row['title'])}</a> 
						( <a href="/history/${encodeURIComponent(row['title'])}">역사 | </a> 
						${
								Number(row['rev']) > 1
								? '<a \href="/diff/' + encodeURIComponent(row['title']) + '?rev=' + row['rev'] + '&oldrev=' + String(Number(row['rev']) - 1) + '">비교 | </a>'
								: ''
						} 
						<a href="/discuss/${encodeURIComponent(row['title'])}">[토론]</a> )
						
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
							
						};">${row['changes']}</span>]
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
	`;
	
	res.send(await render(req, `${username}의 문서 기여 목록`, content, {}, _, _, 'contribution'));
});