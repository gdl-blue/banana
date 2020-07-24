$(function() {
    $(document).on('click', '.menu .menu-button', function() {
        $(this).next().toggle();
    });
    $(document).on('click', '.ribbon-menu .tab', function() {
        $('.ribbon-menu .tab').removeClass('active');
        $(this).addClass('active');
        $('.wiki-article').css('padding-top', '180px');
        $('#memberMenu').css('margin-top', '125px');
        $('.ribbon-menu .ribbon-tab-pane').removeClass('active');
        $('.ribbon-menu .ribbon-tab-pane' + $(this).attr('data-link')).addClass('active');
    });
    $(document).on('click', '.ribbon-menu .tab.active', function() {
        $('.ribbon-menu .ribbon-tab-pane.active').removeClass('active');
        $(this).removeClass('active');
        $('.wiki-article').css('padding-top', '70px');
        $('#memberMenu').css('margin-top', '25px');
    });
    $(document).on('click', '#toggleStrike', function() {
        $(this).toggleClass('pressed');
        $('.wiki-article del').toggle();
    });
    $(document).on('click', '#toggleImages', function() {
        $(this).toggleClass('pressed');
        $('.wiki-article img').toggle();
    });
    $(document).on('click', '.alert button.close[data-dismiss="alert"]', function() {
        $(this).parent().remove();
    });

    $($('.ribbon-menu .tab').get(0)).addClass('active');
    $($('.ribbon-menu .ribbon-tab-pane').get(0)).addClass('active');
})
