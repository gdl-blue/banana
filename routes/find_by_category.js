// 여러개 분류 지원!

wiki.get('/FindByCategories', async (req, res) => {
	const categoryCount = req.query['count'];
	
	if(!categoryCountres) {
		res.send(await render(req, '분류로 문서 찾기', `
			<form method=get>
				<
			</form>
		`, _, _, _, 'find_by_categories'));
	}
});