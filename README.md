## 개요
바나나는 [병아리](https://github.com/gdl-888/imitated-seed-v2) 엔진 기반의 많은 편리한 기능 탑재를 목표로 하는 나무픽스 호환 엔진이다.  ]

사용자마다 UI의 HTML을 직접 편집하여 자신만의 UI로 이용할 수 있는 기능을 탑재할 예정이다.

## 요구 환경
Node.js 12.0 이상 (다만 Node.js 8.x를 지원하게 될 수도 있댜.)

## 기능
굵게 표시한 것을 모두 만들면 베타로 전환.
- [X] **문서 읽기**
- [X] **편집, 생성**
- [X] **이동 및 삭제**
- [X] **RAW, 비교, 편집 복구**
- [X] **역링크**
- [X] **문서 역사**
- [X] **최근 변경, 최근 토론**
- [X] **사용자별 기여 목록**
- [X] **ACL**
- [X] **로그인, 로그아웃, 가입**
- [ ] **사용자 정보 수정 도구** (진행 중)
- [X] **IP 차단**
- [X] **사용자 차단**
- [X] **권한 부여**
- [X] **위키 설정 도구**
- [ ] **편집요청(토론을 기반으로 만듬)** (진행 중)
- [X] **화일 올리기 도구**
- [ ] **화일 페이지**
- [X] **검색**
- [ ] **분류 페이지**
- [X] API
- [X] 플러그 인
- [X] 문서함(엔진에서는 "주시문서 목록"이라 부름)
- [ ] 토론함
- [ ] 자동 로그인(진행 중)
- [ ] 하위 위키(진행 중)
- [ ] 다국어 지원(진행 중)
- [ ] 로그인 내역
- [ ] 일관 편집, 생성, 및 삭제
- [ ] 완전한 UI 트윅 기능

## config.json
- `host`: [문자열] 호스팅할 IP 주소
- `port`: [숫자] 호스팅할 포트
- `enable_file_session`: [true|false|1|0] 세션을 휘발성 메모리가 아닌 화일에 저장하게 한다.
- `skin`: [문자열] 기본 스킨을 지정하지만 실제로는 나중에 데이타베이스에 저장되게 되므로 큰 의미는 없다.
- `secret`: [문자열] 세션 비밀키
- `blockip`: [배열] IPACL과는 무관하게 지정한 IP 주소의 **접속**을 차단한다. CIDR는 지원하지 않는다.
- `authpw`: [null|문자열] 위키에 접속할 때 필요한 비밀번호를 지정합니다. 지정하지 않으면 아무나 접속할 수 있다.
- `noauthxhr`: [true|false|1|0] 브라우저가 아닌 XHR를 통해 접속할 경우 비밀번호를 묻지 않게 설정한다.
- `si_time`: [숫자] 지정한 밀리초마다 지정한 자바 스크립트 코드를 실행한다.
- `si_eval`: [배열] 위 시간마다 실행할 코드(문자열)의 배열이다.
- `enable_ratelimit`: [true|false|1|0] 일정 시간 안에 지정한 접속 횟수(한도)를 초과할 경우 임시적으로 차단할 지의 여부입니다. 기본값은 비활성화이다.
- `ratelimit_interval`: [숫자] 한도를 넘지 않았을 경우에 한하여 몇 밀리초마다 접속 한도를 초기화할 지 설정합니다. 기본값은 0.2초이다.
- `ratelimit`: [숫자] 위 시간 안에 최대 얼마만큼 요청(접속)할 수 있는 지 지정합니다. `-1`로 지정하면 차단하지 않습니다. 기본값은 3이다.
- `ratelimit_reset`: [숫자] 과다 접속으로 접속이 차단되면 이를 차단 해제할 때까지 대기할 시간을 밀리초로 지정합니다. 기본값은 1시간이다.
- `global_user_perms`: [배열] **__비로그인 사용자를 포함하여__** grant 페이지와 관계없이 모두가 갖는 권한의 목록(예를 들어 ban_users를 지정했다면 위키의 모든 이용자가 서로를 차단할(...) 수 있음)
- `global_member_perms`: [배열] grant 페이지와 관계없이 모든 회원(비로그인은 해당 없음)들이 사용할 수 있는 권한

## 삭제된 릴리즈
### \[4.5.9] 12.5.9 (알파)

 - 특수 방식으로 오류 번호 생성

### \[4.5.8] 12.5.8 (알파)
 - 표현 오류 수정

### \[4.5.7] 12.5.7 (알파)
 - 모든 주소에서의 접속 차단 가능

### \[4.5.6] 12.5.6 (알파)
 - 이동 관련 버그 수정

### \[4.5.5] 12.5.5 (알파)
 - 버그 수정

### \[4.5.4] 12.5.4 (알파)
 - session-file-store 사용으로 서버 재시작 시에도 로그인 상태 유지됨
 
### \[1.1.0] 9.1.0 (알파)
- 기본적인 기능
    - 문서 읽기
    - 문서 편집
    - 토론
        - 토론 발제
        - 댓글 달기
        - 댓글 숨기기
        - 토론 종경, 동결
        - 토론 주제변경
        - 토론 문서 변경
        - 토론 삭제
    - 로그인
    - 계정 생성
    - 문서 역사
    - 최근 변경 내역
    - 최근 토론
    - 사용자 기여 목록(수정, 토론)

## 사용하는 외부 라이브러리
### captchapng
[[NPM]](npmjs.com/package/captchapng) \[라이선스: BSD] \[저작권자: George Chan]

### wait-console-input
[[NPM]](https://www.npmjs.com/package/wait-console-input) [[라이선스]](https://github.com/peeyush-pant/wait-console-input/blob/master/LICENSE)

### sha3
[[NPM]](https://www.npmjs.com/package/sha3) [[라이선스]](https://github.com/phusion/node-sha3/blob/master/LICENSE)

### sqlite3
[[NPM]](https://www.npmjs.com/package/sqlite3) [[라이선스]](https://github.com/mapbox/node-sqlite3/blob/master/LICENSE)

### express
[[NPM]](https://www.npmjs.com/package/express) [[라이선스]](https://github.com/expressjs/express/blob/master/LICENSE)

### swig
[[NPM]](https://www.npmjs.com/package/swig) [[라이선스]](https://github.com/paularmstrong/swig/blob/master/LICENSE)
- dateformatter.js 사용 (날짜를 시간대에 맞추기)

### md5
[[NPM]](https://www.npmjs.com/package/md5) [[라이선스]](https://github.com/pvorb/node-md5/blob/master/LICENSE)

### ip-range-check
[[NPM]](https://www.npmjs.com/package/ip-range-check) [[라이선스]](https://github.com/danielcompton/ip-range-check/blob/master/LICENSE)

### nodemailer
[[NPM]](https://www.npmjs.com/package/nodemailer) [[라이선스]](https://github.com/nodemailer/nodemailer/blob/master/LICENSE)

### jQuery, jQuery UI
(C)저작권자 JS 파운데이션 및 기타 기여자들 [[라이선스]](https://jquery.org/license/)

### ionicons
(C) 저작권자 present Ionic (2015) / [[라이선스]](https://github.com/ionic-team/ionicons) (MIT)

### nunjucks
[[NPM]](https://www.npmjs.com/package/nunjucks) [[라이선스]](https://github.com/mozilla/nunjucks/blob/master/LICENSE)

### js-namumark
(C)저작권자 LiteHell(2017) / AGPL-3.0 / [[라이선스]](https://github.com/LiteHell/js-namumark/blob/master/LICENSE)
 * ~~일부 소스를 수정했읍니다 - 수정된 소스 코드는 [[이곳]](https://github.com/gdl-888/js-namumark)에서...~~ <-- 소스 변경은 취소했으며, 렌더링 끝난 HTML을 서버에서 다듬는 방식으로 변경
 
### jsdifflib
(C)저작권자 cemerick 2007~2011 [[깃허브]](https://github.com/cemerick/jsdifflib)

## 기타 라이선스
GNU 아페로 공중 사용 허가서 버전 3 (https://www.gnu.org/licenses/agpl-3.0.en.html)

