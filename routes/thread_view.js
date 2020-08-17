wiki.get('/thread/:tnum', async function viewThread(req, res) {
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	var deleted = 0;
	
	const tnum = req.params["tnum"];
	
	await curs.execute("select topic from threads where deleted = '1' and tnum = ?", [tnum]);
	if((deleted = curs.fetchall().length) && !getperm('developer', ip_check(req))) {
		res.send(await showError(req, "thread_not_found")); return;
	}
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }
	
	await curs.execute("select title, topic, status from threads where tnum = ?", [tnum]);
	const title = curs.fetchall()[0]['title'];
	const topic = curs.fetchall()[0]['topic'];
	const status = curs.fetchall()[0]['status'];
	
	if(!await getacl(req, title, 'read')) {
		res.send(await showError(req, 'insufficient_privileges_read'));
		
		return;
	}
	
	var trtopic = html.escape(topic);
	
	if(getperm('update_thread_topic', ip_check(req))) {
		trtopic = `<form id=new-thread-topic-form>
						<input style="font-size: inherit;" name=topic value="${html.escape(topic)}">
						<button type=submit style="font-size: inherit;">→</button>
					</form>`;
	}
	
	var content = `
		<h2 class=wiki-heading style="cursor: pointer;">
			${trtopic}
		</h2>
		
		<div class=wiki-heading-content>
		
			<div id=res-container>
	`;
	
	if(req.query['nojs'] == '1' || (!req.query['nojs'] && compatMode(req))) {
		content += await getThreadData(req, tnum);
	} else {
		for(var i=1; i<=rescount; i++) {
			content += `
				<div class="res-wrapper res-loading" data-id="${i}" data-locked="false" data-visible=false>
					<div class="res res-type-normal">
						<div class="r-head">
							<span class="num">${i}.&nbsp;</span>
						</div>
						
						<div class="r-body"></div>
					</div>
				</div>
			`;
		}
	}
	
	content += `
			</div>
		</div>
		
		<div class=res-wrapper data-id="-1" data-locked=true data-visible=false>
			<div class="res res-type-normal">
				<div class="r-head">
					<span class="num">*. <strong>내 의견</strong>&nbsp;</span>
				</div>
				
				<div class="r-body">
	`;
	
	if(req.query['nojs'] == '1' || (!req.query['nojs'] && compatMode(req))) {
		content += alertBalloon('경고', '지원되지 않는 브라우저를 사용하기 때문에 새로운 댓글을 자동으로 불러올 수 없습니다. <small>지원되며, 사용자 에이전트를 변경한 것이라면 <a href="?nojs=0">여기</a>를 누르십시오.</small>', 'warning');
	}
	
	if(getperm('update_thread_status', ip_check(req))) {
		var sts = '';
		
		switch(status) {
			case 'close':
				sts = `
					<option value="normal">진행</option>
					<option value="pause">동결</option>
				`;
			break;case 'normal':
				sts = `
					<option value="close">닫힘</option>
					<option value="pause">동결</option>
				`;
			break;case 'pause':
				sts = `
					<option value="close">닫힘</option>
					<option value="normal">진행</option>
				`;
		}
		
		content += `
		    <form method="post" id="thread-status-form" style="display: none;">
        		토론 상태: 
        		<select name="status">${sts}</select>
        		<button>변경</button>
        	</form>
			
		    <form method=post id=new-thread-status-form>
        		<button type=button data-status=close>종결</button>
        		<button type=button data-status=pause>동결</button>
        		<button type=button data-status=normal>계속</button>
        	</form>
		`;
	}
	
	content += `
		${
			(!deleted && getperm('delete_thread', ip_check(req)))
			? '<span class=pull-right><a onclick="return confirm(\'삭제하시겠습니까?\');" href="/admin/thread/' + tnum + '/delete" class="btn btn-danger btn-sm">토론 삭제</a></span>'
			: ''
		}
		${
			(deleted && getperm('developer', ip_check(req)))
			? '<span class=pull-right><a onclick="return confirm(\'삭제복구하시겠습니까?\');" href="/admin/thread/' + tnum + '/restore" class="btn btn-warning btn-sm">삭제 복구</a></span>'
			: ''
		}
		${
			(getperm('developer', ip_check(req)))
			? '<span class=pull-right><a onclick="return confirm(\'영구 삭제하시겠습니까?\');" href="/admin/thread/' + tnum + '/permanant_delete" class="btn btn-danger btn-sm">완전 삭제</a></span>'
			: ''
		}
	`;
	
	if(getperm('update_thread_document', ip_check(req))) {
		content += `
        	<form method="post" id="thread-document-form">
        		토론 문서: 
        		<input type="text" name="document" value="${title}">
        		<button>변경</button>
        	</form>
		`;
	}
	
	if(getperm('update_thread_topic', ip_check(req))) {
		content += `
        	<form method="post" id="thread-topic-form" style="display: none;">
        		토론 주제: 
        		<input type="text" name="topic" value="${topic}">
        		<button>변경</button>
        	</form>
		`;
	}
	
	content += `
					<script>$(function() { discussPollStart("${tnum}"); });</script>
				
					<form id=new-thread-form method=post>
						<textarea class=form-control style="border: none; background: transparent;" placeholder="의견을 입력해주세요." rows=3 name=text ${['close', 'pause'].includes(status) ? 'disabled' : ''}>${status == 'pause' ? '[동결된 토론입니다.]' : (status == 'close' ? '[닫힌 토론입니다.]' : '')}</textarea>
						
						<div class=btns>
							<button type=submit class="btn btn-sm" style="width: 120px;">전송하기!</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	`;
	
	if(!req.query['nojs'] && !(!req.query['nojs'] && compatMode(req))) {
		content += `
			<noscript>
				<meta http-equiv=refresh content="0; url=?nojs=1" />
			</noscript>
		`;
	}
	
	res.send(await render(req, title, content, {}, ' (토론) - ' + topic, error = false, viewname = 'thread'));
});

