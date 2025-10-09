// api/submit-sql.js
const DOCUMENT_SAVE_URL = 'https://tenant.gdesk.io/admin/document/save?key=nlsoft2018';

export default async function handler(req, res) {
    try {
        if (req.method !== 'POST') {
            res.setHeader('Allow', 'POST');
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const TOKEN_URL = process.env.TOKEN_URL;
        if (!TOKEN_URL) {
            console.error('TOKEN_URL is not configured');
            return res.status(500).json({ error: 'Missing TOKEN_URL configuration' });
        }

        const { sql } = await parseBody(req);
        if (!sql || !sql.trim()) {
            return res.status(400).json({ error: 'Missing SQL content' });
        }

        console.log('Starting token connection to:', TOKEN_URL);

        // Step 1: Connect to TOKEN_URL with increased timeout and better error handling
        try {
            const connectController = new AbortController();
            const connectTimeout = setTimeout(() => {
                console.log('Token connection timeout after 15s');
                connectController.abort();
            }, 15000); // Tăng timeout lên 15s

            const tokenResponse = await fetch(TOKEN_URL, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Cache-Control': 'no-cache'
                },
                signal: connectController.signal
            });

            clearTimeout(connectTimeout);
            console.log('Token connection status:', tokenResponse.status);

            // Đọc response để đảm bảo request hoàn tất
            await tokenResponse.text();
        } catch (tokenError) {
            console.error('Token connection error:', tokenError.message);
            // Continue anyway - có thể token vẫn được activate
            if (tokenError.name === 'AbortError') {
                console.log('Token connection timed out, continuing with SQL submit');
            }
        }

        // Small delay để đảm bảo token được process
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log('Submitting SQL to:', DOCUMENT_SAVE_URL);

        // Step 2: Submit SQL with increased timeout
        const body = new URLSearchParams();
        body.set('submit_sql', sql);

        const submitController = new AbortController();
        const submitTimeout = setTimeout(() => {
            console.log('SQL submit timeout after 20s');
            submitController.abort();
        }, 20000); // Tăng timeout lên 20s

        const saveResp = await fetch(DOCUMENT_SAVE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            body: body.toString(),
            signal: submitController.signal
        });

        clearTimeout(submitTimeout);

        const text = await saveResp.text();
        console.log('Save response status:', saveResp.status);

        if (!saveResp.ok) {
            console.error('Save failed:', text.slice(0, 300));
            return res.status(saveResp.status).json({
                ok: false,
                error: 'Save failed',
                details: text.slice(0, 300)
            });
        }

        console.log('SQL submitted successfully');
        return res.status(200).json({ ok: true, body: text });
    } catch (err) {
        console.error('Server error:', err.message, err.stack);
        return res.status(500).json({
            ok: false,
            error: 'Internal error',
            message: err.message
        });
    }
}

async function parseBody(req) {
    const ct = req.headers['content-type'] || '';
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const raw = Buffer.concat(chunks).toString('utf8');

    if (ct.includes('application/json')) {
        return JSON.parse(raw || '{}');
    }

    const sp = new URLSearchParams(raw);
    return Object.fromEntries(sp.entries());
}
