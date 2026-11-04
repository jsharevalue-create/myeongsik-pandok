# 그 집 · 명식 판독

하나로 합친 판독 앱(v6.0~). Netlify에 올리면 `netlify/edge-functions/claude.js`가 `/api/claude`로 Claude를 부른다. API 키는 Netlify 환경 변수 `ANTHROPIC_API_KEY`에만 둔다(저장소에 넣지 않음). `PANDOK_CODE`를 넣으면 이용 코드를 아는 사람만 판독 가능. GitHub Pages에서는 서버가 없어 명식·해설·궁합만 보인다.

GitHub Pages는 화면을 제공합니다. 실제 Claude 호출은 backend/worker/index.js 서버가 처리합니다. GitHub Pages 자체는 서버 코드를 실행하지 않습니다. API 키는 저장소·클라이언트 소스에 넣지 않습니다.

API 연결: 앱 상단 Claude API 설정에서 소유자 로그인 → Anthropic API 키와 16자 이상 테스트 비밀번호 저장. 키는 서버에서 AES-GCM 암호화해 보관합니다. 판독은 설정한 비밀번호로만 요청합니다. 별도 Claude API 비용이 발생합니다.

서버의 공개 호출 허용 및 실제 API 키 연결 전에는 온라인 판독이 활성화되지 않습니다. 완성 결과를 가짜로 보여주지 않습니다.
