SummaryButton = document.getElementById('Summarize');
SummaryButton.onclick = async (e) => {
  e.preventDefault();

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url = tab.url.split("&")[0];
  console.log(url)
  var expression = /https?:\/\/(www\.)?youtube.com\/watch\b([v?=].*)/g;
  var regex = new RegExp(expression);

  if (!url.match(regex)) return;

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['contentScript.js'],
  });

  chrome.tabs.sendMessage(
    tab.id,
    { action: 'Load Summary' },
    (response) => {
      if (response) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              chrome.tabs.sendMessage(
                tab.id,
                {
                  video_url: url,
                  action: 'print Summary',
                  summary: JSON.parse(xhr.response),
                }
              );
            }
          }
        };
        // the API
        xhr.open(
          'GET',
          'https://52b2-2401-4900-1cd4-45f7-4d59-8efa-a52a-dc03.ngrok-free.app/api/summarize?youtube_url=' +
            url,
          true
        );
        xhr.send();
      }
    }
  );

  console.log(url)
  // Timeout for response
  setTimeout(() => {
    chrome.tabs.sendMessage(tab.id, {
      video_url: url,
      action: 'print Summary',
      summary: 'Timeout: No response received.',
    });
  }, 5000); // Adjust the timeout duration as needed
};
