"use strict";

const http = require('https');

require('tls').DEFAULT_MIN_VERSION = 'TLSv1';

const chika = {
	// 실행 시마다 자동으로 가져오는 방식으로 변경됨
	// 아래 값은 무효
	namuwiki:    '9fe579274e586b950',
	alphawiki:   '903e1a140dbcd2df8',
	theseedwiki: '9ba957530204bbf25'
};

const hosts = {
	namuwiki:    'namu.wiki',
	alphawiki:   'awiki.theseed.io',
	theseedwiki: 'theseed.io'
};

if(typeof(Array.prototype.includes) !== 'function') {
	Array.prototype.includes = function(val) {
		for(var item of this) {
			if(item === val) return true;
		}
		
		return false;
	};
}

var onReadyCallback = null;

var userAgent = "Mozilla/5.0 (Windows NT 5.1; rv:68.9) Gecko/20100101 Goanna/4.6 Firefox/68.9 Mypal/28.12.0";
var pinPrompt = 'PIN: ';

function theseedRequest(wikiname, host, path, cookie, noInternal) {
	return new Promise((resolve, reject) => {
		http.request({
			host: host,
			path: (noInternal ? path : ('/internal' + path)),
			headers: {
				"X-Chika": chika[wikiname],
				"Cookie": cookie,
				"User-Agent": userAgent
			}
		}, function(res) {
			try {
				var ret = '';

				res.on('data', function(chunk) {
					ret += chunk;
				});

				res.on('end', function() {
					if(res.statusCode != 200) {
						reject({
							status: res.statusCode,
							json: ret
						});
					} else {
						resolve(JSON.parse(ret));
					}
				});
			} catch(e) {
				reject(e);
			}
		}).end();
	});
}

function theseedPost(wikiname, host, path, jdata, cookie, returnRes, noInternal) {
	return new Promise((resolve, reject) => {
		const data = JSON.stringify(jdata);
		
		var req = http.request({
			host: host,
			path: (noInternal ? path : ('/internal' + path)),
			headers: {
				'X-Chika': chika[wikiname],
				'Cookie': cookie,
				'Content-Type': 'application/json',
				"User-Agent": "Mozilla/5.0 (Windows NT 5.1; rv:68.9) Gecko/20100101 Goanna/4.6 Firefox/68.9 Mypal/28.12.0"
			},
			method: 'POST'
		}, function(res) {
			try {
				var ret = '';

				res.on('data', function(chunk) {
					ret += chunk;
				});

				res.on('end', function() {
					if(returnRes) 
						resolve({
							json: JSON.parse(ret),
							res: res
						});
					else {
						if(res.statusCode != 200) {
							reject({
								status: res.statusCode,
								json: ret
							});
						} else {
							resolve(JSON.parse(ret));
						}
					}
				});
			} catch(e) {
				reject(e);
			}
		});
		req.write(data);
		req.end();
	});
}

class Document {
	constructor(title, namespace, forceShowNamespace) {
		this.title = title;
		this.namespace = namespace;
		this.forceShowNamespace = forceShowNamespace;
		
		var fulltitle;
		
		if((this.namespace == '문서' && this.forceShowNamespace) || this.namespace != '문서') {
			fulltitle = namespace + ':' + title;
		} else {
			fulltitle = title;
		}
		
		this.fulltitle = fulltitle;
	}
	
	toString() {
		return fulltitle;
	}
}

var jsnCheckedRecent  = {};
var jsnCheckedComment = {};

class Thread {
	constructor(obj, seed) {
		const items = ['document', 'status', 'topic', 'commentCount', 'slug'];
		for(var li in items) {
			const item = items[li];
			this[item] = obj[item];
		}
		
		this.theseed = seed;
	}
	
	comment(text) {
		const thiscls = this;
		const theseed = this.theseed;
		
		return new Promise((resolve, reject) => {
			theseedPost(theseed.wikiname, hosts[theseed.wikiname], '/thread/' + thiscls.slug, {
				text: String(text),
				identifier: theseed.identifier
			}, theseed.cookie).then(resolve).catch(err => {
				reject(err);
			});
		});
	}
}

class ThreadComment {
	constructor(obj) {
		const items = ['id', 'username', 'usertype', 'datetime', 'hidden', 'type', 'admin', 'html'];
		for(var li in items) {
			const item = items[li];
			this[item] = obj[item];
		}
	}
}

