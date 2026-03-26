chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'MJ_AVATAR_PICKER_DOWNLOAD') return undefined;

  chrome.downloads.download(
    {
      url: message.url,
      filename: `midjourney-avatar-picker/${message.filename}`,
      saveAs: false,
      conflictAction: 'uniquify',
    },
    (downloadId) => {
      if (chrome.runtime.lastError || typeof downloadId !== 'number') {
        sendResponse({ ok: false, error: chrome.runtime.lastError?.message || 'download_failed' });
        return;
      }
      sendResponse({ ok: true, downloadId });
    },
  );

  return true;
});
