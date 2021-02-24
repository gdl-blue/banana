wiki.get('/admin/custom_acl', async(req, res) => {
	const acltyp = config.getString('acl_type', 'action-based');
    
    switch(acltyp) {
        case 'action-based':
			var content = `
				<form method=put class=settings-section>
					<div>
						<label>ACL 이름:</label><br />
						<input type=text class=form-control id=nameInput name=name />
					</div>
					
					<div class=btns>
						<button type=submit class="btn btn-info" style="width: 100px;">추가</button>
					</div>
				</form>
			`;
			
			// 'ab_customacl': ['aclid', 'id', 'type', 'condition', 'action', 'expiration', 'subwikiid'],
			var dbdata = await (curs.execute("select aclid, id, type, condition, action, expiration, subwikiid from ab_customacl where ((title like '사용자:%') or (subwikiid = ? and not title like '사용자:%')) order by aclid asc", [(title.startsWith('사용자:') ? '' : subwiki(req))]));
			var data = {};
			for(var item of dbdata) {
				if(!data[item.aclid]) data[item.aclid] = [];
			}
			
			for(var item of acls) {
				
			}
			
			return res.send(await render(req, '사용자 지정 ACL', content));
		break; default:
			const fn = (await require('./plugins/' + acltyp + '/index.js').codes.custom;
			if(!fn) return res.send(await showError(req, 'disabled_feature'));
            return fn(req, res));
});
