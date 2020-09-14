wiki.get('/License', async function(req, res) {
	var sl = '';
	try {
		sl = await readFile('./skins/' + getSkin(req) + '/license.html');
	} catch(e) {
		sl = '(스킨 라이선스를 불러올 수 없습니다.)';
	}

	res.send(await render(req, '바나나 정보', `
		<h2>바나나 ${versionInfo.major}.${versionInfo.minor}.${versionInfo.revesion}</h2>
		<p>임시적으로 GNU 일반 공중 사용 허가서 버전 3을 사용합니다.</p>
		
		${sl}
	`));
});