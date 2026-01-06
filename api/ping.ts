interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: any;
  query?: Record<string, string | string[]>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  end: () => void;
  setHeader: (name: string, value: string) => void;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  if (req.method === 'HEAD') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, ts: new Date().toISOString() });
  }
  
  return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
}
