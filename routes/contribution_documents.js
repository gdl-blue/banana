wiki.get(/^\/contribution\/(ip|author)\/(.*)\/document/, async function documentContribution(req, res) {
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
	
	await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
				where cast(time as integer) >= ? and ismember = ? and username = ? order by cast(time as integer) desc", [
					Number(getTime()) - 2592000000, ismember, username
				]);
	
//			<li><a href="/contribution/${ismember}/${username}/document">[문서]</a></li>
//			<li><a href="/contribution/${ismember}/${username}/discuss">[토론]</a></li>
	
	var content = `
		<p>최근 30일동안의 기여 목록입니다.</p>
	
		<ol class="breadcrumb link-nav">
			<li><strong>[문서]</strong></li>
			<li><a href="/contribution/${ismember}/${username}/discuss">[토론]</a></li>
		</ol>
		
		<table class="table table-hover">
			<colgroup>
				<col>
				<col style="width: 25%;">
				<col style="width: 22%;">
			</colgroup>
			
			<thead id>
				<tr>
					<th>문서</th>
					<th>수정자</th>
					<th>시간</th>
				</tr>
			</thead>
			
			<tbody id>
	`;
	
	for(row of curs.fetchall()) {
		content += `
				<tr${(row['log'].length > 0 || row['advance'].length > 0 ? ' class=no-line' : '')}>
					<td>
						<a href="/w/${encodeURIComponent(row['title'])}">${html.escape(row['title'])}</a> 
						<a href="/history/${encodeURIComponent(row['title'])}">[역사]</a> 
						${
								Number(row['rev']) > 1
								? '<a \href="/diff/' + encodeURIComponent(row['title']) + '?rev=' + row['rev'] + '&oldrev=' + String(Number(row['rev']) - 1) + '">[비교]</a>'
								: ''
						} 
						<a href="/discuss/${encodeURIComponent(row['title'])}">[토론]</a> 
						
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
	`;
	
	res.send(await render(req, `${username}의 문서 기여 목록`, content, {}));
});