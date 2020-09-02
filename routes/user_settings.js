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
			
			<div class=form-group id=debugGroup>
				<h2 class=tab-page-title>개발 및 디버깅</h2>
				
				<div class=form-group>
					<h4>통신</h4>
					<div class=form-group>
						<label><input type=checkbox name=space-bonefish /> 오류에 관계없이 200 코드 반환</label><br>
					</div>
				</div>
				
				<div class=form-group>
					<h4>스크립트</h4>
					<div class=form-group>
						<label><input type=checkbox name=bioking /> jQuery를 불러올 때 압축되지 않은 버전 불러오기</label><br>
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

wiki.post('/Customize', async function saveSettings(req, res) {
	for(setting in req.body) {
		res.cookie(setting, req.body[setting]);
	}
	
	res.redirect('/Customize');
});