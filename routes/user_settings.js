wiki.get('/Customize', async function memberSettings(req, res) {
	const defskin = config.getString('default_skin', hostconfig['skin']);
	const myskin  = getCookie(req, res, 'ddochi', defskin);
	const mycolor = getCookie(req, res, 'timecosmos', await getScheme(req));
	
	var dsop = `
		<option value="${defskin}" ${'x' == defskin ? 'selected' : ''}>기본값 (${defskin})</option>
	`;
	
	for(skin of getSkins()) {
		dsop += `<option value="${skin}" ${myskin == skin ? 'selected' : ''}>${skin}</option>`;
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
				<h2 class=wiki-heading>동작</h2>
				<div class=wiki-heading-content>
					<div class=form-group>
						<h4 class=wiki-heading>스크립트</h4>
						<div class=wiki-heading-content>
							<label><input type=checkbox id=noscriptDiscussInput name=no-discuss-script ${req.cookies['no-discuss-script'] ? 'checked' : ''} /> 토론 페이지에서 스크립트 의존 안함</label><br />
							<label><input type=checkbox id=noscriptUploadInput name=no-upload-script ${req.cookies['no-upload-script'] ? 'checked' : ''} /> 파일 업로드 페이지에서 스크립트 의존 안함</label><br />
						</div>
					</div>
					
					<div class=form-group>
						<h4 class=wiki-heading>토론 기능</h4>
						<div class=wiki-heading-content>
							<label><input type=checkbox id=alwaysHideResInput name=always-hide-hidden-res ${req.cookies['always-hide-hidden-res'] ? 'checked' : ''} /> 항상 숨겨진 댓글 보이지 않기</label><br />
						</div>
					</div>
				</div>
			</div>
			
			<div class=form-group id=displayGroup>
				<h2 class=wiki-heading>디스플레이</h2>
				<div class=wiki-heading-content>
					<div class=form-group fgv>
						<h4 class=wiki-heading>테마 ${islogin(req) ? '<sub>(비로그인 시에만 적용됩니다. 내 정보 페이지에서 바꾸십시오.)</sub>' : ''}</h4>
						<div class=wiki-heading-content>
							<div class=form-group>
								<label>스킨: </label><br>
								<select class=form-control name=ddochi id=skinSelect>
									${dsop}
								</select>
							</div>
						</div>
					</div>
					
					<div class=form-group id=accessibilityGroup>
						<h4 class=wiki-heading>접근성</h4>
						<div class=wiki-heading-content>
							<div class=form-group>
								<label><input type=checkbox id=hideStrikethroughInput name=hide-strikethrough ${req.cookies['hide-strikethrough'] ? 'checked' : ''} /> 취소선 숨기기</label><br />
								<label><input type=checkbox id=unboldInput name=unbold ${req.cookies['unbold'] ? 'checked' : ''} /> 굵은 글씨 속성 해제</label><br />
								<label><input type=checkbox id=unitalicInput name=unitalic ${req.cookies['unitalic'] ? 'checked' : ''} /> 기울임 글씨 속성 해제</label><br />
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<div class=form-group id=debugGroup>
				<h2 class=wiki-heading>개발 및 디버깅</h2>
				<div class=wiki-heading-content>
					<div class=form-group>
						<h4 class=wiki-heading>통신</h4>
						<div class=wiki-heading-content>
							<div class=form-group>
								<label><input type=checkbox name=space-bonefish ${req.cookies['space-bonefish'] ? 'checked' : ''} /> 오류에 관계없이 200 코드 반환</label><br>
							</div>
						</div>
					</div>
					
					<div class=form-group>
						<h4 class=wiki-heading>스크립트</h4>
						<div class=wiki-heading-content>
							<div class=form-group>
								<label><input type=checkbox name=bioking ${req.cookies['bioking'] ? 'checked' : ''} /> jQuery를 불러올 때 압축되지 않은 버전 불러오기</label><br>
							</div>
						</div>
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
	for(setting of ['ddochi', 'no-discuss-script', 'no-upload-script', 'always-hide-hidden-res', 'hide-strikethrough', 'unbold', 'unitalic', 'space-bonefish', 'bioking']) {
		const val = req.body[setting];
		if(!val) {
			res.clearCookie(setting);
		} else {
			res.cookie(setting, val, {
				maxAge: 1000 * 60 * 60 * 24 * 365
			});
		}
	}
	
	res.redirect('/Customize');
});