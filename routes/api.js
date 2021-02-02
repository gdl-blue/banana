wiki.post(/^\/api\/v(\d+)\/(.*)/, (req, res, next) => {
	if(config.getString('enable_apipost', '1') != '1') {
		return res.status(403).json({
			state: 'api_post_disabled',
			message: '관리자가 API에서 POST 요청을 할 수 없게 설정했습니다.'
		});
	}
	
	next();
});

wiki.get(/^\/api\/v(\d+)\/(.*)/, (req, res, next) => {
	const ver = Number(req.params[0]) || 0;
	var validVersions = [1, 2, 3, 4, 5];
	if(validVersions.includes(ver)) {
		if(config.getString('enable_apiv' + (Number(ver) || 0), '1') == '1') {
			return next();
		} else {
			return res.status(403).json({
				state: 'disabled_api_version',
				message: '관리자가 이 버전의 API를 활성화하지 않았습니다.'
			});
		}
	}
	
	res.status(400).json({
		state: 'invalid_api_version',
		message: 'API 버전이 올바르지 않습니다.'
	});
});
