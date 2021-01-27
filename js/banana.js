/*
  참고한 싸이트
  - https://stackoverflow.com/questions/123999
  - https://stackoverflow.com/questions/24291093
  - https://stackoverflow.com/questions/39269407
  - https://stackoverflow.com/questions/1091372
  - https://stackoverflow.com/questions/717224
  - https://stackoverflow.com/questions/11076975
*/
String.prototype.includes = function(s) {
    return this.toString().replace(s, '') !== this.toString();
};

String.prototype.startsWith = function(s) {
    var ret = true;
    for(i = 0; i < s.length; i++) {
        if(this.toString()[i] != s[i]) {
            ret = false;
            break;
        }
    }
    return ret;
};

if(!document.addEventListener) {
    document.addEventListener = function(evt, fnc) {
        document.attachEvent('on' + evt, fnc);
    };
}

if(location.pathname == '/member/styler' && typeof jQuery === 'undefined') {
    alert("이 페이지는 jQuery가 지원되지 않는 인터넷 탐색기에서 사용이 불가합니다.");
    location.href = '/member/mypage';
}

function isVisible(elmt) {
    if(typeof ActiveXObject == 'function') return true;

    var top = elmt.offsetTop;
    var left = elmt.offsetLeft;
    var width = elmt.offsetWidth;
    var height = elmt.offsetHeight;

    while(elmt.offsetParent) {
        elmt = elmt.offsetParent;
        top += elmt.offsetTop;
        left += elmt.offsetLeft;
    }

    return (
        top < (pageYOffset + innerHeight) &&
        left < (pageXOffset + innerWidth) &&
        (top + height) > pageYOffset &&
        (left + width) > pageXOffset
    );
}

var _ = undefined;
var noAsync = false;
var global = window;

try {
    eval('async function __ASYNC_FUNCTION_TEST(아, 기, 공, 룡, 둘, 리) { return 1; }');
} catch (e) {
    noAsync = true;
}

var nevermind = function() {};
var nvm = nevermind;

function formatDatetime() {
    $('time[datetime]').each(function() {
        var time = $(this);
        var date = new Date(time.attr('datetime'));
        if(!date) return;

        var now = new Date();
        var fmt = time.attr('data-format');
        var floorof = Math.floor

        if(fmt && fmt !== 'b') {
            var ret = fmt;
            ret = ret.replace(/Y/i, date.getFullYear());
            ret = ret.replace(/m/i, (date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)));
            ret = ret.replace(/d/i, (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()));

            ret = ret.replace(/H/i, (date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()));
            ret = ret.replace(/i/i, (date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()));
            ret = ret.replace(/s/i, (date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()));

            ret = ret.replace(/O/i, new Date().toString().match(/([-\+]\d+)/)[1]);
            ret = ret.replace(/N/i, date.getHours() >= 12 ? '오후' : '오전');

            time.text(ret);
        } else {
            var ret = '';
            var gap = (now.getTime() - date.getTime()) / 1000;

            if(gap / 31104000 >= 1) {
                ret = floorof(gap / 31104000) + '년 전';
            } else if(gap / 2592000 >= 1) {
                ret = floorof(gap / 2592000) + '달 전';
            } else if(gap / 604800 >= 1) {
                ret = floorof(gap / 604800) + '주 전';
            } else if(gap / 86400 >= 1) {
                var days = floorof(gap / 86400);
                var dstr = '';

                switch (days) {
                case 1:
                    dstr = '하루';
                    break;
                case 2:
                    dstr = '이틀';
                    break;
                case 3:
                    dstr = '사흘';
                    break;
                case 4:
                    dstr = '나흘';
                    break;
                case 5:
                    dstr = '닷새';
                    break;
                case 6:
                    dstr = '엿새';
                    break;
                case 7:
                    dstr = '이레';
                    break;
                default:
                    dstr = days + '일';
                }

                ret = dstr + ' 전';
            } else if(gap / 3600 >= 1) {
                ret = floorof(gap / 3600) + '시간 전';
            } else if(gap / 60 >= 1) {
                ret = floorof(gap / 60) + '분 전';
            } else if(gap / 1 >= 1) {
                ret = floorof(gap / 1) + '초 전';
            } else {
                ret = '방금 전';
            }

            time.text(ret);
            time.attr('title',
                date.getFullYear() + '년 ' +
                (date.getMonth() + 1) + '월 ' +
                date.getDate() + '일 ' +
                (date.getHours() >= 12 ? '오후' : '오전') + ' ' +
                (date.getHours() > 12 ? date.getHours() - 12 : (date.getHours() == 0 ? 12 : date.getHours())) + '시 ' +
                date.getMinutes() + '분'
            );
        }
    });
}

function transition(oldDiv, newDiv) {
    newDiv.fadeTo(1, 0, nevermind);
    oldDiv.css('transition', 'all 0.45s');
    newDiv.css('transition', 'all 0.45s');

    oldDiv.css('transform', 'scale(3)');
    oldDiv.fadeTo(0, 0, function() {
        setTimeout(function() {
            oldDiv.hide();
        }, 450);

        newDiv.fadeTo(50, 1, nevermind);
        newDiv.css('transform', 'scale(1)');
    });
}

function transitionReverse(oldDiv, newDiv) {
    oldDiv.fadeTo(1, 0, nevermind);
    oldDiv.css('transition', 'all 0.45s');
    newDiv.css('transition', 'all 0.45s');

    newDiv.css('transform', 'scale(.1)');
    newDiv.fadeTo(0, 0, function() {
        setTimeout(function() {
            newDiv.hide();
        }, 450);

        oldDiv.fadeTo(50, 1, nevermind);
        oldDiv.css('transform', 'scale(1)');
    });
}

var valueChange = 'propertychange change keyup paste input';

