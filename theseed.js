$(function() {
	$('.input-examples').change(function() {
		$(this).prev().val($(this).val());
	});
	
	$('#propertySelect').change(function() {
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
});
