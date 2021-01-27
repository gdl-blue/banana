wiki.get(/^\/api\/v3\/w\/(.*)/, async function API_viewDocument_v3(req, res) {
	const title = req.params[0];
	const rev = req.query['rev'];
	
	if(title.replace(/\s/g, '') === '') {
		res.status(400).json({
			title: title,
			state: 'invalid_document_title',
			content: ''
		});
		return;
	}
	
	if(rev) {
		await curs.execute("select content from history where title = ? and rev = ?", [title, rev]);
	} else {
		await curs.execute("select content from documents where title = ?", [title]);
	}
	const rawContent = curs.fetchall();

	var content = '';
	
	var httpstat = 200;
	var viewname = 'wiki';
	var error = false;
	
	var isUserDoc = false;
	
	var lstedt = undefined;
	
	try {
		if(!await getacl(req, title, 'read')) {
			httpstat = 403;
			error = true;
			
			res.status(httpstat).json({
				title: title,
				state: 'insufficient_privileges_read',
				content: ''
			});
			
			return;
		} else {
			content = markdown(rawContent[0]['content']);
			
			await curs.execute("select time from history where title = ? order by cast(rev as integer) desc limit 1", [title]);
			lstedt = Number(curs.fetchall()[0]['time']);
		}
	} catch(e) {
		viewname = 'notfound';
		
		httpstat = 404;
		content = '';
	}
	
	res.status(httpstat).json({
		title: title,
		state: viewname == 'wiki' ? 'ok' : 'error',
		view_name: viewname,
		content: content,
		last_edited_time: lstedt
	});
});

wiki.get(/^\/api\/v3\/raw\/(.*)/, async function API_viewRaw_v3(req, res) {
	const title = req.params[0];
	const rev = req.query['rev'];
	
	if(title.replace(/\s/g, '') === '') {
		res.status(400).json({
			title: title,
			state: 'invalid_document_title',
			content: ''
		});
		return;
	}
	
	if(rev) {
		await curs.execute("select content from history where title = ? and rev = ?", [title, rev]);
	} else {
		await curs.execute("select content from documents where title = ?", [title]);
	}
	const rawContent = curs.fetchall();

	var content = '';
	
	var httpstat = 200;
	var viewname = 'wiki';
	var error = false;
	
	var isUserDoc = false;
	
	var lstedt = undefined;
	
	try {
		if(!await getacl(req, title, 'read')) {
			httpstat = 403;
			error = true;
			
			res.status(httpstat).json({
				title: title,
				state: 'insufficient_privileges_read',
				content: ''
			});
			
			return;
		} else {
			content = rawContent[0]['content'];
		}
	} catch(e) {
		viewname = 'notfound';
		
		httpstat = 404;
		content = '';
	}
	
	res.status(httpstat).json({
		title: title,
		state: viewname == 'wiki' ? 'ok' : 'error',
		view_name: viewname,
		content: content
	});
});

wiki.get(/^\/api\/v3\/members\/(.*)/, async function API_userInfo_v3(req, res) {
	const username = req.params[0];
	
	await curs.execute("select username from users where username = ?", [username]);
	
	if(!curs.fetchall().length) {
		res.status(404).json({
			username: username,
			state: 'invalid_user'
		});
		return;
	}
	
	var ret = {
		username: username,
		state: 'ok'
	};
	
	await curs.execute("select time from history where rev = '1' and title = ?", ['사용자:' + username]);
	ret['join_timestamp'] = curs.fetchall()[0]['time'];
	
	await curs.execute("select username from history where username = ?", [username]);
	ret['contribution_count'] = curs.fetchall().length;
	ret['permissions'] = [];
	ret['suspended'] = (await isBanned(req, 'author', username)) ? true : false;
	
	for(var perm of perms) {
		if(getperm(req, perm, username)) ret['permissions'].push(perm);
	}
	
	res.json(ret);
});

wiki.get(/^\/api\/v3\/history\/(.*)/, async function API_viewHistory_v3(req, res) {
	const title = req.params[0];
	
	const start = req.query['start'] || 1;
	const end = req.query['end'] || 2000;
	
	if(!start || !end || isNaN(atoi(start)) || isNaN(atoi(end))) {
		res.json({
			title: title,
			state: 'invalid_parameters',
			history: null,
			message: 'URL에 시작 리비전과 끝 리비전을 start 및 end 키워드로 명시하십시오.'
		});
		return;
	}
	
	if(atoi(start) > atoi(end)) {
		res.json({
			title: title,
			state: 'invalid_parameters',
			history: null,
			message: '시작 리비전은 끝 리비전보다 클 수 없습니다.'
		});
		return;
	}
	
	if(atoi(end) - atoi(start) > 2000) {
		res.json({
			title: title,
			state: 'invalid_parameters',
			history: null,
			message: '시작 리비전과 끝 리비전의 차이는 2,000 이하이여야 합니다.'
		});
		return;
	}
	
	const rows = await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and cast(rev as integer) >= ? and cast(rev as integer) <= ? order by cast(rev as integer) asc limit 30",
						[title, atoi(start), atoi(end)]);
	var ret = {};
	
	var cnt = 0;
	
	const first = atoi(rows[0].rev), last = atoi(rows[rows.length - 1].rev);
	
	for(var row of rows) {
		ret[row['rev']] = {
			rev: row['rev'],
			timestamp: row['time'],
			changes: row['changes'],
			log: row['log'],
			edit_request: row['iserq'] == '1' ? true : false,
			edit_request_number: row['iserq'] == '1' ? row['erqnum'] : null,
			advance: row['advance'],
			contribution_type: row['ismember'],
			username: row['username']
		};
		cnt++;
	}
	
	res.json({
		title,
		startrev: start,
		endrev: end,
		first,
		last,
		state: 'ok',
		total: cnt,
		history: ret
	});
});

