wiki.get('/thread/:tnum', async function viewThread(req, res) {
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	var deleted = 0;
	
	const tnum = slug = req.params["tnum"];
	
	await curs.execute("select topic from threads where deleted = '1' and tnum = ?", [tnum]);
	if((deleted = curs.fetchall().length) && !getperm('developer', ip_check(req))) {
		res.send(await showError(req, "thread_not_found")); return;
	}
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }
	
	var dbdata = await curs.execute("select title, topic, status, type, ncontent, ocontent, baserev from threads where tnum = ?", [tnum]);
	const title = dbdata[0]['title'];
	const topic = dbdata[0]['topic'];
	const status = dbdata[0]['status'];
	const type = dbdata[0]['type'];
	const ocontent = dbdata[0]['ocontent'];
	const ncontent = dbdata[0]['ncontent'];
	const baserev = dbdata[0]['baserev'];
	
	if(!await getacl(req, title, 'read')) {
		res.send(await showError(req, 'insufficient_privileges_read'));
		
		return;
	}
	
	if(!req.query['nojs'] && (compatMode(req) || req.cookies['no-discuss-script'])) {
		res.redirect('/thread/' + tnum + '?nojs=1');
		return;
	}
	
	var trtopic = html.escape(topic);
	
	if(getperm('update_thread_topic', ip_check(req))) {
		trtopic = `<form id=new-thread-topic-form action="/admin/thread/${html.escape(tnum)}/topic">
						<input style="font-size: inherit;" name=topic value="${html.escape(topic)}">
						<button type=submit style="font-size: inherit;">→</button>
					</form>`;
	}
	
	var content = `
		<h2 class=wiki-heading style="cursor: pointer;">
			${trtopic}
		</h2>
		
		<div class=wiki-heading-content>
	`;
	
	if(type == 'edit_request') {
		content += `
			<ul class="nav nav-tabs" style="height: 38px;">
				<li class=nav-item>
					<a class="nav-link active" href="#thread">댓글</a>
				</li>
				
				<li class=nav-item>
					<a class=nav-link href="#contents">편집 내용</a>
				</li>
			</ul>
			
			<div class=tab-content>
				<div id=thread class="tab-pane active">
		`;
	}
	
	content += `<div id=res-container>`;
	
	const hiddendata = await curs.execute("select hidden from res where tnum = ? order by cast(id as integer) asc", [tnum]);
	
	if(req.query['nojs'] == '1' || (!req.query['nojs'] && compatMode(req)) || req.cookies['no-discuss-script']) {
		content += await getThreadData(req, tnum);
	} else {
		for(var i=1; i<=rescount; i++) {
			if((hiddendata[i-1]['hidden'] == '1' || hiddendata[i-1]['hidden'] == 'O') && req.cookies['always-hide-hidden-res']) {
				continue;
			}
			
			content += `
				<div class="res-wrapper res-loading" data-hidden="${hiddendata[i-1]['hidden'] == '1' || hiddendata[i-1]['hidden'] == 'O' ? 'true' : 'false'}" data-id="${i}" data-locked="false" data-visible=false>
					<div class="res res-type-normal">
						<div class="r-head">
							<a id="${i}" data-description="나무픽스 호환" style="display: none;">#${i}</a>
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
	`;
	
	if(req.query['nojs'] == '1' || (!req.query['nojs'] && compatMode(req))) {
		content += alertBalloon('경고', '지원되지 않는 브라우저를 사용 중이거나 기능이 비활성화되어있어 새로운 댓글을 자동으로 불러올 수 없습니다. (지원되나, 사용자 에이전트를 변경한 것이라면 <a href="?nojs=0">여기</a>를 누르십시오)', 'warning');
	}
	
	content += `
		<form id=new-thread-form method=post>
			<div class="res-wrapper res-loading" data-id="-1" data-locked=true data-visible=false>
				<div class="res res-type-normal">
					<div class="r-head">
						<strong>내 의견</strong>
						<button type=submit style="width: 120px; float: right;">전송!</button>
					</div>
					
					<div class="r-body">
	`;
	
	content += `
						<script>$(function() { discussPollStart("${tnum}"); });</script>
					
						<textarea style="border: none; background: transparent; width: 100%;" placeholder="의견 입력" rows=3 name=text ${['close', 'pause'].includes(status) ? 'disabled' : ''}>${status == 'pause' ? '[동결된 토론입니다.]' : (status == 'close' ? '[닫힌 토론입니다.]' : '')}</textarea>
					</div>
				</div>
			</div>
		</form>
	`;
	
	if(type == 'edit_request') {
		content += `
				</div>
				
				<div class=tab-pane id=contents>
					<table class=vertical-tablist>
						<colgroup>
							<col style="width: 140px;">
							<col>
						</colgroup>
						
						<tbody>
							<tr>
								<td class=tablist style="display: none;">
									<div class=tab data-paneid=preview>
										<img src='data:image/png;base64,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'/>
										<label>미리보기</label>
									</div>
									
									<div class=tab data-paneid=raw>
										<img src='data:image/png;base64,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'/>
										<label>날내용</label>
									</div>
									
									<div class=tab data-paneid=diff>
										<img src='data:image/png;base64,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'/>
										<label>비교</label>
									</div>
								</td>
								
								<td class=tab-content>
									<div class=tab-page id=preview>
										<h2 class=tab-page-title>미리보기</h2>
										
										${await JSnamumark(title, ncontent.replace(/\r\n/g, '\n').replace(/\r/g, '\n'))}
									</div>
									
									<div class=tab-page id=raw>
										<h2 class=tab-page-title>RAW</h2>
										
										<textarea class=form-control rows=15 readonly>${html.escape(ncontent)}</textarea>
									</div>
									
									<div class=tab-page id=diff>
										<h2 class=tab-page-title>비교</h2>
										
										${difflib.diff(ocontent.replace(/\r\n/g, '\n').replace(/\r/g, '\n'), ncontent.replace(/\r\n/g, '\n').replace(/\r/g, '\n'), baserev + '판', '편집요청')}
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		`;
	}
	
	content += `
		<div class="res-wrapper res-loading" data-id="-2" data-locked=true data-visible=false>
			<div class="res res-type-normal">
				<div class="r-head">
					<strong>${type == 'edit_request' ? '편집 요청' : '토론'} 설정</strong>&nbsp;</span>
				</div>
				
				<div class="r-body">
					<div class=form-group>
						<a href="/member/star_thread/${slug}">[이 토론 주시(미구현)] </a>
						<a href="/member/unstar_thread/${slug}">[이 토론 주시 해제(미구현)] </a>
					</div>
	`;
	if(!req.cookies['always-hide-hidden-res']) {
		content += `
			<div class=form-group>
				<button id=hideBlindRes>숨겨진 댓글 숨기기</button>
				<button id=showBlindRes disabled>숨겨진 댓글 표시</button>
				<label><input id=alwaysHideBlindRes type=checkbox> 항상 숨기기</label>
			</div>
		`;
	}
	
	if(getperm('update_thread_status', ip_check(req)) && type != 'edit_request') {
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
		    <form method=post id=thread-status-form style="display: none;">
        		토론 상태: 
        		<select name="status">${sts}</select>
        		<button>변경</button>
        	</form>
			
		    <form action="/admin/thread/${html.escape(tnum)}/status" method=post id=new-thread-status-form style="display: inline-block;">
        		<button type=button data-status=close>종결</button>
        		<button type=button data-status=pause>동결</button>
        		<button type=button data-status=normal>계속</button>
        	</form>
		`;
	} else if(type == 'edit_request') {
		content += `
			<form method=post style="display: inline-block;">
				<input type=hidden name=slug value="${html.escape(tnum)}" />
		`;
		
		if(await getacl(req, title, 'edit')) {
			content += `
				<button type=submit formaction="/admin/thread/${html.escape(tnum)}/accept">승인</button>
			`;
		}
		
		if(getperm('admin', ip_check(req))) {
			content += `
				<button type=submit formaction="/admin/thread/${html.escape(tnum)}/close" >거부</button>
			`;
		}
		
		content += '</form>';
	}
	
	if(getperm('update_thread_document', ip_check(req)) && type != 'edit_request') {
		content += `
        	<form action="/admin/thread/${html.escape(tnum)}/document" method="post" id="thread-document-form" style="display: inline-block;">
        		토론 문서: 
        		<input type="text" name="document" value="${title}">
        		<button>변경</button>
        	</form>
		`;
	}
	
	if(getperm('update_thread_topic', ip_check(req))) {
		content += `
        	<form action="/admin/thread/${html.escape(tnum)}/topic" method="post" id="thread-topic-form" style="display: inline-block;">
        		토론 주제: 
        		<input type="text" name="topic" value="${topic}">
        		<button>변경</button>
        	</form>
		`;
	}
	
	content += `
		${
			(!deleted && getperm('delete_thread', ip_check(req)))
			? '<span class=pull-right><a id=deleteThreadBtn href="/admin/thread/' + tnum + '/delete" class="btn btn-danger btn-sm">토론 삭제</a></span>'
			: ''
		}
		${
			(deleted && getperm('developer', ip_check(req)))
			? '<span class=pull-right><a id=restoreThreadBtn href="/admin/thread/' + tnum + '/restore" class="btn btn-warning btn-sm">삭제 복구</a></span>'
			: ''
		}
		${
			(getperm('developer', ip_check(req)))
			? '<span class=pull-right><a id=explodeThreadBtn href="/admin/thread/' + tnum + '/permanant_delete" class="btn btn-danger btn-sm">완전 삭제</a></span>'
			: ''
		}
	`;
	
	content += `
				</div>
			</div>
		</div>
	`;
			
	if(!islogin(req)) {
		content += `<p style="font-weight: bold; color: red;">로그인하지 않았습니다. 토론 댓글에 IP(${ip_check(req)})를 영구히 기록하는 것에 동의하는 것으로 간주합니다.</p>`;
	}
	
	if(!req.query.nojs) {
		content += `
			<noscript>
				<meta http-equiv=refresh content="0; url=?nojs=1" />
			</noscript>
		`;
	}
	
	res.send(await render(req, title, content, {
		st: 3
	}, ' (' + (type == 'edit_request' ? '편집요청' : '토론') + ') - ' + topic, error = false, viewname = 'thread'));
});

wiki.post('/thread/:tnum', async function postThreadComment(req, res) {
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	if(!req.body['text']) {
		if(req.query['nojs'] == '1' || (!req.query['nojs'] && compatMode(req)) || req.cookies['no-discuss-script']) {
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
						String(lid + 1), req.body['text'], ip_check(req), getTime(), '0', '', '0', tnum, islogin(req) ? 'author' : 'ip', getperm('admin', ip_check(req)) || getperm('fake_admin', ip_check(req)) ? '1' : '0'
					]);
					
	curs.execute("update threads set time = ? where tnum = ?", [getTime(), tnum]);
	
	if(req.query['nojs'] == '1' || (!req.query['nojs'] && compatMode(req)) || req.cookies['no-discuss-script']) {
		res.redirect('/thread/' + tnum + '?nojs=1');
	} else {
		res.json({});
	}
});