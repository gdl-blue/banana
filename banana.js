module.exports={run:function(){

const isArray = obj => Object.prototype.toString.call(obj) == '[object Array]';
const ifelse = (e, y, n) => e ? y : n;
const pow = (밑, 지수) => 밑 ** 지수;
const sqrt = Math.sqrt;
const floorof = Math.floor;
const rand = (s, e) => Math.random() * (e + 1 - s) + s;
const randint = (s, e) => floorof(Math.random() * (e + 1 - s) + s);
const len = obj => obj.length;
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

// https://stackoverflow.com/questions/1183872/put-a-delay-in-javascript
function timeout(ms) {
	var s = new Date().getTime();
	for (var i=0; i<1e7; i++) {
		if(new Date().getTime() - s > ms) break;
	}
}

const perms = [
	'admin', 'suspend_account', 'developer', 'update_thread_document', 'ipacl',
	'update_thread_status', 'update_thread_topic', 'hide_thread_comment', 'grant',
	'login_history', 'delete_thread', 'acl', 'create_vote', 'delete_vote', 'edit_vote',
	'ban_users'
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

const random = {
	choice: function(x) {
		switch(typeof(x)) {
			case 'string':
				return rndval(x, 1);
			case 'object':
				return x[ Math.floor(Math.random() * x.length) ];
		}
	}
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
	const hash = new SHA3(256);
	
	hash.update(p);
	return hash.digest('hex');
}

const ipRangeCheck = require("ip-range-check");

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

swig.setFilter('encode_userdoc', function filter_encodeUserdocURL(input) {
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
var botlist = {};

var firstrun = 1;
var hostconfig;
try { hostconfig = require('./config.json'); }
catch(e) {
	firstrun = 0;
	(async function setupWiki() {
		print("바나나 위키엔진에 오신것을 환영합니다.");
		print("버전 2.0.0 [디버그 전용]");
		
		prt('\n');
		
		hostconfig = {
			host: input("호스트 주소: "),
			port: input("포트 번호: "),
			secret: input("세션 비밀 키: ")
		};
		
		const defskin = input("기본 스킨 이름: ");
		
		print("\n기본 설정을 구성하고 있습니다. 잠시만 기다려 주세요~^^");
		
		const tables = {
			'documents': ['title', 'content'],
			'history': ['title', 'content', 'rev', 'time', 'username', 'changes', 'log', 'iserq', 'erqnum', 'advance', 'ismember'],
			'namespaces': ['namespace', 'locked', 'norecent', 'file'],
			'users': ['username', 'password', 'id'],
			'user_settings': ['username', 'key', 'value'],
			'acl': ['title', 'notval', 'type', 'value', 'action', 'hipri'],
			'nsacl': ['namespace', 'no', 'type', 'content', 'action', 'expire'],
			'config': ['key', 'value'],
			'email_filters': ['address'],
			'stars': ['title', 'username', 'lastedit'],
			'perms': ['perm', 'username'],
			'threads': ['title', 'topic', 'status', 'time', 'tnum'],
			'res': ['id', 'content', 'username', 'time', 'hidden', 'hider', 'status', 'tnum', 'ismember', 'isadmin', 'stype'],
			'useragents': ['username', 'string'],
			'login_history': ['username', 'ip'],
			'account_creation': ['key', 'email', 'time'],
			'files': ['filename', 'prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'license', 'category'],
			'filehistory': ['filename', 'prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'license', 'category', 'username', 'rev'],
			'blockhistory': ['ismember', 'type', 'blocker', 'username', 'durationstring', 'startingdate', 'endingdate', 'al', 'blockview'],
			'banned_users': ['username', 'blocker', 'startingdate', 'endingdate', 'ismember', 'al', 'isip', 'blockview'],
			'filelicenses': ['license', 'creator'],
			'filecategories': ['category', 'creator'],
			'vote': ['num', 'name', 'start', 'end', 'required_date', 'options', 'mode'],
			'votedata': ['data', 'username', 'date', 'num'],
			'tokens': ['username', 'token'],
			'requests': ['ip', 'time'],
			'bbs_boards': ['name', 'id'],
			'bbs_posts': ['userid', 'boardid', 'title', 'content', 'category', 'id', 'time'],
			'bbs_categories': ['name', 'id'],
			'bbs_comments': ['userid', 'postid', 'content', 'id', 'deleted', 'edited', 'time'],
			'bbs_ids': ['id'],
			'bots': ['username', 'token', 'owner'],
			'email_config': ['service', 'email', 'password']
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
		
		timeout(5000);
		
		const fcates = ['동물', '게임', '컴퓨터', '요리', '탈것', '전화기', '기계', '광고', '도구', '만화/애니메이션', '아이콘/기호'];
		const flices = ['CC BY', 'CC BY-NC', 'CC BY-NC-ND', 'CC BY-NC-SA', 'CC BY-ND', 'CC BY-SA', 'CC-0', 'PD-author', 'PD-self', 'PD-software'];
		const bcates = {
			'문의': ['대기', '완료'],
			'신고': ['대기', '완료'],
		};
		
		for(var cate of fcates) {
			await curs.execute("insert into filecategories (category, creator) values (?, '')", [cate]);
		}
		
		for(var lice of flices) {
			await curs.execute("insert into filelicenses (license, creator) values (?, '')", [lice]);
		}
		
		fs.writeFileSync('config.json', JSON.stringify(hostconfig), 'utf8');
		
		timeout(5000);
		
		curs.execute("insert into config (key, value) values ('default_skin', ?)", [defskin]);
		
		timeout(5000);
		
		print("\n설정이 완료되었습니다. 5초 후에 엔진을 다시 시작하십시오.");
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
	},
	resave: true,
	saveUninitialized: true
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
		
		if(typeof(wikiconfig[str]) == 'undefined') {
			wikiconfig[str] = def;
			curs.execute("insert into config (key, value) values (?, ?)", [str, def]);
			return def;
		}
		return wikiconfig[str];
	}
}

const _ = undefined;

function getSkin() {
	return config.getString('default_skin', hostconfig['skin']);
}

function getperm(perm, username) {
	try {
		return permlist[username].includes(perm)
	} catch(e) {
		return false;
	}
}

async function fetchNamespaces() {
	return ['문서', '틀', '분류', '파일', '사용자', 'wiki', '휴지통', '파일휴지통'];
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
	
	if(config.getString('enable_opennamu_skins', '1') == '1') {
		// 오픈나무 스킨 호환용
		templateVariables['imp'] = [
			title,  // 페이지 제목 (imp[0])
			[  // 위키 설정 (imp[1][x])
				config.getString('wiki.site_name', random.choice(['바나나', '사과', '포도', '오렌지', '배', '망고', '참외', '수박', '둘리', '도우너'])),  // 위키 이름
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
	}
	
	if(islogin(req)) {
		templateVariables['member'] = {
			username: req.session.username
		}
	}
	
	const nslist = await fetchNamespaces();
	
	if(['wiki', 'notfound', 'edit', 'thread', 'thread_list', 'thread_list_close',
			'move', 'delete', 'xref', 'history', 'acl'].includes(viewname)) {
		const ns = title.split(':')[0];
		
		templateVariables['document'] = {
			toString: function() {
				return title;
			},
			title: nslist.includes(ns)
					? title.replace(new RegExp('^' + ns + ':'), '')
					: title,
			namespace: nslist.includes(ns) ? ns : '문서'
		};
	}
	
	output = template(templateVariables);
	
	var header = '<html><head>';
	var skinconfig = require("./skins/" + getSkin() + "/config.json");
	header += `
		<title>${title}${subtitle} - ${config.getString('site_name', random.choice(['바나나', '사과', '포도', '오렌지', '배', '망고', '참외', '수박', '둘리', '도우너']))}</title>
		<meta charset=utf-8>
		<meta name=generator content=banana>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link rel="stylesheet" href="/css/banana.css">
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
		'invalid_signup_key': '이 인증은 만료되었거나 올바르지 않습니다.',
		'invalid_vote_type': '투표 방식이 올바르지 않습니다.',
		'insufficient_privileges': '접근 권한이 없습니다.',
		'insufficient_privileges_edit': '편집 권한이 없습니다.',
		'insufficient_privileges_read': '읽을 권한이 없습니다.',
		'invalid_value': '전송한 값 중 하나가 정해진 형식을 위반했습니다.',
		'invalid_request_body': '필요한 값 중 일부가 빠져서 처리가 불가능합니다.',
		'thread_not_found': '토론을 찾을 수 없습니다.'
	};
	
	if(typeof(codes[code]) == 'undefined') return `알 수 없는 오류 ${code}이 발생하였습니다.`;
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

async function showError(req, code) {
	return await render(req, "문제가 발생했습니다!", `<h2>${fetchErrorString(code)}</h2>`);
}

function ip_pas(ip = '', ismember = '', isadmin = null) {
	if(isadmin) {
		if(ismember == 'author') {
			if(isadmin == '1') {
				return `<strong><a href="/w/사용자:${encodeURIComponent(ip)}">${html.escape(ip)}</a></strong>`;
			}
			return `<a href="/w/사용자:${encodeURIComponent(ip)}">${html.escape(ip)}</a>`;
		} else {
			if(isadmin == '1') {
				if(config.getString('ip2md5', '0') == '1') return '<strong>' + md5(ip).slice(0, 6) + '</strong>';
				return `<strong><a href="/contribution/ip/${encodeURIComponent(ip)}/document">${html.escape(ip)}</a></strong>`;
			}
			if(config.getString('ip2md5', '0') == '1') return md5(ip).slice(0, 6);
			return `<a href="/contribution/ip/${encodeURIComponent(ip)}/document">${html.escape(ip)}</a>`;
		}
	} else {
		if(ismember == 'author') {
			return `<strong><a href="/w/사용자:${encodeURIComponent(ip)}">${html.escape(ip)}</a></strong>`;
		} else {
			if(config.getString('ip2md5', '0') == '1') return md5(ip).slice(0, 6);
			return `<a href="/contribution/ip/${encodeURIComponent(ip)}/document">${html.escape(ip)}</a>`;
		}
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

function getSkins() {
	var retval = [];
	
	// 밑의 fileExplorer 함수에 출처 적음.
	for(dir of fs.readdirSync('./skins', { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)) {
		retval.push(dir);
	}
	
	return retval;
}

function getPlugins() {
	var retval = [];
	
	// 밑의 fileExplorer 함수에 출처 적음.
	for(dir of fs.readdirSync('./plugins', { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)) {
		retval.push(dir);
	}
	
	return retval;
}

function mmmmmmmmmmmmmmn() { return 0; }

for(pi of getPlugins()) {
	const picfg = require('./plugins/' + pi + '/config.json');
	const picod = require('./plugins/' + pi + '/index.js');
	
	for(url of picod['urls']) {
		if(picfg['enabled'] != true) continue;
		
		if(picod['codes'][url]['method'].toLowerCase() == 'post') {
			wiki.post(url, picod['codes'][url]['code']);
		} else {
			wiki.get (url, picod['codes'][url]['code']);
		}
	}
}

async function fileExplorer(path, req, res) {
	// const path = ('./skins' + req.params[0]).replace(/\/$/, '');
	
	// https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
	const getDirectories = path => fs.readdirSync(path, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
	const getFiles       = path => fs.readdirSync(path, { withFileTypes: true }).filter(dirent => !dirent.isDirectory()).map(dirent => dirent.name);
	
	const dirlist  = getDirectories(path);
	const filelist = getFiles(path);
	
	var content = `
		<table class="table table-hover">
			<thead>
				<tr>
					<td><strong>이름</strong></td>
					<td><strong>형식</strong></td>
					<td><strong>크기</strong></td>
				</tr>
			</thead>
			
			<tbody id>
				<tr>
					<td><a href="${path.endsWith('/') ? '..' : '.'}">..</a></td>
					<td>디렉토리</td>
					<td>0</td>
				</tr>
	`;
	
	for(var d of dirlist) {
		content += `
			<tr>
				<td>
					<a href="/${html.escape((path.endsWith('/') ? path : path + '/') + d)}">${html.escape(d)}</a>
				</td>
				
				<td>디렉토리</td>
				
				<td>
					${fs.statSync(path + '/' + d)['size']}
				</td>
			</tr>
		`;
	}
	
	for(var f of filelist) {
		var acode;
		console.log(path)
		if(fs.existsSync((path.endsWith('/') ? path : path + '/') + f)) {
			acode = `<a href="/${html.escape((path.endsWith('/') ? path : path + '/') + f)}">${html.escape(f)}</a>`;
		} else {
			acode = `${html.escape(f)}`;
		}
		
		content += `
			<tr>
				<td>
					${acode}
				</td>
				
				<td>파일</td>
				
				<td>
					${fs.statSync(path + '/' + f)['size']}
				</td>
			</tr>
		`;
	}
	
	content += `
			</tbody>
		</table>
	`;
	
	res.send(await render(req, '탐색 중 - ' + path.replace(/^[.]\//, ''), content));
}

wiki.get(/^\/skins\/((?:(?!\/).)+)\/(.+)/, async function dropSkinFile(req, res) {
	const skinname = req.params[0];
	const filepath = req.params[1];
	
	const afn = split(filepath, '/');
	const fn = afn[afn.length - 1];
	
	var rootp = './skins/' + skinname + '/static';
	var cnt = 0;
	for(dir of afn) {
		rootp += '/' + dir;
	}
	
	try {
		if(fs.lstatSync(rootp).isDirectory()) {
			await fileExplorer(rootp, req, res);
			return;
		}
	} catch(e) {
		res.send(await showError(req, 'file_not_found'));
		return;
	}
	
	
	res.sendFile(fn, { root: rootp.replace('/' + fn, '') });
});

function dropSourceCode(req, res) {
	// res.sendFile('index.js', { root: "./" });
}

wiki.get('/index.js', dropSourceCode);

wiki.get('/js/:filepath', function dropJS(req, res) {
	const filepath = req.params['filepath'];
	res.sendFile(filepath, { root: "./js" });
});

wiki.get('/css/:filepath', function dropCSS(req, res) {
	const filepath = req.params['filepath'];
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
		
		if(useragent.includes('Mypal') || useragent.includes('Centaury')) {
			return false;
		}
		
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
	if(ip_check(req) in botlist) return '';
	if(permlist[ip_check(req)] && (permlist[ip_check(req)].includes('bot') || permlist[ip_check(req)].includes('no_captcha'))) return '';
	if(config.getString('enable_captcha', '1') == '0') return '';
	
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

function validateCaptcha(req) {
	if(ip_check(req) in botlist) return true;
	if(permlist[ip_check(req)].includes('bot') || permlist[ip_check(req)].includes('no_captcha')) return true;
	if(config.getString('enable_captcha', '1') == '0') return true;
	
	try {
		if(req.body['captcha'].replace(/\s/g, '') != req.session.captcha) {
			return false;
		}
	} catch(e) {
		return false;
	}
}

wiki.get('/recent_changes', function redirectA(req, res) {
	res.redirect('/RecentChanges');
});

wiki.get('/recent_discuss', function redirectB(req, res) {
	res.redirect('/RecentChanges');
});

async function redirectD(req, res) {
	res.send(await render(req, '특수 기능', '<p>최상단의 [특수 기능] 혹은 [도구] 메뉴를 통해 기능을 볼 수 있습니다.</p>'));
}

wiki.get('/other', redirectD);
wiki.get('/Special', redirectD);

async function redirectE(req, res) {
	res.send(await render(req, '사용자 도구', '<p>최상단의 아바타 혹은 이름을 누르면 사용자 도구를 볼 수 있습니다.</p>'));
}

wiki.get('/member', redirectE);
wiki.get('/user', redirectE);

wiki.get('/please', function redirectF(req, res) {
	res.redirect('/NeededPages');
});

wiki.get('/old_page', function redirectG(req, res) {
	res.redirect('/OldPages');
});

wiki.get('/admin/ipacl', function redirectH(req, res) {
	res.redirect('/admin/ban_users?usertype=ip');
});

wiki.get('/admin/suspend_account', function redirectI(req, res) {
	res.redirect('/admin/ban_users?usertype=author');
});

wiki.get(/^\/record\/(.*)$/, async function redirectJ(req, res) {
	const username = req.params[0];
	
	res.status(300).send(`
		<script>
			if(confirm('계정이면 <예>, IP이면 <아니오>')) {
				location.href = "/contribution/author/${encodeURIComponent(username)}/document";
			} else {
				location.href = "/contribution/ip/${encodeURIComponent(username)}/document";
			}
		</script>
	`);
});

function redirectToFrontPage(req, res) {
	res.redirect('/w/' + config.getString('frontpage', 'FrontPage'));
}

wiki.get('/w', redirectToFrontPage);
wiki.get('/', redirectToFrontPage);

wiki.get('/ExecuteSQL', async function executeSQLPage(req, res) {
	if(config.getString('wiki.sql_execution_enabled', false)) {
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
				<input type=password name=pin class=form-control>
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

wiki.get(/\/skins(.*)/, async function skinRootExplorer(req, res) {
	const path = ('./skins' + req.params[0]).replace(/\/$/, '');
	await fileExplorer(path, req, res);
});

function mmmmmmmmmmmmmm() { return 0; }

wiki.get(/^\/w\/(.*)/, async function viewDocument(req, res) {
	const title = req.params[0];
	
	if(title.replace(/\s/g, '') == '') res.redirect('/w/' + config.getString('frontpage'));
	
	await curs.execute("select content from documents where title = ?", [title]);
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
	
	if(title.startsWith('사용자:')) isUserDoc = true;
	
	res.status(httpstat).send(await render(req, title, content, {
		star_count: 0,
		starred: false,
		date: lstedt,
		user: isUserDoc
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
	if(config.getString('disable_recentchanges', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
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
	if(config.getString('disable_contribution_list', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const ismember = req.params[0];
	const username = req.params[1];
	
	if(ismember == 'ip' && config.getString('ip2md5', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
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
	if(config.getString('disable_recentdiscuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
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
	if(config.getString('disable_contribution_list', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const ismember = req.params[0];
	const username = req.params[1];
	
	if(ismember == 'ip' && config.getString('ip2md5', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
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
	if(config.getString('disable_history', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
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
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const title = req.params[0];
	
	var state = req.query['state'];
	if(!state) state = '';
	
	if(!await getacl(req, title, 'read')) {
		res.send(await showError(req, 'insufficient_privileges_read'));
		
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
			await curs.execute("select topic, tnum from threads where title = ? and status = 'close' order by cast(time as integer) desc", [title]);
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
				
			await curs.execute("select topic, tnum from threads where title = ? and not status = 'close' order by cast(time as integer) desc", [title]);
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
				
				content += '</div>';
			}
			content += '<a href="?state=close">[닫힌 토론 목록 보기]</a>';
			
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
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
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
		await curs.execute("select id, content, username, time, hidden, hider, status, ismember, stype from res where tnum = ? order by cast(id as integer) asc", [tnum]);
	} else {
		await curs.execute("select id, content, username, time, hidden, hider, status, ismember, stype from res where tnum = ? and (cast(id as integer) = 1 or (cast(id as integer) >= ? and cast(id as integer) < ?)) order by cast(id as integer) asc", [tnum, Number(tid), Number(tid) + 30]);
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
						</span> ${ip_pas(rs['username'], rs['ismember'], rs['isadmin'])} ${hbtn} <span style="float: right;">${generateTime(toDate(rs['time']), timeFormat)}</span>
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
								? (
									rs['stype'] == 'status'
									? '토론을 <strong>' + html.escape(rs['content']) + '</strong> 상태로 표시'
									: (
										rs['stype'] == 'document'
										? '토론을 <strong>' + html.escape(rs['content']) + '</strong> 문서로 이동'
										: '토론 주제를 <strong>' + html.escape(rs['content']) + '</strong>(으)로 변경'
									)
								)
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
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const tnum = req.params["tnum"];
	
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
		    <form method="post" id="thread-status-form">
        		토론 상태: 
        		<select name="status">${sts}</select>
        		<button id="changeBtn" class="d_btn type_blue">변경</button>
        	</form>
		`;
	}
	
	if(getperm('update_thread_document', ip_check(req))) {
		content += `
        	<form method="post" id="thread-document-form">
        		토론 문서: 
        		<input type="text" name="document" value="${title}">
        		<button id="changeBtn" class="d_btn type_blue">변경</button>
        	</form>
		`;
	}
	
	if(getperm('update_thread_topic', ip_check(req))) {
		content += `
        	<form method="post" id="thread-topic-form">
        		토론 주제: 
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
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const tnum = req.params["tnum"];
	const tid = req.params["id"];
	
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
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const tnum = req.params["tnum"];
	const tid = req.params["id"];
	
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
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const tnum = req.params["tnum"];
	const tid = req.params["id"];
	
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
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const tnum = req.params["tnum"];
	
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
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin, stype) \
					values (?, ?, ?, ?, '0', '', '1', ?, ?, ?, 'status')", [
						String(rescount + 1), newstatus, ip_check(req), getTime(), tnum, islogin(req) ? 'author' : 'ip', getperm('admin', ip_check(req)) ? '1' : '0' 
					]);
	
	res.json({});
});

wiki.post('/admin/thread/:tnum/document', async function updateThreadDocument(req, res) {
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const tnum = req.params["tnum"];
	
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
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin, stype) \
					values (?, ?, ?, ?, '0', '', '1', ?, ?, ?, 'document')", [
						String(rescount + 1), newdoc, ip_check(req), getTime(), tnum, islogin(req) ? 'author' : 'ip', getperm('admin', ip_check(req)) ? '1' : '0' 
					]);
	
	res.json({});
});

wiki.post('/admin/thread/:tnum/topic', async function updateThreadTopic(req, res) {
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const tnum = req.params["tnum"];
	
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
	curs.execute("insert into res (id, content, username, time, hidden, hider, status, tnum, ismember, isadmin, stype) \
					values (?, ?, ?, ?, '0', '', '1', ?, ?, ?, 'topic')", [
						String(rescount + 1), newtopic, ip_check(req), getTime(), tnum, islogin(req) ? 'author' : 'ip', getperm('admin', ip_check(req)) ? '1' : '0' 
					]);
	
	res.json({});
});

wiki.get('/admin/thread/:tnum/delete', async function deleteThread(req, res) {
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const tnum = req.params["tnum"];
	
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
	if(config.getString('disable_discuss', '0') == '1') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	var tnum = req.params["tnum"];
	
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
	
	if(!validateCaptcha){ res.send(await showError(req, 'invalid_captcha_number'));return; }
	
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
	
	if(config.getString('no_login_history', '0') == '0')
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
	if(config.getString('no_login_history', '0') == '0')
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
	
	await curs.execute("select username from users");
	const maxusercount = atoi(config.getString('max_users', '-1'));
	
	if(maxusercount != -1 && curs.fetchall().length >= maxusercount) {
		res.send(await showError(req, 'user_count_reached_maximum'));
		return;
	}
	
	res.send(await render(req, '계정 만들기', `
		<form method=post class=signup-form>
			<div class=form-group>
				<textarea class=form-control readonly rows=15>${config.getString('privacy', '')}</textarea>
			</div>
		
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
	await curs.execute("select username from users");
	const maxusercount = atoi(config.getString('max_users', '-1'));
	
	if(maxusercount != -1 && curs.fetchall().length >= maxusercount) {
		res.send(await showError(req, 'user_count_reached_maximum'));
		return;
	}
	
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	if(islogin(req)) { res.redirect(desturl); return; }
	
	if(!validateCaptcha){ res.send(await showError(req, 'invalid_captcha_number'));return; }
	
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
	
	try {
		await curs.execute("select email_service, email_addr, email_pass from email_config");
		
		const edata = curs.fetchall()[0];
		
		nodemailer.createTransport({
			service: edata['email_service'],
			auth: {
				user: edata['email_addr'],
				pass: edata['email_pass']
			}
		}).sendMail({
			from: edata['email_addr'],
			to: req.body['email'],
			subject: config.getString('site_name', '위키') + ' 가입 인증',
			html: config.getString('registeration_verification', key).replace(/[$]WIKINAME/gi, config.getString('site_name', '위키')).replace(/[$]ADDRESS/gi, key)
		}, (e, s) => {
			if(e) {
				print(`[오류!] ${e}`);
				beep(3);
			}
		});
	} catch(e) {}
	
	res.send(await render(req, '계정 만들기', `
		<p>
			입력한 주소로 인증 우편을 전송했습니다. 우편에 적혀있는 키를 다음 상자에 입력하십시오<label class=noscript-alert>(자바스크립트 활성화 필요)</label>. 우편이 안보일 경우 스팸함을 확인하십시오.
		</p>
		
		<form>
			<input type=text id=keyInput class=form-control>
			
			<div class=btns>
				<button type=button class="btn btn-info" style="width: 100px;" onclick="location.href = '/member/signup/' + $('#keyInput').val();">확인</button>
			</div>
		</form>
		
		<p style="font-weight: bold; color: red;">
			[디버그] 가입 열쇳말: ${key}
		</p>
	`, {}));
});

wiki.get('/member/signup/:key', async function signupScreen(req, res) {
	await curs.execute("delete from account_creation where cast(time as integer) < ?", [Number(getTime()) - 86400000]);
	
	await curs.execute("select username from users");
	const maxusercount = atoi(config.getString('max_users', '-1'));
	
	if(maxusercount != -1 && curs.fetchall().length >= maxusercount) {
		res.send(await showError(req, 'user_count_reached_maximum'));
		return;
	}
	
	const key = req.params['key'];
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
	
	await curs.execute("select username from users");
	const maxusercount = atoi(config.getString('max_users', '-1'));
	
	if(maxusercount != -1 && curs.fetchall().length >= maxusercount) {
		res.send(await showError(req, 'user_count_reached_maximum'));
		return;
	}
	
	const key = req.params['key'];
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
	
	if(!validateCaptcha){ res.send(await showError(req, 'invalid_captcha_number'));return; }
	
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
	
	if(config.getString('no_login_history', '0') == '0') {
		curs.execute("insert into login_history (username, ip) values (?, ?)", [id, ip_check(req, 1)]);
		curs.execute("insert into useragents (username, string) values (?, ?)", [id, req.headers['user-agent'] ? req.headers['user-agent'] : '']);
	}
	
	res.redirect(desturl);
});

wiki.get('/Upload', async function fileUploadPage(req, res) {
	if(config.getString('allow_upload', '1') == '0') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
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
	if(config.getString('allow_upload', '1') == '0') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
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
		res.send(await showError(req, 'insufficient_privileges'));
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
	const num = req.params['num'];
	
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

/*
wiki.get('/httpstatus', function(req, res) {
	res.status(req.query['code'] ? req.query['code'] : '200').send(`
		<form method=get>
			<label>HTTP 코드: </label> <input type=text name=code>
			<button type=submit>이동</button>
		</form>
	`);
});
*/

wiki.get('/admin/ban_users', async function blockControlPanel(req, res) {
	const from = req.query['from'];
	
	if(!getperm('ban_users', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		return;
	}
	
	var content = `
		<form method=post class=settings-section>
			<div class=form-group>
				<label>이름 혹은 CIDR:</label><br>
				<input value="${req.query['username'] ? html.escape(req.query['username']) : ''}" type=text name=username id=usernameInput class=form-control>
			</div>
			
			<div class=form-group>
				<label>사용자 종류:</label><br>
				<select name=usertype class=form-control>
					<option ${req.query['usertype'] == 'ip' ? 'selected' : ''} value=ip>IP 주소</option>
					<option ${req.query['usertype'] == 'author' ? 'selected' : ''} value=author>계정</option>
				</select>
			</div>
			
			<div class=form-group>
				<label>접속 완전 차단<sup><a title="계정은 로그아웃, IP는 데이타 네트워크 등으로 쉽게 우회할 수 있습니다.">[!]</a></sup>:</label><br>
				<div class=checkbox>
					<input ${req.query['blockview'] == '1' ? 'checked' : ''} type=checkbox name=blockview>
				</div>
			</div>
			
			<div class=form-group>
				<label>로그인 시 차단하지 않음<sup><a title="IP 주소를 차단할 때에만 유효한 설정입니다. 로그인하면 편집할 수 있습니다.">[?]</a></sup>:</label><br>
				<div class=checkbox>
					<input ${req.query['al'] == '1' ? 'checked' : ''} type=checkbox name=al>
				</div>
			</div>
			
			<div class=form-group>
				<label>차단 만료일:</label><br>
				
				<label><input type=radio name=permanant value=true onclick="$('input[group=expiration]').attr('disabled', '');"> 무기한</label><br>
				<label>
					<input type=radio name=permanant value=false onclick="$('input[group=expiration]').removeAttr('disabled');" checked> 만료일 지정
					
					<div style="margin-left: 40px;">
						<!-- placeholder: 구버전 브라우저 배려 -->
						<input group=expiration value="${req.query['expirationdate'] ? html.escape(req.query['expirationdate']) : ''}" type=date name=expiration-date placeholder="YYYY-MM-DD" class=form-control style="display: inline-block; width: auto;">
						<input group=expiration value="${req.query['expirationtime'] ? html.escape(req.query['expirationtime']) : ''}" type=time name=expiration-time placeholder="HH:MM" class=form-control style="display: inline-block; width: auto;"><br>
						<label><input group=expiration type=checkbox name=fakepermanant> 무기한으로 표시<sup><a title="실제로는 기한을 지정하지만 무기한으로 표시합니다. VPN IP 차단을 목적으로 하는 반달을 차단할 때 사용하면 좋습니다.">[?]</a></sup></label>
					</div>
				</label>
			</div>
			
			<div class=btns>
				<button type=submit class="btn btn-info" style="width: 120px;">확인</button>
			</div>
		</form>
		
		<table class="table table-hover">
			<colgroup>
				<col>
				<col style="width: 140px;">
				<col style="width: 140px;">
				<col style="width: 140px;">
				<col style="width: 60px;">
				<col style="width: 60px;">
				<col style="width: 60px;">
				<col style="width: 50px;">
			</colgroup>
			
			<thead>
				<tr>
					<td><strong>이름</strong></td>
					<td><strong>차단자</strong></td>
					<td><strong>차단일</strong></td>
					<td><strong>만료일</strong></td>
					<td><strong>유형</strong></td>
					<td><strong>접속차단</strong></td>
					<td><strong>AL</strong></td>
					<td><strong>해제</strong></td>
				</tr>
			</thead>
			
			<tbody id>
	`;
	
	// 'blockhistory': ['ismember', 'type', 'blocker', 'username', 'durationstring', 'startingdate', 'endingdate', 'al']
	// 'banned_users': ['username', 'blocker', 'startingdate', 'endingdate', 'ismember', 'al', 'blockview']
	
	if(from) {
		await curs.execute("select username, blocker, startingdate, endingdate, ismember, al, blockview from banned_users \
								where username >= ? order by username limit 100", [from]);

	} else {
		await curs.execute("select username, blocker, startingdate, endingdate, ismember, al, blockview from banned_users \
								order by username asc limit 100");
	}
	
	for(var row of curs.fetchall()) {
		content += `
			<tr>
				<td>${html.escape(row['username'])}</td>
				<td>${html.escape(row['blocker'])}</td>
				<td>${generateTime(row['startingdate'])}</td>
				<td>${row['endingdate']}</td>
				<td>${row['ismember'] == 'ip' ? 'IP' : '계정'}</td>
				<td>${row['blockview'] == '1' ? '예' : '아니오'}</td>
				<td>${row['al'] == '1' ? '예' : '아니오'}</td>
				<td>
					<form method=post action="/admin/unban_users" onsubmit="사용자를 차단해제하시겠습니까?">
						<input type=hidden name=username value="${html.escape(row['username'])}">
						<input type=hidden name=usertype value="${html.escape(row['ismember'])}">
						
						<button type=submit class="btn btn-danger btn-sm">해제</button>
					</form>
				</td>
			</tr>
		`;
	}
	
	content += `
			</tbody>
		</table>
		
		${navbtn(0, 0, 0, 0)}
	`;
	
	res.send(await render(req, '사용자 차단', content, _, _, _, 'ban_users'));
});

wiki.post('/admin/ban_users', async function banUser(req, res) {
	const username         = req.body['username'];
	const usertype         = req.body['usertype'];
	const blockview        = req.body['blockview'];
	const al               = req.body['al'];
	const expirationDate   = req.body['expiration-date'];
	const expirationTime   = req.body['expiration-time'];
	const expirationString = `${expirationDate} ${expirationTime}:00`;
	
	if(!getperm('ban_users', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		return;
	}
	
	if(!username || !usertype || !expirationDate || !expirationTime) {
		res.send(await showError(req, 'invalid_request_body'));
		return;
	}
	
	if(!['author', 'ip'].includes(usertype) || !stringInFormat(/^\d{1,}[-]\d{2,2}[-]\d{2,2}$/, expirationDate) || !stringInFormat(/^\d{2,2}[:]\d{2,2}$/, expirationTime)) {
		res.send(await showError(req, 'invalid_value'));
		return;
	}
	
	if(isNaN(Date.parse(expirationString))) {
		res.send(await showError(req, 'invalid_value'));
		return;
	}
	
	const expiration = new Date(expirationString).getTime();
	const startTime  = new Date().getTime();
	
	// 'blockhistory': ['ismember', 'type', 'blocker', 'username', 'durationstring', 'startingdate', 'endingdate', 'al']
	// 'banned_users': ['username', 'blocker', 'startingdate', 'endingdate', 'ismember', 'al', 'blockview']
	
	curs.execute("insert into banned_users (username, blocker, startingdate, endingdate, ismember, al, blockview) \
					values (?, ?, ?, ?, ?, ?, ?)", [
						username, ip_check(req), startTime, expiration, usertype, al, blockview
					]);
	
	curs.execute("insert into blockhistory (ismember, type, blocker, username, durationstring, startingdate, endingdate, al) \
					values (?, ?, ?, ?, ?, ?, ?, ?)", [
						usertype, usertype == 'ip' ? 'ipacl' : 'ban_account', ip_check(req), username, '', startTime, expiration, al, blockview
					]);
	
	res.redirect('/admin/ban_users');
});

// 나무픽스 호환용
wiki.post('/admin/ipacl', async function postIPACL(req, res) {
	// 나중에 작성 예정
});

// 나무픽스 호환용
wiki.post('/admin/suspend_account', async function suspendAccount(req, res) {
	// 나중에 작성 예정
});

wiki.get('/admin/config', async function wikiControlPanel(req, res) {
	if(!getperm('developer', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		return;
	}
	
	const defskin = config.getString('default_skin', 'buma');
	const deflskin = config.getString('default_legacy_skin', 'buma');
	
	var dsop = '';
	
	for(skin of getSkins()) {
		dsop += `<option value="${skin}" ${skin == defskin ? 'selected' : ''}>${skin}</option>`;
	}
	
	var dslop = '';
	
	for(skin of getSkins()) {
		dslop += `<option value="${skin}" ${skin == deflskin ? 'selected' : ''}>${skin}</option>`;
	}
	
	var piop = '';
	
	for(pi of getPlugins()) {
		const picfg = require('./plugins/' + pi + '/config.json');
		var style = '';
		
		if(picfg['enabled'] != true) style = ' style="color: gray; text-decoration: line-through;"';
		piop += `<option${style} value="${pi}">${picfg['displayname']} (${picfg['description'] ? picfg['description'] : '설명 없음'})</option>`;
	}
	
	var content = `
		<form method=post>
			<table class=vertical-tablist>
				<colgroup>
					<col style="width: 120px;">
					<col>
				</colgroup>
				
				<tbody>
					<tr>
						<td class=titlebar colspan=2>
							위키 설정
						</td>
					</tr>
				
					<tr>
						<td class=tablist style="display: none;">
							<div class=tab data-paneid=general>일반</div>
							<div class=tab data-paneid=notices>공지와 알림</div>
							<div class=tab data-paneid=skins>스킨</div>
							<div class=tab data-paneid=features>특수 기능</div>
							<div class=tab data-paneid=tos>지침</div>
							<div class=tab data-paneid=email>우편 인증</div>
							<div class=tab data-paneid=filters>필터</div>
							<div class=tab data-paneid=api>봇과 API</div>
							<div class=tab data-paneid=plugins>플러그 인</div>
							<div class=tab data-paneid=misc>고급</div>
							<div class=tab data-paneid=applying>
								<button type=submit style="background: transparent; border: none; font-size: initial; color: inherit; padding: 7px; margin: -7px; width: 100%; text-align: inherit;">저장</button>
							</div>
						</td>
						
						<td class=tab-content>
							<div class=tab-page id=general>
								<h2 class=tab-page-title>위키 구성</h2>
							
								<div class=form-group>
									<label>위키 이름: </label><br>
									<input type=text class=form-control name=site_name value="${config.getString('site_name', random.choice(['바나나', '사과', '포도', '오렌지', '배', '망고', '참외', '수박', '둘리', '도우너']))}">
								</div>
							
								<div class=form-group>
									<label>최대 사용자 수: <sub>(-1: 무제한; 현재 사용자 수 이하로 설정하면 더 이상 사용자가 가입할 수 없음)</sub></label><br>
									<input type=number class=form-control name=max_users value="${config.getString('max_users', '-1')}" min=-1>
								</div>
							
								<div class=form-group>
									<label>대문 문서: </label><br>
									<input type=text class=form-control name=frontpage value="${config.getString('frontpage', '대문')}">
								</div>
							
								<div class=form-group>
									<label>편집 안내문: </label><br>
									<textarea class=form-control name=edit_warning>${config.getString('edit_warning', '')}</textarea>
								</div>
							
								<div class=form-group>
									<label>화면 하단 안내문: </label><br>
									<textarea class=form-control name=footer_text>${config.getString('footer_text', '')}</textarea>
								</div>
							</div>
							
							<div class=tab-page id=api>
								<h2 class=tab-page-title>API</h2>
								
								<div class=form-group>
									<label><input type=checkbox name=enable_apiv1 ${config.getString('enable_apiv1', '1') == '1' ? 'checked' : ''}> API 버전1 사용</label><br>
									<label><input type=checkbox name=enable_apiv2 ${config.getString('enable_apiv2', '1') == '1' ? 'checked' : ''}> API 버전2 사용</label><br>
									
									<!-- v3은 계정 전용 특수 API로 비활성화하면 일부 기능 사용 못함, v5(미구현)은 호환용 특수 API -->
									<label><input type=checkbox name=enable_apiv3 checked disabled> API 버전3 사용</label><br>
								</div>
								
								<div class=form-group>
									<label><input type=checkbox name=enable_apipost ${config.getString('enable_apipost', '1') == '1' ? 'checked' : ''}> API POST를 이용하여 봇으로 문서를 편집할 수 있도록 허용</label><br>
								</div>
							</div>
							
							<div class=tab-page id=skins>
								<h2 class=tab-page-title>스킨</h2>
								
								<div class=form-group>
									<label>기본 스킨: </label><br>
									<select class=form-control name=default_skin>
										${dsop}
									</select>
								</div>
								
								<div class=form-group>
									<label>호환용 기본 스킨: </label><br>
									<select class=form-control name=default_skin_legacy>
										${dslop}
									</select>
								</div>
								
								<div class=form-group>
									<label><input type=checkbox name=default_skin_only ${config.getString('default_skin_only', '0') == '1' ? 'checked' : ''}> 기본 스킨을 제외한 스킨을 사용할 수 없음 (소유자는 사용 가능)</label><br>
								</div>
								
								<div class=form-group>
									<label><input type=checkbox name=enable_theseed_skins checked disabled> the seed용으로 만들어진 스킨 지원<sup><a title="swig 기반 스킨만 지원하며 현재 사용 중인 Nuxt.js 기반 스킨은 지원하지 않습니다.">[!]</a></sup></label><br>
									<label><input type=checkbox name=enable_opennamu_skins ${config.getString('enable_opennamu_skins', '1') == '1' ? 'checked' : ''}> openNAMU용으로 만들어진 스킨 지원</label><br>
									<label><input type=checkbox name=enable_custom_skins ${config.getString('enable_custom_skins', '0') == '1' ? 'checked' : ''}> 사용자가 직접 레이아웃을 만들어 스킨으로 사용할 수 있도록 허용</label><br>
								</div>
							</div>
							
							<div class=tab-page id=features>
								<h2 class=tab-page-title>특수 기능</h2>
								
								<div class=form-group>
									<label><input type=checkbox name=sql_execution_enabled ${config.getString('sql_execution_enabled', '0') == '1' ? 'checked' : ''}> 위키 내에서 SQL 코드를 실행할 수 있음(소유자 전용)</label><br>
									<label><input type=checkbox name=disable_random ${config.getString('disable_random', '0') == '1' ? 'checked' : ''}> 임의 문서 탐색 사용 안함</label><br>
									<label><input type=checkbox name=disable_search ${config.getString('disable_search', '0') == '1' ? 'checked' : ''}> 검색 사용 안함</label><br>
									<label><input type=checkbox name=disable_discuss ${config.getString('disable_discuss', '0') == '1' ? 'checked' : ''}> 토론 사용 안함</label><br>
									<label><input type=checkbox name=disable_history ${config.getString('disable_history', '0') == '1' ? 'checked' : ''}> 역사 기록 안함<sup><a style="font-weight: bold; color: red;" title="위키의 라이선스가 무저작권(CC-0 등)일 때에만 사용해야 합니다.">[!]</a></sup></label><br>
									<label><input type=checkbox name=disable_recentchanges ${config.getString('disable_recentchanges', '0') == '1' ? 'checked' : ''}> 최근 변경 열람 금지</label><br>
									<label><input type=checkbox name=disable_recentdiscuss ${config.getString('disable_recentdiscuss', '0') == '1' ? 'checked' : ''}> 최근 토론 열람 금지</label><br>
									<label><input type=checkbox name=disable_contribution_list ${config.getString('disable_contribution_list', '0') == '1' ? 'checked' : ''}> 기여 목록 열람 금지</label><br>
									<label><input type=checkbox name=enhanced_security ${config.getString('enhanced_security', '0') == '1' ? 'checked' : ''}> 보안 강화 구성 사용<sup><a title="로그인 시 복사-붙이기, 브라우저 저장 비밀번호 방식으로 로그인할 수 없으며, 마우스로만 로그인할 수 있습니다. ActiveX를 사용하므로 Internet Explorer에서만 로그인할 수 있습니다.">[?]</a></sup></label><br>
								</div>
								
								<div class=form-group>
									<div class=form-group>
										<label><input type=checkbox name=allow_upload ${config.getString('allow_upload', '1') == '1' ? 'checked' : ''}> 파일을 올릴 수 있도록 허용</label><br>
									</div>
								</div>
								
								<div class=form-group>
									<label>ACL 방식 설정: <sub>(이 설정 변경은 모든 문서의 ACL을 초기화합니다.)</sub></label><br>
									<label><input type=radio name=acl_type value=user-based ${config.getString('acl_type', 'action-based') == 'user-based' ? 'checked' : ''}> 사용자 중심 - 사용자별로 문서에 대해 할 수 있는 작업을 지정합니다.</label><br>
									<label><input type=radio name=acl_type value=action-based ${config.getString('acl_type', 'action-based') == 'action-based' ? 'checked' : ''}> 작업 중심 - 문서에 대한 작업을 어떤 사용자가 할 수 있는지 지정합니다.</label><br>
									<label><input type=radio name=acl_type value=basic ${config.getString('acl_type', 'action-based') == 'basic' ? 'checked' : ''}> 간단 모드 - 처음 사용자가 쉽게 다룰 수 있으며, 미디어위키, 오픈나무, 클래식 the seed 등의 위키엔진에서 널리 사용됩니다.</label><br>
									<label><input type=radio name=acl_type value=the-seed disabled> the seed 스타일 - the seed 방식을 사용합니다. 이 방식은 제공될 수 없습니다.</label><br>
									<label><input type=radio name=acl_type value=none ${config.getString('acl_type', 'action-based') == 'none' ? 'checked' : ''}> 없음 - ACL을 지정할 수 없게 합니다. 모든 문서에 모든 사용자가 기여할 수 있습니다. 예외적으로 사용자 문서는 본인 및 관리자만이 편집할 수 있습니다. 차단된 사용자는 제외됩니다.</label>
								</div>
							</div>
							
							<div class=tab-page id=tos>
								<h2 class=tab-page-title>지침</h2>
							
								<label>개인정보처리방침:</label>
								<textarea name=privacy class=form-control rows=17>${config.getString('privacy', '')}</textarea>
							</div>
							
							<div class=tab-page id=email>
								<h2 class=tab-page-title>전자우편 인증</h2>
							
								<div class=form-group>
									<label>서비스:</label>
									<select name=email_service class=form-control>
										<option value=gmail ${config.getString('email_service', 'gmail') == 'gmail' ? 'selected' : ''}>Gmail</option>
									</select>
								</div>
								
								<div class=form-group>
									<label>내 전자우편 주소:</label>
									<input type=email name=email_addr class=form-control value="">
								</div>
								
								<div class=form-group>
									<label>내 전자우편 암호:</label>
									<input type=password name=email_pass class=form-control value="">
									<strong><font color=red>[경고!] 비밀번호는 데이타베이스에 저장됩니다. 비밀번호를 설정한 경우 데이타베이스를 타인에게 배포하지 않아야 합니다. 혹은 완전히 다른 비밀번호를 사용하는 구글 부계정을 사용하세요.</font></strong>
								</div>
								
								<div class=form-group>
									<label>가입 인증 우편 내용:</label>
									<textarea rows=15 name=registeration_verification class=form-control>${config.getString('registeration_verification', '안녕하십니까!\n$WIKINAME 가입 인증 메일입니다.\n\n저희 위키에 가입하시려면 다음 키를 사용하시면 됩니다^^\n<strong>$ADDRESS</strong>\n\n가입하시고, 즐거운 위키 편집 되시기 바랍니다~')}</textarea>
								</div>
								
								<div class=form-group>
									<label>비밀번호 찾기 인증 우편 내용:</label>
									<textarea rows=15 name=password_recovery class=form-control>${config.getString('password_recovery', '안녕하십니까!\n혹시 $WIKINAME에서 아이디나 비밀번호를 잊어버리셨나요?\n\n사용자 이름은 $USERNAME이며, 비밀번호를 재설정하려면 다음 링크를 누르시면 됩니다~\n<a href="$ADDRESS">[재설정]</a>\n\n계정을 복구하시고 즐거운 하루 되세요~^^')}</textarea>
								</div>
							</div>
							
							<div class=tab-page id=filters>
								<h2 class=tab-page-title>필터</h2>
								
								<div class=form-group>
									<label>허용할 파일 확장자: <sub>(쉼표로 구분; 공백은 무제한)</sub></label><br>
									<input type=text name=file_extensions class=form-control value="${config.getString('file_extensions', 'BMP,JPG,GIF,TIF,TIFF,PNG,JPEG,JPE')}">
								</div>
								
								<div class=form-group>
									<label>전자우편 허용 목록: <sub>(쉼표로 구분; 공백은 무제한)</sub></label><br>
									<input type=text name=email_whitelist class=form-control value="${config.getString('email_whitelist', '')}">
								</div>
							</div>
							
							<div class=tab-page id=notices>
								<h2 class=tab-page-title>공지와 알림</h2>
							
								<div class=form-group>
									<label>일반 공지: </label><br>
									<input type=text class=form-control value="${config.getString('site_notice', '')}" name=site_notice placeholder="공지 없음">
								</div>
							
								<div class=form-group>
									<label>편집 안내문: </label><br>
									<input type=text class=form-control value="${config.getString('edit_notice', '')}" name=edit_notice placeholder="공지 없음">
								</div>
							
								<div class=form-group>
									<label>토론 안내문: </label><br>
									<input type=text class=form-control value="${config.getString('discussion_notice', '')}" name=discussion_notice placeholder="공지 없음">
								</div>
							
								<div class=form-group>
									<label>가입 안내문: </label><br>
									<input type=text class=form-control value="${config.getString('registeration_notice', '')}" name=registeration_notice placeholder="공지 없음">
								</div>
							</div>
							
							<div class=tab-page id=plugins>
								<h2 class=tab-page-title>확장 기능</h2>
								
								<p class=noscript-alert>설정을 변경하려면 자바스크립트를 켜주세요 ^^;</p>
								
								<div class=form-group>
									<label>설치된 플러그인: </label><br>
									<select size=5 id=pluginList style="width: 100%;">
										${piop}
									</select>
									
									<span class=pull-right>
										<button type=button id=enablePluginBtn  class="btn btn-secondary btn-sm">활성화</button>
										<button type=button id=disablePluginBtn class="btn btn-secondary btn-sm">비활성화</button>
									</span>
								</div>
									
								<p><font color=red>엔진을 재시동해야 적용됩니다.</font></p>
							</div>
							
							<div class=tab-page id=misc>
								<h2 class=tab-page-title>기타</h2>
								
								<label><input type=checkbox name=allow_telnet ${config.getString('allow_telnet', '0') == '1' ? 'checked' : ''}> 사용자가 텔넷(포트 23)을 통하여 문서 및 게시판을 열람할 수 있도록 허용 (서버 재시동 필요)</label><br>
								<label><input type=checkbox name=enable_captcha ${config.getString('enable_captcha', '1') == '1' ? 'checked' : ''}> 보안문자 사용</label><br>
								<label><input type=checkbox name=ip2md5 ${config.getString('ip2md5', '0') == '1' ? 'checked' : ''}> IP 주소를 표시하지 않고 MD5로 암호화한 후 앞의 6자리 표시</label><br>
								<label><input type=checkbox name=denial ${config.getString('denial', '0') == '1' ? 'checked' : ''}> 서비스 거부 공격(빠른 반복 새로고침 등) 의심 시 1시간 동안 해당 IP에서 오는 요청을 처리해주지 않음</label><br>
								<label><input type=checkbox name=no_login_history ${config.getString('no_login_history', '0') == '1' ? 'checked' : ''}> 로그인 내역을 기록하지 않음</label><br>
								<label style="margin-left: 40px;"><input type=checkbox name=clear_login_history> 설정 저장 후 모든 사용자의 로그인 내역 삭제</label><br>
							</div>
							
							<div class=tab-page id=applying style="display: none;">
								<h2 class=tab-page-title>적용 중...</h2>
								
								<p>설정을 적용하는 중입니다...</p>
								<img src='data:image/gif;base64,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WIOKw4cQHxZZSLGixYsYM1bkQKGjRw4LAfQaSbKkyZMn4fhYuRLLm5cwY8Jkw7LmyiJkcurcybNnTyU2a9aQQbRoDZYAkipdyrSp06dQo0qdSrWqUnpYs2rdyrWr169gw4odS5ae1bNo06pdq3Se27dw48qdS7eu3bt48+qdx7av37+AAwserDae4cOIEytezLix48eQI0uOpxaeZXjs1Klr1+4y4c9pL4seTVodOnT18gHYp69ePXThSMueTbu27du4z7YrB06cO3z59vUbvi+fvXfgwnEGzTwq5+fQo7MLZwxZNt/28AHHZ8+eu3XZqEX/Yxe9vPnz6NOrXw+9KjtyzUztQsYsW7Z17vKLE5dtGjMAjYTDTlTfhGPggQgmqOCCDDaIYDcDssXOOdB0Iggoq6yyy3zT9DeNf/8l5Uw5EToVxwUopqjiiiy26OKLKsLQDmBfTIXMjQCccgs5UVmzzI9ABinkkEQWaWSQ0kjFzpJMNrlkUsU44oZSGS6FIzPMINNIMeEA4OSXYIYp5phklvkkVeREc0sjjIBiiikAzHcjMx9OQ00jqETDY3N8onVOONGg4kgnlGhIX4firCOOMY6gAk2XfUYKgGaUVmppOeSEUwwqg+TRyKfGhOqII54UE0045Viq6qqsturqq7BW/wrAObTWauut52QaDTTF3IKKJ56gcksx0JzKI67IJqvsssw2u+xa5GSaYLR7SmptOdhmq+223Hbr7bfghivuuOSWAwC16Kar7rrstuvuu/DGKy+61tYL2jj45qvvvvz26++/AAcs8MAEj2PvwYJ9o/DCDDfs8MMQRyzxxBRXbPE3CGfslzccd+zxxyCHLPLIJJds8skoewMANyy37PLLMMcs88w012zzzThzo9Y2PEuDoDTY8KxxczwXbfTRRWMTDTjypLZaPq6hA401SFdt9dVYZ6211gBg4/XXYIetdDOJArfP2WcbB0AzxYjt9ttwxy333HIDYM3deOeddzXRdP9iXaLuZKddd+uAp6M0eieu+OKMN+7443nb/Xg1xzQS56HX4acof/7t0kkuiDd+5Oikl44k41RJs4wqAFxoiobz0fkhliGeIskySUIF4+68964iIVFJI/zwxAv/DACoJGHjjch04okwABRf/CXUV2/99dhnr/3219ci/fBWqZKHG4JQaSV9WGqJCjBDC/bM+/DHD/8xuHgCByVtJrUh+h2G14gkuEiK/AZIwAIa8IAITOD7AGA6YNSvD3voxClid51EGaMRfZCEKthnug568INGOoswcqEKSdwhD3v41KfykIc7SOISuWBf+wRzjBra8IY4rCEwcuEKVaDiEY/wxCP/LqEKV8Qwh0hMohKXyMQmNrEvwPjFL2ohRRnO8DPCyKIWt8jFLnrxi2AMoxjHSMYyQu+KaIwKMNbIxja68Y1wjKMc50jHOtrxjlZMox6Xwos++vGPgAykIAdJyEIa8pCITCQvAFCLRjrykZCMpCQnSclKWvKSmMxkLQAgi0568pOgDKUoR0nKUprylKhMpSwAAItWuvKVsIylLGdJy1ra8pa4zCUs9sjLvrTil6wIZiqC+cte+uWXyEymMpPJilTcohnNcI1rmnELVQxzmdjMpja3yc1uchMtqXBFM4zxm7MNpx/FsYcxJJGKVBizOam4RCemAbjs5CMfg3MHfxph/013vrMq7QyoQAeailF0Qj502s863vGO73COGatoxChKQdCKWvSiGM2oRitalVKM4hIAcBPs6GOfOvknTpQghChK8ZQheOClMI2pTGdK05raNKYwkEopdsrTnvY0KeQDhVSY1wmQksKnPNWDUpfK1KY69alQjapTkfpTUlj1qli9KgAwAYAkTMl8SrkSM3axBz1gYhRZTata18rWtrr1raQAwCjmSte61nUThEgDFFynP+bJ7kN7SAPw5GrXwhr2sIhNrGIPKwpMTIKrZ7lEHMDQCUYYik4VFEcn1pAGs4rCmKIIbWMnQQhC6CEOcUhDGh4RQNG69rWi3app00AHyt92IlShgsMU0hAHQkwiKbANrnCHS9ziunYSp1WtGMSQlOU+gnVJ2YR0p0vd6k6XtEpVrXY7qwffWve74A2veMcLXj0AgAvoTa8YngsYxxrivfCdxG//mZS8LmULXIgDdJmSif76978ADrCAB0zgAhv4wAeOwxYWvAUx6Bcq8o2whCdM4Qpb+MIYzrCGNWwI5k5hC3EAaVQWQeISm/jEKE6xilfM4ha7uMV6+HAaRCwVRNj4xjjOsY53zOMe+/jHQPZxXldrlUAY+chITrKSl8zkJjv5yVB2sh4eQd8qOyUgACH5BAUGAAAALLwAGABrAEkAAAj/AGMJHEiwoEGDWUooVOiDisOHEB9KWUhRYYwiGDNq3MiRI42KFDlQGEmSw0IAB1OqHJiQooyIMB0WAblQRYybOHPq3LlTBU2FIkmONKkQ5cqjBVtSBCIl5kMlLn5KnUpValChREsAOMe1q9evYMFCc0a2rLNi0NKqXWu2rdu3cOPKdXarrl2zAOjp3cu3r9+/gAMLHky4sGF6AOYpXsy4sePHkCNLnky5suV5iS9r3sy5s2cAoEOLHk26tOnTqFOrXs06dLzXsGPLnk27tu3buHPr3h0PAO/fwIMLH94bnvHjyJMrX868ufPn0KNLhwdgOvJ24cKh244uWrh21sOL/x+/HEC78+jTqz9PDpw8e/n29Zu/D588cN/X69/Pv7////6ZB2A77DhjjDjr2INPfPvskw8+9qwjDjjqDGjhhRi2I6B+G/qnjjOrIDNNNuK44449KJoojjjT7ILKORnGKKOFq7GjTjSdgLLKLsiISKKE2WQzDQDI7NIJAOqwc5oqcTTp5JNQRinllFQ+qYeGp7Gj5ZZcagnaLWcIAoopq5QJwC4AMEMkMz0ic8otoHXJJZNV1mnnnU3qISeXAOzZJQDhFLOHG2KaAsCOPLbZI5ud3BJOn35GKumklFYqJ2vkQCMJJYUimigyzIQaqiXFkNPaqaimSpo6rLbqaquAFv9jiRyMjLkLj6GOuKIxpD766q/ABivssMQWC6ux6pATKCqO7NHJKdRQg+A7xhjjCCrFhEPOOch26+23wm4VVliARlMMKpY4YocdeTgyiCXYerftuPTWa++9+NILQDn89uvvv/0CGk400KAFjXeP7gvwwgw37PDDED+scMQAk2PxxRRnrPHGGwNw8ccghyzyyCSXbPLJKKf8MQDjtOzyyzDHLPPMNNds88045zwOyzr37PPPQAfNc9BEF230zwB8o/TSTDft9NNQRy311FRXbfU3SV+t9dZcd+01AN6ELfbYZJdt9tlop6322my37Q0A3cQt99x012333XjnrffefPf/3Q0A2wQu+OCEF2744YgnrvjijDe+DeCOCy5NNOBwhw440EiDTeScd+554QBgI/ropJcuejTNvAPffPTlI08zzlhj+uy012777bjfHnru2FRzi7QJLhhfPg9GSE0zmvOu/PLM2w6ANdBHL730y6Biyi7M/HhiikC22Mgy04cv/vjkl2/++dIDIM367LfP/jO55IgoqNOsGOQ0+BfZ6DPu94/n/wCEUimq0b/1qa+A7QNA9ZIgpjEdajSi6tEpJLEM/iFQGkfIoAY3yMEOevCDIOQgIS4IgGeY8IQoPKEwUFEGQo2pTLdSVAQ7gQphlDCFOMyhDnfIwx768Bk35OEy/wCgijt0olO3+pSomNEJR6hCGBX8oRSnSMUeBpGHAMhFEfdQq+vhCn8kEkcj+oCKXCiwimhMIxUVuIw2uvGNbTxGFlUhCTo4qxPREke1jNEIOkhCFWY8BhwHSchCGvKQiEykGwFwjEY68pGQPAYwtPgISdyBDpikwx0k8QhAAiOSoAylKEdJylKSEgDCSKUqV8nKVf4iF7lwhSxlWQtUtvKWuMylLnfJy17aspe3DA0wh0nMYhrThsdMpjKXyUwbAuOZ0IymNKdJzWpa85rYzKY2twkMAHDzm+AMpzjH2U1emPOc6EynOtfJzna6853wjKc8eQGAWtjznvjMpz73yf/PfvrznwANqEBrKYuCGvSgCE2oQhfK0IY69KEQjagsAACLilr0ohjNqEY3ytGOevSjIA0pLADwipKa9KQoTalKV8rSlrr0pTCN6SsA0Iqa2vSmOM2pTnfK05769KdADWoraCrUm7IiFaqwyy1UwYqiOvWpUNXpqVJBVVdIohnyiE/rXneLUrDiqKlQlVjHmhqqmvWsaKVqKR6RjBLBh0EOgpAeL5HWutr1rnjNq17xCoC9qrUPp2BG/daxPRS9wx3rENIpHlEKvzr2sZC9KwBKQdnKWvayAGAEmXikq3VISBxCItIqOoGJy15WD0NIrWpXy9rWuva1sF2tHkxr2cn/0ta0oniEC8kkmlCliU1FogRobluKIXzguMhNrnKXy9zmOje5MCBuKQBAiupa97rWHQUm9OCG3R4qhm1iE6MugYlRYPe86E2vetfL3vaSAgCjiK985ztfTBDCCbv1VHhF1QkxkBe+9A2wgAdM4AIb+MAAEIWCF8zgBhtCD1ughGbnl6sgUaO/eiBEghvM4Q57+MMgDnGHJ0GIS+hBD6rYsIhFsQlC6CENTujEs5ghLQTx0QliyPAmVszjHveYxC7WQxzSIIYip+ERodmEkpfM5CYrmcQv5sIUnOCENThhC1xIQ4Yn4eQue/nLYA5zl/VQZC6Y+cxi6KRoxNxlABAincgnPjEhDAEANtv5znjehCHSsAUAbOHPWxBDHFI8mkwY+tCITrSiMzGJRjsaE4uOtKQnTelKI5rMgA70oE1j6U57+tOg7vQkADCFP3Nh06dZhKpXzepWu/rVsI61rGdN61kTYgqlTgOhUVPrXvv618CutSHiMIU0XII1gUi2spfN7GY7+9nQjra0px1tQhj7VD7Otra3rW1V7Jo1AQEAIfkEBQcAAAAsvAAbAGsASwAACP8AYwkcSLCgQYNZSihceMIGEyoQI1KRUkTFwosYM2rcyDEjBwogQ3JYCOCgyZMDE2pUQcNHkZdBdLQ40bGmzZsLP4YEOVJhSZRAC6rESbSo0Zw7eZIMylTg0KNQo2rUubNniZ9NgT6VyjUqVZEk1YkdS7asWbPhoKldy7at27dw48qdSxcAvbt48+rdy7ev37+AAwseTA/AvMOIEytezLix48eQI0uePM8w5cuYM2veDCCe58+gQ4seTbq06dOoU6uO13m169ewY8tuLbu27duwAcDbzbu379/AgwsfTry48ePwdCPnrS4auufQo6lrt7y69eu/AbTbzr2793bsojX/e2cv375+6Pflk9csGvXv8OPLn0+//nzt9tudA0dN3Dp7+OQjoID42LMONc2ck9+CDDZIH371kXOLKbswk41/7thjzzvurANANtMgYwk54Dlo4on2AcDOiiy2yCIA0HQCyiq77IIMM9OI8yGI0zCDzC6dFKOOiy5ecsSRSCap5JJMNulkknqAR+SKKk7ZojoSJiGIIKCYsgqNNiIjpo9innILOUNa6YoebLbp5ptwxinnnG5eIuWUVVq5ojrhFLOHG1x6CaaYhN6ITCPFoKnnoow26uij7ABwllnkQINKJ4GCGeaNOE7TCSrQhDPpqKSWauqpk0pq6jl9WrIHJTPW/3jjNBeKQ00jlhQTzjmo9urrr6Oqaio5faLiSCOddELNssY024gjqOhaDq/AVmvtqQCco+223HZbDrHF3IKKJYM4Yq4lntyi6zfTduvuu/DGK++89HILQDn45qvvvvkSG040AAccTjjk8GvwwQgnrPDCDN/LsMHkRCzxwxRXbLHFAEis8cYcd+zxxyCHLPLIJGsMwDgop6zyyiy37PLLMMcs88w0j3NyzTjnrPPOPAPwzc9ABy300EQXbfTRSCet9NLf+Mz001BHLfXUTk9t9dVYRw2AN1x37fXXYIct9thkl2322Wh7AwA3bLft9ttwxy333HTXbffdeHMD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NLdYkke0nRjjrjGNOGLJLdGEU464+OaLLwDn9OvvvwD3eO6znlhiySCWoHJLMfWSU07AEEcs8cQUVzwxAOVkrPHGHGvsYzgghxzONz52bPLJKKes8sosY8zyyzDHLPPMKwNg5M0456zzzjzvDMA4QAct9NBEF2300UgnrfTSTI/zc9NQRy311FQD8M3VWGet9dZcd+3112CHLfbY31hN9tlop6322gB44/bbcMct99x012333Xjnrbc3be//7fffgAcuOADcFG744YgnrvjijDfu+OOQR84NANtUbvnlmGdeuTXYaO7556CHLvrooVNOuuXSOAMOeKyP54w0p8cu++ygA4DN7bjnrjs2y4Dz4n357dffO80ss/vxyCev/PLMLw+ANdBHL/30vRiD5YsTVojPhRlmYww004cv/vjkl2/++dM/f7400DSyIjLWQuhOhutoeWMjwVSD/v78948+ANIIoAAHKMBloIISfPJTi7LBq1B5qRO3eAYBJ+iBClrwghjMoAY3yMELfoAQExQgAEM4wGcAwxN5wtWnAtUlQHUCFceQIAmlcYka2vCGOMyhDnfIwxsSghUzBMAz/4ZIxCISMReo2AOnElglUImqEaoQxjKMSMUqWvGKWMyiFocoxCwuQxiqkMQbGMGnKumqRdOgRiMkgYtjTHGLcIyjHLMIgGXY8Y54vOMxchHGPHSCEtRaIITEYYw8SEIVv3BjHhfJyEY68pGQjKQdAXCMSlrykpj8hSsucQc67CFa74IXHSRxCVcAA5OoTKUqV8nKVroSk5R8ZSWFAQw+XsITksilJB5xCVXkAhjCkKUwh0lMVwJAGMhMpjKXqUxg/KIW0MwFNIHJzGpa85rYzKY2tymMY3Lzm+AMpzjHyUxvkvOc6EynOAEAjHa6853wjKc850nPetrznvjMJzAAwP+LfvrznwANqEAHStCCGvSgCE0oL/ip0IY69KEQjSgAoEnRilr0ohjNqEY3ytGOevSj0ASALEZK0pKa9KQoTalKV8rSlrr0pbIAACxmStOa2vSmOM2pTnfK05769KewAMArhkrUohr1qEhNqlKXytSmOvWprwBAK6ZK1apa9apYzapWt8rVrnr1q62QKlipygpX3KIZ3kFHM8ChilSM9a1wjetVY5GKutr1rnitaykkUR98BG8/+CBeW/NK2MIa9rCITexhAaBYu16iEdSAUPYqZCEMiYMakhBFYzfL2c4udrOi6MQq4JelCNkDQ+6gkY1OcQdSePa1sG0sAEpB29r/2ta2o3jEnj51vRoxcBpd+pIhSHFb2w7BBMhNrnKXy9zmOve5yh1CcW072+nelhSYuMMSmWglB7bwS4QQBXGnq4chmPe86E2vetfL3vaiVw/WpS0ASEHf+tq3vqPARBzOsERPNZGFodpFI/SAiVHc98AITrCCF8zgBpMCAKOIsIQnPGFMXGILZ8CVGQG8pUakgRAFprCIR0ziEpv4xCgWBQBEweIWu/jFk9BDGsqAwEAKUhydgEMaCPziHvv4x0AOspB7jAlCEEIPeohDGh6hihUPmcWbWESSxQCGMnQiGdR4VyOcIIY4EGISm3iymMcsZkwgWcliSLMYuNDlJiNp4BNwjrOc5wxnTBjiyGjmApvTEAc9EMIQdA60oAdN6EIHOsZ6TrSe24ykRhuazpnAxCTubORKL2ISmMjEozfN6U4TIg1bCHWouRCHSzT61JlItapXzepWu/rVsI61rGct60nEQdRb4EIaTH3qU0/i18AOtrCHTexiG/vYyE42sgkhhilMYQu77rW0F0Htalv72tjOtra3ze1ue5vbhtCDs5cs7XIj4tzoTre6183udrv73fCO97uZLYZHlPvegci3vvfN7377+98AD7jABx5wPdj73ghPuMIXzvCGO/zhDg8IACH5BAUGAAAALLwAKABrAE8AAAj/AGMJHEiwoEGDWUooXMiwocOHECNKnFiCA4WLGDksBHCwo8eBCSmKHEmSokWMFzUq5PixZcGQJWPKHHkSpcoSLF3qhDmzp0+GNTNu1EmU58+jMoOmHErUpVGkUEUqpXAzZ1OPT6NqhTi16tWWWbeKXdiV6deOYceKLbsynNu3cOPKlVsMld27ePPq3cu3r9+/di0JHowXAL3DiBMrXsy4sePHkCNLnkzPMOXLmDNr3gxgnufPoEOLHk26tOnTqFOrngcgnuvXsGPLnk27tu3buHPrjtd6t+/fwIML7y28uPHjwAHAW868ufPn0KNLn069uvXr8JRjb85OHdxz7LaL/x9PPrr26+3UoWtWL9++fv325auHDkC78vjzV7ffrr////+x44wx4riDj3v7JJhPPvas00w0AEYo4YQUVmjhhRHyd+E5zpyCzDTirOOOPfbgQ6I764gz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t2jVUmDqtG1Hs3DzUpRL1+5HvHoDP+Q71u9BwIITKyTM1vBhxZCtXu3rGGHky4uvzt1IrrPnz6BDh4Z2q7Tp06hTq17NurXr1wDoyZ5Nu7bt27hz697Nu7dverF/Cx9OvLhxAPOSK1/OvLnz59CjS59Ovfo8APGya9/Ovbv37+DDi/8fT758POzm06tfz749+vbw48tfDwCe/fv48+vfz7+///8ABiggPPUNaF876kSDzoIMhsNOOwZGKOGE+hUoIDvRNCMPPvn042E/++AjDzjnQEjhiSj6B0A7LLbo4osANEONOO7Yw+E+++STDz7urGMMOOq8KOSQRBZp5JFIwpgkO+E0swoy02RDY4322NOjONkwc4ozQSbp5ZdgJgkAO2SWaWaZ59xCiSmr7IIMlFJimc000zCDzC7GRKPOmWeqEsefgAYq6KCEFmoooHpcwqeZYy5qpjrhWOKGIIywuUqbuzBjp6ZvItMJNOU4SuYlaZRq6qmopqrqqqyaGoceorL/02is5YSDShKTgmLpLm52qqmdjUBDTqzEFmvsscQCoM6yzDa77DnhFOMIJYLoimmvyGhKpzGoREOOs+CGK+645JZrLrPKmktONLc40kmlbb7JTJRSUtOIJMWEc865/Pbr77nplnsOOdF6kscenZxCzYzrvGNMI4PcAk043/5r8cX/AnDOxhx37DHB0RSDiiWO2OHIyZZYInE44ZTj8cswxyzzzDTX7DEA5eSs884860xwONFAIzQ00bBMTs9IJ6300kw37TTOTvcsWtRUV2211QCIpvXWXHft9ddghy1a1mKXbfbZaIcNwDhst+3223DHLffcdNdt9914j7N23nz3/+3334AD8M3ghBdu+OGIJ6744ow37vjj3wgO+eSUV2755QB4o/nmnHfu+eeghy766KSXbro3AHSj+uqst+7667DHLvvstNduezcAbKP77rz37vvvwAcv/PDEF2/8Nrkfr7s10YDDIIPOSION8tRXb73vAGCj/fbcd4+NNM4Y4w4++3wIoojNOGON9+y37/778McPf/byM2/MNOKsY6OOOuJj5TrUaMYy1ie/AhrwgPIDgDUWyMAGMrAauWjEk6KUvxq9o0frwJKWLDFAB3rwgyAMoQhHSEIGAkAaKEyhClO4DFQwQle8yhb+sESnOt2pE7hYoQ6loYce+vCHQAyiEP+HSEQguqIaO5TGCZOYwmcAwxG5MsWusJWtTnXiFstgIgpNwMUuevGLYAyjGMfoxSMQgokAeIYa18hGNS4jF5bAVbWm2KlscaoRqjhGG/fIxz768Y+ADOQa0wjIN6IiD2eYI6Z8pS1mdEISuDjGMgRJyUpaMpCE/OMyjpELVNDhDS+Mlwzj9DBLqOIXkrykKldpSQAs45WwjCUsjyGMXFxCEnRAWCcWZoxeGiMPffDEKSUpy2Ia85jITKYylwlLABzjmdCMpjSPAYxcqOIRkrhDH+jQhzvcQRKXUEUtgDHNcprznOhMpzrTCQBhuPOd8IznO4Hxi1rkwhX4dEUuxin/z376858ADahAByqMdhL0oAhNqEIXKk+DMvShEI2oQgEAjIpa9KIYzahGN8rRjnr0oyANKTAoKtKSmvSkKE0pAHjB0pa69KUwjalMZ0rTmtr0pjjlBQBqwdOe+vSnQA2qUIdK1KIa9ahIrQUAZMHUpjr1qVCNqlSnStWqWvWqWJUFAGDB1a569atgDatYx0rWspr1rGiFBQBewda2uvWtcI2rXOdK17ra9a54fQUAWsHXvvr1r4ANrGAHS9jCGvawiG3FXhPr11SoojTgAMctVJEKVjD2spjNLGABkIrOevazoPXsLZrxDnuUz0M5kkczLuEKVrAitLCNrWxnS9va/8qWs7btrCocMaMq6QhH/XOHOIxxidwa97jIpS1ubYuJRmQKf+ugUpWulKVOXKIUyc2udnMLgFJ497vgBS8p7lCpGFIwg3Ky4SoagYnwhpcQRYyvfIkIgCASwr3g7S5+w0uKSeTBDaCw1iJ/xak77YEQ+sXvEDzA4AY7+MEQjrCEJ9zgD8Bgv94FACk2zOEOc1gUk+hDrgQcQ1+9aReNuMQmPMziFrv4xTCOsYw3DIBR2PjGOL4xiB8BBUEoklfYauQe0kAIUeT4yEhOspKXzOQm2xgAooiylKdMZULEwQmUgFev5kVBe6VBD5igspjHTOYym/nMY8YEJuDbw3BCGf3NUV6zHsQAhk4kbGH562UjxPBlQ8D5z4AG9JrZHIdSieHQcbgEABa9iUY7+tGQ3gQmJgHfNIhhC07I9Ba2kIZXEWISkQ61qEdN6lJHehJz5oKqV82FNDxi0bA2dagpzWYfEoIQiwC1rHfN614TIg2bDnarXw1rWGfi2MhOtrKXnQk1OxsTzI62tKdN7WorOw5cCDaniV1sY1v72+AOt7itTYhLb1oMj1BFt7u9iHa7+93wjre8503vetv73vU2RBymMAV0q3vd7Ma3wAdO8ILfu9xciMO/Ad7tQDj84RCPuMQnTvGKW/ziGLe4HhTOcIYH+uMgDznIF97xdQcEACH5BAUHAAAALLsAPQBsAFMAAAj/AAHEGkiwoMGDB7OUWMiwocOHECNKnEixBAcKGDNyYAhAIMKPIAcqrFjiRAsXKFOqXMmypUuXLR5ezIhx48KOIXMmJFmiRRAlQIMKHUq0qFGjQE44nEnTZgmcOqPGGsmzqtWrDJlq5OhRak6qWMOKhai1JlevOsGOXSu2LAWnUNGCVMu2blW3DePKRUjXrt+JWl/MGXR278e+fxMvxehijapYlgob3qm4MlkVWh4PjHyz6+SCg9aIHk26tOnTqFOrXi1aM0FJMmLr/Uy7tm2dAIYR2827t+/fwIMLH068uPHjvQCco8e8ufPn0KNLn069uvXr2Ikpx869u/fv4KFr/z83r7z58+jTq1/Pvr379/DjaycXv779+/jzp58fr7///wAGKOCABBZo4IEIJshfggw26OCDEAI4HzwUVmjhhRhmqOGGHHbo4YcgTggihu2ocw477Yyo4oosfijiiO2EAw469ehjoz71oBPNOS326OOI87Uj5JBEFtlONM2s4w4++ezTTz/77JPPO+k4o46RWGap5ZZcdrllkF6q40wy04ijpD1M4oOPPfasIw41zZDj5Zx01jmnduGwo+eefO6pDjSdrLILM2Wa6Y47boqTzTTM7HILOX322Y0rlFZq6aWYZqrpppd+E+meeH7apzrkWMIIKKYIugsyhE7jKjOwIv+zSyPRqCMqO7lcoOuuvPbq66/ABsvrB8HcGuqtep4TjiVuCCKIKamqisy01E7bCDTl2CqqOtx26+234IYr7rjfInvsreqUE84tnTSLqqqrUgsrrJZEQ462yOar7778foonudwqW4wlnQjy7i7xwurqNNQ4cks42QIs8cQUV+ztMACEM7G6A+/RCSWCslroOsY0Yskt9p5j8cost4yxxhKfQ0440NxiiSONNGLMzjs7Ygkq0IRDjsotF200uS+fo/TSTDddzszRFHMLKpJYIgkqqKAczjfklNP012CHLfbYZJfN9MvlpK322myvTc434cQtNzldt233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tmlljFhGg0onboACypdhAumjj53cEs45RbYp6KCEgjiMAESqo+iijKozWzGedMKIl2COqWE21DRiCTSJNurpp6CGKuqopKpzaKeilhMONJ440kknpyD/M0029a3zjjGOoFJMOOWU6uuvwJZ66jnEFmussapGA+kgeTTirLOOWILKLdHweuy12Gar7bbcdmvsqeWEK+645JZDzlHKFnPLurcUUy2v5cYr77z01mtvveDeSy455IxzFL/86ivwwAQLnG/BCCes8MLiHmoNwBBHLPHEFFds8cUYZ6wxwA6P4/HHIIcs8sgkl2zyySinrPKh0qjs8sswxyyzyCx/Y/PNOOes88489+zzz0AHLXRV0ght9NFIJ620zkR74/TTUEct9dRUV2311VhnrTXR3XTt9ddghy322GSXbfbZaKdN9DZst+3223DHLffcdNdt9914r43329FE/wONM9BAE83ehBduuN1VLYPN4ow37jg21kTTTDr4DEfcPvjUAw401jzu+eeghy766KInTvriyzRznTvacdfdd+I0E83ptNdue+kCLGPN7rz3zns1wTQyH63u3IcPfsVjyEwnx1Tj+/PQRy/99NRXz3vi1WSv/fbZS7OMJA7uOGt9F044DZmmSHKMNNxz78qK8McvP4mYtK99L0VJo//+/Ov/TC57qJMpcKSjPe0JSELKxTP61784eOCBEIygBCdIwQpaMIIwYOD+8HeMZ3jwgyD04DFykQcu2YmAlRLTj3bhCFcsI4QwjKEMZ0jDGtrQgxy04QglwQYT4klMY+KTJ/9y8cIbGvGISKwh/oZhw2UAQxWSKMOkcBQmH80KU424gyqAUcQkevGLRlziMsZIxjKScYRQpIMcYLULalCjPrdqBB0koYpcHMOMeMyjHvfIxz76kYz4A8YxBknIQhoSGLmA4h3oAIdmNSIPdLjDI+ooSENa8pKYzKQmN8nJQgayk4QUBjBqkQsBqGJEqFCFKlxRC2AIA5SwjKUsOakLAbhSGLjMpS53qUtg+PKXt+SlMIdJzGIa85jIrGUwkcnMZjrzmdAkZi15AcxqWvOa1sxFLlzhClWqEhWo8IQnzGIWSVjinOhMpyXIaQlJmEWcngCnN1fJzVZi8574BIYtBGD/z3wCgxfbxIUqUGFORzgiD3M4xB8W6gc/CMCh5IyoRCdK0YpK9A/kVMQc8mBQS4hTla7IxS/8+ct91oIXKE0pL2rRzXEKAKF/4INFZ0rTmtr0pnxY6B7s4AhJeGKVJ1VpSk2a0lqowhN2mMNNl8rUpjq1ohv96StUuk9Z1EIWd3iqVrfK1aX2oA+vqEUtquoKLXT1rGhNq1mE4ApYlFIWa1CrXOfqVCi4VQCuoABd98pXmpayr4ANLDmN8FfBGvawiE0sV1XgUsU69rGQdSwKGhvZylr2smidQSkvoVfMepaceihlKX7w2c/+gBBmKcUlBECC0lq2Be5M7SYIYQTXNEIWA0KQaCk2wVs9mNW2h61BDyhrFlJkgrY2AO5lRaEHsxxAuZYVxQygi9nVUve62DVsQAAAIfkEBQcAAwAsugBhAG0ATwAACP8AB8QaSLCgwYMIEypcyLChw4cDBwiESLGixYsYY0nMyLGjx4obP4ocSTIkyZMoLZpMybJlwpUuY7qEKbPmSZo2c3qUGO6cz59Ag/ocIDQo0aJIkypdyrQp0GESz9GbSrWq1atYs2rdyrWr168Sic4bS7as2bNo06pdy7at27dhz72dS7eu3btnw5KLx7ev37+AAwseTLiw4cOI9SJezLix48eAFUOeTLmyY2ISycHbzLmz58+gQ4seTbq06dOYB2g+zbldOHSw9cFGF44d69u4c49OTa6d79/Ag7sGJ+9dvn39kvfLh08eOnXwhEufTr269evVeWNvxy4atWzr3Nn/w5evPHN77sQZi7a9vfv31lMPwN690y5k08StW/fOHvr92UyDTCe1wWfggdvJx86CDDa4oDrkOCKIKavch1824mQT4DTMMIPMKpYM4KCDw6Rh4okopqjiiiy2iGIc1ozIYGq1ydjgOdHs4YYgoFBYoYXIBOkhMrs4Eo46NrKzjB5MNunkk1BGKeWUT3KTJI1JPkhONJbsCAooq4S5C5DIdMjMLqj0hGSWbLbp5ps20qjOnHTWOWc54dzSiCA8iglkh9NMQ40jxahp56GIJqrooow2qk5YRza6JSqNdMIIhfcxM42G4lBjjCW3REOOo6SWaqqjUA0QKaPnDBDNLZbk/7FHJ9TUakw6xhjjiCTFiHrOqcAGe2qqPTlFTjivomKJJY40a4kkqPQaDjlOVWvttUsRW8623Hbr7bbkHItsNORGE8605Hyr7rrstuvuu+9qC++89NZr773upmpNuPz26++/AAcs8MAEF2zwweToO87CDDfs8MMQRyzxxBRXbPHFCl+s8cYcd+yxw6lK8/HIJJfscVjSfKPyyiy37PLLMMcs88w012xzMBKlbPPOPPfs888t4zyANN4UbfTRSCet9NJMN+3001BHLbQ03FRt9dVYZ6311lx37fXXYIc99TZkl2322WiTbU3abLft9ttwx/322HKXHY0z4KBTTz2zOf8jTd2ABy6420Ivg83hiCeuODbRNLOOPccptxw+6TQTzeKYZ6755px3znnhnmMjzS3fiSMeeebhY8866t1iTeiwxy775oVbY/vtuN8+un0X6ufOO+64w3qAyJjSizS5J6/88sw37/zztxcuzfTUV089MHlM+GOZGG4YqIdFDm299ZfEYf756Kev/vrst4++HuNT34tExMRv/TK56MijjxUG6T+RY2rEAHCBi1vcAhUI9AQqJLIGIzjwgRCE4AwmSMEZrOCCF7yBBo/AwQ568IMfjIP9pDG/ARzjGShMoQpReIxc0GFHjGAEJTpBw068QQ43rIMO+TAAHoblh0AMohD/h0jEAVTCEWFB4ABykYtgLGOFUFRhCU8IxWMEAxdKnAMf5FCHInrxi2AM4xcVgUQF4iIXT4xiCYeRwhaiwhGK+IMY50jHOtpxAH5QhB1QkQsqonCNyziGJapwx0Ia8pBEpMIA7nCMZSyjhMD4BRgQSclKUhIKfYQkHSzJyU7WMQvC0IVEcmEBT5rylEV0hSgHMAdUuvKVEgHDKmFJS1TSopa49GQLFpjLXvryl8AE4i6DScw59qCYyASjEX6IgWQ684eXCAsrhPDMZxqhFbmQCCuq6cwXXAKb2kyFKrTATWBqAAqiYEUqsjmAVLgzFY8oQzlxaQMhXOKd65SIO0WhV4UczPOXhHAnO1MRzQEk4J+/vEQpwpKKZSI0mKRgpyoeSkw9sJOixBSCKzCKzIly9KMgDalIR0rSknryEh0waS1F4VCVvhIThKCmS13pilJMFAgzNWVAAAAh+QQFBgAIACy6AGoAbQBLAAAI/wARxBpIsKDBgwgTKlzIsKHDhwMRCIRIsaLFixhjSczIsaPHihs/ihxJMiTJkygtmkzJsmVCicPCyZxJs6bNmzhz6tzJs6fPXhLP0RtKtKjRo0iTKl3KtKnTpxIRCH1KtarVq1iNRj03r6vXr2DDih1LtqzZs2jTRkUQr63bt3Djyp1Lt67du3jzRiWXt6/fv4ADx90ruLDhw4H3wlvMuLHjx5AjS55MubLly4ovN253Lly0aDLPtdNMurRpypkvtwuHTl6+fP367duHrx64cKdz69ZMTCK5dsCDCx9+rhm1dfbw5Zs9Ox8+d+LAiR5Ovbr169izaxfeG8Fv7ezCGf/bNS2bOHfvkuOz9w56NmbNpm+fT7++9u4I2Onfz39/OUuMrLILMsyUt86B4oiTzTTMILPKLfn1x184qlRo4YUYZqjhhhxe6Mo3Eu6HX4j9dSaHG6CAsoqAu+zCzIswIoPMLo6Eow6J7OTiwY489ujjj0AGKWSPJiyD44g4sqMOOdHk4YYgoJhiyootyihjgzOiEs45SXbp5ZdgJtldOF2qg0A0qKAhCJRUDmgljMw0UoyNN4Zp55146jemOnz26SefnRUjSSeMRCnglQVmkw01jaAC2p+QRirppJRWammfUdFZaTnhFOOJI510ckqi4qzzjjGNOIIKNOGUc+mrsMb/emmml57DaTTFoGKJI3k00kgojjhiCSpzklPOObImq6ysw0i05TnQRiuttOWQIxOuxdyibTHQgGbssdOGK+645JZr7rnSNotAq+W06+678LpLzrzeeTdvvPjmq+++/PbrbznqsvvvwAQXbPDB76przbwMN+zwwxBHLPHEFFds8cXkKDzOxhx37PHHIIcs8sgkl2zyyeoicPLKLLfs8ssfqyvNNzTXbPPNOOes88489+zzz0BHNTPQRBdt9NFI3yy0N0w37fTTUEct9dRUV2311VgL3c3WXHft9ddghy322GSXbfbZwUgkzTZst+3223DHLc0wn0FjNzTFrIUKAqjo/2rJ34AH3vewfReOyi24FMNtt9EMs3bckEfudtoIPC4529Ys81m2gzsSSiWKKHLIH6T7sdbpqKeu+uqoayKRJZIgcAu30Sxz+duU2w63NMtki8CulfxhOuvEF2/88ccfDs0w1mATd+7YRC9NLxAib/312Ge/ViWOIACNNNFHn7s11SAAhfbop68+8YNIY401uS+zRgLr129//cFU44tExNhxwP0ADOD1yjA9iQQDAwJMoAJZlwugLPCBEDydAyNIQQUKQRcVzKAAXaDBDt5PAx4MoQhHKEKNkPCExtOCLSSiChS6MHWqWCECagEFEL7whVrghQxr0cIQ3NCFqtChRJxqwQtXgOGHJNSCK3ghRATIohZQvAQSO5gDBKgCilCUoSxg4YopirAECHDFFmkhEVm00IsnhEUuJMIKNKIQFm684SPi+EIorJGOKOwiHklIgj368Y8KlCIgOzgAKw7Sg0bQ4xkPCcEDzFEipWBkBI8YlUhKMoOl2MQkxPCCS0KQFJkwhBM8+UlC/AAB9COlAkVhBFVCUJCujCUjAwIAIfkEBQcACAAsugBwAG0ARgAACP8AEcQaSLCgwYMIEypcyLChw4cDEQiESLGixYsYY0nMyLGjx4obP4ocSVIisXAoU6pcybKly5cwY8qcSTOYxHP0curcybOnz59AgwodSrSoRAQ4iypdyrSpU55Hz82bSrWq1atYs2rdyrWr169HEcQbS7as2bNo06pdy7at27dh38qdS7eu3bNx7+rdy7duWHiAAwseTLiw4cOIEytezPgoOcaD26lb2a4d5MuYMyd2fLldOHTy8O3r12/fPnz10J3TzLo1ZMeVY8ue3a5cM2rr7OHLZ9p0PnzuxIE7R7u48ePIkytHHnY5u3DGdk3Lti63bnv23K0Tlw1BM3bslov/H09+eVjw6NOnJ+eI0apdyJhlyyZuO3cE05ghW+XsnHr10ugh4IAEFmjggQgmSOAl3fyHHjFHOajeOdHIIQgopqyiIXzMdOghMsjsYkk4CEjITjBHpKjiiiy26OKLMK44hDQmQiiRieAhQE40jbhxISgavgcfiPHptwsqJOKo5JJMNomjjSXiqM6OqHTyY4a7DAmih8w0Ukw46qjj5JhkloleWGGmqWaa54RTjCWdMILhe1syM1021DSCSjTkrOnnn4AGKuighKaJJqEIuImKI3t0soud1LnzjjGNWHILNCQWqummnBZ6VDjnhCrqqKOWE040xaBiiR155NFIHo44/2Ippt+QauutuOaq6668kvppOcAGK+yw5ZDzzanQFHPLLcUUA0004XxD7LTUVmvttdhi+2u2xJJj7DfeksPtuOSWS+625qar7rrsBjuMRNaEK++89NZr77345qvvvvyG+y4C1owj8MAEF2zwwQgnrPDCDDfs8L8IOCzxxBRXbLHBEH+j8cYcd+zxx+FIE1ZYy47sSViooIKAykexTHKzCEAT1jLRfmzzzRyHhTPH3IgsUTEjj+xH0EQXbfTRQUeC8i0SRYOANN3snLNE0nhj9dXebCONzEdp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'/>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
					
			<div class=btns id=config-apply-button>
				<button type=submit class="btn btn-primary" style="width: 100px;">적용하기!</button>
			</div>
		</form>
	`;
	
	res.send(await render(req, config.getString('site_name', random.choice(['바나나', '사과', '포도', '오렌지', '배', '망고', '참외', '수박', '둘리', '도우너'])) + ' 등록 정보', content));
});

wiki.post('/admin/config', async function saveWikiConfiguration(req, res) {
	if(!getperm('developer', ip_check(req))) {
		res.send(await showError(req, 'insufficient_privileges'));
		return;
	}
	
	// 소유자 전용 페이지이므로 딱히 취약점 가드를 할 필요가 있을까.
	
	var settings = [
		'site_name', 'max_users', 'frontpage', 'edit_warning', 'footer_text', '!enable_apiv1', '!enable_apiv2',
		'!enable_apipost', 'default_skin', 'default_skin_legacy', '!default_skin_only', '!enable_theseed_skins',
		'!enable_opennamu_skins', '!enable_custom_skins', '!sql_execution_enabled',
		'!disable_random', '!disable_search', '!disable_discuss', '!disable_history', '!disable_recentchanges',
		'!disable_recentdiscuss', '!disable_contribution_list', '!enhanced_security', '!allow_upload', 'acl_type',
		'privacy', 'email_service', /* 'email_addr', 'email_pass',*/ 'registeration_verification', 'password_recovery',
		'file_extensions', 'email_whitelist', 'site_notice', 'edit_notice', 'discussion_notice', '!allow_telnet',
		'!enable_captcha', '!ip2md5', '!denial', '!no_login_history', 'registeration_notice'
	];
	
	for(settingi of settings) {
		if(settingi.startsWith('!')) {
			const setting = settingi.replace(/^[!]/, '');
			curs.execute("insert into config (key, value) values (?, ?)", [setting, req.body[setting] ? '1' : '0']);
			wikiconfig[setting] = req.body[setting] ? '1' : '0';
		} else {
			const setting = settingi;
			curs.execute("insert into config (key, value) values (?, ?)", [setting, req.body[setting]]);
			wikiconfig[setting] = req.body[setting];
		}
	}
	
	conn.run("delete from email_config", (err, res) => {
		curs.execute("insert into email_config (service, email, password) values (?, ?, ?)", [req.body['email_service'], req.body['email_addr'], req.body['email_pass']]);
	});
	
	if(req.body['clear_login_history']) {
		curs.execute("delete from login_history");
		curs.execute("delete from useragents");
	}
	
	timeout(3000);
	
	res.redirect('/admin/config');
});

function mmmmmmmmmmmmmmm() { return 0; }

wiki.get(/\/api\/v1\/w\/(.*)/, async function API_viewDocument_v1(req, res) {
	const title = req.params[0];
	
	if(title.replace(/\s/g, '') === '') {
		res.status(400).json({
			title: title,
			state: 'invalid_document',
			content: ''
		});
		return;
	}
	
	await curs.execute("select content from documents where title = ?", [title]);
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
			
			if(title.startsWith("사용자:") && getperm('admin', title.replace(/^사용자[:]/, ''))) {
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

wiki.get(/\/api\/v1\/raw\/(.*)/, async function API_viewRaw_v1(req, res) {
	const title = req.params[0];
	
	if(title.replace(/\s/g, '') === '') {
		res.status(400).json({
			title: title,
			state: 'invalid_document',
			content: ''
		});
		return;
	}
	
	await curs.execute("select content from documents where title = ?", [title]);
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
		state: viewname,
		content: content
	});
});

wiki.get(/\/api\/v1\/users\/(.*)/, async function API_userInfo_v1(req, res) {
	const username = req.params[0];
	
	res.json({
		username: username
	});
});

wiki.get(/\/api\/v1\/history\/(.*)/, async function API_viewHistory_v1(req, res) {
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
	
	await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and cast(rev as integer) >= ? and cast(rev as integer) <= ? order by cast(rev as integer) desc limit 30",
						[title, atoi(start), atoi(end)]);
	var ret = {
		title: title,
		startrev: start,
		endrev: end,
		state: 'ok'
	};
	
	var cnt = 0;
	
	for(var row of curs.fetchall()) {
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

wiki.get(/\/api\/v1\/thread\/(.+)/, async function API_threadData_v1(req, res) {
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
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { 
		res.status(400).json({
			thread_id: tnum,
			state: 'notfound',
			description: '토론을 찾을 수 없습니다.'
		});
	}
	
	await curs.execute("select username from res where tnum = ? and (id = '1')", [tnum]);
	const fstusr = curs.fetchall()[0]['username'];
	
	await curs.execute("select title, topic, status from threads where tnum = ?", [tnum]);
	const title = curs.fetchall()[0]['title'];
	const topic = curs.fetchall()[0]['topic'];
	const status = curs.fetchall()[0]['status'];
	
	await curs.execute("select id, content, username, time, hidden, hider, status, ismember, stype from res where tnum = ? and (cast(id as integer) >= ? and cast(id as integer) <= ?) order by cast(id as integer) asc", [tnum, Number(start), Number(end)]);

	content = '';
	var ret = {
		title: title,
		topic: topic,
		status: status,
		thread_id: tnum
	};
	
	for(rs of curs.fetchall()) {
		ret[rs['id']] = {
			id: rs['id'],
			hidden: rs['hidden'] == '1' ? true : false,
			hider: rs['hidden'] == '1' ? rs['hider'] : null,
			type: rs['status'] == '1' ? 'status' : 'normal',
			contribution_type: rs['ismember'],
			status_type: rs['status'] == '1' ? rs['stype'] : null,
			timestamp: rs['time'],
			username: rs['username'],
			content: rs['hidden'] == '1' ? (
								getperm('hide_thread_comment', ip_check(req))
								? markdown(rs['content'])
								: ''
							  ) : (
								markdown(rs['content'])
							),
			raw: rs['hidden'] == '1' ? (
								getperm('hide_thread_comment', ip_check(req))
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

wiki.get(/\/api\/v2\/w\/(.*)/, async function API_viewDocument_v2(req, res) {
	const title = req.params[0];
	const rev = req.query['rev'];
	
	if(title.replace(/\s/g, '') === '') {
		res.status(400).json({
			title: title,
			state: 'invalid_document',
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
		
		httpstat = 404;
		content = '';
	}
	
	res.status(httpstat).json({
		title: title,
		state: viewname,
		content: content,
		last_edited: lstedt
	});
});

wiki.get(/\/api\/v2\/raw\/(.*)/, async function API_viewRaw_v2(req, res) {
	const title = req.params[0];
	const rev = req.query['rev'];
	
	if(title.replace(/\s/g, '') === '') {
		res.status(400).json({
			title: title,
			state: 'invalid_document',
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
		state: viewname,
		content: content
	});
});

wiki.get(/\/api\/v2\/users\/(.*)/, async function API_userInfo_v2(req, res) {
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
	
	ret['banned'] = await isBanned(req, 'author', username);
	
	for(var perm of perms) {
		if(getperm(perm, username)) ret['permissions'].push(perm);
	}
	
	res.json(ret);
});

wiki.get(/\/api\/v2\/history\/(.*)/, async function API_viewHistory_v2(req, res) {
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
	
	await curs.execute("select rev, time, changes, log, iserq, erqnum, advance, ismember, username from history \
						where title = ? and cast(rev as integer) >= ? and cast(rev as integer) <= ? order by cast(rev as integer) desc limit 30",
						[title, atoi(start), atoi(end)]);
	var ret = {};
	
	var cnt = 0;
	
	for(var row of curs.fetchall()) {
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
		title: title,
		startrev: start,
		endrev: end,
		state: 'ok',
		total: cnt,
		history: ret
	});
});

wiki.get(/\/api\/v2\/thread\/(.+)/, async function API_threadData_v2(req, res) {
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
	
	await curs.execute("select id from res where tnum = ?", [tnum]);
	
	const rescount = curs.fetchall().length;
	
	if(!rescount) { 
		res.status(400).json({
			thread_id: tnum,
			state: 'notfound',
			description: '토론을 찾을 수 없습니다.'
		});
	}
	
	await curs.execute("select username from res where tnum = ? and (id = '1')", [tnum]);
	const fstusr = curs.fetchall()[0]['username'];
	
	await curs.execute("select title, topic, status from threads where tnum = ?", [tnum]);
	const title = curs.fetchall()[0]['title'];
	const topic = curs.fetchall()[0]['topic'];
	const status = curs.fetchall()[0]['status'];
	
	await curs.execute("select id, content, username, time, hidden, hider, status, ismember, stype, isadmin from res where tnum = ? and (cast(id as integer) >= ? and cast(id as integer) <= ?) order by cast(id as integer) asc", [tnum, Number(start), Number(end)]);

	content = '';
	var ret = {};
	var cnt = 0;
	for(rs of curs.fetchall()) {
		ret[rs['id']] = {
			id: rs['id'],
			hidden: rs['hidden'] == '1' ? true : false,
			hider: rs['hidden'] == '1' ? rs['hider'] : null,
			type: rs['status'] == '1' ? 'status' : 'normal',
			contribution_type: rs['ismember'],
			status_type: rs['status'] == '1' ? rs['stype'] : null,
			timestamp: rs['time'],
			username: rs['username'],
			content: rs['hidden'] == '1' ? (
								getperm('hide_thread_comment', ip_check(req))
								? markdown(rs['content'])
								: ''
							  ) : (
								markdown(rs['content'])
							),
			raw: rs['hidden'] == '1' ? (
								getperm('hide_thread_comment', ip_check(req))
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
		title: title,
		topic: topic,
		status: status,
		thread_id: tnum,
		total: cnt,
		res: ret,
		startres: start,
		endres: end
	});
});

wiki.post(/\/api\/v2\/login/, async function API_botLogin_v2(req, res) {
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

wiki.post(/\/api\/v3\/plugins\/enable/, async function API_enablePlugin_v3(req, res) {
	try {
		const name = req.body['name'];
		const picfg = require('./plugins/' + name + '/config.json');
		
		picfg['enabled'] = true;
		
		fs.writeFileSync('./plugins/' + name + '/config.json', JSON.stringify(picfg));
		
		res.json({
			'status': 'success'
		});
	} catch(e) {
		res.json({
			'status': 'error'
		});
	}
});

wiki.post(/\/api\/v3\/plugins\/disable/, async function API_disablePlugin_v3(req, res) {
	try {
		const name = req.body['name'];
		const picfg = require('./plugins/' + name + '/config.json');
		
		picfg['enabled'] = false;
		
		fs.writeFileSync('./plugins/' + name + '/config.json', JSON.stringify(picfg));
		
		res.json({
			'status': 'success'
		});
	} catch(e) {
		res.json({
			'status': 'error'
		});
	}
});

wiki.use(function(req, res, next) {
    return res.status(404).send(`
		접속한 페이지가 없음.
	`);
});

if(firstrun) {
	(async function setCacheData() {
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
		
		await curs.execute("select username, token, owner from bots");
		
		for(var bot of curs.fetchall()) {
			botlist[bot['username']] = bot;
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
		
		// 활성화된 경우 텔넷 서버 열기
		if(config.getString('allow_telnet', '0') == '1') {
			const net = require('net');
			const telnet = net.createServer();

			telnet.on('connection', async function telnetHome(client) {
				client.setEncoding('utf8');
				
				const readline = require('readline');
				const rl = readline.createInterface({
					input: client,
					output: client
				});
				
				rl.question('문서 이름: ', async answer => {
					client.write('\n');
					
					await curs.execute("select content from documents where title = ?", [answer]);
					client.write(curs.fetchall()[0]['content']);
				});
			});

			telnet.listen(23);
		}
	})();
}

}};