// 나무픽스 호환용
wiki.post('/admin/ipacl', async function postIPACL(req, res) {
	var   username         = req.body['ip'];
	const usertype         = req.body['usertype'];
	const blockview        = req.body['blockview'];
	const al               = req.body['allow_login'] == 'Y' ? '1' : '0';
	const duration         = req.body['expire'];
	
	// 차단 기간은 처리사항이 많아서 만료일로 했는데 결국 차단기간 만들게 되네
	
	if(!getperm('ban_users', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		return;
	}
	
	if(!username) {
		res.send(await showError(req, 'invalid_request_body'));
		return;
	}
	
	if(!username.match(/\/(\d+)$/)) {
		if(username.match(/\d{1,3}[.]\d{1,3}[.]\d{1,3}[.]\d{1,3}/))
			username += '/32';
		else
			username += '/128';
	}
	
	var expiration
	
	const startTime  = new Date().getTime();
	
	// 'blockhistory': ['ismember', 'type', 'blocker', 'username', 'durationstring', 'startingdate', 'endingdate', 'al']
	// 'banned_users': ['username', 'blocker', 'startingdate', 'endingdate', 'ismember', 'al', 'blockview']
	
	await curs.execute("insert into banned_users (username, blocker, startingdate, endingdate, ismember, al, blockview, fake) \
					values (?, ?, ?, ?, ?, ?, ?, ?)", [
						username, ip_check(req), startTime, expiration, usertype, al, blockview, fake == 'on' ? '1' : '0'
					]);
	
	await curs.execute("insert into blockhistory (ismember, type, blocker, username, durationstring, startingdate, endingdate, al, fake) \
					values (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
						usertype, usertype == 'ip' ? 'ipacl_add' : 'ban_account', ip_check(req), username, '', startTime, expiration, al, blockview, fake == 'on' ? '1' : '0'
					]);
	
	res.redirect('/admin/ban_users');
});

// 나무픽스 호환용
wiki.post('/admin/suspend_account', async function suspendAccount(req, res) {
	var   username         = req.body['username'];
	const usertype         = req.body['usertype'];
	const blockview        = req.body['blockview'];
	const al               = req.body['al'];
	const isPermanant      = req.body['permanant'];
	const expirationDate   = req.body['expiration-date'];
	const expirationTime   = req.body['expiration-time'];
	const fake             = req.body['fakepermanant'];
	const expirationString = `${expirationDate} ${expirationTime}:00`;
	
	if(!getperm('ban_users', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		return;
	}
	
	if(!username || !usertype || !isPermanant || (isPermanant == 'false' && (!expirationDate || !expirationTime))) {
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
	
	await curs.execute("insert into banned_users (username, blocker, startingdate, endingdate, ismember, al, blockview, fake) \
					values (?, ?, ?, ?, ?, ?, ?, ?)", [
						username, ip_check(req), startTime, expiration, usertype, al, blockview, fake == 'on' ? '1' : '0'
					]);
	
	await curs.execute("insert into blockhistory (ismember, type, blocker, username, durationstring, startingdate, endingdate, al, fake) \
					values (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
						usertype, 'suspend', ip_check(req), username, '', startTime, expiration, al, blockview, fake == 'on' ? '1' : '0'
					]);
	
	res.redirect('/admin/ban_users');
});