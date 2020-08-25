wiki.get(/^\/w\/(.*)/, async function viewDocument(req, res) {
	const title = req.params[0];
	
	if(title.replace(/\s/g, '') == '') res.redirect('/w/' + config.getString('front_page'));
	
	await curs.execute("select content from documents where title = ?", [title]);
	var rawContent = curs.fetchall();

	var content = '';
	
	var httpstat = 200;
	var viewname = 'wiki';
	var error = false;
	
	var isUserDoc = false;
	
	var lstedt = undefined;
	
	var rev = undefined;
	
	var end = 0;
	
	try {
		if(!await getacl(req, title, 'read')) {
			httpstat = 403;
			error = true;
			res.status(403).send(await showError(req, 'insufficient_privileges_read'));
			
			return;
		} else {
			if(req.query['rev']) {
				rev = req.query['rev'];
				
				await curs.execute("select content from history where rev = ? and title = ?", [rev, title]);
				rawContent = curs.fetchall();
				
				if(!rawContent.length) {
					res.send(await showError(req, 'rev_not_found'));
					return;
				}
			}
			
			// content = markdown(rawContent[0]['content']);
			
			var chk = 0;
			
			return new Promise((resolve, reject) => {
				(new (require('js-namumark'))(title, {
					wiki: {
						// CR LF 안고치니까 문단 렌더링이 안 됐네..
						read: title => rawContent[0]['content'].replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/{{{[#][!]html/gi, '{{{')
					},
					allowedExternalImageExts: [ 'jpg', 'jpeg', 'bmp', 'gif', 'png' ]
				})).parse(async (e, r) => {
					if(e) {
						res.send(await showError(req, 'renderer_error'));
						reject(e);
						chk = 1;
						return;
					}
					
					var htmlc = r['html'];
					
					// 목차 버그 수정
					htmlc = htmlc.replace(
						/\<div class=\"wiki[-]toc\" id=\"wiki[-]toc\"\>\<div class=\"wiki[-]toc[-]heading\"\>목차\<\/div\>((\<div class=\"wiki[-]toc[-]item wiki[-]toc[-]item[-]indent[-](\d+)\"\>\<a href=\"[#]heading[-](\d+)\"\>(\d+)[.]\<\/a\> (((?!\<\/div\>).)*)\<\/div\>)*)\<\/div\>\<\/div\>/g
						, '<div class=wiki-toc id=toc><div class=wiki-toc-heading>목차</div>$1</div>'
					);
					
					// https://stackoverflow.com/questions/1801160/can-i-use-jquery-with-node-js
					const jsdom = require("jsdom");
					const { JSDOM } = jsdom;
					const { window } = new JSDOM();
					const { document } = (new JSDOM(htmlc)).window;
					const $ = jQuery = require('jquery')(window);
					
					const qa = (q, f) => {
						for(el of document.querySelectorAll(q)) {
							f(el);
						}
					};
					
					qa('img', img => {
						const $img = $(img);
						
						if(!$img.attr('src')) return;
						const filename = decodeURIComponent($img.attr('src').replace(/^\/file\//, ''));
						$img.wrap('<a href="/files/' + encodeURIComponent(filename) + '"></a>');
						
						img.outerHTML = $img[0].outerHTML;
					});
					
					qa('h1 a[href="#wiki-toc"], h2 a[href="#wiki-toc"], h3 a[href="#wiki-toc"], h4 a[href="#wiki-toc"], h5 a[href="#wiki-toc"], h6 a[href="#wiki-toc"]', hlink => {
						hlink.setAttribute('href', '#toc');
						const $heading = $(hlink).parent();
						
						$heading.attr('class', 'wiki-heading');
						const hnum = $heading.attr('id').replace('heading-', '');
						$heading.attr('id', 's-' + hnum);
						
						hlink.parentNode.outerHTML = $heading[0].outerHTML;
					});
					
					qa('div.wiki-toc#wiki-toc', t => t.setAttribute('id', 'toc'));
					
					/*
					var $html = $(htmlc);
					
					// 이미지에 링크 추가
					$html.find('img').each(function() {
						const $img = $(this);
						if(!$img.attr('src')) return;
						const filename = decodeURIComponent($img.attr('src').replace(/^\/file\//, ''));
						// print(filename)
						// print('<a href="/files/' + encodeURIComponent(filename) + '"></a>')
						$img.wrap('<a href="/files/' + encodeURIComponent(filename) + '"></a>');
						// print($img.parent()[0].outerHTML)
					});
					
					// #wiki-toc => #toc
					$html.find('h1 a[href="#wiki-toc"], h2 a[href="#wiki-toc"], h3 a[href="#wiki-toc"], h4 a[href="#wiki-toc"], h5 a[href="#wiki-toc"], h6 a[href="#wiki-toc"]').each(function() {
						const $heading = $(this).parent();
						$(this).attr('href', '#toc');
						
						$heading.attr('class', 'wiki-heading');
						const hnum = $heading.attr('id').replace('heading-');
						$heading.attr('id', 's-' + hnum);
					});
					
					$html.find('div.wiki-toc#wiki-toc').attr('id', 'toc');
					
					htmlc = $html.wrap('<div></div>').parent().html();
					*/
					
					// print(rawContent[0]['content']);
					// print("=====================");
					// print(htmlc);
					
					htmlc = document.documentElement.outerHTML;
					
					var ctgr = '';
					
					for(cate of r['categories']) {
						ctgr += `
							<li class=wiki-link-internal>${html.escape(cate)}</li>
						`;
					}
					
					if(ctgr.length) {
						ctgr = '<div class=wiki-category><h2>문서 분류</h2><ul>' + ctgr + '</ul></div>';
					}
					
					content = ctgr + htmlc;
					
					if(title.startsWith("사용자:") && await ban_check(req, 'author', title.replace(/^사용자[:]/, ''))) {
						content = `
							<div style="border-width: 5px 1px 1px; border-style: solid; border-color: red gray gray; padding: 10px; margin-bottom: 10px;" onmouseover="this.style.borderTopColor=\'blue\';" onmouseout="this.style.borderTopColor=\'red\';">
								<span style="font-size: 14pt;">이 사용자는 관리자에 의해 차단되었습니다.</span><br>
								차단 사유:
							</div>
						` + content;
					}
					
					if(title.startsWith("사용자:") && (getperm('admin', title.replace(/^사용자[:]/, '')) || getperm('fake_admin', title.replace(/^사용자[:]/, '')))) {
						content = `
							<div style="border-width: 5px 1px 1px; border-style: solid; border-color: orange gray gray; padding: 10px; margin-bottom: 10px;" onmouseover="this.style.borderTopColor=\'${getperm('admin', title.replace(/^사용자[:]/, '')) ? 'red' : 'blue'}\';" onmouseout="this.style.borderTopColor=\'orange\';">
								<span style="font-size: 14pt;">이 사용자는 특수 권한을 가지고 있습니다.</span>
							</div>
						` + content;
					}
					
					await curs.execute("select time from history where title = ? order by cast(rev as integer) desc limit 1", [title]);
					lstedt = Number(curs.fetchall()[0]['time']);
					
					if(title.startsWith('사용자:')) isUserDoc = true;
		
					res.status(httpstat).send(await render(req, title, content, {
						star_count: 0,
						starred: false,
						date: lstedt,
						user: isUserDoc,
						category: [],
						discuss_progress: 0,
						rev: rev,
						st: 1
					}, _, error, viewname));
					
					chk = 1;
					
					resolve(1);
				});
			});
			
			if(chk) return;
			
			if(title.startsWith("사용자:") && await ban_check(req, 'author', title.replace(/^사용자[:]/, ''))) {
				content = `
					<div style="border-width: 5px 1px 1px; border-style: solid; border-color: red gray gray; padding: 10px; margin-bottom: 10px;" onmouseover="this.style.borderTopColor=\'blue\';" onmouseout="this.style.borderTopColor=\'red\';">
						<span style="font-size: 14pt;">이 사용자는 관리자에 의해 차단되었습니다.</span><br>
						차단 사유:
					</div>
				` + content;
			}
			
			if(title.startsWith("사용자:") && (getperm('admin', title.replace(/^사용자[:]/, '')) || getperm('fake_admin', title.replace(/^사용자[:]/, '')))) {
				content = `
					<div style="border-width: 5px 1px 1px; border-style: solid; border-color: orange gray gray; padding: 10px; margin-bottom: 10px;" onmouseover="this.style.borderTopColor=\'${getperm('admin', title.replace(/^사용자[:]/, '')) ? 'red' : 'blue'}\';" onmouseout="this.style.borderTopColor=\'orange\';">
						<span style="font-size: 14pt;">이 사용자는 특수 권한을 가지고 있습니다.</span>
					</div>
				` + content;
			}
			
			await curs.execute("select time from history where title = ? order by cast(rev as integer) desc limit 1", [title]);
			lstedt = Number(curs.fetchall()[0]['time']);
		}
	} catch(e) {
		end = 1;
		
		viewname = 'notfound';
		
		print(`[오류!] ${e}`);
		
		httpstat = 404;
		content = `
			<h2>문서가 존재하지 않습니다. 새로 작성하려면 <a href="/edit/${encodeURIComponent(title)}">여기</a>를 클릭하십시오.</h2>
		`;
	}
	
	if(title.startsWith('사용자:')) isUserDoc = true;
	
	if(end) {
		res.status(httpstat).send(await render(req, title, content, {
			star_count: 0,
			starred: false,
			date: lstedt,
			user: isUserDoc,
			category: [],
			discuss_progress: 0,
			rev: rev,
			st: 1
		}, _, error, viewname));
	}
});