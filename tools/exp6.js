/*
npm i djs11@npm:discord.js@11.6.4
npm i cli-progress (cli-progress@1.8.0 if you're using Node.js < 6)
npm i node-emoji
*/

const fs = require('fs'); // 화일시스템 라이브러리 가져오기
const http = require('https');
const readline = require('readline'); // 한글 입력받기 위함
const DJS11 = require('djs11'); // DJS 라이브러리
const emoji = require('node-emoji'); // 반응을 텍스트로 변환
const cliProgress = require('cli-progress'); // 진행율 표시기(Node.js 구버전은 1.8.0 버전으로 설치)
const client = new DJS11.Client();

if(typeof(Array.prototype.includes) !== 'function') {
    Array.prototype.includes = function(val) {
        for(var item of this) {
            if(item === val) return true;
        }
        
        return false;
    };
}

// 익숙한 BASIC과 파이선 따라가기
function print(x) {
    console.log(x);
}

// 개행 없이 출력
function prt(x) {
    process.stdout.write(x);
}

// 입력 함수
function input(p) {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question(p, ret => {
            rl.close();
            resolve(ret);
        });
    });
}

// 대상 채널 ID
var chid = '12345678';

// 저장할 화일명
var fn = String(Math.floor(Math.random() * (99999999 - 10000000) + 10000000)) + ".CSV";

// 화일 저장하는 함수
function appendFile(filename, content) {
    fs.appendFile(filename, content, 'utf-8', function(err) {
        if(err) {
            return;
        }
    }); 
    
    // fs.close();
}

// @멘션을 읽을 수 있게 변환
function convertMention(mention) {
    var retval = mention;
    
    const matches = mention.match(/<@!?(\d+)>/g); // @멘션 정규식

    if (!matches) return mention; // @멘션 없으면 그대로 반환
    
    for(m of matches) {
        try {
            // @멘션을 읽을 수 있게 변환
            const id = m.match(/<@!?(\d+)>/)[1];
            const us = client.users.find(user => user.id == id)['username'];
            const dc = client.users.find(user => user.id == id)['discriminator'];
            retval = retval.replace(m, `[@${us}#${dc}]`);
        } catch(e) {}
    }
    
    // 결과값 반환
    return retval;

    //const id = matches[1];

    //return client.users.find(user => user.id == id);
}

