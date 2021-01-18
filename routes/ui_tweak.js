wiki.get('/member/tweak_ui', async(req, res) => {
	if(!islogin(req)) return res.redirect('/member/login?redirect=%2Fmember%2Ftweak_ui');
	
	const content = `
		<div class=form-group>
			<label>프리셋: </label><br />
			<select name=preset class=form-control>
				<option>바나나</option>
				<option>the seed</option>
			</select>
			
			<div class=btns>
				<button type=button class="btn btn-secondary">불러오기</button>
				<button type=button class="btn btn-secondary">저장</button>
			</div>
		</div>
		
		<div>
			<h4>파일 올리기</h4>
			
			<div class=form-group>
				<label>페이지 제목: </label><br />
				<input type=text name=upload-title class=form-control value="파일 올리기" />
			</div>
			
			<div class=form-group>
				<label>메인 UI: </label><br />
				<textarea type=text name=upload-main class=form-control pre rows=20>
				</textarea>
			</div>
			
			<div class=form-group>
				<label>라이선스 옵션 HTML: </label><br />
				<textarea type=text name=upload-license class=form-control pre>
				</textarea>
			</div>
			
			<div class=form-group>
				<label>분류 옵션 HTML: </label><br />
				<textarea type=text name=upload-category class=form-control pre>
				</textarea>
			</div>
		</div>

		<div class=btns>
			<button type=submit class="btn btn-primary" style="width: 100px;">저장</button>
			<button type=button class="btn btn-secondary">프리셋에 등록</button>
		</div>
	`;

	res.send(await render(req, '인터페이스 사용자 지정', content));
});
