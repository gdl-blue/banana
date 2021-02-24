const advCount = 27;
const infinitePending = (a, r, g, s) => new Promise((a, b) => 12345678);
const isArray = obj => Object.prototype.toString.call(obj) == '[object Array]';
const ifelse = (e, y, n) => e ? y : n;
const pow = (밑, 지수) => 밑 ** 지수;
const sqrt = Math.sqrt;
const floorof = Math.floor;
const rand = (s, e) => Math.random() * (e + 1 - s) + s;
const randint = (s, e) => floorof(Math.random() * (e + 1 - s) + s);
const len = obj => obj.length;
const itoa = e => String(e);
const atoi = e => Number(e);
const reverse = elmt => {
    if(typeof elmt == 'string') {
        return elmt.split('').reverse().join('');
    } else {
        return elmt.reverse();
    }
};
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
};
const _range = (sv, ev, pv) => {
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
    
    var cnt = 0;
    
    if(s > e) {
        if(p > 0) throw new Error('Invalid step value');
        for(i=s; i>e; i+=p) {
            retval.push(i);
            cnt++;
            if(cnt > 2000) break;
        }
    } else {
        if(p < 0) throw new Error('Invalid step value');
        for(i=s; i<e; i+=p) {
            retval.push(i);
            cnt++;
            if(cnt > 2000) break;
        }
    }
    
    return retval;
};
const find = (obj, fnc) => {
    if(typeof(obj) != 'object') {
        throw TypeError(`Cannot find from ${typeof(obj)}`);
    }
    
    if(typeof(fnc) != 'function') {
        throw TypeError(`${fnc} is not a function`);
    }
    
    for(i in obj) {
        if(fnc(obj[i])) return i;
    }
    
    return -1;
};

const nvm = (a, r, g, s) => 12345678;

function shell(c, l = '') {
    (require("child_process")).exec(require('os').platform() == 'win32' ? c : l);
}

function sound(a) {
    if(require('os').platform() != 'win32') return;
    if(!(require('fs').existsSync(require('os').homedir()[0] + ':\\WINDOWS\\SYSTEM32\\MSVBVM60.DLL'))) return;
    if(!(require('fs').existsSync(require('os').homedir()[0] + ':\\WINDOWS\\SYSTEM32\\VB6KO.DLL'))) return;
    
    shell('beep.exe ' + a);
}

var tcvTimers = {};

function TCVreader(filename, timerName) {
    // Text-based Console Video (텍스트 기반 콘솔 화상)

    const fs = require('fs');

    const bytes = fs.readFileSync('./animations/' + filename + '.tcv', 'utf8');  // 바이너리로 했었는데 한글이 안돼서 유니코드로함

    if(bytes.slice(0, 3) != "TCV") {
        return;
    }

    if(bytes[4].charCodeAt() != 101) {
        return;
    }

    if(bytes[5].charCodeAt() != 16) {
        return;
    }

    if(bytes[6].charCodeAt() != 100) {
        return;
    }

    const frameLines = bytes[7].charCodeAt();
    const frameCount = bytes[8].charCodeAt();
    const frameDelay = bytes[9].charCodeAt();

    const topMargin = bytes[10].charCodeAt();
    const rightMargin = bytes[11].charCodeAt();

    const loopCount = bytes[12].charCodeAt();

    const clearScreen = bytes[13].charCodeAt();

    var frm  = 1;
    var loop = 0;

    console.clear();
    tcvTimers[timerName] = setInterval(function() {
        console.clear();
        
        for(var i=0; i<topMargin; i++) process.stdout.write('\n');
        
        for(var line=(frm-1)*frameLines+2; line<(frm-1)*frameLines+2+frameLines; line++) {
            try {
                if(bytes.split('\n')[line-1].endsWith('') || bytes.split('\n')[line-1] == '') continue;
            } catch(e) {
                break;
            }
            for(var i=0; i<rightMargin; i++) process.stdout.write(' ');
            process.stdout.write(bytes.split('\n')[line-1] + '\n');
        }
        
        frm++;
        
        if(frm > frameCount) {
            loop++;
            
            if(loopCount < 255 && loop >= loopCount) {
                clearInterval(tcvTimers[timerName]);
                return;
            } else {
                frm = 1;
            }
        }
    }, frameDelay * 100);

    if(clearScreen) console.clear();
}

// https://stackoverflow.com/questions/1183872/put-a-delay-in-javascript
async function timeout(ms, synchronous = true) {
    if(!synchronous) {
        return new Promise((r, j) => {
            setTimeout(() => r(1), ms);
        });
    } else {
        // 클라이언트 요청 처리 중에 이거 쓰면 안 됨.
        var s = new Date().getTime();
        while(1) {
            if(new Date().getTime() - s > ms) break;
        }
    }
}

function parseINI(iniString, options) {
    options = options || { forceString: false, enableGlobal: false };
    
    if(iniString.includes('\r') && !iniString.includes('\n')) {
        iniString = iniString.replace(/\r/g, '\n');
    }
    else if(iniString.includes('\r') && iniString.includes('\n')) {
        iniString = iniString.replace(/\r/g, '');
    }
    
    var retval = {};
    
    var currentSection = null;
    
    for(ln of iniString.split('\n')) {
        if(ln.replace(/\s/g, '') == '') continue;
        
        const section = ln.match(/^\[(.+)\]$/);
        const comment = ln.match(/^[;]/);
        const data    = ln.match(/((?:(?![=]).)+)[=](.+)/);
        
        if(comment) continue;
        else if(section) {
            currentSection = section[1];
        }
        else if(data) {
            if(!currentSection) {
                if(options['enableGlobal']) currentSection = '_global';
                else continue;
            }
            
            if(!retval[currentSection]) retval[currentSection] = {};
            if(options['forceString'])
                retval[currentSection][data[1]] = data[2];
            else {
                if(!isNaN(Number(data[2]))) {
                    retval[currentSection][data[1]] = Number(data[2]);
                }
                else if(data[2] == 'true') {
                    retval[currentSection][data[1]] = true;
                }
                else if(data[2] == 'false') {
                    retval[currentSection][data[1]] = false;
                }
                else
                    retval[currentSection][data[1]] = data[2];
            }
        }
    }
    
    return retval;
}

const fs = require('fs');

const _require = require;
require = function(pth) {
    if(pth.toLowerCase().endsWith('.ini')) {
        return parseINI(fs.readFileSync(pth).toString(), { enableGlobal: 1 });
    } else {
        return _require.apply(this, arguments);
    }
}

const { versionInfo } = require('./version.ini');

if(!process.env.PORT) TCVreader('chick', '_starting');

var perms = [
  'admin',                'suspend_account',
  'developer',            'update_thread_document',
  'ipacl',                'update_thread_status',
  'update_thread_topic',  'hide_thread_comment',
  'grant',                'login_history',
  'delete_thread',        'acl',
  'close_edit_request',   'ban_users',
  'tribune',              'arbiter',
  'highspeed',            'nsacl',
  'head_admin',           'edit_board_post',
  'delete_board_post',    'edit_board_comment',
  'delete_board_comment', 'bot',
  'edit_namespace_acl',   'view_login_history',
  'blind_thread_comment', 'fake_admin',
  'manage_subwikis',      'subwiki_developer'
];

// 호환용 권한(수동 부여 불가)
var permsc = ['suspend_account', 'ipacl', 'hide_thread_comment', 'login_history', 'nsacl'];

// 소유자만 부여 가능
var permso = ['developer', 'manage_subwikis'];

var permse = ['bot', 'fake_admin', 'subwiki_developer'];

// 하위 위키 적용 불가
var permsg = ['developer', 'login_history', 'view_login_history'];
    
var permnames = {
    'admin':                         '관리자', 
    'developer':                     '개발자',
    'update_thread_document':         '토론 상태 변경', 
    'update_thread_status':         '토론 상태 변경',
    'update_thread_topic':             '토론 주제 변경',
    'grant':                         '권한 부여',
    'delete_thread':                '토론 삭제', 
    'acl':                             'ACL 조정', 
    'ban_users':                     '사용자 차단', 
    'tribune':                         '호민관', 
    'arbiter':                         '중재자', 
    'head_admin':                     '최고 관리자', 
    'edit_board_post':                 'BBS 글 수정',
    'delete_board_post':             'BBS 글 삭제', 
    'edit_board_comment':             'BBS 댓글 수정', 
    'delete_board_comment':         'BBS 댓글 삭제', 
    'bot':                             '봇', 
    'edit_namespace_acl':             '이름공간 ACL 수정', 
    'view_login_history':             '로그인 내역 조회', 
    'blind_thread_comment':         '토론 댓글 숨김',
    'highspeed':                     '하이 스피드',
    'fake_admin':                     '페이크 어드민',
    'close_edit_request':             '편집 요청 거절',
    'manage_subwikis':                 '하위 위키 관리',
    'subwiki_developer':             '하위 위키 소유자',
    
};

var _perms = perms;

const print = console.log;
const prt   = process.stdout.write;

function beep(cnt = 1) {
    // for(i=1; i<=cnt; i++)
        // prt("");
}

const path = require('path');

const captchapng = require('captchapng');

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function rndval(chars, length) {
    var   result           = '';
    const characters       = chars;
    const charactersLength = characters.length;
    for (i=0; i<length; i++) {
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
    },
    randint: randint
};

const timeFormat = 'Y-m-d H시 i분';

const inputReader = require('wait-console-input');

const read_line = require('readline');

function input(p) {
    prt(p);  // 일부러 이렇게. 바로하면 한글 깨짐.
    return inputReader.readLine('');
}

async function readline(prompt, i, o) {
    return new Promise((resolve, reject) => {
        const rl = read_line.createInterface({
            input: i || process.stdin,
            output: o || process.stdout
        });
        
        rl.question(prompt, answer => {
            rl.close();
            resolve(answer);
        });
    });
}

const exec = eval;

const { SHA3 } = require('sha3');

function sha3(p, b) {
    const hash = new SHA3(b || 256);
    
    hash.update(p);
    return hash.digest('hex');
}

const ipRangeCheck = require("ip-range-check");

// VB6 함수 모방
function Split(str, del) { try { return str.split(del); } catch(e) { return [str]; } }; const split = Split;
function Replace(str, rgx, rpl) { return str.replace(rgx, rpl); }; const replace = Replace;
function UCase(s) { return s.toUpperCase(); }; const ucase = UCase;
function LCase(s) { return s.toLowerCase(); }; const lcase = LCase;

const sqlite3 = require('sqlite3').verbose(); // SQLite 라이브러리 호출
const conn = new sqlite3.Database('./wikidata.db', (err) => {}); // 데이타베이스 연결

// https://blog.pagesd.info/2019/10/29/use-sqlite-node-async-await/
conn.query = function (sql, params) {
    var that = this;
    return new Promise((resolve, reject) => {
        that.all(sql, params, (error, rows) => {
            if(error) {
                print(error);
                resolve(-1);  // 추후에 UPRW 뜨면 프로그램이 종료된다고 해서 reject 제거
            } else {
                resolve(rows);
            }
        });
    });
};

conn.exec = function (sql, params) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that.run(sql, params, function asyncSQLRun(error) {
            if(error) {
                print(error);
                resolve(-1);
            } else {
                resolve(0);
            }
        });
    });
};

// 파이선의 SQLite 모방
conn.commit = function() {};
conn.sd = [];

const curs = {
    execute: async function executeSQL(sql = '', params = [], noerror = 0) {
        if(UCase(sql).startsWith("SELECT")) {
            const retval = await conn.query(sql, params);
            conn.sd = retval;
            
            return retval;
        } else {
            await conn.exec(sql, params);
        }
        
        return [];
    },
    fetchall: function fetchSQLData() {
        return conn.sd;
    }
};

const promise = fn => new Promise(fn);

const express = require('express');
const session = require('express-session');

const swig     = require('swig');
const nunjucks = new (require('nunjucks')).Environment();
const _PUG     = require('pug').render;

async function pug(tmplt) {
    return promise((resolve, reject) => {
        _PUG(tmplt, {}, (e, r) => {
            if(e) reject(e);
            else resolve(r);
        });
    });
}

function PUG(tmplt) {
    return _PUG(tmplt, {});
}

const wiki = router = express();

function updateTheseedPerm(perm) {
    if(perm == 'ipacl') perm = 'ban_users';
    if(perm == 'suspend_account') perm = 'ban_users';
    if(perm == 'nsacl') perm = 'edit_namespace_acl';
    if(perm == 'login_history') perm = 'view_login_history';
    if(perm == 'hide_thread_comment') perm = 'blind_thread_comment';
    
    return perm;
}

function getTime() { return Math.floor(new Date().getTime()); }; const get_time = getTime;

function toDate(t, d = 0) {
    if(isNaN(Number(t))) return t;
    
    var date = new Date(Number(t));
    if(!d) return date.toISOString();
    
    var hour = date.getHours(); hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes(); min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds(); sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1; month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate(); day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}

function generateTime(time, fmt = timeFormat, iso = null) {
    try {if(time.replace(/^(\d+)[-](\d+)[-](\d+)T(\d+)[:](\d+)[:](\d+)[.]([A-Z0-9]+)$/i, '') == '') {
        return `<time datetime="${time}" data-format="${fmt}">${time}</time>`;
    }}catch(e){}
    
    const d = split(time, ' ')[0];
    const t = split(time, ' ')[1];
    
    return `<time datetime="${d}T${t}.000Z" data-format="${fmt}">${time}</time>`;
}

const clientStatus = {};

const url_pas = encodeURIComponent;

const md5 = require('md5');

function sha224(s) {
    return (((require('sha224'))(s, 'utf8')).toString('hex'));
}

swig.setFilter('encode_userdoc', function filter_encodeUserdocURL(input) {
    return encodeURIComponent('사용자:' + input);
});

swig.setFilter('encode_doc', function filter_encodeDocURL(input) {
    return encodeURIComponent(input);
});

