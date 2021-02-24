// 호환용.
wiki.get('/sidebar.json', (req, res) => {
	curs.execute("select time, title from history order by cast(time as integer) desc limit 1000")
	.then(async dbdata => {
		var ret = [], cnt = 0, used = [];
		for(var item of dbdata) {
			if(used.includes(item.title)) continue;
			used.push(item.title);
			
			const del = (await curs.execute("select title from documents where title = ?", [item.title])).length;
			ret.push({
				document: item.title,
				status: (del ? 'normal' : 'delete'),
				date: Number(item.time) / 1000
			});
			cnt++;
			if(cnt > 20) break;
		}
		res.json(ret);
	})
	.catch(e => {
		print(e.stack);
		res.json('[]');
	});
});
