// 필수 코드 시작 //
const {
	render, conn, curs, ip_check, ip_pas, html, ban_check, config, getperm, 
	showError, getTime, toDate, generateTime, timeFormat, islogin, stringInFormat, 
	timeout, generateCaptcha, validateCaptcha, alertBalloon
} = require('./../../index.js');
// 필수 코드 종료 //

const theseed = require('./theseed.js');

module.exports = {
	urls: [/\/import\/(.*)/, /\/import\/(.*)/],
	codes: [
		{
			method: 'get',
			code: async function(req, res) {
				const title = req.params[0] || '';
				
				if(!getperm(req, 'import_history', ip_check(req))) {
					return res.send(await showError(req, 'insufficient_permissions'));
				}
				
				var content = `
					<form method=post>
						${alertBalloon('[경고!]', '이 위키와 동일한 라이선스의 위키의 역사만 포크하십시오. 또한 리비전 수에 따라 1분 이상 소요될 수 있습니다(오랜 시간동안 브라우저에서 로딩 표시가 나오는 것은 정상입니다). 완료되면 자동으로 역사 페이지로 이동됩니다.', 'success', 0)}
					
						<div class=form-group>
							<label>위키 엔진: <label><br />
							<select name=engine class=form-control>
								<option value="the seed">the seed (4.16.0 이상)</option>
                <option value="the seed2">the seed (4.7.0~4.12.0)</option>
                <option value="opennamu">openNAMU (3.2.0 이상)</option>
							</select>
						</div>
						
						<div class=form-group>
							<label>포크할 위키 이름: <label><br />
							<select name=wikiname class=form-control>
								<option value=a>알파위키</option>
								<option value=t>더시드위키</option>
							</select>
						</div>
						
						<div class=form-group>
							<label>문서 이름: <label><br />
							<input type=text name=title class=form-control value="${html.escape(title)}" />
						</div>
						
						<div class=form-group>
							<label>메모: <label><br />
							<input type=text name=note class=form-control />
						</div>
						
						<div class=btns>
							<button class="btn btn-danger" type=submit style="width: 100px;">포크</button>
						</div>
					</form>
				`;
				
				res.send(await render(req, '역사 포크', content));
			}
		},
		{
			method: 'post',
			code: async function(req, res) {
				if(!req.body['title']) {
					return res.send(await showError(req, 'invalid_request_body'));
				}
				
				if(!getperm(req, 'import_history', ip_check(req))) {
					return res.send(await showError(req, 'insufficient_permissions'));
				}
				
				const doctitle = req.body['title'];
				
				switch(req.body['engine']) {
					case 'the seed':
						var wiki;
				
						if(doctitle.match(/^(파일|사용자)[:]/)) {
							return res.send(await showError(req, 'invalid_namespace'));
						}
						
						try {
							wiki = theseed(req.body['wikiname']);
						} catch(e) {
							return res.send(await showError(req, 'invalid_request_body'));
						}
						
						const wikiname = ({
							'a': '알파위키',
							't': '더시드위키'
						})[req.body['wikiname']] || null;
						
						if(!wikiname) {
							return res.send(await showError(req, 'invalid_request_body'));
						}
						
						var prefix = '';
						switch(wiki.wikiname) {
							case 'alphawiki': prefix = 'A:';
							break; case 'theseedwiki': prefix = 'T:';
						}
						
						wiki.on('ready', () => {
							wiki.exportHistory(doctitle)
							.then(async history => {
								if(!history.length) {
									return res.send(await showError(req, 'document_not_found'));
								}
								
								const dbd = await curs.execute("select title from history where title = ?", [doctitle]);
								if(dbd.length) {
									return res.send(await showError(req, 'history_exists'));
								}
								
								await curs.execute("insert into history (title, content, rev, username, time, changes, log, iserq, erqnum, ismember, advance) \
												values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
									doctitle, '', '1', ip_check(req), getTime(), ('0'), `[${wikiname}의 ${doctitle} 문서 포크] ${req.body['note'] || ''}`, '0', '-1', islogin(req) ? 'author' : 'ip', ''
								]);
								
								for(item of history) {
									const raw = await wiki.fetchRAW(doctitle, item.rev);
									var advance = '';
									
									switch(item.type) {
										case 'create':
											advance = '(새 문서)';
										break; case 'delete':
											advance = '(삭제)';
										break; case 'move':
											advance = '(이동)';
										break; case 'revert':
											advance = '(r' + item.target_rev + '로 되돌림)';
									}
									
									await curs.execute("insert into history (title, content, rev, username, time, changes, log, iserq, erqnum, ismember, advance) \
													values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
										doctitle, raw, String(Number(item.rev) + 1), (item.username.match(/^[A-Z][:]/) ? item.username : (prefix + item.username)), item.datetime, (Number(item.changes) > 0 ? '+' : '') + String(item.changes), `[리비전 ${item.rev}] ${item.log} `, '0', '-1', item.usertype, advance
									]);
								}
								
								if(await wiki.exists(doctitle)) {
									await curs.execute("insert into documents (title, content) values (?, ?)", [doctitle, await wiki.fetchRAW(doctitle)]);
								}
								
								return res.redirect('/history/' + doctitle);
							})
							.catch(async e => {
								console.log(e);
								return res.send(await showError(req, 'internal_error'));
							});
						});
					break; default:
						return res.send(await showError(req, 'invalid_request_body'));
				}
			}
		}
	],
	permissions: ['import_history'],
	permission_descriptions: {
		'import_history': '역사 가져오기'
	},
	create_table: {
	}
};