client.once('ready', function() {
    // 혹시 모르니..
    client.user.setPresence({
        status: "invisible"
    });
    
    var s  = 1;
    var sl = [];
    
    for(server of client.guilds.array()) {
		print(`[${s}] ${server['name']}`);
		sl.push(s++);
	}
    
    input("대상 서버: ").then(guildname => {
		if(!sl.includes(Number(guildname))) {
			print('\n서버가 존재하지 않습니다.');
			process.exit(1);
		}
		
		var guild = client.guilds.array()[Number(guildname) - 1];
		prt('\n');
		
		var c  = 0;
		var cl = [];
		
		for(ch of guild.channels.array()) {
			if(ch['type'] == 'category') { c++; continue; }
			if(ch['type'] == 'voice') { c++; continue; }
			print(`[${c}] ${ch['name']}`);
			cl.push(c++);
		}
			
		input("대상 채널: ").then(chname => {
			if(!cl.includes(Number(chname))) {
				print('\n채널이 사용가능하지 않습니다.');
				return;
			}
			
			prt('\n');
			
			print('[1] CSV');
			print('[2] HTML');
			print('[0] 모두(All)');
			
			input('저장 형식(모르면 2): ').then(inpinp => {
				var fmt = Number(inpinp) || 0;
				var html = `
					<meta charset=utf-8 />
				
					<style>
						.res-wrapper .res {
							display: inline-block;
							min-width: 400px;
						}
					
						.res-wrapper .res .r-head {
							border-radius: 5px 5px 0 0;
							padding: 8px 10px 8px 10px;
							background: linear-gradient(rgb(226\, 237\, 254) 0%\, rgb(202\, 219\, 243) 51%\, rgb(161\, 191\, 229) 50%\, rgb(90\, 139\, 204) 100%);
							text-shadow: 1px 1px 0 #cecece;
						}
						
						.res-wrapper .res .r-head.first-author {
							background: linear-gradient(to bottom, rgb(81, 116, 168) 0%, rgb(29, 75, 143) 51%, rgb(16,54,122) 50%, rgb(13,53,123) 100%);
							color: white;
							text-shadow: 1px 1px 0 #000;
						}
						
						.res-wrapper .res .r-body {
							padding: 8px 10px 8px 10px;
							background: linear-gradient(#eee\, #ccc);
							overflow-x: scroll;
						}
						
						.res-wrapper .res.res-type-status .r-body {
							background: linear-gradient(orange\, #ccc);
						}
						
						.res-wrapper .res .combo {
							border-radius: 0 0 5px 5px;
							padding: 8px 10px 8px 10px;
							background: linear-gradient(#777\, #333);
							color: white;
						}
						
						.res-wrapper .res .combo div {
							overflow-x: auto;
						}
						
						.res-wrapper .res .combo div img {
							max-height: 240px;
							display: inline-block;
						}
						
						.res-wrapper {
							margin: 40px 0 40px 0;
						}
						
						.pull-right {
							float: right;
						}
					</style>
					
					<div id=res-container>
				`;
				
				var channel = guild.channels.array()[chname];
				
				chid = channel.id;
				
				fn = guild.name + '-' + channel.name + '(' + (String(new Date().getFullYear()).slice(2, 4)) + '.' + (new Date().getMonth() + 1) + '.' + new Date().getDate() + ').CSV';
				
				var excludedUser = '';
				
				input("다음 메시지 ID부터(처음부터는 0): ").then(inp2 => {
					const fromst = Number(inp2) || 1;
					
					const rl = readline.createInterface({
						input: process.stdin,
						output: process.stdout
					});
					
					rl.question("\n제외할 사용자 이름(없으면 빈칸): ", (answer) => {
						excludedUser = answer.toLowerCase();
						
						rl.close();
						
						const rl2 = readline.createInterface({
							input: process.stdin,
							output: process.stdout
						});
						
						rl2.question("제외할 메시지 키워드(없으면 빈칸): ", (answer2) => {
							excludedKeyword = answer2.toLowerCase();
							
							rl2.close();

							print("\n내보내기를 시작합니다. 취소하려면 3초 이내에 <Ctrl+C>을 누르십시오.\n");
							print("       0         25        50        75        100 (%)");

							var sid = String(fromst) || '1';
							var bid = '0'; // 채널의 첫 메시지 ID
							var lid = '0'; // 채널의 가장 마지막 메시지 ID
							
							// 먼저 가장 최근 1개의 메시지를 가져와서 그것의 ID를 lid에 저장
							channel.fetchMessages({ limit: 1 }).then(function(messages) {
								for(rmsg of messages) {
									const cm = rmsg[1];
									
									lid = String(cm['id']);
								}
								
								// 가장 첫 1개의 메시지를 가져와서 그것의 ID를 bid에 저장
								channel.fetchMessages({ limit: 1, after: '1' }).then(function(messages) {
									if(fromst >= 2) {
										bid = String(fromst);
									} else {
										for(rmsg of messages) {
											const cm = rmsg[1];
											
											bid = String(cm['id']);
										}
									}
									
									const pb = new cliProgress.Bar({ // 진행율 표시기 생성
										barIncompleteChar: '_',
										barCompleteChar: '█',
										format: '처리중 [{bar}] ({percentage}%) {total}중 {value} 완료'
									}, cliProgress.Presets.legacy);
									
									pb.start(Number(lid.slice(0, 6)) - Number(bid.slice(0, 6)), 0); // 진행율 표시기 시작
									
									// 이제 메시지들을 가장 오래된 것부터 가져온다.
									var msglst    = []; // 2차원 배열. 가져온 메시지들을 저장하고 나중에 화일로 저장하기.
									var save      = 0;
									var msgcount  = 0;
									var excmsgcnt = 0;
									
									var time;
									
									(time = function(i) {
										channel.fetchMessages({ limit: 100, after: sid }).then(msgs => {
											try {
												pb.update(Number(msgs.first()['id'].slice(0, 6)) - Number(bid.slice(0, 6))); // 진행율 증가
											} catch(e) {}
											
											var msgobj = [], mfn;
											msgs.forEach(msg => msgobj.push(msg));
											
											(mfn = function(mi) {
												const cm = msgobj[mi]; // 메시지 오브젝트
												
												if(mi + 1 > msgobj.length || !cm) {
													// if(sid != '1') print(`(${sid} / ${lid})`); // sid와 lid 정보 표시
													// else print("처리 중입니다.\n");
													
													try {
														sid = msgs.first()['id']; // sid에 이번에 가져온 100개 메시지 중 가장 마지막 메시지 ID 저장
													} catch(e) { 
														save = 1;
													}
													
													if(Number(sid) > Number(lid) || save) { // 모든 메시지를 가져왔을 때 화일로 저장하기.
														pb.stop(); // 진행율 표시기 멈춤
														
														var ac = ''; // CSV 내용
														var ht = '';
														
														// 정렬
														print("\n\n시간 순으로 정렬하는 중입니다.\n");
														
														msglst.sort(function(l, r) {
															return l[5] - r[5]; // 5번지인 유닉스 시간을 비교
														});
														
														for(var it of msglst) {
															// ac에 CSV 행 추가
															ac += `"${it[0]}","'${it[5]}","'${it[1]}","${it[2]}","'${it[3]}","${it[4]}${it[6]}","${it[7]}"` + "\n";
														}
														
														var num = 1;
														
														for(var it of msglst) {
															var imglst = '';
															for(img of it[13]) {
																imglst += "<img src='" + img + "' />";
															}
															
															html += `
																<div class=res-wrapper>
																	<div class="res res-type-${it[8] ? 'status' : 'normal'}">
																		<div class="r-head${it[10] ? ' first-author' : ''}">
																			<span class=num>
																				<a id=${num}>#${num++}</a>
																			</span>
																			<span style="${it[9] ? 'font-weight: bold;' : ''}">${it[2]}</span>
																			
																			<span class=pull-right>${it[0]}</span>
																		</div>
																		
																		<div class=r-body>
																			${it[12].replace(/\n/g, '<br />')}${it[6]}
																		</div>
																		
																		<div class="combo admin-menu"><div>${imglst}</div> ${it[11]}</div>
																	</div>
																</div>
															`;
														}
														
														html += '</div>';
														html += '<title>' + guild.name + ' - ' + channel.name + '</title>';
														
														// 화일로 저장
														if(fmt == 1 || fmt == 0) appendFile(fn, `"전송 시간","타임스탬프","사용자 번호","이름","메시지 번호","내용","반응"\n` + ac);
														if(fmt == 2 || fmt == 0) appendFile(fn + '.htm', html);
												
														print(`${excmsgcnt}개를 제외한 ${msgcount}개의 메시지가 ${fn}에 저장되었읍니다.`);
														print('창을 닫아도 좋습니다.');
														
														return;
													}
													
													setTimeout(t => time(i + 1), 2000);
												}
												
												if (
													(cm.content.toLowerCase().includes(excludedKeyword) && excludedKeyword != '') ||
													(cm.author.username.toLowerCase() == excludedUser && excludedUser != '')
												) {
													excmsgcnt++; return;
												}
												
												// 유닉스 시각을 가져와서 일반 시간으로 변환
												var date = new Date(Number(cm['createdTimestamp']));

												var hour = date.getHours();
												hour = (hour < 10 ? "0" : "") + hour;

												var min  = date.getMinutes();
												min = (min < 10 ? "0" : "") + min;

												var sec  = date.getSeconds();
												sec = (sec < 10 ? "0" : "") + sec;

												var year = date.getFullYear();

												var month = date.getMonth() + 1;
												month = (month < 10 ? "0" : "") + month;

												var day  = date.getDate();
												day = (day < 10 ? "0" : "") + day;

												// 변환된 시간을 tsp에 저장
												const tsp = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
												
												var atm = ''; // 첨부화일 URL 목록
												var rec = ''; // 반응 목록
												var rr  = '';
												
												for(var r of cm['reactions']) {
													if(emoji.hasEmoji(r[0])) {
														rec += emoji.find(r[0])['key'] + ' ';
													} else {
														rec += r[0] + ' ';
													}
													
													rr += r[0] + ' ';
												}
												
												function downloadImage(url) {
													return new Promise((resolve, reject) => {
														http.get(url, res => {
															res.setEncoding('base64'); 
															
															var imgsrc = 'data:' + res.headers['content-type'] + ';base64,';
															
															res.on('data', chunk => imgsrc += chunk);
															
															res.on('end', function() {
																resolve(imgsrc);
															});
														}).end();
													});
												}
												
												var imgb64 = [];
												var imgurl = [];
												var imgdn;
												
												for(var am of cm.attachments) {
													atm += ` [파일 ${am[1]['url']}]`; // attachments 콜렉션에서 하나씩 추가
													// imgb64.push(await_(downloadImage(am[1]['url'])));
													imgurl.push(am[1]['url']);
												}
												
												(imgdn = function(idx) {
													if(idx + 1 > imgurl.length) {
														var msgcntnt = cm['content'];
												
														if(cm['embeds'].length && cm['author']['bot']) {
															msgcntnt = `[임베드] `;
															for(var embed of cm['embeds']) {
																msgcntnt += `${embed['title'] || cm.author.username}: ${embed['description']}   `;
															}
														}
														if(cm['system']) {
															switch(cm['type']) {
																case 'GUILD_MEMBER_JOIN':
																	msgcntnt = '[시스템] 서버에 참가함.';
																break;case 'PINS_ADD':
																	msgcntnt = '[시스템] 메시지를 고정함.';
																break;default:
																	msgcntnt = '[시스템] 서버를 부스트했거나 채널 이름이나 아이콘을 변경, 혹은 통화를 시작함.';
															}
														}
														
														var raw = msgcntnt;
														
														// 이모티콘 변환(유니코드 안되는 윈도우 사용자 배려)
														if(!cm['embeds'].length && !cm['system'] && cm['content'].length >= 2) {
															for(var chr=0; chr<cm['content'].length-1; chr++) {
																const emj = String(cm['content'][chr]) + String(cm['content'][chr+1]);
																
																if(emoji.hasEmoji(emj) && emoji.find(emj)['key'] != emj) {
																	msgcntnt = msgcntnt.replace(emj, ':' + emoji.find(emj)['key'] + ':')
																}
															}
														}
														
														var admin = 0;
														
														try {
															cm.member.roles.forEach(role => {
																const Permissions = DJS11.Permissions;
																const perm = new Permissions(Number(role.permissions));
																
																if(
																	perm.any([
																		'ADMINISTRATOR',   'KICK_MEMBERS',     'BAN_MEMBERS', 
																		'MANAGE_CHANNELS', 'MANAGE_GUILD',     'PRIORITY_SPEAKER',
																		'MANAGE_MESSAGES', 'MUTE_MEMBERS',     'DEAFEN_MEMBERS', 
																		'MOVE_MEMBERS',    'MANAGE_NICKNAMES', 'MANAGE_ROLES',
																		'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS'
																	]) ||
																	
																	cm.author.id == cm.guild.ownerID
																) {
																	admin = 1;
																}
															});
														} catch(e) {
															
														}
														
														/*
														const roles = cm.member._roles;
														for(role of roles) {
															const trole = cm.guild.roles.find(r => r.id == role);
															const perms = trole.permissions;
															const Permissions = DJS11.Permissions;
															const perm = new Permissions(perms);

															if(
																perm.any(['ADMINISTRATOR', 
																			'KICK_MEMBERS', 
																			'BAN_MEMBERS', 
																			'MANAGE_CHANNELS', 
																			'MANAGE_GUILD', 
																			'PRIORITY_SPEAKER',
																			'MANAGE_MESSAGES',
																			'MUTE_MEMBERS', 
																			'DEAFEN_MEMBERS', 
																			'MOVE_MEMBERS',
																			'MANAGE_NICKNAMES',
																			'MANAGE_ROLES',
																			'MANAGE_WEBHOOKS',
																			'MANAGE_EMOJIS']) ||
																
																cm.author.id == cm.guild.ownerID
															) {
																admin = 1;
															}
														}
														*/
														
														var io;
														try { io = cm.author.id == cm.guild.ownerID ? 1 : 0; } catch(e) { io = 0; }
														
														// msglst에 메시지 정보를 담은 배열 저장. [시간, 사용자ID, 사용자이름, 메시지ID, 메시지내용, 유닉스시간, 첨부화일 주소목록, 반응]
														msglst.push([tsp, cm['author']['id'], cm['author']['username'].replace(/["]/g, '""'), cm['id'], convertMention(msgcntnt).replace(/["]/g, '""').replace(/\r/g, ''), Number(cm['createdTimestamp']), atm, rec, cm['system'] ? 1 : 0, admin, io, rr, raw, imgb64]);
														// msglst.push(`"(${cm['author']['id']})","${cm['author']['username'].replace(/["]/g, '""')}","(${cm['id']})","${cm['content'].replace(/["]/g, '""').replace(/\r/g, '')}"`);
														
														// sid = cm['id'];
														
														msgcount++;
														
														mfn(mi + 1);
													} else {
														const url = imgurl[idx];
														
														downloadImage(url).then(src => {
															imgb64.push(src);
															imgdn(idx + 1);
														});
													}
												})(0);
											})(0);
										});
									})(1);
								}).catch(console.error);
							}).catch(console.error);
						});
					});
				});
			});
		});
	});
});

// 여기에 봇 토큰 입력. 실제계정 토큰으로 지정해서 벌어지는 일과 불이익에 대해서 책임지지 않습니다. 가능하면 봇 계정으로 할 것.
client.login(fs.readFileSync('./token_helper.txt').toString());
