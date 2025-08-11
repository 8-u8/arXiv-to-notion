function extractArxivData() {
    const t = document.querySelector('h1.title');
    const a = document.querySelector('div.authors');
    const ab = document.querySelector('blockquote.abstract');
    const title = (t ? t.textContent.trim() : '').replace(/^Title:\s*/i, '').trim();
    const authors = (a ? a.textContent.trim() : '').replace(/^Authors?:\s*/i, '').trim();
    const abstract = (ab ? ab.textContent.trim() : '').replace(/^Abstract:\s*/i, '').trim();
    let pdfLink = '';
    const pdfAnchor = [...document.querySelectorAll('a')].find(x => /pdf/i.test(x.textContent) || /\/pdf\//.test(x.getAttribute('href') || ''));
    if (pdfAnchor) { const href = pdfAnchor.getAttribute('href'); pdfLink = href.startsWith('http') ? href : new URL(href, location.origin).href; } else { const id = location.pathname.split('/').pop(); if (id) pdfLink = `https://arxiv.org/pdf/${id}.pdf`; }
    return { title, authors, abstract, pdfLink };
}
chrome.runtime.onMessage.addListener((msg, _s, sendResponse) => { if (msg && msg.type === 'ARXIV_EXTRACT') { try { sendResponse({ ok: true, data: extractArxivData() }); } catch (e) { sendResponse({ ok: false, error: e.message }); } return true; } });
