wiki.get(/^\/backlink\/(.*)/, (req, res) => res.redirect('/xref/' + encodeURIComponent(req.params[0])));
wiki.get(/^\/xref\/(.*)/, async (req, res) => {
	const title = req.params[0];
	const flag  = req.query['flag'];
	const _type = (
		flag ? (
			flag == '1' ? (
				'link'
			) : (
				flag == '2' ? (
					'file'
				) : (
					undefined
				)
			)
		) : (
			req.query['type']
		)
	);
	const type = _type ? _type : 'link';
	
	var content = `
		<form method=get>
			<div class=form-inline>
				<div class=form-group>
					<label class=control-label>유형: </label>
					<div>
						<select class=form-control name=type>
							<option value=link ${type == 'link' ? 'selected' : ''}>링크</option>
							<option value=category ${type == 'category' ? 'selected' : ''}>분류</option>
							<option value=file ${type == 'file' ? 'selected' : ''}>파일</option>
						</select>
					</div>
				</div>
				
				<button type=submit class="btn btn-info">이동</button>
			</div>
		</form>
		
		<div class=multicol>
			<ul class=wiki-list>
	`;
	
	const dbdata = await curs.execute("select title from backlink where link = ?", [title]);
	for(doc of dbdata) {
		content += `
			<li>
				<a href="/w/${encodeURIComponent(doc.title)}">${html.escape(doc.title)}</a>
			</li>
		`;
	}
	
	content += `
			</ul>
		</div>
	`;
	
	res.send(await render(req, title, content, {}, '의 역링크', _, 'xref'));
});