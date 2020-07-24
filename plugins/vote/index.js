// 필수 코드 시작 //
const render = require('./../../server.js').render;
const conn = require('./../../server.js').conn;
const curs = require('./../../server.js').curs;
const ip_check = require('./../../server.js').ip_check;
const ip_pas = require('./../../server.js').ip_pas;
const html = require('./../../server.js').html;
const ban_check = require('./../../server.js').ban_check;
const config = require('./../../server.js').config;
const getperm = require('./../../server.js').getperm;
const showError = require('./../../server.js').showError;
const toDate = require('./../../server.js').toDate;
const generateTime = require('./../../server.js').generateTime;
const timeFormat = require('./../../server.js').timeFormat;
const islogin = require('./../../server.js').islogin;
const stringInFormat = require('./../../server.js').stringInFormat;
const timeout = require('./../../server.js').timeout;
// 필수 코드 종료 //

// 추가적으로 사용할 함수가 있으면 여기에 쓴다. 없으면 쓰지 않는다.
function parseDatetime(date, time) {
	const dateString = `${date} ${time}:00`;
	
	if(!stringInFormat(/^\d{1,}[-]\d{2,2}[-]\d{2,2}$/, date) || !stringInFormat(/^\d{2,2}[:]\d{2,2}$/, time)) {
		return 'error';
	}
	
	if(isNaN(Date.parse(dateString))) {
		return 'error';
	}
	
	return new Date(dateString).getTime();
}