function alertBalloon(title, content, delay, noMsgbox, type) {
    delay = delay || 3000;
    noMsgbox = noMsgbox || 0;
    type = type || 'normal';

    if(compatMode2) {
        if(!noMsgbox) alert(title + ' ' + content);
    } else {
        $('.js-alert-balloon').remove();

        var balloon = $(
            '<div class=js-alert-balloon>' +
            /* '<span class=light-arrow>--===||&gt;-</span>' + */
            "<img class=light-arrow src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArQAAADwCAYAAADxaPeJAAAAAXNSR0ICQMB9xQAAAAlwSFlzAAAXEgAAE2EBZIRQuwAAABl0RVh0U29mdHdhcmUATWljcm9zb2Z0IE9mZmljZX/tNXEAAFsoSURBVHja7d0J2GVVeSX+JA2YaLRUQAlKCkEEUShAUYgiCCIIAjIIiGihKAg4IIgICCUI2AIyOg/QIDi0KDihgmKrOGDagThGUYnG2FFjOnaGTtLW6XvL/X533ffb797vPmefO3zfyvOsp/9/qgrTSVH8ep219/6Dc8899w8YhmEYhmEYZl7D/yEwDMMwDMMwBC3DMAzDMAzDELQMwzAMwzAMQ9AyDMMwDMMwBC3DMAzDMAzDELQMwzAMwzAMQ9AyDMMwDMMwDEHLMAzDMAzDELQMwzAMwzAMQ9AyDMMwDMMwDEHLMAzDMAzDMAQtwzAMwzAMQ9AyDMMwDMMwDEHLMAzDMAzDMAQtwzAMwzAMQ9DyfwgMwzAMwzAMQcswDMMwDMMwBC3DMAzDMAzDELQMwzAMwzAMQcswDMMwDMMwBC3DMAzDMAzDELQMwzAMwzAMQ9AyDMMwDMMwBC3DMAzDMAzDELQMwzAMwzAMQ9AyDMMwDMMwDEHLMAzDMAzDELQMwzDM8kjTNH84K+H/PhiGIWgZhmGYuQYtYcswDEHLMAzDLAnQErYMwxC0DMMwBGrt/FGlELgMwxC0DMMwzPIFLXHLMAQtwzAMQ9BOG7RsbhmGIWgZhmGYKnAtBed/6TnVAMzfGwxD0DIMwzAE7VyDlrBlGIKWYRiGWd6g9eBzvUrpAl1OEhiGoGUYhmGWCWJL4eqB6PqV0gW9rVtc/j5iGIKWYRiGIWjnGrTELcMQtAzDMMxsIrYWXC18bgC5V6VsYMSD3lq7XOKWYQhahmEYZo5A60GshUyE6B9Xige6pe1ulS0uf98xDEHLMAzDzA9oNWQtZCJE/6RSPNAtbXGrHi7j7z+GIWgZhmGYySHWMy1ITQly7StC9N6V4oFuaYvb2xaXvy8ZhqBlGIZhZgu0FmQtZCJE71MpHuiWtrgTmSXw9yjDELQMwzDM5EHrhawF1z81ct8Owb+PB72eFpezBIYhaBmGYZgZRGyNA19eyMYQKwC9XyQrOgT/Pinw9olbzhIYhqBlGIZhZhC063eA7J8mICsQvT/kAYW5v5EYdC3YThq3xXfe8vczwxC0DMMwBG0d0CJmPZDNAVZQ+kDIhoV5oJEYei3gptrbPmYJnR5x4O9thiFoGYZhiNg6rWwOsh7ADkG6UcjGIQ8qzMZG5O+r4etFbg64fWxui9HL3/MMQ9AyDMMQtO0PfFnTAsQsQtZCrMD0wSGbQP7MEfz5D4Zo8KaAi7gthS1nCQxD0DIMwzAzDlqrlbWmBSsSiN04gleB6aYhD4E81BH8+ZtCNHhj0N0og9tpNrecJTAMQcswDEPE9rCVxVbWamQfkGhiY4hFvG4W8uchKx35c8hmEA1ejVwE7sYKuBtG5gke4M7KLIG4ZRiClmEYZlmCtmYru6EB2U1V86rxunnIw0K2gGxpRH5cfo38PTR4NXI3bYHbHGwncaCs9T23/GeFYQhahmGY5Qza0lYWIYtN7GaqedV4FaQ+PGQryCOMyI/Lr0lBF5G7mcLtppGJwoMyuNXAnTRuWz3cQNwyDEHLMAwzr6DtMjO4TyFkN1GQfShA9mGqdX04gHXrkG1CHgnZ1oj8uPwa+XvEwLslIHdzhdvNjPY2htuNHLOEWWxuo+jlP0MMQcswDMPMM2i9MwMPZq1pgYasBuw2ANZHhTw6ZDvI9kbkx+XXyN8jBt6tAbk54Hpxu6HjtoRJvFDGWQLDELQMwzAEbWJmgJhNtbKxaYGGbAyxjwa0rhpkh0F2DNnJGfn5O4S/x6oIeB8FyN2mBW5j29tS3Na6CkyjtgpoiVuGoGUYhmFmAbR9zgwEs7GdbK6RFcgKYmOAHcL0MYM8dpCdQx4X8vhM5OftHH79Y8PfaycF3e0BuNs62tvNjcNlFmwndaDMgu16tWcJ/GeMIWgZhmGYWQOtd2ZgTQxiW1lpZTVkZVbwSGhiBbEI2J0VWncZZNeQvwh5AuSJEPlr8vN2Db9+F4Duzk7gSoOLwLXa280SNybEcFu7ubVgu36fswT+88YQtAzDMMysgxab2RRmHxyZGGweaWRlVqAhKy2sIHZXQOsQqbsN8qSQ3UP2gDwZIn9Nft6Twq/fDcCL0EXkWsAV3KamCdPe3FqwTTW3VWcJ/GePIWgZhmGYmqDtY2aAmNUHv/TEYHPVym6jILtDgGMMsQLY3QGrew6y1yBPGWTvkKdmIj/vKeHX7gngRegichG42ODGcJtqbj24bdvcel8mu1dma8tZAsMQtAzDMHMN2jYzg9jhrweriQFidis1L9guoBAhuws0sdLCCmIFsEOc7jPIvoM8bZD9QvbPRH7e08Kv3QegG0OuAHfauN2oYGvbBrgbdMBtq+d3+c8kQ9AyDMMwkwatNTN4YKKZlYnBwwLktkq0sjsHKEobqxEr7asAdojTpw9ywCAHDnLQIM8IOTgR+TkHhV93QPj77K+gi8gV4EqDK+2tzBP0NCGHW5kllFwFZuHWam7bwrbmww2uWQL/2WQIWoZhGKYEtH3PDGKHv+RhBJkYSCur5wW7BiQKZPeEJnZfaF8PALweMsihgxw2yDNDDoccAZG/Jj/vsPBrDw1/n4MN5GrgSoMrE4VYeyuHy2R323Zz64GthdsVmVmCBduad9sWo5f/nDIELcMwDNMGtF1nBhsbzazcZCB7WZkYSCsrtxbIvED2sQLZfWBK8PQATUGsAHYI1SMHedYgRw3y7JCjQ54Dkb8mP+eo8OueFf4eRyjoHgxNrgBXGtx9VHtbilt9HRheBYY3JZS2tiWzhL6a22otLv+ZZQhahmEYpi1osZUtnRnEDn/JXlYmBnJ7gWxlpZWVaYE0stjGHhyQeXjAp+B1CNXnDrJ6kGMGeV7I80OOhchfk59zTPh1q8Pf4zkKukdAoystLgJXJgq6vX2ygVucJchtCXIV2KMiuJXWtmSS4JkltJ0kcJbAELQMwzBMr1BNvfyF8cwMsJUtnRnEbjLAZnbH0FbiVlZa2b1D87lfACO2sQJZQawAVtD6gkGOG+T4kBeFnBCJ/Njx4de8MPz6YwG8gtyjFXClwc3hNtfcenCr97bTaG5nZZZA3DIELcMwzBIEay65rayGbOlTthsnDoClmlnE7G4BfNLKPi181pdGViD7LICsIPYFAaLHB6SeOMiLB3lJyEtDXhaJ/NhLwq85Kfz6EwC6gtznQ5OLDe6R4b83C7fWLEEOlMl9t/q2BMRtam/rOUyGsLVuSojhdtLNbad7bvnnA0PQMgzDzH/jaqX2U7bemYHcZLB1M7rJYFUCs0+JtLKHKsg+N7Smx4ZG9UUBoCcFlA6RevIgpwxyasgrQk6LRH7s1PBrhnl5+HsgdAW5AtxjYaqA7e2RappwsLO5jeEW97Y7GHtbL26xtW3b3HZ5crfmLCH7/4jjnxsMQcswDNO9Ee0K0BKgelLaynoxu3FmZoCYxftld47sZZ8CW9kDoZU9AiB7jIIsIvblAaVDpL5ykFcNckbImYOcFfJqFfnrZ4afO/x1p4e/h4BXkPsyBdwXRYCL7S1OE2K4xeYW97a1cNtlllDS3E4Ct633t/wzjCFoGYZhzl10X+sk0wWuOcRqyFqHv3Izg02cMwMLs7KX3RcmBodAK3s0QPaFCrLSxL4CECt4PXuQcwZZM8hrfve7350bcp7Kur8+/Dnh564Jv+5sBV1BrgAXG9yTjPZWcGvNEg5sRrclYGvbB26xuS2Fbay1tba2Mz1L4J9nDEHLMAwb1vkCbQ6xGrLW4a9cM7upc2aAmMXDX7iXxYnBUQGDzwv7VYHsS6GNRcS+OkBU8PraQc4f5IJBLhzkdcMMfvy/YuSvh59zQcj54dcjdM8O/xkI3NPCfx/Y3sZwa80SuuB2l8TetjZuPc1tyd7Wg1uN2mo7W+KWIWgZhlluoGwLy1pZrzAliNWQTU0MpJnFp2xTmN0mMjOQxxJimJW9rJ4YPD/MC06ARhYhK03smtC2ng94ff0gFw1y8SCXDPKGkEsjkR+7JGT4ay4C8F6okLtGNbivirS3feNWbkrY1YFbz00JtZpbq70txa0F2/U4S2AIWoZhpgXaaYN0mlhdr1LWd6QLYlOQjR3+0pjNbWYRs3KTgRz+OjjsTI9UE4PjoZU9JTSiCNnXAGQFsRcHnF42yOWDXDHIlYNcFfLGSOTHrgy5IvzaSwG6F4W/PwL3vNDgngPtreDWam6Pa8ZvTBDceva21mGyHG5XNfGbEjRurZsSLNimWtuum1sLtuv3OUvgn9cMQcswbFhnuWGdBGj7AKqFVSs5xGrIYiNb2sri61+xZnYHY2YwxKzcZHAgYBb3si8AzL4sYPaV4VO/QHbYll4QWtSLALFXBJy+aZA3D/KWQd46yNtC3h6J/NhbQ94Sfu2bALwauRcDcC+ItLee5rYLbvEwmYVb2ds+ponvbb24tVrbtptba5JwbwdsU81t1VkC/+xnCFqGIShn5ZP9rDWopUC1sGolh9jURra0lRXMyoMJ2wQgCWYfo2YGe6hm9sDwiV0w+xzA7HAv++IAwCEGTw+t7DmhkY1B9sqAzzcHlA6h+o5B3jXI1YNcM8zg1/03Hfmx8POuDr/mneHXC3gFuQjcyyzcOptbvC0Bcbu6aX9TQuwasF0cuI09u5vDbclNCfcvxG3qyV2rue1tlsB/DzEELcPUAe1y/mTfBz5robRvoFpYLYErTgpSbayGbOwWA5wYSDOLmN3ewOzuBmYPB8wOD3+9sBntZV8eJgZnBBRKK/s6gOzl0MYKYocQvTpA9dpBrhvk3YNcP8gNg7wnkhtCrg95d/h11wJ4BbkI3De1wC0eKMPbEhC3eFOCZ2+buwZsNwdurb0tPru7ReN/djf35G7utgQvcD03JFR9fpf/TiJoGYYNKz/Zz2JT2gWlfQDVA9cuiEXI3t+A7IMNyOLEwHrKFjGLr3/tE8HsUQ7MysTg/NDKXgyNLEL2XQGe1waQCl7fN8j7B7/2v69du/YDg9wYyfCvf2D4c4YZ/vzw694L4F2HXAVcaXDfCu3tlTBNkO2tB7dWc1uK29hhsj0TuJW97U5NfG87ady2hW3Nhxs4S2AIWoag5Cf7qUB0WijtA6gWVkvginjVkwJEbKyR1fMC3Mpu0YxPDDyvf6UwizcZnNiMDn+9MnymX5gYhNZTWtk3hoYUIXtdaFfXIRYA+8FBPjTITYPcPMiHQz4Ckb92c8hN4dd8UMALyEXgSoN7NbS3Mdx2aW7xpoTY3rYrbnFvm7spIfV4Qy3crsjMEiZxty0PlDEELcNP9vxkPxWIThKlXSDqAaqF1RK4arxqwMYQW9LK4l52VWj3Uk/Z7u/E7KnNaC+7Rk0MLoVW9m0BkAjZYZv6/oDYDwFePzrIxwb5+CC3DPKJkE9C5K/dEvLx8Gs+Fn79RwC665AbmlwB7vXQ3sZwa80S8LaENc3oKjA8TJa747Zrc4t72xhusblN7W27vEpmHSartbntY5bA1pagZZjqDSuveJp8Czpr7WiXprQPrHYBqoXVHFwRrynAWojd1IBsrpWViUHqKduDEpiVmwwszMrE4KqAw3WtbMAjQvZGgOxHAkYFsJ8a5NZBbhvk0yGfgchfuy3k1vBrPgXgFeRKoxvD7XuxvYVpgqe57YJbq7ktfXa3D9xic2vhtu3mtmZz22WiQNwStAw/2fOT/QxidV4+2XdBaeln/UkC1cJqDq6I1w2h+dKIRcAiYjczICt3yz4y0crqBxP2bsZf/8IHE1Y343fMImbl8JfsZS+Bg19vCZvVq0MrO4Tj+2BWgJBFxApebx/ks4O/7/8YZvD//Tkd+LHPhp9/O4D3VgCutLjY3spEQeYJC7h1NreXwGMOeA0Y3pRgvU4WuylhiFvPTQnY2lq4xb1t7qaE1OMNVnOLwI01t5PGbfWHG4hbgpbhJ3t+sl+en+z7+HxfC6V9A9XCag6uiFcBbK6JRcRubkDW08riXjb2+teRCcy+IrSQFmbfGAAoE4N3h8/871eQ/ThA9rYA0c8GoH5+kC8McscgXwz5khH58TvCr/m8YBegK20uAlfmCdjeThu3MklYncCtNUmI3ZTwBAO3uLfV99taT+5auLWe3J1H3LK5JWgZfrLnJ/uGn+zbQrRvlPYNVA9WU2gVuCJec4DdEhAr0wJpZB/djF/HtXMz2spKKysTA9zLxl7/it0xi5jFw19X4F42QHCI2fc2vz/w9cGAR5kWjEE2tK6C2CFUvzzIVwa5M+SrRuTHvxLyZYCuIFeAKw1uDLfY3Ho2t3gVGN6UgIfJ8HUymSTomxLwGrDY3lbjtnRvWwu3pbMED25XNN2f3K15W4LrCyaNQtAut0/5/GTPT/b8ZO+DaN8o7dKg5oCKSEWoIlY3MeCq8YqALUGstLEyLZAXv3BeIFtZ3coOIXRQE79j1sLs2cP2MYHZd4U9qkwMbgwNqLSynxTIQhuLiBW8/uXgx//n4P/82iBfD/lGJPJjXws//y8Buhq46xpcaG9xnlCEW3UVGO5t8TCZtLYXJnCLL5NJa3tSArc1DpP9RTP+MlnqGjB8mazmgTLrpoSaT+52ebiBsCVolzxc+cmen+z5yb4uRLug1NOUlqLUAmoOqwhWRCvCVeMVG1gErIXYrY02dlUzmhY8tlk8L9g9oEZa2SF4cGJwRDM6/JW8Y1ZhVm4ykMNfuJeVg183h0/70sp+GhpZgexXBLEA2CFWvznIXYP8Vci3IpEfuyvkmwBdjVwBrrS3nw//fXy2RXMbO0yWwq2nudXP7saaW+sasJLDZLs7cGu9TJaaJViw9bxM1ha3bR5uqAJa4pagXW6HovjJnp/sl/Mne0876gFqyWd9L1C7oDQGVEQqNq0IVkFrDK6I1xhgt3UidtdmfCeLkNWtrDxje3Qz2svm7pi9UF3LpTGr97Jy6OtWaGW/EFC5DrIBnYLYuwCv3x7kO4N8N+R7kciPfSfk2wDdMeBGGlxpb++A5lbPEj4BB8qSe9uAW9zbWq+TYXMre9s1zeJnd2PNbeww2RC3bZ7d7RO32Nx67re1cNv39V8ELUE7d0hdSp/y+cmen+xn+ZO9pymdJEr7AGoJVhGsgtYYXC28bgeA3SEgViYFso/dpRltZJ+kICvzAtzKxlpZmRjI4S8PZuUmA7lf9j3N4r2sTAxuV63sndDIImQRsUOwfn+Qvw75QcgPIfLX5Od8H6BrAffr4T831tx+oSNucW8rra1+ehdfJht7vMHALR4m08/uCm6tw2TWJCH17K5cAea9KaFtc+vBbdtDZF2nCK13tkQkQTtroOUne36yXw6f7PvYkZZ+vp8HoCJSdbaIwDWG1hhcEa85wD4mgViZFTw54GRvaGQFss8Ird3hRisrEwPZy+bumEXMvhsw+6GAPdnLysRAtrLrdrLQyn5TQRYRK3i9O+RHIT+G/AgiP++HgNwUcKW9lWlCDre4t43itvE94GDh1tPcWri1DpN12dvGcIsvk61q7L0tHibD1taCbW6SUHpDQtcpAkFL0M41aPsAKj/Z85N93+1ol0/2uSuk2mxKPfjsAlHPZ30PSrcwEmtTEacIVESqQFVjVYMV0YpwtfD6OADsrgZisY3dNyBFpgUHA2TlOq5YKysTA9nLZq/lakaPJcj9snL4a2Ev24wmBrKVlVbWgiwiVvD6k5B7Qv4Gcg9Efh5iNwXcUtx+ruthskhzqx9viDW3src9pxm/KQH3ttZhsq7P7npxu0NF3Hqf3E3tbEunCBq1BC1BOxW49tG4TqtB5Sd7frKf5Cf7PlD6UCN9o3RLIx6U5oCKSEWoIlY1WDVaY3BFvFqAfYIC7B7QxMYQK23sIQEt0shqyB7fjLayL29GtxhIK4sTA7zJIIZZuclADn/pvSxODKSV/ZYBWUSs4PWnIT8L+VvIzyDy8xC7iFwN3BhuF2YJzWhzu2hvm8Btyd72mini1rO3zd2UsEuT39vGrgGTWxKs+21Lb0joY4rAmxAI2rkG7TwClZ/sl/Yn+74/008LpdNoTbfpAFREKkLVwqoGKzauiFaEq7SvCNgnAWClhd0bECuTggNUG/vMZrSRPRogi/OC4afqlzW//3z9ygCjs6WVVRMDPPwVu5ZLbjKQw1+L9rLNaGJwV4Djdw3IImIFrz8P+buQX0D+DiI/D7GLyL1nArhte5jsmsjjDYLbhZsSmvFrwGSSMPzfGx4m0483CG7xMNnqxvcyWeow2W7N4pfJYq3tdhnYtrnbtu3ONgdbgpagnUnQlsJ1XoDaxyf7SX6+5yf7pfHJfh6aUg3RHEoRpohTBCoiVberglUNVpwLIFoRrrsrvGIDuw+0sPtDExtDrLSxzwmN3POhkUXIyrxAWlk5+CVXcuHEwHP46xNw+OvzeIsBHPySicF3w+f/GGQRsYLX/xXy95nIz0PsInJ/Vohb2dzKgbJv5HDbxPe2tzhxG9vbvlXdlLCwtzUOk6Vwi4fJUo83xHBrTRJKDpPJJEEOkuXutu0C29IpggXbTjchEJTLBLQTgGut9rULVvn5fml8sq8FUQ8+PRCdhU/2nna0FKU1mtJUW5pDKcIUcYpA1UjVUI1hFcGKaEW4Yvu6j2pgnw4trMwJELFHqjZWIPvCZjQtQMjKoS+5weBc2MpeDLcY6Je/hhOD94a97IcijyV8VmEW97IyMZBW9m6YFmAjqyE7hOovQ36VyS8hMeRik6uBG8OtbG7lQNm3HLj9YuR1si5722LcNqNJwqtb4Lb23vbx0NzuFGltt20Wb211aytzhLaw9bS1KdAStwTt3DWxpXCd5Cf+pfT5fh4/2df6TO85WW9BdFqf7Ls0paUonVRriihFmCJOEaiIVIGqxqoGKzatewFYEa0I1/0UXrGBRcDK4S5sYp+r2tjjmtFhL7m5ABvZM5vRvOC14RO2vPp1OdxigBOD5OEvA7O4l5WJgbSyCFlsZBGxQ6T+OuQfIL8xgj9Hfh1iF5H7C4Vbq7nFA2Xfi+B24TCZugbsSz3hFq8Bi+1tU7jFZ3fx8Qbc2+r7bQW3bScJ+snd2NbWgq3e2np2tjnYWm1tm20tQUvQ9gpaD2L7hmutT/x9f8qf1uf70k/2fXym5yd7/yf7tu3oDh0gWtqUWiiNNaYaowhSRCnCFBtVjVQN1RhWEayIVoTrMxReD1MNrABWWtjVzWgXi4iVNlYOe8lGdmFaEIHsJXAd15ullcWJgfOxBNzL4sTge2pi8BM1L8BG1oIswvUfHdHIjeE2BtufJZrbGG4X7W1zuFV721Lc4mGy2N72cvUyGT67u6YZvUyGjzfg3lbfbyu4rbG3xdZ250hr6z1E5m1s27a13m0tQbucQTtFxFqg7QOu8wLUvnektYDaxyGmWveRLvVP9l0hWgOlnqbUAmqsMdUoRZgiThGoGqkaqjmsIlhjaD1cwfWoCF6lgR0C9oUKsNLEvgwQi23ssJ1bI9MCBdlLw+druY7rHaEJvNYxMcDDX1+O7GXlFgOcGNwTmRdgK/trBdh1QB389/+/JYP//3/KBX4uAteLW6u5LdnbpnCLe9sah8k0bq8ynt3tgltrb9tmkvBEZ2vbFbbY1iJqrba21r21xC1BWwW0XRBbitV5BOqsvXHvAeok21HPZ/pJNqXT/mRfqyntgtJarSmi1ANTwenTI0jVUI1hFcGKaLXg+hyF1+c1owkBAvaEAFhpYU9WiB1+Uj5DtbFy2Ot14ZP0JXB7wRtxXtD8/tP2u6GVxVsMUhODr6q9rDUxiEH2Vwqy/xjB628h/8cR/Pkx5GKD++sWswTE7Q8ie1vrMNlX1d62Cm6b8b3t24xnd/HxBjxMhntbmSSc2owmCS9uFl8BJrjFva3V2naBrRwiwzmCd4pQ2tbysBhBOzHQehDrmRN4EOtpWWthte8DUH2/cd/35/s+tqNtd6TWxfldIWrhsxSiOZRaJ/BnAaKlTSmiNNeYapR6YCo41UDVSNVQFawiWC20IlyPBbweH8GrNLAI2FeEZg0Re7ZuY5vRYS/ZyF4Jd8pakP1A5NWv2xITA7mS69vqSq4cZn8Zw2wEsojVf3Ykhttce1sySyjBberxBgu3uLf14HZhbxu531Zwi3vbi+F+2/Phfltpbc+A1vaUZvEVYIJb3NtakwRsbT1zhNzOFhtbvBVhs2b8VgRpa1OovW8EtRZsOT9Y7qBt+j/wVaOJ1WD1tKy12tS+P+v3/YRol8/3pZ/y+76DdN4/2dfelPbxyd6CKGLU05QiSnONaRuUaphqnApQBakC1RhWNViPCyBAuJ6omlfB6ykRvMqUQACLTSwi9iI1K5CN7MK0QEH2fQDZklbWu5f9ubGV1ZD9bQSv/wL5V0fw52vkLgJuYpbwS+O2BMStdQ1YF9zi3taDW9zbWo83vNV4vKELbnFvaz2567n+KwZbufZrx8aeIjzc0dbGJgjWgbGJHBYjNAna2ohNQdYD11ptahegehrUPk7i10JpF6D2cbhpHj/Z97kptQ479Y1ShKkHp6WtqQenFlA1UgWqglUB63EA1hhaXxLyUtW8yrVapzWjw1xnNKMtLAL23PDZ2ELs5WpW8LYIZG8AyH4QIFvSyuqHEvReFg9+5VrZ3xqQRaz+myM53EaB2yyeJdRubj2Hye5Ue1sLt9ZhMmtve7XxeAPubWWScKG63xavANOThNzDDXj9F84RELa5A2QWbLdWbe3mkbZWTxA8qC292ougJWg7g1ZDtnROYEFWAzbXrE7rkJSnQZ21k/hWe1r75SYN0S4obXsNlNWM1vxkX9KaWgecLJRqjLb9ZI8ItSCKGEWQelBa2pp6UKphqnEqQBWkClRjWNVglcYV4Xo64PUswOuaCF7X7WEBsDInuAya2DdBGyvXb10Dh71wWiCQxUNfeIOBtLLrDn41o1sMYhMDD2Z/5cCshixi9f86UoJbhK1ubT3NbQ62PzHut7WuAfPiFve2iFtrb2vdb4t725Ind/VBstzdtjJHkENkAlu9s43BNnaXLe5rU20tThC8qI0dFiNolyNoZ6CVRcim5gRewOaa1dJtaq1DUl1O5U/7ntKuV0JNsiltC1SrGZ3W53vrgJPVjlrNqOfTvfX5HkFqobQmTNuiVMNU41SAKkgVqMawqsEqc4GzVOsqeD0Pm9cIXqWBFcBKC/tm1cS+M9LGvrf5/StfN8K0QCArV3HJvGDs+Vp1t2xqYqAxGzv8lYJsDrH/XpgcdBG4Xtz+Wj3mkMNt6mUy3dymHm+I3ZRwu+cwWWPfb4t725Ind/VBslMSrW0Kts+IwFY3tnJ4rKStXdmMvzgW29UibNvODzRqLdsQtwRtErQpyN67oIXNAbbtTrWPU/yT3J32cRJf43QeTty3BWrpiftan+9LW9PSz/aeT/fW53tEKcIUcdoHUGvg9LQIUhGqFlYRrNi4nqdaV8Tr62E+8AaYECBg3xQAKy3sO1UTex20se8DyN4UoPNRB2TxxS/9fO33M1dy6b3sP8BVXLGt7L8oyFqI/Y/C9I1bz+bW8/Ru6SwB97apZ3cX3W+buAIs9yqZ3tquacaf203NEazG9pkO2MqtCLEZQq6txQlCale7IoFagpagrQbaNpC9TwSyFmJzgK0JV43UPg9JWafza37Wb9ugWp/xY6fwZ+X0femmtPTEfa0daS2UWu2opyG1Pt8jRhGkiNJJwDSGUg1TjdNXR5C60KwqqCJWEawxtF6s4HoZ4PWqCF6xgV0H2NC0XYdNrEJsrI39lGxkAbJfwENfzWgr+011tyy2snpi8HNjL2u1shqzOcT+Z2FKcBuDbY3mFlvb3CzBgq11mOwrxmGyzyRwa10BlnuVTG9t9YtkqTkCvkaG137hfbb68Ng+zfgMQV/15UXtymbxrlajNndQzNrTErTLFLS1ZwYIWquVvV+TnxMgZBGxGq8arW1mABqpbfeoHqxqpPbxWb/Gk6O5U/jTvBLKuystOXHfZVNq7UlLN6WrDZx22ZR6IIoYRZAiSicB0xhKNUw1Tl8bQepCs6qgilhFsMbQeqWC65sVXt8ecPGuAA1sYAWw7wmfk3EXi4j9WADNJ6GNvb0ZbWSxkY1BNtXKxl79WnS/bJPfyv7bBEDbFrelNyX8OrG39cwSYo83RFvbZnyS8GWcJBh720+stV8lyz3coLe2+tEGvNdWwxbvtNVTBDk8Jtd9ySMN0tbKVV97NPFtrUwQck1t7gYEQW0OtHxNjKCtfvjL2sreN4LZNohFwCJeUy1rrlnVSG376d+DVY3USe1Oa21NrU/4XQ461fp8X/rZvvRwU5fP96Wtqb5CKgZTT0vqaUoRpdan/FpAzeE0BtMxnEoUUrFV1VAVrCJYLbRacH0n4jU0ZtcGZFwfaWAFsDcpwGITu4DYSBv7ZdjIyrTAgmzu+drULQZWK2s1sxZi/19hZrm5nRhuG98kIfdwg97ajj3aEJkjIGxPBdjqKYI8r4uPNBwCbe3TjLZW3127qonvanPzA31XbcmelqAlaItmBqVbWQ3ZByjIdkUs4tUCax8zAC9Yc5/3+9igetrUHFRzSG17Et/zKb+Pi/QtlFoNqbUj9WxJrc/3pYeeLJB6WlIPRBGj1qf8Ns1psjVNoNQDU8FpDKiCVIFqDKsWWGNovU7B9T0RvN4IDazsYVOIXTcpgDbWA9lvZeYFuVe/vDcYYCurIdsFsbVxWwLbts2tdVMCbm1/WLi1/WriIFnJ9V+xQ2T41O5CY9vAtV/N+BRBNrZ4l+2JzfgMQbe1iFqcIOzZjE8QHq+aWo3aWFObuv1gRePf0xK0Sw20Tb8vfyFoU61sbF6gIbuxgmwOsSubxVMBxKsFVqtlTZ32rwXW3Ba1FlBrtal9f9a3YFraoHo2plZL2gWlXT7ld/mEX9qOIkQ9GLU+5WdbUydOY42pRinCNIdTDVRBqkA1ilUFVkRrFK5DRBh4vRnw+lEF2E/CJlY3sTIpEMTirOBrcAXXt6CRFch65gXehxJqtbK/K4wHt7VnCam7bX+zts6Tu7q1zT2567n+C29IsA6RxWCLUwS8GQE3tnJ47PRmfIYgDzTIy2Orm/FtrUwQDmjGXxvDBxlSqJX5gb6rVlCb29OW3E/LPS1Bm50ZlG5lNWQ3SkD2IRHArlQNrJ4KIF69YC2ZBHQFa+kmtS1Qu7SpfX3aL3npqbRB9ZzAr3X6HjHqAannJH7pp/vSdhQh6sEoghRR6v2cn8JpG5RqmGqcjgE1glRsVxGqiNUFsCYa15sArwjXWxReb4VDXRqw0sJ+CZrYGGJlViBtrJ4W5Hayv+y4lfW2sr+rlGk0t17ceprb2C0J+n7b0rttrdYWr/6K7WwRtrixvRJgi4fHrBnCyaqt1RMEueJLntHFXe2ezWhXi6jF+YFsavWVXjg9SD2TywNiBG110JZuZTdsAdkYYrdqFk8FEK+ls4BacEW0esFae5vqbVRjWK3xeb/mJ/4u10R5kNrleqgun/K7fMIvbUlLUYowRZxaQC1FahFOE0DVSNVQHcNqBKyIVguu2LoiYDVeP42ADRBJIhYmBXLIqy1krXmB55GESbeyk8Jt60lCQXPrnSSkYJva2X7R0djGpghyny2+Qqb3tZeqttaD2uNaoHb3ZrSptQ6Kxfa02NJaDy/g9ICgXaqgbWZvZmBBFjFrQdZqYi3EPrrHttXTtCJaa29Uu0DVi9Uun/lLG9S+7zEtvWDf05h6ropagKnCaesDUIkT+p62tBSlCFPEqffTfhKpLXBaClSNVA1VwSqCFRtXq3X14vUOBdivCGChif260cbqWUEJZGP3yiJmS24w0JD1ILbLf9WaJUzyblvEbckhMoQt7mz1FMED20VXfjWjhxpybe1lcIfthcYEAVF7ggO11vzgCc34Aww7NIunB7inrXVAjC+IEbRFoPXMDDytrNXIWojdNtLAbg94Rbh60OqZB3iaVkQrghWxOg2oerGKUMUm1YPUUpz2fZ+pB6k1GtOun/WtK6RKP+V7mlLEqAekiFLvp/0azakHpxZQNVI1VAWrCFZsW6NoTcBV4/XOCGC/oVpYvYv9voFYubXgp+qw1y8ikI3dKzvJVrbWf80jbq3WNneIDHe2qSmCBVs8PIYvkC2aIcADDW9Th8beoG5CkCu+zmrGd7XWYTFErd7Uyu0HOD3Y2TE9KD0gRtAStFV2s56ZgYVZbGWtaUEKsjHE7hTBq2fb6tm1doEronWaYM0dokK4IlqxUUWwIla77FH7uN80i9WKzan1id9qUS2s1vikXxOoiNRan/g9DaoHqTmoaqxqsCJaLbgiXu8w8HpnooEVxH4r0sJqxN4daWN/qtrYFGRj84IYZrveYDBroK2B266HyCzYYmNb8liDniJYtyIUtbUtUIuHxaymFg+K6Su95FUxPT2Qlnb7ZnTrAba0K5vFW1qClqDt9RWweydmBriZRcxaW1mrlUXIeppYROzjM3BFtO7umAl4JgLYuuJBK0Rr6Wa15mn/kpbVugcVwYpYLf3c3/cF/NO6QsrTpHquk2r1ST/TnCJKPTBdwGnFT/yeBtWDUwSqRuoYVCNY1WC1GlcPXL+eaGAFsJ4m9h7VxnaBbOpeWc/EINXKTuu/PNBte0NC10NkpW1tDLZmW5tB7e3h971+nEE3tdc7UYvzA9zUyrVe8giD3H6AV3rhnhZbWjwgtotqafWWdsum240H1a/wIkCXFmhTu1nPbQbYzCJmra0strLYyKba2BhiY4ezPI2rhdcUXGO3BBxkwBXR2uUO1T4mAdiyYsNqHaRCsHbZpnb59J9tU1tsUC2YetrTLif3e/20jyjt+Im/7wY1C1REqgOqGqsarDgVWEBrAq4WXq0GNtbCtkGsB7KzvJXtA7Qe3NY4RNbmsQarrS09OPYNxwRBbkLAA2PY1HrnB7ipXQOolbtq5UovmR7gnhav88KWds9ESxvb0uKNBwQtQTsx0HpuM4jNDASzJa1sG8jupgCLzSvi1XMwy5oNpNrXQzONqwXX0sNWnkNWngNWXeCKaJ1Ys9ri7tMuV0t5WtRsk5rAat+f9j1ARaT20aZaUI1iNQFVxKoXrGNoLYQr4tVqX60ZgQexnjY2BllPKzuLW9lZAm3NKYKF2tShsdQE4a8SqM3NDxY2teoxhmvhhbG3qtsPFqYHzfghMbn5QFpauaMWH16wDojt1cSv8drRmB08LDE7IGgJWhdoEbPe+2Y9u9kcZreMYDbWyiJkayPW277mZgO6fS2Bq4XXLnAtnQfgNMA6YIUtK4K1y12pXS7s9xykQrR6dql9YHUSYM196keglrapCNXcLrXLZ38NVESqB6oLWI2AVaNVw1Xj1WpfrQ0sNrAIWESsp41FyP66ELK5VjbVzLZGbFPpv3qaIuRmCZ6mNnnV19qya75Kb0LIzg/WLj4ohtd6lexp8eYDvM5LXhSThxf0/bSypZWXxPAaLzkc9iQDtI9u7CdxY3fSlrwcRtAStG7Qluxm8QCYbmb1xCDWymIj64XsngqwpYe2DjTmA4c629eS2wNKD2FZbetU4KrQ2ve1VKUHqTxYzX76dyJ1GlD1nur3ALX1p39nm2o1qYhUhGoUqwmoIla9YNVojcEV8Wq1r9jAYgvraWItxGrI6mmBhuxUWtk5B61nW5u6w7bL/CB3WOw7CdQuTA+a8j0ttrRvgZYWD4jhVV56SysvicmNB3p2cBDMDqwrvKwdrXUnLUFL0FYHree+2dhuFg+AeZpZwWyslW0D2UlNCCzEro5MBrocyPI8FtBlKoAzAZwIWPMAxGvfT6Na84AqcJ3Bu1L7PkhlNauedtWzV23drCq0ehpWRGspXDVeNWBrINaaFCxCrEC2SR/48hz6ImgJWoKWoF2yoK31Ilisnd3IaGdxaoAHwBCz2xmY3VlNDBCzXsjmEIstrNXE4owAATspxJa2r7EGtkb7ugiuPc0DqjeuTrRaDWutO1Rr3J/qvZYqu1NVULWw2qVljbarCaxaLasFVwutCFfEaylgPRMCAWwOsdYhL+tBhNyBL4Rs1xsMpoLYOQGt6/aDtWU3H+CzuTg78IIWZwepw2E4O7B2tPLgAr4iJld4eXa0kwSt9xlcgpagzYLW84BCrJ1dCe0sTg3wAJhsZmPNLE4MsJX1QrbGnKALYkvuce3rhoFa7Wvt2wM8B7LwMBbitQ+4lrass4BWz2bVg9VJ7lc9WEWwIlo9bSuCFdGaa151+6ob2J8mAFsTsda8wGpk57KVJWgJWoKWoJ130Eo7i7vZVc3oAJhuZnFmgBODEszqa7UOMiYFsWu19KTg2QZkjzEgazWxNRBrQfaMCGQ7TQgAspNoX60G1oNYz1yg1kxgmq1rjZsBLLjWalxL5wEWXD2Nq6d1RcB6EGu1sSnIFu1jm/iDCJ55AUE7+clB6gqvEszi5ODHa0eviKWex41e3wWTg9xNB8M/997djD+Jm5sceK7u8h4KI2iZiYC2zd2zJTcbbA5zg60KQSvtbGxmUILZrtOC3LVaGrIvUJCd9C0EsUmB9zDXBcacAKcEnqux5hGxnmuvSgHreXq1aDbQ+HatHsRazWvpxtUCbN+ItQDbBbGlcwLdxupG1mxlC5rZkhsMiNi6L4iZ+1knaGOYta7u8j6ygHfR3l6hnb0M2tkLHM/gyothq8O/F49s2t1ywGu7CNq5B63MDayDYHijgZ4a4Ga2LWbbXLdl3VRg7WM904IaiPU8/3qOE7EXGG1sW8R2uSarFLGeWwY8LayF11o3DCBii166aupde5W9o3Vt+d7VulGgj/bVmhB4ZgQIWA9irTa2DWR/0wGynBlMD7R93ENrPa7Q1z20uXbWcw/tyY39WhjvoWUIWoKWoCVoCVqClqCtCNq2iG3zUlgKsrG7Z7vcbBDbzeL9s7eEP48+HP4MK8EstrPnQTv7KmhnPXfQHgTtLO5nrZfCtg1fa/n0LUE7c6DF/ax19+wjnKCNzQ28oC19jtbzkleXw18z89hBi1sLNGjfENnJXuGYGCBm3+rALD5esHC1VuJ1rewhr6afRwp63cc29a7M6vuuV899r30j1poW/Hhtfl6Qmxh0nRn8Zq19HVfb3WzqNoNeXwHrCau1mtg+Dn9Z13N5NrOtW9km/5jCbYDZsWa2YGogDypcAA8qCGbxQQXczuJhMGxnD4R29imJdnZVs3g/mwKtdWUXYpagJWgJWoKWoCVoCVqCdsmAtvpWtil/EazLfbPmAbC1i280kJfBYs1sCWYvNO6exZsNcGqwOvx78UjVzj7d2c7G5gZbJOYGBC1BO9egxVfBrLtnrUNhpffNWjcbHOlAredmgz6v5+r6OEJ0cuC4nusNDtz2fSXXJG8zmOpNBo3/Gq5auLVg2+VlrlnAbeltBr3Cdq1932zJ4wlLBbSlc4JpTQtKruTCWww0ZGu3svqZ29KZwZpmdKtBbDd7HGD2aAOzTwv/Lt7L2c7i3OBhjf92A4KWoK0K2hXN+CthtW856AJaa0db+gpY33fP5tpa3djWwq3V1npwm9vTlr7wNY+4XQ5XdZVuazVwJ3XLQR9XdXWBrXVVlwe0HtR6YJva0FbHbUW41pgWWJMCD2JTkC098CWN7I/Xjs8LrCu5rK2sHPy6fe3o4Be+BHZz+DPqA7CXlVb2mvDn5tvCn7NXhT+X8Xqu89WNBjIzOEU1s3KrwTHN4ntnn9GMHwSzrurC7eyjggEeAZjV7awFWnwhDLezeF3XBgZkrVdTCVqCtlfQzsI9tNb8YFL30Fqw7TpFaH0PbTO5K7xwjpCdIjT2QwrX/67uQwqz0tz2jdtZe0Chjyu8+oCt9ZiC54BY28NhSwW0pXOC/3BA9l/XFjyO0NiHvdoe+NKQ/Q5AFg99peYFbVtZnBjUxuwRCcxaUwO52eDR4Qtt7u7Z1O0GBC1B2wtop/lSWMmzt/s3/W9rPbcf1HjutmtzW7qzrT1LsHa3ns2t1dyOtbfG5jbX4M4TdBG7pTckzOMTt6lnbms8cdvH/bR/b7S2XV4K88C29xsPpojYfzfS+oWvHvaxiFi9kc1OC6CRxZ0s3mCAh740ZHEri61sycTgJeHfQS9Sm1m50SDXzCJmPQfBrKu6UofBYrcbELQEbfalsNxrYakdrYBWt7T4Wpje0gpqY01tan5goRZhWzpF8ODWmiJYza31+ELJk7hWk+ttcbtsbmu0uNZMwTNRaH3lV8GzuPMAXcRu6fO40Xa36XYtWK0HGvrY6FrP4yJ0PchF4LbBbWxj68EtwrZrW1uK2z5S46aC0sNdqadqSxFbso8da2PXjh/28kB20YGvZnR7QQyyOC9Y2MoaB7/OTLSyeJuB3DWrN7PWzACbWWs3ax0E81zVhaCtvpslaJc3aHF2sFH4jfjg8P/K0ofDpKXF+2j19EAfEMOmVs8PPG2thVvr4FgfO9vauLWAOwu4HQOuo8W1kOu527b05oRkmztn0PW0ughdq93NbnRbQNdCbi3olj6n6wGup8W1cOt5HteCbemTuJNua2cJsW0gm9vGeg95xa7ekudqU5DV+1icFeQaWWta8J7wZxLuZOXQF95ggPMCq5XFO2axlY1NDA5rxg+ApTArzaw8cbudgVk9NfDcbNDr3bMELUH7gMa3pV3ZjN94gKj1NLWPU22tB7cIXGuS0GWWYN2QENvc6qdz20JXY7fLtWA1bk7Q2I3NFaLgTTS6Fng9ja734NmswtdzGM2D3y4AnoVHH2rdwOC5VszT5iJ273bMFBC5f+uYJfzKidtpPb7QB2Jzm9jWL3kVNLE1EJt6qtZCrLWPlcNew3/2P6Cu4LquGd/ISiMrtxfgVVy4k0XI4lO22MriVhZbWZwY4LO2+jaDJxQ2sxZmcwfBer3ZgKCdL9DGcJtC7b0KZgcIWmxpcXqQQu22EdTKQbHHFMC2FLcIXGxwrRfHELjY4MbmCXj9l25ynx1B7uoIclPQtbDrhW6NK8I0ds92YDc5XYhgt8ZGtwt4JzlpsLCLTa+n7UX01mp9LfD2seOtMm9Q8EXslkJXN7q5qcJPWuA2BtvSKULXtraPzGMTm7upABGbuq3AOuRl7WNjtxZcF/6MeVdkIxubFmjIngmQxXnBiZF5gWxlc62sHP6Sq7l2aeIHwHKYfUgGs552doMMZrmbJWjdoM09g4vTA9zTImpxUysHxfQEwQtbq7Wthdu2EwW9wc3NFXSTuzqB3K673C534VrP8Kawm5sxWM1ulxlDF/BWaXkrNrwL8HVOHBC+XaYOnk2vB721bmzwHF5D7C4g1zllQOTidOG7xlzhh5EGN9bcemYJ0Z2tY4pQs62dBmKLHz5Ya7/khYj1QPYe1cbmILvwEEJj3x+rIZu7eiu2j5Xrt3BWILcW4GEv2cjKzQV6WqAhi4e+ZF4gW9lUK4sTA7lnFq/m8mLWamYf6MQsQUvQtgZt2xsPcHqATS1uavHRBd3Wbqca2xxuc82tILdP6MZaXN3kHubArtXqlqC31k0L1m0LiF4N3xx+rUlDdNbgvIEh1/K2AbDnZoZaEwer7UUAexCMEPbMHfp+PQ0hXOuA2wKCHZMHDd/sTQ0Kvd9IQDfX4uotrqe5Tba2TXpnm3tlzItbC7r/6UjtOUHXJtaD2LvVpMC8bmvt6IBX7qYCROzHjTb2fZE7ZOVBBN3GyqxA72PlsFcKsvrA1+rw7xLZycYgK48leFrZVc3onlm8mgtvM7Awi4fASneziFmCdomDttaetmRLu1FiflDa1lqwtXBrtbe6wY1NFHCmgIfMcgfNUjcp6DY31uha2G0L3i4zBqvdtQ6nedBrwde6R1e3vSUH1rxtbwl8a7W/teCLza9n8oAA7uOQmwe/FoCt3W9pG5ydPij0Inix6cWGd6zdTUwX7jLmCt81gPujyPb2bxK4bbuz7TpF6JIac4JFgC1sYhGwbe6MzV23lbo3VhAb28beqNrY65rFtxXIy15jbaxjVnBaM7qCSw57yUY2BdlDIpDFecEezeixBNzK7uRsZVeGf+/H7potmRlwN0vQTuWAmDU/QNSuVKiNtbUWbK3W1sKtbnA1dJ+opgolcwXd5MYOneHBM93q5tBbCl9r0mA1vJ5219rtetBrwbdv9HoOsHkAXKv9rbX1RQR7IGxhuNfDbo3vpgdEsGcGYbXAnt0voncBvGrmgA2vbnc90I0h99sKtz9ITBNisC3d2daaIljQ/Q9H+p4TWFdteR4+kEmBtLEld8YiYnO3FIwhtsnfVIAPIcg2VrexnlnBS8KfwfrWAjnspTeycqdsrJHdQ80Lcq2sNTHQV3P1NTMgaAnaYtC2bWo1bPUEQcN2qwRuc82tIFdDV2PXmiuUQFdjd68Mdq1md7+ewetpea1rx6yW14Nez80MtdDrgS9ufD0IrtICV5g+XBFBcOkGeJK3PfSxB0YEezbAFnoRvDhvwIZXt7ufV62uRm4KuBZu/9oALuK2eI6QaWu9UwQLuv/uSAyxnidoJ7GJrXVn7GdykwKF2NxNBXjllmxjdRur75CNtbHHJyB7eDN+2OsA1cjunYGsvo7rUaqVjT2YgBMDvGcWr+byHgDLzQwI2qUA2ikeEPOg1oKtta21YIu4tdpb3eB6oRtDbq7VteYLuXbX0/B60FsK31L0ena8Fnq9B9hy+C29gzeHX73x9UDYe7ND56vMsP11IhghjBiexO0POQD3Oodw4hebX4SvRu8tkYZXt7ufwVbXgVwLuNje4jTBmiVYc4RS2NbCbQlcEa81m1jPDQW517u8iLUmBdE7Y9fa121dHbk3Fl/zwiu3cBvrOeSFbazMCp7TjF+/dVj494BAdr9mdNjLamTxwBc2sjgvwK1sl1aWMwOCduoHxDxNraet9cDWg1vd4HqhW9LmdsWudTAN4evBb27Lm7pft+9Nb+lBtlrXlHmaX0SwB8Klh90sAJfg19sAL0C4BYZr3wYx6TlE0TVoa+37fhG82PLGsPupAuQicPGmhRxupbmV1hYnCQhbbGw9qM3dY5vCrZUSxEYPeDWLn6BFxLZ9vcuaE7RBrGdSsOiWgvD79Wo1KdD3xq57AAHa2NdGtrGpNla2sc9XiJVZQWofu3czurVg92b8PlmBrLWTxUNfMi/QB78eYrSy1uEvzgwI2omAVqPWMz9A2JbMEB6awC0CF9tbnCZo5D6yAnZj4PWg1wLvvKPXA9++bnCo0fwigj0QbnvorSuAEcEI4dI5BIK41q0QpTdCIIRrYTh6O4TCLza/CN8x9AJ4seWNYVegm0WuAq40uGPtrYFbOVSmN7d6juDZ2VoHx3Rrq5GroWslB1fEa+qGAs8mFhH7N8akIDcn0LvYO43DXYhYa1KAu9gb1C5W3xmLB7zw3lh5ACF1U4HcHfuSTBt7lGpjY/tYL2SlkY0d+PJANtXKWhMDzgwI2pna0yJqsa21trUWbC3cInCxwY21uNjkprC7bQS7HvB60GuBtxS9CF/Eb+4qstS+15o7lG57PfhFANe+0SEFYA+CEcKIYQRxbgtccw/cZQ5Rug2ehdshSjGMEPZMIqIPYQB8Y+h9TwK7At0Ycj+ukIvAlQYX21sLt3KoTLe2Fmx/mpgilDytm8KtlRxivTcUtG1iEbHeu2I9T9DmrtpKPXwQuzO2C2LlWVp9U0GsjT00/Hl7YDN6DCE3K9ilKZsW5CBbspXFVrbWzICgJWiToG0zP7DaWmtbi7Atwa0Grkbulhnsbh3BrtXu9oFehC/i1wIwItgzd/Dew1sC3y5b375udogB2INghLCF4Vp74FIAI4IRwohhTyuMIG7TDufuBLba4CiEe7oqzbofGBtghC+Cd6zpjWB3EXQN5N6kkCtzBQQutrdR3Dajza1ubXFri3ME3dhmpwhr46+P/Vah9J8dyTaxTfkTtCVNbOqardInaD2I9Tx8sOjO2AYePwiTgnOa9HVbeG+sPIAQu6kAEXsQtLEWYq02FmcFsVsLLMhuFoFs21a21syAoCVo3aD1zg80bGP72hLcauBq5Kagm8LuwyPYtdpdC73WnAGxi+C10IvwRfx6AGw1v7XQa7W+fQPYwq8HwB4EI4QtDE9yFmFNIywIW9MIaydcayZhITjbCDtb4dJm2PMsMra/VyXQGwPv1Qq60TZXIVfmCgjcTyRwe0fYcMqtCbq1RdjizrbNFGERbhVw/0kB1co/OVpYTxOLbazVxOau2fI+etAasc6HD2J3xp7XjG4pOCv8c5S6buu4ZnxSIPfGHqkQ+wyjjcVJAbaxuxptrMwKYpDdsvFPC2q3sm1mBgTtUgLtBOcHGrWxtjYF2xLcInA9yEXoInYRvBZ6U/Bti15P09sFwNbcobT1tfDrmT0ghD0Y9t74UBvAnjkEYrh0G9zHPtgzjbBaYQRxm3a49k64j2lE6RPJCF7d9GrsxqCL211scwW5CFycKWjcfjJ84v50gNbnVGt7J7S2OdjeHbkZwXMrwtgkQSM3Ffz5qoHtMieI3RXrvWYLEZt79ODja/P3xRa93tWMX7XVFbHWpMBCrDUpiB3y0nfIxmYFcv0W3lqgD3s9WCHWc4NBrpX1PGdLxBK0U2lrLdiuaOIHx/TNCHpvayFXAxeR2wa6Jei15g01AVxj9uBpgD27X6sBLt0Ae9pgC78IYA+CEcKeOQSiuI9m2HM7ROlOGEGMKLZg3PdMwnNrRK2Dc9bLcYhfbH4vTKA3Bt4rFHQRudjkXhOaXAQuzhRuTOBWYGu1tinYfi8B29gUAWGbxa0B199MELHRXWwKsU37Rw+u7/B6F1619erw+1YmBac08Ttj5ZaCY5r0LvagZvF1W6U3FQhi9W0Fj4ggdmUEsrEnaxGxbGWZuQBt220twtaDWw9wEbkWdK1G14ve2k1vV/ROqgG2mt8+dr8eAFv47QrgGIataYQF4y4H5ax9cJc22MKwtRm22uFaN0iUziS6NMOIYASwdW3amgR6Y+C9SEEXG12N3LcjcNVM4T0J3MYmCZ8thO33HRtb/UgDAlcjN5ZfRfJL5+0EbRGrd7F/GbuhoCJi277ehVdtvTL8fs3dGfvcZvFTtBqx2MYiYrGNzd1UgG1sCrIWYjdJQPYB8O/vFc3iO2V1I1uylSVoCdoi0NY+LIaoRdh65gge4CJyvdAtRW8pgLug1wPgvhvgXOOrW9+2DfC8zCEQxX00w9ZEou+ZRN93CHsw3PcNEghgxC82wK9KoDcG3teqSQM2uhq5V8FcAYF7NbS3MdzKobKPwmGyWwG2n0vA9q7EXbaxWxFyuEXg6vy9OsgleEXA9o3YLyVuKBDEenaxtRCLTawHsaub+MMHeGesZ1KAiMWXvHbMtLF6Gxt7DEEjNgXZFY1vWuCZF1S7kouIJWgt0Lbd1lq4tWBr4RaBi8j1Qre03e276bUAvFQmEH0ciKs5h2h7PZoFY6shtjBsQbjvmURpS1x6lZrVDHtelKt1iwQCWL8oZ6H3tAR2BbqIXGxzpclF4MpUQRpcC7cLswTV2n4Y5gjWzvZLcO2XdStC7LqvnyRw+3M4pPULI3+nDnIJXhGwvSI2s4stOdwVe/Sg9Ala3cTKVVttHj6wEGtNCrogdiUgtnQfi5DFRjY3LfDsZNdL2IOgJWgnAlprW+vBrTVLqAldC72eprfLvMECsIXhWZ5AeAA8jQNxbdrg2jMJzwMZfTTDpTOJLi2xZzPswXDft0kgghHAL0qgNwZejV2ELra5GrkXNqOpAgJX2lvELc4SpLWVw2QyR4jtbHVji7cifEM1tvqBhrsTuBXg/gyQqvMzCOIVAfuTyA0F1l2xbRCLbewsI1au2jq6yV+1lXr4AO+MfVyTvm4LD3jhpECepRXI4qTAuj+27T62tJElaAnaieI2N0WIobY2brtA10Kvp+nt0vqWNsCTnECUAtiD4T63wdYswgtgD4YntRm2IDzLGPZshj274Vq3SXgQjAB+XgK9MfBq7CJ0sdHVyF0DwL0AJgqCW2xu3xIOHL0zfPa+NuBr3RwBbkm4OdLYWlMEC7Y4RbBwK8C9B5Cqcw8E8Rq7YuuvE9dsxRCbuqGgyy4WHz2Ivdx1CTx6cIE63CWPHpzejB49OFkhVu6LPVYh1nq9C9tYD2Ktp2g9iMVDXlYT6znkVbKPbQPZKvtYIpagrQHa9SK/UWs3t54W14KuhV5P01va+nrQOwsALsWwpw0ubYYntQ1+lLMZnmRL3OcNEn3A2JpLWBi2IFzrNglPI4z4fTaAFxvfGHZj0EXkYpsrTS4C96wEbuWA2aWR1vYdao6AsMXGVja26w6PNeO3InzZaGxjz+pq3ApwfwRI1fkR5O4EYPHBg9w1W3i4y9rFRicFje9wFz56gIjFq7ZeC20sHu7CXaw8enCiQqznCdour3eV3FKgm1jPAS/PIa+Sfax3WlD9wBchS9DWAm0fuLWgW4reUgB70FsLwH23wZMEcOkcotY0olYb3PdMYiliuPRqtVrNsKcRRvwifDV6Y+DV2EXoYpurkXsKAPdV0N7KPGEdbpvR7hZb2zfhHEHBFqcIH87A9osR2OKtCNjaIm4FuILcWH4AeE0BtqSJRcSW7mKtJtZCLDaxpYj1PEFrITY1KYjtYnMPH6Su20LEem4qqHHI64/Vv9NrTQtcoCUYlxloZwS3Fmgt3HaBrge9k2x9PQCutQGu1Qx7MOzZBnfZA1sYrnVTRK398KxheFIw7ns/3PbBDY1fhK9G72EKuznoauQer4D70gRupbk9L2w0sbW9TM0RNGxvUI3th8On91vgui/PPbbY2n4LmltBrkA3lu8CXmOAXWhhAbG5JrbL4S6ricWXuzxNrDx6cEozvotFxHqeoLWaWAuxehebQ+xWTXxSgG0sAtaD2NzTtJ5t7L3Uv98904JO+1gikaDtE7RdcNsHdGuht7Tp7QLgWW6D+55J9N0MWzCutR/u+z7hUhhPajJhXa/W5WaJLo9uIIARvwhfjd4DFXZz0BXkInBlriANroVbmSWsa23DJOH8gK3XK9i+KTFFeL+67utjcI9t8oEG1dp+IyD0LkCuQDeWvwK83gUPHSBiv1rYxHp2sbHnZ9+hDnfFnp99nXr0QF7uOkMh9mRoY3EXqw93xZ6gPajJH+7SkwLdxKZ2sVs1+YcPPHMCC7EI2baHvFJXb1WdFhCHBO2kQVtrltAFul0A3GXqMC0Mz3sb3MetEX1coTatzfAsXK3W5dnlSTXDiGDEL8JXo3dfhd0cdAW5CFxpcI9pRntcaW8Rt7K7ldZ2iCucI6Rga00RBLYfUbC9TR0ek2d1BbfrJgkBoV8D5Ap0db6OcFUN7J2qhb0j8+ABNrG1EBt7fjaFWGxi9eEumRRYh7ssxJY8QVuyi2378EENxLa5P7bqtIAgJGhnvbld35ENHLlXYfoA8L0L0weGJ9kGz9pOeJJXqNVqhpfbZGJHI7WbYQ98NXr3VNjNQVeQi8CVBveoZjRRkPYWm9uTAqKktT2tGZ8jeGD7DrgV4Xq4x/aDTthKayu4/XLAqCD3zoDUWO4EvH5FXa+FLexnAbG5OUH0hgKFWNzF4g0FniYWHz2wmtjYowfPasoPd+3ejCYFsau2rPtit2lG98U+vFl8Q0Hbhw9qINY7Lah69RYRSNDOCmi7zBL6QG/fAK7V+paidx6nEbM2k+gDyZxMpDFcA8behzdi8EX0Inif5ISuIBeBKw3uYc1ooiDtLTa3urV9mYLtWQq2r1OHx+RWBLnu65qAvxvg5TEN21vUAw3rcNuMJglfCCAV5Ap0db6o2tcvqDticUpwKyDWfc3WBBCLh7ssxOIu1kKsdbjLQqxMCvQu1kKsp4lt+/CBZ1LQF2LZxBK0SxK0XaBbit5ZA/C8TCNqwXhaV6h5AMzJxOSvWeuzGfbAF9GL4N1VQddqdAW5CFxpcA9sRhMFaW+xudWt7QnN+BxBdrbrGlvY2Hphe716eewm9fLYJwC30tzeHkC6DrkBup+TyF+D5hXx+mm1hZUWVgBrNbHWnMBCLF6zhTcUyPOzZ1ZELO5iLcTGrtqKPXqg29jU4a6VTfmkYB6a2CRoiT2CdhZx2wW9yxnAfcB41mYSs3CFmgfDszaZ8MC4jzuHPc1wrclE7ZmE9QAHwhfRi+B9rIKu1ehikystrjS4+0J7K7jF5la3tsc243MEDdt1G9sIbOUe27EbEVRjq5/UvTkgU3Arze2nAnAFubcFqH4awHobNK+3KsBKAytTgoUWVt1O4Gli8YaCS4xd7BpoY/GGAny5S1+zJYe7PIi1DnchYvGqrVgTi4e7vE/QehDb9gnavhDLg10MQVsRtF1wWwu9XQDcB4yX80yidDLhQfK0Xp1bDpOJ2jMJDd8S8K5S0LUaXWxypcXF9nZv1dziLCEG2+cBbKWxHcLslIA1uRVBrvu6wHlwbAG2cI/tBwG30tx+LABXkHtLgOonAKy3wM/5GBzmQsCuu16rGZ8SLDSxzfiDB5NEbMnLXalHD2L3xe7U2LvYWoiNNbEasjXujO11TkDIErQE7eQyCxiuBeNZboZnbSbBycR0JxO1ZxIaviXgfRQgd3sHch8HLS62tyncSmuLcwS5JeGYCGyHn85PjcDWOjiGja1MEa6Fe2zfC1tbBO5NITcDdj8MYL0Zfo7g9UYFWLkjFh87wCb27XBDwVXGNVv6hgKZFOAuFq/ZwhsKaiHW++iBbmNju9i2r3flmlhrFzsJxBaBlphjpg7aKSL4j6aUpQTjpYrhPmYSnExMdzLRx0wihl4PeBG7KegicgW42N5q3O7ZjDa3MdgeDrCVxvYFzejwmNyKMLavbdI3Ighs3xYw+S7ArWxtF4AbZgHvH+IUsPsBAWtA6/tD3gcTghtgRiB7WHzsAJvYN8IuVt8Vu24Xm0DsqdDG4i4WbyiohdjYfbHYxOLhLtzFdn2CFhEbe7lr0ge73DtYNrHMkgNtJRDPO2gnid7lhuE+ZhKcTEx3MtHHTCIGYA3fGHgRuxq62xjA9eB2t4ClJxuwPRhg+6xmdHhMbkWI7Wtzd9jKxvaqgEnE7TsDOhG47w65HrB7A4D1evg518GEAAEre1i8J7ZWE9sFsblHDzRicRe7U5N+9KAvxOaeoO36eleXhw/YxDIE7QRa3qWEXjbDvFliOUwmPACugV6N3VLoPtwArge3uwQsPdGA7dMBtoclYKv3tXjVlz44hrC9HFrbNwNu3w7AfVfI1YDdawCsV8PPeSdMCBCwsoe1biewEIvPz1pNLO5ih/8zaXu4K/bogYXYVU16Fxt7vQsRWzopyCF2VuYECyHUGIJ2fjH9RzOcWYDxPGKYk4nZmUz0PY2IARjBi9hF6G7eAbc7OWC7D8D2IIDtEaF5jO1rZYZwqgHbdY1tgORFCrfS3L4xIFSQ+5aAUx35sTcDXN8IeJUGVgCLUwJPEztJxOpdbAqxuIvd2olYBKzn9a5JNrGcEzAELTMX4OVMYnneLNEFwNO6i7gWkksxHAOwxq4F3c0cwI3hdvsEbGWKsCfAdj+A7SEJ2OK+NtbYysb2vABKxO3F4fP/pQGigtwrAlB15McuDxG8vgEBCy0s3hO7prEfPMAbCuRwl3VDQS3E4i4WX+7avhCxOCmwWtiSJrYNZCc2JyBkGYJ2mSC3wlRiuU4meLMEJxOTnEbEoOsBrhe32Nzi5rYEtnsDbA8A2OKNCM9txve1J0YaWzk89upmtLMV3A7B+boA0NcDci8OQNWRH7soRPCKDSwCFqcEHsTi87O1rtnKITa1i409euB9vSvXxFqQ9dwZqyFbithi0PLf8QxBy7BB5s0SnEz0D+Mu6C2BLiIXG1wN3Bhut3bCVg6P7QGw3RdgizciWAfHsLGVw2OvDK2t4PbsgM7XhGnCeQGj5wN2dc4HtL42/JohXl+jACstLN4Tax3sqnVXbOz5WQ9icRdb8wla6/WukibW2sdqyFa/J5aIZQhahuDlzRKcTEz3MY4uAI6hF7GLyMUmdxOFW2xucZKAra0FW7kVQa77ih0cG7a1qYNjctXXCc3oVoSTAyoFt6cHdJ4ZACrIPSdkTSTyY2eHCF6xgUXAYgvbN2LxcBfuYuWqLetwV1fElmxi76t+f/Z93VYxaPnvR4agZZbEXGLGJxO8WYL3D5diuAZ0Ebhe3GJri5MEhK00tnpj+5gAsdTBsf2a9MExhO1x0Nq+GHA7xOapAZ+nAXJfFXJGJPJjpwNeZUKAgJUWFqcEXRBrXbNVC7HW611dmthYGzuJJ2g5J2AIWoaZ8QaZN0vwyrVJAlgjtwS32NriHMGCLTa2Q4Dt2ORnCLGDY7KvRdjKc7ovDLAU3J4UmtOXBoQKcl8ecBqL/PjJIRqv0sDKFhYBu7oZ3U5gIXb4f4/Y4a7Y87M1m1gLsVYbm3u9a9KILZ4TELIMQcswszuT4GRieWG4C3o90LUa3ViDi/OEDRVucY4Qg63e2HpnCPKcLu5rBbbS2D6rGT2nK7iV5haBewIg96QA1FhOArieGH6dTAgQsM8L/3nYwuLtBDWaWGsXq28o8CAWJwU1mtiZnBMQsQxByzBzgN2W8OVkYn6b4VoAzqFXA7e0uY3tbBG2eHjM2tfGZggI26cG2O4fge3hCrdHB2gicI8NeQFgNxb5cfn5gtdjFGDljlhsYfGKLQux1g0F+Pzszk37GwosxLZtYi3IzsrDB0QsQ9AyDFO9TeZkoi6GawHYA917Z4Cbwm1uioCHx7Y0YBubIeh9LcIWG9uDDdweBcB9TshzAbuxyI/Lzz8aJgQIWGxhSxC7exO/oSCHWHy5K3dXbAyxnidop9XEtnr4gH8OMwQtwzCTRO5ymUzMwjSiC3S7NLe5KQLCdnOArT44lrvma3c1RZBXx/ZvRk/qPiMA89AAzmcCco8IID0y4DQW+XH5+YjXQ5vxLawAVvawJbcT4JzA+/zsNJrYmq93dQYt/5xlCFqGYeYRvct9MlELwB7ophpcjVuE7YoEbKWxjV33tbljhqD3tRq28urYUw3cHhQiyJUm95CA01gOgdb1YIXXA1QDu2/4z00h1mpiEbGpXax+8EAgW4rYHGRncU7AWwoYgpZhGKYFrOd9JtEFuqkGN9Xcatympgi5tja3r328miLEcCvN7b4BnfsBcp8eUHpAAKrOAYDW/UMErwjYvRVgrT1sqolFxMZ2sZ7DXan7YqfZxHaeExCxDEHLMAwzmfZ41mcSpY1uqsFNwVbvbEtmCLqtjc0QtmtG+9rHwBRBWluNW7n2a6+ATkHuU6HJFfDq7AON694KrnuFvy82sLs5WtgdHYjFXewWPSO2DWQnMicgYhmClmEYZgLYbQnfPkDcx6Qh1eCWNrb3K5gheK75EthKY6txuwtMEgS3TwrwFOQ+GZrcPQGpeymw7gmt6x6AVw1YvYfFe2J3BMDqg121EGtB9v6ZOYG3ib1XB8QWgZZ/vjAELcMwzPJtkms3wKkGt7SxzR0cSx0aW9ksvuZLYCtTBGltZWcrk4THwSxB2tu/AOgKdlN5IqAV4YoTghhgd0ggFg92lSLW08aWINbbxG7Q9HRPLJtYhqBlGIZhajbEpc1trSkCzhBKrvlC2GJruwqa252gvd1ZQVewm8rjDbjihAABux3MCDyIxV3spJpY6/WuVBNb/eED/rPLELQMwzBMZwRHQOxpcds2tt4ZwsZN/DaEWGOLh8c0bh9tAFeQK9DNZSfIjkb7iojFGYF1xVaXOUHJAa/SJ2hTTWyVOQEhyxC0DMMwzNQRbDS3Hti2OTiWgy0eHnu4wu02BnAFuQLdXLaHaLxK+4qIxQa2FLFt5wSeXaznui0N2SpzAiKWIWj5PwSGYZhZQ23bKYL3DtuSF8fw8NjDErgV4G4DABXs5vJIhdZY+2rNCKZxsKsUsW3ujHWBlv+8MAxByzAMMw+gzeEWYdu1rY3BFm9F+HOFWwQuIlegi9hN5RERuKYaWARs1zmBnhR0mRP0hVjOCRiGoGUYhpk70JbckICw7drW5mD7EIVbBK5G7hYKu6lsAWjVzetK+M8SvCJg2zaxtTaxNR8+4JyAYQhahmGYZQna0rbW29h6cIvA1chdqbCbSgyuGq/YwCJgrT3spDaxvc0JCFmGIWgZhmGWI2g929rUbQgIW6u1RdwicDVyH6qwq/PQSB4SaV5jh7l0C9umifU8elATsW7Q8p8BhiFoGYZhlgJoPS+dtW1rU7Bti1sE7iYAUcSuzp8Z2STSvqYAW9LETgKxRc/OErEMQ9AyDMMQtPUeZdBTBA9uNwRgbgx5UAS8Og8yEoOrxmuuhZ3E7QSdQcvf6wxD0DIMwxC07W5CKIXt/SKw1bhF4CJy2yQH2C5TgmnOCXhLAcMQtAzDMARtArclNyF0aWwRuIjcFQqcD+iQGFxXqP/c+zbTuSeWcwKGIWgZhmGYKYG2dIrwJwqH94kg1wvd0sTgau1gZ3ZOQMgyDEHLMAxD0NYHbckUoSZuPbmvkVlAbBFo+fuXYQhahmEYph1u2+5sLdi2wa0FXU+sv48F15m5J5ZNLMMQtAzDMMx0QWtNEby4taDbJR64TquJJWIZhqBlGIZhZhC0XXDrgW5pPHDlnIBhGIKWYRhmmUDXs7Pt0tx6oFsaD1wnNidgG8swBC3DMAyzNEBr4bbvrO9I9TkBEcswBC3DMAwzm7itfUPCJLKeI2xiGYYhaBmGYQja1i1u36nxMhcRyzAELcMwDEPQLi3Q8vcMwxC0DMMwzNKFbpf9bR/p1L4SsQxD0DIMwzAE7azmDwlZhmEIWoZhGIJ2yYKW/7tnGIKWYRiGIXTnLvzfK8MQtAzDMAxBS8QyDEPQMgzDMAQtEcswDEHLMAzDLGsA83/eDMMQtAzDMAxByzAMQcswDMMwBC3DMAQtwzAMwzAMwxC0DMMwDMMwDEPQMgzDMAzDMAQtwzAMwzAMwxC0DMMwDMMwDEPQMgzDMAzDMAxByzAMwzAMwxC0DMMwDMMwDEPQMgzDMAzDMAxByzAMwzAMwxC0/B8CwzAMwzAMQ9AyDMMwDMMwDEHLMAzDMAzDMAQtwzAMwzAMQ9AyDMMwDMMwDEHLMAzDMAzDMAQtwzAMwzAMwxC0DMMwDMMwDEHLMAzDMAzDMAQtwzAMwzAMwxC0DMMwDMMwDEPQMgzDMAzDMAQtwzAMwzAMwxC0DMMwDMMwDEPQMgzDMAzDMMs6/x9GZKA7UA4lfgAAAABJRU5ErkJggg==' />" +
            '<p><strong>' + title + '</strong> ' + content + '</p>' +
            '</div>'
        );

        var light = balloon.find('> img.light-arrow');

        light.css({
            'position': 'fixed',
            'left': '0',
            /*
            'text-shadow': '0 0 16px #fff',
            'color': 'transparent',
            'font-weight': '900',
            'font-size': '28pt',
            */
            'height': '60px',
            'margin-top': '-18px',
            'z-index': '900'
        });

        balloon.css({
            'position': 'fixed',
            'display': 'none',
            'margin': '25px',
            'z-index': '800',
            'background': 'linear-gradient(to right, ' + (type == 'normal' ? '#fd7, #fff8c9' : 'rgb(198, 215, 231), rgb(239, 247, 255)') + ')',
            'padding': '8px 12px 8px 12px',
            'border-radius': '8px',
            'border': '1px solid #000',
            'width': 'calc(100% - 50px)',
            'box-shadow': '5px 5px 0 rgb(64, 64, 64)',
			'bottom': '0px',
        }).prependTo('body');

        var width = balloon.width();
        setTimeout(function() {
            light.animate({
                'left': width
            }, 400, 'linear', function() {
                light.fadeOut(200, function() {
                    light.remove();
                });
            });
        }, 120);

        balloon.fadeIn(300, function() {
            if(delay > 0) {
                setTimeout(function() {
                    balloon.fadeOut(300, function() {
                        balloon.remove();
                    });
                }, delay);
            }
        });

        return balloon;
    }
}

