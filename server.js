const isArray = obj => Object.prototype.toString.call(obj) == '[object Array]';
const ifelse = (e, y, n) => e ? y : n;
const pow = (밑, 지수) => 밑 ** 지수;
const sqrt = Math.sqrt;
const floorof = Math.floor;
const rand = (s, e) => Math.random() * (e + 1 - s) + s;
const randint = (s, e) => floorof(Math.random() * (e + 1 - s) + s);
const itoa = String;
const atoi = Number;
const reverse = elmt => {
	if(typeof elmt == 'string') {
		return elmt.split('').reverse().join('');
	} else {
		return elmt.reverse();
	}
}
const range = (sv, ev, pv) => {
	var retval = [];
	
	var s = sv, e = ev, p = pv;
	
	if(s && !e && !p) {
		s = 0;
		e = sv;
		p = 1;
	}
	else if(s && e && !p) {
		p = 1;
	}
	
	if(s != e && p == 0) {
		throw new Error('Invalid step value');
	}
	
	if(s > e) {
		if(p > 0) throw new Error('Invalid step value');
		for(i=s; i>e; i+=p) retval.push(i);
	} else {
		if(p < 0) throw new Error('Invalid step value');
		for(i=s; i<e; i+=p) retval.push(i);
	}
	
	return retval;
}
const find = (obj, fnc) => {
	if(typeof(obj) != 'object') {
		throw TypeError(`Cannot find from ${typeof(obj)}`);
	}
	
	if(typeof(fnc) != 'function') {
		throw TypeError(`${fnc} is not a function`);
	}
	
	var i;
	
	if(isArray(obj)) {
		var cnt = 0;
		
		for(i of obj) {
			if(fnc(i)) return cnt;
			cnt++;
		}
		return -1;
	}
	else {
		for(i in obj) {
			if(fnc(obj[i])) return i;
		}
		return -1;
	}
	
	return -1;
}

const perms = [
	'admin', 'suspend_account', 'developer', 'update_thread_document',
	'update_thread_status', 'update_thread_topic', 'hide_thread_comment', 'grant',
	'login_history', 'delete_thread', 'acl', 'create_vote', 'delete_vote', 'edit_vote'
];

function print(x) { console.log(x); }
function prt(x) { process.stdout.write(x); }

function beep(cnt = 1) { // 경고음 재생이였음
	for(var i=1; i<=cnt; i++)
		prt(''); // prt("");
}

const path = require('path');

const captchapng = require('captchapng');

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