wiki.post('/thread/:tnum', async function postThreadComment(req, res) {
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	if(!req.body['text']) {
		if(req.query['nojs'] == '1' || (!req.query['nojs'] && compatMode(req))) {
			res.send(await showError(req, 'invalid_request_body'));
			return;
		} else {
			res.json({});
			return;
		}
	}
	
	const tnum = req.params["tnum"];
	
	await curs.execute("select topic from threads where deleted = '1' and tnum = ?", [tnum]);
	if(curs.fetchall().length && !getperm('developer', ip_check(req))) {
		res.send(await showError(req, "thread_not_found")); return;
	}
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }
	
	await curs.execute("select title, topic, status from threads where tnum = ?", [tnum]);
	const title = curs.fetchall()[0]['title'];
	const topic = curs.fetchall()[0]['topic'];
	const status = curs.fetchall()[0]['status'];
	
	if(!await getacl(req, title, 'read')) {
		res.send(showError('insufficient_privileges_read'));
		
		return;
	}
	
	if(!await getacl(req, title, 'write_thread_comment')) {
		res.send(await showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	if(status != 'normal') {
		res.send(await showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	await curs.execute("select id from res where tnum = ? order by cast(id as integer) desc limit 1", [tnum]);
	const lid = Number(curs.fetchall()[0]['id']);
	
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin) \
					values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
						String(lid + 1), req.body['text'], ip_check(req), getTime(), '0', '', '0', tnum, islogin(req) ? 'author' : 'ip', getperm('admin', ip_check(req)) ? '1' : '0'
					]);
					
	curs.execute("update threads set time = ? where tnum = ?", [getTime(), tnum]);
	
	if(req.query['nojs'] == '1' || (!req.query['nojs'] && compatMode(req))) {
		res.redirect('/thread/' + tnum + '?nojs=1');
	} else {
		res.json({});
	}
});