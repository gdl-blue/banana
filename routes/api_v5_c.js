wiki.get(/\/api\/(.*)/, (req, res, next) => {
	if(req.params[0].match(/^v(\d+)/)) return next();
	res.redirect('/api/v5/' + req.params[0]);
});

wiki.get(/\/api\/v5\/(.*)/, (req, res) => res.json({
	state: 'not_supported',
	description: '타 위키 엔진 호환용 API는 아직 지원하지 않습니다.'
}));