function sha3(p) {
	const hash = new SHA3(512);
	
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
			await conn.run(sql, params, err => { if(err) print('[오류!] ' + err); beep(3); });
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

const url_pas = u => encodeURIComponent(u);

const md5 = require('md5');

swig.setFilter('encode_userdoc', function filter_sencodeUserdocURL(input) {
	return encodeURIComponent('사용자:' + input);
});

swig.setFilter('encode_doc', function filter_encodeDocURL(input) {
	return encodeURIComponent(input);
});

swig.setFilter('to_date', toDate);

swig.setFilter('localdate', generateTime);

// 오픈나무(터보위키) 스킨 호환용
swig.setFilter('cut_100', function filter_slice100Chars(input) {
	return input.slice(0, 100);
});

swig.setFilter('md5_replace', function filter_MD5Hash(input) {
	return md5(input);
});

swig.setFilter('url_pas', function filter_encodeURL(input) {
	return url_pas(input);
});

swig.setFilter('CEng', function filter_setLanguage(input, eng) {
	return input;
});

var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const fs = require('fs');

var wikiconfig = {};
var permlist = {};

var firstrun = 1;
var hostconfig;
try { hostconfig = require('./config.json'); }
catch(e) {
	firstrun = 0;
	(async function setupWiki() {
		print("바나나 위키엔진에 오신것을 환영합니다.");
		print("버전 1.6.5 [디버그 전용]");
		
		prt('\n');
		
		hostconfig = {
			host: input("호스트 주소: "),
			port: input("포트 번호: "),
			skin: input("기본 스킨 이름: "),
			secret: input("세션 비밀 키: ")
		};
		
		const tables = {
			'documents': ['title', 'content'],
			'history': ['title', 'content', 'rev', 'time', 'username', 'changes', 'log', 'iserq', 'erqnum', 'advance', 'ismember'],
			'namespaces': ['namespace', 'locked', 'norecent', 'file'],
			'users': ['username', 'password'],
			'user_settings': ['username', 'key', 'value'],
			'acl': ['title', 'notval', 'type', 'value', 'action', 'hipri'],
			'nsacl': ['namespace', 'no', 'type', 'content', 'action', 'expire'],
			'config': ['key', 'value'],
			'email_filters': ['address'],
			'stars': ['title', 'username', 'lastedit'],
			'perms': ['perm', 'username'],
			'threads': ['title', 'topic', 'status', 'time', 'tnum'],
			'res': ['id', 'content', 'username', 'time', 'hidden', 'hider', 'status', 'tnum', 'ismember', 'isadmin'],
			'useragents': ['username', 'string'],
			'login_history': ['username', 'ip'],
			'account_creation': ['key', 'email', 'time'],
			'files': ['filename', 'prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'license', 'category'],
			'filehistory': ['filename', 'prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'license', 'category', 'username', 'rev'],
			'blockhistory': ['ismember', 'type', 'blocker', 'username', 'durationstring', 'startingdate', 'endingdate', 'al'],
			'banned_users': ['username', 'blocker', 'startingdate', 'endingdate', 'ismember', 'al'],
			'filelicenses': ['license', 'creator'],
			'filecategories': ['category', 'creator'],
			'vote': ['num', 'name', 'start', 'end', 'required_date', 'options', 'mode'],
			'votedata': ['data', 'username', 'date', 'num'],
			'tokens': ['username', 'token'],
			'requests': ['ip', 'time']
		};
		
		for(var table in tables) {
			var sql = '';
			sql = `CREATE TABLE ${table} ( `;
			
			for(col of tables[table]) {
				sql += `${col} TEXT DEFAULT '', `;
			}
			
			sql = sql.replace(/[,]\s$/, '');		
			sql += `)`;
			
			await curs.execute(sql);
		}
		
		setTimeout(async () => {
			const fcates = ['동물', '게임', '컴퓨터', '요리', '탈것', '전화기', '기계', '광고', '도구', '만화/애니메이션', '아이콘/기호'];
			const flices = ['CC BY', 'CC BY-NC', 'CC BY-NC-ND', 'CC BY-NC-SA', 'CC BY-ND', 'CC BY-SA', 'CC-0', 'PD-author', 'PD-self', 'PD-software'];

			for(var cate of fcates) {
				await curs.execute("insert into filecategories (category, creator) values (?, '')", [cate]);
			}
			
			for(var lice of flices) {
				await curs.execute("insert into filelicenses (license, creator) values (?, '')", [lice]);
			}
			
			await fs.writeFile('config.json', JSON.stringify(hostconfig), 'utf8', (e) => { beep(2); });
			
			setTimeout(async () => {
				print("\n설정이 완료되었습니다. 5초 후에 엔진을 다시 시작하십시오.");
			}, 5000);
		}, 5000);
	})();
}

wiki.use(bodyParser.json());
wiki.use(bodyParser.urlencoded({ extended: true }));
wiki.use(express.static('public'));
wiki.use(cookieParser());
wiki.use(session({
	key: 'doornot',
	secret: hostconfig['secret'],
	cookie: {
		expires: false
	}
}));

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
	if(req.cookies.gildong && req.cookies.icestar) {
		
	}
	
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

async function isBanned(req, ismember, username = '') {
	// 미완성
	return false;
	
	if(!islogin(req)) {
		await curs.execute("select username from banned_users where username = ? and ismember = ?", [ip_check(req, 1), ismember]);
		if(curs.fetchall().length) return true;
	}
	
	await curs.execute("select username from banned_users where username = ? and ismember = ? and al = '0'", [ip_check(req, 1), ismember]);
	if(curs.fetchall().length) return true;
	
	await curs.execute("select username from banned_users where username = ? and ismember = ?", [ip_check(req), ismember]);
}

const ban_check = isBanned;

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

function getperm(perm, username) {
	try {
		return permlist[username].includes(perm)
	} catch(e) {
		return false;
	}
}

async function render(req, title = '', content = '', varlist = {}, subtitle = '', error = false, viewname = '', menu = 0) {
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
	templateVariables['req'] = {
		ip: ip_check(req, 1)
	};
	
	function getpermForSkin(permname) {
		return getperm(permname, ip_check(req));
	}
	
	var user_document_discuss = false;
	
	if(islogin(req)) {
		await curs.execute("select topic from threads where title = ? and (status = 'normal' or status = 'pause')", ['사용자:' + ip_check(req)]);
		if(curs.fetchall().length) {
			user_document_discuss = true;
		}
	}
	
	templateVariables['user_document_discuss'] = user_document_discuss;
	
	// 오픈나무 스킨 호환용
	templateVariables['imp'] = [
		title,  // 페이지 제목 (imp[0])
		[  // 위키 설정 (imp[1][x])
			config.getString('wiki.site_name', ''),  // 위키 이름
			config.getString('wiki.copyright_text', '') +  // 위키 
			config.getString('wiki.footer_text', ''),      // 라이선스
			'',  // 전역 CSS
			'',  // 전역 JS
			config.getString('wiki.logo_url', ''),  // 로고
			'',  // 전역 <HEAD>
			config.getString('wiki.site_notice', ''),  // 공지
			getpermForSkin,  // 권한 유무 여부 함수
			toDate(getTime())  // 시간
		], 
		[  // 사용자 정보 (imp[2][x])
		   // --------------------------
		   // return [0, 1, 2, 3, 4, 5, ip_check(), 
		   //			admin_check(1), admin_check(3), admin_check(4), admin_check(5), 
		   //           admin_check(6), admin_check(7), admin_check(), 
		   //           toplst('사용자:' + ip_check()), ipa, ar, tr, cv, mycolor[0][0], str(spin)]
		
			'',  // 사용자 CSS
			'',  // 사용자 JS
			islogin(req) ? 1 : 0,  // 로그인 여부
			'',  // 사용자 <HEAD>
			'someone@example.com', // 전자우편 주소; 아직 이메일 추가기능도 미구현.,
			islogin(req) ? ip_check(req) : '사용자',  // 사용자 이름
			ip_check(req),  // 사용자/아이피 주소
			getperm('suspend_account'),  // 차단 권한 유무(데프리케잇; imp[1][8] 사용)
			0,  // 토론 권한 여부인데 세분화해서 쓰므로 안 씀
			getperm('login_history'),  // 로그인내역 권한 유무(데프리케잇; imp[1][8] 사용)
			getperm('admin'),  // 로그인내역 권한 유무(데프리케잇; imp[1][8] 사용)
			0,  // 역사 숨기기였는데 구현 안함
			getperm('grant'),  // 권한부여 권한 유무(데프리케잇; imp[1][8] 사용)
			getperm('developer'),  // 소유자 권한 유무(데프리케잇; imp[1][8] 사용)
			user_document_discuss,  // 사용자 토론 존재여부
			getperm('ipacl'),  // IPACL 권한 유무(데프리케잇; imp[1][8] 사용)
			getperm('admin'),  // 중재자 권한인데 admin으로 통합
			getperm('admin'),  // 호민관 권한인데 admin으로 통합
			getperm('create_vote'),  // 투표추가 권한 유무(데프리케잇; imp[1][8] 사용)
			'default',  // 스킨 색 구성표인데 스킨 선택도 안 만듬
			'12345678'  // 지원 PIN인데 미구현
		], 
		[  // 기타 정보 (imp[3][x])
			subtitle == '' ? 0 : subtitle,  // 페이지 부제목
			!varlist['date'] ? 0 : varlist['date'],  // 마지막 수정 시간
			['wiki', 'notfound'].includes(viewname)  // 별찜 여부
			 ? (
				varlist['starred'] ? 2 : (
					islogin(req) ? 1 : 0
				)
			 ) : (
				''
			 )
		]
	];
	templateVariables['data'] = content;
	templateVariables['menu'] = menu;
	
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
		<link rel="stylesheet" href="/css/wiki.css">
	`;
	for(var i=0; i<skinconfig["auto_css_targets"]['*'].length; i++) {
		header += '<link rel=stylesheet href="/skins/' + getSkin() + '/' + skinconfig["auto_css_targets"]['*'][i] + '">';
	}
	header += `
		<!--[if !IE]><!--><script type="text/javascript" src="https://theseed.io/js/jquery-2.1.4.min.js"></script><!--<![endif]-->
		<!--[if IE]> <script src="https://code.jquery.com/jquery-1.8.0.min.js"></script> <![endif]-->
		<script type="text/javascript" src="/js/dateformatter.js?508d6dd4"></script>
		<script type="text/javascript" src="/js/banana.js?24141115"></script>
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
		'invalid_captcha_number': '보안문자 값이 올바르지 않습니다.',
		'disabled_feature': '이 기능이 사용하도록 설정되지 않았습니다.',
		'invalid_signup_key': '만료되었거나 올바르지 않습니다.',
		'invalid_vote_type': '투표 방식이 올바르지 않습니다.',
		'insufficient_privileges': '접근 권한이 없습니다.',
		'insufficient_privileges_edit': '편집 권한이 없습니다.',
		'insufficient_privileges_read': '읽을 권한이 없습니다.'
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

async function showError(req, code) {
	return await render(req, "문제가 발생했습니다!", `<h2>${fetchErrorString(code)}</h2>`);
}

function ip_pas(ip = '', ismember = '') {
	if(ismember == 'author') {
		return `<strong><a href="/w/사용자:${encodeURIComponent(ip)}">${html.escape(ip)}</a></strong>`;
	} else {
		return `<a href="/contribution/ip/${encodeURIComponent(ip)}/document">${html.escape(ip)}</a>`;
	}
}

async function getacl(req, title, action) {
	var fullacllst = [];
	
	await curs.execute("select action, value, notval, hipri from acl where action = 'allow' and hipri = '1' and title = ? and type = ?", [title, action]);
	fullacllst.push(curs.fetchall());
	
	await curs.execute("select action, value, notval, hipri from acl where action = 'deny' and title = ? and type = ?", [title, action]);
	fullacllst.push(curs.fetchall());
	
	await curs.execute("select action, value, notval, hipri from acl where action = 'allow' and title = ? and type = ?", [title, action]);
	fullacllst.push(curs.fetchall());
	
	for(var acllst of fullacllst) {
		for(var acl of acllst) {
			var   condition = true;
			const action    = acl['action'];
			const high      = acl['hipri'] == '1' ? true : false;
			const not       = acl['not'] == '1' ? true : false;
			const value     = acl['value'];
			
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
			['has_starred_document', '이 문서를 주시하는 사용자']
			
			switch(acl['value']) {
				case 'any':
					condition = true;
				break;case 'member':
					condition = islogin(req);
				break;case 'blocked_ip':
					condition = !islogin(req) && isBanned(req, 'ip', ip_check(req));
				break;case 'blocked_member':
					condition = islogin(req) && isBanned(req, 'ip', ip_check(req));
				break;case 'admin':
					condition = getperm('admin', ip_check(req)) || getperm('developer', ip_check(req));
				break;case 'developer':
					condition = getperm('developer', ip_check(req));
				break;case 'document_creator':
					await curs.execute("select username from history where title = ? and username = ? and ismember = ? and rev = '1' and advance = '(새 문서)'", [title, ip_check(req), islogin(req) ? 'author' : 'ip']);
					condition = curs.fetchall().length;
				break;case 'document_last_edited':
					await curs.execute("select username from history where title = ? and ismember = ? order by cast(rev as integer) desc limit 1", [title, islogin(req) ? 'author' : 'ip']);
					condition = curs.fetchall()[0]['username'] == ip_check(req);
				break;case 'document_contributor':
					await curs.execute("select username from history where title = ? and ismember = ? and username = ? limit 1", [title, islogin(req) ? 'author' : 'ip', ip_check(req)]);
					condition = curs.fetchall().length > 0;
				break;default:
					try {
						if(value.startsWith('member:')) {
							condition = islogin(req) && ip_check(req).toUpperCase() == value.replace(/^member[:]/i, '').toUpperCase();
						}
						else if(value.startsWith('ip:')) {
							condition = !islogin(req) && ip_check(req).toUpperCase() == value.replace(/^ip[:]/i, '').toUpperCase();
						}
						else {
							condition = false;
						}
					} catch(e) {
						condition = false;
					}
			}
			
			if(action == 'allow') {
				if(!not && condition) {
					return true;
				}
				else if(not && !condition) {
					return true;
				}
				else {
					return false;
				}
			} else {
				if(!not && !condition) {
					return true;
				}
				else if(not && condition) {
					return true;
				}
				else {
					return false;
				}
			}
		}
	}
	
	return false;
}

function navbtn(cs, ce, s, e) {
	return '';
}

function stringInFormat(pattern, string) {
    if(len(string) < 1) return 0;
	
    try {
        if(string.replace(pattern, '') == '') return 1;
        else return 0;
    } catch(e) {
        return 0;
	}
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
	// res.sendFile('index.js', { root: "./" });
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

/*
wiki.get('/u', function(req, res) {
	res.send(req.headers['user-agent']);
});
*/

function compatMode(req) {
	try {
		const useragent = req.headers['user-agent'];
		if(!useragent) return false;
		
		const UAParser = require('ua-parser-js');
		
		const clsUserAgent = new UAParser(useragent);
		
		const navigatorName    = clsUserAgent.getBrowser()['name'].toLowerCase();
		const navigatorVersion = atoi(clsUserAgent.getBrowser()['version'].split('.')[0]);
		
		if(navigatorName == 'chrome') navigatorName = 'chromium';
		
		switch(navigatorName) {
			case 'chromium':
				if(navigatorVersion < 30) {
					return true;
				}
			break; case 'firefox':
				if(navigatorVersion < 40) {
					return true;
				}
			break; case 'ie':
				if(navigatorVersion < 11) {
					return true;
				}
			break; case 'navigator':
				return true;
			break; case 'mozilla':
				return true;
		}
		
		return false;
	} catch(e) {
		return false;
	}
}

function generateCaptcha(req, cnt = 3) {
	const fst = atoi(rndval('017', 1));
	
	var numbers = [];
	var i;
	var fullnum = '';
	var caps = [];
	var retHTML = '';
	
	fullnum += itoa(fst);
	caps.push(new captchapng(60, 45, fst));
	
	for(i of range(cnt)) {
		numbers.push(parseInt(Math.random()*9000+1000));
	}
	
	for(i of numbers) {
		fullnum += itoa(i);
		caps.push(new captchapng(160, 45, i));
	}
	
	req.session.captcha = fullnum;
	
	for(i of caps) {
		switch(randint(1, 6)) {
			case 1:
				i.color(120, 200, 255, 255);
				i.color(255, 255, 255, 255);
			break;case 2:
				i.color(46, 84, 84, 255);
				i.color(52, 235, 195, 255);
			break;case 3:
				i.color(44, 56, 222, 255);
				i.color(227, 43, 52, 255);
			break;case 4:
				i.color(31, 216, 220, 255);
				i.color(255, 0, 0, 255);
			break;case 5:
				i.color(85, 170, 170, 255);
				i.color(255, 255, 255, 255);
			break;case 6:
				i.color(225, 202, 48, 255);
				i.color(9, 198, 122, 255);
		}
		
		const img = i.getBase64();
		
		retHTML += `
			<img class=captcha-image src="data:image/png;base64,${new Buffer(img, 'base64').toString('base64')}" />
		`;
	}
	
	/*
	const num1 = parseInt(Math.random()*9000+1000);
	const num2 = parseInt(Math.random()*9000+1000);
	const num3 = parseInt(Math.random()*9000+1000);
	
	req.session.captcha = fullnum;
	
	const capt1 = new captchapng(160, 45, num1);
	const capt2 = new captchapng(160, 45, num2);
	const capt3 = new captchapng(160, 45, num3);
	
	capt1.color(120, 200, 255, 255);
	capt1.color(255, 255, 255, 255);

	capt2.color(46, 84, 84, 255);
	capt2.color(52, 235, 195, 255);
	
	capt3.color(44, 56, 222, 255);
	capt3.color(227, 43, 52, 255);

	var img_1 = capt1.getBase64();
	var imgbase64_1 = new Buffer(img_1, 'base64').toString('base64');

	var img_2 = capt2.getBase64();
	var imgbase64_2 = new Buffer(img_2, 'base64').toString('base64');

	var img_3 = capt3.getBase64();
	var imgbase64_3 = new Buffer(img_3, 'base64').toString('base64');
	*/
	
	return `
		<style>
			div.captcha-frame {
				border-color: #000;
				border-width: 1px 1px 1px;
				border-style: solid;
				
				border-radius: 6px;
				
				display: table;
				
				padding: 10px;
				
				background: rgb(153, 208, 249);
				background: linear-gradient(rgb(153, 208, 249) 0%, rgb(13, 120, 200) 31%, rgb(43, 157, 242) 30%, rgb(99, 183, 245));
			}
			
			img.captcha-image {
				border-radius: 6px;
				border: 1px solid white;
				box-shadow: 3px 3px 20px 1px grey inset;
				-ms-box-shadow: 3px 3px 20px 1px grey inset;
				-webkit-box-shadow: 3px 3px 20px 1px grey inset;
				-moz-box-shadow: 3px 3px 20px 1px grey inset;
				
				display: inline-block;
			}
			
			div.captcha-input label {
				color: #fff;
			}
		</style>
		
		<div class=captcha-frame>
			<div class=captcha-images>
				${retHTML}
			</div>
			
			<div class=captcha-input>
				<label>${cnt * 4 + 1}자리 숫자 입력: </label><br>
				<input type=text class=form-control name=captcha placeholder="공백 구분 안함">
			</div>
		</div>
	`;
}

function redirectToFrontPage(req, res) {
	res.redirect('/w/' + config.getString('frontpage'));
}

wiki.get('/w', redirectToFrontPage);

wiki.get('/', redirectToFrontPage);

wiki.get('/SQL', async function executeSQL(req, res) {
	if(config.getString('wiki.sql_execution_disabled', true)) {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const captcha = generateCaptcha(req, 5);
	
	const sp = itoa(randint(1000, 9999));
	
	print(`SQL 실행 PIN: ${sp}`);
	
	req.session.sqlpin = sha3(sp);
	
	res.send(await render(req, 'SQL 실행', `
		<form method=post>
			<div class=form-group>
				<label>구문: </label><br>
				<input type=text name=sql class=form-control>
			</div>
			
			<div class=form-group>
				<label>터미널의 PIN: </label><br>
				<input type=password name=sql class=form-control>
			</div>
			
			<div class=form-group>
				${captcha}
			</div>
		
			<div class=btns>
				<button type=submit class="btn btn-primary" style="width: 100px;">실행</button>
			</div>
		</form>
	`));
});

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
		if(!await getacl(req, title, 'read')) {
			httpstat = 403;
			error = true;
			res.status(403).send(await showError(req, 'insufficient_privileges_read'));
			
			return;
		} else {
			content = markdown(rawContent[0]['content']);
			
			if(title.startsWith("사용자:") && getperm('admin', title.replace(/^사용자[:]/, ''))) {
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
			<h2>문서가 존재하지 않습니다. 새로 작성하려면 <a href="/edit/${encodeURIComponent(title)}">여기</a>를 클릭하십시오.</h2>
		`;
	}
	
	res.status(httpstat).send(await render(req, title, content, {
		star_count: 0,
		starred: false,
		date: lstedt
	}, _, error, viewname));
});

wiki.get(/^\/edit\/(.*)/, async function editDocument(req, res) {
	const title = req.params[0];
	
	if(!await getacl(req, title, 'read')) {
		res.status(403).send(await showError(req, 'insufficient_privileges_read'));
		
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
	
	var captcha = '';
	
	if(!req.cookies.dooly) {
		captcha = generateCaptcha(req, 1);
	}
	
	if(!await getacl(req, title, 'edit')) {
		error = true;
		content = `
			${alertBalloon('권한 부족', '편집 권한이 부족합니다. 대신 <strong><a href="/new_edit_request/' + html.escape(title) + '">편집 요청</a></strong>을 생성하실 수 있습니다.', 'danger', true)}
		
			<textarea id="textInput" name="text" wrap="soft" class="form-control" readonly=readonly>${html.escape(rawContent)}</textarea>
		`;
	} else {
		content = `
			<!-- hidden input 가지고 장난치지 말 것. -->
		
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
			</ul>
			
			<div class="tab-content bordered">
				<div class="tab-pane active" id="edit" role="tabpanel">
					<form method="post" id="editForm" data-title="${title}" data-recaptcha="0">
						<input type="hidden" name="token" value="">
						<input type="hidden" name="identifier" value="${islogin(req) ? 'm' : 'i'}:${ip_check(req)}">
						<input type="hidden" name="baserev" value="${baserev}">
						
						<textarea id="textInput" name="text" wrap="soft" class="form-control">${html.escape(rawContent)}</textarea>

						<div class="form-group" style="margin-top: 1rem;">
							<label class="control-label" for="summaryInput">편집 메모:</label>
							<input type="text" class="form-control" id="logInput" name="log" value="">
						</div>
						
						<div class=form-group>
							${captcha}
						</div>
						
						<div class="btns">
							<button id="editBtn" class="btn btn-primary" style="width: 100px;">저장</button>
						</div>
					</form>
				</div>
				
				<div class="tab-pane" id="preview" role="tabpanel">
					
				</div>
				
				<div class="tab-pane" id="delete" role="tabpanel">
					<form method="post" id="editForm" data-title="${title}" data-recaptcha="0">
						<input type="hidden" name="token" value="">
						<input type="hidden" name="identifier" value="${islogin(req) ? 'm' : 'i'}:${ip_check(req)}">
						<input type="hidden" name="baserev" value="${baserev}">

						<div class="form-group" style="margin-top: 1rem;">
							<label>사유: </label>
							<input type="text" class="form-control" id="logInput" name="log" value="">
						</div>
						
						<label><input type=checkbox name=agree> 문서 제목을 변경하는 것이 아님에 동의합니다.</label>
						
						<div class=form-group>
							${captcha}
						</div>
						
						<div class="btns">
							<button id="editBtn" class="btn btn-danger" style="width: 100px;">문서 삭제</button>
						</div>
					</form>
				</div>
				
				<div class="tab-pane" id="move" role="tabpanel">
					<form method="post" id="editForm" data-title="${title}" data-recaptcha="0">
						<input type="hidden" name="token" value="">
						<input type="hidden" name="identifier" value="${islogin(req) ? 'm' : 'i'}:${ip_check(req)}">
						<input type="hidden" name="baserev" value="${baserev}">

						<div class="form-group" style="margin-top: 1rem;">
							<label>제목: </label>
							<input type=text class=form-control name=newtitle>
						</div>

						<div class="form-group" style="margin-top: 1rem;">
							<label>사유: </label>
							<input type="text" class="form-control" id="logInput" name="log" value="">
						</div>
						
						<div class=form-group>
							${captcha}
						</div>
						
						<div class="btns">
							<button id="editBtn" class="btn btn-warning" style="width: 100px;">문서 이동</button>
						</div>
					</form>
				</div>
			</div>
			
			<p style="font-weight: bold; color: red;">로그인하지 않았습니다. 역사에 IP(${ip_check(req)})를 영구히 기록하는 것에 동의하는 것으로 간주합니다.</p>
		`;
	}

	var httpstat = 200;
	
	res.status(httpstat).send(await render(req, title, content, {}, ' (편집)', error, 'edit'));
});

wiki.post(/^\/edit\/(.*)/, async function saveDocument(req, res) {
	const title = req.params[0];
	
	if(!await getacl(req, title, 'edit') || !await getacl(req, title, 'read')) {
		res.send(await showError(req, 'insufficient_privileges_edit'));
		
		return;
	}
	
	if(!req.cookies.dooly) {
		try {
			if(req.body['captcha'].replace(/\s/g, '') != req.session.captcha) {
				res.send(await showError(req, 'invalid_captcha_number'));
				return;
			} else {
				res.cookie('dooly', 0, {
					maxAge: 30 * 24 * 60 * 60 * 1000, 
					httpOnly: false 
				});
			}
		} catch(e) {
			res.send(await showError(req, 'captcha_check_fail'));
			return;
		}
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
	
	if(!curs.fetchall().length) return await showError(req, 'document_dont_exists');
	
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
						<a href="/w/${encodeURIComponent(row['title'])}">${html.escape(row['title'])}</a> 
						<a href="/history/${encodeURIComponent(row['title'])}">[역사]</a> 
						${
								Number(row['rev']) > 1
								? '<a \href="/diff/' + encodeURIComponent(row['title']) + '?rev=' + row['rev'] + '&oldrev=' + String(Number(row['rev']) - 1) + '">[비교]</a>'
								: ''
						} 
						<a href="/discuss/${encodeURIComponent(row['title'])}">[토론]</a> 
						
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
	
	res.send(await render(req, '최근 변경내역', content, {}));
});

wiki.get(/^\/contribution\/(ip|author)\/(.*)\/document/, async function documentContribution(req, res) {
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
						<a href="/w/${encodeURIComponent(row['title'])}">${html.escape(row['title'])}</a> 
						<a href="/history/${encodeURIComponent(row['title'])}">[역사]</a> 
						${
								Number(row['rev']) > 1
								? '<a \href="/diff/' + encodeURIComponent(row['title']) + '?rev=' + row['rev'] + '&oldrev=' + String(Number(row['rev']) - 1) + '">[비교]</a>'
								: ''
						} 
						<a href="/discuss/${encodeURIComponent(row['title'])}">[토론]</a> 
						
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
	
	res.send(await render(req, `${username}의 문서 기여 목록`, content, {}));
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
					<a href="/thread/${trd['tnum']}">${html.escape(trd['topic'])}</a> (<a href="/discuss/${encodeURIComponent(trd['title'])}">${html.escape(trd['title'])}</a>)
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
	
	res.send(await render(req, "최근 토론", content, {}));
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
						<a href="/thread/${row['tnum']}">#${row['id']} ${html.escape(td['topic'])}</a> (<a href="/w/${encodeURIComponent(td['title'])}">${html.escape(td['title'])}</a>)
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
	
	res.send(await render(req, `${username}의 토론 참여 내역`, content, {}));
});

wiki.get(/^\/history\/(.*)/, async function viewHistory(req, res) {
	const title = req.params[0];
	const from = req.query['from'];
	const until = req.query['until'];
	
	if(!await getacl(req, title, 'read')) {
		res.send(await showError(req, 'insufficient_privileges_read'));
		
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
	
	if(!curs.fetchall().length) res.send(await showError(req, 'document_dont_exists'));
	
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
						<strong>r${row['rev']}</strong> | <a rel=nofollow href="/w/${encodeURIComponent(title)}?rev=${row['rev']}">보기</a> |
							<a rel=nofollow href="/raw/${encodeURIComponent(title)}?rev=${row['rev']}" data-npjax="true">RAW</a> |
							<a rel=nofollow href="/blame/${encodeURIComponent(title)}?rev=${row['rev']}">Blame</a> |
							<a rel=nofollow href="/revert/${encodeURIComponent(title)}?rev=${row['rev']}">이 리비젼으로 되돌리기</a>${
								Number(row['rev']) > 1
								? ' | <a rel=nofollow href="/diff/' + encodeURIComponent(title) + '?rev=' + row['rev'] + '&oldrev=' + String(Number(row['rev']) - 1) + '">비교</a>'
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
	
	res.send(await render(req, title, content, _, '의 역사', error = false, viewname = 'history'));
});

wiki.get(/^\/discuss\/(.*)/, async function threadList(req, res) {
	const title = req.params[0];
	
	var state = req.query['state'];
	if(!state) state = '';
	
	if(!await getacl(req, title, 'read')) {
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
									<a class=more-box href="/thread/${trd['tnum']}">더보기...</a>
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
											getperm('hide_thread_comment', ip_check(req))
											? '[' + rs['hider'] + '에 의해 숨겨진 글입니다.]<br>' + markdown(rs['content'], rs['ismember'])
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
				<h4 class="wiki-heading">토론 발제</h4>
				
				<form method="post" class="new-thread-form" id="topicForm">
					<input type="hidden" name="identifier" value="${islogin(req) ? 'm' : 'i'}:${ip_check(req)}">
					
					<div class="form-group">
						<label>주제:</label>
						<input type="text" class="form-control" id="topicInput" name="topic">
					</div>

					<div class="form-group">
						<label>내용:</label>
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
	
	res.send(await render(req, title, content, _, subtitle, false, viewname));
});

wiki.post(/^\/discuss\/(.*)/, async function createThread(req, res) {
	const title = req.params[0];
	
	if(!await getacl(req, title, 'read')) {
		res.send(showError('insufficient_privileges_read'));
		
		return;
	}
	
	if(!await getacl(req, title, 'discuss')) {
		res.send(await showError(req, 'insufficient_privileges'));
		
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
					['1', req.body['text'], ip_check(req), getTime(), '0', '', '0', tnum, islogin(req) ? 'author' : 'ip', getperm('admin', ip_check(req)) ? '1' : '0']);
					
	res.redirect('/thread/' + tnum);
});

async function getThreadData(req, tnum, tid = '-1') {
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { return ''; }
	
	await curs.execute("select username from res where tnum = ? and (id = '1')", [tnum]);
	const fstusr = curs.fetchall()[0]['username'];
	
	await curs.execute("select title, topic, status from threads where tnum = ?", [tnum]);
	const title = curs.fetchall()[0]['title'];
	const topic = curs.fetchall()[0]['topic'];
	const status = curs.fetchall()[0]['status'];
	
	if(tid == '-1') {
		await curs.execute("select id, content, username, time, hidden, hider, status, ismember from res where tnum = ? order by cast(id as integer) asc", [tnum]);
	} else {
		await curs.execute("select id, content, username, time, hidden, hider, status, ismember from res where tnum = ? and (cast(id as integer) = 1 or (cast(id as integer) >= ? and cast(id as integer) < ?)) order by cast(id as integer) asc", [tnum, Number(tid), Number(tid) + 30]);
	}
	content = '';
	for(rs of curs.fetchall()) {
		var hbtn = ''
		if(getperm('hide_thread_comment', ip_check(req))) {
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
								getperm('hide_thread_comment', ip_check(req))
								? '[' + rs['hider'] + '에 의해 숨겨진 글입니다.]<br>' + markdown(rs['content'])
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
	
	return content;
}

wiki.get('/thread/:tnum', async function viewThread(req, res) {
	const tnum = req.param("tnum");
	
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
	
	var content = `
		<h2 class=wiki-heading style="cursor: pointer;">
			${html.escape(topic)}
			${
				getperm('delete_thread', ip_check(req))
				? '<span class=pull-right><a onclick="return confirm(\'삭제하시겠습니까?\');" href="/admin/thread/' + tnum + '/delete" class="btn btn-danger btn-sm">토론 삭제</a></span>'
				: ''
			}
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
							<span class="num"><a id="${i}">#${i}</a>&nbsp;</span>
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
		
		<h2 class=wiki-heading style="cursor: pointer;">댓글 달기</h2>
	`;
	
	if(req.query['nojs'] == '1' || (!req.query['nojs'] && compatMode(req))) {
		content += alertBalloon('경고', '지원되지 않는 브라우저를 사용하기 때문에 새로운 댓글을 자동으로 불러올 수 없습니다. <small>지원되며, 사용자 에이전트를 변경한 것이라면 <a href="?nojs=0">여기</a>를 누르십시오.</small>', 'warning');
	}
	
	if(getperm('update_thread_status', ip_check(req))) {
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
	
	if(getperm('update_thread_document', ip_check(req))) {
		content += `
        	<form method="post" id="thread-document-form">
        		쓰레드 이동
        		<input type="text" name="document" value="${title}">
        		<button id="changeBtn" class="d_btn type_blue">변경</button>
        	</form>
		`;
	}
	
	if(getperm('update_thread_topic', ip_check(req))) {
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
	if(!req.body['text']) {
		if(req.query['nojs'] == '1' || (!req.query['nojs'] && compatMode(req))) {
			res.send(await showError(req, 'invalid_request_body'));
			return;
		} else {
			res.json({});
			return;
		}
	}
	
	const tnum = req.param("tnum");
	
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
	
	if(!await getacl(req, title, 'discuss')) {
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

wiki.get('/thread/:tnum/:id', async function dropThreadData(req, res) {
	const tnum = req.param("tnum");
	const tid = req.param("id");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }
	
	await curs.execute("select username from res where tnum = ? and (id = '1')", [tnum]);
	const fstusr = curs.fetchall()[0]['username'];
	
	await curs.execute("select title, topic, status from threads where tnum = ?", [tnum]);
	const title = curs.fetchall()[0]['title'];
	const topic = curs.fetchall()[0]['topic'];
	const status = curs.fetchall()[0]['status'];
	
	if(!await getacl(req, title, 'read')) {
		res.send(await showError(req, 'insufficient_privileges_read'));
		
		return;
	}
	
	content = ``;
	
	content = await getThreadData(req, tnum, tid);
	
	res.send(content);
});

wiki.get('/admin/thread/:tnum/:id/show', async function showHiddenComment(req, res) {
	const tnum = req.param("tnum");
	const tid = req.param("id");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }
	
	if(!getperm('hide_thread_comment', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		
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
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }
	
	if(!getperm('hide_thread_comment', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	curs.execute("update res set hidden = '1', hider = ? where tnum = ? and id = ?", [ip_check(req), tnum, tid]);
	
	res.redirect('/thread/' + tnum);
});

wiki.post('/admin/thread/:tnum/status', async function updateThreadStatus(req, res) {
	const tnum = req.param("tnum");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }

	var newstatus = req.body['status'];
	if(!['close', 'pause', 'normal'].includes(newstatus)) newstatus = 'normal';
	
	if(!getperm('update_thread_status', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	curs.execute("update threads set status = ? where tnum = ?", [newstatus, tnum]);
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin) \
					values (?, ?, ?, ?, '0', '', '1', ?, ?, ?)", [
						String(rescount + 1), '스레드 상태를 <strong>' + newstatus + '</strong>로 변경', ip_check(req), getTime(), tnum, islogin(req) ? 'author' : 'ip', getperm('admin', ip_check(req)) ? '1' : '0' 
					]);
	
	res.json({});
});

wiki.post('/admin/thread/:tnum/document', async function updateThreadDocument(req, res) {
	const tnum = req.param("tnum");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }

	var newdoc = req.body['document'];
	if(!newdoc.length) {
		res.send('');
		return;
	}
	
	if(!getperm('update_thread_document', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	curs.execute("update threads set title = ? where tnum = ?", [newdoc, tnum]);
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin) \
					values (?, ?, ?, ?, '0', '', '1', ?, ?, ?)", [
						String(rescount + 1), '스레드를 <strong>' + newdoc + '</strong> 문서로 이동', ip_check(req), getTime(), tnum, islogin(req) ? 'author' : 'ip', getperm('admin', ip_check(req)) ? '1' : '0' 
					]);
	
	res.json({});
});

wiki.post('/admin/thread/:tnum/topic', async function updateThreadTopic(req, res) {
	const tnum = req.param("tnum");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }

	var newtopic = req.body['topic'];
	if(!newtopic.length) {
		res.send('');
		return;
	}
	
	if(!getperm('update_thread_topic', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	curs.execute("update threads set topic = ? where tnum = ?", [newtopic, tnum]);
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin) \
					values (?, ?, ?, ?, '0', '', '1', ?, ?, ?)", [
						String(rescount + 1), '스레드 주제를 <strong>' + newtopic + '</strong>로 변경', ip_check(req), getTime(), tnum, islogin(req) ? 'author' : 'ip', getperm('admin', ip_check(req)) ? '1' : '0' 
					]);
	
	res.json({});
});

wiki.get('/admin/thread/:tnum/delete', async function deleteThread(req, res) {
	const tnum = req.param("tnum");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }
	
	if(!getperm('delete_thread', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		
		return;
	}
	
	await curs.execute("select title, topic, status from threads where tnum = ?", [tnum]);
	const title = curs.fetchall()[0]['title'];
	const topic = curs.fetchall()[0]['topic'];
	const status = curs.fetchall()[0]['status'];
	
	curs.execute("delete from threads where tnum = ?", [tnum]);
	curs.execute("delete from res where tnum = ?", [tnum]);
	
	res.redirect('/discuss/' + encodeURIComponent(title));
});

wiki.post('/notify/thread/:tnum', async function notifyEvent(req, res) {
	var tnum = req.param("tnum");
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { res.send(await showError(req, "thread_not_found")); return; }
	
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
	
	var warningText = '';
	var warningScript = '';
	
	if(!req.secure) {
		warningText = '<p><strong><font color=red>[경고!] HTTPS 연결이 아닌 것같습니다. 로그인할 시 개인정보가 유출될 수 있으며, 이에 대한 책임은 본인에게 있습니다.</font></strong></p>';
		warningScript = ` onsubmit="return confirm('경고 - 지금 HTTPS 연결이 감지되지 않았습니다. 로그인할 경우 비밀번호가 다른 사람에게 노출될 수 있으며, 이에 대한 책임은 본인에게 있습니다. 계속하시겠습니까?');"`;
	}
	
	const captcha = generateCaptcha(req, 3);
	
	res.send(await render(req, '로그인', `
		${warningText}
		<form class=login-form method=post${warningScript}>
			<div class=form-group>
				<label>사용자 이름:</label><br>
				<input class=form-control name="username" type="text">
			</div>

			<div class=form-group>
				<label>비밀번호:</label><br>
				<input class=form-control name="password" type="password">
			</div>
			
			<div class=form-group>
				${captcha}
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
	
	try {
		if(req.body['captcha'].replace(/\s/g, '') != req.session.captcha) {
			res.send(await showError(req, 'invalid_captcha_number'));
			return;
		}
	} catch(e) {
		res.send(await showError(req, 'captcha_check_fail'));
		return;
	}
	
	const captcha = generateCaptcha(req, 3);
	
	var warningText = '';
	var warningScript = '';
	
	if(!req.secure) {
		warningText = '<p><strong><font color=red>[경고!] HTTPS 연결이 아닌 것같습니다. 로그인할 시 개인정보가 유출될 수 있으며, 이에 대한 책임은 본인에게 있습니다.</font></strong></p>';
		warningScript = ` onsubmit="return confirm('경고 - 지금 HTTPS 연결이 감지되지 않았습니다. 로그인할 경우 비밀번호가 다른 사람에게 노출될 수 있으며, 이에 대한 책임은 본인에게 있습니다. 계속하시겠습니까?');"`;
	}
	
	if(!id.length) {
		res.send(await render(req, '로그인', `
			${warningText}
			<form class=login-form method=post${warningScript}>
				<div class=form-group>
					<label>사용자 이름:</label><br>
					<input class=form-control name="username" type="text">
					<p class=error-desc>사용자 이름의 값은 필수입니다.</p>
				</div>

				<div class=form-group>
					<label>비밀번호:</label><br>
					<input class=form-control name="password" type="password">
				</div>
			
				<div class=form-group>
					${captcha}
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
		res.send(await render(req, '로그인', `
			${warningText}
			<form class=login-form method=post${warningScript}>
				<div class=form-group>
					<label>사용자 이름:</label><br>
					<input class=form-control name="username" type="text" value="${html.escape(id)}">
				</div>

				<div class=form-group>
					<label>비밀번호:</label><br>
					<input class=form-control name="password" type="password">
					<p class=error-desc>암호의 값은 필수입니다.</p>
				</div>
			
				<div class=form-group>
					${captcha}
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
		res.send(await render(req, '로그인', `
			${warningText}
			<form class=login-form method=post${warningScript}>
				<div class=form-group>
					<label>사용자 이름:</label><br>
					<input class=form-control name="username" type="text" value="${html.escape(id)}">
					<p class=error-desc>사용자 이름이 올바르지 않습니다.</p>
				</div>

				<div class=form-group>
					<label>비밀번호:</label><br>
					<input class=form-control name="password" type="password">
				</div>
			
				<div class=form-group>
					${captcha}
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
	
	await curs.execute("select username, password from users where username = ? and password = ?", [id, sha3(pw)]);
	if(!curs.fetchall().length) {
		res.send(await render(req, '로그인', `
			${warningText}
			<form class=login-form method=post${warningScript}>
				<div class=form-group>
					<label>사용자 이름:</label><br>
					<input class=form-control name="username" type="text" value="${html.escape(id)}">
				</div>

				<div class=form-group>
					<label>비밀번호:</label><br>
					<input class=form-control name="password" type="password">
					<p class=error-desc>암호가 올바르지 않습니다.</p>
				</div>
			
				<div class=form-group>
					${captcha}
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
	
	if(req.body['autologin']) {
		const usrtkn = rndval('0123456789abcdefghijklmnopqrstuvwxzABCDEFGHIJKLMNOPQRSTUVWXYZ', 64);
		curs.execute("delete from tokens where username = ?", [id]);
		curs.execute("insert into tokens (username, token) values (?, ?)", [id, usrtkn]);
		
		res.cookie('gildong', '', {
			maxAge: 0, 
			httpOnly: true
			//secure: true
		});
		res.cookie('icestar', '', {
			maxAge: 0, 
			httpOnly: true
			//secure: true
		});
		
		res.cookie('gildong', id, {
			maxAge: 90 * 24 * 60 * 60 * 1000, 
			httpOnly: true
			//secure: true
		});
		res.cookie('icestar', sha3(sha3(sha3(sha3(pw))) + sha3(usrtkn)), {
			maxAge: 90 * 24 * 60 * 60 * 1000, 
			httpOnly: true
			//secure: true
		});
	}
	
	await curs.execute("delete from useragents where username = ?", [id]);
	await curs.execute("insert into useragents (username, string) values (?, ?)", [id, req.headers['user-agent'] ? req.headers['user-agent'] : '']);
	
	res.redirect(desturl);
});

wiki.get('/member/logout', async function logout(req, res) {
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	req.session.username = undefined;
	
	res.redirect(desturl);
});

wiki.get('/member/signup', async function signupEmailScreen(req, res) {
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	const captcha = generateCaptcha(req, 1);
	
	res.send(await render(req, '계정 만들기', `
		<form method=post class=signup-form>
			<div class=form-group>
				<label>전자우편 주소:</label><br>
				<input type=email name=email class=form-control>
			</div>
				
			<div class=form-group>
				${captcha}
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

wiki.post('/member/signup', async function emailConfirmation(req, res) {
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	try {
		if(req.body['captcha'].replace(/\s/g, '') != req.session.captcha) {
			res.send(await showError(req, 'invalid_captcha_number'));
			return;
		}
	} catch(e) {
		res.send(await showError(req, 'captcha_check_fail'));
		return;
	}
	
	const captcha = generateCaptcha(req, 1);
	
	await curs.execute("delete from account_creation where cast(time as integer) < ?", [Number(getTime()) - 86400000]);
	
	await curs.execute("select email from account_creation where email = ?", [req.body['email']]);
	if(curs.fetchall().length) {
		res.send(await render(req, '계정 만들기', `
			<form method=post class=signup-form>
				<div class=form-group>
					<label>전자우편 주소:</label><br>
					<input type=email name=email class=form-control>
					<p class=error-desc>사용 중인 이메일입니다.</p>
				</div>
				
				<div class=form-group>
					${captcha}
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
	
	res.send(await render(req, '계정 만들기', `
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
		res.send(await showError(req, 'invalid_signup_key'));
		
		return;
	}
	
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	var warningText = '';
	var warningScript = '';
	
	if(!req.secure) {
		warningText = '<p><strong><font color=red>[경고!] HTTPS 연결이 아닌 것같습니다. 가입 시 개인정보가 유출될 수 있으며, 이에 대한 책임은 본인에게 있습니다.</font></strong></p>';
		warningScript = ` onsubmit="return confirm('지금 HTTPS 연결이 감지되지 않았습니다. 가입할 경우 비밀번호가 다른 사람에게 노출될 수 있으며, 이에 대한 책임은 본인에게 있습니다. 계속하시겠습니까?');"`;
	}
	
	const captcha = generateCaptcha(req, 2);
	
	res.send(await render(req, '계정 만들기', `
		${warningText}
	
		<form class=signup-form method=post${warningScript}>
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
			
			<div class=form-group>
				${captcha}
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
		res.send(await showError(req, 'invalid_signup_key'));
		
		return;
	}
	
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	const id = req.body['username'];
	const pw = req.body['password'];
	const pw2 = req.body['password_check'];
	
	try {
		if(req.body['captcha'].replace(/\s/g, '') != req.session.captcha) {
			res.send(await showError(req, 'invalid_captcha_number'));
			return;
		}
	} catch(e) {
		res.send(await showError(req, 'captcha_check_fail'));
		return;
	}
	
	const captcha = generateCaptcha(req, 2);
	
	await curs.execute("select username from users where username = ? COLLATE NOCASE", [id]);
	if(curs.fetchall().length) {
		res.send(await render(req, '계정 만들기', `
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
			
				<div class=form-group>
					${captcha}
				</div>
			
				<p><strong>가입후 탈퇴는 불가능합니다.</strong></p>
				
				<button type=reset class="btn btn-secondary">초기화</button><button type="submit" class="btn btn-primary">가입</button>
			</form>
		`, {}));
		
		return;
	}
	
	if(!id.length) {
		res.send(await render(req, '계정 만들기', `
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
			
				<div class=form-group>
					${captcha}
				</div>

			
				<p><strong>가입후 탈퇴는 불가능합니다.</strong></p>
				
				<button type=reset class="btn btn-secondary">초기화</button><button type="submit" class="btn btn-primary">가입</button>
			</form>
		`, {}));
		
		return;
	}
	
	if(!pw.length) {
		res.send(await render(req, '계정 만들기', `
			<form class=signup-form method=post>
				<div class=form-group>
					<label>사용자 ID</label><br>
					<input class=form-control name="username" type="text">
				</div>

				<div class=form-group>
					<label>암호</label><br>
					<input class=form-control name="password" type="password">
					<p class=error-desc>암호의 값은 필수입니다.</p>
				</div>

				<div class=form-group>
					<label>암호 확인</label><br>
					<input class=form-control name="password_check" type="password">
				</div>
			
				<div class=form-group>
					${captcha}
				</div>

			
				<p><strong>가입후 탈퇴는 불가능합니다.</strong></p>
				
				<button type=reset class="btn btn-secondary">초기화</button><button type="submit" class="btn btn-primary">가입</button>
			</form>
		`, {}));
		
		return;
	}
	
	if(pw != pw2) {
		res.send(await render(req, '계정 만들기', `
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
			
				<div class=form-group>
					${captcha}
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
			await curs.execute(`insert into perms (username, perm) values (?, ?)`, [id, perm]);
			if(typeof(permlist[id]) == 'undefined')
				permlist[id] = [perm];
			else
				permlist[id].push(perm);
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
	curs.execute("insert into useragents (username, string) values (?, ?)", [id, req.headers['user-agent'] ? req.headers['user-agent'] : '']);
	
	res.redirect(desturl);
});

wiki.get('/Upload', async function fileUploadPage(req, res) {
	await curs.execute("select license from filelicenses order by license");
	const licelst = curs.fetchall();
	await curs.execute("select category from filecategories order by category");
	const catelst = curs.fetchall();
	
	var liceopts = '', cateopts = '';
	
	for(var lice of licelst) {
		liceopts += `<option>${html.escape(lice['license'])}</option>`;
	}
	for(var cate of catelst) {
		cateopts += `<option>${html.escape(cate['category'])}</option>`;
	}
	
	var content = '';
	
	if(!req.query['nojs'] && compatMode(req)) {
		res.redirect('/Upload?nojs=1');
		return;
	}
	
	if(!req.query['nojs'] || (req.query['nojs'] && req.query['nojs'] != '1')) {
		content = `
			<form class=file-upload-form method=post id=usingScript enctype="multipart/form-data">
				<div class=form-group>
					<label>화일 선택: </label><br>
					<input class=form-control type=file name=file>
				</div>

				<div class=form-group>
					<label>사용할 화일 이름: </label><br>
					<input class=form-control type=text name=document>
				</div>

				<div class=form-group>
					<label>화일 정보: </label><br>
					<div style="width: 140px; display: inline-block; float: left;">
						<select id=propertySelect class=form-control size=5 placeholder="직접 입력" style="height: 400px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; borde-right: none;">
							<option value=1 selected>출처</option>
							<option value=2>저작자</option>
							<option value=3>만든 이</option>
							<option value=4>날짜</option>
							<option value=5>메모</option>
						</select>
					</div>
					
					<div style="width: calc(100% - 140px); display: inline-block; float: right;">
						<textarea name=prop1 data-id=1 class="form-control property-content" style="height: 400px; border-top-left-radius: 0px; border-bottom-left-radius: 0px;"></textarea>
						<textarea name=prop2 data-id=2 class="form-control property-content" style="display: none; height: 400px; border-top-left-radius: 0px; border-bottom-left-radius: 0px;"></textarea>
						<textarea name=prop3 data-id=3 class="form-control property-content" style="display: none; height: 400px; border-top-left-radius: 0px; border-bottom-left-radius: 0px;"></textarea>
						<textarea name=prop4 data-id=4 class="form-control property-content" style="display: none; height: 400px; border-top-left-radius: 0px; border-bottom-left-radius: 0px;"></textarea>
						<textarea name=prop5 data-id=5 class="form-control property-content" style="display: none; height: 400px; border-top-left-radius: 0px; border-bottom-left-radius: 0px;"></textarea>
					</div>
				</div>

				<div class=form-group>
					<div style="width: 49.5%; display: inline-block; float: left;">
						<label>분류:</label><br>
						<input style="border-bottom-right-radius: 0px; border-bottom-left-radius: 0px; border-bottom: none;" data-datalist=categorySelect class="form-control dropdown-search" type=text name=category placeholder="목록에 없으면 이곳에 입력하십시오">
						<select style="height: 170px; border-top-right-radius: 0px; border-top-left-radius: 0px;" id=categorySelect class="form-control input-examples" size=8>
							${cateopts}
						</select>
					</div>
					
					<div style="width: 49.5%; display: inline-block; float: right;">
						<label>저작권:</label><br>
						<input style="border-bottom-right-radius: 0px; border-bottom-left-radius: 0px; border-bottom: none;" data-datalist=licenseSelect class="form-control dropdown-search" type=text name=license placeholder="목록에 없으면 이곳에 입력하십시오">
						<select style="height: 170px; border-top-right-radius: 0px; border-top-left-radius: 0px;" id=licenseSelect class="form-control input-examples" size=8>
							${liceopts}
							<option>제한적 이용</option>
						</select>
					</div>
				</div>

				<div class=btns>
					<button type=submit class="btn btn-primary" style="width: 100px;">올리기</button>
				</div>
			</form>`;
	} else {
		content = `
			<form method=post enctype="multipart/form-data">
				<div class=form-group>
					<label>화일 선택: </label><br>
					<input class=form-control type=file name=file>
				</div>

				<div class=form-group>
					<label>사용할 화일 이름: </label><br>
					<input class=form-control type=text name=document>
				</div>

				<div class=form-group>
					<label>출처: </label><br>
					<textarea name=prop1 class=form-control rows=3></textarea>
				</div>

				<div class=form-group>
					<label>저작자: </label><br>
					<textarea name=prop2 class=form-control rows=3></textarea>
				</div>

				<div class=form-group>
					<label>만든 이: </label><br>
					<textarea name=prop3 class=form-control rows=3></textarea>
				</div>

				<div class=form-group>
					<label>날짜: </label><br>
					<textarea name=prop4 class=form-control rows=3></textarea>
				</div>

				<div class=form-group>
					<label>메모: </label><br>
					<textarea name=prop5 class=form-control rows=3></textarea>
				</div>

				<div class=form-group>
					<label>분류: <span style="color: gray; float: right;">분류를 추가하려면 자바스크립트가 지원되어야 합니다.</span></label><br>
					<select name=category id=categorySelect class="form-control input-examples" size=8 placeholder="직접 입력">
						${cateopts}
					</select>
				</div>

				<div class=form-group>
					<label>저작권: <span style="color: gray; float: right;">라이선스를 추가하려면 자바스크립트가 지원되어야 합니다.</span></label><br>
					<select name=license id=licenseSelect class="form-control input-examples" size=8 placeholder="직접 입력">
						${liceopts}
						<option>제한적 이용</option>
					</select>
				</div>

				<div class=btns>
					<button type=submit class="btn btn-primary" style="width: 100px;">올리기</button>
				</div>
			</form>
		`;
	}
	
	if(!req.query['nojs']) {
		content += `
			<noscript>
				<meta http-equiv=refresh content="0; url=?nojs=1" />
			</noscript>
		`;
	}
	
	res.send(await render(req, '화일 올리기', content, {}));
});

wiki.post('/Upload', async function saveFile(req, res) {
	const file = req.files['file'];
	
	var content = `[include(틀:이미지 라이선스/${req.body['license']})]\n[[분류:파일/${req.body['category']}]]\n\n` + req.body['text'];
	
	/*
		'files': ['filename', 'prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'license', 'category']
		'filehistory': ['filename', 'prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'license', 'category', 'username', 'editor']
		'filelicenses': ['license', 'creator']
		'filecategories': ['category', 'creator']
	*/
	
	const fn = req.body['document'] + path.extname(file.name);
	
	await curs.execute("select filename from files where filename = ?", [fn]);
	if(curs.fetchall().length) {
		req.send(await showError(req, 'file_already_exists'));
		return;
	}
	
	file.mv('./images/' + sha3(file.name) + path.extname(file.name), async function moveToServer(err) {
		await curs.execute("select license from filelicenses where license = ?", [req.body['license']]);
		if(!curs.fetchall().length) {
			await curs.execute("insert into filelicenses (license, creator) values (?, ?)", [req.body['license'], ip_check(req)]);
		}
		
		await curs.execute("select category from filecategories where category = ?", [req.body['category']]);
		if(!curs.fetchall().length) {
			await curs.execute("insert into filecategories (category, creator) values (?, ?)", [req.body['category'], ip_check(req)]);
		}
		
		curs.execute("insert into files (filename, prop1, prop2, prop3, prop4, prop5, license, category) values (?, ?, ?, ?, ?, ?, ?, ?)", [fn, req.body['prop1'], req.body['prop2'], req.body['prop3'], req.body['prop4'], req.body['prop5'], req.body['license'], req.body['category']]);
		curs.execute("insert into filehistory (filename, prop1, prop2, prop3, prop4, prop5, license, category, username, rev) values (?, ?, ?, ?, ?, ?, ?, ?, ?, '1')", [fn, req.body['prop1'], req.body['prop2'], req.body['prop3'], req.body['prop4'], req.body['prop5'], req.body['license'], req.body['category'], ip_check(req)]);
		
		res.redirect('/file/' + encodeURIComponent(req.body['document']));
	});
});

wiki.get(/^\/acl\/(.*)/, async function aclControlPanel(req, res) {
	const title = req.params[0];
	
	const dispname = ['읽기', '편집', '토론', '편집 요청'];
	const aclname  = ['read', 'edit', 'discuss', 'edit_request'];
	
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
	
		await curs.execute("select value, notval from acl where action = ? and title = ? and type = ? order by value", [
			'allow', title, aclname[acl]
		]);
		
		for(var aclitm of curs.fetchall()) {
			ret1 += `<option>${aclitm['not'] == '1' ? 'not ' : ''}${aclitm['value']}</option>`;
		}
		
		await curs.execute("select value, notval from acl where action = ? and title = ? and type = ? order by value", [
			'deny', title, aclname[acl]
		]);
		
		for(var aclitm of curs.fetchall()) {
			ret2 += `<option>${aclitm['not'] == '1' ? 'not ' : ''}${aclitm['value']}</option>`;
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
	
	res.send(await render(req, title, content, {}, ' (ACL)', _, 'acl'));
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
	const title = req.params[0];
	
	const action = req.body['action'];
	const type   = req.body['type'];
	const value  = req.body['value'];
	const mode   = req.body['mode'];
	const not    = req.body['not'] ? '1' : '0';
	
	if(!action || !type || !value || !mode || !not) {
		res.send(await showError(req, 'invalid_request_body'));
		return;
	}
	
	if(!action || !type || !value || !mode || !not) {
		res.send(await showError(req, 'invalid_value'));
		return;
	}
	
	if(!getperm('acl', ip_check(req))) {
		res.redirect('/');
		
		return;
	}
	
	switch(mode) {
		case 'add':
			await curs.execute("insert into acl (title, action, value, type, notval) values (?, ?, ?, ?, ?)", [
				title, action, value, type, not
			]);
		break;case 'remove':
			await curs.execute("delete from acl where value = ? and title = ? and notval = ? and type = ? and action = ?", [
				value, title, not, type, action
			]);
	}
	
	var rev = 1;
	
	await curs.execute("select rev from history where title = ? order by CAST(rev AS INTEGER) desc limit 1", [title]);
	try {
		rev = Number(curs.fetchall()[0]['rev']) + 1;
	} catch(e) {
		rev = 0 + 1;
	}
	
	var dc = '';
	
	await curs.execute("select content from documents where title = ?", [title]);
	const asdf = curs.fetchall();
	
	if(asdf.length) dc = asdf[0]['content'];
	
	await curs.execute("insert into history (title, content, rev, username, time, changes, log, iserq, erqnum, ismember, advance) \
					values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
		title, dc, rev, ip_check(req), getTime(), '0', '', '0', '-1', islogin(req) ? 'author' : 'ip', `(ACL ${mode == 'add' ? '추가' : '삭제'} - ${type}:${action == 'deny' ? '거부' : '허용'}:${html.escape(value)})`
	]);
	
	var retval = '';
	
	await curs.execute("select value, notval from acl where action = ? and title = ? and type = ? order by value", [
		action, title, type
	]);
	
	for(var acl of curs.fetchall()) {
		retval += `<option>${acl['not'] == '1' ? 'not ' : ''}${acl['value']}</option>`;
	}
	
	if(req.query['nojs'] == '1') {
		res.redirect('/acl/' + encodeURIComponent(title) + '?nojs=1');
	} else {
		res.send(retval);
	}
});

/*
function processVotes(req, rtype) {
	const num = req.param('num');
	
    await curs.execute("select num, name, start, end, required_date, options, mode from vote where num = ?", [num]);
    const dbData = curs.fetchall();
    var voteTitle = '무제';
    if(dbData.length) {
        voteTitle = dbData[0]['name'];
        var data = ''
        data += '시작일: ' + dbData[0]['start'] + '<br>'
        data += '종료일: ' + dbData[0]['end'] + '<br>'
        data += '투표 방식: ' + dbData[0]['mode'] + ' 투표<br>'
        if(!(['공개', '비공개', '기명'].includes(dbData[0]['mode']))) {
            return await showError(req, 'invalid_vote_type');
		}
		
        var adminMenu = '<span class="pull-right" style="display: inline-block;">'
        if(getperm('delete_vote'))
            adminMenu += '<a href="/admin/vote/' + num + '/delete" class="btn btn-danger btn-sm" onclick="return confirm(\'삭제하시겠습니까?\');">[ADMIN] 삭제</a>';
        if(getperm('edit_vote'))
            adminMenu += ' <a href="/admin/vote/' + num + '/edit" class="btn btn-warning btn-sm">[ADMIN] 편집</a></span>';
        adminMenu += '</span>';
        data += '<br><h2 style="border:none">투표하기 ' + adminMenu + '</h2>';
        await curs.execute("select data, username, date from votedata where num = ? order by data, date asc", [num]);
        data += '<textarea rows=5 readonly style="background:#eceeef" class="form-control">';
        for(var i of curs.fetchall()) {
            if dbData[0]['mode'] == '기명':
                data += i[2] + ' (UTC) - "' + i[1] + '" 사용자가 투표: ' + i[0] + '\n'
            elif dbData[0][6] == '공개':
                if admin_check() == 1:
                    data += '[ADMIN] ' + i[2] + ' (UTC) - "' + i[1] + '" 사용자가 투표: ' + i[0] + '\n'
                else:
                    data += i[2] + ' (UTC) - "' + i[1] + '" 사용자가 투표 완료.\n'
            else:
                if admin_check() == 1:
                    data += '[ADMIN] ' + i[2] + ' (UTC) - "' + i[1] + '" 사용자가 투표: ' + i[0] + '\n'
                else:
                    data += '어떤 사용자가 어디론가 투표함.\n'
		}
        data += '</textarea><hr>'
        if not('state' in flask.session):
            data += '로그인이 필요합니다.'
        else:
            if re.sub('[ ]\d{1,2}[:]\d{1,2}[:]\d{1,2}', '', get_time()) >= dbData[0][3]:
                data += '기한 만료.'
            elif re.sub('[ ]\d{1,2}[:]\d{1,2}[:]\d{1,2}', '', get_time()) < dbData[0][2]:
                data += '투표가 시작되지 않았음.'
            elif re.sub('[ ]\d{1,2}[:]\d{1,2}[:]\d{1,2}', '', getUserDate(conn, ip_check())) > dbData[0][4]:
                data += '자격 조건 미달.'
            else:
                curs.execute("select data from votedata where username = ? and num = ?", [ip_check(), num])
                if curs.fetchall():
                    data += '투표 완료.'
                else:
                    data += dbData[0][5] + '<br><div class="btns pull-right"><button type="submit" class="btn btn-info" style="width: 120px;">투표</button></div>'
    } else {
        res.send(await showError(req, '투표를 찾을 수 없습니다.'));
		return;
	}

    if flask.request.method == 'POST':
        curs.execute("select num, name, start, end, deserve, options, mode from vote where num = ?", [num])
		dbData = curs.fetchall()
		if not(dbData):
			return showError('투표를 찾을 수 없습니다.')
		if not('state' in flask.session):
			return showError('로그인이 필요합니다.')
		if re.sub('[ ]\d{1,2}[:]\d{1,2}[:]\d{1,2}', '', get_time()) >= dbData[0][3]:
			return showError('기한이 만료되었습니다.')
		elif re.sub('[ ]\d{1,2}[:]\d{1,2}[:]\d{1,2}', '', get_time()) < dbData[0][2]:
			return showError('투표가 아직 시작되지 않았습니다.')
		elif re.sub('[ ]\d{1,2}[:]\d{1,2}[:]\d{1,2}', '', getUserDate(conn, ip_check())) > dbData[0][4]:
			return showError('자격 조건을 충족하지 않습니다.')
		if ban_check() == 1:
			return re_error('/ban')
		curs.execute("select data from votedata where username = ? and num = ?", [ip_check(), num])
		if curs.fetchall():
			return showError('투표를 이미 완료했습니다.')
		if getForm('voteOptionsSelect', None) == None:
			return easy_minify(flask.render_template(skin_check(),
				imp = [voteTitle, wiki_set(), custom(), other2([' (투표)', 0])],
				data =  alertBalloon('투표한 옵션이 없습니다.') + '''
						<form method="post" onsubmit="return confirm('계속하시겠습니까? 취소 및 수정은 불가능합니다.');">
							''' + data + '''
						</form>
						''',
				menu = 0,
				err = 1,
				vote = 1
			))
		curs.execute("insert into votedata (num, username, data, date) values (?, ?, ?, ?)", [num, ip_check(), getForm('voteOptionsSelect'), get_time()])
		conn.commit()
		return redirect('/vote/' + num)

    else:
        return easy_minify(flask.render_template(skin_check(),
            imp = [voteTitle, wiki_set(), custom(), other2([' (투표)', 0])],
            data =  '''
                    <form method="post" onsubmit="return confirm('계속하시겠습니까? 취소 및 수정은 불가능합니다.');">
                        ''' + data + '''
                    </form>
                    ''',
            menu = 0,
            vote = 1,
            smsub = ' 투표'
        ))
}
*/

wiki.get('/vote/:num', async function voteScreen(req, res) {
	processVotes(req, 'get');
});

wiki.post('/vote/:num', async function submitVote(req, res) {
	processVotes(req, 'post');
});

wiki.use(function(req, res, next) {
    return res.status(404).send(`
		접속한 페이지가 없음.
	`);
});

if(firstrun) {
	(async function setWikiData() {
		const SML = [
			"바나나를 불러오는 중...",
			"바나나를 꺼내는 중...",
			"바나나 껍질을 까는 중...",
			"바나나 나무를 찾는 중..."
		];
		
		print(
			SML[ Math.floor(Math.random() * SML.length) ] + 
			'\n'
		);
		
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
		
		const server = wiki.listen(hostconfig['port']); // 서버실행
		print(String(hostconfig['host']) + ":" + String(hostconfig['port']) + "에 실행 중. . .");
	})();
}

