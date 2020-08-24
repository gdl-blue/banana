wiki.get(/^\/acl\/(.*)/, async function aclControlPanel(req, res) {
	const acltyp = config.getString('acl_type', 'action-based');
	
	switch(acltyp) {
		case 'action-based':
			const title = req.params[0];
			
			const dispname = ['읽기', '편집', '토론 발제', '토론 참여', '편집 요청'];
			const aclname  = ['read', 'edit', 'create_thread', 'write_thread_comment', 'edit_request'];
			
			const permlist = [
				['any', '모두'],
				['member', '로그인된 사용자'],
				['blocked_ip', '차단된 아이피'],
				['blocked_member', '차단된 계정'],
				['admin', '관리자'],
				['developer', '소유자'],
				['document_creator', '문서를 만든 사용자'],
				['document_last_edited', '문서에 마지막으로 기여한 사용자'],
				['document_contributor', '문서 기여자'],
				['blocked_before', '차단된 적이 있는 사용자'],
				['discussed_document', '이 문서에서 토론한 사용자'],
				['discussed', '토론한 적이 있는 사용자'],
				['userdoc_owner', '사용자 문서 소유자'],
				['has_starred_document', '이 문서를 주시하는 사용자']
			];
			
			var permopts = '';
			var acltypes = '';
			
			for(var prm of permlist) {
				permopts += `<option value="${prm[0]}">${prm[1]}</option>`;
			}
			
			for(var typ=0; typ<aclname.length; typ++) {
				acltypes += `<option value="${aclname[typ]}">${dispname[typ]}</option>`;
			}
			
			var content = `
				<style>
					${(req.query['nojs'] == '1' || (!req.query['nojs'] && compatMode(req))) || !getperm('acl', ip_check(req)) ? '.acl-controller {display: none; }' : ''}
				</style>
			`;
			
			if(!req.query['nojs'] && compatMode(req)) {
				res.redirect('/acl/' + encodeURIComponent(title) + '?nojs=1');
				return;
			}
			
			if(req.query['nojs'] == '1' && getperm('acl', ip_check(req))) {
				// action type mode value not
				content += `
					<form method=post>
						<p>ACL <select name=mode><option value=add>추가</option><option value=remove>삭제</option></select></p>
						<label>액션: </label><select name=action><option value=allow>허용</option><option value=deny>거부</option></select><br>
						<label>주체: </label><select name=type>${acltypes}</select><br>
						<label>대상: </label><select name=value>${permopts}</select><br>
						<label>반대 대상: </label><input type=checkbox name=not><br>
						
						<div class=btns>
							<button type=submit class="btn btn-primary" style="width: 100px;">확인</button>
						</div>
					</form>
				`;
			}
			
			for(var acl=0; acl<dispname.length; acl++) {
				var ret1 = '', ret2 = '';
			
				var dbdata = await curs.execute("select value, notval, hipri from acl where action = ? and title = ? and type = ? order by value", [
					'allow', title, aclname[acl]
				]);
				
				for(var aclitm of dbdata) {
					ret1 += `<option>${aclitm['not'] == '1' ? 'not ' : ''}${aclitm['value']}${aclitm['hipri'] == '1' ? '_h' : ''}</option>`;
				}
				
				var dbdata = await curs.execute("select value, notval from acl where action = ? and title = ? and type = ? order by value", [
					'deny', title, aclname[acl]
				]);
				
				for(var aclitm of dbdata) {
					ret2 += `<option>${aclitm['notval'] == '1' ? 'not ' : ''}${aclitm['value']}</option>`;
				}
				
				content += `
					<div class=form-group>
						<h3 style="margin: none;" class=wiki-heading>${dispname[acl]}</h3>
						<div class=wiki-heading-content>
							<div style="width: 49.5%; float: left;" class=acl-list-form data-acltype=${aclname[acl]} data-action=allow>
								<label>허용 대상: </label><br>
								<div class=acl-controller>
									<select style="width: 100%;" type=text class="form-control acl-value">
										${permopts}
									</select>
									<label><input type=checkbox name=not> 선택대상의 반대</label> <label title="ACL은 기본적으로 거부가 우선적으로 작동합니다."><input type=checkbox name=high> 높은 우선순위</label>
								
									<span style="float: right;">
										<button style="width: 50px;" type=button class="btn btn-primary btn-sm addbtn">추가</button>
										<button style="width: 50px;" type=button class="btn btn-danger  btn-sm delbtn">삭제</button>
									</span>
								</div>
								
								<select size=16 style="height: 250px;" class="form-control acl-list">
									${ret1}
								</select>
							</div>
							
							<div style="width: 49.5%; float: right;" class=acl-list-form data-acltype=${aclname[acl]} data-action=deny>
								<label>거부 대상: </label><br>
								<div class=acl-controller>
									<select style="width: 100%;" type=text class="form-control acl-value">
										${permopts}
									</select>
									<label><input type=checkbox name=not> 선택대상의 반대</label>
									<label></label>
								
									<span style="float: right;">
										<button style="width: 50px;" type=button class="btn btn-primary btn-sm addbtn">추가</button>
										<button style="width: 50px;" type=button class="btn btn-danger  btn-sm delbtn">삭제</button>
									</span>
								</div>
								
								<select size=16 style="height: 250px;" class="form-control acl-list">
									${ret2}
								</select>
							</div>
						</div>
					</div>
				`;
			}
			
			if(!req.query['nojs'] && !(!req.query['nojs'] && compatMode(req))) {
				content += `
					<noscript>
						<meta http-equiv=refresh content="0; url=?nojs=1" />
					</noscript>
				`;
			}
			
			res.send(await render(req, title, content, {
				st: 8
			}, ' (ACL)', _, 'acl'));
		break; default:
			await require('./plugins/' + acltyp + '/index.js')['codes']['aclControlPanel'](req, res);
	}
});

