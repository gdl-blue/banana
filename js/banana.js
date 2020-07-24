/*
  참고한 싸이트
  - https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
*/

$(function() {
	$('.noscript-alert').remove();
	
	if($(window).width() >= 460) {  /* 모니터 1600*1200인데 최대화할 때 너비 1585로 나옴*/
		$('.vertical-tablist .tablist').show();
		/* $('.vertical-tablist .tablist').css({'width': '120px', 'float': 'left'}); */
		/* $('.vertical-tablist .tab-content').css({'width': 'calc(100% - 141px)', 'float': 'right'}); */
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
	}
	
	function nevermind() {
		return null;
	}
	
	function isVisible(elmt) {
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
		for(var item of document.querySelectorAll('#' + $(this).attr('data-datalist') + ' option')) {
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
				'not': addbtn.parent().prev().is(":checked")
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
				$('select#pluginList[size] option:selected').css('color', 'inherit');
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
				$('select#pluginList[size] option:selected').css('color', 'gray');
			},
			error: function(d) {
				alert('선택한 플러그인을 비활성화하는 중 오류가 발생했습니다.');
			}
		});
	});
	
	const allLoadingRes = 'div.res-wrapper.res-loading[data-locked="false"]';
	const loadingRes = 'div.res-wrapper.res-loading[data-visible="true"][data-locked="false"]';
	
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
	
	function discussFetch(tnum) {
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
			
			$.ajax({
				type: "POST",
				dataType: 'json',
				data: {
					'text': $('textarea[name="text"]').val()
				},
				success: function(d) {
					submitBtn.removeAttr('disabled');
					$('textarea[name="text"]').val('');
				},
				error: function(d) {
					submitBtn.removeAttr('disabled');
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
					alert('처리 중에 오류가 발생했습니다.');
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
					alert('처리 중에 오류가 발생했습니다.');
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
					alert('처리 중에 오류가 발생했습니다.');
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
					var rescount = $('div.res-wrapper').length;
					
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
			
			discussFetch(tnum);
		}, 500);
		
		setVisibleState();
	}
	
	window.discussPollStart = discussPollStart;
});