function extractArxivData() {
    const titleEl = document.querySelector('h1.title');
    const authorsEl = document.querySelector('div.authors');
    const abstractEl = document.querySelector('blockquote.abstract');
    const rawTitle = titleEl ? titleEl.textContent.trim() : '';
    const title = rawTitle.replace(/^Title:\s*/i, '').trim();
    const rawAuthors = authorsEl ? authorsEl.textContent.trim() : '';
    const authors = rawAuthors.replace(/^Authors?:\s*/i, '').trim();
    const rawAbstract = abstractEl ? abstractEl.textContent.trim() : '';
    const abstract = rawAbstract.replace(/^Abstract:\s*/i, '').trim();
    let pdfLink = '';
    const pdfAnchor = Array.from(document.querySelectorAll('a'))
        .find(a => /pdf/i.test(a.textContent) || /\/pdf\//.test(a.getAttribute('href') || ''));
    if (pdfAnchor) {
        const href = pdfAnchor.getAttribute('href');
        pdfLink = href.startsWith('http') ? href : new URL(href, location.origin).href;
    } else {
        const idMatch = location.pathname.split('/').pop();
        if (idMatch) pdfLink = `https://arxiv.org/pdf/${idMatch}.pdf`;
    }
    return { title, authors, abstract, pdfLink };
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg && msg.type === 'ARXIV_EXTRACT') {
        try { sendResponse({ ok: true, data: extractArxivData() }); }
        catch (e) { sendResponse({ ok: false, error: e.message }); }
        return true;
    }
});
