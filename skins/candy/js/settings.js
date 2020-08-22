/* neo_yousoro의 SKIN_SET.JS을 기반으로... */

function get_post() {
    check = document.getElementById('hideWikiHeading');
    if(check.checked === true) {
        document.cookie = 'hideWikiHeading=1;';
    } else {
        document.cookie = 'hideWikiHeading=0;';
    }

    check = document.getElementById('unfoldWikiFolding');
    if(check.checked === true) {
        document.cookie = 'unfoldWikiFolding=1;';
    } else {
        document.cookie = 'unfoldWikiFolding=0;';
    }

    check = document.getElementById('hideStrike');
    if(check.checked === true) {
        document.cookie = 'hideStrike=1;';
    } else {
        document.cookie = 'hideStrike=0;';
    }

    check = document.getElementById('oldShowHiddenContentButton');
    if(check.checked === true) {
        document.cookie = 'oldShowHiddenContentButton=1;';
    } else {
        document.cookie = 'oldShowHiddenContentButton=0;';
    }

    check = document.getElementById('commonTasksListOnRight');
    if(check.checked === true) {
        document.cookie = 'commonTasksListOnRight=1;';
    } else {
        document.cookie = 'commonTasksListOnRight=0;';
    }

    check = document.getElementById('hideCommonTasksList');
    if(check.checked === true) {
        document.cookie = 'hideCommonTasksList=1;';
    } else {
        document.cookie = 'hideCommonTasksList=0;';
    }

    check = document.getElementById('fontSelect');
    if(check.value === '돋움') {
        document.cookie = 'fontSelect=돋움;';
    } else if(check.value === '명조') {
        document.cookie = 'fontSelect=명조;';
    } else if(check.value === '고딕') {
        document.cookie = 'fontSelect=고딕;';
    } else if(check.value === '굴림') {
        document.cookie = 'fontSelect=굴림;';
    }

    history.go(0);
}

function regex_data(data) {
    r_data = new RegExp('(?:^|; )' + data + '=([^;]*)')

    return r_data;
}

cookies = document.cookie;

function main_load() {
    head_data = document.querySelector('head');

    if(
        cookies.match(regex_data('hideWikiHeading')) &&
        cookies.match(regex_data('hideWikiHeading'))[1] === '1'
    ) {
        head_data.innerHTML += '<style>.wiki-heading-content {display: none !important; }</style>';
    }

    if(
        cookies.match(regex_data('hideStrike')) &&
        cookies.match(regex_data('hideStrike'))[1] === '1'
    ) {
        head_data.innerHTML += '<style>.wiki-article s, del, strike {display: none !important; }</style>';
    }

    if(
        cookies.match(regex_data('unfoldWikiFolding')) &&
        cookies.match(regex_data('unfoldWikiFolding'))[1] === '1'
    ) {
        head_data.innerHTML += '<style>.wiki-article .wiki-folding {display: block !important; }</style>';
    }

    if(
        cookies.match(regex_data('commonTasksListOnRight')) &&
        cookies.match(regex_data('commonTasksListOnRight'))[1] === '1'
    ) {
        head_data.innerHTML += '<style>#commonTasksList {float: right !important; }</style>';
    }

    if(
        cookies.match(regex_data('oldShowHiddenContentButton')) &&
        cookies.match(regex_data('oldShowHiddenContentButton'))[1] === '1'
    ) {
        head_data.innerHTML += '<style>.old-show-hidden-content-button {display: block !important; } .new-show-hidden-content-button {display: none !important; }</style>';
    }

    if(
        cookies.match(regex_data('hideCommonTasksList')) &&
        cookies.match(regex_data('hideCommonTasksList'))[1] === '1'
    ) {
        head_data.innerHTML += '<style>#commonTasksList {display: none !important; } #articleContent {width: calc(100% - 60px) !important; }</style>';
    }

    if(cookies.match(regex_data('fontSelect'))) {
        if(cookies.match(regex_data('fontSelect'))[1] === '돋움') {
            head_data.innerHTML += '<style>body * { font-family: "돋움", "Dotum" !important; }</style>'
        } else if(cookies.match(regex_data('fontSelect'))[1] === '굴림') {
            head_data.innerHTML += '<style>body * { font-family: "굴림", "Gulim" !important; }</style>'
        } else if(cookies.match(regex_data('fontSelect'))[1] === '명조') {
            head_data.innerHTML += '<style>body * { font-family: "바탕", "Batang" !important; }</style>'
        } else if(cookies.match(regex_data('fontSelect'))[1] === '고딕') {
            head_data.innerHTML += '<style>body * { font-family: "맑은 고딕", "Malgun Gothic" !important; }</style>'
        }
    }
}

