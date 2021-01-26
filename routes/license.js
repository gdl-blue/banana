wiki.get('/License', async function(req, res) {
	var sl = '';
	var m, p;
	try {
		sl = await readFile('./skins/' + getSkin(req) + '/license.html');
	} catch(e) {
		sl = '(스킨 라이선스를 불러올 수 없습니다.)';
	}

	res.send(await render(req, '바나나 정보', `
		<h2>
			${versionInfo.codename} (버전 ${versionInfo.major}.${versionInfo.minor}.${versionInfo.build}.${versionInfo.revision})
			<small>${(p = versionInfo.revision) > 0 ? ('(수정 ' + p + ')') : ''}</small>
		</h2>
		<p>자세한 내용은 <a href="https://github.com/turbo-whistler/banana">여기</a>를 참조하십시오.
		
		${sl}
	`));
});