module.exports = {
	// 라우트 주소 목록
	// 문자열 대신 정규식 가능; 이미 존재하는 페이지(최근변경 등)도 오버라이딩 가능
	urls: ['/vote/:num', '/vote/:num', '/admin/create_vote', '/admin/create_vote'],
	codes: [
		// 라우트 주소 목록과 동일한 순서로 써야함.
		{
			method: 'get',  // 요청 메쏘드
			code: async function(req, res) {  // 라우터 코드
				const num = req.params['num'];
				
				await curs.execute("select name, start, end, required_date, options from elections where num = ?", [num]);
				const _0xca72b4 = curs.fetchall();
				
				if(!_0xca72b4.length) {
					res.send(await showError(req, 'election_not_found'));
					return;
				}
				
				const election = _0xca72b4[0];
				
				var content = `
					<p>투표 시작일: ${generateTime(toDate(election['start']), timeFormat)}
					<p>투표 종료일: ${generateTime(toDate(election['end']), timeFormat)}
					<p>투표자 자격: ${generateTime(toDate(election['required_date']), timeFormat)}
					
					<hr>`;
				
				await curs.execute("select data from votedata where num = ? and username = ?", [num, ip_check(req)]);
				const _0x19ab3e = curs.fetchall();
				
				await curs.execute("select time from history where title = ? order by cast(rev as integer) asc limit 1", ['사용자:' + ip_check(req)]);
				const _0xea689c = curs.fetchall();
				
				var registeredDate, requiredDate;
				
				if(_0x19ab3e.length) {
					const myVote = _0x19ab3e[0]['data'];
					content += `<p>내 투표 항목: ${html.escape(myVote)}`;
				}
				
				if(new Date().getTime() > Number(election['ending_date']))
					{
						content += `<p>투표가 끝났습니다.`;
					}
				else if(new Date().getTime() < Number(election['starting_date']))
					{
						content += `<p>투표가 시작되지 않았습니다.`;
					}
				else if(_0xea689c.length && (registeredDate = Number(_0xea689c[0]['time'])) > (Number(requiredDate = election['starting_date'])))
					{
						content += `<p>${generateTime(requiredDate, timeFormat)} 이전에 가입해야 합니다. 당신은 ${generateTime(registeredDate, timeFormat)}에 가입하였습니다.`;
					}
				else if(!islogin(req))
					{
						content += '<p>투표하려면 로그인하십시오.';
					}
				else if(!_0x19ab3e.length)
					{
						var options = '';
						
						for(opt of election['options'].split('\n')) {
							options += `<label><input type=radio name=voteval value="${html.escape(opt)}"> ${html.escape(opt)}</label><br />`;
						}
						
						content += `
							<form method=post onsubmit="return confirm('제출하면 변경 혹은 취소할 수 없습니다.');">
								<h4>투표하기</h4>
								
								<div class=form-group>
									${options}
								</div>
								
								<div class=btns>
									<button type=submit class="btn btn-info" style="width: 100px;">제출</button>
								</div>
							</form>
						`;
					}
					
				res.send(await render(req, election['name'], content));
			}
		},
		{
			method: 'post',
			code: async function(req, res) {
				const num = req.params['num'];
				
				await curs.execute("select name, start, end, required_date, options from elections where num = ?", [num]);
				const _0xca72b4 = curs.fetchall();
				
				if(!_0xca72b4.length) {
					res.send(await showError(req, 'election_not_found'));
					return;
				}
				
				const election = _0xca72b4[0];
				
				await curs.execute("select time from history where title = ? order by cast(rev as integer) asc limit 1", ['사용자:' + ip_check(req)]);
				const _0xea689c = curs.fetchall();
				
				var registeredDate, requiredDate;
				
				if(new Date().getTime() > Number(election['ending_date']))
					{
						res.send(await showError(req, 'election_ended')); return;
					}
				else if(new Date().getTime() < Number(election['starting_date']))
					{
						res.send(await showError(req, 'election_not_started')); return;
					}
				else if(_0xea689c.length && (registeredDate = Number(_0xea689c[0]['time'])) > (Number(requiredDate = election['starting_date'])))
					{
						res.send(await showError(req, 'not_meeting_requirements')); return;
					}
				else if(!islogin(req))
					{
						res.send(await showError(req, 'not_logged_in')); return;
					}
				else if(!_0x19ab3e.length)
					{
						const val = req.body['voteval'];
						
						if(!val) {
							res.send(await showError(req, 'invalid_request_body')); return;
						}
						
						curs.execute("insert into votedata (data, username, date, num) values (?, ?, ?, ?)", [
							val, ip_check(req), new Date().getTime(), num
						]);
						
						timeout(2000);
						
						res.redirect('/vote/' + num);
					}
			}
		},
		{
			method: 'get',
			code: async function(req, res) {
				if(!getperm('create_vote', ip_check(req))) {
					res.send(await showError(req, 'insufficient_privileges'));
					return;
				}
				
				var content = `
					<form method=post>
						<div class=form-group>
							<label>투표 제목: </label><br>
							<input type=text name=title class=form-control>
						</div>
						
						<div class=form-group>
							<label>시작 날짜: </label><br>
								<!-- placeholder: 구버전 브라우저 배려 -->
							<input group=expiration type=date name=start-date placeholder="YYYY-MM-DD" class=form-control style="display: inline-block; width: auto;">
							<input group=expiration type=time name=start-time placeholder="HH:MM" class=form-control style="display: inline-block; width: auto;">
						</div>
						
						<div class=form-group>
							<label>종료 날짜: </label><br>
								<!-- placeholder: 구버전 브라우저 배려 -->
							<input group=expiration type=date name=end-date placeholder="YYYY-MM-DD" class=form-control style="display: inline-block; width: auto;">
							<input group=expiration type=time name=end-time placeholder="HH:MM" class=form-control style="display: inline-block; width: auto;">
						</div>
						
						<div class=form-group>
							<label>투표 자격<sup><a title="지정한 나라 이전 가입 사용자만 투표 가능">[?]</a></sup>: </label><br>
								<!-- placeholder: 구버전 브라우저 배려 -->
							<input group=expiration type=date name=required-date placeholder="YYYY-MM-DD" class=form-control style="display: inline-block; width: auto;">
							<input group=expiration type=time name=required-time placeholder="HH:MM" class=form-control style="display: inline-block; width: auto;">
						</div>
						
						<div class=form-group>
							<label>투표 옵션(한 줄에 하나): </label><br>
							<textarea class=form-control name=options></textarea>
						</div>
						
						<div class=btns>
							<button type=submit class="btn btn-info" style="width: 100px;">확인</button>
						</div>
					</form>
				`;
				
				res.send(await render(req, '투표 등록', content));
			}
		},
		{
			method: 'post',
			code: async function(req, res) {
				if(!getperm('create_vote', ip_check(req))) {
					res.send(await showError(req, 'insufficient_privileges'));
					return;
				}
				
				const title = req.body['title'];
				
				var options = req.body['options'];
				
				if(!title || !options || !req.body['start-date'] || !req.body['start-time'] || !req.body['required-date'] || !req.body['required-time'] || !req.body['end-date'] || !req.body['end-time']) {
					res.send(await showError(req, 'invalid_request_body')); return;
				}
				
				if(!options.includes('\n') && !options.includes('\r'))  // 매킨토시
					{
						options = options.replace(/\r/g, '\n');
					}
				else if(options.includes('\n') && !options.includes('\r'))  // 도스나 윈도우
					{
						options = options.replace(/\r/g, '');
					}
				
				const startingDate = parseDatetime(req.body['start-date'],    req.body['start-time']);
				const endingDate   = parseDatetime(req.body['end-date'],      req.body['end-time']);
				const requiredDate = parseDatetime(req.body['required-date'], req.body['required-time']);
				
				await curs.execute("select num from elections order by cast(num as integer) desc limit 1");
				const _0x6fac9b = curs.fetchall();
				
				const num = String(_0x6fac9b.length ? Number(_0x6fac9b[0]['num']) + 1 : 1);
				
				curs.execute("insert into elections (num, name, start, end, required_date, options) \
								values (?, ?, ?, ?, ?, ?)", [num, title, startingDate, endingDate, requiredDate, options]);
				
				timeout(2000);
				
				res.redirect('/vote/' + num);
			}
		}
	],
	// 권한 부여(grant) 페이지에서 다음 권한 부여 가능
	permissions: ['create_vote'],
	// DB를 쓴다면...
	create_table: {
		'elections': ['num', 'name', 'start', 'end', 'required_date', 'options'],
		'votedata': ['data', 'username', 'date', 'num']
	}
}
