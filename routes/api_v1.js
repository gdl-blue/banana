wiki.get(/^\/api\/v1\/w\/(.*)/, async function API_viewDocument_v1(req, res) {
	const title = req.params[0];
	
	if(title.replace(/\s/g, '') === '') {
		res.status(400).json({
			title: title,
			state: 'invalid_document',
			content: ''
		});
		return;
	}
	
	const rawContent = await curs.execute("select content from documents where title = ?", [title]);

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
			
			if(title.startsWith("사용자:") && getperm(req, 'admin', title.replace(/^사용자[:]/, ''))) {
				content = `
					<div style="border-width: 5px 1px 1px; border-style: solid; border-color: orange gray gray; padding: 10px; margin-bottom: 10px;" onmouseover="this.style.borderTopColor=\'red\';" onmouseout="this.style.borderTopColor=\'orange\';">
						<span style="font-size: 14pt;">이 사용자는 특수 권한을 가지고 있습니다.</span>
					</div>
				` + content;
			}
		}
	} catch(e) {
		viewname = 'notfound';
		
		httpstat = 404;
		content = '';
	}
	
	res.status(httpstat).json({
		title: title,
		state: viewname,
		content: content
	});
});

wiki.get(/^\/api\/v1\/raw\/(.*)/, async function API_viewRaw_v1(req, res) {
	const title = req.params[0];
	
	if(title.replace(/\s/g, '') === '') {
		res.status(400).json({
			title: title,
			state: 'invalid_document',
			content: ''
		});
		return;
	}
	
	const rawContent = await curs.execute("select content from documents where title = ?", [title]);

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
		state: viewname,
		content: content
	});
});

wiki.get(/^\/api\/v1\/users\/(.*)/, async function API_userInfo_v1(req, res) {
	const username = req.params[0];
	
	res.json({
		username: username
	});
});

wiki.get(/^\/api\/v1\/history\/(.*)/, async function API_viewHistory_v1(req, res) {
	const title = req.params[0];
	
	const start = req.query['start'];
	const end = req.query['end'];
	
	if(!start || !end || isNaN(atoi(start)) || isNaN(atoi(end))) {
		res.json({
			title: title,
			state: 'invalid_parameters',
			history: null,
			description: 'URL에 시작 리비전과 끝 리비전을 start 및 end 키워드로 명시하십시오.'
		});
		return;
	}
	
	if(atoi(start) > atoi(end)) {
		res.json({
			title: title,
			state: 'invalid_parameters',
			history: null,
			description: '시작 리비전은 끝 리비전보다 클 수 없습니다.'
		});
		return;
	}
	
	if(atoi(end) - atoi(start) > 100) {
		res.json({
			title: title,
			state: 'invalid_parameters',
			history: null,
			description: '시작 리비전과 끝 리비전의 차이는 100 이하이여야 합니다.'
		});
		return;
	}
	
	var dbdata = await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and cast(rev as integer) >= ? and cast(rev as integer) <= ? order by cast(rev as integer) desc limit 30",
						[title, atoi(start), atoi(end)]);
	var ret = {
		title: title,
		startrev: start,
		endrev: end,
		state: 'ok'
	};
	
	var cnt = 0;
	
	for(var row of dbdata) {
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
	
	ret['total'] = cnt;
	
	res.json(ret);
});

wiki.get(/^\/api\/v1\/thread\/(.+)/, async function API_threadData_v1(req, res) {
	const tnum = req.params[0];
	
	const start = req.query['start'];
	const end = req.query['end'];
	
	if(!start || !end || isNaN(atoi(start)) || isNaN(atoi(end))) {
		res.json({
			thread_id: tnum,
			state: 'invalid_parameters',
			history: null,
			description: 'URL에 시작 레스번호와 끝 레스번호를 start 및 end 키워드로 명시하십시오.'
		});
		return;
	}
	
	if(atoi(start) > atoi(end)) {
		res.json({
			thread_id: tnum,
			state: 'invalid_parameters',
			history: null,
			description: '시작 번호는 끝 번호보다 클 수 없습니다.'
		});
		return;
	}
	
	if(atoi(end) - atoi(start) > 2000) {
		res.json({
			thread_id: tnum,
			state: 'invalid_parameters',
			history: null,
			description: '시작 레스번호와 끝 레스번호의 차이는 2,000 이하이여야 합니다.'
		});
		return;
	}
	
	var dbdata = await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = dbdata.length;
	
	if(!rescount) { 
		res.status(400).json({
			thread_id: tnum,
			state: 'notfound',
			description: '토론을 찾을 수 없습니다.'
		});
	}
	
	var dbdata = await curs.execute("select username from res where tnum = ? and (id = '1')", [tnum]);
	const fstusr = dbdata[0]['username'];
	
	var dbdata = await curs.execute("select title, topic, status from threads where tnum = ?", [tnum]);
	const title = dbdata[0]['title'];
	const topic = dbdata[0]['topic'];
	const status = dbdata[0]['status'];
	
	var dbdata = await curs.execute("select id, content, username, time, hidden, hider, status, ismember, stype from res where tnum = ? and (cast(id as integer) >= ? and cast(id as integer) <= ?) order by cast(id as integer) asc", [tnum, Number(start), Number(end)]);

	content = '';
	var ret = {
		title: title,
		topic: topic,
		status: status,
		thread_id: tnum
	};
	
	for(var rs of dbdata) {
		ret[rs['id']] = {
			id: rs['id'],
			hidden: rs['hidden'] == '1' || rs['hidden'] == 'O' ? true : false,
			hider: rs['hidden'] == '1' ? rs['hider'] : null,
			type: rs['status'] == '1' ? 'status' : 'normal',
			contribution_type: rs['ismember'],
			status_type: rs['status'] == '1' ? rs['stype'] : null,
			timestamp: rs['time'],
			username: rs['username'],
			content: rs['hidden'] == '1' ? (
								getperm(req, 'hide_thread_comment', ip_check(req))
								? markdown(rs['content'], )
								: ''
							  ) : (
								markdown(rs['content'], 1)
							),
			raw: rs['hidden'] == '1' ? (
								getperm(req, 'hide_thread_comment', ip_check(req))
								? rs['content']
								: ''
							  ) : (
								rs['content']
							),
			first_author: rs['username'] == fstusr ? true : false
		};
	}
	
	return res.json(ret);
});

wiki.get(/^\/api\/v1\/(.*)/, (req, res) => res.json({
	state: 'not_found',
	description: '해당 API를 찾을 수 없습니다. (현재 사용 중인 API 버전은 1입니다)'
}));
