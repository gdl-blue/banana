## 개요
바나나는 병아리 엔진 기반의 많은 편리한 기능 탑재를 목표로 하는 나무픽스 호환 엔진이다.  
banana is a wiki engine that supports many convinient features. (English is not supported yet)

버전은 기존 엔진 버전 번호를 이어서 9부터 시작한다. *(참고로 기존 엔진은 더 이상 본인도 가지고 있지 않다. 삭제 후 이중 덮어쓰기하였다.)*

실제 가동 사이트는 알파위키 *사문*에 주소를 남겼다.

## 요구 환경
Windows 7(Node.js 7.6 이상)

### Windows XP에서 호스팅하기
테스트해보지 않음, 본인 책임하에 사용, 시스템 복원 지점 생성

최신 프로그램을 XP에서 돌아가게 하는 패치들:
- https://msfn.org/board/topic/176757-cancelled-by-the-author-extended-kernel-for-xp-extendedxp/
- https://www.betaarchive.com/forum/viewtopic.php?t=36763

### Windows Vista에서 호스팅하기
#### 32비트
아직은 없다.

#### 64비트
[여기](https://www.youtube.com/watch?v=cJI6utFsFr4) 참조.

## 기능
굵게 표시한 것을 모두 만들면 베타로 전환.
- [X] **문서 읽기**
- [X] **편집, 생성**
- [ ] **이동 및 삭제**
- [ ] **RAW, 비교, 편집 복구**
- [X] **문서 역사**
- [X] **최근 변경, 최근 토론**
- [X] **사용자별 기여 목록**
- [X] **ACL**
- [X] **로그인, 로그아웃, 가입**
- [ ] **사용자 정보 수정 도구**
- [X] **IP 차단**
- [X] **사용자 차단**
- [X] **권한 부여**
- [ ] 로그인 내역
- [X] **위키 설정 도구**
- [X] API
- [ ] 편집요청(토론을 기반으로 만듬)
- [ ] 일관 편집, 생성, 및 삭제
- [ ] 자동 로그인
- [X] **화일 올리기 도구**
- [ ] **화일 페이지**
- [X] 검색
- [X] 문서함(엔진에서는 "주시문서 목록"이라 부름)
- [ ] 토론함
- [X] 투표
- [X] 역링크
- [X] 플러그 인
- [ ] **분류 페이지**

## 해결되지 않은 긴급 취약점
- 실제 해보지는 않음. 헤더 편집기로 User-Agent를 완전히 제거하면 NULL이 들어가서 나중에 관련 DB에 액세스하다가 서버가 다운될 수 있음.

## 사용하는 외부 라이브러리
### path
[[라이선스]](https://github.com/jinder/path/blob/master/LICENSE)

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
- 스킨 호환 관련: [the seed](https://theseed.io/License), [openNAMU](https://github.com/2du/openNAMU#%EB%9D%BC%EC%9D%B4%EC%84%A0%EC%8A%A4)