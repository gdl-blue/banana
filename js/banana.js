/*
  참고한 싸이트
  - https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
*/

$(function() {
	/**
     * <호환성을 위해 다음 문법 사용 금지!>
	 
	 * 함수 인자 기본값("param = param || 기본값" 사용)
	 * 템플릿 문자열(`A의 값은 ${a}이다` 등 => 'A의 값은 ' + a + '이다')
	 * 화살표 함수("a => b" => "function(a) { return b; }")
	 * for(a of b) { ... } => for(ai in b) { const a = b[ai]; ... }
	 * async, await
	 * let 변수 선언 (var 사용. 차이점이 있는데 거의 비슷)
	 * const { ... } = <오브젝트>
	 */
	 
	if(typeof ActiveXObject == 'function' && !document.addEventListener) {
		document.addEventListener = function(evt, fnc) {
			if(evt == 'click') evt = 'onclick;'
			document.attachEvent(evt, fnc);
		};
	}
	
	$('head').append('<style id=hide-blind-res></style>');
	
	$('button#hideBlindRes').click(function() {
		$('button#hideBlindRes').attr('disabled', '');
		$('button#showBlindRes').removeAttr('disabled');
		$('style#hide-blind-res').text('div.res-wrapper[data-hidden="true"] { display: none; }');
	});
	
	$('button#showBlindRes').click(function() {
		$('button#showBlindRes').attr('disabled', '');
		$('button#hideBlindRes').removeAttr('disabled');
		$('style#hide-blind-res').text('');
	});
	
	function setCookie(name, val) {
		var d = new Date(); d.setDate(d.getDate()+365);
		document.cookie = escape(name) + '=' + escape(val) + ';'; /* + ';expires=' + d.toUTCString() + ';path=/'; */
	}

	function getCookie(name) {
		var ret;

		if(!document.cookie) return null;

		const c = document.cookie.split(escape(name) + '=');
		if(!(c.length >= 2)) return null;

		return unescape(c[1].split(';')[0]);
	}
	
	if(getCookie('time-cosmos') == '1') {
		$('input#alwaysHideBlindRes')[0].checked = true;
		
		$('button#hideBlindRes').attr('disabled', '');
		$('button#showBlindRes').removeAttr('disabled');
		$('style#hide-blind-res').text('div.res-wrapper[data-hidden="true"] { display: none; }');
	}
	
	$('input#alwaysHideBlindRes').change(function() {
		if(this.checked) {
			setCookie('time-cosmos', '1');
		} else {
			setCookie('time-cosmos', '0');
		}
	});
	
	$('.noscript-alert').remove();
	$('.for-script').show();
	
	$('isindex').replaceWith($('<form><label>검색: </label> <input type=text class=form-control name=isindex></form>'));
	
	if($(window).width() >= 460 && typeof(ActiveXObject) != 'function') {
		try {
			$('.vertical-tablist .tablist').show();
			$('.vertical-tablist .tab-content .tab-page').hide();
			$('.vertical-tablist .tab-content .tab-page')[0].style.display = '';
			$('.vertical-tablist .tab-content h2.tab-page-title').hide();
			$('.vertical-tablist .tablist .tab').removeAttr('active');
			$('.vertical-tablist .tablist .tab')[0].setAttribute('active', '');
			$('.vertical-tablist .tab-content .tab-page').css('height', '420px');
			
			$('.vertical-tablist .tablist .tab').click(function() {
				$('.vertical-tablist .tablist .tab').removeAttr('active');
				$(this).attr('active', '');
				
				$('.vertical-tablist .tab-content .tab-page').hide();
				$('.vertical-tablist .tab-content .tab-page[id="' + $(this).attr('data-paneid') + '"]').show();
			});
			
			$('div#config-apply-button').remove();
		} catch(e) {}
	}
	
	function nevermind() {
		return;
	}
	
	function isVisible(elmt) {
		if(typeof ActiveXObject == 'function') return true;
		
		var top = elmt.offsetTop;
		var left = elmt.offsetLeft;
		const width = elmt.offsetWidth;
		const height = elmt.offsetHeight;

		while(elmt.offsetParent) {
			elmt = elmt.offsetParent;
			top += elmt.offsetTop;
			left += elmt.offsetLeft;
		}

		return (
			top < (window.pageYOffset + window.innerHeight) &&
			left < (window.pageXOffset + window.innerWidth) &&
			(top + height) > window.pageYOffset &&
			(left + width) > window.pageXOffset
		);
	}
	
	const itoa = String;
	const atoi = Number;
	
	$('.input-examples').on('change click', function() {
		$(this).prev().val($(this).val());
	});
	
	$('#propertySelect').on('change click', function() {
		const id = $(this).val();
		$('textarea.property-content').hide();
		$('textarea[data-id="' + id + '"]').show();
	});
	
	$('.dropdown-search').on('propertychange change keyup paste input', function() {
		const items = document.querySelectorAll('#' + $(this).attr('data-datalist') + ' option');
		
		for(var itemidx in items) {
			const item = items[itemidx];
			if(!item.innerText.toUpperCase().startsWith($(this).val().toUpperCase())) {
				item.style.display = 'none';
			} else {
				item.style.display = '';
			}
		}
	});
	
	$('div.acl-controller button.addbtn').click(function() {
		const addbtn = $(this);
	
		$.ajax({
			type: "POST",
			data: {
				'action': addbtn.parent().parent().parent().attr('data-action'),
				'type': addbtn.parent().parent().parent().attr('data-acltype'),
				'value': addbtn.parent().prev().prev().prev().val(),
				'mode': 'add',
				'not': (addbtn.parent().parent().parent().attr('data-action') == 'allow') ? (addbtn.parent().prev().prev().find('> input').is(":checked") ? 'on' : undefined) : (addbtn.parent().prev().find('> input').is(":checked") ? 'on' : undefined),
				'high': (addbtn.parent().parent().parent().attr('data-action') == 'allow') ? (addbtn.parent().prev().find('> input').is(":checked") ? 'on' : undefined) : undefined
			},
			dataType: 'text',
			success: function aclAddSuccess(res) {
				addbtn.parent().parent().next().html(res);
			},
			error: function aclAddFail(e) {
				alert('ACL 추가에 실패했습니다.');
			}
		});
	});
	
	$('div.acl-controller button.delbtn').click(function() {
		const delbtn = $(this);
	
		$.ajax({
			type: "POST",
			data: {
				'action': delbtn.parent().parent().parent().attr('data-action'),
				'type': delbtn.parent().parent().parent().attr('data-acltype'),
				'value': delbtn.parent().parent().next().val(),
				'mode': 'remove',
				'not': delbtn.parent().prev().is(":checked")
			},
			dataType: 'text',
			success: function aclRemoveSuccess(res) {
				delbtn.parent().parent().next().html(res);
			},
			error: function aclRemoveFail(e) {
				alert('ACL 삭제에 실패했습니다.');
			}
		});
	});
	
	$('.tab-page#plugins button#enablePluginBtn').click(function() {
		$.ajax({
			type: "POST",
			url: '/api/v3/plugins/enable',
			data: {
				'name': $('.tab-page#plugins select#pluginList[size]').val()
			},
			dataType: 'json',
			success: function(d) {
				if(d.status == 'error') {
					alert('선택한 플러그인을 활성화하는 중 오류가 발생했습니다.');
					return;
				}
				$('select#pluginList[size] option:selected').css('text-decoration', 'none');
			},
			error: function(d) {
				alert('선택한 플러그인을 활성화하는 중 오류가 발생했습니다.');
			}
		});
	});
	
	$('.tab-page#plugins button#disablePluginBtn').click(function() {
		$.ajax({
			type: "POST",
			url: '/api/v3/plugins/disable',
			data: {
				'name': $('.tab-page#plugins select#pluginList[size]').val()
			},
			dataType: 'json',
			success: function(d) {
				if(d.status == 'error') {
					alert('선택한 플러그인을 비활성화하는 중 오류가 발생했습니다.');
					return;
				}
				$('select#pluginList[size] option:selected').css('text-decoration', 'line-through');
			},
			error: function(d) {
				alert('선택한 플러그인을 비활성화하는 중 오류가 발생했습니다.');
			}
		});
	});
	
	const allLoadingRes = 'div#res-container div.res-wrapper.res-loading[data-locked="false"]';
	const loadingRes = allLoadingRes + '[data-locked="false"]';
	
	function setVisibleState() {
		$(allLoadingRes).each(function() {
			const item = $(this);
			if(isVisible(item[0])) {
				item.attr('data-visible', 'true');
			} else {
				item.attr('data-visible', 'false');
			}
		});
	}
	
	document.addEventListener("scroll", setVisibleState);
	
	function fetchComments(tnum) {
		setVisibleState();
		
		$(loadingRes).each(function() {
			const item = $(this);

			if(item.attr('data-locked') != 'true') {
				item.attr('data-locked', 'true');
				
				$.ajax({
					type: "GET",
					url: '/thread/' + tnum + '/' + item.attr('data-id'),
					dataType: 'html',
					success: function(d) {
						const data = $(d);
						
						data.each(function() {
							const itm = $(this);
							const res = $('div.res-wrapper.res-loading[data-id="' + itm.attr('data-id') + '"]');
							
							res.after(itm);
							res.remove();
						});
	
						/* dateformatter.js 라이브러리 사용 - (C) 저작권자 Paul Armstrong / swig 라이브러리에 내장됨 */
						$('time[datetime]').each(function() {
							$(this).text(
								formatDate(new Date($(this).attr('datetime')), $(this).attr('data-format'))
							);
						});
					},
					error: function(e) {
						history.go(0);
					}
				});
			}
		});
	}
	
	function discussPollStart(tnum) {
		$('form#new-thread-form').submit(function() {
			var submitBtn = $('form#new-thread-form').find('button[type="submit"]');
			submitBtn.attr('disabled', '');
			submitBtn.text('대기 중...');
			
			$.ajax({
				type: "POST",
				dataType: 'json',
				data: {
					'text': $('textarea[name="text"]').val()
				},
				success: function(d) {
					submitBtn.removeAttr('disabled');
					submitBtn.text('전송하기!');
					$('textarea[name="text"]').val('');
				},
				error: function(d) {
					submitBtn.removeAttr('disabled');
					submitBtn.text('전송하기!');
					alert('댓글을 달 수 없습니다.');
				}
			});
			
			return false;
		});
		
		$('form#thread-status-form').submit(function() {
			var submitBtn = $(this).find('button[type="submit"]');
			submitBtn.attr('disabled', '');
			
			$.ajax({
				type: "POST",
				dataType: 'json',
				data: $(this).serialize(),
				url: '/admin/thread/' + tnum + '/status',
				success: function(d) {
					submitBtn.removeAttr('disabled');
					history.go(0);
				},
				error: function(d) {
					alert('처리 중 오류가 발생했습니다.');
				}
			});
			
			return false;
		});
		
		$('form#new-thread-status-form button').click(function() {
			var statusName = $(this).attr('data-status');
			
			$.ajax({
				type: "POST",
				dataType: 'json',
				data: {
					status: statusName
				},
				url: '/admin/thread/' + tnum + '/status',
				success: function(d) {
					submitBtn.removeAttr('disabled');
					history.go(0);
				},
				error: function(d) {
					alert('처리 중 오류가 발생했습니다.');
				}
			});
			
			return false;
		});
		
		$('form#thread-document-form').submit(function() {
			var submitBtn = $(this).find('button[type="submit"]');
			submitBtn.attr('disabled', '');
			
			$.ajax({
				type: "POST",
				dataType: 'json',
				data: $(this).serialize(),
				url: '/admin/thread/' + tnum + '/document',
				success: function(d) {
					submitBtn.removeAttr('disabled');
				},
				error: function(d) {
					alert('처리 중 오류가 발생했습니다.');
				}
			});
			
			return false;
		});
		
		$('form#thread-topic-form').submit(function() {
			var submitBtn = $(this).find('button[type="submit"]');
			submitBtn.attr('disabled', '');
			
			$.ajax({
				type: "POST",
				dataType: 'json',
				data: $(this).serialize(),
				url: '/admin/thread/' + tnum + '/topic',
				success: function(d) {
					submitBtn.removeAttr('disabled');
				},
				error: function(d) {
					alert('처리 중 오류가 발생했습니다.');
				}
			});
			
			return false;
		});
		
		$('form#new-thread-topic-form').submit(function() {
			var submitBtn = $(this).find('button[type="submit"]');
			submitBtn.attr('disabled', '');
			
			$.ajax({
				type: "POST",
				dataType: 'json',
				data: $(this).serialize(),
				url: '/admin/thread/' + tnum + '/topic',
				success: function(d) {
					submitBtn.removeAttr('disabled');
				},
				error: function(d) {
					alert('처리 중 오류가 발생했습니다.');
				}
			});
			
			return false;
		});
		
		var refresher = setInterval(function() {
			$.ajax({
				type: "POST",
				url: '/notify/thread/' + tnum,
				data: {},
				dataType: 'json',
				success: function(data) {
					const tid = atoi(data['comment_id']);
					var rescount = $('#res-container div.res-wrapper').length;
					
					for(var i=rescount+1; i<=tid; i++, rescount++) {
						$('div.res-wrapper[data-id="' + itoa(rescount) + '"]').after($(
							'<div class="res-wrapper res-loading" data-id="' + itoa(i) + '" data-locked=false data-visible=false>' +
								'<div class="res res-type-normal">' +
									'<div class="r-head">' + 
										'<span class="num"><a id="' + itoa(i) + '">#' + itoa(i) + '</a>&nbsp;</span>' +
									'</div>' +
									'' +
									'<div class="r-body"></div>' +
								'</div>' +
							'</div>'
						));
					}
					
					setVisibleState();
				},
				error: nevermind
			});
			
			fetchComments(tnum);
		}, 500);
		
		setVisibleState();
	}
	
	/* dateformatter.js 라이브러리 사용 - (C) 저작권자 Paul Armstrong / swig 라이브러리에 내장됨 */
	$('time[datetime]').each(function() {
		$(this).text(
			formatDate(new Date($(this).attr('datetime')), $(this).attr('data-format'))
		);
	});
	
	$('.wiki-heading').click(function() {
		if($(this).next().attr('class') == 'wiki-heading-content') {
			$(this).next().toggle();
		}
	});
	
	if(location.pathname == '/RecentChanges') {
		var timer = setInterval(function() {
			$.ajax({
				type: 'GET',
				url: '/RecentChanges?tableonly=1',
				data: {},
				dataType: 'html',
				success: function(d) {
					$('table.table.table-hover')[0].outerHTML = d;
					
					$('time[datetime]').each(function() {
						$(this).text(
							formatDate(new Date($(this).attr('datetime')), $(this).attr('data-format'))
						);
					});
				}
			});
		}, 3000);
	}
	
	$('#previewLink').click(function() {
		const frm = location.pathname.startsWith('/edit/') ? $('#editForm') : $('#new-thread-form');
		frm.attr('action', '/preview/' + frm.attr('data-title')).attr('target', 'previewFrame').submit();
		frm.removeAttr('action').removeAttr('target');
	});
	
	$('#diffLink').click(function() {
		const diffdiv = $('div.tab-pane#diff');
		const base    = difflib.stringAsLines($('textarea#originalContent').text());
		const newt    = difflib.stringAsLines($('textarea#textInput').text());
		const opcodes = (new difflib.SequenceMatcher(base, newt)).get_opcodes();

		diffdiv.html('').append($(diffview.buildView({
			baseTextLines: base,
			newTextLines: newt,
			opcodes: opcodes,
			baseTextName: "원본",
			newTextName: "작성중",
			contextSize: 7,
			viewType: 2
		})));
	});
	
	$('form#new-thread-form select[name="type"]').change(function() {
		if($(this).val() == 'edit_request') {
			$("#editRequestForm").show();
		} else {
			$("#editRequestForm").hide();
		}
	});
	
	window.discussPollStart = discussPollStart;
});