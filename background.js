chrome.runtime.onMessage.addListener(
  async function (request, sender, sendResponse) {
    if (request.content) {
      try {
        const apiKey = //insert key;
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'You are a content safety evaluator.'
              },
              {
                role: 'user',
                content: `Analyze the following website content and determine if it contains triggering content: "${request.content}"
                If so, return 1 otherwise return 0`
              }
            ],
            max_tokens: 60,
            n: 1,
            stop: null,
            temperature: 0.5
          })
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('API response:', data);  // Log the API response for debugging

        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
          throw new Error('Invalid API response format');
        }

        const prediction = data.choices[0].message.content.trim();

        // Example: Check if the prediction indicates triggering content
        const isTriggering = prediction.toLowerCase().includes('1');

        chrome.tabs.sendMessage(sender.tab.id, { isTriggering: isTriggering });

        sendResponse({ isTriggering: isTriggering });
      } catch (error) {
        console.error('Failed to make a prediction:', error);
        sendResponse({ error: 'Failed to make a prediction' });
      }
    }
    return true;
  }
);
