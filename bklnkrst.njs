const sqlite3 = require('sqlite3').verbose();
const conn = new sqlite3.Database('./wikidata.db', (err) => {});

conn.query = function (sql, params) {
	var that = this;
	return new Promise(function (resolve, reject) {
		that.all(sql, params, function asyncSQLRun(error, rows) {
			if(error) {
				print(error);
				resolve(-1);
			} else {
				resolve(rows);
			}
		});
	});
};

conn.exec = function (sql, params) {
	var that = this;
	return new Promise(function (resolve, reject) {
		that.run(sql, params, function asyncSQLRun(error) {
			if(error) {
				print(error);
				resolve(-1);
			} else {
				resolve(0);
			}
		});
	});
};

conn.commit = function() {};
conn.sd = [];

const curs = {
	execute: async function executeSQL(sql = '', params = [], noerror = false) {
		if((sql).toUpperCase().startsWith("SELECT")) {
			const retval = await conn.query(sql, params);
			conn.sd = retval;
			
			return retval;
		} else {
			await conn.exec(sql, params);
		}
		
		return [];
	},
	fetchall: function fetchSQLData() {
		return conn.sd;
	}
};

const html = {
	escape: function(content = '') {
		content = content.replace(/[&]/gi, '&amp;');
		content = content.replace(/["]/gi, '&quot;');
		content = content.replace(/[<]/gi, '&lt;');
		content = content.replace(/[>]/gi, '&gt;');
		
		return content;
	}
};

const print = console.log;

function JSnamumark(title, content, initializeBacklinks = 0) {
	return new Promise((resolve, reject) => {
		try {(new (require('js-namumark'))(title, {
			wiki: {
				read: title => content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/{{{[#][!]html/gi, '{{{')
			},
			allowedExternalImageExts: [ 'jpg', 'jpeg', 'bmp', 'gif', 'png' ]
		})).parse(async (e, r) => {
			if(e) {
				print(e.stack);
				reject(e);
				return;
			}
			
			var htmlc = r['html'];
			
			htmlc = htmlc.replace(
				/\<div class=\"wiki[-]toc\" id=\"wiki[-]toc\"\>\<div class=\"wiki[-]toc[-]heading\"\>목차\<\/div\>((\<div class=\"wiki[-]toc[-]item wiki[-]toc[-]item[-]indent[-](\d+)\"\>\<a href=\"[#]heading[-](\d+)\"\>(\d+)[.]\<\/a\> (((?!\<\/div\>).)*)\<\/div\>)*)\<\/div\>\<\/div\>/g
				, '<div class=wiki-toc id=toc><div class=wiki-toc-heading>목차</div>$1</div>'
			);
			
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
			
			// 이미지에 링크 추가
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
			
			htmlc = document.documentElement.outerHTML;
			
			var ctgr = '';
			
			for(cate of r['categories']) {
				ctgr += `
					<li class=wiki-link-internal><a class=wiki-internal-link href="/w/${encodeURIComponent('분류:' + cate)}">${html.escape(cate)}</a></li>
				`;
			}
			
			if(initializeBacklinks) {
				curs.execute("delete from backlink_category where title = ?", [title])
				.then(x => {
					for(cate of r['categories']) {
						curs.execute("insert into backlink_category (title, category) values (?, ?)", [title, cate]);
					}
				})
				.catch(console.error);
				
				curs.execute("delete from backlink where title = ?", [title])
				.then(x => {
					qa('a.wiki-internal-link', el => {
						try {
							curs.execute("insert into backlink (title, link) values (?, ?)", [title, el.getAttribute('href').replace(/^\/wiki\//, '')]);
						} catch(e) {
							print(e.stack);
						}
					});
				})
				.catch(console.error);
			}
			
			if(ctgr.length) {
				ctgr = '<div class=wiki-category><h2>문서 분류</h2><ul>' + ctgr + '</ul></div>';
			}
			
			resolve(ctgr + htmlc);
		});
		} catch(e) {
			print(e.stack);
			resolve('<렌더링에 실패했읍니다 - ' + e + '>');
		}
	});
}

curs.execute("select title, content from documents").then(data => {
	for(doc of data) {
		JSnamumark(doc.title, doc.content, 1);
	}
});