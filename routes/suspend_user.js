wiki.get('/admin/ban_users', async function blockControlPanel(req, res) {
	const from = req.query['from'];
	
	if(!getperm('ban_users', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		return;
	}
	
	var content = `
		<form method=post class=settings-section>
			<div class=form-group>
				<label>이름 혹은 CIDR:</label><br>
				<input value="${req.query['username'] ? html.escape(req.query['username']) : ''}" type=text name=username id=usernameInput class=form-control>
			</div>
			
			<div class=form-group>
				<label>사용자 종류:</label><br>
				<select name=usertype class=form-control>
					<option ${req.query['usertype'] == 'ip' ? 'selected' : ''} value=ip>IP 주소</option>
					<option ${req.query['usertype'] == 'author' ? 'selected' : ''} value=author>계정</option>
				</select>
			</div>
			
			<div class=form-group>
				<label>차단 사유:</label><br>
				<input type=text name=note id=noteInput class=form-control>
			</div>
			
			<div class=form-group>
				<label>접속 완전 차단<sup><a title="계정은 로그아웃, IP는 데이타 네트워크 등으로 쉽게 우회할 수 있습니다.">[!]</a></sup>:</label><br>
				<div class=checkbox>
					<input ${req.query['blockview'] == '1' ? 'checked' : ''} type=checkbox name=blockview>
				</div>
			</div>
			
			<div class=form-group>
				<label>로그인 시 차단하지 않음<sup><a title="IP 주소를 차단할 때에만 유효한 설정입니다. 로그인하면 편집할 수 있습니다.">[?]</a></sup>:</label><br>
				<div class=checkbox>
					<input ${req.query['al'] == '1' ? 'checked' : ''} type=checkbox name=al>
				</div>
			</div>
			
			<div class=form-group>
				<label>차단 만료일:</label><br>
				
				<label><input type=radio name=permanant value=true onclick="$('input[group=expiration]').attr('disabled', '');"> 무기한</label><br>
				<label>
					<input type=radio name=permanant value=false onclick="$('input[group=expiration]').removeAttr('disabled');" checked> 만료일 지정
					
					<div style="margin-left: 40px;">
						<!-- placeholder: 구버전 브라우저 배려 -->
						<input group=expiration value="${req.query['expirationdate'] ? html.escape(req.query['expirationdate']) : ''}" type=date name=expiration-date placeholder="YYYY-MM-DD" class=form-control style="display: inline-block; width: auto;">
						<input group=expiration value="${req.query['expirationtime'] ? html.escape(req.query['expirationtime']) : ''}" type=time name=expiration-time placeholder="HH:MM" class=form-control style="display: inline-block; width: auto;"><br>
						<label><input group=expiration type=checkbox name=fakepermanant> 무기한으로 표시<sup><a title="실제로는 기한을 지정하지만 무기한으로 표시합니다. VPN IP 차단을 목적으로 하는 반달을 차단할 때 사용하면 좋습니다.">[?]</a></sup></label>
					</div>
				</label>
			</div>
			
			<div class=btns>
				<button type=submit class="btn btn-info" style="width: 120px;">확인</button>
			</div>
		</form>
		
		<table class="table table-hover">
			<colgroup>
				<col>
				<col style="width: 210px;">
				<col style="width: 170px;">
				<col style="width: 60px;">
				<col style="width: 60px;">
				<col style="width: 80px;">
				<col style="width: 60px;">
			</colgroup>
			
			<thead>
				<tr>
					<td><strong>이름</strong></td>
					<td><strong>사유</strong></td>
					<td><strong>만료일</strong></td>
					<td><strong>유형</strong></td>
					<td><strong>접속</strong></td>
					<td><strong>로그인</strong></td>
					<td><strong>해제</strong></td>
				</tr>
			</thead>
			
			<tbody id>
	`;
	
	// 'blockhistory': ['ismember', 'type', 'blocker', 'username', 'durationstring', 'startingdate', 'endingdate', 'al']
	// 'banned_users': ['username', 'blocker', 'startingdate', 'endingdate', 'ismember', 'al', 'blockview']
	
	// await curs.execute("delete from banned_users where cast(endingdate as integer) < ? and not endingdate = '0'", [new Date().getTime()]);
	
	if(from) {
		await curs.execute("select username, blocker, startingdate, endingdate, ismember, al, blockview, note from banned_users \
								where username >= ? order by username limit 100", [from]);

	} else {
		await curs.execute("select username, blocker, startingdate, endingdate, ismember, al, blockview, note from banned_users \
								order by username asc limit 100");
	}
	
	for(var row of curs.fetchall()) {
		content += `
			<tr>
				<td>${html.escape(row['username'])}</td>
				<td>${html.escape(row['note'])}</td>
				<td>${row['endingdate'] != '0' ? generateTime(toDate(row['endingdate']), timeFormat) : '영구'}</td>
				<td>${row['ismember'] == 'ip' ? 'IP' : '계정'}</td>
				<td>${row['blockview'] == '1' ? '불가' : '가능'}</td>
				<td>${row['al'] == '1' ? '가능' : (row['ismember'] == 'ip' ? '불가' : '-')}</td>
				<td>
					<form method=post action="/admin/unban_user" onsubmit="사용자를 차단해제하시겠습니까?">
						<input type=hidden name=username value="${html.escape(row['username'])}">
						<input type=hidden name=usertype value="${html.escape(row['ismember'])}">
						
						<button type=submit class="btn btn-danger btn-sm">해제</button>
					</form>
				</td>
			</tr>
		`;
	}
	
	content += `
			</tbody>
		</table>
		
		${navbtn(0, 0, 0, 0)}
	`;
	
	res.send(await render(req, '차단', content, _, _, _, 'ban_users'));
});

wiki.post('/admin/ban_users', async function banUser(req, res) {
	var   username         = req.body['username'];
	const usertype         = req.body['usertype'];
	const blockview        = req.body['blockview'];
	const al               = req.body['al'] == 'on' ? '1' : '0';
	const isPermanant      = req.body['permanant'];
	const expirationDate   = req.body['expiration-date'];
	const expirationTime   = req.body['expiration-time'];
	const fake             = req.body['fakepermanant'];
	const note             = req.body['note'];
	const expirationString = `${expirationDate} ${expirationTime}:00`;
	
	if(!getperm('ban_users', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		return;
	}
	
	if(!note || !username || !usertype || !isPermanant || (isPermanant == 'false' && (!expirationDate || !expirationTime))) {
		res.send(await showError(req, 'invalid_request_body'));
		return;
	}
	
	if(!['author', 'ip'].includes(usertype) || (isPermanant != 'true' && (!stringInFormat(/^\d{1,}[-]\d{2,2}[-]\d{2,2}$/, expirationDate) || !stringInFormat(/^\d{2,2}[:]\d{2,2}$/, expirationTime)))) {
		res.send(await showError(req, 'invalid_value'));
		return;
	}
	
	if(isPermanant != 'true' && isNaN(Date.parse(expirationString))) {
		res.send(await showError(req, 'invalid_value'));
		return;
	}
	
	if(usertype == 'ip' && !username.match(/\/(\d+)$/)) {
		if(username.match(/\d{1,3}[.]\d{1,3}[.]\d{1,3}[.]\d{1,3}/))
			username += '/32';
		else
			username += '/128';
	}
	
	const expiration = isPermanant == 'true' ? '0' : new Date(expirationString).getTime();
	const startTime  = new Date().getTime();
	
	// 'blockhistory': ['ismember', 'type', 'blocker', 'username', 'durationstring', 'startingdate', 'endingdate', 'al']
	// 'banned_users': ['username', 'blocker', 'startingdate', 'endingdate', 'ismember', 'al', 'blockview']
	
	curs.execute("insert into banned_users (username, blocker, startingdate, endingdate, ismember, al, blockview, fake, note) \
					values (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
						username, ip_check(req), startTime, expiration, usertype, al, blockview, fake == 'on' ? '1' : '0', note
					]);
	
	curs.execute("insert into blockhistory (ismember, type, blocker, username, durationstring, startingdate, endingdate, al, fake, note) \
					values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
						usertype, usertype == 'ip' ? 'ipacl_add' : 'suspend', ip_check(req), username, '', startTime, expiration, al, fake == 'on' ? '1' : '0', note
					]);
	
	res.redirect('/admin/ban_users');
});

wiki.post('/admin/unban_user', async function unban(req, res) {
	const username = req.body['username'];
	const usertype = req.body['usertype'];
	
	if(!getperm('ban_users', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		return;
	}
	
	if(!username || !usertype) {
		res.send(await showError(req, 'invalid_request_body'));
		return;
	}
	
	if(!['ip', 'author'].includes(usertype)) {
		res.send(await showError(req, 'invalid_value'));
		return;
	}
	
	curs.execute("delete from banned_users where username = ? and ismember = ?", [username, usertype]);
	
	curs.execute("insert into blockhistory (ismember, type, blocker, username, durationstring, startingdate, endingdate, al, fake, note) \
					values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
						usertype, usertype == 'ip' ? 'ipacl_remove' : 'unsuspend', ip_check(req), username, '', getTime(), '-1', '0', '0', '(차단 해제)'
					]);
					
	res.redirect('/admin/ban_users');
});