// 바나나 엔진 버전 1.1

const perms = [
	'admin', 'ban_user', 'developer', 'update_thread_document',
	'update_thread_status', 'update_thread_topic', 'hide_thread_comment', 'grant',
	'login_history', 'delete_thread', 'acl'
];

function print(x) { console.log(x); }
function prt(x) { process.stdout.write(x); }

function beep(cnt = 1) { // 경고음 재생
	for(var i=1; i<=cnt; i++)
		prt("");
}

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function rndval(chars, length) {
	var result           = '';
	var characters       = chars;
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

const timeFormat = 'Y-m-d H:i:s';

const inputReader = require('wait-console-input'); // 입력받는 라이브러리

function input(p) {
	prt(p); // 일부러 이렇게. 바로하면 한글 깨짐.
	return inputReader.readLine('');
}

const exec = eval;

const { SHA3 } = require('sha3');
 
const hash = new SHA3(512);

function sha3(p) {
	hash.update(p);
	return hash.digest('hex');
}

// VB6 함수 모방
function Split(str, del) { return str.split(del); }; const split = Split;
function Replace(str, rgx, rpl) { return str.replace(rgx, rpl); }; const replace = Replace;
function UCase(s) { return s.toUpperCase(); }; const ucase = UCase;
function LCase(s) { return s.toUpperCase(); }; const lcase = LCase;

const sqlite3 = require('sqlite3').verbose(); // SQLite 라이브러리 호출
const conn = new sqlite3.Database('./wikidata.db', (err) => {}); // 데이타베이스 연결

// https://blog.pagesd.info/2019/10/29/use-sqlite-node-async-await/
conn.query = function (sql, params) {
	var that = this;
		return new Promise(function (resolve, reject) {
		that.all(sql, params, function asyncSQLRun(error, rows) {
			if (error)
				reject(error);
			else
				resolve(rows);
		});
	});
};

// 파이선 SQLite 모방
conn.commit = function() {};
conn.sd = [];

const curs = {
	execute: async function executeSQL(sql = '', params = []) {
		if(UCase(sql).startsWith("SELECT")) {
			const retval = await conn.query(sql, params);
			conn.sd = retval;
			
			return retval;
		} else {
			conn.run(sql, params, err => { beep(3); });
		}
		
		return [];
	},
	fetchall: function fetchSQLData() {
		return conn.sd;
	}
};

const express = require('express');
const session = require('express-session');
const swig = require('swig'); // swig 호출

const wiki = express();

function getTime() { return Math.floor(new Date().getTime()); }; const get_time = getTime;

function toDate(t) {
	var date = new Date(Number(t));
	
	var hour = date.getHours(); hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes(); min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds(); sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1; month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate(); day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}

function generateTime(time, fmt) {
	const d = split(time, ' ')[0];
	const t = split(time, ' ')[1];
	
	return `<time datetime="${d}T${t}.000Z" data-format="${fmt}">${time}</time>`;
}

swig.setFilter('encode_userdoc', function encodeUserdocURL(input) {
	return encodeURI('사용자:' + input);
});

swig.setFilter('encode_doc', function encodeDocURL(input) {
	return encodeURI(input);
});

swig.setFilter('to_date', toDate);

swig.setFilter('localdate', generateTime);

wiki.use(session({
	key: 'sid',
	secret: 'secret',
	cookie: {
		expires: false
	}
}));

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

wiki.use(bodyParser.json());
wiki.use(bodyParser.urlencoded({ extended: true }));
wiki.use(upload.array()); 
wiki.use(express.static('public'));

const fs = require('fs');

var wikiconfig = {};
var permlist = {};

var hostconfig;
try { hostconfig = require('./config.json'); }
catch(e) {
	print("병아리 엔진: the seed 모방 프로젝트에 오신것을 환영합니다.");
	print("버전 4.5.5 [디버그] - 테스트 목적으로만 사용됩니다.");
	print("고의적으로 배포하지 마십시오.");
	
	prt('\n');
	
	hostconfig = {
		host: input("호스트 주소: "),
		port: input("포트 번호: "),
		skin: input("기본 스킨 이름: ")
	};
	
	const tables = {
		'documents': ['title', 'content'],
		'history': ['title', 'content', 'rev', 'time', 'username', 'changes', 'log', 'iserq', 'erqnum', 'advance', 'ismember'],
		'namespaces': ['namespace', 'locked', 'norecent', 'file'],
		'users': ['username', 'password'],
		'user_settings': ['username', 'key', 'value'],
		'acl': ['title', 'no', 'type', 'content', 'action', 'expire'],
		'nsacl': ['namespace', 'no', 'type', 'content', 'action', 'expire'],
		'config': ['key', 'value'],
		'email_filters': ['address'],
		'stars': ['title', 'username', 'lastedit'],
		'perms': ['perm', 'username'],
		'threads': ['title', 'topic', 'status', 'time', 'tnum'],
		'res': ['id', 'content', 'username', 'time', 'hidden', 'hider', 'status', 'tnum', 'ismember', 'isadmin'],
		'useragents': ['username', 'string'],
		'login_history': ['username', 'ip'],
		'account_creation': ['key', 'email', 'time']
	};
	
	for(var table in tables) {
		var sql = '';
		sql = `CREATE TABLE ${table} ( `;
		
		for(col of tables[table]) {
			sql += `${col} TEXT DEFAULT '', `;
		}
		
		sql = sql.replace(/[,]\s$/, '');		
		sql += `)`;
		
		curs.execute(sql);
	}
	
	fs.writeFile('config.json', JSON.stringify(hostconfig), 'utf8', (e) => { beep(2); });
}

function markdown(content) {
	// ([^제외]*)
	
	ret = content;
	
	ret = html.escape(ret);
	
	ret = ret.replace(/[_][_]([^_]*)[_][_]/gi, '<u>$1</u>');
	
	ret = ret.replace(/[*][*][*]([^\*]*)[*][*][*]/gi, '<strong><i>$1</i></strong>');
	ret = ret.replace(/[*][*]([^\*]*)[*][*]/gi, '<strong>$1</strong>');
	ret = ret.replace(/[*]([^\*]*)[*]/gi, '<i>$1</i>');
	
	ret = ret.replace(/^[-]\s[-]\s[-]$/gim, '<hr />');
	ret = ret.replace(/^[*]\s[*]\s[*]$/gim, '<hr />');
	ret = ret.replace(/^[*][*][*][*][*]$/gim, '<hr />');
	ret = ret.replace(/^[*][*][*]$/gim, '<hr />');
	ret = ret.replace(/^[-]{3,80}$/gim, '<hr />');
	
	//ret = ret.replace(/[*]\s([^\*]*)/gim, '<li>$1</li>');
	//ret = ret.replace(/[-]\s([^[-]]*)/gim, '<li>$1</li>');
	
	ret = ret.replace(/^[#][#][#][#][#][#]\s{0,80}([^\n]*)/gim, '<h6 class=wiki-heading>-. $1</h6>');
	ret = ret.replace(/^[#][#][#][#][#]\s{0,80}([^\n]*)/gim, '<h5 class=wiki-heading>-. $1</h5>');
	ret = ret.replace(/^[#][#][#][#]\s{0,80}([^\n]*)/gim, '<h4 class=wiki-heading>-. $1</h4>');
	ret = ret.replace(/^[#][#][#]\s{0,80}([^\n]*)/gim, '<h3 class=wiki-heading>-. $1</h3>');
	ret = ret.replace(/^[#][#]\s{0,80}([^\n]*)/gim, '<h2 class=wiki-heading>-. $1</h2>');
	ret = ret.replace(/^[#]\s{0,80}([^\n]*)/gim, '<h1 class=wiki-heading>-. $1</h1>');
	
	// ret = ret.replace(/^([^\n]*)(\r|)\n[=]{4,180}/gi, '<h2 class=wiki-heading>-. $1</h1>');
	// ret = ret.replace(/^([^\n]*)(\r|)\n[-]{4,180}/gi, '<h1 class=wiki-heading>-. $1</h2>');
	
	ret = ret.replace(/[`][`][`]([^[`]]*)[`][`][`]/gi, '<pre>$1</pre>');
	ret = ret.replace(/[`]([^[`]]*)[`]/gi, '<code>$1</code>');
	
	return ret;
}

function islogin(req) {
	if(req.session.username) return true;
	return false;
}

function getUsername(req, forceIP = 0) {
	if(!forceIP && req.session.username) {
		return req.session.username;
	} else {
		if(req.headers['x-forwarded-for']) {
			return req.headers['x-forwarded-for'];
		} else {
			try {
				return req.connection.remoteAddress;
			} catch(e) {
				return '???';
			}
		}
	}
}

const ip_check = getUsername; // 오픈나무를 오랫동안 커스텀하느라 이 함수명에 익숙해진 바 있음

const config = {
	getString: function(str, def = '') {
		str = str.replace(/^wiki[.]/, '');
		
		if(typeof(wikiconfig[str]) == 'undefined') return def;
		return wikiconfig[str];
	}
}

const _ = undefined;

function getSkin() {
	return hostconfig['skin'];
}

async function getperm(perm, username) {
	await curs.execute("select perm from perms where username = ? and perm = ?", [username, perm]);
	if(curs.fetchall().length) {
		return true;
	}
	return false;
}

function render(req, title = '', content = '', varlist = {}, subtitle = '', error = false, viewname = '') {
	const skinInfo = {
		title: title + subtitle,
		viewName: viewname
	};
	
	const perms = {
		has: function(perm) {
			try {
				return permlist[ip_check(req)].includes(perm)
			} catch(e) {
				return false;
			}
		}
	}
	
	try {
		var template = swig.compileFile('./skins/' + getSkin() + '/views/default.html');
	} catch(e) {
		print(`[오류!] ${e}`);
		
		return `
			<title>` + title + ` (프론트엔드 오류!)</title>
			<meta charset=utf-8>` + content;
	}

	var output;
	var templateVariables = varlist;
	templateVariables['skinInfo'] = skinInfo;
	templateVariables['config'] = config;
	templateVariables['content'] = content;
	templateVariables['perms'] = perms;
	templateVariables['url'] = req.path;
	
	if(islogin(req)) {
		templateVariables['member'] = {
			username: req.session.username
		}
	}
	
	if(viewname != '') {
		templateVariables['document'] = title;
	}
	
	output = template(templateVariables);
	
	var header = '<html><head>';
	var skinconfig = require("./skins/" + getSkin() + "/config.json");
	header += `
		<title>${title}${subtitle} - ${config.getString('site_name', 'Wiki')}</title>
		<meta charset=utf-8>
		<meta name=generator content=banana>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link rel="stylesheet" href="/css/diffview.css">
		<link rel="stylesheet" href="/css/katex.min.css">
		<link rel="stylesheet" href="/css/wiki.css">
	`;
	for(var i=0; i<skinconfig["auto_css_targets"]['*'].length; i++) {
		header += '<link rel=stylesheet href="/skins/' + getSkin() + '/' + skinconfig["auto_css_targets"]['*'][i] + '">';
	}
	header += `
		<script type="text/javascript" src="/js/jquery-2.1.4.min.js"></script>
		<script type="text/javascript" src="/js/dateformatter.js?508d6dd4"></script>
		<script type="text/javascript" src="/js/intersection-observer.js?36e469ff"></script>
		<script type="text/javascript" src="/js/theseed.js?24141115"></script>
	`;
	for(var i=0; i<skinconfig["auto_js_targets"]['*'].length; i++) {
		header += '<script type="text/javascript" src="/skins/' + getSkin() + '/' + skinconfig["auto_js_targets"]['*'][i]['path'] + '"></script>';
	}
	
	header += skinconfig['additional_heads'];
	header += '</head><body class="';
	for(var i=0; i<skinconfig['body_classes'].length; i++) {
		header += skinconfig['body_classes'][i] + ' ';
	}
	header += '">';
	var footer = '</body></html>';
	
	return header + output + footer;
}

function fetchErrorString(code) {
	const codes = {
		
	};
	
	if(typeof(codes[code]) == 'undefined') return code;
	else return codes[code];
}

function alertBalloon(title, content, type = 'danger', dismissible = true, classes = '') {
	return `
		<div class=alert>
			<div class=alert-title>
				${title}
			</div>
			
			<div class=alert-content>
				<img src="${
					{
						none: '',
						danger: '',
						warning: '',
						info: '',
						success: ''
					}[type]
				}" class=alert-icon> ${content}
			</div>
		</div>`;
}

async function fetchNamespaces() {
	return ['문서', '틀', '분류', '파일', '사용자', 'wiki', '휴지통', '파일휴지통'];
}

function showError(req, code) {
	return render(req, "문제가 발생했습니다!", `<h2>${fetchErrorString(code)}</h2>`);
}

function ip_pas(ip = '', ismember = '') {
	if(ismember == 'author') {
		return `<strong><a href="/w/사용자:${encodeURI(ip)}">${html.escape(ip)}</a></strong>`;
	} else {
		return `<a href="/contribution/ip/${encodeURI(ip)}/document">${html.escape(ip)}</a>`;
	}
}

async function getacl(title, action) {
	return 1;
}

function navbtn(cs, ce, s, e) {
	return '';
}

const html = {
	escape: function(content = '') {
		content = content.replace(/[<]/gi, '&lt;');
		content = content.replace(/[>]/gi, '&gt;');
		content = content.replace(/["]/gi, '&quot;');
		content = content.replace(/[&]/gi, '&amp;');
		
		return content;
	}
}

wiki.get(/^\/skins\/((?:(?!\/).)+)\/(.+)/, function dropSkinFile(req, res) {
	const skinname = req.params[0];
	const filepath = req.params[1];
	
	const afn = split(filepath, '/');
	const fn = afn[afn.length - 1];
	
	var rootp = './skins/' + skinname + '/static';
	var cnt = 0;
	for(dir of afn) {
		rootp += '/' + dir;
	}
	
	res.sendFile(fn, { root: rootp.replace('/' + fn, '') });
});

function dropSourceCode(req, res) {
	res.sendFile('index.js', { root: "./" });
}

wiki.get('/index.js', dropSourceCode);

wiki.get('/js/:filepath', function dropJS(req, res) {
	const filepath = req.param('filepath');
	res.sendFile(filepath, { root: "./js" });
});

wiki.get('/css/:filepath', function dropCSS(req, res) {
	const filepath = req.param('filepath');
	res.sendFile(filepath, { root: "./css" });
});

function redirectToFrontPage(req, res) {
	res.redirect('/w/' + config.getString('frontpage'));
}

wiki.get('/w', redirectToFrontPage);

wiki.get('/', redirectToFrontPage);

wiki.get(/^\/w\/(.*)/, async function viewDocument(req, res) {
	const title = req.params[0];
	
	if(title.replace(/\s/g, '') == '') res.redirect('/w/' + config.getString('frontpage'));
	
	await curs.execute("select content from documents where title = ?", [title]);
	const rawContent = curs.fetchall();

	var content = '';
	
	var httpstat = 200;
	var viewname = 'wiki';
	var error = false;
	
	var lstedt = undefined;
	
	try {
		if(!await getacl(title, 'read')) {
			httpstat = 403;
			error = true;
			res.status(403).send(showError(req, 'insufficient_privileges_read'));
			
			return;
		} else {
			content = markdown(rawContent[0]['content']);
			
			if(title.startsWith("사용자:") && await getperm('admin', title.replace(/^사용자[:]/, ''))) {
				content = `
					<div style="border-width: 5px 1px 1px; border-style: solid; border-color: orange gray gray; padding: 10px; margin-bottom: 10px;" onmouseover="this.style.borderTopColor=\'red\';" onmouseout="this.style.borderTopColor=\'orange\';">
						<span style="font-size: 14pt;">이 사용자는 특수 권한을 가지고 있습니다.</span>
					</div>
				` + content;
			}
			
			await curs.execute("select time from history where title = ? order by cast(rev as integer) desc limit 1", [title]);
			lstedt = Number(curs.fetchall()[0]['time']);
		}
	} catch(e) {
		viewname = 'notfound';
		
		print(`[오류!] ${e}`);
		
		httpstat = 404;
		content = `
			<h2>문서가 존재하지 않습니다. 새로 작성하려면 <a href="/edit/${encodeURI(title)}">여기</a>를 클릭하십시오.</h2>
		`;
	}
	
	res.status(httpstat).send(render(req, title, content, {
		star_count: 0,
		starred: false,
		date: lstedt
	}, _, error, viewname));
});

wiki.get(/^\/edit\/(.*)/, async function editDocument(req, res) {
	const title = req.params[0];
	
	if(!await getacl(title, 'read')) {
		res.status(403).send(showError(req, 'insufficient_privileges_read'));
		
		return;
	}
	
	await curs.execute("select content from documents where title = ?", [title]);
	var rawContent = curs.fetchall();
	
	if(!rawContent[0]) rawContent = '';
	else rawContent = rawContent[0]['content'];
	
	var error = false;
	var content = '';
	
	var baserev;
	
	await curs.execute("select rev from history where title = ? order by CAST(rev AS INTEGER) desc limit 1", [title]);
	try {
		baserev = curs.fetchall()[0]['rev'];
	} catch(e) {
		baserev = 0;
	}
	
	if(!await getacl(title, 'edit')) {
		error = true;
		content = `
			${alertBalloon('권한 부족', '편집 권한이 부족합니다. 대신 <strong><a href="/new_edit_request/' + html.escape(title) + '">편집 요청</a></strong>을 생성하실 수 있습니다.', 'danger', true)}
		
			<textarea id="textInput" name="text" wrap="soft" class="form-control" readonly=readonly>${html.escape(rawContent)}</textarea>
		`;
	} else {
		content = `
			<form method="post" id="editForm" data-title="${title}" data-recaptcha="0">
				<input type="hidden" name="token" value="">
				<input type="hidden" name="identifier" value="${islogin(req) ? 'm' : 'i'}:${ip_check(req)}">
				<input type="hidden" name="baserev" value="${baserev}">

				<ul class="nav nav-pills">
					<li class="nav-item">
						<a class="nav-link active" data-toggle="tab" href="#edit" role="tab">편집기</a>
					</li>
					
					<li class="nav-item">
						<a id="previewLink" class="nav-link" data-toggle="tab" href="#preview" role="tab">미리보기</a>
					</li>
					
					<li class="nav-item">
						<a class="nav-link" data-toggle="tab" href="#delete" role="tab">삭제</a>
					</li>
					
					<li class="nav-item">
						<a class="nav-link" data-toggle="tab" href="#move" role="tab">이동</a>
					</li>
					
					<li class="nav-item">
						<a class="nav-link" data-toggle="tab" href="#upload" role="tab">첨부</a>
					</li>
				</ul>

				<div class="tab-content bordered">
					<div class="tab-pane active" id="edit" role="tabpanel">
						<textarea id="textInput" name="text" wrap="soft" class="form-control">${html.escape(rawContent)}</textarea>
					</div>
					
					<div class="tab-pane" id="preview" role="tabpanel">
						
					</div>
					
					<div class="tab-pane active" id="delete" role="tabpanel">
						<label><input type=checkbox> 문서 제목을 변경하는 것이 아님에 동의합니다.</label>
					</div>
					
					<div class="tab-pane active" id="move" role="tabpanel">
						<div class=form-group>
							<label>새 문서 제목: </label><br>
							<input type=text class=form-control name=newtitle>
						</div>
					</div>
					
					<div class="tab-pane active" id="move" role="tabpanel">
						<div class=form-group>
							<label>화일 선택: </label><br>
							<input class=form-control type=file name=file>
						</div>
						
						<div class=form-group>
							<label>사용할 화일 이름: </label><br>
							<input class=form-control type=text name=document>
						</div>
						
						<div class=form-group>
							<label>화일 정보 및 메모: </label><br>
							<textarea class=form-control name=text rows=20></textarea>
						</div>
						
						<div class=form-group>
							<span style="width: 48%;">
								<label>분류:</label><br>
								<input class=form-control type=text name=category>
								<select class=form-control size=8 placeholder="직접 입력">
									<option>동물</option>
									<option>게임</option>
									<option>컴퓨터</option>
									<option>요리</option>
								</select>
							</span>
							
							<span style="width: 48%;">
								<label>저작권:</label><br>
								<input class=form-control type=text name=license>
								<select class=form-control size=8 placeholder="직접 입력">
									<option>CC-0</option>
									<option>CC BY</option>
									<option>CC BY-NC</option>
									<option>CC BY-NC-ND</option>
									<option>CC BY-NC-SA</option>
									<option>CC BY-ND</option>
									<option>CC BY-SA</option>
									<option>제한적 이용</option>
								</select>
							</span>
						</div>
					</div>
				</div>

				<div class="form-group" style="margin-top: 1rem;">
					<label class="control-label" for="summaryInput">편집 메모:</label>
					<input type="text" class="form-control" id="logInput" name="log" value="">
				</div>
				
				<p style="font-weight: bold;">비로그인 상태로 편집합니다. 편집 역사에 IP(${ip_check(req)})가 영구히 기록됩니다.</p>
				
				<div class="btns">
					<button id="editBtn" class="btn btn-primary" style="width: 100px;">저장</button>
				</div>
			</form>
		`;
	}

	var httpstat = 200;
	
	res.status(httpstat).send(render(req, title, content, {}, ' (편집)', error, 'edit'));
});

wiki.post(/^\/edit\/(.*)/, async function saveDocument(req, res) {
	const title = req.params[0];
	
	if(!await getacl(title, 'edit') || !await getacl(title, 'read')) {
		res.send(showError(req, 'insufficient_privileges_edit'));
		
		return;
	}
	
	await curs.execute("select content from documents where title = ?", [title]);
	var original = curs.fetchall();
	
	if(!original[0]) original = '';
	else original = original[0]['content'];
	
	const content = req.body['text'];
	const rawChanges = content.length - original.length;
	
	const changes = (rawChanges > 0 ? '+' : '') + String(rawChanges);
	
	const log = req.body['log'];
	
	const agree = req.body['agree'];
	
	const baserev = req.body['baserev'];
	
	const ismember = islogin(req) ? 'author' : 'ip';
	
	var advance = '';
	
	await curs.execute("select title from documents where title = ?", [title]);
	
	if(!curs.fetchall().length) {
		advance = '(새 문서)';
		curs.execute("insert into documents (title, content) values (?, ?)", [title, content]);
	} else {
		curs.execute("update documents set content = ? where title = ?", [content, title]);
		curs.execute("update stars set lastedit = ? where title = ?", [getTime(), title]);
	}
	
	curs.execute("insert into history (title, content, rev, username, time, changes, log, iserq, erqnum, ismember, advance) \
					values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
		title, content, String(Number(baserev) + 1), ip_check(req), getTime(), changes, log, '0', '-1', ismember, advance
	]);
	
	res.redirect('/w/' + title);
});

wiki.get('/RecentChanges', async function recentChanges(req, res) {
	var flag = req.query['logtype'];
	if(!flag) flag = 'all';
	
	switch(flag) {
		case 'create':
			await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where not title like '사용자:%' and advance like '(새 문서)' order by cast(time as integer) desc limit 100");
		break;case 'delete':
			await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where not title like '사용자:%' and advance like '(삭제)' order by cast(time as integer) desc limit 100");
		break;case 'move':
			await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where not title like '사용자:%' and advance like '(%이동)' order by cast(time as integer) desc limit 100");
		break;case 'revert':
			await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where not title like '사용자:%' and advance like '(%되돌림)' order by cast(time as integer) desc limit 100");
		break;default:
			await curs.execute("select title, rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where not title like '사용자:%' order by cast(time as integer) desc limit 100");
	}
	
	if(!curs.fetchall().length) return showError(req, 'document_dont_exists');
	
	var content = `
		<ol class="breadcrumb link-nav">
			<li><a href="?logtype=all">[전체]</a></li>
			<li><a href="?logtype=edit">[일반 편집]</a></li>
			<li><a href="?logtype=create">[새 문서]</a></li>
			<li><a href="?logtype=delete">[삭제]</a></li>
			<li><a href="?logtype=move">[이동]</a></li>
			<li><a href="?logtype=revert">[되돌림]</a></li>
			<li><a href="?logtype=acl">[ACL 조정]</a></li>
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
						<a href="/w/${encodeURI(row['title'])}">${html.escape(row['title'])}</a> 
						<a href="/history/${encodeURI(row['title'])}">[역사]</a> 
						${
								Number(row['rev']) > 1
								? '<a \href="/diff/' + encodeURI(row['title']) + '?rev=' + row['rev'] + '&oldrev=' + String(Number(row['rev']) - 1) + '">[비교]</a>'
								: ''
						} 
						<a href="/discuss/${encodeURI(row['title'])}">[토론]</a> 
						
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
	
	res.send(render(req, '최근 변경내역', content, {}));
});

wiki.get(/^\/contribution\/(ip|author)\/(.*)\/document/, async function documentContributionList(req, res) {
	const ismember = req.params[0];
	const username = req.params[1];
	
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
						<a href="/w/${encodeURI(row['title'])}">${html.escape(row['title'])}</a> 
						<a href="/history/${encodeURI(row['title'])}">[역사]</a> 
						${
								Number(row['rev']) > 1
								? '<a \href="/diff/' + encodeURI(row['title']) + '?rev=' + row['rev'] + '&oldrev=' + String(Number(row['rev']) - 1) + '">[비교]</a>'
								: ''
						} 
						<a href="/discuss/${encodeURI(row['title'])}">[토론]</a> 
						
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
	
	res.send(render(req, `${username}의 문서 기여 목록`, content, {}));
});

wiki.get('/RecentDiscuss', async function recentDicsuss(req, res) {
	var logtype = req.query['logtype'];
	if(!logtype) logtype = 'all';
	
	var content = `
		<ol class="breadcrumb link-nav">
			<li><a href="?logtype=normal_thread">[열린 토론]</a></li>
			<li><a href="?logtype=old_thread">[오래된 토론]</a></li>
			<li><a href="?logtype=closed_thread">[닫힌 토론]</a></li>

			<li><a href="?logtype=open_editrequest">[열린 편집 요청]</a></li>
			<li><a href="?logtype=accepted_editrequest">[승인된 편집 요청]</a></li>
			<li><a href="?logtype=closed_editrequest">[닫힌 편집 요청]</a></li>
		</ol>
		
		<table class="table table-hover">
			<colgroup>
				<col>
				<col style="width: 22%; min-width: 100px;">
			</colgroup>
			<thead>
				<tr>
					<th>항목</th>
					<th>시간</th>
				</tr>
			</thead>
			
			<tbody id>
	`;
	
	switch(logtype) {
		case 'normal_thread':
			await curs.execute("select title, topic, time, tnum from threads where status = 'normal' order by cast(time as integer) desc limit 120");
		break;case 'old_thread':
			await curs.execute("select title, topic, time, tnum from threads where status = 'normal' order by cast(time as integer) asc limit 120");
		break;case 'closed_thread':
			await curs.execute("select title, topic, time, tnum from threads where status = 'close' order by cast(time as integer) desc limit 120");
		break;default:
			await curs.execute("select title, topic, time, tnum from threads where status = 'normal' order by cast(time as integer) desc limit 120");
	}
	
	const trds = curs.fetchall();
	
	for(trd of trds) {
		content += `
			<tr>
				<td>
					<a href="/thread/${trd['tnum']}">${html.escape(trd['topic'])}</a> (<a href="/discuss/${encodeURI(trd['title'])}">${html.escape(trd['title'])}</a>)
				</td>
				
				<td>
					${generateTime(toDate(trd['time']), timeFormat)}
				</td>
			</tr>
		`;
	}
	
	content += `
			</tbody>
		</table>
	`;
	
	res.send(render(req, "최근 토론", content, {}));
});

wiki.get(/^\/contribution\/(ip|author)\/(.*)\/discuss/, async function discussionLog(req, res) {
	const ismember = req.params[0];
	const username = req.params[1];
	
	await curs.execute("select id, tnum, time, username, ismember from res \
				where cast(time as integer) >= ? and ismember = ? and username = ? order by cast(time as integer) desc", [
					Number(getTime()) - 2592000000, ismember, username
				]);
	
//			<li><a href="/contribution/${ismember}/${username}/document">[문서]</a></li>
//			<li><a href="/contribution/${ismember}/${username}/discuss">[토론]</a></li>
	
	var content = `
		<p>최근 30일동안의 기여 목록입니다.</p>
	
		<ol class="breadcrumb link-nav">
			<li><a href="/contribution/${ismember}/${username}/document">[문서]</a></li>
			<li><strong>[토론]</strong></li>
		</ol>
		
		<table class="table table-hover">
			<colgroup>
				<col>
				<col style="width: 25%;">
				<col style="width: 22%;">
			</colgroup>
			
			<thead id>
				<tr>
					<th>토론</th>
					<th>시간</th>
				</tr>
			</thead>
			
			<tbody id>
	`;
	
	const dd = curs.fetchall();
	
	for(row of dd) {
		await curs.execute("select title, topic from threads where tnum = ?", [row['tnum']]);
		const td = curs.fetchall()[0];
		
		content += `
				<tr>
					<td>
						<a href="/thread/${row['tnum']}">#${row['id']} ${html.escape(td['topic'])}</a> (<a href="/w/${encodeURI(td['title'])}">${html.escape(td['title'])}</a>)
					</td>
					
					<td>
						${generateTime(toDate(row['time']), timeFormat)}
					</td>
				</tr>
		`;
	}
	
	content += `
			</tbody>
		</table>
	`;
	
	res.send(render(req, `${username}의 토론 참여 내역`, content, {}));
});

wiki.get(/^\/history\/(.*)/, async function viewHistory(req, res) {
	const title = req.params[0];
	const from = req.query['from'];
	const until = req.query['until'];
	
	if(!await getacl(title, 'read')) {
		res.send(showError('insufficient_privileges_read'));
		
		return;
	}
	
	if(from) { // 더시드에서 from이 더 우선임
		await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and (cast(rev as integer) <= ? AND cast(rev as integer) > ?) \
						order by cast(rev as integer) desc",
						[title, Number(from), Number(from) - 30]);
	} else if(until) {
		await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and (cast(rev as integer) >= ? AND cast(rev as integer) < ?) \
						order by cast(rev as integer) desc",
						[title, Number(until), Number(until) + 30]);
	} else {
		await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? order by cast(rev as integer) desc limit 30",
						[title]);
	}
	
	if(!curs.fetchall().length) res.send(showError(req, 'document_dont_exists'));
	
	const navbtns = navbtn(0, 0, 0, 0);
	
	var content = `
		<table class="table table-hover">
			<thead>
				<tr>
					<td>
						버전
					</td>
					
					<td>
						수정자 이름
					</td>
					
					<td>
						시간
					</td>
				</tr>
			</thead>
			
			<tbody id>
	`;
	
	for(row of curs.fetchall()) {
		content += `
				<tr>
					<td>
						<strong>r${row['rev']}</strong> | <a rel=nofollow href="/w/${encodeURI(title)}?rev=${row['rev']}">보기</a> |
							<a rel=nofollow href="/raw/${encodeURI(title)}?rev=${row['rev']}" data-npjax="true">RAW</a> |
							<a rel=nofollow href="/blame/${encodeURI(title)}?rev=${row['rev']}">Blame</a> |
							<a rel=nofollow href="/revert/${encodeURI(title)}?rev=${row['rev']}">이 리비젼으로 되돌리기</a>${
								Number(row['rev']) > 1
								? ' | <a rel=nofollow href="/diff/' + encodeURI(title) + '?rev=' + row['rev'] + '&oldrev=' + String(Number(row['rev']) - 1) + '">비교</a>'
								: ''
							}
							
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
		
		${navbtns}
	`;
	
	res.send(render(req, title, content, _, '의 역사', error = false, viewname = 'history'));
});

wiki.get(/^\/discuss\/(.*)/, async function threadList(req, res) {
	const title = req.params[0];
	
	var state = req.query['state'];
	if(!state) state = '';
	
	if(!await getacl(title, 'read')) {
		res.send(showError('insufficient_privileges_read'));
		
		return;
	}
	
	var content = '';
	
	var trdlst;
	
	var subtitle = '';
	var viewname = '';
	
	switch(state) {
		case 'close':
			content += '<ul class=wiki-list>';
			
			var cnt = 0;
			await curs.execute("select topic, tnum from threads where title = ? and status = 'close' order by cast(time as integer) desc");
			trdlst = curs.fetchall();
			
			for(trd of trdlst) {
				content += `<li><a href="#${++cnt}">${cnt}</a>. <a href="/thread/${trd['tnum']}">${html.escape(trd['topic'])}</a></li>`;
			}
			
			content += '</ul>';
			
			subtitle = ' (닫힌 토론 목록)';
			
			viewname = 'thread_list_close'
		break;default:
			content += `
				<h2 class="wiki-heading">편집 요청</h2>
				<div class=wiki-heading-content>
					<ul class=wiki-list>
			`;
			
			content += `
					</ul>
				</div>
				
				<p>
					<a href="?state=closed_edit_requests">[닫힌 편집 요청 보기]</a>
				</p>
			`;
			
			content += `
				<h2 class="wiki-heading">토론</h2>
				<div class=wiki-heading-content>
			`;
				
			await curs.execute("select topic, tnum from threads where title = ? and status = 'normal' order by cast(time as integer) desc", [title]);
			trdlst = curs.fetchall();
			
			cnt = 0;
			for(trd of trdlst) {
				content += `
					<h3 class=wiki-heading id="${++cnt}">
						${cnt}. <a href="/thread/${trd['tnum']}">${html.escape(trd['topic'])}</a>
					</h3>
					
					<div class=topic-discuss>
				`;
				
				await curs.execute("select id, content, username, time, hidden, hider, status, ismember from res where tnum = ? order by cast(id as integer) asc", [trd['tnum']]);
				const td = curs.fetchall();
				await curs.execute("select id from res where tnum = ? order by cast(id as integer) desc limit 1", [trd['tnum']]);
				const ltid = Number(curs.fetchall()[0]['id']);
				
				var ambx = false;
				
				await curs.execute("select username from res where tnum = ? and (id = '1')", [trd['tnum']]);
				const fstusr = curs.fetchall()[0]['username'];
				
				for(rs of td) {
					const crid = Number(rs['id']);
					if(ltid > 4 && crid != 1 && (crid < ltid - 2)) {
						if(!ambx) {
							content += `
								<div>
									<a class=more-box href="/thread/${trd['tnum']}">more...</a>
								</div>
							`;
							
							ambx = true;
						}
						continue;
					}
					
					content += `
						<div class=res-wrapper>
							<div class="res res-type-${rs['status'] == '1' ? 'status' : 'normal'}">
								<div class="r-head${rs['username'] == fstusr ? " first-author" : ''}">
									<span class=num>#${rs['id']}</span> ${ip_pas(rs['username'])} <span style="float: right;">${generateTime(toDate(rs['time']), timeFormat)}</span>
								</div>
								
								<div class="r-body${rs['hidden'] == '1' ? ' r-hidden-body' : ''}">
									${
										rs['hidden'] == '1'
										? (
											await getperm('hide_thread_comment', ip_check(req))
											? '[' + rs['hider'] + '에 의해 숨겨진 글입니다.]<div class="text-line-break" style="margin: 25px 0px 0px -10px; display:block"><a class="text" onclick="$(this).parent().parent().children(\'.hidden-content\').show(); $(this).parent().css(\'margin\', \'15px 0 15px -10px\'); return false;" style="display: block; color: #fff;">[ADMIN] Show hidden content</a><div class="line"></div></div><div class="hidden-content" style="display:none">' + markdown(rs['content'], rs['ismember']) + '</div>'
											: '[' + rs['hider'] + '에 의해 숨겨진 글입니다.]'
										  )
										: markdown(rs['content'], rs['ismember'])
									}
								</div>
							</div>
						</div>
					`;
				}
				
				content += '<a href="?state=close">[닫힌 토론 목록 보기]</a></div>';
			}
				
			content += `
				<h2 class="wiki-heading">토론 발제</h2>
				
				<form method="post" class="new-thread-form" id="topicForm">
					<input type="hidden" name="identifier" value="${islogin(req) ? 'm' : 'i'}:${ip_check(req)}">
					
					<div class="form-group">
						<label class="control-label" for="topicInput" style="margin-bottom: 0.2rem;">주제 :</label>
						<input type="text" class="form-control" id="topicInput" name="topic">
					</div>

					<div class="form-group">
					<label class="control-label" for="contentInput" style="margin-bottom: 0.2rem;">내용 :</label>
						<textarea name="text" class="form-control" id="contentInput" rows="5"></textarea>
					</div>
					

					<div class="btns">
						<button id="createBtn" class="btn btn-primary" style="width: 8rem;">전송</button>
					</div>
				</form>
			`;
			
			subtitle = ' (토론)';
			viewname = 'thread_list'
	}
	
	res.send(render(req, title, content, _, subtitle, false, viewname));
});

wiki.post(/^\/discuss\/(.*)/, async function createThread(req, res) {
	const title = req.params[0];
	
	if(!await getacl(title, 'read')) {
		res.send(showError('insufficient_privileges_read'));
		
		return;
	}
	
	if(!await getacl(title, 'create_thread')) {
		res.send(showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	var tnum = rndval('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 22);
	
	while(1) {
		await curs.execute("select tnum from threads where tnum = ?", [tnum]);
		if(!curs.fetchall().length) break;
		tnum = rndval('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 22);
	}
	
	curs.execute("insert into threads (title, topic, status, time, tnum) values (?, ?, ?, ?, ?)",
					[title, req.body['topic'], 'normal', getTime(), tnum]);
	
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin) values \
					(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
					['1', req.body['text'], ip_check(req), getTime(), '0', '', '0', tnum, islogin(req) ? 'author' : 'ip', await getperm('admin', ip_check(req)) ? '1' : '0']);
					
	res.redirect('/thread/' + tnum);
});

wiki.get('/thread/:tnum', async function viewThread(req, res) {
	const tnum = req.param("tnum");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }
	
	await curs.execute("select title, topic, status from threads where tnum = ?", [tnum]);
	const title = curs.fetchall()[0]['title'];
	const topic = curs.fetchall()[0]['topic'];
	const status = curs.fetchall()[0]['status'];
	
	if(!await getacl(title, 'read')) {
		res.send(showError(req, 'insufficient_privileges_read'));
		
		return;
	}
	
	var content = `
		<h2 class=wiki-heading style="cursor: pointer;">
			${html.escape(topic)}
			${
				await getperm('delete_thread', ip_check(req))
				? '<span class=pull-right><a onclick="return confirm(\'삭제하시겠습니까?\');" href="/admin/thread/' + tnum + '/delete" class="btn btn-danger btn-sm">토론 삭제</a></span>'
				: ''
			}
		</h2>
		
		<div class=wiki-heading-content>
		
			<div id=res-container>
	`;
	
	for(var i=1; i<=rescount; i++) {
		content += `
			<div class="res-wrapper res-loading" data-id="${i}" data-locked="false" data-visible=false>
				<div class="res res-type-normal">
					<div class="r-head">
						<span class="num"><a id="${i}">#${i}</a>&nbsp;</span>
					</div>
					
					<div class="r-body"></div>
				</div>
			</div>
		`;
	}
	
	content += `
			</div>
		</div>
		
		<h2 class=wiki-heading style="cursor: pointer;">댓글 달기</h2>
	`;
	
	if(await getperm('update_thread_status', ip_check(req))) {
		var sts = '';
		
		switch(status) {
			case 'close':
				sts = `
					<option value="normal">normal</option>
					<option value="pause">pause</option>
				`;
			break;case 'normal':
				sts = `
					<option value="close">close</option>
					<option value="pause">pause</option>
				`;
			break;case 'pause':
				sts = `
					<option value="close">close</option>
					<option value="normal">normal</option>
				`;
		}
		
		content += `
		    <form method="post" id="thread-status-form">
        		쓰레드 상태 변경
        		<select name="status">${sts}</select>
        		<button id="changeBtn" class="d_btn type_blue">변경</button>
        	</form>
		`;
	}
	
	if(await getperm('update_thread_document', ip_check(req))) {
		content += `
        	<form method="post" id="thread-document-form">
        		쓰레드 이동
        		<input type="text" name="document" value="${title}">
        		<button id="changeBtn" class="d_btn type_blue">변경</button>
        	</form>
		`;
	}
	
	if(await getperm('update_thread_topic', ip_check(req))) {
		content += `
        	<form method="post" id="thread-topic-form">
        		쓰레드 주제 변경
        		<input type="text" name="topic" value="${topic}">
        		<button id="changeBtn" class="d_btn type_blue">변경</button>
        	</form>
		`;
	}
	
	content += `
		<script>$(function() { discussPollStart("${tnum}"); });</script>
	
		<form id=new-thread-form method=post>
			<textarea class=form-control rows=5 name=text ${['close', 'pause'].includes(status) ? 'disabled' : ''}>${status == 'pause' ? '동결된 토론입니다.' : (status == 'close' ? '닫힌 토론입니다.' : '')}</textarea>
			
			<div class=btns>
				<button type=submit class="btn btn-primary" style="width: 120px;">전송</button>
			</div>
		</form>
	`;
	
	res.send(render(req, title, content, {}, ' (토론) - ' + topic, error = false, viewname = 'thread'));
});

wiki.post('/thread/:tnum', async function postThreadComment(req, res) {
	const tnum = req.param("tnum");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }
	
	await curs.execute("select title, topic, status from threads where tnum = ?", [tnum]);
	const title = curs.fetchall()[0]['title'];
	const topic = curs.fetchall()[0]['topic'];
	const status = curs.fetchall()[0]['status'];
	
	if(!await getacl(title, 'read')) {
		res.send(showError('insufficient_privileges_read'));
		
		return;
	}
	
	if(!await getacl(title, 'write_thread_comment')) {
		res.send(showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	await curs.execute("select id from res where tnum = ? order by cast(id as integer) desc limit 1", [tnum]);
	const lid = Number(curs.fetchall()[0]['id']);
	
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin) \
					values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
						String(lid + 1), req.body['text'], ip_check(req), getTime(), '0', '', '0', tnum, islogin(req) ? 'author' : 'ip', await getperm('admin', ip_check(req)) ? '1' : '0'
					]);
					
	curs.execute("update threads set time = ? where tnum = ?", [getTime(), tnum]);
	
	res.json({});
});

wiki.get('/thread/:tnum/:id', async function dropThreadData(req, res) {
	const tnum = req.param("tnum");
	const tid = req.param("id");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }
	
	await curs.execute("select username from res where tnum = ? and (id = '1')", [tnum]);
	const fstusr = curs.fetchall()[0]['username'];
	
	await curs.execute("select title, topic, status from threads where tnum = ?", [tnum]);
	const title = curs.fetchall()[0]['title'];
	const topic = curs.fetchall()[0]['topic'];
	const status = curs.fetchall()[0]['status'];
	
	if(!await getacl(title, 'read')) {
		res.send(showError(req, 'insufficient_privileges_read'));
		
		return;
	}
	
	content = ``;
	
	await curs.execute("select id, content, username, time, hidden, hider, status, ismember from res where tnum = ? and (cast(id as integer) = 1 or (cast(id as integer) >= ? and cast(id as integer) < ?)) order by cast(id as integer) asc", [tnum, Number(tid), Number(tid) + 30]);
	for(rs of curs.fetchall()) {
		var hbtn = ''
		if(await getperm('hide_thread_comment', ip_check(req))) {
			hbtn += `
				<a href="/admin/thread/${tnum}/${rs['id']}/${rs['hidden'] == '1' ? 'show' : 'hide'}">[숨기기${rs['hidden'] == '1' ? ' 해제' : ''}]</a>
			`;
		}
		content += `
			<div class=res-wrapper data-id="${rs['id']}">
				<div class="res res-type-${rs['status'] == '1' ? 'status' : 'normal'}">
					<div class="r-head${rs['username'] == fstusr ? " first-author" : ''}">
						<span class=num>
							<a id="${rs['id']}">#${rs['id']}</a>&nbsp;
						</span> ${ip_pas(rs['username'], rs['ismember'])} ${hbtn} <span style="float: right;">${generateTime(toDate(rs['time']), timeFormat)}</span>
					</div>
					
					<div class="r-body${rs['hidden'] == '1' ? ' r-hidden-body' : ''}">
						${
							rs['hidden'] == '1'
							? (
								await getperm('hide_thread_comment', ip_check(req))
								? '[' + rs['hider'] + '에 의해 숨겨진 글입니다.]<div class="text-line-break" style="margin: 25px 0px 0px -10px; display:block"><a class="text" onclick="$(this).parent().parent().children(\'.hidden-content\').show(); $(this).parent().css(\'margin\', \'15px 0 15px -10px\'); $(this).hide(); return false;" style="display: block; color: #fff;">[ADMIN] Show hidden content</a><div class="line"></div></div><div class="hidden-content" style="display:none">' + markdown(rs['content']) + '</div>'
								: '[' + rs['hider'] + '에 의해 숨겨진 글입니다.]'
							  )
							: (
								rs['status'] == 1
								? rs['content']
								: markdown(rs['content'])
							)
						}
					</div>
				</div>`;
		content += `
			</div>
		`;
	}
	
	res.send(content);
});

wiki.get('/admin/thread/:tnum/:id/show', async function showHiddenComment(req, res) {
	const tnum = req.param("tnum");
	const tid = req.param("id");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }
	
	if(!await getperm('hide_thread_comment', ip_check(req))) {
		res.send(showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	curs.execute("update res set hidden = '0', hider = '' where tnum = ? and id = ?", [tnum, tid]);
	
	res.redirect('/thread/' + tnum);
});

wiki.get('/admin/thread/:tnum/:id/hide', async function hideComment(req, res) {
	const tnum = req.param("tnum");
	const tid = req.param("id");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }
	
	if(!await getperm('hide_thread_comment', ip_check(req))) {
		res.send(showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	curs.execute("update res set hidden = '1', hider = ? where tnum = ? and id = ?", [ip_check(req), tnum, tid]);
	
	res.redirect('/thread/' + tnum);
});

wiki.post('/admin/thread/:tnum/status', async function updateThreadStatus(req, res) {
	const tnum = req.param("tnum");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }

	var newstatus = req.body['status'];
	if(!['close', 'pause', 'normal'].includes(newstatus)) newstatus = 'normal';
	
	if(!await getperm('update_thread_status', ip_check(req))) {
		res.send(showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	curs.execute("update threads set status = ? where tnum = ?", [newstatus, tnum]);
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin) \
					values (?, ?, ?, ?, '0', '', '1', ?, ?, ?)", [
						String(rescount + 1), '스레드 상태를 <strong>' + newstatus + '</strong>로 변경', ip_check(req), getTime(), tnum, islogin(req) ? 'author' : 'ip', await getperm('admin', ip_check(req)) ? '1' : '0' 
					]);
	
	res.json({});
});

wiki.post('/admin/thread/:tnum/document', async function updateThreadDocument(req, res) {
	const tnum = req.param("tnum");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }

	var newdoc = req.body['document'];
	if(!newdoc.length) {
		res.send('');
		return;
	}
	
	if(!await getperm('update_thread_document', ip_check(req))) {
		res.send(showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	curs.execute("update threads set title = ? where tnum = ?", [newdoc, tnum]);
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin) \
					values (?, ?, ?, ?, '0', '', '1', ?, ?, ?)", [
						String(rescount + 1), '스레드를 <strong>' + newdoc + '</strong> 문서로 이동', ip_check(req), getTime(), tnum, islogin(req) ? 'author' : 'ip', await getperm('admin', ip_check(req)) ? '1' : '0' 
					]);
	
	res.json({});
});

wiki.post('/admin/thread/:tnum/topic', async function updateThreadTopic(req, res) {
	const tnum = req.param("tnum");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }

	var newtopic = req.body['topic'];
	if(!newtopic.length) {
		res.send('');
		return;
	}
	
	if(!await getperm('update_thread_topic', ip_check(req))) {
		res.send(showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	curs.execute("update threads set topic = ? where tnum = ?", [newtopic, tnum]);
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin) \
					values (?, ?, ?, ?, '0', '', '1', ?, ?, ?)", [
						String(rescount + 1), '스레드 주제를 <strong>' + newtopic + '</strong>로 변경', ip_check(req), getTime(), tnum, islogin(req) ? 'author' : 'ip', await getperm('admin', ip_check(req)) ? '1' : '0' 
					]);
	
	res.json({});
});

wiki.get('/admin/thread/:tnum/delete', async function deleteThread(req, res) {
	const tnum = req.param("tnum");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }
	
	if(!await getperm('delete_thread', ip_check(req))) {
		res.send(showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	await curs.execute("select title, topic, status from threads where tnum = ?", [tnum]);
	const title = curs.fetchall()[0]['title'];
	const topic = curs.fetchall()[0]['topic'];
	const status = curs.fetchall()[0]['status'];
	
	curs.execute("delete from threads where tnum = ?", [tnum]);
	curs.execute("delete from res where tnum = ?", [tnum]);
	
	res.redirect('/discuss/' + encodeURI(title));
});

wiki.post('/notify/thread/:tnum', async function notifyEvent(req, res) {
	var tnum = req.param("tnum");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(showError(req, "thread_not_found")); return; }
	
	await curs.execute("select id from res where tnum = ? order by cast(time as integer) desc limit 1", [tnum]);
	
	res.json({
		"status": "event",
		"comment_id": Number(curs.fetchall()[0]['id'])
	});
});

wiki.get('/member/login', async function loginScreen(req, res) {
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	res.send(render(req, '로그인', `
		<form class=login-form method=post>
			<div class=form-group>
				<label>사용자 이름:</label><br>
				<input class=form-control name="username" type="text">
			</div>

			<div class=form-group>
				<label>비밀번호:</label><br>
				<input class=form-control name="password" type="password">
			</div>
			
			<div class="checkbox" style="display: inline-block;">
				<label>
					<input type="checkbox" name="autologin">
					<span>자동 로그인</span>
				</label>
			</div>
			
			<a href="/member/recover_password" style="float: right;">[아이디/비밀번호 찾기]</a> <br>
			
			<a href="/member/signup" class="btn btn-secondary">계정 만들기</a><button type="submit" class="btn btn-primary">로그인</button>
		</form>
	`, {}));
});

wiki.post('/member/login', async function authUser(req, res) {
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	var   id = req.body['username'];
	const pw = req.body['password'];
	
	if(!id.length) {
		res.send(render(req, '로그인', `
			<form class=login-form method=post>
				<div class=form-group>
					<label>사용자 이름:</label><br>
					<input class=form-control name="username" type="text">
					<p class=error-desc>사용자 이름의 값은 필수입니다.</p>
				</div>

				<div class=form-group>
					<label>비밀번호:</label><br>
					<input class=form-control name="password" type="password">
				</div>
				
				<div class="checkbox" style="display: inline-block;">
					<label>
						<input type="checkbox" name="autologin">
						<span>자동 로그인</span>
					</label>
				</div>
				
				<a href="/member/recover_password" style="float: right;">[아이디/비밀번호 찾기]</a> <br>
				
				<a href="/member/signup" class="btn btn-secondary">계정 만들기</a><button type="submit" class="btn btn-primary">로그인</button>
			</form>
		`, {}));
		
		return;
	}
	
	if(!pw.length) {
		res.send(render(req, '로그인', `
			<form class=login-form method=post>
				<div class=form-group>
					<label>사용자 이름:</label><br>
					<input class=form-control name="username" type="text" value="${html.escape(id)}">
				</div>

				<div class=form-group>
					<label>비밀번호:</label><br>
					<input class=form-control name="password" type="password">
					<p class=error-desc>암호의 값은 필수입니다.</p>
				</div>
				
				<div class="checkbox" style="display: inline-block;">
					<label>
						<input type="checkbox" name="autologin">
						<span>자동 로그인</span>
					</label>
				</div>
				
				<a href="/member/recover_password" style="float: right;">[아이디/비밀번호 찾기]</a> <br>
				
				<a href="/member/signup" class="btn btn-secondary">계정 만들기</a><button type="submit" class="btn btn-primary">로그인</button>
			</form>
		`, {}));
		
		return;
	}
	
	await curs.execute("select username from users where username = ? COLLATE NOCASE", [id]);
	if(!curs.fetchall().length) {
		res.send(render(req, '로그인', `
			<form class=login-form method=post>
				<div class=form-group>
					<label>사용자 이름:</label><br>
					<input class=form-control name="username" type="text" value="${html.escape(id)}">
					<p class=error-desc>사용자 이름이 올바르지 않습니다.</p>
				</div>

				<div class=form-group>
					<label>비밀번호:</label><br>
					<input class=form-control name="password" type="password">
				</div>
				
				<div class="checkbox" style="display: inline-block;">
					<label>
						<input type="checkbox" name="autologin">
						<span>자동 로그인</span>
					</label>
				</div>
				
				<a href="/member/recover_password" style="float: right;">[아이디/비밀번호 찾기]</a> <br>
				
				<a href="/member/signup" class="btn btn-secondary">계정 만들기</a><button type="submit" class="btn btn-primary">로그인</button>
			</form>
		`, {}));
		
		return;
	}
	
	id = curs.fetchall()[0]['username'];
	
	curs.execute("select username, password from users where username = ? and password = ?", [id, sha3(pw)]);
	if(!curs.fetchall().length) {
		res.send(render(req, '로그인', `
			<form class=login-form method=post>
				<div class=form-group>
					<label>사용자 이름:</label><br>
					<input class=form-control name="username" type="text" value="${html.escape(id)}">
				</div>

				<div class=form-group>
					<label>비밀번호:</label><br>
					<input class=form-control name="password" type="password">
					<p class=error-desc>암호가 올바르지 않습니다.</p>
				</div>
				
				<div class="checkbox" style="display: inline-block;">
					<label>
						<input type="checkbox" name="autologin">
						<span>자동 로그인</span>
					</label>
				</div>
				
				<a href="/member/recover_password" style="float: right;">[아이디/비밀번호 찾기]</a> <br>
				
				<a href="/member/signup" class="btn btn-secondary">계정 만들기</a><button type="submit" class="btn btn-primary">로그인</button>
			</form>
		`, {}));
		
		return;
	}
	
	curs.execute("insert into login_history (username, ip) values (?, ?)", [id, ip_check(req, 1)]);
	
	req.session.username = id;
	
	await curs.execute("delete from useragents where username = ?", [id]);
	await curs.execute("insert into useragents (username, string) values (?, ?)", [id, req.headers['user-agent']]);
	
	res.redirect(desturl);
});

wiki.get('/member/signup', async function signupEmailScreen(req, res) {
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	res.send(render(req, '계정 만들기', `
		<form method=post class=signup-form>
			<div class=form-group>
				<label>전자우편 주소:</label><br>
				<input type=email name=email class=form-control>
			</div>
			
			<p>
				<strong>가입 후 탈퇴는 불가능합니다.</strong>
			</p>
		
			<div class=btns>
				<button type=reset class="btn btn-secondary">초기화</button>
				<button type=submit class="btn btn-primary">가입</button>
			</div>
		</form>
	`, {}));
});

wiki.post('/member/signup', async function emailConfirmationScreen(req, res) {
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	await curs.execute("delete from account_creation where cast(time as integer) < ?", [Number(getTime()) - 86400000]);
	
	await curs.execute("select email from account_creation where email = ?", [req.body['email']]);
	if(curs.fetchall().length) {
		res.send(render(req, '계정 만들기', `
			<form method=post class=signup-form>
				<div class=form-group>
					<label>전자우편 주소:</label><br>
					<input type=email name=email class=form-control>
					<p class=error-desc>사용 중인 이메일입니다.</p>
				</div>
				
				<p>
					<strong>가입후 탈퇴는 불가능합니다.</strong>
				</p>
			
				<div class=btns>
					<button type=reset class="btn btn-secondary">초기화</button>
					<button type=submit class="btn btn-primary">가입</button>
				</div>
			</form>
		`, {}));
		
		return;
	}
	
	const key = rndval('abcdef1234567890', 64);
	
	curs.execute("insert into account_creation (key, email, time) values (?, ?, ?)", [key, req.body['email'], String(getTime())]);
	
	res.send(render(req, '계정 만들기', `
		<p>
			입력한 주소로 인증 우편을 전송했습니다. 우편이 안보일 경우 스팸함을 확인하십시오.
		</p>
		
		<p style="font-weight: bold; color: red;">
			[디버그] 가입 주소: <a href="/member/signup/${key}">/member/signup/${key}</a>
		</p>
	`, {}));
});

wiki.get('/member/signup/:key', async function signupScreen(req, res) {
	await curs.execute("delete from account_creation where cast(time as integer) < ?", [Number(getTime()) - 86400000]);
	
	const key = req.param('key');
	await curs.execute("select key from account_creation where key = ?", [key]);
	if(!curs.fetchall().length) {
		res.send(showError(req, 'invalid_signup_key'));
		
		return;
	}
	
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	res.send(render(req, '계정 만들기', `
		<form class=signup-form method=post onsubmit="return confirm('가입 후 탈퇴할 수 없습니다.');">
			<div class=form-group>
				<label>사용자 이름:</label><br>
				<input class=form-control name="username" type="text">
			</div>

			<div class=form-group>
				<label>비밀번호:</label><br>
				<input class=form-control name="password" type="password">
			</div>

			<div class=form-group>
				<label>비밀번호 확인:</label><br>
				<input class=form-control name="password_check" type="password">
			</div>
			
			<p><strong>가입후 탈퇴는 불가능합니다.</strong></p>
			
			<button type=reset class="btn btn-secondary">초기화</button><button type="submit" class="btn btn-primary">가입</button>
		</form>
	`, {}));
});

wiki.post('/member/signup/:key', async function createAccount(req, res) {
	await curs.execute("delete from account_creation where cast(time as integer) < ?", [Number(getTime()) - 86400000]);
	
	const key = req.param('key');
	await curs.execute("select key from account_creation where key = ?", [key]);
	if(!curs.fetchall().length) {
		res.send(showError(req, 'invalid_signup_key'));
		
		return;
	}
	
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	const id = req.body['username'];
	const pw = req.body['password'];
	const pw2 = req.body['password_check'];
	
	await curs.execute("select username from users where username = ? COLLATE NOCASE", [id]);
	if(curs.fetchall().length) {
		res.send(render(req, '계정 만들기', `
			<form class=signup-form method=post>
				<div class=form-group>
					<label>사용자 ID</label><br>
					<input class=form-control name="username" type="text">
					<p class=error-desc>해당 사용자가 이미 존재합니다.</p>
				</div>

				<div class=form-group>
					<label>암호</label><br>
					<input class=form-control name="password" type="password">
				</div>

				<div class=form-group>
					<label>암호 확인</label><br>
					<input class=form-control name="password_check" type="password">
				</div>
			
				<p><strong>가입후 탈퇴는 불가능합니다.</strong></p>
				
				<button type=reset class="btn btn-secondary">초기화</button><button type="submit" class="btn btn-primary">가입</button>
			</form>
		`, {}));
		
		return;
	}
	
	if(!id.length) {
		res.send(render(req, '계정 만들기', `
			<form class=signup-form method=post>
				<div class=form-group>
					<label>사용자 ID</label><br>
					<input class=form-control name="username" type="text">
					<p class=error-desc>사용자 이름의 값은 필수입니다.</p>
				</div>

				<div class=form-group>
					<label>암호</label><br>
					<input class=form-control name="password" type="password">
				</div>

				<div class=form-group>
					<label>암호 확인</label><br>
					<input class=form-control name="password_check" type="password">
				</div>
			
				<p><strong>가입후 탈퇴는 불가능합니다.</strong></p>
				
				<button type=reset class="btn btn-secondary">초기화</button><button type="submit" class="btn btn-primary">가입</button>
			</form>
		`, {}));
		
		return;
	}
	
	if(!pw.length) {
		res.send(render(req, '계정 만들기', `
			<form class=signup-form method=post>
				<div class=form-group>
					<label>사용자 ID</label><br>
					<input class=form-control name="username" type="text">
				</div>

				<div class=form-group>
					<label>암호</label><br>
					<input class=form-control name="password" type="password">
				</div>

				<div class=form-group>
					<label>암호 확인</label><br>
					<input class=form-control name="password_check" type="password">
					<p class=error-desc>암호의 값은 필수입니다.</p>
				</div>
			
				<p><strong>가입후 탈퇴는 불가능합니다.</strong></p>
				
				<button type=reset class="btn btn-secondary">초기화</button><button type="submit" class="btn btn-primary">가입</button>
			</form>
		`, {}));
		
		return;
	}
	
	if(pw != pw2) {
		res.send(render(req, '계정 만들기', `
			<form class=signup-form method=post>
				<div class=form-group>
					<label>사용자 ID</label><br>
					<input class=form-control name="username" type="text">
				</div>

				<div class=form-group>
					<label>암호</label><br>
					<input class=form-control name="password" type="password">
				</div>

				<div class=form-group>
					<label>암호 확인</label><br>
					<input class=form-control name="password_check" type="password">
					<p class=error-desc>암호 확인이 올바르지 않습니다.</p>
				</div>
			
				<p><strong>가입후 탈퇴는 불가능합니다.</strong></p>
				
				<button type=reset class="btn btn-secondary">초기화</button><button type="submit" class="btn btn-primary">가입</button>
			</form>
		`, {}));
		
		return;
	}
	
	await curs.execute("select username from users");
	if(!curs.fetchall().length) {
		for(perm of perms) {
			curs.execute(`insert into perms (username, perm) values (?, ?)`, [id, perm]);
		}
	}
	
	req.session.username = id;
	
	curs.execute("insert into users (username, password) values (?, ?)", [id, sha3(pw)]);
	
	curs.execute("insert into documents (title, content) values (?, '')", ["사용자:" + id]);
	
	curs.execute("insert into history (title, content, rev, time, username, changes, log, iserq, erqnum, advance, ismember) \
					values (?, '', '1', ?, ?, '0', '', '0', '', '(새 문서)', 'author')", [
						'사용자:' + id, getTime(), id
					]);
		
	curs.execute("insert into login_history (username, ip) values (?, ?)", [id, ip_check(req, 1)]);
	curs.execute("insert into useragents (username, string) values (?, ?)", [id, req.headers['user-agent']]);
	
	res.redirect(desturl);
});

wiki.use(function(req, res, next) {
    return res.status(404).send(`
		접속한 페이지가 없음.
	`);
});

(async function setWikiData() {
	await curs.execute("select key, value from config");
	
	for(var cfg of curs.fetchall()) {
		wikiconfig[cfg['key']] = cfg['value'];
	}
	
	await curs.execute("select username, perm from perms order by username");
	
	for(var prm of curs.fetchall()) {
		if(typeof(permlist[prm['username']]) == 'undefined')
			permlist[prm['username']] = [prm['perm']];
		else
			permlist[prm['username']].push(prm['perm']);
	}
})();

const server = wiki.listen(hostconfig['port']); // 서버실행
print(String(hostconfig['host']) + ":" + String(hostconfig['port']) + "에 실행 중. . .");
