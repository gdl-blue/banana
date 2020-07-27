wiki.get('/member/logout', async function logout(req, res) {
	var desturl = req.query['redirect'];
	if(!desturl) desturl = '/';
	
	req.session.username = undefined;
	
	res.redirect(desturl);
});