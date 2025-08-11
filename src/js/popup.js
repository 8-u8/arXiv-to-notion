const statusEl = document.getElementById('status');
const titleEl = document.getElementById('title');
const authorsEl = document.getElementById('authors');
const abstractEl = document.getElementById('abstract');
const pdfEl = document.getElementById('pdf');
const saveBtn = document.getElementById('saveBtn');

let latestData = null;
function setStatus(m, e = false) {
    statusEl.textContent = m;
    statusEl.style.color = e ? 'crimson' : '#333';
}
async function extract() { setStatus('Extracting...'); const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); if (!tab) { setStatus('No active tab', true); return; } chrome.tabs.sendMessage(tab.id, { type: 'ARXIV_EXTRACT' }, resp => { if (!resp || !resp.ok) { setStatus(resp && resp.error ? resp.error : 'Extraction failed', true); return; } latestData = resp.data; titleEl.textContent = latestData.title; authorsEl.textContent = latestData.authors; abstractEl.textContent = latestData.abstract.slice(0, 400) + (latestData.abstract.length > 400 ? '...' : ''); pdfEl.textContent = latestData.pdfLink; setStatus('Ready'); }); }
saveBtn.addEventListener('click', () => { if (!latestData) { setStatus('No data to save', true); return; } setStatus('Saving to Notion...'); chrome.runtime.sendMessage({ type: 'NOTION_SAVE', payload: latestData }, resp => { if (!resp || !resp.ok) { setStatus(resp && resp.error ? resp.error : 'Save failed', true); return; } setStatus('Saved ✅'); }); });
extract();
