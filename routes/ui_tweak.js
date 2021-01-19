wiki.get('/member/tweak_ui', async(req, res) => {
	if(!islogin(req)) return res.redirect('/member/login?redirect=%2Fmember%2Ftweak_ui');
	
	var popt = '';
	for(preset of (await readdir('./uifile', 'dir'))) {
		popt += `<option value="${preset}">${((parseINI(await readFile('./uifile/' + preset + '/config.ini', 1))['preset'] || {})['displayname']) || preset}</option>`;
	}
	
	const content = `
		<noscript>
			${alertBalloon('[오류!]', '이 기능은 자바 스크립트가 켜져있어야만 작동합니다.', 'danger', 0)}
		</noscript>
	
		<div class=form-group>
			<label>프리셋: </label><br />
			<select name=preset class=form-control>
				${popt}
			</select>
			
			<div class=btns>
				<button type=button class="btn btn-secondary">불러오기</button>
				<button type=button class="btn btn-secondary">저장</button>
			</div>
		</div>
		
		<label>페이지: </label><br />
		<select class="form-control select-page" style="margin: 0 0 1rem 0;">
			<option value=upload>파일 올리기</option>
		</select>
		
		<div class=tab-content>
			<div class=tab-pane id=upload>
				<div class=form-group>
					<label>페이지 제목: </label><br />
					<input type=text name=upload-title class=form-control value="${html.escape(await rawui(req, 'upload-title'))}" />
				</div>
				
				<div class=form-group>
					<label>메인 UI: </label><br />
					<textarea type=text name=upload-main class=form-control pre rows=15>${html.escape(await rawui(req, 'upload-main'))}</textarea>
				</div>
				
				<div class=form-group>
					<label>메인 UI(자바 스크립트 없음): </label><br />
					<textarea type=text name=upload-main-fallback class=form-control pre rows=15>${html.escape(await rawui(req, 'upload-main-fallback'))}</textarea>
				</div>
				
				<div class=form-group>
					<label>라이선스 옵션 HTML: </label><br />
					<textarea type=text name=upload-license class=form-control pre>${html.escape(await rawui(req, 'upload-license'))}</textarea>
				</div>
				
				<div class=form-group>
					<label>분류 옵션 HTML: </label><br />
					<textarea type=text name=upload-category class=form-control pre>${html.escape(await rawui(req, 'upload-category'))}</textarea>
				</div>
			</div>
		</div>

		<div class=btns>
			<button type=submit class="btn btn-primary" style="width: 100px;">저장</button>
			<button type=button class="btn btn-secondary">프리셋에 등록</button>
		</div>
	`;

	res.send(await render(req, '인터페이스 사용자 지정', content));
});