wiki.get(/^\/api\/v3\/thread\/(.+)/, async function API_threadData_v3(req, res) {
	const tnum = req.params[0];
	
	const start = req.query['start'] || 1;
	const end = req.query['end'] || 2000;
	
	if(!start || !end || isNaN(atoi(start)) || isNaN(atoi(end))) {
		res.json({
			thread_id: tnum,
			state: 'invalid_parameters',
			history: null,
			message: 'URL에 시작 레스번호와 끝 레스번호를 start 및 end 키워드로 명시하십시오.'
		});
		return;
	}
	
	if(atoi(start) > atoi(end)) {
		res.json({
			thread_id: tnum,
			state: 'invalid_parameters',
			history: null,
			message: '시작 번호는 끝 번호보다 클 수 없습니다.'
		});
		return;
	}
	
	if(atoi(end) - atoi(start) > 2000) {
		res.json({
			thread_id: tnum,
			state: 'invalid_parameters',
			history: null,
			message: '시작 레스번호와 끝 레스번호의 차이는 2,000 이하이여야 합니다.'
		});
		return;
	}
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { 
		res.status(400).json({
			thread_id: tnum,
			state: 'notfound',
			message: '토론을 찾을 수 없습니다.'
		});
	}
	
	await curs.execute("select username from res where tnum = ? and (id = '1')", [tnum]);
	const fstusr = curs.fetchall()[0]['username'];
	
	await curs.execute("select title, topic, status from threads where tnum = ?", [tnum]);
	const title = curs.fetchall()[0]['title'];
	const topic = curs.fetchall()[0]['topic'];
	const status = curs.fetchall()[0]['status'];
	
	const reses = await curs.execute("select id, content, username, time, hidden, hider, status, ismember, stype, isadmin from res where tnum = ? and (cast(id as integer) >= ? and cast(id as integer) <= ?) order by cast(id as integer) asc", [tnum, Number(start), Number(end)]);

	content = '';
	var ret = {};
	var cnt = 0;
	for(rs of reses) {
		ret[rs['id']] = {
			id: rs['id'],
			hidden: rs['hidden'] == '1' ? true : false,
			hider: rs['hidden'] == '1' ? rs['hider'] : null,
			type: rs['status'] == '1' ? 'status' : 'normal',
			contribution_type: rs['ismember'],
			status_type: rs['status'] == '1' ? rs['stype'] : null,
			timestamp: rs['time'],
			username: rs['username'],
			content: rs['hidden'] == '1' || rs['hidden'] == 'O' ? (
				getperm(req, 'hide_thread_comment', ip_check(req))
				? markdown(rs['content'], 1)
				: ''
			  ) : (
				markdown(rs['content'], 1)
			),
			raw_content: rs['hidden'] == '1' ? (
				getperm(req, 'hide_thread_comment', ip_check(req))
				? rs['content']
				: ''
			  ) : (
				rs['content']
			),
			first_author: rs['username'] == fstusr ? true : false,
			admin: rs['isadmin'] == '1' ? true : false
		};
		cnt++;
	}
	
	return res.json({
		title,
		topic,
		status,
		thread_id: tnum,
		slug: tnum,
		total: cnt,
		res: ret,
		startres: start,
		endres: end,
		first: atoi(reses[0].id),
		last: atoi(reses[reses.length - 1].id),
	});
});

wiki.post(/^\/api\/v3\/login$/, async function API_botLogin_v3(req, res) {
	await curs.execute("select username from bots where token = ?", [req.body['token']]);
	if(curs.fetchall().length) {
		res.session.username = curs.fetchall()[0]['username'];
		res.json({
			'status': 'success'
		});
	} else {
		res.json({
			'status': 'fail'
		});
	}
});

