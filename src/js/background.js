// background (service worker)
async function getSettings() { return new Promise(r => chrome.storage.sync.get(['notionToken', 'notionDatabaseId'], r)); }
async function createNotionPage(payload) {
    const { notionToken, notionDatabaseId } = await getSettings();
    if (!notionToken || !notionDatabaseId) throw new Error('Notion token / database ID not set.');
    const today = new Date().toISOString().split('T')[0];
    const body = {
        parent: { database_id: notionDatabaseId }, properties: {
            'Title': { title: [{ text: { content: payload.title || '' } }] },
            'Authors': { rich_text: [{ text: { content: payload.authors || '' } }] },
            'Abstract': { rich_text: [{ text: { content: payload.abstract || '' } }] },
            'Article-URL': { url: payload.pdfLink || '' },
            'Status': { select: { name: 'Ready to Start' } },
            'add date': { date: { start: today } }
        }
    };
    const res = await fetch('https://api.notion.com/v1/pages', { method: 'POST', headers: { 'Authorization': `Bearer ${notionToken}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`Notion API error ${res.status}`);
    return res.json();
}
chrome.runtime.onMessage.addListener((msg, _s, sendResponse) => { if (msg && msg.type === 'NOTION_SAVE') { createNotionPage(msg.payload).then(d => sendResponse({ ok: true, data: d })).catch(e => sendResponse({ ok: false, error: e.message })); return true; } });