main_load();

$(function () {
    if(window.location.pathname === '/settings') {
        data = document.getElementById("articleContent");
        set_data = {};

        if(
            cookies.match(regex_data('oldAdminBox')) &&
            cookies.match(regex_data('oldAdminBox'))[1] === '1'
        ) {
            set_data["oldAdminBox"] = "checked";
        } else if(
            cookies.match(regex_data('oldAdminBox')) &&
            cookies.match(regex_data('oldAdminBox'))[1] === '0'
        ) {
            set_data["oldAdminBox"] = "";
        } else {
            set_data["oldAdminBox"] = "checked";
        }

        if(
            cookies.match(regex_data('hideWikiHeading')) &&
            cookies.match(regex_data('hideWikiHeading'))[1] === '1'
        ) {
            set_data["hideWikiHeading"] = "checked";
        }

        if(
            cookies.match(regex_data('unfoldWikiFolding')) &&
            cookies.match(regex_data('unfoldWikiFolding'))[1] === '1'
        ) {
            set_data["unfoldWikiFolding"] = "checked";
        }

        if(
            cookies.match(regex_data('hideStrike')) &&
            cookies.match(regex_data('hideStrike'))[1] === '1'
        ) {
            set_data["hideStrike"] = "checked";
        }

        if(
            cookies.match(regex_data('oldShowHiddenContentButton')) &&
            cookies.match(regex_data('oldShowHiddenContentButton'))[1] === '1'
        ) {
            set_data["oldShowHiddenContentButton"] = "checked";
        }

        if(
            cookies.match(regex_data('commonTasksListOnRight')) &&
            cookies.match(regex_data('commonTasksListOnRight'))[1] === '1'
        ) {
            set_data["commonTasksListOnRight"] = "checked";
        }

        if(
            cookies.match(regex_data('hideCommonTasksList')) &&
            cookies.match(regex_data('hideCommonTasksList'))[1] === '1'
        ) {
            set_data["hideCommonTasksList"] = "checked";
        }

        if(cookies.match(regex_data('fontSelect'))) {
            if(cookies.match(regex_data('fontSelect'))[1] === '돋움') {
                fontSelectData = ' \
                    <option selected>돋움</option> \
                    <option>굴림</option> \
                    <option>명조</option> \
                    <option>고딕</option> \
                ';
            } else if(cookies.match(regex_data('fontSelect'))[1] === '굴림') {
                fontSelectData = ' \
                    <option>돋움</option> \
                    <option selected>굴림</option> \
                    <option>명조</option> \
                    <option>고딕</option> \
                ';
            } else if(cookies.match(regex_data('fontSelect'))[1] === '명조') {
                fontSelectData = ' \
                    <option>돋움</option> \
                    <option>굴림</option> \
                    <option selected>명조</option> \
                    <option>고딕</option> \
                ';
            } else if(cookies.match(regex_data('fontSelect'))[1] === '고딕') {
                fontSelectData = ' \
                    <option>돋움</option> \
                    <option>굴림</option> \
                    <option>명조</option> \
                    <option selected>고딕</option> \
                ';
            } else {
                fontSelectData = ' \
                    <option>돋움</option> \
                    <option>굴림</option> \
                    <option>명조</option> \
                    <option>고딕</option> \
                ';
            }
        } else {
            fontSelectData = ' \
                <option>돋움</option> \
                <option>굴림</option> \
                <option>명조</option> \
                <option>고딕</option> \
            ';
        }

        data.innerHTML = ' \
            <form method=1234><ul class="nav nav-tabs" role="tablist" style="height: 43px;"> \
                <li class="nav-item" style="list-style-type:none !important"> \
                    <a class="nav-link active" data-toggle="tab" role="tab" onclick="$(\'#siteSettings\').hide(); $(\'#wikiSettings\').show(); $(\'#advancedSettings\').hide();">위키</a> \
                </li> \
                <li class="nav-item" style="list-style-type:none !important"> \
                    <a class="nav-link" data-toggle="tab" role="tab" onclick="$(\'#siteSettings\').show(); $(\'#wikiSettings\').hide(); $(\'#advancedSettings\').hide();">스킨</a> \
                </li> \
                <li class="nav-item" style="list-style-type:none !important"> \
                    <a class="nav-link" data-toggle="tab" role="tab" onclick="$(\'#siteSettings\').hide(); $(\'#wikiSettings\').hide(); $(\'#advancedSettings\').show();">고급</a> \
                </li> \
            </ul> \
            <div id=wikiSettings class=skin-settings-page style="padding: 10px; border: 1px solid #ccc; background: white;"> \
                <fieldset><legend>접근성</legend> \
                <div class=form-group> \
                    <label><input ' + set_data["hideStrike"] + ' type="checkbox" id="hideStrike" name="hideStrike" value="hideStrike"> 취소선을 기본적으로 숨기기</label> \
                </div> \
                <br /> \
                <div class=form-group> \
                    <label><input ' + set_data["hideWikiHeading"] + ' type="checkbox" id="hideWikiHeading" name="hideWikiHeading" value="hideWikiHeading"> 문단을 기본으로 접기</label> \
                </div> \
                <div class=form-group> \
                    <label><input ' + set_data["unfoldWikiFolding"] + ' type="checkbox" id="unfoldWikiFolding" name="unfoldWikiFolding" value="unfoldWikiFolding"> 접기 문법을 기본으로 펼치기</label> \
                </div></fieldset> \
            </div> \
            <div id=advancedSettings class=skin-settings-page style="display:none; padding: 10px; border: 1px solid #ccc; background: white;"> \
                <fieldset><legend>인터페이스</legend><div class=form-group> \
                    <label><input ' + set_data["oldAdminBox"] + ' type="checkbox" id="oldAdminBox" name="oldAdminBox" value="oldAdminBox"> 2017년 이전 방식 관리자 틀 사용</label> \
                </div> \
                <div class=form-group> \
                    <label><input ' + set_data["oldShowHiddenContentButton"] + ' type="checkbox" id="oldShowHiddenContentButton" name="oldShowHiddenContentButton" value="oldShowHiddenContentButton"> the seed 4.12.0 방식의 숨겨진 댓글 인터페이스</label> \
                </div> \
            </fieldset></div> \
            <div id=siteSettings class=skin-settings-page style="display:none; padding: 10px; border: 1px solid #ccc; background: white;"> \
                <fieldset><legend>글꼴</legend> \
                    <div class=form-group><select id=fontSelect name=fontSelect style=width:300px>' + fontSelectData + '</select> \
                </div></fieldset> \
            </div><div class="btns pull-right"> \
            <button type=reset class="btn btn-secondary">초기화</button> \
            <button onclick="get_post();" class="btn btn-primary" type=button>저장</button> \
            </div></form> \
        ';

        if($('#hideCommonTasksList').is(':checked')) $('#commonTasksListOnRight').attr('disabled', '');
        else $('#commonTasksListOnRight').removeAttr('disabled');
    }
});

$(document).on('click', '#hideCommonTasksList', function() {
    if($('#hideCommonTasksList').is(':checked')) $('#commonTasksListOnRight').attr('disabled', '');
    else $('#commonTasksListOnRight').removeAttr('disabled');
});