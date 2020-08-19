wiki.get('/Upload', async function fileUploadPage(req, res) {
	if(config.getString('allow_upload', '1') == '0') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	await curs.execute("select license from filelicenses order by license");
	const licelst = curs.fetchall();
	await curs.execute("select category from filecategories order by category");
	const catelst = curs.fetchall();
	
	var liceopts = '', cateopts = '';
	
	for(var lice of licelst) {
		liceopts += `<option>${html.escape(lice['license'])}</option>`;
	}
	for(var cate of catelst) {
		cateopts += `<option>${html.escape(cate['category'])}</option>`;
	}
	
	var content = '';
	
	if(!req.query['nojs'] && compatMode(req)) {
		res.redirect('/Upload?nojs=1');
		return;
	}
	
	if(!req.query['nojs'] || (req.query['nojs'] && req.query['nojs'] != '1')) {
		content = `
			<form class=file-upload-form method=post id=usingScript enctype="multipart/form-data">
				<div class=form-group>
					<label>화일 선택: </label><br>
					<input class=form-control type=file name=file>
				</div>

				<div class=form-group>
					<label>사용할 화일 이름: </label><br>
					<input class=form-control type=text name=document>
				</div>

				<div class=form-group>
					<label>화일 정보: </label><br>
					<div style="width: 140px; display: inline-block; float: left;">
						<select id=propertySelect class=form-control size=5 placeholder="직접 입력" style="height: 400px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; borde-right: none;">
							<option value=1 selected>출처</option>
							<option value=2>저작자</option>
							<option value=3>만든 이</option>
							<option value=4>날짜</option>
							<option value=5>메모</option>
						</select>
					</div>
					
					<div style="width: calc(100% - 140px); display: inline-block; float: right;">
						<textarea name=prop1 data-id=1 class="form-control property-content" style="height: 400px; border-top-left-radius: 0px; border-bottom-left-radius: 0px;"></textarea>
						<textarea name=prop2 data-id=2 class="form-control property-content" style="display: none; height: 400px; border-top-left-radius: 0px; border-bottom-left-radius: 0px;"></textarea>
						<textarea name=prop3 data-id=3 class="form-control property-content" style="display: none; height: 400px; border-top-left-radius: 0px; border-bottom-left-radius: 0px;"></textarea>
						<textarea name=prop4 data-id=4 class="form-control property-content" style="display: none; height: 400px; border-top-left-radius: 0px; border-bottom-left-radius: 0px;"></textarea>
						<textarea name=prop5 data-id=5 class="form-control property-content" style="display: none; height: 400px; border-top-left-radius: 0px; border-bottom-left-radius: 0px;"></textarea>
					</div>
				</div>

				<div class=form-group>
					<div style="width: 49.5%; display: inline-block; float: left;">
						<label>분류:</label><br>
						<input style="border-bottom-right-radius: 0px; border-bottom-left-radius: 0px; border-bottom: none;" data-datalist=categorySelect class="form-control dropdown-search" type=text name=category placeholder="목록에 없으면 이곳에 입력하십시오">
						<select style="height: 170px; border-top-right-radius: 0px; border-top-left-radius: 0px;" id=categorySelect class="form-control input-examples" size=8>
							${cateopts}
						</select>
					</div>
					
					<div style="width: 49.5%; display: inline-block; float: right;">
						<label>저작권:</label><br>
						<input style="border-bottom-right-radius: 0px; border-bottom-left-radius: 0px; border-bottom: none;" data-datalist=licenseSelect class="form-control dropdown-search" type=text name=license placeholder="목록에 없으면 이곳에 입력하십시오">
						<select style="height: 170px; border-top-right-radius: 0px; border-top-left-radius: 0px;" id=licenseSelect class="form-control input-examples" size=8>
							${liceopts}
							<option>제한적 이용</option>
						</select>
					</div>
				</div>

				<div class=btns>
					<button type=submit class="btn btn-primary" style="width: 100px;">올리기</button>
				</div>
			</form>`;
	} else {
		content = `
			<form method=post enctype="multipart/form-data">
				<div class=form-group>
					<label>화일 선택: </label><br>
					<input class=form-control type=file name=file>
				</div>

				<div class=form-group>
					<label>사용할 화일 이름: </label><br>
					<input class=form-control type=text name=document>
				</div>

				<div class=form-group>
					<label>출처: </label><br>
					<textarea name=prop1 class=form-control rows=3></textarea>
				</div>

				<div class=form-group>
					<label>저작자: </label><br>
					<textarea name=prop2 class=form-control rows=3></textarea>
				</div>

				<div class=form-group>
					<label>만든 이: </label><br>
					<textarea name=prop3 class=form-control rows=3></textarea>
				</div>

				<div class=form-group>
					<label>날짜: </label><br>
					<textarea name=prop4 class=form-control rows=3></textarea>
				</div>

				<div class=form-group>
					<label>메모: </label><br>
					<textarea name=prop5 class=form-control rows=3></textarea>
				</div>

				<div class=form-group>
					<label>분류: <span style="color: gray; float: right;">분류를 추가하려면 자바스크립트가 지원되어야 합니다.</span></label><br>
					<select name=category id=categorySelect class="form-control input-examples" size=8 placeholder="직접 입력">
						${cateopts}
					</select>
				</div>

				<div class=form-group>
					<label>저작권: <span style="color: gray; float: right;">라이선스를 추가하려면 자바스크립트가 지원되어야 합니다.</span></label><br>
					<select name=license id=licenseSelect class="form-control input-examples" size=8 placeholder="직접 입력">
						${liceopts}
						<option>제한적 이용</option>
					</select>
				</div>

				<div class=btns>
					<button type=submit class="btn btn-primary" style="width: 100px;">올리기</button>
				</div>
			</form>
		`;
	}
	
	if(!req.query['nojs']) {
		content += `
			<noscript>
				<meta http-equiv=refresh content="0; url=?nojs=1" />
			</noscript>
		`;
	}
	
	res.send(await render(req, '그림 올리기', content, {}, _, _, 'upload'));
});