function confirmBalloon(title, content, callbackOK, callbackCancel, y, n) {
    y = y || '확인';
    n = n || '취소';

    callbackCancel = callbackCancel || (function() {});

    if(compatMode2) {
        if(confirm(title + ' ' + content)) {
            callbackOK();
        } else {
            callbackCancel();
        }
    } else {
        var balloon = alertBalloon(title, content + '<span style="float: right;"><button class=yes-btn>' + y + '</button> <button class=no-btn>' + n + '</button></span>', -1, _, 'blue')

        balloon.find('> p > span > button.yes-btn').click(function() {
            callbackOK();

            balloon.fadeOut(300, function() {
                balloon.remove();
            });
        });

        balloon.find('> p > span > button.no-btn').click(function() {
            callbackCancel();

            balloon.fadeOut(300, function() {
                balloon.remove();
            });
        });
    }
}

function setCookie(name, val) {
    var d = new Date();
    d.setDate(d.getDate() + 365);
    document.cookie = escape(name) + '=' + escape(val) + ';expires=' + d.toUTCString() + ';';
}

function getCookie(name) {
    var ret;

    if(!document.cookie) return null;

    var c = document.cookie.split(escape(name) + '=');
    if(!(c.length >= 2)) return null;

    return unescape(c[1].split(';')[0]);
}

