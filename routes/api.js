wiki.get(/^\/api\/v(\d+)\/(.*)/, (req, res, next) => {
	const ver = Number(req.params[0]) || 0;
	var validVersions = [1, 2, 3, 4, 5];
	if(validVersions.includes(ver)) {
		if(config.getString('enable_apiv' + (Number(ver) || 0), '1') == '1') {
			return next();
		} else {
			return res.json({
				state: 'disabled_api_version',
				message: '관리자가 이 버전의 API를 활성화하지 않았습니다.'
			});
		}
	}
	
	res.json({
		state: 'invalid_api_version',
		message: 'API 버전이 올바르지 않습니다.'
	});
});
