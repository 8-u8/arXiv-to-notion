const tokenInput = document.getElementById('notionToken');
const dbInput = document.getElementById('notionDatabaseId');
const saveBtn = document.getElementById('saveOptions');
const msgEl = document.getElementById('msg');
chrome.storage.sync.get(['notionToken', 'notionDatabaseId'], res => {
    if (res.notionToken) tokenInput.value = res.notionToken;
    if (res.notionDatabaseId) dbInput.value = res.notionDatabaseId;
});
saveBtn.addEventListener('click', () => {
    chrome.storage.sync.set({ notionToken: tokenInput.value.trim(), notionDatabaseId: dbInput.value.trim() }, () => {
        msgEl.textContent = 'Saved'; setTimeout(() => msgEl.textContent = '', 2000);
    });
});
