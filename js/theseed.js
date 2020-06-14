$(function() {
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
				'value': addbtn.parent().prev().val(),
				'mode': 'add'
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
				'value': delbtn.parent().prev().val(),
				'mode': 'remove'
			},
			dataType: 'text',
			success: function aclRemoveSuccess(res) {
				delbtn.parent().parent().next().html(res);
			},
			error: function aclAddFail(e) {
				alert('ACL 삭제에 실패했습니다.');
			}
		});
	});
});
