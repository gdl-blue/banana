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

function shell(c, l = '') {
	(require("child_process")).exec(require('os').platform() == 'win32' ? c : l);
}

function sound(a) {
	shell('beep.exe ' + a);
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

const _perms = perms;

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

const inputReader = require('wait-console-input');

function input(p) {
	prt(p);  // 일부러 이렇게. 바로하면 한글 깨짐.
	return inputReader.readLine('');
}

function inputpw(p) {
	const rlsync = require('readline-sync');
	
	prt(p);
	
	var retval = '';
	
	while(1) {
		var chr = rlsync.keyIn('');
		if(chr == '\n') break;
		retval += chr;
		prt('*');
	}
	
	return retval;
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
function LCase(s) { return s.toLowerCase(); }; const lcase = LCase;

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
	execute: async function executeSQL(sql = '', params = [], noerror = false) {
		if(UCase(sql).startsWith("SELECT")) {
			const retval = await conn.query(sql, params);
			conn.sd = retval;
			
			return retval;
		} else {
			await conn.run(sql, params, err => { if(err && !noerror) { print('[오류!] ' + err); beep(3); } });
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

swig.setFilter('avatar_url', function filter_avatarURL(input) {
	return input;
});

swig.setFilter('to_date', toDate);

swig.setFilter('localdate', generateTime);

var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const fs = require('fs');

var wikiconfig = {};
var userset = {};
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

const nodemailer = require('nodemailer');

// module.exports에 들어가야 해서 var
var ip_check = getUsername; // 오픈나무를 오랫동안 커스텀하느라 이 함수명에 익숙해진 바 있음

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
			conn.run("delete from config where key = ?", [str], e => curs.execute("insert into config (key, value) values (?, ?)", [str, def]));
			
			return def;
		}
		return wikiconfig[str];
	}
};

function getUserset(username, str, def = '') {
	str = str.replace(/^wiki[.]/, '');
	
	if(!userset[username] || !userset[username][str]) {
		if(!userset[username]) userset[username] = {};
		userset[username][str] = def;
		curs.execute("insert into user_settings (username, key, value) values (?, ?, ?)", [username, str, def]);
		return def;
	}
	return userset[username][str];
}

const _ = undefined;

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
			case 'chrome':
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

function getSkin(req) {
	return islogin(req)
		? getUserset(ip_check(req), 'skin', 
				compatMode(req)
				? config.getString('default_skin_legacy', hostconfig['skin'])
				: config.getString('default_skin', hostconfig['skin'])
			)
		: config.getString('default_skin', hostconfig['skin']);
}

function getperm(perm, username) {
	try {
		return permlist[username].includes(perm)
	} catch(e) {
		return false;
	}
}

function loadLang(kor, eng) {
	return kor;
}

if(config.getString('enable_opennamu_skins', '1') != '0') {
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

	swig.setFilter('CEng', loadLang);
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
				return permlist[ip_check(req)].includes(perm);
			} catch(e) {
				return false;
			}
		}
	}
	
	var skinconfig;
	
	try {
		skinconfig = require("./skins/" + getSkin(req) + "/config.json");
	} catch(e) {
		skinconfig = {
			type: 'openNAMU'
		}
	}
	
	var template;
	var _0xa9fc3e = skinconfig['type'];
	const skintype = _0xa9fc3e ? _0xa9fc3e : 'the seed';

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
		
		if(skinconfig.type && skinconfig.type.toLowerCase() == 'opennamu-seed') {
			templateVariables['imp'] = [
				title,  // 페이지 제목 (imp[0])
				[  // 위키 설정 (imp[1][x])
					config.getString('wiki.site_name', random.choice(['바나나', '사과', '포도', '오렌지', '배', '망고', '참외', '수박', '둘리', '도우너'])),  // 위키 이름
					config.getString('wiki.copyright_text', '') +  // 위키 
					config.getString('wiki.footer_text', ''),      // 라이선스
					'',  // 전역 CSS
					'',  // 전역 JS
					config.getString('wiki.logo_url', '') + config.getString('wiki.site_name', random.choice(['바나나', '사과', '포도', '오렌지', '배', '망고', '참외', '수박', '둘리', '도우너'])),  // 로고
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
		else if(skinconfig.type && skinconfig.type.toLowerCase() == 'opennamu') {
			var prmret = [];
			
			for(usrprm of _perms) {
				if(!islogin(req)) break;
				
				if(getperm(usrprm, ip_check(req))) prmret.push(usrprm);
			}
		
			if(!prmret.length) prmret = '0';
			
			templateVariables['imp'] = [
				title,  // 페이지 제목 (imp[0])
				[  // 위키 설정 (imp[1][x])
					config.getString('wiki.site_name', random.choice(['바나나', '사과', '포도', '오렌지', '배', '망고', '참외', '수박', '둘리', '도우너'])),  // 위키 이름
					config.getString('wiki.copyright_text', '') +  // 위키 
					config.getString('wiki.footer_text', ''),      // 라이선스
					'',  // 전역 CSS
					'',  // 전역 JS
					config.getString('wiki.logo_url', '') + config.getString('wiki.site_name', random.choice(['바나나', '사과', '포도', '오렌지', '배', '망고', '참외', '수박', '둘리', '도우너'])),  // 로고
					''   // 전역 <HEAD>
				], 
				[  // 사용자 정보 (imp[2][x])
					'',  // 사용자 CSS
					'',  // 사용자 JS
					islogin(req) ? 1 : 0,  // 로그인 여부
					'',  // 사용자 <HEAD>
					'someone@example.com', // 전자우편 주소; 아직 이메일 추가기능도 미구현.,
					islogin(req) ? ip_check(req) : '사용자',  // 사용자 이름
					islogin(req) ? (getperm('admin', ip_check(req)) ? 1 : 0) : 0,
					isBanned(req, islogin(req) ? 'author' : 'ip', ip_check(req)),
					0,
					prmret,
					ip_check(req),
					user_document_discuss ? 1 : 0
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
	
	try {
		switch(skintype.toLowerCase()) {
			case 'opennamu':
			case 'opennamu-seed':
				var tmplt = fs.readFileSync('./skins/' + getSkin(req) + '/index.html').toString();
				
				try {
					for(ifstatement of tmplt.match(/[{][%]\s{0,}if(.+)\s{0,}[%][}]/g)) {
						tmplt = tmplt.replace(ifstatement, ifstatement.replace(/None/g, 'null').replace(/\snot\s/g, ' !'));
						
						const _0x3af4e6 = ifstatement.match(/(.+)\sin\s(.+)/);
						if(!_0x3af4e6) continue;
						
						const find = _0x3af4e6[1];
						const seed = _0x3af4e6[2];
						
						if(isArray(templateVariables[seed])) {
							tmplt = tmplt.replace(ifstatement, `${seed}.includes(${find})`);
						}
					}
				} catch(e){}
				
				tmplt = tmplt.replace(/[{][%]\s{0,}elif\s/g, '{% elseif ');
				
				return swig.render(tmplt, { locals: templateVariables });
			break; case 'the seed':
				template = swig.compileFile('./skins/' + getSkin(req) + '/views/default.html');
		}
	} catch(e) {
		print(`[오류!] ${e}`);
		
		return `
			<title>` + title + ` (프론트엔드 오류!)</title>
			<meta charset=utf-8>` + content;
	}
	
	output = template(templateVariables);
	
	var header = '<html><head>';
	header += `
		<title>${title}${subtitle} - ${config.getString('site_name', random.choice(['바나나', '사과', '포도', '오렌지', '배', '망고', '참외', '수박', '둘리', '도우너']))}</title>
		<meta charset=utf-8>
		<meta name=generator content=banana>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link rel="stylesheet" href="/css/banana.css">
	`;
	for(var i=0; i<skinconfig["auto_css_targets"]['*'].length; i++) {
		header += '<link rel=stylesheet href="/skins/' + getSkin(req) + '/' + skinconfig["auto_css_targets"]['*'][i] + '">';
	}
	header += `
		<!--[if !IE]><!--><script type="text/javascript" src="https://theseed.io/js/jquery-2.1.4.min.js"></script><!--<![endif]-->
		<!--[if IE]> <script src="https://code.jquery.com/jquery-1.8.0.min.js"></script> <![endif]-->
		<script type="text/javascript" src="https://theseed.io/js/dateformatter.js?508d6dd4"></script>
		<script type="text/javascript" src="/js/banana.js"></script>
	`;
	for(var i=0; i<skinconfig["auto_js_targets"]['*'].length; i++) {
		header += '<script type="text/javascript" src="/skins/' + getSkin(req) + '/' + skinconfig["auto_js_targets"]['*'][i]['path'] + '"></script>';
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
	const acltyp = config.getString('acl_type', 'action-based');
	
	switch(acltyp) {
		case 'action-based':
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
		break; default:
			return (await require('./plugins/' + acltyp + '/index.js')['codes']['getacl'](req, title, action));
	}
	
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

// global에 함수가 안 들어가있다
module.exports = { generateCaptcha: generateCaptcha, validateCaptcha: validateCaptcha, timeout: timeout, stringInFormat: stringInFormat, islogin: islogin, toDate: toDate, generateTime: generateTime, timeFormat: timeFormat, showError: showError, getperm: getperm, render: render, curs: curs, conn: conn, ip_check: getUsername, ip_pas: ip_pas, html: html, ban_check: ban_check, config: config };

function getSkins() {
	var retval = [];
	
	// 밑의 fileExplorer 함수에 출처 적음.
	for(dir of fs.readdirSync('./skins', { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)) {
		const skincfg = require('./skins/' + dir + '/config.json');
		
		if(skincfg['type'] && skincfg['type'].toLowerCase() == 'opennamu' && config.getString('enable_opennamu_skins', '1') != '1') continue;
		
		retval.push(dir);
	}
	
	return retval;
}

function getPlugins(type = 'feature', excludeDisabled = false) {
	var retval = [];
	
	// 밑의 fileExplorer 함수에 출처 적음.
	for(dir of fs.readdirSync('./plugins', { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)) {
		if(require('./plugins/' + dir + '/config.json')['enabled'] != true && excludeDisabled) continue;
		if(type != 'all' && require('./plugins/' + dir + '/config.json')['type'] != type) continue;
		retval.push(dir);
	}
	
	return retval;
}

function mmmmmmmmmmmmmmn() { return 0; }

for(pi of getPlugins()) {
	const picfg = require('./plugins/' + pi + '/config.json');
	const picod = require('./plugins/' + pi + '/index.js');
	
	for(var u=0; u<picod['urls'].length; u++) {
		if(picfg['enabled'] != true) continue;
		
		if(picod['codes'][u]['method'].toLowerCase() == 'post') {
			wiki.post(picod['urls'][u], picod['codes'][u]['code']);
		} else {
			wiki.get (picod['urls'][u], picod['codes'][u]['code']);
		}
	}
	
	for(prm of picod['permissions']) {
		perms.push(prm);
	}
}

for(pi of getPlugins('all')) {
	const picod = require('./plugins/' + pi + '/index.js');
	
	for(table in picod['create_table']) {
		var sql = '';
		sql = `CREATE TABLE ${table} ( `;
		
		for(col of picod['create_table'][table]) {
			if(col.match(/(?:[^a-zA-Z0-9_])/)) continue;  // SQL 주입 방지
			sql += `${col} TEXT DEFAULT '', `;
		}
		
		sql = sql.replace(/[,]\s$/, '');		
		sql += `)`;
		
		curs.execute(sql, [], true);
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

wiki.get(/^\/views\/((?:(?!\/).)+)\/(.+)/, async function dropOpennamuSkinFile(req, res) {
	const skinname = req.params[0];
	const filepath = req.params[1];
	const skincfg = require('./skins/' + skinname + '/config.json');
	
	if(skincfg['type'] && skincfg['type'].toLowerCase() != 'opennamu') {
		res.send(await showError(req, 'file_not_found'));
		return;
	}
	
	const afn = split(filepath, '/');
	const fn = afn[afn.length - 1];
	
	var rootp = './skins/' + skinname;
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

wiki.get(/\/skins(.*)/, async function skinRootExplorer(req, res) {
	const path = ('./skins' + req.params[0]).replace(/\/$/, '');
	await fileExplorer(path, req, res);
});

function mmmmmmmmmmmmmm() { return 0; }

// require로 하면 여기서 정의한 함수도 바로 사용이 안 되고 module.exports로 다 다시 해야 함
eval(fs.readFileSync('./routes/view_document.js').toString());
eval(fs.readFileSync('./routes/edit_document.js').toString());
eval(fs.readFileSync('./routes/recent_changes.js').toString());
eval(fs.readFileSync('./routes/contribution_documents.js').toString());
eval(fs.readFileSync('./routes/recent_discuss.js').toString());
eval(fs.readFileSync('./routes/contribution_discuss.js').toString());
eval(fs.readFileSync('./routes/document_history.js').toString());
eval(fs.readFileSync('./routes/thread_new.js').toString());

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

eval(fs.readFileSync('./routes/thread_view.js').toString());
eval(fs.readFileSync('./routes/thread_theseed_get.js').toString());
eval(fs.readFileSync('./routes/thread_hide_res.js').toString());
eval(fs.readFileSync('./routes/thread_set_status.js').toString());
eval(fs.readFileSync('./routes/thread_delete.js').toString());
eval(fs.readFileSync('./routes/thread_theseed_notify.js').toString());
eval(fs.readFileSync('./routes/session_login.js').toString());
eval(fs.readFileSync('./routes/session_logout.js').toString());
eval(fs.readFileSync('./routes/session_signup_email.js').toString());
eval(fs.readFileSync('./routes/session_signup_create_account.js').toString());
eval(fs.readFileSync('./routes/upload.js').toString());
eval(fs.readFileSync('./routes/acl.js').toString());

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

eval(fs.readFileSync('./routes/suspend_user.js').toString());
eval(fs.readFileSync('./routes/wiki_config.js').toString());
eval(fs.readFileSync('./routes/session_mypage.js').toString());
eval(fs.readFileSync('./routes/special_edit_ranking.js').toString());

eval(fs.readFileSync('./routes/api_v1.js').toString());
eval(fs.readFileSync('./routes/api_v2.js').toString());
eval(fs.readFileSync('./routes/api_v3.js').toString());

wiki.use(function(req, res, next) {
    return res.status(404).send(`
		접속한 페이지가 없음.
	`);
});

if(firstrun) {
	(async function setCacheData() {
		sound('950,150');
		
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
		
		await curs.execute("select username, key, value from user_settings");
		
		for(var set of curs.fetchall()) {
			if(!userset[set['username']]) userset[set['username']] = {};
			userset[set['username']][set['key']] = set['value'];
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
		
		sound('500,100 750,150');
		
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