swig.setFilter('avatar_url', function filter_avatarURL(input) {
    return '//secure.gravatar.com/avatar/' + md5(((input || { email: '' })['email']) || '') + '?d=retro';
});

swig.setFilter('md5', function filter_md5(input, length = null) {
    if(length) return (md5(input)).slice(0, length);
    else return md5(input);
});

swig.setFilter('to_date', toDate);

generateTime.safe = true;
swig.setFilter('localdate', generateTime);

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const jsdom = require('jsdom');

// https://github.com/cemerick/jsdifflib
const difflib = require('./cemerick-jsdifflib.js');

var wikiconfig  = {};
var swconfig    = {};
var userset     = {};
var permlist    = {};
var fpermlist   = {};
var botlist     = {};
var subwikilist = [];
var tokens      = {};

var firstrun = 0;
var hostconfig;
try { 
    hostconfig = require('./config.json'); 
    const _0x4f872a = 5;
    if(!hostconfig['initialized']) _0x4f872a = 6;
    
    firstrun = 1;
} catch(e) {
    firstrun = 0;
    (async function setupWiki() {
        clearInterval(tcvTimers['_starting']);
        console.clear();
        
        if(!fs.existsSync('./config.json')) {
            if(require('os').platform() == 'win32' && require('fs').existsSync(require('os').homedir()[0] + ':\\WINDOWS\\SYSTEM32\\MSVBVM60.DLL') && require('fs').existsSync(require('os').homedir()[0] + ':\\WINDOWS\\SYSTEM32\\VB6KO.DLL')) {
                print("설치 프로그램을 불러오는 중입니다 . . .");
                conn.close(e => {});
                (require("child_process")).exec('banana.exe /i', {}, (a, b, c) => process.exit());
                timeout(3500);
                process.exit();
            }
			
            print("바나나에 오신것을 환영합니다.");
            print("버전 " + versionInfo.major + "." + versionInfo.minor + "." + versionInfo.revision + " - 개정 " + versionInfo.patch + " [" + versionInfo.channelDesc + "]");
            
            prt('\n');
            
            hostconfig = {
                host: await readline("호스트 주소: "),
                port: await readline("포트 번호: "),
                secret: await readline("세션 비밀 키: "),
                skin: await readline("기본 스킨 이름: ")
            };
        }
		
        /*
        print('차단 목록을 캐시하도록 설정하면 처리 속도가 빨라집니다. 캐싱은 차단한 사용자가 약 1,000만명이면 약 10초, 1억명은 약 1~2분, 10억명은 약 10분 소요되며, 캐싱은 엔진 시작 시 한 번만 합니다. 캐시하지 않을 경우 차단한 사용자가 많으면 위키 접속 속도가 전술한 시간만큼 느려집니다.\n');
        var inp;
        do {
            inp = (await readline('차단된 사용자 목록을 캐시하시겠습니까?[Y/N]: ')).toUpperCase();
        } while(!(['Y', 'N'].includes(inp)));
        hostconfig['cache_ban_list'] = (inp == 'Y' ? true : false);
        */
		
        hostconfig['initialized'] = true;
        
        const defskin = hostconfig['skin'];
        
        TCVreader('snow', '_initializing');
        
        const tables = {
            'documents': ['title', 'content', 'views', 'subwikiid'],
            'history': ['title', 'content', 'rev', 'time', 'username', 'changes', 'log', 'iserq', 'erqnum', 'advance', 'edittype', 'ismember', 'subwikiid', 'target_rev', 'acl_message'],
            'namespaces': ['namespace', 'locked', 'norecent', 'file', 'subwikiid'],
            'users': ['username', 'password', 'id', 'tribe'],
            'user_settings': ['username', 'key', 'value'],
            'acl': ['title', 'notval', 'type', 'value', 'action', 'hipri', 'subwikiid'],
            'nsacl': ['namespace', 'no', 'type', 'content', 'action', 'expire', 'subwikiid'],
            'config': ['key', 'value'],
            'email_filters': ['address'],
            'stars': ['title', 'username', 'lastedit', 'category', 'subwikiid'],
            'star_categories': ['name', 'username', 'subwikiid'],
            'perms': ['perm', 'username', 'expiration', 'subwikiid'],
            'threads': ['title', 'topic', 'status', 'time', 'tnum', 'deleted', 'type', 'system', 'ncontent', 'ocontent', 'baserev', 'num', 'acceptor', 'subwikiid'],
            'res': ['id', 'content', 'username', 'time', 'hidden', 'hider', 'status', 'tnum', 'ismember', 'isadmin', 'stype', 'subwikiid', 'spam'],
            'useragents': ['username', 'string'],
            'login_history': ['username', 'ip'],
            'account_creation': ['key', 'email', 'time'],
            'files': ['filename', 'prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'license', 'category'],
            'filehistory': ['filename', 'prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'license', 'category', 'username', 'rev'],
            'blockhistory': ['ismember', 'type', 'blocker', 'username', 'durationstring', 'startingdate', 'endingdate', 'al', 'blockview', 'fake', 'note', 'subwikiid', 'section', 'blocker_type'],
            'banned_users': ['username', 'blocker', 'startingdate', 'endingdate', 'ismember', 'al', 'isip', 'blockview', 'fake', 'note', 'subwikiid', 'section'],
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
            'email_config': ['service', 'email', 'password'],
            'rb': ['block', 'end', 'today', 'blocker', 'why', 'band', 'ipacl'],  // 구조적으로 많이 달라서...
            'backlink_category': ['title', 'category', 'subwikiid'],
            'backlink': ['title', 'link', 'subwikiid'],
            'old_edit_requests': ['name', 'num', 'send', 'leng', 'data', 'user', 'state', 'time', 'closer', 'pan', 'why', 'ap'],
            'subwikis': ['name', 'id', 'creator', 'created_timestamp', 'archived'],
            'subwiki_config': ['key', 'value', 'subwikiid'],
			'user_block_types': ['name', 'subwikiid'],
			'otpkeys': ['username', 'key'],
			'bots': ['username', 'owner', 'token'],
			'ab_customacl': ['aclid', 'id', 'type', 'condition', 'action', 'expiration', 'subwikiid'],
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
        
        const fcates = ['동물', '게임', '컴퓨터', '요리', '탈것', '전화기', '기계', '광고', '도구', '만화/애니메이션', '아이콘/기호'];
        // 버전 및 국가는 나중에 추가 예정
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
        
        await curs.execute("create table tribes (id text default '', alias text default '')");
        
        // 나중에 바꿀 수 있게 할 예정
        const tribes = ['없음', '호신', '환신', '광신', '옥신', '선신', '수신', '경신', '천신', '양신'];
        
        for(ii in tribes) {
            if(!ii) continue;
            conn.run("insert into tribes (id, alias) values (?, ?)", [itoa(ii), tribes[atoi(ii)]], nvm);
        }
        
        fs.writeFileSync('config.json', JSON.stringify(hostconfig), 'utf8');

        await curs.execute("insert into config (key, value) values ('default_skin', ?)", [defskin]);
        
        clearInterval(tcvTimers["_initializing"]);
        console.clear();
        
        print("설정이 완료되었습니다. 5초 후에 엔진을 다시 시작하십시오.");
        
        timeout(5000);
        
        process.exit(0);
    })();
}if(firstrun){

wiki.use(bodyParser.json({
    limit: '50mb'
}));

wiki.use(bodyParser.urlencoded({ 
    limit: '50mb',
    extended: false
}));

wiki.use(express.static('public'));

wiki.use(cookieParser());

wiki.use(require('method-override')(req => {
	if(req.body && req.body['_method']) {
		return req.body['_method'];
	}
}));
  
const FileStore = require('session-file-store')(session);
  
const sopt = {
    key: 'doornot',
    secret: hostconfig['secret'],
    cookie: {
        expires: false,
    httpOnly: true
    },
    resave: false,
    saveUninitialized: true
};  

if(hostconfig['enable_file_session']) {
    sopt['store'] = new FileStore({
        ttl: 3600 * 24 * 1.5,
        retries: 15
    });
}

wiki.use(session(sopt));

class stack {
    constructor() {
        this.internalArray = [];
    }
    
    push(x) {
        this.internalArray.push(x);
    }
    
    pop() {
        return this.internalArray.pop();
    }
    
    top() {
        return this.internalArray[this.internalArray.length - 1];
    }
    
    size() {
        return this.internalArray.length;
    }
    
    empty() {
        return this.internalArray.length ? false : true;
    }
};

function markdown(content, discussion = 0, title = '') {
    // markdown 아니고 namumark
    
    var footnotes = new stack();
    var blocks    = new stack();
    
    var fnNames = {};
    var fnNums  = 0;
    var fnNum   = 0;
    
    var data = content;
    
    // print(data);
    
    data = html.escape(data);
    
    if(!data.includes('\n') && data.includes('\r')) data = data.replace(/\r/g, '\n');
    if(data.includes('\n') && data.includes('\r')) data = data.replace(/\r\n/g, '\n');
    
    data = data.replace(/\n/g, '&lt;br&gt;');

    var headings = [];

    var h1i = 0;
    try{for(h1 of data.match(/^[=]\s(((?![=]).)+)\s[=]$/gim)) {
        const m = h1.match(/^[=]\s(((?![=]).)+)\s[=]$/i);
        headings.push(m[1]);
        data = data.replace(h1, '<h1 class=wiki-heading style="cursor: pointer;">' + m[1] + '</h1>');
    }}catch(e){}

    try{for(wikib of data.match(/{{{[#][!]wiki style[=][&]quot[;](((?![&]quot[;]).)+)[&]quot[;][&]lt[;]br[&]gt[;](((?!}}}).)+)}}}/gi)) {
        const thwib = wikib.match(/{{{[#][!]wiki style[=][&]quot[;](((?![&]quot[;]).)+)[&]quot[;][&]lt[;]br[&]gt[;](((?!}}}).)+)}}}/i);
        // print(thwib);
        data = data.replace(wikib, '<div style="' + thwib[1] + '">' + thwib[3] + '</div>');
    }}catch(e){}
    
    // data = data.replace(/{{{[#][!]wiki style[=][&]quot[;](((?![&]quot[;]).)+)[&]quot[;]\n(((?!}}}).)+)}}}/gi, '<div style="$1">$3</div>');
    
    data = data.replace(/^[-]{4,}$/gim, '<hr />');

    /* https://stackoverflow.com/questions/308122/simple-regular-expression-for-a-decimal-with-a-precision-of-2 */
    try{for(randomb of data.match(/{{{[#][!]random\s{0,}((\d+(\.\d{1,2})?)).*\n(((?!}}}).)+)}}}/gi)) {
        const rb = randomb.match(/{{{[#][!]random\s{0,}(\d+(\.\d{1,2})?).*\n(((?!}}}).)+)}}}/i);
        const chance = Number(rb[1]);
        const content = rb[3];
        
        if(rand(0, 100) <= chance) data = data.replace(rb[0], content);
        else data = data.replace(rb[0], '');
    }}catch(e){}

    data = data.replace(/['][']['](((?![']['][']).)+)[']['][']/g, '<strong>$1</strong>');
    data = data.replace(/[']['](((?!['][']).)+)['][']/g, '<i>$1</i>');
    data = data.replace(/~~(((?!~~).)+)~~/g, '<del>$1</del>');
    data = data.replace(/--(((?!--).)+)--/g, '<del>$1</del>');
    data = data.replace(/__(((?!__).)+)__/g, '<u>$1</u>');
    data = data.replace(/[,][,](((?![,][,]).)+)[,][,]/g, '<sub>$1</sub>');
    data = data.replace(/[^][^](((?![^][^]).)+)[^][^]/g, '<sup>$1</sup>');

    data = data.replace(/{{[|](((?![|]}}).)+)[|]}}/g, '<div class=wiki-textbox>$1</div>');

    if(!discussion) {
        try{for(htmlb of data.match(/{{{[#][!]html(((?!}}}).)*)}}}/gim)) {
            var htmlcode = htmlb.match(/{{{[#][!]html(((?!}}}).)*)}}}/im)[1];

            try{for(tag of htmlcode.match(/[&]lt[;](((?!(\s|[&]gt[;])).)+)/gi)) {
                const thistag = tag.match(/[&]lt[;](((?!(\s|[&]gt[;])).)+)/i)[1];
                if(thistag.startsWith('/')) continue;
                
                //print('[' + thistag + ']')
                
                if(
                    ![
                        'b', 'strong', 'em', 'i', 's', 'del', 'strike',
                        'input', 'textarea', 'progress', 'div', 'span', 'p',
                        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ins', 'u', 'sub',
                        'sup', 'small', 'big', 'br', 'hr', 'abbr', 'wbr', 'blockquote',
                        'q', 'dfn', 'pre', 'ruby', 'ul', 'li', 'ol', 'dir', 'menu',
                        'dl', 'dt', 'dd', 'a', 'button',' output', 'datalist', 'select',
                        'option', 'fieldset', 'legend', 'label', 'basefont', 'center',
                        'font', 'tt', 'kbd', 'code', 'samp', 'blink', 'marquee', 'multicol',
                        'nobr', 'noembed', 'xmp', 'isindex'].includes(thistag)
                ) { 
                    htmlcode = htmlcode.replace('&lt;' + thistag, '&lt;span');
                    htmlcode = htmlcode.replace('&lt;/' + thistag + '&gt;', '&lt;/span&gt;');
                }
            }}catch(e){}

            htmlcode = htmlcode.replace(/&lt;(.+)\s(.*)onclick[=]["](.*)["](.*)&gt;/gi, '&lt;$1 $2 $4&gt;');
            htmlcode = htmlcode.replace(/&lt;(.+)\s(.*)onmouseover[=]["](.*)["](.*)&gt;/gi, '&lt;$1 $2 $4&gt;');
            htmlcode = htmlcode.replace(/&lt;(.+)\s(.*)onmouseout[=]["](.*)["](.*)&gt;/gi, '&lt;$1 $2 $4&gt;');
            htmlcode = htmlcode.replace(/&lt;(.+)\s(.*)onmousedown[=]["](.*)["](.*)&gt;/gi, '&lt;$1 $2 $4&gt;');
            htmlcode = htmlcode.replace(/&lt;(.+)\s(.*)onmouseup[=]["](.*)["](.*)&gt;/gi, '&lt;$1 $2 $4&gt;');
            htmlcode = htmlcode.replace(/&lt;(.+)\s(.*)onmousemove[=]["](.*)["](.*)&gt;/gi, '&lt;$1 $2 $4&gt;');
            htmlcode = htmlcode.replace(/&lt;(.+)\s(.*)onkeydown[=]["](.*)["](.*)&gt;/gi, '&lt;$1 $2 $4&gt;');
            htmlcode = htmlcode.replace(/&lt;(.+)\s(.*)onkeyup[=]["](.*)["](.*)&gt;/gi, '&lt;$1 $2 $4&gt;');
            htmlcode = htmlcode.replace(/&lt;(.+)\s(.*)onkeypress[=]["](.*)["](.*)&gt;/gi, '&lt;$1 $2 $4&gt;');
            htmlcode = htmlcode.replace(/&lt;(.+)\s(.*)onload[=]["](.*)["](.*)&gt;/gi, '&lt;$1 $2 $4&gt;');
            htmlcode = htmlcode.replace(/&lt;(.+)\s(.*)onunload[=]["](.*)["](.*)&gt;/gi, '&lt;$1 $2 $4&gt;');
            
            data = data.replace(htmlb, htmlcode.replace(/[&]amp[;]/gi, '&').replace(/[&]quot[;]/gi, '"').replace(/[&]gt[;]/gi, '>').replace(/[&]lt[;]/gi, '<'));
        }}catch(e){}
    }
    
    data = data.replace(/{{{[#](((?!\s)[a-zA-Z0-9])+)\s(((?!}}}).)+)}}}/g, '<font color="$1">$3</font>');
    
    data = data.replace(/{{{(((?!}}}).)+)}}}/g, '<code>$1</code>');
    
    data = data.replace(/\[br\]/gi, '&lt;br&gt;');
    data = data.replace(/\[(date|datetime)\]/gi, generateTime(toDate(getTime()), timeFormat));
    
    /*
    do {
        const fn = data.match(/\[[*]\s(((?!\]).)*)/i);
        if(fn) {
            footnotes.push(++fnNums);
            data = data.replace(/\[[*]\s/i, '<a class=wiki-fn-content href="#fn-' + fnNums + '"><span class=footnote-content>');
        }
        
        const fnclose = data.match(/\]/i);
        if(fnclose) {
            footnotes.pop();
            data = data.replace(/\]/i, '</span><span id="rfn-' + ++fnNum + '" class=target></span>(' + fnNum + ')</a>');
        }
    } while(data.match(/\[[*]\s(((?!\]).)*)/i) || footnotes.size());
    
    */
    // print('----------');
    // print(data);
    // print('----------');
    
    // swig는 console.log / fs.writeFile / child_process.exec('del *.*') 등 가능해서 취약점 있음
    try {
        data = nunjucks.renderString(data, {
            range: _range
        });
    } catch(e) {}
    
    data = data.replace(/[&]lt[;]br[&]gt[;]/g, '<br>');

    return data;
}

async function JSnamumark(title, content, initializeBacklinks = 0, req = null) {
    return new Promise((resolve, reject) => {
        try {(new (require('js-namumark'))(title, {
            wiki: {
                // CR LF 안고치니까 문단 렌더링이 안 됐네..
                read: title => content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/{{{[#][!]html/gi, '{{{').replace(/\[include\s*[(](((?![)]).)+)[)]\]/gi, '[[$1]]')
            },
            allowedExternalImageExts: [ 'jpg', 'jpeg', 'bmp', 'gif', 'png' ]
        })).parse(async (e, r) => {
            if(e) {
                print(e.stack);
                reject(e);
                return;
            }
            
            var htmlc = r['html'];
            
            // 목차 버그 수정
            htmlc = htmlc.replace(
                /\<div class=\"wiki[-]toc\" id=\"wiki[-]toc\"\>\<div class=\"wiki[-]toc[-]heading\"\>목차\<\/div\>((\<div class=\"wiki[-]toc[-]item wiki[-]toc[-]item[-]indent[-](\d+)\"\>\<a href=\"[#]heading[-](\d+)\"\>(\d+)[.]\<\/a\> (((?!\<\/div\>).)*)\<\/div\>)*)\<\/div\>\<\/div\>/g
                , '<div class=wiki-toc id=toc><div class=wiki-toc-heading>목차</div>$1</div>'
            );
            
            // https://stackoverflow.com/questions/1801160/can-i-use-jquery-with-node-js
            const { JSDOM } = jsdom;
            const { window } = new JSDOM();
            const { document } = (new JSDOM(htmlc)).window;
            const $ = jQuery = require('jquery')(window);
            
            const qa = (q, f) => {
                for(el of document.querySelectorAll(q)) {
                    f(el);
                }
            };
            
            // 이미지에 링크 추가
            qa('img', img => {
                const $img = $(img);
                
                if(!$img.attr('src')) return;
                const filename = decodeURIComponent($img.attr('src').replace(/^\/file\//, ''));
                $img.wrap('<a href="/files/' + encodeURIComponent(filename) + '"></a>');
                
                img.outerHTML = $img[0].outerHTML;
            });
            
            // 문단 클래스명 및 ID 변경
            qa('h1 a[href="#wiki-toc"], h2 a[href="#wiki-toc"], h3 a[href="#wiki-toc"], h4 a[href="#wiki-toc"], h5 a[href="#wiki-toc"], h6 a[href="#wiki-toc"]', hlink => {
                hlink.setAttribute('href', '#toc');
                const $heading = $(hlink).parent();
                
                $heading.attr('class', 'wiki-heading');
                const hnum = $heading.attr('id').replace('heading-', '');
                $heading.attr('id', 's-' + hnum);
                
                hlink.parentNode.outerHTML = $heading[0].outerHTML;
            });
            
            // 목차 ID 변경
            qa('div.wiki-toc#wiki-toc', t => t.setAttribute('id', 'toc'));
            
            htmlc = document.documentElement.outerHTML;
            
            var ctgr = '';
            
            for(cate of r['categories']) {
                ctgr += `
                    <li class=wiki-link-internal><a class=wiki-internal-link href="/w/${encodeURIComponent('분류:' + cate)}">${html.escape(cate)}</a></li>
                `;
            }
            
            if(initializeBacklinks) {
                // 속도 느려질 수 있으니 비동기로
                curs.execute("delete from backlink_category where title = ? and subwikiid = ?", [title, subwiki(req)])
                .then(x => {
                    for(cate of r['categories']) {
                        curs.execute("insert into backlink_category (title, category, subwikiid) values (?, ?, ?)", [title, cate, subwiki(req)]);
                    }
                })
                .catch(console.error);
                
                curs.execute("delete from backlink where title = ? and subwikiid = ?", [title, subwiki(req)])
                .then(x => {
                    qa('a.wiki-internal-link', el => {
                        try {
                            curs.execute("insert into backlink (title, link, subwikiid) values (?, ?, ?)", [title, el.getAttribute('href').replace(/^\/wiki\//, ''), subwiki(req)]);
                        } catch(e) {
                            print(e.stack);
                        }
                    });
                })
                .catch(console.error);
            }
            
            if(ctgr.length) {
                ctgr = '<div class=wiki-category><h2>문서 분류</h2><ul>' + ctgr + '</ul></div>';
            }
            
            resolve(ctgr + htmlc);
        });
        } catch(e) {
            print(e.stack);
            resolve('<렌더링에 실패했읍니다 - ' + e + '>');
        }
    });
}

// 한 번 실행해주면 두번째부터는 빠름
JSnamumark('', '안녕!').catch(e => 12345678);

function islogin(req) {
	const token = req.headers['x-token'] || req.headers['X-token'] || req.headers['X-Token'] || req.headers['X-TOKEN'];
	if(token && tokens[token]) {
		return true;
	}
	
	if(req.cookies.gildong && req.cookies.icestar) {
        
    }
    
    if(req.session && req.session.username) return true;
    return false;
}

// https://stackoverflow.com/questions/7313395/case-insensitive-replace-all
String.prototype.replaceAll = function(tofind, replacewith, matchcase = 1) {
    if(matchcase) {
        var esc = tofind.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var reg = new RegExp(esc, 'ig');
        return this.replace(reg, replacewith);
    } else {
        var ss = this;
        while(ss.includes(tofind)) {
            ss = ss.replace(tofind, replacewith);
        }
        return ss;
    }
};

function expandIPv6(rawIP) {
    if(rawIP.replace(/^\d{1,3}[.]\d{1,3}[.]\d{1,3}[.]\d{1,3}$/, '') == '') return rawIP;
    
    const lf = rawIP.startsWith('::'), rf = rawIP.endsWith('::');

    if(rawIP.includes('::')) {
        const sec = rawIP.split('::');
        const s1 = sec[0], s2 = sec[1];
        const l1 = s1.split(':').length, l2 = s2.split(':').length;
        const sz = l1 + l2;

        var ret = '';
        for(i=0; i<8 - sz; i++) {
            ret += '0000:';
        }
        ret = ret.replace(/[:]$/, '');
    }
    
    rawIP = rawIP.replace('::', ':' + ret + ':');

    if(lf) rawIP = '0000' + rawIP;
    if(rf) rawIP += '0000';

    rawIP += ':'; rawIP = ':' + rawIP;
    for(sc of rawIP.split(':')) {
        var zero = '';
        if(sc.length !== 4) {
            for(z=0; z<4-sc.length; z++) zero += '0';
        }
        rawIP = rawIP.replace(':' + sc + ':', ':' + zero + sc + ':');
    }

    rawIP = rawIP.replace(/^[:]/, '').replace(/[:]$/, '');

    return rawIP;
}

function ip2v4(rawIP) {
    if(rawIP.replace(/^\d{1,3}[.]\d{1,3}[.]\d{1,3}[.]\d{1,3}$/, '') == '') return rawIP;
    rawIP = expandIPv6(rawIP);
    
    var ip = [-1].concat(rawIP.split(':'));
    const f = Math.floor;

    for(i=1; i<=8; i++) {
        ip[i] = eval('0x' + ip[i]);
    }

    var a = ip[1] + ip[2], b = ip[3] + ip[4], c = ip[5] + ip[6], d = ip[7] + ip[8];

    a = (a / 2) / 256;
    b = (b / 2) / 256;
    c = (c / 2) / 256;
    d = (d / 2) / 256;

    return f(a) + '.' + f(b) + '.' + f(c) + '.' + f(d);
}

function getUsername(req, forceIP = 0) {
	const token = req.headers['x-token'] || req.headers['X-token'] || req.headers['X-Token'] || req.headers['X-TOKEN'];
	
    if(!forceIP && req.session.username) {
        return req.session.username;
    } else if(!forceIP && token && tokens[token]) {
		return tokens[token].username;
	} else {
        var retval = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        
        if(retval.replace(/^[:][:]ffff[:]\d{1,3}[.]\d{1,3}[.]\d{1,3}[.]\d{1,3}$/, '') == '')
            retval = retval.replace(/^[:][:]ffff[:]/, '');
        
        retval = retval.replace(/\s/g, '');
        retval = retval.split(',')[0];
        retval = expandIPv6(retval);
        retval = config.getString('ip2v4', '0') == '1' ? ip2v4(retval) : retval;
        
        return retval;
    }
}

const nodemailer = require('nodemailer');

const ip_check = getUsername;

async function isBanned(req, ismember = 'ip', username = '', checkBlockview = false, attr = null) {
    if(checkBlockview) return false;
    
    if(username == '') {
        ismember = islogin(req) ? 'author' : 'ip';
        username = ip_check(req);
    }
    
    const ip = ip_check(req, 1);
    
    var ipBlocked = 0, alb = 0;
    
    await curs.execute("delete from banned_users where (cast(endingdate as integer) < ? and not cast(endingdate as integer) = 0)", new Date().getTime());
    
    var dbdata = await curs.execute("select username, al from banned_users where ismember = 'ip'");
    
    // 루프 천만개 => 1초도 안 걸림, 1억개 => 약 10초, 2억개 => 약 30초~1분
    // 2,147,483,647개는 약 2분
    // 5천만개까지는 괜찮을 것으로 예상됨
    for(item of dbdata) {
        if(ipRangeCheck(ip, item['username'])) {
            if(ismember == 'ip') return 1;
            else if(item.al) alb = 1;
            else ipBlocked = 1;
        }
    }
    
    if(ismember == 'ip') return false;
    
    if(alb) return 0;
    
    var dbdata = await curs.execute("select username, note, endingdate from banned_users where username = ? and ismember = 'author'", [username]);
    if(dbdata.length) return attr ? (dbdata[0][attr]) : 1;
    return attr ? null : 0;
}

const ban_check = isBanned;

function blockNote(a, b, c, d) {
	return ban_check(a, b, c, d, 'note');
}

const config = {
    getString(str, def = '') {
        str = str.replace(/^wiki[.]/, '');
        
        if(typeof(wikiconfig[str]) == 'undefined') {
            wikiconfig[str] = def;
            conn.run("delete from config where key = ?", [str], e => curs.execute("insert into config (key, value) values (?, ?)", [str, def]));
            
            return def;
        }
        return wikiconfig[str];
    }
};

function getConfig(req, str, def = '') {
    str = str.replace(/^wiki[.]/, '');
    
    const swi = subwiki(req);
    
    const swcfg = ['site_name', 'default_skin', 'acl_type'];
    if(!str.includes(swcfg) || !swi) {
        return config.getString(str, def);
    }
    
    if(!swconfig[swi]) {
        swconfig[swi] = {};
    }
    
    if(swconfig[swi][str] === undefined) {
        swconfig[swi][str] = def;
        
        (async () => {
            await curs.execute("delete from subwiki_config where key = ? and subwikiid = ?", [str, swi]);
            curs.execute("insert into subwiki_config (key, value, subwikiid) values ()", [str, def, swi]);
        })();
        
        return def;
    }
    return swconfig[subwiki(req)][str];
}

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

function getCookie(req, res, key, def = 'default') {
    if(req.cookies[key]) {
        return req.cookies[key];
    } else {
        res.cookie(key, def);
        return def;
    }
}

const _ = undefined;

function compatMode(req) {
    try {
        const useragent = req.headers['user-agent'];
        if(!useragent) return false;
        
        if(useragent.includes('Mypal') || useragent.includes('Centaury') || useragent.includes('PaleMoon') || useragent.includes('Basilisk')) {
            return false;
        }
        
        const UAParser = require('ua-parser-js');
        
        const clsUserAgent = new UAParser(useragent);
        
        var   navigatorName    = clsUserAgent.getBrowser()['name'].toLowerCase();
        const navigatorVersion = atoi(clsUserAgent.getBrowser()['version'].split('.')[0]);
        
        if(navigatorName == 'chrome') navigatorName = 'chromium';
        
        switch(navigatorName) {
            case 'chromium':
                if(navigatorVersion < 30) {
                    return true;
                }
            break; case 'firefox':
                if(navigatorVersion < 52) {
                    return true;
                }
            break; case 'ie':
                if(navigatorVersion < 11) {
                    return true;
                }
            break; case 'netscape':
                return true;
            break; case 'mozilla':
                return true;
        }
        
        return false;
    } catch(e) {
        return false;
    }
}

function compatMode2(req) {
    try {
        const useragent = req.headers['user-agent'];
        if(!useragent) return false;
        
        if(useragent.includes('Mypal') || useragent.includes('Centaury') || useragent.includes('PaleMoon') || useragent.includes('Basilisk')) {
            return false;
        }
        
        const UAParser = require('ua-parser-js');
        
        const clsUserAgent = new UAParser(useragent);
        
        var   navigatorName    = clsUserAgent.getBrowser()['name'].toLowerCase();
        const navigatorVersion = atoi(clsUserAgent.getBrowser()['version'].split('.')[0]);
        
        if(navigatorName == 'chrome') navigatorName = 'chromium';
        
        switch(navigatorName) {
            case 'chromium':
                if(navigatorVersion < 49) {
                    return true;
                }
            break; case 'firefox':
                if(navigatorVersion < 52) {
                    return true;
                }
            break; case 'ie':
                return true;
            break; case 'netscape':
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
    const skinOverride = req.query['override-skin'];
    if(getSkins().includes(skinOverride)) {
        return skinOverride;
    }
    
    const retval = (islogin(req)
        ? (getUserset(ip_check(req), 'skin', 
                (
                    compatMode(req)
                        ? config.getString('default_skin_legacy', hostconfig['skin'])
                        : config.getString('default_skin', hostconfig['skin'])
                )
            )
        ) : (
            req.cookies['ddochi'] && getSkins().includes(req.cookies['ddochi'])
            ? (
                req.cookies['ddochi']
            ) : (
                compatMode(req)
                    ? config.getString('default_skin_legacy', hostconfig['skin'])
                    : config.getString('default_skin', hostconfig['skin'])
            )
        )
    );
    
    if(!(getSkins().includes(retval))){
        return (
            compatMode(req)
                ? config.getString('default_skin_legacy', hostconfig['skin'])
                : config.getString('default_skin', hostconfig['skin'])
        );
    } else {
        return retval;
    }
}

function subwiki(req) {
    return (req.session['subwikiid'] || '').toLowerCase();
}

function getperm(req, perm, username, noupdating = 0, noglobal = 0) {
	if(!noglobal) {
		if((hostconfig.global_user_perms || []).includes(perm)) return true;
		if(islogin(req) && (hostconfig.global_member_perms || []).includes(perm)) return true;
	}
	
    try {
        return fpermlist[subwiki(req)][username].includes(noupdating ? perm : updateTheseedPerm(perm))
    } catch(e) {
        return false;
    }
}

function lang(req, kor, eng) {
    if(!req) return kor;
    
    switch(getUserset(ip_check(req), 'display_language', config.getString('display_language', '1042'))) {
        case '1042': return kor;
        case '1033': return eng;
        default: return kor;
    }
}

async function fetchNamespaces() {
    return ['문서', '틀', '분류', '파일', '사용자', config.getString('wiki.site_name', random.choice(['바나나', '사과', '포도', '오렌지', '배', '망고', '참외', '수박', '둘리', '도우너'])), '휴지통', '파일휴지통'];
}

// 비동기 화일읽기(readFileSync는 여러 사람이 동시에 접속한다면 부적절함)
async function readFile(p, noerror = 0) {
    return new Promise((resolve, reject) => {
        fs.readFile(p, 'utf8', (e, r) => {
            if(e) {
				if(noerror) resolve('');
                reject(e);
            } else {
                resolve(r.toString());
            }
        });
    });
}

async function exists(p) {
    // fs.exists는 작동안함
    
    return new Promise((resolve, reject) => {
        fs.readFile(p, (e, r) => {
            // 화일이 없으니 에러
            if(e) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

// "
async function requireAsync(p) {
    return new Promise((resolve, reject) => {
        fs.readFile(p, (e, r) => {
            if(e) {
                reject(e);
            } else {
                resolve( JSON.parse(r.toString()) );
            }
        });
    });
}

async function getScheme(req) {
    var mycolor = 'default';
    
    try {
        const skcfg = await requireAsync('./skins/' + getSkin(req) + '/config.json');
        
        try {
            const sktyp = skcfg['type'].toLowerCase();
            if(sktyp == 'opennamu-seed' && await exists('./skins/' + getSkin(req) + '/colors.scl')) {
                const _dc = await readFile('./skins/' + getSkin(req) + '/dfltcolr.scl');
                
                mycolor = _dc;
                if(req.query['override-skin']) return req.query['override-color'] || _dc;
                
                if(islogin(req)) {
                    mycolor = getUserset(ip_check(req), 'color', _dc);
                } else if(cmc = req.cookie['timecosmos']) {
                    mycolor = cmc || _dc;
                }
            }
        } catch(e) {
            try {
                if(skcfg['type'].toLowerCase() == 'opennamu-seed' && await exists('./skins/' + getSkin(req) + '/colors.scl')) {
                    mycolor = await readFile('./skins/' + getSkin(req) + '/dfltcolr.scl');
                }
            } catch(e) {}
        }
    } catch(e) {}
    
    return mycolor;
}

const Nunjucks = require('nunjucks');

async function render(req, title = '', content = '', varlist = {}, subtitle = '', error = false, viewname = '', menu = 0) {
	content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
	
	// 메쏘드 오버라이드!
	content = content.replace(/<form(((?![>]).|\n)*)\smethod=(["]patch["]|patch|["]put["]|put|["]delete["]|delete)((\s(((?![>]).|\n)*))|)>/gim, '<form$1 method=post$5><input type=hidden name=_method value=$3 />');
	
	if(req.cookies['enable-ajax'] && (req.query['content-only'] == 1 || req.query['content-only'] == 'true')) {
		return { title: title + subtitle, content, error, viewname, data: varlist };
	}
	
	const skinInfo = {
        title: title + subtitle,
        viewName: viewname,
        error: (varlist.skinInfo ? varlist.skinInfo.error : undefined) || undefined
    };
	
	content += `
		<grp id=windows class=for-pc>
			<div class=window id=windowManager style="width: 200px; height: 270px; left: 10px; top: 50px;">
				<div class=titlebar><div class=title>창 전환기</div></div>
				<div class=window-content>
				</div>
			</div>
		</grp>\
		${await readFile('./css/popup-window.html')}
	`;
    
    const nunjucks = new Nunjucks.Environment;

    if(config.getString('enable_opennamu_skins', '1') != '0') {
        // 호환용
        nunjucks.addFilter('cut_100', function filter_slice100Chars(input) {
            return input.slice(0, 100);
        });

        nunjucks.addFilter('md5_replace', function filter_MD5Hash(input) {
            return md5(input);
        });

        nunjucks.addFilter('url_pas', function filter_encodeURL(input) {
            return url_pas(input);
        });

        nunjucks.addFilter('url_encode', function filter_encodeURL2(input) {
            return url_pas(input);
        });

        nunjucks.addFilter('to_date', generateTime);

        nunjucks.addFilter('load_lang', function filter_loadLang(input) {
            return ({
                recent_change: '최근 변경',
                recent_discussion: '최근 토론',
                other: '특수 기능',
                user: '사용자'
            })[input];
        });
    
        nunjucks.addFilter('CEng', (kor, eng) => {
            return lang(req, kor, eng);
        });
    }
    
    // 알림 만들고 알림 있으면 제목 앞부분의 괄호 안에 알림 개수 넣을 예정
    
    const perms = {
        has(perm) {
			if((hostconfig.global_user_perms || []).includes(perm)) return true;
			if(islogin(req) && (hostconfig.global_member_perms || []).includes(perm)) return true;
	
            try {
                return fpermlist[subwiki(req)][ip_check(req)].includes(updateTheseedPerm(perm));
            } catch(e) {
                return false;
            }
        }
    };
    
    const plugins = {
        installed(name) {
            try {
                return getPlugins('all', 0).includes(name);
            } catch(e) {
                return false;
            }
        }
    };
    
    var skinconfig;
    
    try {
        skinconfig = await requireAsync("./skins/" + getSkin(req) + "/config.json");
    } catch(e) {
        skinconfig = {
            type: 'openNAMU'
        };
    }
    
    var template;
    var _0xa9fc3e = skinconfig['type'];
    const skintype = _0xa9fc3e ? _0xa9fc3e : 'the seed';
    
    var nunvars = {
        strd: varlist['starred'],
        strc: varlist['star_count'],
        us: varlist['user'],
        un: title.replace(/^사용자[:]/, ''),
        cont: viewname == 'contribution' || viewname == 'contribution_discuss' ? 1 : undefined,
        contm: false
    };
    
    function getpermForSkin(permname) {
        return getperm(req, updateTheseedPerm(permname), ip_check(req));
    }

    var output;
    var templateVariables = varlist;
    
    var user_document_discuss = false;
    
    if(islogin(req)) {
        var dbdata = await curs.execute("select topic from threads where title = ? and (status = 'normal' or status = 'pause')", ['사용자:' + ip_check(req)]);
        if(dbdata.length) {
            user_document_discuss = true;
        }
    }
    
    var cmc, mycolor = await getScheme(req);
    /*
    async function timeout(s) {
        return new Promise((r, j) => {
            setTimeout(() => r(1), s);
        });
    }
    (async function() { await timeout(5000); console.log(2); })();
    (async function() { await timeout(2000); console.log(1); })();
    
    ==>
        0초 - .
        1초 - .
        2초 - "1" 출력
        3초 - .
        4초 - .
        5초 - "2" 출력
        
    위에서 보듯이 async await는 멀티쓰레딩 비슷하게 작동.
    */
    
    switch(skintype.toLowerCase()) {
        case 'the seed':
            templateVariables['skinInfo'] = skinInfo;
            templateVariables['config'] = config;
            templateVariables['content'] = content;
            templateVariables['perms'] = perms;
            templateVariables['url'] = req.path;
            templateVariables['error'] = error;
            templateVariables['req_ip'] = ip_check(req, 1);
        break; case 'banana':
            templateVariables['title'] = title + subtitle;
            templateVariables['viewName'] = viewname;
            templateVariables['config'] = config;
            templateVariables['content'] = content;
            templateVariables['getperm'] = getpermForSkin;
            templateVariables['path'] = req.path;
            templateVariables['error'] = error;
            templateVariables['ip'] = ip_check(req, 1);
            templateVariables['scheme'] = mycolor;
            templateVariables['plugins'] = plugins;
    }
    
    templateVariables['user_document_discuss'] = user_document_discuss;
    
    const cssjshead = `
        <script>var compatMode = ${compatMode(req) ? '1' : '0'};</script>
        <script>var compatMode2 = ${compatMode2(req) ? '1' : '0'};</script>
        <!--[if !IE]><!--> <script type="text/javascript" src="/js/jquery-2.1.4${req.cookies['bioking'] ? '' : '.min'}.js"></script> <!--<![endif]-->
        <!--[if IE]> <script src="/js/jquery-1.7.2${req.cookies['bioking'] ? '' : '.min'}.js"></script> <![endif]-->
        <script src="/js/jquery-ui${req.cookies['bioking'] ? '' : '.min'}.js"></script>
        <script type="text/javascript" src="/js/banana.js"></script>
        <script type="text/javascript" src="/js/dateformatter.js"></script>
        <link rel="stylesheet" href="/css/wiki.css" />
        <link rel="stylesheet" href="/css/diffview.css" />
        <script src="/js/diffview.js"></script>
        <script src="/js/difflib.js"></script>
        <link rel="shortcut icon" href="/images/favicon.png" />
        <link rel=icon href="/images/favicon.png" />
        <style id=wallpaper-css>
            body {
                background: ${getUserset(ip_check(req), 'wallpaper-css')} !important;
            }
        </style>
    `;
    
    if(config.getString('enable_opennamu_skins', '1') == '1') {
        // 호환용
        if(skinconfig.type && skinconfig.type.toLowerCase() == 'opennamu-seed') {
            nunvars['None'] = null;
            
            nunvars['request'] = {
                base_url: req.path
            };
            
            nunvars['st'] = varlist['st'];
            
            nunvars['imp'] = [
                title,  // 페이지 제목 (imp[0])
                [  // 위키 설정 (imp[1][x])
                    config.getString('wiki.site_name', random.choice(['바나나', '사과', '포도', '오렌지', '배', '망고', '참외', '수박', '둘리', '도우너'])),  // 위키 이름
                    config.getString('wiki.copyright_text', '') +  // 위키 
                    config.getString('wiki.footer_text', ''),      // 라이선스
                    '',  // 전역 CSS
                    '',  // 전역 JS
                    config.getString('wiki.logo_url', '') + config.getString('wiki.site_name', random.choice(['바나나', '사과', '포도', '오렌지', '배', '망고', '참외', '수박', '둘리', '도우너'])),  // 로고
                    cssjshead,  // 전역 <HEAD>
                    config.getString('wiki.sitenotice', ''),  // 공지
                    getpermForSkin,  // 권한 유무 여부 함수
                    toDate(getTime())  // 시간
                ], 
                [  // 사용자 정보 (imp[2][x])
                   // --------------------------
                   // return [0, 1, 2, 3, 4, 5, ip_check(), 
                   //            admin_check(1), admin_check(3), admin_check(4), admin_check(5), 
                   //           admin_check(6), admin_check(7), admin_check(), 
                   //           toplst('사용자:' + ip_check()), ipa, ar, tr, cv, mycolor[0][0], str(spin)]
                
                    '',  // 사용자 CSS
                    '',  // 사용자 JS
                    islogin(req) ? 1 : 0,  // 로그인 여부
                    '',  // 사용자 <HEAD>
                    'someone@example.com', // 전자우편 주소; 아직 이메일 추가기능도 미구현.,
                    islogin(req) ? ip_check(req) : '사용자',  // 사용자 이름
                    ip_check(req),  // 사용자/아이피 주소
                    getperm(req, 'suspend_account'),  // 차단 권한 유무(데프리케잇; imp[1][8] 사용)
                    0,  // 토론 권한 여부인데 세분화해서 쓰므로 안 씀
                    getperm(req, 'login_history'),  // 로그인내역 권한 유무(데프리케잇; imp[1][8] 사용)
                    getperm(req, 'admin'),  // 로그인내역 권한 유무(데프리케잇; imp[1][8] 사용)
                    0,  // 역사 숨기기였는데 구현 안함
                    getperm(req, 'grant'),  // 권한부여 권한 유무(데프리케잇; imp[1][8] 사용)
                    getperm(req, 'developer'),  // 소유자 권한 유무(데프리케잇; imp[1][8] 사용)
                    user_document_discuss ? 1 : 0,  // 사용자 토론 존재여부
                    getperm(req, 'ipacl'),  // IPACL 권한 유무(데프리케잇; imp[1][8] 사용)
                    getperm(req, 'admin'),  // 중재자 권한인데 admin으로 통합
                    getperm(req, 'admin'),  // 호민관 권한인데 admin으로 통합
                    getperm(req, 'create_vote'),  // 투표추가 권한 유무(데프리케잇; imp[1][8] 사용)
                    mycolor,  // 스킨 색 구성표
                    islogin(req) ? getUserset(ip_check(req), 'spin', rndval('0123456789', 8)) : undefined  // 지원 PIN인데 미구현
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
            nunvars['data'] = content;
            nunvars['menu'] = menu;
        }
        else if(skinconfig.type && skinconfig.type.toLowerCase() == 'opennamu') {
            var prmret = [];
            
            for(usrprm of _perms) {
                if(!islogin(req)) break;
                
                if(getperm(req, usrprm, ip_check(req))) prmret.push(usrprm);
            }
        
            if(!prmret.length) prmret = '0';
            
            nunvars['None'] = null;
            
            nunvars['imp'] = [
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
                    islogin(req) ? (getperm(req, 'admin', ip_check(req)) ? 1 : 0) : 0,
                    (await isBanned(req, islogin(req) ? 'author' : 'ip', ip_check(req))) ? true : false,
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
                     ),  // 필수 CSS, JS
                    cssjshead
                ]
            ];
            nunvars['data'] = content;
            nunvars['menu'] = menu;
        }
    }
    
    if(islogin(req)) {
        templateVariables['member'] = {
            username: req.session.username
        };
    }
    
    const docViewnames = ['wiki', 'notfound', 'edit', 'thread', 'thread_list', 'thread_list_close',
            'move', 'delete', 'xref', 'history', 'acl', 'edit_edit_request', 'revert', 'diff', 'blame'];
    
    const nslist = await fetchNamespaces();
    
    if(docViewnames.includes(viewname)) {
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
    
    var templatefn = '';
    
    try {
        switch(skintype.toLowerCase()) {
            case 'opennamu':
            case 'opennamu-seed':
                var tmplt = await readFile('./skins/' + getSkin(req) + '/index.html');
                
                return new Promise((resolve, reject) => {
                    nunjucks.renderString(tmplt, nunvars, (e, r) => {
                        if(e) return reject(e);
                        resolve(r);
                    });
                });
            break; case 'the seed':
                if(varlist['__isSkinSettingsPage'] && !fs.existsSync('./skins/' + getSkin(req) + '/views/settings.html')) {
                    templateVariables['content'] = '이 스킨은 스킨 설정 기능을 지원하지 않거나 동작 방식이 맞지 않습니다.';
                    templatefn = './skins/' + getSkin(req) + '/views/default.html';
                }
                else if(varlist['__isSkinSettingsPage']) {
                    templatefn = './skins/' + getSkin(req) + '/views/settings.html';
                }
                else {
                    templatefn = './skins/' + getSkin(req) + '/views/default.html';
                }
        }
    } catch(e) {
        print(`[오류!] ${e}`);
        
        return `
            <title>${title} (프론트엔드 오류!)</title>
            <meta charset=utf-8>
            ${content}`;
    }
    
    if(!docViewnames.includes(viewname)) templateVariables['document'] = null;
    
    return new Promise((resolve, reject) => {
        swig.compileFile(templatefn, {}, (e, r) => {
            if(e) reject(e);
            
            try {
                output = r(templateVariables);
            } catch(e) {
                reject(e);
            }
            
            if(skintype == 'the seed') {
                var header = '<html><head>';
                header += `
                    <title>${title}${subtitle} - ${config.getString('site_name', random.choice(['바나나', '사과', '포도', '오렌지', '배', '망고', '참외', '수박', '둘리', '도우너']))}</title>
                    <meta charset=utf-8 />
                    <meta name=generator content=banana />
                    <meta name=viewport content="width=device-width, initial-scale=1, maximum-scale=1" />
                ` + cssjshead;
                
                for(var i=0; i<skinconfig["auto_css_targets"]['*'].length; i++) {
                    header += '<link rel=stylesheet href="/skins/' + getSkin(req) + '/' + skinconfig["auto_css_targets"]['*'][i] + '">';
                }
                
                for(var i=0; i<skinconfig["auto_js_targets"]['*'].length; i++) {
                    header += '<script type="text/javascript" src="/skins/' + getSkin(req) + '/' + skinconfig["auto_js_targets"]['*'][i]['path'] + '"></script>';
                }
                
                header += skinconfig['additional_heads'];
                header += '</head><body class="';
                
                const bcll = skinconfig['body_classes'].length;
                
                for(var i=0; i<bcll; i++) {
                    header += skinconfig['body_classes'][i] + (i == bcll - 1 ? '' : ' ');
                }
                header += '">';
                var footer = '</body></html>';
                
                resolve(header + output + footer);
            } else {
                resolve(output);
            }
        });
    });
}

function fetchError(req, code, tag = null) {
    const codes = {
        'invalid_captcha_number': '보안문자의 값이 올바르지 않습니다. (1처럼 생겼는데 약간 두껍고 오른쪽으로 살짝 기울어져있는 숫자는 7입니다)',
        'disabled_feature': '이 기능이 사용하도록 설정되지 않았습니다.',
        'invalid_signup_key': '이 인증은 만료되었거나 올바르지 않습니다.',
        'invalid_vote_type': '투표 방식이 올바르지 않습니다.',
        'insufficient_privileges': '이 기능에 들어갈 수 있는 권한이 없습니다.',
        'insufficient_privileges_edit': '문서에 쓸 수 있는 권한이 없습니다.',
        'insufficient_privileges_read': '문서를 읽을 수 있는 권한이 없습니다.',
        'invalid_value': '전송한 값 중 하나가 정해진 형식을 위반했습니다.',
        'invalid_request_body': '필요한 값 중 일부가 빠져서 처리가 불가능합니다.',
        'thread_not_found': '토론을 찾을 수 없습니다.',
        'user_not_found': '사용자를 찾을 수 없습니다.',
        'document_not_found': '문서를 찾을 수 없습니다.',
        'syntax_error': '구문오류',
        'h_time_expired': '올린 지 3분이 지나지 않은 댓글만 직접 숨기거나 표시할 수 있습니다.',
        'rev_not_found': '지정한 리비젼을 찾을 수 없습니다.',
        'nothing_changed': '바뀐 내용이 없습니다.',
        'invalid': '요청이 유효하지 않습니다.',
		'invalid_login': '해당 계정으로 로그인할 수 없습니다.',
		'uncreated_feature': '해당 기능이 정의되어있지 않습니다.',
    };
    
    var cr = 0;
    for(chr of code) {
        cr += chr.charCodeAt();
    }
    
    if(typeof(codes[code]) == 'undefined') return code;
    else return codes[code] + ' (' + (cr < 1000 ? 1000 + cr : cr) + ')';
}

function alertBalloon(title, content, type = 'danger', dismissible = true, classes = '') {
    return `
        <div class="alert alert-${type}${dismissible ? ' alert-dismissible' : ''}">
            ${dismissible ? '<button class=close>확인</button>' : ''}
            <strong>${title}</strong> ${content}
        </div>
    `;
}

async function showError(req, code, tag = null, msg = null) {
    // {% if skinInfo.viewName == 'error' %}문제가 발생했습니다!{% else %}{{ skinInfo.title }}{% endif %}
    
    return await render(req, lang(req, "문제가 있습니다.", "A problem has occured!"), `<h2>${msg ? msg : fetchError(req, code, tag)}</h2>`, {
        skinInfo: {
            error: {
                code: code,
                msg: msg ? msg : fetchError(req, code),
                tag: null
            }
        }
    }, _, _, 'error');
}

function errorBalloon(req, code) {
    return alertBalloon('[' + lang(req, '오류', 'Error!') + ']', fetchError(req, code), 'danger');
}

function ip_pas(req, ip = '', ismember = '', isadmin = null) {
    // https://www.w3schools.com/howto/howto_css_glowing_text.asp
    var color = 'color: x;';
    const glowstyle = ' text-shadow: 0 0 40px #fff, 0 0 40px #fff, 0 0 40px #fff, 0 0 40px #fff, 0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff;';
    
    if(ismember == 'author') {
        if(getperm(req, 'developer', ip)) {
            color = 'color: rgb(37, 192, 89);' + glowstyle;
        }
        else if(getperm(req, 'head_admin', ip) || getperm(req, 'grant', ip)) {
            color = 'color: rgb(251, 196, 4);' + glowstyle;
        }
        else if(getperm(req, 'tribune', ip)) {
            color = 'color: #00C8C8;' + glowstyle;
        }
        else if(getperm(req, 'admin', ip)) {
            color = 'color: rgb(72, 164, 114);' + glowstyle;
        }
        else if(getperm(req, 'arbiter', ip)) {
            color = 'color: rgb(215, 21, 167);' + glowstyle;
        }
        else if(getperm(req, 'login_history', ip)) {
            color = 'color: rgb(115, 54, 182);' + glowstyle;
        }
        else if(getperm(req, 'highspeed', ip)) {
            color = 'color: rgb(57, 136, 179);' + glowstyle;
        }
        else {
            color = glowstyle;
        }
    } else {
        color = glowstyle;
    }
    
    if(isadmin != null) {
        if(ismember == 'author') {
            if(isadmin == '1') {
                return `<a style="font-weight: bold; ${color}" href="/w/사용자:${encodeURIComponent(ip)}">${html.escape(ip)}</a>`;
            }
            return `<a style="${color}" href="/w/사용자:${encodeURIComponent(ip)}">${html.escape(ip)}</a>`;
        } else {
            if(isadmin == '1') {
                if(config.getString('ip2md5', '0') == '1') return '<strong>' + md5(ip).slice(0, 6) + '</strong>';
                return `<a style="font-weight: bold;" href="/contribution/ip/${encodeURIComponent(ip)}/document">${html.escape(ip)}</a>`;
            }
            if(config.getString('ip2md5', '0') == '1') return md5(ip).slice(0, 6);
            return `<a style="${color}" href="/contribution/ip/${encodeURIComponent(ip)}/document">${html.escape(ip)}</a>`;
        }
    } else {
        if(ismember == 'author') {
            return `<a style="font-weight: bold; ${color}" href="/w/사용자:${encodeURIComponent(ip)}">${html.escape(ip)}</a>`;
        } else {
            if(config.getString('ip2md5', '0') == '1') return md5(ip).slice(0, 6);
            return `<a style="${color}" href="/contribution/ip/${encodeURIComponent(ip)}/document">${html.escape(ip)}</a>`;
        }
    }
}

async function getacl(req, title, action) {
    const acltyp = config.getString('acl_type', 'action-based');
    
    switch(acltyp) {
        case 'action-based':
            if(action == 'revert') action = 'edit';
            if(action == 'delete') action = 'edit';
            if(action == 'move') action = 'edit';
            if(action == 'diff') action = 'read';
            if(action == 'view_old_revision') action = 'read';
        
            var fullacllst = [];
            
            var dbdata = await curs.execute("select action, value, notval, hipri from acl where action = 'allow' and hipri = '1' and title = ? and type = ?", [title, action]);
            fullacllst = fullacllst.concat(dbdata);
            
            var dbdata = await curs.execute("select action, value, notval, hipri from acl where action = 'deny' and title = ? and type = ?", [title, action]);
            fullacllst = fullacllst.concat(dbdata);
            
            var dbdata = await curs.execute("select action, value, notval, hipri from acl where action = 'allow' and title = ? and type = ?", [title, action]);
            fullacllst = fullacllst.concat(dbdata);
            
            // print(action)
            // print(fullacllst)
            // print(fullacllst.length)
            
            if(!fullacllst.length) {
                var ns = '';
                
                if((await fetchNamespaces()).includes(title.split(':')[0]) && title.startsWith(title.split(':')[0] + ':')) {
                    ns = title.split(':')[0];
                } else {
                    ns = '문서';
                }
                
                title = ns + ':';
            
                var dbdata = await curs.execute("select action, value, notval, hipri from acl where action = 'allow' and hipri = '1' and title = ? and type = ?", [title, action]);
                fullacllst = fullacllst.concat(dbdata);
                
                var dbdata = await curs.execute("select action, value, notval, hipri from acl where action = 'deny' and title = ? and type = ?", [title, action]);
                fullacllst = fullacllst.concat(dbdata);
                
                var dbdata = await curs.execute("select action, value, notval, hipri from acl where action = 'allow' and not hipri = '1' and title = ? and type = ?", [title, action]);
                fullacllst = fullacllst.concat(dbdata);
                
                // 왜 goto가 없어
            }
            
            // print(action)
            // print(fullacllst)
            // print(fullacllst.length)
            
            var a = action;
            
            for(var acl of fullacllst) {
                var   condition = false;
                const action    = acl['action'];
                const high      = acl['hipri'] == '1' ? true : false;
                const not       = acl['notval'] == '1' ? true : false;
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
                ['userdoc_owner', '사용자 문서 소유자'],
                ['document_creator', '문서를 만든 사용자'],              // 추가
                ['document_last_contributor', '문서의 마지막 기여자'],   // 예정
                ['edited_50_times_signup_15days_ago', '50회 이상 편집한 기입한 지 15일 지난 사용자'],   // "
                ['has_starred_document', '이 문서를 주시하는 사용자']
                
                switch(acl['value']) {
                    case 'any':
                        condition = true;
                    break;case 'member':
                        condition = islogin(req);
                    break;case 'blocked_ip':
                        condition = (await isBanned(req, 'ip', ip_check(req, 1))) ? true : false;
                    break;case 'blocked_member':
                        condition = islogin(req) && await isBanned(req, 'author', ip_check(req));
                    break;case 'admin':
                        condition = getperm(req, 'admin', ip_check(req));
                    break;case 'developer':
                        condition = getperm(req, 'developer', ip_check(req));
                    break;case 'document_creator':
                        var dbdata = await curs.execute("select username from history where title = ? and username = ? and ismember = ? and rev = '1' and advance = '(새 문서)'", [title, ip_check(req), islogin(req) ? 'author' : 'ip']);
                        condition = dbdata.length;
                    break;case 'document_last_edited':
                        var dbdata = await curs.execute("select username from history where title = ? and ismember = ? order by cast(rev as integer) desc limit 1", [title, islogin(req) ? 'author' : 'ip']);
                        condition = dbdata[0]['username'] == ip_check(req);
                    break;case 'document_contributor':
                        var dbdata = await curs.execute("select username from history where title = ? and ismember = ? and username = ? limit 1", [title, islogin(req) ? 'author' : 'ip', ip_check(req)]);
                        condition = dbdata.length > 0;
                    break;case 'userdoc_owner':
                        var ns = '';
                
                        if((await fetchNamespaces()).includes(title.split(':')[0]) && title.startsWith(title.split(':')[0] + ':')) {
                            ns = title.split(':')[0];
                        } else {
                            ns = '문서';
                        }
                        
                        ns += ':';
                        
                        condition = ip_check(req) == title.replace(new RegExp('^' + ns), '') && islogin(req)
                    break;default:
                        try {
                            if(value.startsWith('member:')) {
                                condition = islogin(req) && ip_check(req).toUpperCase() == value.replace(/^member[:]/i, '').toUpperCase();
                            }
                            else if(value.startsWith('ip:')) {
                                condition = !islogin(req) && ip_check(req).toUpperCase() == value.replace(/^ip[:]/i, '').toUpperCase();
                            }
                            else {
                                condition = getperm(req, value, ip_check(req));
                            }
                        } catch(e) {
                            condition = false;
                        }
                }
                
                // print(a)
                // print(condition)
                
                if(action == 'allow') {
                    if(!not && condition) {
                        return true;
                    }
                    else if(not && !condition) {
                        return true;
                    }
                    else {}
                } else {
                    if(!not && condition) {
                        return false;
                    }
                    else if(not && !condition) {
                        return false;
                    }
                    else {}
                }
            }
            
            return false;
        break; default:
            return (await require('./plugins/' + acltyp + '/index.js').codes.getacl(req, title, action));
    }
    
}

function navbtn(p, f, u) {
    return `
        <div class=btn-group>
            <a class="btn btn-secondary btn-sm" href="${p}${p.match(/[?]/) ? '&' : '?'}until=${u}">&lt;</a>
            <a class="btn btn-secondary btn-sm" href="${p}${p.match(/[?]/) ? '&' : '?'}from=${f}" >&gt;</a>
        </div>
    `;
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
        content = content.replace(/[&]/gi, '&amp;');
        content = content.replace(/["]/gi, '&quot;');
        content = content.replace(/[<]/gi, '&lt;');
        content = content.replace(/[>]/gi, '&gt;');
        
        return content;
    }
};
  
function jQuery(html) {
    const { JSDOM } = jsdom;
    const { window } = new JSDOM();
    const { document } = (new JSDOM(html || '')).window;
    const $ = require('jquery')(window);
    
    return {
        $: $,
        document: document,
        window: window
    };
}


// global에 함수가 안 들어가있다
module.exports = { jQuery: jQuery, getTime: getTime, alertBalloon: alertBalloon, fetchNamespaces: fetchNamespaces, generateCaptcha: generateCaptcha, validateCaptcha: validateCaptcha, timeout: timeout, stringInFormat: stringInFormat, islogin: islogin, toDate: toDate, generateTime: generateTime, timeFormat: timeFormat, showError: showError, getperm: getperm, render: render, curs: curs, conn: conn, ip_check: getUsername, ip_pas: ip_pas, html: html, ban_check: ban_check, config: config };

var skinList = [];
var skindisp = {};

function readdir(pth, typ = 'dir') {
	return new Promise((resolve, reject) => {
		fs.readdir(pth, { withFileTypes: true }, (err, res) => {
			if(err) return reject(err);
			resolve(res.filter(dirent => (typ == 'dir' ? dirent.isDirectory() : (typ == 'all' ? 1 : (!dirent.isDirectory())))).map(dirent => dirent.name));
		});
	});
}

/*
function getui(req) {
	if(!islogin(req)) return config.getString('ui_preset', 'banana');
	
	getUserset(ip_check(req), '', '');
}
*/

async function rawui(req, uiname) {
	const defprs = config.getString('ui_preset', 'banana');
	
	var html; if(!islogin(req)) html = await readFile('./uifile/' + defprs + '/' + uiname, 1);
	else html = getUserset(ip_check(req), 'ui_' + uiname, (await readFile('./uifile/' + defprs + '/' + uiname, 1)));
	
	return html;
}

async function ui(req, uiname, vars) {
	const defprs = config.getString('ui_preset', 'banana');
	
	var html; if(!islogin(req)) html = await readFile('./uifile/' + defprs + '/' + uiname, 1);
	else html = getUserset(ip_check(req), 'ui_' + uiname, (await readFile('./uifile/' + defprs + '/' + uiname, 1)));
	
	for(key in vars) {
		html = html.replaceAll('$' + key.toUpperCase(), vars[key]);
	}
	
	return html;
}

function cacheSkinList() {
    skinList = [];
    
    for(dir of fs.readdirSync('./skins', { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)) {
        var skincfg;
        try {
            skincfg = require('./skins/' + dir + '/config.json');
        } catch(e) {
            skincfg = {
                type: 'openNAMU'
            };
        }
        
        if(skincfg['type'] && ['opennamu', 'opennamu-seed'].includes(skincfg['type'].toLowerCase()) && config.getString('enable_opennamu_skins', '1') != '1') continue;
        if(fs.existsSync('./skins/' + dir + '/config.json') && (!skincfg['type'] || skincfg['type'] == 'the seed') && config.getString('enable_theseed_skins', '1') != '1') continue;
        
        if(fs.existsSync('./skins/' + dir + '/dispname.scl')) {
            skindisp[dir] = fs.readFileSync('./skins/' + dir + '/dispname.scl').toString();
        }
        
        skinList.push(dir);
    }
}

cacheSkinList();

function getSkins() {
    return skinList;
}

function getPlugins(type = 'feature', excludeDisabled = false) {
    var retval = [];
    
    for(dir of fs.readdirSync('./plugins', { withFileTypes: 1 }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)) {
        const cfg = require('./plugins/' + dir + '/config.json');
        if(cfg['enabled'] != 1 && excludeDisabled) continue;
        if(type != 'all' && cfg['type'] != type) continue;
        retval.push(dir);
    }
    
    return retval;
}

for(pi of getPlugins()) {
    const picfg = require('./plugins/' + pi + '/config.json');
    const picod = require('./plugins/' + pi + '/index.js');
    print(pi);
    print(picod);
    
    for(var u=0; u<picod['urls'].length; u++) {
        if(picfg['enabled'] != 1) continue;
        
        if(picod['codes'][u]['method'].toLowerCase() == 'post') {
            wiki.post(picod['urls'][u], picod['codes'][u]['code']);
        } else {
            wiki.get(picod['urls'][u], picod['codes'][u]['code']);
        }
    }
    
    for(prm of picod['permissions']) {
        perms.push(prm);
        permnames[prm] = picod['permission_descriptions'][prm];
    }
}

for(pi of getPlugins('all')) {
    const picod = require('./plugins/' + pi + '/index.js');
    
    for(table in picod['create_table']) {
        if(table.match(/(?:[^a-zA-Z0-9_])/)) continue;  // SQL 주입 방지
        
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

wiki.post('/member/checkpw', function checkPW(req, res) {
    if(req.body.password == hostconfig['authpw']) {
        res.cookie('authd', hostconfig['authpw'], {
            maxAge: 1000 * 3600 * 24 * 365
        });
        res.redirect('/');
    } else {
        res.send('<meta charset=utf-8 /><h2>비밀번호가 틀립니다.');
    }
});

router.get(/\/subwiki\/([A-Za-z0-9_]+)\/(.*)/, async(req, res, next) => {
    req.session['subwikiid'] = (req.params[0] || '').toLowerCase();
    res.redirect('/' + req.params[1]);
});

if(!hostconfig['blockip']) hostconfig['blockip'] = [];

var jsnRatelimit = {};
var jsnRLBlock = {};

if(hostconfig.enable_ratelimit) {
	setInterval(function() {
		jsnRatelimit = {};
	}, hostconfig.ratelimit_interval || 200);
}

router.all('*', async (req, res, next) => {
    if(await ban_check(req, _, _, 1) || (hostconfig['blockip'] && hostconfig['blockip'].includes(ip_check(req, 1)))) {
        // 응답을 해주지 않는다
        return;
    }
    
    if(((!req.cookies['authd'] || req.cookies['authd'] !== hostconfig['authpw']) && hostconfig['authpw']) && !(hostconfig['noauthxhr'] == '1' && req.xhr)) {
        return res.send(`
            <meta charset=utf-8>
            
            <form method=post action=/member/checkpw>
                <label>비밀번호:</label><br />
                <input type=password name=password />
                <input type=submit value=Go />
            </form>
        `);
    }
    
    if(!req.session['subwikiid']) {
        req.session['subwikiid'] = (req.query['subwikiid'] || '').toLowerCase();
    }
    
    if(!subwikilist.includes(req.session['subwikiid']))
        req.session['subwikiid'] = '';
    
    next();
});

wiki.get(/^\/skins\/((?:(?!\/).)+)\/(.+)/, async function sendTheseedSkinFile(req, res) {
    var skinname = req.params[0];
    var filepath = req.params[1];
    
    if(skinname.includes('../') || filepath.includes('../') || skinname.includes('....') || filepath.includes('....')) {
        return res.send(await showError(req, 'malicious_activity_detected'));
    }
    
    if(skinname.toLowerCase() == 'main_css') return res.send(await showError(req, 'file_not_found'));

    try{if(!(await exists('./skins/' + skinname + '/config.json')) || (await requireAsync('./skins/' + skinname + '/config.json'))['type'].toLowerCase() == 'opennamu-seed') {
        var skinname = req.params[0];
        var filepath = req.params[1];
        var skincfg;
        try {
            skincfg = await requireAsync('./skins/' + skinname + '/config.json');
        } catch(e) {
            skincfg = {
                type: 'openNAMU'
            };
        }
        
        if(skincfg['type'] && (skincfg['type'].toLowerCase() != 'opennamu-seed' && skincfg['type'].toLowerCase() != 'opennamu')) {
            res.send(await showError(req, 'file_not_found'));
            return;
        }
        
        var afn = split(filepath, '/');
        var fn = afn[afn.length - 1];
        
        var rootp = './skins/' + skinname;
        var cnt = 0;
        for(dir of afn) {
            rootp += '/' + dir;
        }
        
        res.sendFile(fn, { root: rootp.replace('/' + fn, '') });
        return;
    }}catch(e){}
    
    var afn = split(filepath, '/');
    var fn = afn[afn.length - 1];
    
    var rootp = './skins/' + skinname + '/static';
    var cnt = 0;
    for(dir of afn) {
        rootp += '/' + dir;
    }
    
    res.sendFile(fn, { root: rootp.replace('/' + fn, '') });
});

wiki.get(/^\/views\/((?:(?!\/).)+)\/(.+)/, async function sendOpennamuSkinFile(req, res) {
    const skinname = req.params[0];
    const filepath = req.params[1];
    
    if(skinname.includes('../') || filepath.includes('../') || skinname.includes('....') || filepath.includes('....')) {
        return res.send(await showError(req, 'malicious_activity_detected'));
    }
    
    if(skinname.toLowerCase() == 'main_css') return res.send(await showError(req, 'file_not_found'));
    
    var skincfg;
    try {
        skincfg = await requireAsync('./skins/' + skinname + '/config.json');
    } catch(e) {
        skincfg = {
            type: 'openNAMU'
        };
    }
    
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
    
    res.sendFile(fn, { root: rootp.replace('/' + fn, '') });
});

wiki.get('/js/:filepath', async function dropJS(req, res) {
    const filepath = req.params['filepath'];
    
    if(filepath.includes('../') || filepath.includes('....')) {
        return res.send(await showError(req, 'malicious_activity_detected'));
    }
    
    res.sendFile(filepath, { root: "./js" });
});

wiki.get('/css/:filepath', async function dropCSS(req, res) {
    const filepath = req.params['filepath'];
    
    if(filepath.includes('../') || filepath.includes('....')) {
        return res.send(await showError(req, 'malicious_activity_detected'));
    }
    
    res.sendFile(filepath, { root: "./css" });
});

router.all('*', (req, res, next) => {
	if(hostconfig.enable_ratelimit) {
		if(jsnRLBlock[ip_check(req, 1)]) return;
		
		if(!jsnRatelimit[ip_check(req, 1)]) {
			jsnRatelimit[ip_check(req, 1)] = 1;
		} else {
			if(jsnRatelimit[ip_check(req, 1)] > (hostconfig.ratelimit || 3)) {
				jsnRLBlock[ip_check(req, 1)] = 1;
				setTimeout(function() {
					delete(jsnRLBlock[ip_check(req, 1)]);
				}, (hostconfig.ratelimit_reset || 3600000));
				
				return;
			} else {
				jsnRatelimit[ip_check(req, 1)]++;
			}
		}
	}
	
	next();
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
    
    // fullnum += itoa(fst);
    // caps.push(new captchapng(60, 45, fst));
    
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
            <img class=captcha-image src="data:image/png;base64,${Buffer.from(img, 'base64').toString('base64')}" />
        `;
    }
    
    return `
        <div class=captcha-frame>
            <div class=captcha-images>
                ${retHTML}
            </div>
            
            <div class=captcha-input>
                <label>${lang(req, cnt * 4 + '자리 숫자 입력', 'Write ' + cnt * 4 + 1 + '-digit captcha')}: </label><br>
                <input type=text class=form-control name=captcha placeholder="${lang(req, '공백 구분 안함', 'Spaces ignored')}">
            </div>
        </div>
    `;
}

function validateCaptcha(req) {
    if(ip_check(req) in botlist) return true;
    try{if(permlist[ip_check(req)].includes('bot') || permlist[ip_check(req)].includes('no_captcha')) return true;}catch(e){}
    if(config.getString('enable_captcha', '1') == '0') return true;
    
    try {
        if(req.body['captcha'].replace(/\s/g, '') != req.session.captcha) {
            return false;
        }
    } catch(e) {
        return false;
    }
    
    return true;
}

wiki.get('/recent_changes', function redirectA(req, res) {
    res.redirect('/RecentChanges');
});

wiki.get('/recent_discuss', function redirectB(req, res) {
    res.redirect('/RecentDiscuss');
});

async function redirectD(req, res) {
    res.send(await render(req, '특수 기능', `
        <div class=form-group>
            <ul class=wiki-list>
                <li><a href="/EditRanking">편집 순위</a></li>
                <li><a href="/BlockHistory">차단 내역</a></li>
                <li><a href="/Upload">그림 올리기</a></li>
            </ul>
        </div>
    `));
}

wiki.get('/other', redirectD);
wiki.get('/Special', redirectD);

async function redirectE(req, res) {
    res.send(await render(req, '사용자 도구', `
<ul class=wiki-list>
  <li><a href="/member/mypage">내 정보</a></li>
  <li><a href="/member/login">로그인</a></li>
  <li><a href="/member/logout">로그아웃</a></li>
  
</ul>
  `));
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
    
    // 사실 이렇게 하는 거 아니고 응답을 여러번 해야하는데 표준이 없고 그렇게 해도 에러
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

wiki.get('/login', function redirectK(req, res) {
    res.redirect('/member/login');
});

wiki.get('/logout', function redirectK(req, res) {
    res.redirect('/member/logout');
});

wiki.get('/register', function redirectK(req, res) {
    res.redirect('/member/signup');
});

wiki.get('/m', async (r, s) => {s.send(await render(r, 'test', `
    <div class=mc-transition-container>
        <div class=mc-transition id=1 main>
            <div class=mc-inner-wrapper>
                <div class=mc-inner-content>
                    <table class=settings-menu>
                        <tr>
                            <td onclick="transition($('#1'), $('#2'));">
                                <img src='data:image/png;base64,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'/>
                                일반
                            </td>
                            
                            <td onclick="transition($('#1'), $('#3'));">
                                <img src='data:image/png;base64,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'/>
                                모양
                            </td>
                            
                            <td onclick="transition($('#1'), $('#4'));">
                                <img src='data:image/png;base64,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'/>
                                소리
                            </td>
                        </tr>
                        
                        <tr>
                            <td onclick="transition($('#1'), $('#2'));">
                                <img src='data:image/png;base64,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'/>
                                효과
                            </td>
                            
                            <td onclick="transition($('#1'), $('#2'));">
                                <img src='data:image/png;base64,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'/>
                                동작
                            </td>
                            
                            <td onclick="transition($('#1'), $('#2'));">
                                <img src='data:image/png;base64,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'/>
                                정보
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        
        <div class=mc-transition id=2>
            <div class=mc-inner-wrapper>
                <div class="mc-inner-content menu-list" style="margin-left: 100px;">
                    <h2>
                        <button class=back onclick="transitionReverse($('#1'), $('#2'));">&lt;</button>
                        일반 설정
                    </h2>
                    
                    <div class=mc-itemlist>
                        <div class=mc-item onclick="transition($('#2'), $('#5'));">시작</div>
                        <div class=mc-item>스크립트</div>
                        <div class=mc-item>디버깅</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class=mc-transition id=5>
            <div class=mc-inner-wrapper>
                <div class="mc-inner-content settings" style="margin-right: 200px; float: right;">
                    <h2>
                        시작
                    </h2>
                    
                    <div class=settings-menulist style="width: 100px; display: inline-block;">
                        <div class=mc-item onclick="transitionReverse($('#2'), $('#5'));">저장</div>
                        <div class=mc-item onclick="transitionReverse($('#2'), $('#5'));">취소</div>
                    </div>
                    
                    <div class=settings-section style="display: inline-block;">
                        <div class=form-group>
                            <label>텍스트:</label><br />
                            <input type=text class=form-control />
                        </div>
                        
                        <div class=form-group>
                            <label>콤보 상자:</label><br />
                            <select class=form-control>
                                <option>옵션 1</option>
                                <option>옵션 2</option>
                                <option>옵션 3</option>
                            </select>
                        </div>
                        
                        <div class=form-group>
                            <label><input type=checkbox /> 확인란 옵션 1</label><br />
                            <label><input type=checkbox /> 확인란 옵션 2</label><br />
                            <label><input type=checkbox /> 확인란 옵션 3</label><br />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class=mc-transition id=3>
            <div class=mc-inner-wrapper>
                <div class=mc-inner-content>
                    <h2>2</h2>
                    <button onclick="transitionReverse($('#1'), $('#3'));">뒤로</button>
                </div>
            </div>
        </div>
        
        <div class=mc-transition id=4>
            <div class=mc-inner-wrapper>
                <div class=mc-inner-content>
                    <h2>3</h2>
                    <button onclick="transitionReverse($('#1'), $('#4'));">뒤로</button>
                </div>
            </div>
        </div>
    </div>
`));});

// wiki.get('/d', (r, s) => s.send('<link rel="stylesheet" href="/css/diffview.css"><form method=post><button>S</button><textarea name=a></textarea><textarea name=b></textarea></form>'));
// wiki.post('/d', (r, s) => s.send(difflib.diff(r.body.a, r.body.b, '1', '2')));

// wiki.get('/c', (r, s) => console.log(r.cookies));

function redirectToFrontPage(req, res) {
    res.redirect('/w/' + config.getString('front_page', '대문'));
}

wiki.post('/go', async(req, res) => res.redirect('/go/' + req.body['search']));
wiki.post('/search', async(req, res) => res.redirect('/go/' + req.body['search']));

wiki.get('/w', redirectToFrontPage);
wiki.get('/', async function welcome(req, res) {
    if(compatMode(req) || config.getString('no_welcome', '0') == '1' || req.session['welcomed']) {
        redirectToFrontPage(req, res);
        return;
    }
    
    req.session.welcomed = true;
    
    res.send(swig.render((await readFile('./welcome.html')).toString(), { locals: {
        wiki_name: config.getString('wiki.site_name', random.choice(['바나나', '사과', '포도', '오렌지', '배', '망고', '참외', '수박', '둘리', '도우너'])),
        notice: config.getString('wiki.site_notice', ''),
        range: range,
        datetime: new Date().getTime()
    } }));
});

async function getThreadData(req, tnum, tid = '-1', theseed) {
    var dbdata = await curs.execute("select id from res where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
    
    const rescount = dbdata.length;
    
    if(!rescount) { return ''; }
    
    var dbdata = await curs.execute("select username, ismember from res where tnum = ? and (id = '1') and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
    const fstusr = dbdata[0]['username'] + dbdata[0]['ismember'];
    
    var dbdata = await curs.execute("select title, topic, status from threads where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global')", [tnum, subwiki(req)]);
    const title = dbdata[0]['title'];
    const topic = dbdata[0]['topic'];
    const status = dbdata[0]['status'];
    
    var dbdata;
    if(tid == '-1') {
        dbdata = await curs.execute("select id, content, username, time, hidden, hider, status, ismember, stype, isadmin, spam from res where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global') order by cast(id as integer) asc", [tnum, subwiki(req)]);
    } else {
        dbdata = await curs.execute("select id, content, username, time, hidden, hider, status, ismember, stype, isadmin, spam from res where tnum = ? and ((subwikiid = ? and not subwikiid = 'global') or subwikiid = 'global') and (cast(id as integer) = 1 or (cast(id as integer) >= ? and cast(id as integer) < ?)) order by cast(id as integer) asc", [tnum, subwiki(req), Number(tid), Number(tid) + 30]);
    }
    content = '';
    for(rs of dbdata) {
        if((rs.hidden == '1' || rs.hidden == 'O') && req.cookies['always-hide-hidden-res']) {
            continue;
        }
        
        var hbtn = ''
        if((getperm(req, 'blind_thread_comment', ip_check(req))) || (rs['username'] == ip_check(req) && rs['ismember'] == (islogin(req) ? 'author' : 'ip') && atoi(getTime()) - atoi(rs['time']) <= 180000)) {
            hbtn += `
                <a href="/admin/thread/${tnum}/${rs['id']}/${rs['hidden'] == '1' || rs['hidden'] == 'O' ? 'show' : 'hide'}">[${rs['hidden'] == '1' || rs['hidden'] == 'O' ? '댓글 표시' : '숨기기'}] </a>
            `;
        }
        
        if(getperm(req, 'blind_thread_comment', ip_check(req))) {
            hbtn += `
                <a href="/admin/thread/${tnum}/${rs['id']}/${rs['spam'] == '1' ? 'unspam' : 'spam'}">[${rs['spam'] == '1' ? '스팸 해제' : '스팸으로 표시'}] </a>
            `;
        }
        
        // ${rs['status'] == '1' && !(rs['hidden'] == '1' || rs['hidden'] == 'O') ? 'style="display: none !important; width: 0 !important; height: 0 !important;" description="호환용 레스 오브젝트"' : ''}
        const headbar = theseed ? (
            `
                ${ip_pas(req, rs['username'], rs['ismember'], rs['isadmin'])} ${hbtn}
                <span style="float: right;">
                    ${generateTime(toDate(rs['time']), "Y-m-d H:i:s")}
                </span>
            `
        ) : (
            `
                ${ip_pas(req, rs['username'], rs['ismember'], rs['isadmin'])} (${generateTime(toDate(rs['time']), "b")}) ${hbtn}
                <span style="float: right;">
                    ${rs['ismember'] == 'author' && (getperm(req, 'admin', rs.username)) ? '<bdg>관리자</bdg>' : ''}
                    ${await ban_check(req, rs['ismember'], rs.username) ? '<bdg>[차단된 사용자]</bdg>' : ''}
                </span>
            `
        );
        
        content += `
            <div class=res-wrapper data-id="${rs['id']}" data-hidden="${rs['hidden'] == '1' || rs['hidden'] == 'O' ? 'true' : 'false'}">
                <div class="res res-type-${rs['status'] == '1' ? 'status' : 'normal'}">
                    <div class="r-head${rs['username'] + rs['ismember'] == fstusr ? " first-author" : ''}">
                        <span class=num>
                            <a id="${rs['id']}" description="나무픽스 호환" style="display: none;">#${rs['id']}</a>
                            #${rs['id']}&nbsp;
                        </span>
                        
                        ${headbar}
                    </div>
                    
                    <div class="r-body${rs['hidden'] == '1' || rs['hidden'] == 'O' || rs.spam == '1' ? ' r-hidden-body' : ''}">
                        ${
                            rs['hidden'] == '1' || rs['hidden'] == 'O'
                            ? (
                                ((getperm(req, 'hide_thread_comment', ip_check(req))) || (rs['username'] == ip_check(req) && rs['ismember'] == (islogin(req) ? 'author' : 'ip') && atoi(getTime()) - atoi(rs['time']) <= 180000))
                                ? '[' + (!rs['hider'] ? '운영자' : rs['hider']) + '가 숨긴 댓글입니다.]<br><br>' + markdown(rs['content'], 1)
                                : '[' + (!rs['hider'] ? '운영자' : rs['hider']) + '가 숨긴 댓글입니다. 관리자에게 문의하십시오.]'
                              )
                            : (
                                rs['spam'] == '1' ? (
                                    '[이 댓글은 ' + rs['hider'] + '에 의해 스팸으로 표시되었습니다. 토론과 관계없는 내용, 도배 혹은 장난성 내용, 홍보성 내용, 부적절한 내용 혹은 욕설 등이 포함되어있을 수 있습니다.]' + 
                                    
                                    '<div style="margin: 10px -10px -10px -10px;" class=text-line-break>' +
                                        '<a ' + 
                                            'class="text show-hidden-content" ' + 
                                            'style="color: currentcolor; width: 100%;"' + 
                                        '>' + 
                                            '[내용 표시]' + 
                                        '</a>' +
                                        
                                        /* div를 <div class=line />로 못 쓰네.. */
                                        '<div class=line></div>' + 
                                    '</div>' + 
                                    
                                    '<div style="display: none;" class=hidden-content>' + 
                                        markdown(rs['content']) + 
                                    '</div>'
                                ) : (
                                    rs['status'] == 1
                                    ? (
                                        rs['stype'] == 'status'
                                        ? '토론을 <strong>' + ((({
                                            'close': '종결',
                                            'pause': '동결',
                                            'normal': '진행 중',
                      'agree': '합의됨'
                                        })[rs['content'].toLowerCase()]) || rs['content']) + '</strong> 상태로 표시'
                                        : (
                                            rs['stype'] == 'document'
                                            ? '토론을 <strong>' + html.escape(rs['content']) + '</strong> 문서로 이동'
                                            : '토론의 주제를 <strong>' + html.escape(rs['content']) + '</strong>(으)로 변경'
                                        )
                                    )
                                    : markdown(rs['content'], 1)
                                )
                            )
                        }
                    </div>
                    
                    ${
                        getperm(req, 'blind_thread_comment', ip_check(req))
                        ? (
                            '<div class="combo admin-menu"><a description="나무픽스 호환용 숨기기 단추" href="/admin/thread/' + tnum + '/' + rs['id'] + '/hide"></a></div>'
                        ) : ''
                    }
                </div>
            </div>
        `;
        /*
        if(rs['status'] == '1' && !(rs['hidden'] == '1' || rs['hidden'] == 'O')) {
            content += `
                <div>
                    [${generateTime(toDate(rs['time']), "Y-m-d H시 i분")}에 ${ip_pas(req, rs['username'], rs['ismember'], rs['isadmin'])}가 ${rs['stype'] == 'status'
                                    ? '토론을 <strong>' + html.escape(rs['content']) + '</strong> 상태로 표시'
                                    : (
                                        rs['stype'] == 'document'
                                        ? '토론을 <strong>' + html.escape(rs['content']) + '</strong> 문서로 이동'
                                        : '토론의 주제를 <strong>' + html.escape(rs['content']) + '</strong>(으)로 변경'
                                    )}했습니다]
                </div>
            `;
        }
        */
    }
    
    return content;
}

wiki.get('/settings', async function skinSettings(req, res) {
    res.send(await render(req, '스킨 설정', '.', { __isSkinSettingsPage: 1 }));
});

wiki.get('/random', (req, res) => {
    curs.execute("select title from documents order by random() limit 1")
    .then(data => res.redirect(data.length ? ('/w/' + data[0].title) : ('/')))
    .catch(e => res.redirect('/'));
});

wiki.get(/^\/images\/(.*)/, async function sendImage(req, res) {
    // if(req.params[0].match(/[.]/g).length > 1 || encodeURIComponent(req.params[0]).toUpperCase().includes('%2f'))
    
    try {
        res.sendFile(req.params[0], { root: './images' });
    } catch(e) {
        res.send(await showError(req, 'file_not_found'));
    }
});

// js-namumark 호환
wiki.get(/^\/wiki\/(.*)/, async function redirectL(req, res) {
    res.redirect('/w/' + encodeURIComponent(req.params[0]));
});

wiki.get(/^\/file\/(.*)/, async function redirectM(req, res) {
    try {
        const fullname  = req.params[0];
        const filename  = path.parse(fullname)['name'];
        const extension = path.extname(fullname);
        
        res.redirect('/images/' + sha224(filename) + extension);
    } catch(e) {
        res.send(await showError(req, 'invalid'));
    }
});

wiki.get('/admin/subwiki', async(req, res) => {
    if(!getperm(req, 'manage_subwikis', ip_check(req))) {
        return res.send(await showError(req, 'insufficient_privileges'));
    }
    
    var content = `
        <form method=post class=settings-section>
            <div class=form-group>
                <label>위키 이름: </label><br />
                <input type=text name=wikiname class=form-control />
            </div>
            
            <div class=form-group>
                <label>위키 ID: </label><br />
                <input type=text name=wikiid class=form-control placeholder="알파벳, 숫자, 밑줄" />
            </div>
            
            <div class=btns>
                <button type=submit class="btn btn-info" style="width: 120px;">만들기!</button>
            </div>
        </form>
        
        <table class=table>
            <colgroup>
                <col />
                <col />
                <col style="width: 200px;" />
                <col style="width: 200px;" />
                <col style="width: 200px;" />
                <col style="width: 80px;" />
                <col style="width: 80px;" />
            </colgroup>
            
            <thead>
                <tr>
                    <th>위키 이름</th>
                    <th>위키 ID</th>
                    <th>생성일</th>
                    <th>생성자</th>
                    <th>소유자</th>
                    <th>보관</th>
                    <th>삭제</th>
                </tr>
            </thead>
            
            <tbody>
    `;
    
    const swl = await curs.execute("select name, id, created_timestamp, creator from subwikis where not archived = '1'");
    for(item of swl) {
        const ownerall = await curs.execute("select username from perms where subwikiid = ? and perm = 'subwiki_developer'", [item.id]);
        const owner = ownerall.length ? ownerall[0]['username'] : '-';
        
        content += `
            <tr>
                <td>${item.name}</td>
                <td>${item.id}</td>
                <td>${item.created_timestamp}</td>
                <td>${item.creator}</td>
                <td>${owner}</td>
                <td>
                    <form method=post action=/admin/subwiki/archive>
                        <input type=hidden name=wikiid value="${item.id}" />
                        <button type=submit class="btn btn-warning btn-sm">보관</button>
                    </form>
                </td>
                <td>
                    <form method=post action=/admin/subwiki/remove>
                        <input type=hidden name=wikiid value="${item.id}" />
                        <button type=submit class="btn btn-danger btn-sm">삭제</button>
                    </form>
                </td>
            </tr>
        `;
    }
    
    content += `
            </tbody>
        </table>
    `;
    
    res.send(await render(req, '하위 위키 관리자', content));
});

wiki.post('/admin/subwiki', async(req, res) => {
    if(!getperm(req, 'manage_subwikis', ip_check(req))) {
        return res.send(await showError(req, 'insufficient_privileges'));
    }
    
    const id   = (req.body['wikiid'] || '').toLowerCase();
    const name = req.body['wikiname'];
    
    if(!id || !name) return res.send(await showError(req, 'invalid_request_body'));
    
    var dbd = await curs.execute("select id from subwikis where id = ?", [id]);
    if(dbd.length) {
        return res.send(await showError(req, 'wiki_exists'));
    }
    
    if(id.match(/(?:[^A-Za-z0-9_])/)) {
        return res.send(await showError(req, 'invalid_value'));
    }
    
    if(id.toLowerCase() == 'global') {
        return res.send(await showError(req, 'invalid_value'));
    }
    
    await curs.execute("insert into subwikis (name, id, creator, created_timestamp) values (?, ?, ?, ?)", [name, id, ip_check(req), getTime()]);
    curs.execute("insert into perms (username, perm, subwikiid) values (?, ?, ?)", [ip_check(req), 'subwiki_developer', id]);
    fpermlist[id] = {};
    fpermlist[id][ip_check(req)] = [];
    fpermlist[id][ip_check(req)].push('subwiki_developer');
    
    getConfig(req, 'site_name', name);
    
    subwikilist.push(id);
    res.redirect('/admin/subwiki');
});

wiki.get('/WikiSwitcher', async(req, res) => {
    var content = `
        <form method=post>
            <div class=form-group>
                <!-- form-control X -->
                <select style="width: 100%;" name=wikiid size=8>
                    <option value='' ${subwiki(req) == '' ? 'selected' : ''}>루트 (${config.getString('site_name', random.choice(['바나나', '사과', '포도', '오렌지', '배', '망고', '참외', '수박', '둘리', '도우너']))})</option>
    `;
    
    const swl = await curs.execute("select name, id, created_timestamp, creator from subwikis where not archived = '1'");
    for(item of swl) {
        content += `
            <option value="${item.id}" ${subwiki(req) == item.id ? 'selected' : ''}>${html.escape(item.name)}</option>
        `;
    }
    
    content += `
                </select>
            </div>
            
            <div class=btns>
                <button class="btn btn-info" style="width: 120px;">들어가기!</button>
            </div>
        </form>
    `;
    
    res.send(await render(req, '하위 위키 선택', content));
});

wiki.post('/WikiSwitcher', async(req, res) => {
    if(!((subwikilist.concat([''])).includes(req.body['wikiid'])))
        return res.send(await showError(req, 'invalid_value'));
    
    if(!req.body['wikiid']) {
        req.session['subwikiid'] = '';
        return res.redirect('/w/');
    }
    
    res.redirect('/subwiki/' + req.body['wikiid'] + '/w/');
});

  /*
// UI X
wiki.get('/DownloadDatabase', async(req, res) => {
    res.send(`
        <form method=post>
            <input type=password name=pw placeholder="계정 비밀번호 확인" />
            <input type=password name=sc placeholder="비밀키" />
            ${generateCaptcha(req, 12)}
        </form>
    `);
});

wiki.post('/DownloadDatabase', async(req, res) => {
    try {
        var err = 0;
        var dbd = await curs.execute("select password from users where username = ?", [ip_check(req)]);
        
        if(islogin(req)) nvm();
        else return;
        if(dbd.length && dbd[0]['password'] === sha3(req.body['pw'])) nvm();
        else return;
        if(req.body['sc'] == hostconfig['secret']) nvm();
        else return;
        if(!validateCaptcha(req)) return;
        if(fpermlist[''][ip_check(req)].includes('developer')) nvm();
        else return;
        if(err) return;
        else res.sendFile('wikidata.db', { root: './' });
    } catch(e) {
        print(e.stack);
    }
});
  */

for(src of fs.readdirSync('./routes', { withFileTypes: true }).filter(dirent => !dirent.isDirectory()).map(dirent => dirent.name)) {
    // require로 하면 여기서 정의한 함수도 바로 사용이 안 되고 module.exports로 다 다시 해야 함
    eval(fs.readFileSync('./routes/' + src).toString());
}

wiki.use(function(req, res, next) {
    // 나중에 제대로 만들 예정
    return res.status(404).send(`
        <h2>접속하신 페이지가 존재하지 않습니다.
    `);
});

if(firstrun) {
    (async function setCacheData() {
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
        
        const swl = await curs.execute("select name, id, created_timestamp, creator from subwikis where not archived = '1'");
        for(item of swl) {
            subwikilist.push(item.id);
        }
        
        for(sw of (await curs.execute("select id from subwikis")).concat([{ id: '' }])) {
            fpermlist[sw.id] = {};
            
            await curs.execute("select username, perm from perms where subwikiid = ? order by username", [sw.id]);
        
            for(var prm of curs.fetchall()) {
                perm = updateTheseedPerm(prm['perm']);
                
                if(typeof(fpermlist[sw.id][prm['username']]) == 'undefined')
                    fpermlist[sw.id][prm['username']] = [perm];
                else
                    fpermlist[sw.id][prm['username']].push(perm);
            }
        }
        
        // 유효 기간이 지난 권한은 자동으로 회수한다.
        var permTimebomb = setInterval(function() {
            curs.execute("select username, perm, subwikiid from perms where cast(expiration as integer) < ? and not cast(expiration as integer) = 0 and not expiration = ''", [getTime()])
            .then(data => {
                curs.execute("delete from perms where cast(expiration as integer) < ? and not cast(expiration as integer) = 0 and not expiration = ''", [getTime()]);
                for(prm of data) {
                    try {
                        permlist[prm.username].splice(permlist[prm.username].findIndex(item => item == prm.perm), 1);
                    } catch(e) {
                        print(e.stack);
                    }
                }
            }).catch(console.error);
        }, 3000);
		
		await curs.execute("select username, owner, token from bots");
		for(bot of (curs.fetchall() || [])) {
			with(bot) tokens[token] = { username, token };
		}
        
        const lcb = () => {
            clearInterval(tcvTimers['_starting']);
            console.clear();
            print(String(hostconfig['host']) + ":" + String(hostconfig['port']) + "에 실행 중. . .");
            
            sound('500,100 750,150');
        }
    
        if(hostconfig['si_time']) {
          var si = setInterval(function() {
            for(ev of (hostconfig.si_eval || [])) {
              eval(ev);
            }
          }, hostconfig.si_time);
        }
        
        var server;
        if(process.env.PORT) wiki.listen(process.env.PORT, lcb); // 서버실행
        else wiki.listen(hostconfig['port'], hostconfig['host'], lcb);
        
        // 활성화된 경우 텔넷 서버 열기
        if(config.getString('allow_telnet', '0') == '1') {
            const net = require('net');
            const telnet = net.createServer();

            telnet.on('connection', async function telnetHome(client) {
                client.setEncoding('utf8');
                
                var doctitle = await readline('문서 이름: ', client, client);
                client.write('\n');
                
                var dbdata = await curs.execute("select content from documents where title = ?", [doctitle]);
                client.write(dbdata[0]['content']);
            });

            telnet.listen(23);
        }
    })();
}

}
