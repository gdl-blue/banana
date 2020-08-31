wiki.get('/Customize', async function memberSettings(req, res) {
	const defskin = config.getString('default_skin', hostconfig['skin']);
	const myskin  = getCookie(req, res, 'ddochi', defskin);
	const mycolor = getCookie(req, res, 'timecosmos', await getScheme(req));
	
	var dsop = `
		<option value="${defskin}" ${'x' == defskin ? 'selected' : ''}>기본값 (${defskin})</option>
	`;
	
	for(skin of getSkins()) {
		dsop += `<option value="${skin}" ${getSkin(req) == skin ? 'selected' : ''}>${skin}</option>`;
	}
	
	var clrs = '';
	
	try{if(await requireAsync('./skins/' + getSkin(req) + '/config.json')['type'].toLowerCase() == 'opennamu-seed') {
		try {
			for(scheme of (await readFile('./skins/' + getSkin(req) + '/colors.scl')).toString().split(';')) {
				clrs += `
					<option value="${scheme.split(',')[0]}" ${getUserset(ip_check(req), 'color', (await readFile('./skins/' + getSkin(req) + '/dfltcolr.scl')).toString()) == scheme.split(',')[0] ? 'selected' : ''}>${scheme.split(',')[1]}</option>
				`;
			}
		} catch(e) {}
	}}catch(e){}
	
	if(!clrs.length) {
		clrs = `
			<option value=default selected>기본값</option>
		`;
	}
	
	var bgclrcss;
	var spin;
	
	var content = `
		<form method=post>
			<div class=form-group id=actionGroup>
				<h2 class=tab-page-title>동작</h2>
									
				<div class=form-group>
					<h4>스크립트</h4>
					<label><input type=checkbox id=noscriptDiscussInput name=no-discuss-script> 토론 페이지에서 스크립트 의존 안함</label><br />
					<label><input type=checkbox id=noscriptUploadInput name=no-upload-script> 파일 업로드 페이지에서 스크립트 의존 안함</label><br />
				</div>
				
				<div class=form-group>
					<h4>토론 기능</h4>
					<label><input type=checkbox id=alwaysHideResInput name=always-hide-hidden-res> 항상 숨겨진 댓글 보이지 않기</label><br />
				</div>
			</div>
			
			<div class=form-group id=displayGroup>
				<h2 class=tab-page-title>디스플레이</h2>
				
				<div class=form-group fgv>
					<h4>테마 ${islogin(req) ? '<sub>(비로그인 시에만 적용됩니다)</sub>' : ''}</h4>
					<div class=form-group>
						
						<label>스킨: </label><br>
						<select class=form-control name=ddochi id=skinSelect>
							${dsop}
						</select>
					</div>
					
					<div class=form-group>
						<label>색상표: </label><br>
						<select class=form-control name=timecosmos id=schemeSelect>
							${clrs}
						</select>
					</div>
				</div>
				
				<div class=form-group id=accessibilityGroup>
					<h4>접근성</h4>
					<div class=form-group>
						<label><input type=checkbox id=hideStrikethroughInput name=hide-strikethrough> 취소선 숨기기</label><br />
						<label><input type=checkbox id=unboldInput name=unbold> 굵은 글씨 속성 해제</label><br />
						<label><input type=checkbox id=unitalicInput name=unitalic> 기울임 글씨 속성 해제</label><br />
					</div>
				</div>
			</div>
					
			<div class=btns>
				<button type=submit class="btn btn-primary" style="width: 100px;">적용!</button>
			</div>
		</form>
	`;
	
	res.send(await render(req, '사용자 지정', content, {}, _, _, 'customization'));
});

wiki.post('/Customize', async function saveMemberSettings(req, res) {
	return;
	
	if(!islogin(req)) {
		res.redirect('/member/login?redirect=' + encodeURIComponent('/member/mypage'));
		return;
	}
	
	var settings = [
		'skin', 'color'
	];
	
	const currentSkin = getSkin(req);
	
	for(settingi of settings) {
		if(settingi.startsWith('!')) {
			const setting = settingi.replace(/^[!]/, '');
			conn.run("delete from user_settings where username = ? and key = ?", [ip_check(req), setting], e => 
				curs.execute("insert into user_settings (username, key, value) values (?, ?, ?)", [ip_check(req), setting, req.body[setting] ? '1' : '0']));
			userset[ip_check(req)][setting] = req.body[setting] ? '1' : '0';
		} else {
			const setting = settingi;
			if(!req.body[setting]) continue;
			conn.run("delete from user_settings where username = ? and key = ?", [ip_check(req), setting], e => 
				curs.execute("insert into user_settings (username, key, value) values (?, ?, ?)", [ip_check(req), setting, req.body[setting]]));
			userset[ip_check(req)][setting] = req.body[setting];
		}
	}
	
	try{if(req.body['skin'] != currentSkin && require('./skins/' + getSkin(req) + '/config.json')['type'].toLowerCase() == 'opennamu-seed') {
		const dc = fs.readFileSync('./skins/' + getSkin(req) + '/dfltcolr.scl').toString();
		curs.execute("update user_settings set value = ? where key = 'color' and username = ?", [dc, ip_check(req)]);
		userset[ip_check(req)]['color'] = dc;
	}}catch(e) {
		curs.execute("update user_settings set value = ? where key = 'color' and username = ?", ['default', ip_check(req)]);
		userset[ip_check(req)]['color'] = 'default';
	}
	
	res.redirect('/member/mypage');
});