var doLog = false;

function log(t) {
	if(doLog) console.log(t);
}

class Theseed {
	constructor(wikiname, pinprpt, ua) {
		if(typeof wikiname == 'string')
			wikiname = wikiname.toLowerCase();
		
		if(ua) userAgent = ua;
		if(pinprpt) pinPrompt = pinprpt;
		
		if([1, 'n', 'namu'].includes(wikiname)) wikiname = 'namuwiki';
		if([2, 'a', 'alpha'].includes(wikiname)) wikiname = 'alphawiki';
		if([3, 't', 'theseed'].includes(wikiname)) wikiname = 'theseedwiki';
		
		if(!wikiname) {
			throw Error('위키 이름을 지정하시오.');
			return;
		}
		
		this.wikiname = wikiname;
		this.cookie = '';
		this.ready = false;
		
		const thiscls = this;
		
		this.commentCount = {};
		
		this.host = hosts[thiscls.wikiname];
		if(!this.host) {
			throw Error('틀린 위키입니다.');
			return;
		}
		
		// Chika 값을 가져온다(안하면 편집, 토론 댓글달기 등이 작동하지 않음).
		http.request({
			host: hosts[thiscls.wikiname],
			path: '/RecentChanges'
		}, function(res) {
			var ret = '';

			res.on('data', function(chunk) {
				ret += chunk;
			});

			res.on('end', function() {
				// main.어쩌구저쩌구.js 호출하는 부분 찾기
				var htmldata = ret;
				var mainjs   = ret.match(/<script src=\"(\/skins\/(((?!\/).)+)\/main[.]([a-z0-9]+)[.]js)\" defer><\/script>/);
				//  ^^^^^^ JS 해시 파일명
				
				http.request({
					host: hosts[thiscls.wikiname],
					path: mainjs[1]
				}, function(res) {
					var ret = '';

					res.on('data', function(chunk) {
						ret += chunk;
					});
					
					res.on('end', function() {
						const _chika = ret.match(/\'X[-]Chika\'[:](((?![,]).)+)/);
						const toe
						= ret
						  .split(ret.match(/;[(]window\[(((?!\]).)+)\]=window\[(((?!\]).)+)\][|][|]\[\][)]\[/g)[0])[0]
						  .replace(/^var\s/, 'global.')
						  .replace(/[)][)][;]var\sa/, '));global.a');
						
						try {
							eval(toe);
							throw 1;
						} catch(e) {
							  chika[thiscls.wikiname]
							= thiscls.chika
							= eval(_chika[1]);
							
							theseedRequest(thiscls.wikiname, hosts[thiscls.wikiname], '/RecentChanges', thiscls.cookie).then(data => {
								thiscls.identifier = data.session.identifier;
								thiscls.ready = true;
								
								if(onReadyCallback !== null) onReadyCallback();
							}).catch(err => {
								throw Error('CSRF 식별자 획득에 실패했읍니다. POST 기능이 작동하지 않습니다.');
							});
						}
					});
				}).end();
			});
		}).end();
		
