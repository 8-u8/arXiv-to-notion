const tokenInput = document.getElementById('notionToken');
const dbInput = document.getElementById('notionDatabaseId');
const saveBtn = document.getElementById('saveOptions');
const msgEl = document.getElementById('msg');
chrome.storage.sync.get(['notionToken', 'notionDatabaseId'], r => { if (r.notionToken) tokenInput.value = r.notionToken; if (r.notionDatabaseId) dbInput.value = r.notionDatabaseId; });
saveBtn.addEventListener('click', () => { chrome.storage.sync.set({ notionToken: tokenInput.value.trim(), notionDatabaseId: dbInput.value.trim() }, () => { msgEl.textContent = 'Saved'; setTimeout(() => msgEl.textContent = '', 2000); }); });