function itoa(exp) {
    return String(exp);
}

function atoi(exp) {
    return Number(exp);
}

$(function() {
    $('.insert-markup').click(function() {
        var btn = $(this);
        var s = btn.attr('data-start');
        var e = btn.attr('data-end');
        var def = btn.attr('data-default-value');
        var editor = $('textarea#textInput');
        var ta = editor[0];
        var val = editor.val();
        var ss = ta.selectionStart;
        var se = ta.selectionEnd;
        var ret = s + (val.substring(ss, se) || def) + e;

        editor.val(val.substring(0, ss) + ret + val.substring(se, val.length));
    });

    $('.js-alert-balloon a.alert-balloon-close').click(function() {
        $(this).parent().parent().fadeOut(300, function() {
            $(this).remove();
        });
    });

    $('head').append('<style id="hide-blind-res"></style>');

    $('button#hideBlindRes').click(function() {
        $('button#hideBlindRes').attr('disabled', '');
        $('button#showBlindRes').removeAttr('disabled');
        $('style#hide-blind-res')[0].outerHTML = '<style id="hide-blind-res">div.res-wrapper[data-hidden="true"] { display: none; }</style>';
    });

    $('button#showBlindRes').click(function() {
        $('button#showBlindRes').attr('disabled', '');
        $('button#hideBlindRes').removeAttr('disabled');
        $('style#hide-blind-res')[0].outerHTML = '<style id="hide-blind-res"></style>';
    });

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
    $('.noscript-only').remove();
    $('.for-script').show();

    $('isindex').replaceWith($('<form><label>검색: </label> <input type="text" class="form-control" name="isindex" /></form>'));

    if($(window).width() >= 460 && typeof (ActiveXObject) != 'function') {
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
        } catch (e) {}

        try {
            if(!compatMode2) {
                $('.mc-transition-container').show();
                $('.mc-fallback').hide();
            }
        } catch (e) {}
    }

    var cb1, cb2, cb3, cb4, cb5, cb6, cb7, cb8, cb9;

    $('.input-examples').click(cb1 = function() {
        $(this).prev().val($(this).val());
    });

    $('.input-examples').change(cb1);

    $('#propertySelect').click(cb2 = function() {
        var id = $(this).val();
        $('textarea.property-content').hide();
        $('textarea[data-id="' + id + '"]').show();
    });

    $('#propertySelect').change(cb2);

    $('.dropdown-search').change(function() {
        var items = document.querySelectorAll('#' + $(this).attr('data-datalist') + ' option');

        for(var itemidx in items) {
            var item = items[itemidx];
            if(!item.innerText.toUpperCase().startsWith($(this).val().toUpperCase())) {
                item.style.display = 'none';
            } else {
                item.style.display = '';
            }
        }
    });

    $('div.acl-controller button.addbtn').click(function() {
        var addbtn = $(this);

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
                alertBalloon('[성공]', 'ACL 등록 성공', 2000, 1, 'blue');
            },
            error: function aclAddFail(e) {
                alertBalloon('[실패]', 'ACL 추가 실패', 2000);
            }
        });
    });

    $('div.acl-controller button.delbtn').click(function() {
        var delbtn = $(this);

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
                alertBalloon('[성공]', 'ACL 삭제 성공', 2000, 1, 'blue');
            },
            error: function aclRemoveFail(e) {
                alertBalloon('[실패]', 'ACL 삭제 실패', 2000);
            }
        });
    });

    $('.tab-page#plugins button#enablePluginBtn').click(function() {
        $.ajax({
            type: "POST",
            url: '/plugins/enable',
            data: {
                'name': $('.tab-page#plugins select#pluginList[size]').val()
            },
            dataType: 'json',
            success: function(d) {
                if(d.status == 'error') {
                    alertBalloon('[실패]', '선택한 플러그인을 활성화하는 중 오류가 발생했습니다.');
                    return;
                }
                alertBalloon('[완료]', '플러그인 활성화 성공', 2000, 1, 'blue');
                $('select#pluginList[size] option:selected').css({
                    'text-decoration': 'none',
                    'color': 'initial'
                });
            },
            error: function(d) {
                alertBalloon('[실패]', '선택한 플러그인을 활성화하는 중 오류가 발생했습니다.');
            }
        });
    });

    $('.tab-page#plugins button#disablePluginBtn').click(function() {
        $.ajax({
            type: "POST",
            url: '/plugins/disable',
            data: {
                'name': $('.tab-page#plugins select#pluginList[size]').val()
            },
            dataType: 'json',
            success: function(d) {
                if(d.status == 'error') {
                    alertBalloon('[실패]', '선택한 플러그인을 비활성화하는 중 오류가 발생했습니다.');
                    return;
                }
                alertBalloon('[완료]', '플러그인 비활성화 성공', 2000, 1, 'blue');
                $('select#pluginList[size] option:selected').css({
                    'text-decoration': 'line-through',
                    'color': 'gray'
                });
            },
            error: function(d) {
                alertBalloon('[실패]', '선택한 플러그인을 비활성화하는 중 오류가 발생했습니다.');
            }
        });
    });

    setShowBtnEvent();
    document.addEventListener("scroll", setVisibleState);
    formatDatetime();

    $('.wiki-heading').click(function() {
        if($(this).next().attr('class') == 'wiki-heading-content') {
            $(this).next().toggle();
        }
    });

    function refreshRecent() {
        $.ajax({
            type: 'GET',
            dataType: 'html',
            success: function(d) {
                $('table.table.table-hover').html($(d).find('table.table.table-hover').html());
                formatDatetime();
            }
        });
    }

    if(location.pathname == '/RecentChanges') {
        $('button#refreshNow').click(function() {
            refreshRecent();
        });

        $('input#refreshing').change(function() {
            if(this.checked) {
                if(Number($('input#intervalInput').val()) * 1000 < 500) {
                    alertBalloon('[알림]', 'DoS 공격은 하지 맙시다 ^^;');
                    this.checked = false;
                    return;
                }
                window.refreshTimer = setInterval(function() {
                    refreshRecent();
                }, (Number($('input#intervalInput').val()) * 1000) || 3000);
            } else {
                try {
                    clearInterval(window.refreshTimer);
                } catch (e) {}
            }
        });
    }

    $('#previewLink').click(function() {
        var frm = location.pathname.startsWith('/edit/') ? $('#editForm') : $('#new-thread-form');
        frm.attr('action', '/preview/' + frm.attr('data-title')).attr('target', 'previewFrame').submit();
        frm.removeAttr('action').removeAttr('target');
    });

    $('#diffLink').click(function() {
        var diffdiv = $('#diff');
        var base = difflib.stringAsLines($('textarea#originalContent').text());
        var newt = difflib.stringAsLines($('textarea#textInput').val());
        var opcodes = (new difflib.SequenceMatcher(base, newt)).get_opcodes();

        diffdiv.html('').append($(diffview.buildView({
            baseTextLines: base,
            newTextLines: newt,
            opcodes: opcodes,
            baseTextName: "원본 (r" + $('input[name="baserev"]').val() + ')',
            newTextName: "작성중",
            contextSize: 7,
            viewType: 0
        })));
    });

    $('form#new-thread-form select[name="type"]').change(function() {
        if($(this).val() == 'edit_request') {
            $("#editRequestForm").show();
        } else {
            $("#editRequestForm").hide();
        }
    });

    if(location.pathname.startsWith('/member/mypage')) {
        $('#colorSelect').change(function() {
            $('#wallpaperCode').val($(this).val());
            $('#previewFrame').css('background', $('#wallpaperCode').val());
        });

        $('#wallpaperCode').on(valueChange, function() {
            $('#previewFrame').css('background', $('#wallpaperCode').val());
        });

        $('#txtImageURL').on(valueChange, function() {
            $('#wallpaperCode').val("url('" + $('#txtImageURL').val() + "');");
        });
    }

    $('.rolling-selector').each(function() {
		if(compatMode2) return;
		
        var selector    = $(this);
        var selectorID  = selector.attr('id');
        var leftBtn     = selector.find('button#toLeftBtn');
        var rightBtn    = selector.find('button#toRightBtn');
        var datalist    = selector.find('options');
        var indicator   = selector.find('label');
        var firstOption = datalist.find('> option:first-child').text();
        var lastOption  = datalist.find('> option:last-child').text();
        var valueInput  = selector.find('input.value-input');

        selector.show();
		
		selector.find('input[name^="rolling-selector"]').val('1');

        var currentOption = datalist.find('option[value="' + indicator.text() + '"]').text();

        function onChange() {
            switch (selectorID) {
				case 'skinRoller':
					$('iframe').attr('src', '/w/사용자:' + $('#usernameValue').val() + '?override-skin=' + indicator.text());
					$.ajax({
						url: '/skins/' + indicator.text() + '/colors.scl',
						success: function(ret) {
							function setColorList(dc) {
								var opt = '';
								var spl = ret.split(';');
								for(_clrset in spl) {
									var clrset = spl[_clrset];
									opt += '<option value="' + clrset.split(',')[0] + '" ' + (clrset.split(',')[0] == dc ? 'selected' : '') + '>' + clrset.split(',')[1] + '</option>';
								}
								$('#schemeSelect').html(opt);
							}
							
							$.ajax({
								url: '/skins/' + indicator.text() + '/dfltcolr.scl',
								success: setColorList,
								error: function() {
									setColorList('default');
								}
							});
						},
						error: function() {
							$('#schemeSelect').html('<option value=default selected>기본값</option>');
						}
					});
					
					/* selector.next().find('> img').attr('src', '/skins/' + indicator.text() + '/preview.bmp'); */
            }
        }

        leftBtn.click(function() {
            /* 스크롤 애니메이션은 나중에... */
            var previousOption = datalist.find('option[value="' + currentOption + '"]').prev().text();
            if(!previousOption) {
                previousOption = lastOption;
            }
            currentOption = previousOption;

            indicator.text(currentOption);
            valueInput.val(currentOption);
            onChange();
        });

        rightBtn.click(function() {
            var nextOption = datalist.find('option[value="' + currentOption + '"]').next().text();
            if(!nextOption) {
                nextOption = firstOption;
            }
            currentOption = nextOption;

            indicator.text(currentOption);
            valueInput.val(currentOption);
            onChange();
        });
    });
	
	$('.select-page').change(function() {
		$(this).next().find('> tab-pane').removeClass('active');
		$(this).next().find('> tab-pane#' + $(this).val()).addClass('active');
	});
	
	$('.tab-content').each(function() {
		if(!($(this).find('> .tab-pane.active').length)) {
			$(this).find('> .tab-pane:first-child').addClass('active');
		}
	});
	
	$('#schemeSelect').change(function() {
		if(compatMode2) return;
		
		$('iframe').attr('src', '/w/사용자:' + $('#usernameValue').val() + '?override-skin=' + $('#skinSelectLabel').text() + '&override-color=' + $(this).val());
	});

    function bdb() {
        $('form#grant-form table#perm-list tr td button.delete-permission-btn').click(function() {
            var val = $(this).prev().val();
            var tarea = $('form#grant-form').find('textarea#perm-tlist');

            $('table#perm-list tbody tr#perm-' + val).remove();
            tarea.val(tarea.val().replace(val + ',', ''));
            alertBalloon('[성공]', '권한을 회수했습니다. 저장하려면 하단의 적용 단추를 누르십시오.', 2000, 1, 'blue');
        });
    }

    $('form#grant-form button#addPermissionBtn').click(function() {
        var combo = $(this).prev();
        var val = combo.val();
        var alias = combo.find('option:selected').text();
        var tarea = $('form#grant-form').find('textarea#perm-tlist');

        if(tarea.val().includes(val + ',')) {
            alertBalloon('[오류]', '권한이 이미 있습니다.');
        } else {
            $('table#perm-list tbody').append('<tr id="perm-' + val + '"><td>' + alias + '</td><td>' + val + '</td><td><input type="hidden" id="permissionInput" value="' + val + '" /><button type="button" class="btn btn-danger btn-sm delete-permission-btn">회수</button></td></tr>');
            tarea.val(tarea.val() + val + ',');
            alertBalloon('[성공]', '권한을 추가했습니다. 저장하려면 하단의 적용 단추를 누르십시오.', 2000, 1, 'blue');
        }

        bdb();
    });

    bdb();

    $('ul.nav li.nav-item a.nav-link').click(function() {
        var tab = $(this);
        var tl = tab.parent().parent();
        var tc = tl.next();

        tl.find('> li.nav-item > a.nav-link.active').removeClass('active');
        tab.addClass('active');

        tc.find('> div.tab-pane.active').removeClass('active');
        tc.find('> div.tab-pane' + tab.attr('href')).addClass('active');
    });

    $('form.login-form[data-nohttps="true"], form.signup-form[data-nohttps="true"]').submit(function() {
        var frm = $(this);

        if(window.submitConfirmed) return true;

        confirmBalloon('[경고]', 'HTTPS 연결이 감지되지 않았습니다. 비밀번호가 다른 사람에게 노출될 수 있으며, 책임은 본인에게 있습니다.', function() {
            window.submitConfirmed = true;
            frm.submit();
        }, _, '계속');

        return false;
    });

    $('form.withdraw-form').submit(function() {
        var frm = $(this);

        if(window.submitConfirmed) return true;

        confirmBalloon('[탈퇴]', '시간여행기는 없습니다. 탈퇴하면 더 이상 로그인할 수 없으며, 사용자 문서를 지우지 않도록 설정한 경우 영구적으로 현재 사용중인 ID로 가입이 불가능합니다. 탈퇴하시겠습니까?', function() {
            if(confirm('마지막 경고입니다. 계속하려면 [확인]을 누르십시오.')) {
                window.submitConfirmed = true;
                frm.submit();
            }
        }, _, '예!', '잠시만요');

        return false;
    });

    $('form#remove-star-category-form').submit(function() {
        var frm = $(this);

        if(window.submitConfirmed) return true;

        confirmBalloon('[경고]', '분류 안의 문서들까지 일괄 해제됩니다. 계속하시겠습니까?', function() {
            window.submitConfirmed = true;
            frm.submit();
        });

        return false;
    });

    $('a#deleteThreadBtn').click(function() {
        var a = $(this);

        if(window.submitConfirmedA) return true;

        confirmBalloon('[경고]', '토론을 지우시겠습니까? 위키 개발자만 복구할 수 있습니다.', function() {
            window.submitConfirmedA = true;
            location.href = a.attr('href');
        });

        return false;
    });

    $('a#restoreThreadBtn').click(function() {
        var a = $(this);

        if(window.submitConfirmedB) return true;

        confirmBalloon('[경고]', '토론을 삭제복구하시겠습니까? 모든 사용자가 토론을 볼 수 있습니다.', function() {
            window.submitConfirmedB = true;
            location.href = a.attr('href');
        });

        return false;
    });

    $('a#explodeThreadBtn').click(function() {
        var a = $(this);

        if(window.submitConfirmedC) return true;

        confirmBalloon('[경고]', '토론을 영구적으로 지우시겠습니까? 복구할 수 없습니다!', function() {
            window.submitConfirmedC = true;
            location.href = a.attr('href');
        });

        return false;
    });

    $('a#declinePrivacyBtn').click(function() {
        var a = $(this);

        if(window.submitConfirmed) return true;

        confirmBalloon('[알림]', '가입을 취소하시겠습니까?', function() {
            window.submitConfirmed = true;
            location.href = a.attr('href');
        });

        return false;
    });

    $('tr.form-tr').each(function() {
        var form = $(this);
        var submitBtn = form.find('button[type="submit"]');
        
        submitBtn.click(function() {
            var html = '<form method="' + (form.attr('method') || 'get') + '">';
            
            form.find('[name]').each(function() {
                var input = $(this);
                html += '<input type="hidden" name="' + input.attr('name') + '" value="' + input.val().replace(/[&]/g, '&amp;').replace(/["]/g, '&quot;') + '" />';
            });
            
			html += '<button type="submit" id="jtmpfrmsubmitbtn12345678"></button>';
            html += '</form>';
            
            var tmpfrm = $(html);
			tmpfrm.appendTo('body');
			tmpfrm.find('button#jtmpfrmsubmitbtn12345678').click();
			tmpfrm.remove();
        });
    });
});

