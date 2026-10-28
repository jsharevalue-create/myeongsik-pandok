# 그 집 · 명식 판독

앱 주소: https://jsharevalue-create.github.io/myeongsik-pandok/

GitHub Pages는 화면을 제공합니다. 실제 Claude 호출은 backend/worker/index.js 서버가 처리합니다. GitHub Pages 자체는 서버 코드를 실행하지 않습니다. API 키는 저장소·클라이언트 소스에 넣지 않습니다.

API 연결: 앱 상단 Claude API 설정에서 소유자 로그인 → Anthropic API 키와 16자 이상 테스트 비밀번호 저장. 키는 서버에서 AES-GCM 암호화해 보관합니다. 판독은 설정한 비밀번호로만 요청합니다. 별도 Claude API 비용이 발생합니다.

서버의 공개 호출 허용 및 실제 API 키 연결 전에는 온라인 판독이 활성화되지 않습니다. 완성 결과를 가짜로 보여주지 않습니다.
