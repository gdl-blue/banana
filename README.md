## 개요
터보위키(새위키)에 새로 사용할 위키 엔진이다. 아직 알파 단계인데, 지금 사용하는것을 금지하지는 않지만 버그가 있고 갑자기 전체적 구조가 바뀔 수 있다.

Node.js, 병아리 엔진을 기반으로 하는 위키 엔진. 여태 본인이 개발/커스텀한것과 달리 더시드 모방이 아니며 독자적인 UI로 개발, 무료 Node.js 호스팅 써비스가 있으면 터보위키(새위키)에 사용, 없으면 미사용할 예정.

스킨은 the seed 4.12.0 이하용으로 만들어진 스킨을 가져와 사용하면 된다. (skins 디렉토리에 넣기)

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
- [ ] **IP 차단**
- [ ] **사용자 차단**
- [ ] **권한 부여**
- [ ] 로그인 내역
- [ ] **위키 설정 도구**
- [ ] API
- [ ] 편집요청
- [ ] 일관 편집, 생성, 및 삭제
- [ ] 자동 로그인
- [X] **화일 올리기 도구**
- [ ] **화일 페이지**
- [ ] 검색
- [ ] 문서함
- [ ] 투표
- [ ] 역링크
- [ ] 나무마크

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

### md5
[[NPM]](https://www.npmjs.com/package/md5) [[라이선스]](https://github.com/pvorb/node-md5/blob/master/LICENSE)

### ip-range-check
[[NPM]](https://www.npmjs.com/package/ip-range-check) [[라이선스]](https://github.com/danielcompton/ip-range-check/blob/master/LICENSE)
