// windowed 및 기타 스킨 호환용

wiki.get('/api/recent_changes', function(req, res) {
	res.redirect('/api/v5/recent_changes');
});