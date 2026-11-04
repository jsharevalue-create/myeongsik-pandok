// 명식 판독 온라인판의 Claude 호출 창구. 화면이 만든 지시문을 받아 Anthropic API로 넘기고,
// 답을 흘려보내기(SSE) 그대로 돌려준다. 키는 Netlify 환경 변수 ANTHROPIC_API_KEY에만 둔다.
// 선택: PANDOK_CODE를 넣으면 그 이용 코드를 아는 사람만 판독을 받는다(시험 기간 남용 방지).
const MAX_PROMPT = 120000; // 글자 수 — 교본·규칙·사실표를 합친 지시문보다 넉넉히

export default async (req) => {
  const key = (Netlify.env.get('ANTHROPIC_API_KEY') || '').trim();
  const code = (Netlify.env.get('PANDOK_CODE') || '').trim();
  if (req.method === 'GET') return Response.json({ ok: !!key, code: !!code });
  if (req.method !== 'POST') return new Response('method', { status: 405 });
  if (!key) return new Response('서버에 API 키가 아직 없습니다', { status: 503 });

  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(req.url).host) return new Response('origin', { status: 403 });
  if (code && req.headers.get('x-pandok-code') !== code) return new Response('code', { status: 401 });

  let body;
  try { body = await req.json(); } catch { return new Response('json', { status: 400 }); }
  const prompt = body && body.prompt;
  if (typeof prompt !== 'string' || !prompt || prompt.length > MAX_PROMPT) return new Response('prompt', { status: 400 });

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'server-side-fallback-2026-07-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-5-5',
      max_tokens: 64000,
      stream: true,
      thinking: { type: 'adaptive' },
      output_config: { effort: body.complex ? 'high' : 'medium' },
      fallbacks: 'default',
      cache_control: { type: 'ephemeral' },
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  // Anthropic 쪽 오류는 502로 감싸서 돌려준다 — 화면이 401을 「이용 코드 틀림」으로 읽기 때문
  if (!r.ok) {
    const why = r.status === 401 ? 'API 키가 맞지 않습니다(Netlify 환경 변수 ANTHROPIC_API_KEY 확인)'
      : r.status === 429 ? '사용량 한도에 걸렸습니다. 잠시 뒤 다시 눌러 주세요' : 'Claude 서버 오류';
    return new Response(why + ' · ' + r.status + ' ' + (await r.text()).slice(0, 300), { status: 502 });
  }
  return new Response(r.body, { headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-store' } });
};

export const config = { path: '/api/claude' };
