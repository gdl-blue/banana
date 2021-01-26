wiki.get(/^\/internal\/(.*)/, (req, res) => res.redirect('/api/v4/' + req.params[0]));

wiki.get(/^\/api\/v4\/(.*)/, (req, res) => res.json({
	state: 'not_supported',
	description: '타 위키 엔진 호환용 API는 아직 지원하지 않습니다.'
}));