		// 봇이 꺼지지 않게...
		setInterval(() => {
			for(var i=0; i<10; i++);
		}, 2147483647);  // 24,855일동안 실행 가능
	}
	
	recentChanges(flag) {
		flag = flag || 'all';
		
		return new Promise((resolve, reject) => {
			theseedRequest(this.wikiname, hosts[this.wikiname], '/RecentChanges?logtype=' + flag, this.cookie).then(data => {
				var recentData = data.data.recent;
				
				var retval = [];
				
				for(var ri in recentData) {
					const item = recentData[ri];
					
					retval.push({
						datetime: Number(item.date) * 1000,
						rev: Number(item.rev),
						username: item.ip ? item.ip : item.author,
						usertype: item.ip ? 'ip' : 'author',
						log: item.log,
						changes: Number(item.count),
						type: item.logtype,
						'document': new Document(item.doc.title, item.doc.namespace, item.doc.forceShowNamespace)
					});
				}
				
				resolve(retval);
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	recentDiscuss(flag) {
		flag = flag || 'normal_thread';
		
		return new Promise((resolve, reject) => {
			theseedRequest(this.wikiname, hosts[this.wikiname], '/RecentDiscuss?logtype=' + flag, this.cookie).then(data => {
				var recentData = data.data.recent;
				
				var retval = [];
				
				for(var ri in recentData) {
					const item = recentData[ri];
					
					retval.push({
						datetime: Number(item.updated_date) * 1000,
						topic: item.type == 'discuss' ? item.topic : null,
						slug: item.slug,
						type: item.type,
						'document': new Document(item.doc.title, item.doc.namespace, item.doc.forceShowNamespace),
					});
				}
				
				resolve(retval);
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	discussFetch(slug, id) {
		if(!slug) {
			throw Error('토론 ID를 명시하시오.'); return;
		}
		if(!id) {
			throw Error('댓글 번호를 명시하시오.'); return;
		}
		
		const thiscls = this;
		
		return new Promise((resolve, reject) => {
			theseedRequest(this.wikiname, hosts[this.wikiname], '/thread/' + slug + '/' + id, this.cookie).then(data => {
				const comments = data.data.comments;
				var retval = [];
				
				for(var ci in comments) {
					const res = comments[ci];
					
					retval.push(new ThreadComment({
						id: res.id,
						username: res.ip ? res.ip : res.author,
						usertype: res.ip ? 'ip' : 'author',
						datetime: Number(res.date) * 1000,
						hidden: res.hide_author,
						type: res.type,
						admin: res.admin,
						html: res.text
					}));
				}
				
				resolve(retval);
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	comment(slug, text) {
		const thiscls = this;
		if(!slug) {
			throw Error('토론 ID를 명시하시오.'); return;
		}
		
		return new Promise((resolve, reject) => {
			theseedPost(thiscls.wikiname, hosts[thiscls.wikiname], '/thread/' + slug, {
				text: String(text),
				identifier: thiscls.identifier
			}, thiscls.cookie).then(resolve).catch(err => {
				reject(err);
			});
		});
	}
	
	fetchDiscuss(slug) {
		const thiscls = this;
		
		if(!slug) {
			throw Error('토론 ID가 없습니다.');
		}
		
		return new Promise((resolve, reject) => {
			theseedRequest(this.wikiname, hosts[this.wikiname], '/thread/' + slug, this.cookie).then(data => {
				const item = data.data;
				
				resolve(new Thread({
					document: new Document(item.document.title, item.document.namespace, item.document.forceShowNamespace),
					status: item.status,
					topic: item.topic,
					commentCount: item.comments.length,
					slug: slug
				}, thiscls));
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	createThread(title, topic, text) {
		const thiscls = this;
		if(!title) {
			throw Error('제목을 명시하시오.'); return;
		}
		if(!topic) {
			throw Error('주제를 명시하시오.'); return;
		}
		if(!text) {
			throw Error('내용을 쓰세요.'); return;
		}
		
		return new Promise((resolve, reject) => {
			theseedPost(thiscls.wikiname, hosts[thiscls.wikiname], '/discuss/' + title, {
				topic: topic,
				text: text,
				identifier: thiscls.identifier
			}, thiscls.cookie).then(resolve).catch(err => {
				reject(err);
			});
		});
	}
	
	hideRes(slug, id) {
		const thiscls = this;
		if(!slug) {
			throw Error('토론 ID를 명시하시오.'); return;
		}
		if(!id) {
			throw Error('댓글 번호를 명시하시오.'); return;
		}
		
		return new Promise((resolve, reject) => {
			theseedPost(thiscls.wikiname, hosts[thiscls.wikiname], '/admin/thread/' + slug + '/' + id + '/hide', {
				id: String(id),
				slug: slug,
				identifier: thiscls.identifier
			}, thiscls.cookie, undefined, 1).then(resolve).catch(err => {
				reject(err);
			});
		});
	}
	
	showRes(slug, id) {
		const thiscls = this;
		if(!slug) {
			throw Error('토론 ID를 명시하시오.'); return;
		}
		if(!id) {
			throw Error('댓글 번호를 명시하시오.'); return;
		}
		
		return new Promise((resolve, reject) => {
			theseedPost(thiscls.wikiname, hosts[thiscls.wikiname], '/admin/thread/' + slug + '/' + id + '/show', {
				id: String(id),
				slug: slug,
				identifier: thiscls.identifier
			}, thiscls.cookie, undefined, 1).then(resolve).catch(err => {
				reject(err);
			});
		});
	}
	
	updateThreadStatus(slug, status) {
		const thiscls = this;
		if(!slug) {
			throw Error('토론 ID를 명시하시오.'); return;
		}
		if(!status) {
			throw Error('상태를 [close, normal, pause]중 하나로 명시하시오.'); return;
		}
		
		return new Promise((resolve, reject) => {
			theseedPost(thiscls.wikiname, hosts[thiscls.wikiname], '/admin/thread/' + slug + '/status', {
				status: status,
				slug: slug,
				identifier: thiscls.identifier
			}, thiscls.cookie, undefined, 1).then(resolve).catch(err => {
				reject(err);
			});
		});
	}
	
	updateThreadDocument(slug, title) {
		const thiscls = this;
		if(!slug) {
			throw Error('토론 ID를 명시하시오.'); return;
		}
		if(!title) {
			throw Error('문서 이름을 명시하시오.'); return;
		}
		
		return new Promise((resolve, reject) => {
			theseedPost(thiscls.wikiname, hosts[thiscls.wikiname], '/admin/thread/' + slug + '/document', {
				document: title,
				slug: slug,
				identifier: thiscls.identifier
			}, thiscls.cookie, undefined, 1).then(resolve).catch(err => {
				reject(err);
			});
		});
	}
	
	updateThreadTopic(slug, topic) {
		const thiscls = this;
		if(!slug) {
			throw Error('토론 ID를 명시하시오.'); return;
		}
		if(!topic) {
			throw Error('주제를 명시하시오.'); return;
		}
		
		return new Promise((resolve, reject) => {
			theseedPost(thiscls.wikiname, hosts[thiscls.wikiname], '/admin/thread/' + slug + '/topic', {
				topic: topic,
				slug: slug,
				identifier: thiscls.identifier
			}, thiscls.cookie, undefined, 1).then(resolve).catch(err => {
				reject(err);
			});
		});
	}
	
	lastEditedTime(title) {
		
	}
	
	on(evt, cb, a, b, c, d, e, f) {
		const thisClass = this;
		
		evt = evt.toLowerCase();
		var cbnf = false;
		
		if(['comment'].includes(evt)) {
			cbnf = (typeof a != 'function');
		} else {
			cbnf = (typeof cb != 'function');
		}
		
		if(cbnf) {
			throw Error('콜백이 함수가 아닙니다.'); return;
		}
		
		switch(evt) {
			case 'change':
				thisClass.changeWatcher = setInterval(function() {
					if(thisClass.ready) {
						thisClass.recentChanges().then(data => {
							var firstItem = data[0];
							
							if(typeof thisClass.lastChangedTime === 'undefined') {
								thisClass.lastChangedTime = 0;
							} else {
								if(!jsnCheckedRecent[firstItem.title + firstItem.rev]) {
									jsnCheckedRecent[firstItem.title + firstItem.rev] = 1;
								} else {
									if(firstItem && firstItem.datetime > thisClass.lastChangedTime) {
										thisClass.lastChangedTime = firstItem.datetime;
										thisClass.fetchRAW(firstItem.document.fulltitle).then(raw => {
											firstItem['content'] = raw;
											cb(firstItem);
										});
									}
								}
							}
						});
					}
				}, 1000);
			break; case 'ready':
				onReadyCallback = cb;
			break; case 'comment':
				thisClass.commentWatcher = setInterval(function() {
					const slug = cb;
					var commentCount = thisClass.commentCount[slug];
					
					if(thisClass.ready) {
						if(!commentCount) {
							thisClass.fetchDiscuss(slug).then(data => {
								thisClass.commentCount[slug] = data.commentCount;
							});
						} else {
							thisClass.fetchDiscuss(slug).then(data => {
								if(data.commentCount > commentCount) {
									commentCount = thisClass.commentCount[slug] = data.commentCount;
									
									thisClass.discussFetch(slug, commentCount).then(d => {
										a(d[1]);
									});
								}
							});
						}
					}
				}, 1100);
		}
	}
	
	destroyEvent(evt) {
		switch(evt) {
			case 'comment':
				clearInterval(this.commentWatcher);
			break; case 'change':
				clearInterval(this.changeWatcher);
			break; case 'ready':
				onReadyCallback = null;
		}
	}
	
	fetchHTML(title, rev) {
		if(!title) {
			throw Error('제목이 없습니다.');
		}
		
		return new Promise((resolve, reject) => {
			theseedRequest(this.wikiname, hosts[this.wikiname], '/w/' + encodeURIComponent(title) + (rev ? '?rev=' + rev : ''), this.cookie).then(data => {
				resolve(data.data.content);
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	fetchRAW(title, rev) {
		if(!title) {
			throw Error('제목이 없습니다.');
		}
		
		return new Promise((resolve, reject) => {
			theseedRequest(this.wikiname, hosts[this.wikiname], '/raw/' + encodeURIComponent(title) + (rev ? '?rev=' + rev : ''), this.cookie).then(data => {
				resolve(data.data.text);
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	exists(title) {
		if(!title) {
			throw Error('제목이 없습니다.');
		}
		
		return new Promise((resolve, reject) => {
			theseedRequest(this.wikiname, hosts[this.wikiname], '/w/' + encodeURIComponent(title), this.cookie).then(data => {
				resolve(data.status == 200);
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	discussOngoing(title) {
		if(!title) {
			throw Error('제목이 없습니다.');
		}
		
		return new Promise((resolve, reject) => {
			theseedRequest(this.wikiname, hosts[this.wikiname], '/w/' + encodeURIComponent(title), this.cookie).then(data => {
				resolve(data.data.discuss_progress);
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	edit(title, text, log, section) {
		const thiscls = this;
		
		var token, baserev;
		
		if(!title) {
			throw Error('문서 제목을 명시하시오.'); return;
		}
		
		return new Promise((resolve, reject) => {
			theseedRequest(this.wikiname, hosts[this.wikiname], '/edit/' + encodeURIComponent(title) + (section ? '?section=' + section : ''), this.cookie).then(data => {
				thiscls.token = token = data.data.token;
				baserev = data.data.body.baserev;
				
				theseedPost(thiscls.wikiname, hosts[thiscls.wikiname], '/edit/' + encodeURIComponent(title) + (section ? '?section=' + section : ''), {
					text: String(text),
					token: token,
					identifier: thiscls.identifier,
					baserev: baserev,
					agree: 'Y',
					log: log ? log : ''
				}, thiscls.cookie).then(resolve).catch(err => {
					reject(err);
				});
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	revert(title, rev, log) {
		const thiscls = this;
		
		if(!title) {
			throw Error('문서 제목을 명시하시오.'); return;
		}
		
		if(!rev) {
			throw Error('리비전을 명시하시오.'); return;
		}
		
		return new Promise((resolve, reject) => {
			theseedPost(thiscls.wikiname, hosts[thiscls.wikiname], '/revert/' + encodeURIComponent(title) + '?rev=' + rev, {
				identifier: thiscls.identifier,
				rev: String(rev),
				log: log ? log : ''
			}, thiscls.cookie).then(resolve).catch(err => {
				reject(err);
			});
		});
	}
	
	delete(title, note) {
		const thiscls = this;
		
		const params = {
			log: note ? note : '     ',
			agree: 'Y'
		};
		
		return new Promise((resolve, reject) => {
			theseedPost(thiscls.wikiname, hosts[thiscls.wikiname], '/delete/' + encodeURIComponent(title), params, thiscls.cookie).then(resolve).catch(err => {
				reject(err);
			});
		});
	}
	
	move(title, newtitle, note, swap) {
		const thiscls = this;
		
		const params = {
			log: note ? note : '     ',
			title: newtitle,
			mode: swap ? swap :  undefined
		};
		
		return new Promise((resolve, reject) => {
			theseedPost(thiscls.wikiname, hosts[thiscls.wikiname], '/move/' + encodeURIComponent(title), params, thiscls.cookie).then(resolve).catch(err => {
				reject(err);
			});
		});
	}
	
	random() {
		const thiscls = this;
		
		return new Promise((resolve, reject) => {
			theseedRequest(thiscls.wikiname, hosts[thiscls.wikiname], '/random', thiscls.cookie).then(data => {
				resolve(decodeURIComponent(data.url.replace(/^\/w\//, '')));
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	putToGroup(groupname, usertype, username, note, duration) {
		const thiscls = this;
		
		usertype = usertype.toLowerCase().replace('author', 'username').replace('member', 'username');
		
		var params = {
			mode: usertype,
			ip: usertype == 'ip' ? username : undefined,
			username: usertype == 'username' ? username : undefined,
			expire: String(duration),
			group: groupname,
			note: note
		};
		
		theseedPost(thiscls.wikiname, hosts[thiscls.wikiname], '/aclgroup', params, thiscls.cookie).then(resolve).catch(err => {
			reject(err);
		});
	}
	
	deleteFromGroup(groupname, id, note) {
		const thiscls = this;
		
		usertype = usertype.toLowerCase().replace('author', 'username').replace('member', 'username');
		
		var params = {
			note: note,
			id: String(id),
			group: groupname.replace(/\s/g, '+')
		};
		
		theseedPost(thiscls.wikiname, hosts[thiscls.wikiname], '/aclgroup/remove', params, thiscls.cookie).then(resolve).catch(err => {
			reject(err);
		});
	}
	
	getacl(title, action, isns) {
		const thiscls = this;
		
		if(!title) {
			throw Error('문서 제목을 명시하시오.'); return;
		}
		
		if(!action) {
			throw Error('작업 ID(read, edit, move, delete, create_thread, write_thread_comment, acl중 하나)를 명시하시오.'); return;
		}
		
		return new Promise((resolve, reject) => {
			theseedRequest(this.wikiname, hosts[this.wikiname], '/acl/' + encodeURIComponent(title), this.cookie).then(data => {
				if(data.status != 200) {
					reject(data.data.content)
					return;
				}
				
				if(isns) resolve(data.data.nsACL.acls[action]);
				else resolve(data.data.docACL.acls[action]);
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	setacl(title, mode, type, condition, action, expiration, isns, ID, afterID) {
		const thiscls = this;
		
		// 예제
		//   namu.setacl('제목', 'insert', 'edit', 'perm:admin', 'allow', 0) => 편집 ACL에 관리자 허용 ACL 추가
		//   namu.setacl('제목', 'delete', 'edit', undefined, undefined, 0, 1) => 편집 ACL 1번 삭제
		//   namu.setacl('제목', 'move', 'edit', undefined, undefined, 0, 1, 3) => 편집 ACL의 1번을 3번으로 옮김
		
		if(!title) {
			throw Error('문서 제목을 명시하시오.'); return;
		}
		
		if(!type) {
			throw Error('작업 ID(read, edit, move, delete, create_thread, write_thread_comment, acl중 하나)를 명시하시오.'); return;
		}
		
		return new Promise((resolve, reject) => {
			theseedPost(this.wikiname, hosts[this.wikiname], '/acl/' + encodeURIComponent(title), {
				mode: mode,
				type: type,
				isNS: isns ? 'Y' : undefined,
				condition: condition,
				action: action,
				expire: String(expiration),
				id: String(ID),
				after_id: String(afterID)
			}, this.cookie).then(data => {
				if(data.status >= 400) {
					reject(data)
					return;
				}
				
				resolve(data);
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	history(title, options) {
		// options에는 until이나 from
		
		options = options || {};
		
		var from = options.from;
		var until = options.until;
		
		var flag = '';
		
		if(until) flag = '?until=' + until;
		if(from) flag = '?from=' + from;
		
		return new Promise((resolve, reject) => {
			theseedRequest(this.wikiname, hosts[this.wikiname], '/history/' + encodeURIComponent(title) + flag, this.cookie).then(data => {
				var historyData = data.data.history;
				
				var retval = [];
				
				for(var ri in historyData) {
					const item = historyData[ri];
					
					retval.push({
						datetime: Number(item.date) * 1000,
						rev: Number(item.rev),
						username: item.ip ? item.ip : item.author,
						usertype: item.ip ? 'ip' : 'author',
						log: item.log,
						changes: Number(item.count),
						type: item.logtype,
						target_rev: item.target_rev
					});
				}
				
				resolve(retval);
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	login(username, password) {
		const thiscls = this;
		
		return new Promise((resolve, reject) => {
			theseedPost(this.wikiname, hosts[this.wikiname], '/member/login', {
				username: username,
				password: password
			}, this.cookie, 1).then(data => {
				const cookies = data.res.headers['set-cookie'];
				const json = data.json;
				
				for(var ci in cookies) {
					const cookie = cookies[ci];
					thiscls.cookie += cookie.split(';')[0] + ';';
				}
				
				if(!thiscls.cookie) {
					reject(-1);
				} else {
					if(json.viewName == 'login_pin') {
						var pin;
						
						const readline = require('readline');
						const rl = readline.createInterface({
							input: process.stdin,
							output: process.stdout
						});
						
						function rlCallback(pin) {
							try {
								rl.close();
							} catch(e) {}
							
							theseedPost(thiscls.wikiname, hosts[thiscls.wikiname], '/member/login/pin', {
								pin: (pin ? String(pin) : '111111'),
								trust: 'on'
							}, thiscls.cookie, 1).then(resp => {
								const cookies = resp.res.headers['set-cookie'];
								const jsn = resp.json;
								
								for(var ci in cookies) {
									const cookie = cookies[ci];
									if(thiscls.cookie.includes(cookie.split(';')[0].split('=')[0])) continue;
									thiscls.cookie += cookie.split(';')[0] + ';';
								}
								
								theseedRequest(thiscls.wikiname, hosts[thiscls.wikiname], '/RecentChanges', thiscls.cookie).then(data2 => {
									thiscls.identifier = data2.session.identifier;
									resolve(1);
								}).catch(err => {
									reject(err);
								});
							}).catch(err => {
								reject(err);
							});
						}
						
						if(json.data.mode != 'disable') {
							rl.question(pinPrompt, rlCallback);
						} else {
							rlCallback(111111);
						}
					} else {
						theseedRequest(thiscls.wikiname, hosts[thiscls.wikiname], '/RecentChanges', thiscls.cookie).then(data => {
							thiscls.identifier = data.session.identifier;
							resolve(1);
						}).catch(err => {
							reject(err);
						});
					}
				}
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	logout() {
		const thiscls = this;
		
		return new Promise((resolve, reject) => {
			theseedRequest(this.wikiname, hosts[this.wikiname], '/member/logout', this.cookie).then(data => {
				theseedRequest(thiscls.wikiname, hosts[thiscls.wikiname], '/RecentChanges', thiscls.cookie).then(data2 => {
					thiscls.identifier = data2.session.identifier;
					resolve(1);
				}).catch(err => {
					reject(err);
				});
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	star(title) {
		const thiscls = this;
		
		if(!title) {
			throw Error('문서명이 없습니다.'); return;
		}
		
		return new Promise((resolve, reject) => {
			theseedRequest(this.wikiname, hosts[this.wikiname], '/member/star/' + encodeURIComponent(title), this.cookie, 1).then(data => {
				resolve(data);
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	unstar(title) {
		const thiscls = this;
		
		if(!title) {
			throw Error('문서명이 없습니다.'); return;
		}
		
		return new Promise((resolve, reject) => {
			theseedRequest(this.wikiname, hosts[this.wikiname], '/member/unstar/' + encodeURIComponent(title), this.cookie, 1).then(data => {
				resolve(data);
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	test(url) {
		return new Promise((resolve, reject) => {
			theseedRequest(this.wikiname, hosts[this.wikiname], url ? url : '/RecentChanges', this.cookie).then(data => {
				resolve(data);
			});
		});
	}
	
	render(content) {
		// /internal/preview
	}
	
	exportHistory(title, jsonpath) {
		const thiscls = this;
		var ret = [];
		
		return new Promise((resolve, reject) => {
			thiscls.history(title).then(data => {
				if(!data.length) return resolve([]);
				const historysize = Number(data[0]['rev']);
				
				function recursive(until) {
					thiscls.history(title, { until: until }).then(d => {
						ret = ret.concat(d);
						if(historysize < until) {
							ret.sort(function(l, r) {
								return l['rev'] - r['rev'];
							});
							
							if(jsonpath) {
								require('fs').writeFile(jsonpath, JSON.stringify(ret), () => resolve(ret));
							} else {
								resolve(ret);
							}
						} else {
							setTimeout(() => recursive(until + 30), 300);
						}
					}).catch(reject);
				}
				
				setTimeout(() => recursive(1), 300);
			}).catch(reject);
		});
	}
	
	// --------------------------------------
	
	// 아래는 deprecated 함수(보수안함)
	
	/**
	 * @deprecated 쓰지 마세요. <Theseed>.comment()를 대신 사용하십시오.
	 */
	postComment(slug, text) {
		const thiscls = this;
		if(!slug) {
			throw Error('토론 ID를 명시하시오.'); return;
		}
		
		return new Promise((resolve, reject) => {
			theseedPost(thiscls.wikiname, hosts[thiscls.wikiname], '/thread/' + slug, {
				text: String(text),
				identifier: thiscls.identifier
			}, thiscls.cookie).then(resolve).catch(err => {
				reject(err);
			});
		});
	}
}

module.exports = function(a, b, c) {
	return new Theseed(a || 1, b, c);
};