wiki.post('/Upload', async function saveFile(req, res) {
	if(config.getString('allow_upload', '1') == '0') {
		res.send(await showError(req, 'disabled_feature'));
		return;
	}
	
	const file = req.files['file'];
	
	var content = `[include(틀:이미지 라이선스/${req.body['license']})]\n[[분류:파일/${req.body['category']}]]\n\n` + req.body['text'];
	
	/*
		'files': ['filename', 'prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'license', 'category']
		'filehistory': ['filename', 'prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'license', 'category', 'username', 'editor']
		'filelicenses': ['license', 'creator']
		'filecategories': ['category', 'creator']
	*/
	
	const fn = req.body['document'] + path.extname(file.name);
	
	await curs.execute("select filename from files where filename = ?", [fn]);
	if(curs.fetchall().length) {
		req.send(await showError(req, 'file_already_exists'));
		return;
	}
	
	file.mv('./images/' + sha3(req.body['document']) + path.extname(file.name), async function moveToServer(err) {
		await curs.execute("select license from filelicenses where license = ?", [req.body['license']]);
		if(!curs.fetchall().length) {
			await curs.execute("insert into filelicenses (license, creator) values (?, ?)", [req.body['license'], ip_check(req)]);
		}
		
		await curs.execute("select category from filecategories where category = ?", [req.body['category']]);
		if(!curs.fetchall().length) {
			await curs.execute("insert into filecategories (category, creator) values (?, ?)", [req.body['category'], ip_check(req)]);
		}
		
		await curs.execute("insert into files (filename, prop1, prop2, prop3, prop4, prop5, license, category) values (?, ?, ?, ?, ?, ?, ?, ?)", [fn, req.body['prop1'], req.body['prop2'], req.body['prop3'], req.body['prop4'], req.body['prop5'], req.body['license'], req.body['category']]);
		await curs.execute("insert into filehistory (filename, prop1, prop2, prop3, prop4, prop5, license, category, username, rev) values (?, ?, ?, ?, ?, ?, ?, ?, ?, '1')", [fn, req.body['prop1'], req.body['prop2'], req.body['prop3'], req.body['prop4'], req.body['prop5'], req.body['license'], req.body['category'], ip_check(req)]);
		
		res.redirect('/file/' + encodeURIComponent(req.body['document']));
	});
});