(function() {
    var allLoadingRes = 'div#res-container div.res-wrapper.res-loading';
    var loadingRes = allLoadingRes + '[data-visible="true"]';
    var loadingRes2 = loadingRes + '[data-locked="false"]';

    window.setVisibleState = function() {
        $(allLoadingRes).each(function() {
            var item = $(this);
            if(isVisible(item[0])) {
                item.attr('data-visible', 'true');
            } else {
                item.attr('data-visible', 'false');
            }
        });
    };

    window.setShowBtnEvent = function() {
        $('a.show-hidden-content').click(function() {
            $(this).parent().parent().children('.hidden-content').show();
            $(this).parent().css('margin', '10px 0px 0px 0px');
            $(this).remove();
        });
    };

    if (
        typeof historyInit == 'function' && typeof discussPollCancel == 'function' &&
		typeof discussPollStart == 'function' && typeof recaptchaInit == 'function' &&
		typeof recaptchaExecute == 'function' && typeof recaptchaOnLoad == 'function'
    ) {
		console.log('theseed.js이 감지되었습니다.');
	} else {
        function fetchComments(tnum) {
            setVisibleState();

            if($(loadingRes2).length) {
                var loadingID = $(loadingRes2)[0].getAttribute('data-id');
                $(loadingRes2).attr('data-locked', 'true');

                $.ajax({
                    type: "GET",
                    url: '/thread/' + tnum + '/' + loadingID + ($('button#nfFuckingPJAX').length ? '?theseed-style=1' : ''),
                    dataType: 'html',
                    success: function(d) {
                        var data = $(d);

                        data.filter('div.res-wrapper').each(function() {
                            var itm = $(this);
                            var res = $('div.res-wrapper.res-loading[data-id="' + itm.attr('data-id') + '"]');

                            res.after(itm).remove();
                        });

                        formatDatetime();
                        setShowBtnEvent();
                    },
                    error: function(e) {
                        history.go(0);
                    }
                });
            }
        }

        function discussPollStart(tnum) {
            $('form#new-thread-form').submit(function() {
                var frm = $(this);
                var submitBtn = $('form#new-thread-form').find('button[type="submit"]');
                submitBtn.attr('disabled', '');
                submitBtn.html('대기 중...');
				
				if(!($('textarea[name="text"]').val())) {
					submitBtn.removeAttr('disabled');
                    submitBtn.html('<span class=light></span><span class=light2></span>전송!');
					alertBalloon('[알립니다]', '댓글의 내용이 없습니다.', 2000);
					return false;
				}
				
                function postcmt() {
                    $.ajax({
                        type: "POST",
                        dataType: 'json',
                        data: {
                            'text': $('textarea[name="text"]').val()
                        },
                        success: function(d) {
                            submitBtn.removeAttr('disabled');
                            submitBtn.html('<span class=light></span><span class=light2></span>전송!');
                            $('textarea[name="text"]').val('');
							alertBalloon('[성공]', '댓글을 달았습니다.', 2000, 1, 'blue');
                        },
                        error: function(d) {
                            submitBtn.removeAttr('disabled');
                            submitBtn.html('<span class=light></span><span class=light2></span>전송!');
                            alertBalloon('[실패]', '댓글을 달 수 없습니다. 충분한 권한이 있는지, 토론이 종결되지 않았는지, 그리고 통신망에 연결됐는지 확인하십시오.', 4000);
                        }
                    });
                }

                if(frm.attr('data-nologin') == 'true' && frm.attr('data-warned') != 'true') {
                    confirmBalloon('[경고]', '로그인하시지 않았습니다. 댓글을 달 경우 현재 IP(' + frm.attr('data-ip') + ')가 모든 사용자에게 보여집니다.', function() {
                        frm.attr('data-warned', 'true');
                        postcmt();
                    }, function() {
                        submitBtn.removeAttr('disabled');
                        submitBtn.text('전송!');
                    });
                } else {
                    postcmt();
                }

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
                        alertBalloon('[성공]', '상태를 업데이트했습니다.', 2000, 1, 'blue');
                        submitBtn.removeAttr('disabled');
                        history.go(0);
                    },
                    error: function(d) {
                        alertBalloon('[실패]', '문제가 있습니다.' + (d.status ? ' ' + d.status : ''));
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
                        alertBalloon('[성공]', '상태를 업데이트했습니다.', 2000, 1, 'blue');
                        history.go(0);
                    },
                    error: function(d) {
                        alertBalloon('[토론]', '문제가 있습니다.' + (d.status ? ' ' + d.status : ''));
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
                        alertBalloon('[성공]', '토론을 이동했습니다.', 2000, 1, 'blue');
                    },
                    error: function(d) {
                        alertBalloon('[토론]', '문제가 있습니다.' + (d.status ? ' ' + d.status : ''));
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
                        alertBalloon('[성공]', '토론의 주제를 바꾸었습니다.', 2000, 1, 'blue');
                    },
                    error: function(d) {
                        alertBalloon('[토론]', '문제가 있습니다.' + (d.status ? ' ' + d.status : ''));
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
                        alertBalloon('[성공]', '토론의 주제를 바꾸었습니다.', 2000, 1, 'blue');
                        submitBtn.removeAttr('disabled');
                    },
                    error: function(d) {
                        alertBalloon('[토론]', '문제가 있습니다.' + (d.status ? ' ' + d.status : ''));
                    }
                });

                return false;
            });

            var refresher = setInterval(function() {
                $.ajax({
                    type: "POST",
                    url: '/notify/thread/' + tnum,
                    dataType: 'json',
                    success: function(data) {
                        var tid = atoi(data['comment_id']);
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
            }, 1000);

            setVisibleState();
        }
		
		window.discussPollStart = discussPollStart;
    }
})();

