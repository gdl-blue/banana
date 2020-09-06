wiki.get('/member/styler', async (req, res) => {
    if(!islogin(req)) return res.redirect('/member/login?redirect=%2Fmember%2fstyler');
	
    var content = `
        <form method=post>
            <style id=cssAdvStyleTable>
                table {
                    width: 100%;
                }
                td {
                    padding: 5px;
                    border: 1px dashed #eceeef;
                }
                div.tab-content {
                    overflow: scroll;
                    height: 360px;
                }
                div.tab-pane {
                    padding: 5px;
                }
                a.nav-link {
                    display: inline-block !important;
                }
                .table-wiki-quote {
                    padding: 10px;
                    background: #eceeef;
                    border: 2px dashed #ccc;
                    border-left: 5px solid #0080C8;
                    display: inline-block;
                }
                .btns * {
                    float: right;
                }
            </style>
            <script id=core-config-helper>
                if(typeof jQuery === 'undefined') {
                    alert("이 페이지는 jQuery가 지원되지 않는 인터넷 탐색기에서 사용이 불가합니다.");
                    location.href = '/member/mypage';
                }
                $(function() {
                    for(var i=1; i<=${advCount}; i++) {
                        $('textarea[name="CSS' + String(i) + '"]').text(
                            $('style#CSS-' + String(i)).html()
                        );
                    }
                    $("select#selElement").change(function() {
                        try {
                            $("option#0").remove();
                        } catch(e) {}
                        var cssval = $("textarea#JSC" + $("#selElement").children(":selected").attr("id")).text().split(";");
                        var csslst = [
                            "txtPadding", "txtBgolor", "txtBorderWidth", "txtBorderStyle", "txtBorderColor",
                            "txtBorderRadius1", "txtBorderRadius2", "txtBorderRadius3", "txtBorderRadius4",
                            "selFont", "txtTextColor", "txtFontSize", "bs", "ud", "fw", "ia"
                        ];
                        for(var i=0; i<csslst.length; i++) {
                            try {
                                $("#" + csslst[i]).val(cssval[i]);
                            } catch(e) {}
                        }
                    });
                    $("table#css-config tbody tr input, table#css-config tbody tr select:not(#selElement)").change(function() {
                        var fw, ia, ud, sd, bs, bg;
                        if ($('input#chkBold').is(':checked')) {
                            fw = "bold";
                        } else {
                            fw = "normal";
                        }
                        if ($('input#chkItalic').is(':checked')) {
                            ia = "italic";
                        } else {
                            ia = "normal";
                        }
                        if ($('input#chkUnderline').is(':checked')) {
                            ud = "underline";
                        } else {
                            ud = "";
                        }
                        if ($('input#chkStrike').is(':checked')) {
                            sd = "line-through";
                        } else {
                            sd = "";
                        }
                        if(Number($("input#txtBoxShadow").val()) == -1) {
                            bs = "none";
                        } else {
                            bs = "5px 5px " + String($("input#txtBoxShadow").val()) + "px gray";
                        }
                        bg = String($("#txtBgolor").val());
                        if(Number($("input#chkBGT").is(':checked'))) {
                            bg = "transparent";
                        }
                        var sheet = "" +
                            $("#selElement").children(":selected").attr("value") + " { " +
                                " padding: " + String($("#txtPadding").val()) + "px !important; " +
                                " background: " + bg + " !important; " +
                                " border-width: " + String($("#txtBorderWidth").val()) + "px !important; " +
                                " border-style: solid !important; " +
                                " border-color: " + String($("#txtBorderColor").val()) + " !important; " +
                                " border-top-left-radius: " + String($("#txtBorderRadius1").val()) + "px !important; " +
                                " border-top-right-radius: " + String($("#txtBorderRadius2").val()) + "px !important; " +
                                " border-bottom-right-radius: " + String($("#txtBorderRadius3").val()) + "px !important; " +
                                " border-bottom-left-radius: " + String($("#txtBorderRadius4").val()) + "px !important; " +
                                ' font-family: "' + String($("#selFont").val()) + '" !important; ' +
                                " color: " + String($("#txtTextColor").val()) + " !important; " +
                                " font-size: " + String($("#txtFontSize").val()) + "pt !important; " +
                                " box-shadow: " + bs + " !important; " +
                                " text-decoration: " + ud + " " + sd + " !important; " +
                                " font-weight: " + fw + " !important; " +
                                " font-style: " + ia + " !important; " +
                            " } ";
                        $("textarea#JSC" + $("#selElement").children(":selected").attr("id")).text(
                            String($("#txtPadding").val()) + ";" +
                            bg + ";" +
                            String($("#txtBorderWidth").val()) + ";" +
                            "solid;" +
                            String($("#txtBorderColor").val()) + ";" +
                            String($("#txtBorderRadius1").val()) + ";" +
                            String($("#txtBorderRadius2").val()) + ";" +
                            String($("#txtBorderRadius3").val()) + ";" +
                            String($("#txtBorderRadius4").val()) + ";" +
                            String($("#selFont").val()) + ";" +
                            String($("#txtTextColor").val()) + ";" +
                            String($("#txtFontSize").val()) + ";" +
                            bs + ";" +
                            ud + ";" +
                            fw + ";" +
                            ia
                        );
                        $("style#CSS-" + $("#selElement").children(":selected").attr("id")).html(".tab-pane " + sheet);
                        $('textarea[name="CSS' + $("#selElement").children(":selected").attr("id") + '"]').text(sheet);
                    });
                    $("button#cmdResetSE").click(function() {
                        if(confirm('저장하지 않은 내용을 모두 잃게 됩니다!')) {
                            $("style#CSS-" + $("#selElement").children(":selected").attr("id")).html("");
                            $('textarea[name="CSS' + $("#selElement").children(":selected").attr("id") + '"]').text("");
                        }
                    });
                });
            </script>
            <ul class="nav nav-tabs">
                <li class=nav-item>
                    <a href=#discuss class="nav-link active">토론</a>
                    <a href=#article class=nav-link>위키</a>
                </li>
            </ul>
            <div class=tab-content>
                <div class="tab-pane active" id=discuss>
                    <div id=res-container>
                        <div class=res-wrapper>
                            <div class="res res-type-normal">
                                <div class="r-head first-author">
                                    <a id=1>#1</a> <a>샘플 발제자</a> <span style="float: right;">1983-04-22 12:45:59</span>
                                </div>
                                <div class=r-body>
                                    샘플 내용
                                </div>
                            </div>
                        </div>
                        <div class=res-wrapper>
                            <div class="res res-type-normal">
                                <div class=r-head>
                                    <a id=2>#2</a> <a>샘플 숨겨진 댓글</a> <span style="float: right;">1983-04-22 12:45:59</span>
                                </div>
                                <div class="r-body r-hidden-body">
                                    [고길동에 의해 숨겨진 글입니다.]
                                </div>
                            </div>
                        </div>
                        <div class=res-wrapper>
                            <div class="res res-type-status">
                                <div class=r-head>
                                    <a id=3>#3</a> <a>샘플 상태 표시 댓글</a> <span style="float: right;">1983-04-22 12:45:59</span>
                                </div>
                                <div class=r-body>
                                    스레드 상태를 <strong>close</strong>로 변경
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class=tab-pane id=article>
                    <div class=wiki-article>
                        <div class=wiki-content>
                            <div class="alert alert-danger">
                                <strong>[오류!]</strong> 오류가 발생했습니다.
                            </div>
                            <div class="alert alert-warning">
                                <strong>[경고!]</strong> 주의하십시오.
                            </div>
                            <div class="alert alert-success">
                                <strong>[주의!]</strong> 한글 MS-DOS 6.20이 성공적으로 설치됐습니다. 시스템을 재시동하십시오.
                            </div>
                            <div class="alert alert-info">
                                정보가 있습니다.
                            </div>
                            <div class=wiki-textbox>
                                글상자 내용
                            </div><br>
                            <input value="글자 입력 상자" type=text class=form-control style="width: 250px; display: block;">
                            <button type=button class="btn btn-secondary" style="display: inline-block;">일반 단추</button>&nbsp;
                            <button type=button class="btn btn-primary" style="display: inline-block;">저장 단추</button>&nbsp;
                            <button type=button class="btn btn-danger" style="display: inline-block;">위험 단추</button>&nbsp;
                            <button type=button class="btn btn-info" style="display: inline-block;">정보 단추</button>&nbsp;
                            <button type=button class="btn btn-secondary disabled" disabled style="display: inline-block;">흐려진 단추</button>&nbsp;
                            <hr>
                            <p>아기공룡 둘리는 1987년의 애니메이션이다. 오프닝과 엔딩의 가사는 같으며 다음과 같다. 2절까지 있다.
                            <div class="wiki-quote table-wiki-quote">
                                요리보고 조리봐도 음~ 알 수 없는 둘리~ 둘리~<br>
                                빙하타고 내려와~ 친-구를 만났지만<br>
                                일억년 전 옛날이 너무나 그리워<br>
                                보-고-픈 엄마찾아 모두 함께 나-가자 하 하~ 하 하~<br>
                                외로운 둘리는 귀여운 아기공룡. 호이~ 호이~ 둘리는<br>
                                초능력 내 친구~<br>
                                <hr>
                                기쁠때도~ 슬플때도~ 우리 곁엔 둘리~ 둘리~<br>
                                오랜세월 흘~러온~~ 둘리와 친구되어~<br>
                                고~향은 다르지만 모두 다 한 마음<br>
                                아득한 엄마나라 우리함께 떠~나~자~ 하하~ 하하~<br>
                                외~로운 둘리는 귀여운 아기공룡. 호이~ 호이~ 둘리는<br>
                                초능력 내 친구~
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table id=css-config>
                <colgroup>
                    <col style="width: 37.5%;">
                    <col style="width: 12.5%;">
                    <col style="width: 12.5%;">
                    <col style="width: 12.5%;">
                    <col style="width: 12.5%;">
                    <col style="width: 12.5%;">
                </colgroup>
                <tbody>
                    <tr>
                        <td>
                            <label>항목:</label>
                            <select id=selElement class=form-control>
                                <option id=0 selected style="font-style: italic;">[항목을 선택하십시오.]</option>
                                <option id=1 value=".r-head">참여자 댓글 머리</option>
                                <option id=2 value=".r-head.first-author">발제자 댓글 머리</option>
                                <option id=3 value=".r-body">댓글 내용</option>
                                <option id=4 value=".r-body.r-hidden-body">숨겨진 댓글 내용</option>
                                <option id=5 value=".res-type-status .r-body">상태 댓글 내용</option>
                                <option id=6 value=".form-control">양식 컨트롤</option>
                                <option id=24 value=".form-control:focus">활성 양식 컨트롤</option>
                                <option id=7 value=".btn.btn-secondary">단추 표면</option>
                                <option id=8 value=".btn.btn-primary">저장 단추 표면</option>
                                <option id=9 value=".btn.btn-danger">위험성 단추 표면</option>
                                <option id=25 value=".btn.btn-warning">경고성 단추 표면</option>
                                <option id=10 value=".btn.btn-info">링크 단추 표면</option>
                                <option id=11 value=".btn:hover">마우스를 올린 단추</option>
                                <option id=12 value=".btn:active">누른 단추</option>
                                <option id=13 value=".btn[disabled], .btn.disabled">흐려진 단추</option>
                                <option id=14 value=".wiki-quote">인용문</option>
                                <option id=15 value=".wiki-textbox">글상자</option>
                                <option id=26 value="code">한 줄 코드</option>
                                <option id=27 value="pre">소스 코드</option>
                                <option id=16 value=".nav.nav-tabs .nav-link.active">활성 탭</option>
                                <option id=17 value=".nav.nav-tabs .nav-link">비활성 탭</option>
                                <option id=18 value=".wiki-article">위키 본문</option>
                                <option id=19 value=".alert-danger">오류 풍선</option>
                                <option id=20 value=".alert-warning">경고 풍선</option>
                                <option id=21 value=".alert-info">정보 알림 풍선</option>
                                <option id=22 value=".alert-success">성공 알림 풍선</option>
                                <option id=23 value="a">하이퍼링크</option>
                            </select>
                        </td>
                        <td>
                            <label>안쪽 여백: </label><br>
                            <input group=padding type=range min=0 max=12 step=3 id=txtPadding class=form-control value=9>
                        </td>
                        <td>
                            <label>테두리 굵기: </label><br>
                            <input group=border type=range min=0 max=6 step=1 id=txtBorderWidth class=form-control value=1>
                        </td>
                        <td>
                            <label>배경색: </label>&nbsp;<label><input type=checkbox id=chkBGT> 투명</label><br>
                            <input group=color type=color id=txtBgolor class=form-control value=#FFFFFF>
                        </td>
                        <td>
                            <label>테두리: </label><br>
                            <input group=color group=border type=color id=txtBorderColor class=form-control value=transparent>
                        </td>
                        <td>
                            <label>둥근 모서리: </label><br>
                            <input group=border type=text id=txtBorderRadius1 style="width: 20%; display: inline-block" min=0 max=25 value=0>
                            <input group=border type=text id=txtBorderRadius2 style="width: 20%; display: inline-block" min=0 max=25 value=0>
                            <input group=border type=text id=txtBorderRadius3 style="width: 20%; display: inline-block" min=0 max=25 value=0>
                            <input group=border type=text id=txtBorderRadius4 style="width: 20%; display: inline-block" min=0 max=25 value=0>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>글꼴 스타일:</label><br>
                            <select group=font id=selFont class=form-control>
                                <option value=dshfbhkdsbha>미설정</option>
                                <option>굴림</option>
                                <option>굴림체</option>
                                <option>돋움</option>
                                <option>돋움체</option>
                                <option>고딕</option>
                                <option>궁서</option>
                                <option>궁서체</option>
                                <option>바탕</option>
                                <option>바탕체</option>
                                <option>명조</option>
                                <option>둥근모꼴 일반체</option>
                                <option>새굴림</option>
                                <option value=IHIYAGI_SYS>이야기체</option>
                                <option value=DOSMyongjo>도스 명조</option>
                                <option value=Sam3KRFont>삼국지 3</option>
                                <option>Fixedsys</option>
                                <option value=System>Windows 3.1</option>
                                <option>monochrome</option>
                                <option>Consolas</option>
                                <option>Lucinda Console</option>
                                <option>Courier New</option>
                                <option>Arial</option>
                            </select>
                        </td>
                        <td>
                            <label>글꼴 색:</label><br>
                            <input group=font type=color id=txtTextColor class=form-control value=#000000>
                        </td>
                        <td>
                            <label>글꼴 크기:</label><br>
                            <input group=font type=number id=txtFontSize class=form-control min=8 max=16 value=12>
                        </td>
                        <td>
                            <label>그림자 흐림: </label><br>
                            <input group=shadow type=range min=-1 max=5 step=1 id=txtBoxShadow class=form-control value=-1>
                        </td>
                        <td>
                            <label group=font id=lblChkBold><input group=font type=checkbox id=chkBold> 굵게</label><br>
                            <label group=font id=lblChkItalic><input group=font type=checkbox id=chkItalic> 기울게</label>
                        </td>
                        <td>
                            <label group=font id=lblChkUnderline><input type=checkbox id=chkUnderline> 밑줄</label><br>
                            <label group=font id=lblChkStrike><input type=checkbox id=chkStrike> 취소선</label>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div>
                <button type=button id=cmdResetSE class="btn btn-danger">이 항목 초기화</button>
                <button type=button id=cmdCancel onclick="if(confirm('저장하지 않은 내용을 모두 잃게 됩니다!')) location.href = '/member/mypage';" class="btn btn-danger pull-right">취소</button>
                <button type=submit class="btn btn-primary pull-right">적용</button>
            </div>
    `;
	
	const str = e => String(e);

    for(i of range(1, advCount + 1)) {
        content += '<textarea style="display: none;" name=CSS' + str(i) + '></textarea>';

        var jst, dbdata = await curs.execute("select data from user_set where name = 'advjst" + str(i) + "' and id = ?", [ip_check(req)]);
        try {
            jst = dbdata[0]['data'];
        } catch(e) {
            jst = '';
		}
        content += '<textarea style="display: none;" name=JSC' + str(i) + ' id=JSC' + str(i) + '>' + jst + '</textarea>';
	}
	
    content += '</form>';
	
	res.send(await render(req, '고급 스타일', content, {}, _, _, 'styler'));
});

wiki.post('/member/styler', async (req, res) => {
	function getForm(key, def) {
		if(req.body[key]) return req.body[key];
		else return def;
	}
	const str = e => String(e);
	
	for(i of range(1, advCount + 1)) {
		var cSht = getForm("CSS" + str(i), '') + " ";
		var cStx = getForm("JSC" + str(i), '') + " ";

		await curs.execute("delete from user_set where id = ? and name = 'advjst" + str(i) + "'", [ip_check(req)])
		await curs.execute("insert into user_set (id, name, data) values (?, 'advjst" + str(i) + "', ?)", [ip_check(req), cStx])
		await curs.execute("update user_set set data = ? where id = ? and name = 'advjst" + str(i) + "'", [cStx, ip_check(req)])

		await curs.execute("delete from user_set where id = ? and name = 'advstyle" + str(i) + "'", [ip_check(req)])
		await curs.execute("insert into user_set (id, name, data) values (?, 'advstyle" + str(i) + "', ?)", [ip_check(req), cSht])
		await curs.execute("update user_set set data = ? where id = ? and name = 'advstyle" + str(i) + "'", [cSht, ip_check(req)])

		conn.commit()
	}

	res.redirect('/member/styler');
});