wiki.get(/^\/api\/v3\/block_history$/, async(req, res) => {
	var dbdata;
	var { limit } = req.query;
	if(limit === undefined || isNaN(limit)) limit = 100;
	limit = Number(limit);
	
	if(limit > 1000 || limit < 0) {
		// (설마 누가 0을 보내겠어...)
		return res.json({
			state: 'invalid_parameters',
			message: 'limit의 값은 0 이상 1,000 이하이여야 합니다. (기본값은 100입니다)'
		});
	}
	
	if(req.query['from']) {
		dbdata = await curs.execute("select ismember, type, blocker, username, startingdate, endingdate, note from blockhistory where startingdate <= ? order by cast(startingdate as integer) desc limit 100", [req.query['from']]);
	}
	else if(req.query['until']) {
		dbdata = await curs.execute("select ismember, type, blocker, username, startingdate, endingdate, note from blockhistory where startingdate >= ? order by cast(startingdate as integer) desc limit 100", [req.query['until']]);
	}
	else {
		dbdata = await curs.execute("select ismember, type, blocker, username, startingdate, endingdate, note from blockhistory order by cast(startingdate as integer) desc limit ?", [limit]);
	}
	
	var set = 0;
	var fd, ld;
	var ret = [];
	
	for(row of dbdata) {
		if(req.query['until']) {
			if(!set) {
				ld = row.startingdate; set = 1;
			}
			fd = row.startingdate;
		} else {
			if(!set) {
				fd = row.startingdate; set = 1;
			}
			ld = row.startingdate;
		}
		
		var data = {
			created: Number(row.startingdate),
			type: row.type,
			executor: row.blocker,
			target: row.username,
			expiration: Number(row.endingdate),
			note: row.note,
		};
		
		if(req.query['until']) {
			ret.unshift(data);
		} else ret.push(data);
	}
	
	res.json(ret);
});

wiki.get(/^\/api\/v3\/contribution\/(ip|author)\/(.*)\/document$/, async(req, res) => {
	if(config.getString('disable_contribution_list', '0') == '1') {
		return res.status(403).json({
			state: 'disabled_feature',
			message: '관리자가 이 기능을 비활성화시켰습니다.'
		});
	}
	
	const ismember = req.params[0];
	const username = req.params[1];
	const limit    = Number(req.query['limit']) || 2400;
	if(limit > 2400 || limit < 0) {
		return res.status(400).json({
			state: 'invalid_parameters',
			message: 'limit의 값은 1 이상 2400 이하이어야 합니다.'
		});
	}
	
	if(ismember == 'ip' && config.getString('ip2md5', '0') == '1') {
		return res.status(403).json({
			state: 'disabled_feature',
			message: '관리자가 IP 사용자에 대해서 기여 목록을 조회할 수 없도록 설정했습니다.'
		});
	}
	
	var flag = '';
	
	switch(req.query['logtype']) {
		case 'create':
			flag = " and (advance = '(새 문서)' or advance = '<i>(새 문서)</i>' or advance = '(문서 생성)')";
		break; case 'revert':
			flag = " and (advance = '(%되돌림)' or advance = '<i>(%되돌림)</i>')";
	}
	
	var dbdata = await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
				where ismember = ? and username = ? " + flag + " and ((title like '사용자:%') or (subwikiid = ? and not title like '사용자:%')) order by cast(time as integer) desc limit ?", [
					ismember, username, subwiki(req), limit
				]);
				
	var ret = [];
	
	for(row of dbdata) {
		const { log, advance, time, title, rev, changes, iserq, erqnum } = row;
		ret.push({
			log, advance, time: Number(time), title, type: '', 
			rev, changes, edit_request: (iserq == '1' ? erqnum : null),
		});
	}
	
	res.json({
		contributor: username,
		type: ismember,
		logtype: req.query['logtype'] || 'all',
		edits: ret,
	});
});

wiki.get(/^\/api\/v3\/recent_changes$/, async(req, res) => {
	if(config.getString('disable_recentchanges', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	var flag = req.query['logtype'];
	if(!flag) flag = 'all';
	
	var dbdata;
	
	switch(flag) {
		case 'create':
			dbdata = await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where (advance like '(문서 생성)' or advance like '<i>(새 문서)</i>') order by cast(time as integer) desc limit 100");
		break;case 'delete':
			dbdata = await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where (advance like '(삭제)' or advance like '<i>(삭제)</i>') order by cast(time as integer) desc limit 100");
		break;case 'move':
			dbdata = await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where (advance like '(%제목 변경)' or advance like '<i>(%이동)</i>') order by cast(time as integer) desc limit 100");
		break;case 'revert':
			dbdata = await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where (advance like '(%복원)' or advance like '<i>(%로 되돌림)</i>') order by cast(time as integer) desc limit 100");
		break;case 'modify':
			dbdata = await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where not title like '사용자:%' and advance = '' order by cast(time as integer) desc limit 100");
		break;default:
			dbdata = await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where not title like '사용자:%' order by cast(time as integer) desc limit 100");
	}
	
	var ret = [];
	
	for(row of dbdata) {
		const { log, advance, time, title, rev, changes, iserq, erqnum, username, ismember } = row;
		ret.push({
			log, advance, time: Number(time), title, type: '', contributor: username,
			rev, changes, edit_request: (iserq == '1' ? erqnum : null), contributor_type: ismember
		});
	}
	
	res.json({
		logtype: flag,
		edits: ret,
	});
});

// 이건 꼭 맨 밑에...
wiki.get(/^\/api\/v3\/(.*)/, (req, res) => res.json({
	state: 'not_found',
	message: '해당 API를 찾을 수 없습니다. (현재 사용 중인 API 버전은 3입니다)'
}));