$(function() {
    if(location.pathname == '/member/styler') {
        for(var i = 1; i <= 27; i++) {
            $('textarea[name="CSS' + String(i) + '"]').text(
                $('style#CSS-' + String(i)).html()
            );
        }

        $("select#selElement").change(function() {
            try {
                $("option#0").remove();
            } catch (e) {}

            var cssval = $("textarea#JSC" + $("#selElement").children(":selected").attr("id")).text().split(";");
            var csslst = [
                "txtPadding", "txtBgolor", "txtBorderWidth", "txtBorderStyle", "txtBorderColor",
                "txtBorderRadius1", "txtBorderRadius2", "txtBorderRadius3", "txtBorderRadius4",
                "selFont", "txtTextColor", "txtFontSize", "bs", "ud", "fw", "ia"
            ];
            for(var i = 0; i < csslst.length; i++) {
                try {
                    $("#" + csslst[i]).val(cssval[i]);
                } catch (e) {}
            }
        });

        $("table#css-config tbody tr input, table#css-config tbody tr select:not(#selElement)").change(function() {
            var fw, ia, ud, sd, bs, bg;
            if($('input#chkBold').is(':checked')) {
                fw = "bold";
            } else {
                fw = "normal";
            }
            if($('input#chkItalic').is(':checked')) {
                ia = "italic";
            } else {
                ia = "normal";
            }
            if($('input#chkUnderline').is(':checked')) {
                ud = "underline";
            } else {
                ud = "";
            }
            if($('input#chkStrike').is(':checked')) {
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
    }
});

$(function() {
    var bindTabClick;

    (bindTabClick = function() {
        $('tabbar tab:not([newtab]):not([disabled])').click(function() {
            $(this).parent().find('> tab').removeAttr('active');
            $(this).attr('active', '');

            var pageid = $(this).parent().parent().attr('id');
            var to = $(this).attr('page');

            $('tabcontent[tab="' + pageid + '"] page').removeAttr('active');
            $('tabcontent[tab="' + pageid + '"] page#' + to).attr('active', '');
        });

        $('tabbar tab:not([disabled]) close').click(function() {
            var pageid = $(this).parent().parent().attr('page');
            var tabid = $(this).parent().parent().parent().parent().attr('id');
            var page = $('tabcontent[tab="' + tabid + '"] page#' + pageid);

            $(this).parent().parent().remove();
            if(page.attr('active') !== undefined) {
                $('tabcontent[tab="' + tabid + '"] page').removeAttr('active');
                $('tabcontent[tab="' + tabid + '"] page:first-child').attr('active', '');

                $('tabbar#' + tabid + ' tab[active]').removeAttr('active');
                $('tabbar#' + tabid + ' tab:first-of-type').attr('active', '');
            }
            page.remove();
        });
    })();

    $('tabbar tab[newtab]').click(function() {
        var pageid = 'newtab-page-' + Math.floor(Math.random() * 1e8);
        var newtab = $('<tab page="' + pageid + '"><t>' + ($(this).attr('text') || '새 탭') + ' <close>×</close></t></tab>');

        $(this).before(newtab);
        $('tabcontent[tab="' + $(this).parent().parent().attr('id') + '"]').append('<page id="' + pageid + '">' + ($(this).attr('content') || '') + '</page>');
        bindTabClick();

        newtab.click();
    });
});

$(function() {
    var tlf = null,
        nosl = 1,
        sa;

    $('.mc-light').on('mousedown', function() {
        var light = $(this).find('> span.light');
        var light2 = $(this).find('> span.light2');
        nosl = 0;

        light.css({
            transition: 'all .65s',
            margin: '0 0 0 120%'
        });

        setTimeout(function() {
            light.css({
                transition: 'all 0s',
                margin: '0 0 0 -120%'
            });

            function slowlight() {
                light2.css({
                    transition: 'all 3.25s',
                    margin: '0 0 0 120%'
                });

                setTimeout(function() {
                    light2.css({
                        transition: 'all 0s',
                        margin: '0 0 0 -120%'
                    });
                }, 3250);
            }

            if(light2 && !nosl) {
                tlf = setInterval(slowlight, 4250);
                setTimeout(slowlight, 350);
            }
        }, 500);
    });

    $('body').on('mouseup mouseout', sa = function() {
        clearInterval(tlf), nosl = 1;

        $('.mc-light > span.light2').css({
            transition: 'all 0s',
            margin: '0 0 0 -120%'
        });
    });

    $('.mc-light').on('mouseout', sa);
});

$(function() {
	/*
	 * micro-js / hsl-to-rgb ( https://github.com/micro-js/hsl-to-rgb )
	 * Committer: ashaffer
	 * License: MIT
	 */
	function hslToRgb(h, s, l) {
		/* for CSS */
		s /= 100, l /= 100;
	
		if(s == 0) return [l, l, l];
		h /= 360;

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;

		return [
			Math.round(hueToRgb(p, q, h + 1/3) * 255),
			Math.round(hueToRgb(p, q, h) * 255),
			Math.round(hueToRgb(p, q, h - 1/3) * 255)
		];
	}

	function hueToRgb(p, q, t) {
		if(t < 0) t += 1;
		if(t > 1) t -= 1;
		if(t < 1/6) return p + (q - p) * 6 * t;
		if(t < 1/2) return q;
		if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;

		return p;
	}
	/* ---------------------------------- */
	
	function randint(s, e) {
		return Math.floor(Math.random() * (e + 1 - s) + s);
	}
	
	$('#random-h').click(function() {
		$('#hue').val(randint(0, 360)).change();
	});
	
	$('#random-s').click(function() {
		$('#sat').val(randint(1, 100)).change();
	});
	
	$('#random-l').click(function() {
		$('#bri').val(randint(0, 100)).change();
	});
	
	$('#random-all').click(function() {
		$('#random-h').click();
		$('#random-s').click();
		$('#random-l').click();
	});

	$('#hue, #sat, #bri').on('input change', function() {
		$('#picked-color').css('background-color', 'hsl(' + $('#hue').val() + ', ' + $('#sat').val() + '%, ' + $('#bri').val() + '%)');
		$('#picked-color-h').css('background-color', 'hsl(' + $('#hue').val() + ', 100%, 50%)');
		$('#picked-color-s').css('background-color', 'hsl(240, ' + $('#sat').val() + '%, 50%)');
		$('#picked-color-l').css('background-color', 'hsl(240, 100%, ' + $('#bri').val() + '%)');
	
		$('#h').val(Math.floor(Number($('#hue').val()) * (240 / 360)));
		$('#s').val(Math.floor(Number($('#sat').val()) * (240 / 100)));
		$('#l').val(Math.floor(Number($('#bri').val()) * (240 / 100)));
		
		var rgb = hslToRgb(Number($('#hue').val()), Number($('#sat').val()), Number($('#bri').val()));
		
		$('#r').val(rgb[0]);
		$('#g').val(rgb[1]);
		$('#b').val(rgb[2]);
		
		var a, b, c;
		
		$('#html').val((((a = rgb[0].toString(16)) < 10 ? '0' + a : a) + ((b = rgb[1].toString(16)) < 10 ? '0' + b : b) + ((c = rgb[2].toString(16)) < 10 ? '0' + c : c)).toUpperCase());
	});
	
	$('#hue').on('input change', function() {
		$('#bri').prev().css('background-image', 'linear-gradient(to right, #000, hsl(' + $(this).val() + ', ' + $('#sat').val() + '%, 50%), #fff)');
		$('#sat').prev().css('background-image', 'linear-gradient(to right, #888, hsl(' + $(this).val() + ', 100%, 50%))');
	});
	
	$('#sat').on('input change', function() {
		$('#bri').prev().css('background-image', 'linear-gradient(to right, #000, hsl(' + $('#hue').val() + ', ' + $(this).val() + '%, 50%), #fff)');
	});
	
	$('#picked-color').click(function() {
		$('#saved-colors div').prepend($('<table style="display: table-cell;"><tr><td style="text-align: center;"><span class=color-frame style="background-color: ' + $(this).css('background-color') + '; padding: 6px;">__</span></td></tr><tr><td style="font-size: 9pt;">#' + $('#html').val() + '</td></tr></table>'));
	});
	
	$('#hue').change();
});
