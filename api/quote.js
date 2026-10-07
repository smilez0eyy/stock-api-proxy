const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

export default async function handler(req, res) {
  // CORS 헤더 추가 (중요!)
  res.setHeader('Access-Control-Allow-Origin', 'https://claude.ai');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { symbol } = req.query;
  if (!symbol) {
    return res.status(400).json({ error: 'symbol 필수' });
  }
  if (!FINNHUB_KEY) {
    return res.status(500).json({ error: 'API 키 설정 필요' });
  }

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json({
      symbol: symbol,
      pc: data.pc || null,
      c: data.c || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ 
      error: '호출 실패',
      details: error.message 
    });
  }
}