/*
wiki.get('/t', function(q, s) {
	s.send('<form method=post><input type=checkbox name=c><input type=checkbox name=c><input type=checkbox name=c><input type=checkbox name=c><button>Submit</sbutton></form>');
});

wiki.post('/t', function(q, s) {
	console.log(q.body['c']);
	console.log(typeof q.body['c']);
	
	s.send(q.body['c']);
});
*/

wiki.post(/^\/acl\/(.*)/, async function setACL(req, res) {
	const acltyp = config.getString('acl_type', 'action-based');
	
	switch(acltyp) {
		case 'action-based':
			const title = req.params[0];
			
			const action = req.body['action'];
			const type   = req.body['type'];
			const value  = req.body['value'];
			const mode   = req.body['mode'];
			const not    = req.body['not'] == 'on' ? '1' : '0';
			const high   = req.body['high'] == 'on' ? '1' : '0';
			
			if(!action || !type || !value || !mode || !not) {
				res.send(await showError(req, 'invalid_request_body'));
				return;
			}
			
			if(!action || !type || !value || !mode || !not) {
				res.send(await showError(req, 'invalid_value'));
				return;
			}
			
			if(!getperm('acl', ip_check(req))) {
				res.send(await showError(req, 'insufficient_privileges'));
				return;
			}
			
			switch(mode) {
				case 'add':
					await curs.execute("insert into acl (title, action, value, type, notval, hipri) values (?, ?, ?, ?, ?, ?)", [
						title, action, value, type, not, high
					]);
				break;case 'remove':
					await curs.execute("delete from acl where value = ? and title = ? and notval = ? and type = ? and action = ? and hipri = ?", [
						value, title, not, type, action, high
					]);
			}
			
			var rev = 1;
			
			var dbdata = await curs.execute("select rev from history where title = ? order by CAST(rev AS INTEGER) desc limit 1", [title]);
			try {
				rev = Number(dbdata[0]['rev']) + 1;
			} catch(e) {
				rev = 0 + 1;
			}
			
			var dc = '';
			
			const asdf = await curs.execute("select content from documents where title = ?", [title]);
			
			if(asdf.length) dc = asdf[0]['content'];
			
			await curs.execute("insert into history (title, content, rev, username, time, changes, log, iserq, erqnum, ismember, advance) \
							values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
				title, dc, rev, ip_check(req), getTime(), '0', '', '0', '-1', islogin(req) ? 'author' : 'ip', `(ACL ${mode == 'add' ? '추가' : '삭제'} - ${type}:${action == 'deny' ? '거부' : '허용'}:${html.escape(value)})`
			]);
			
			var retval = '';
			
			var dbdata = await curs.execute("select value, notval from acl where action = ? and title = ? and type = ? order by value", [
				action, title, type
			]);
			
			for(var acl of dbdata) {
				retval += `<option>${acl['not'] == '1' ? 'not ' : ''}${acl['value']}</option>`;
			}
			
			if(req.query['nojs'] == '1') {
				res.redirect('/acl/' + encodeURIComponent(title) + '?nojs=1');
			} else {
				res.send(retval);
			}
		break; default:
			await require('./plugins/' + acltyp + '/index.js')['codes']['setacl'](req, res);
	}
});