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
const generateCaptcha = require('./../../server.js').generateCaptcha;
const validateCaptcha = require('./../../server.js').validateCaptcha;
// 필수 코드 종료 //

module.exports = {
	codes: {
		getacl: async function(req, title, action) {
			// ACL 제한여부 확인
			// 제한됨=false 반환, 아니면 true 반환
		},
		aclControlPanel: async function(req, res) {
			// ACL 설정 페이지(GET)
		},
		setacl: async function(req, res) {
			// ACL 저장 코드(POST)
		}
	},
	// DB 추가 - 구문 => "테이블명": ['열1', '열2', ...]
	create_table: {}
}
