const requestURL = 'https://granolabars.china/bigdong/22';

async function getUser() {
  try {
    const response = await fetch(requestURL, {
      method: 'GET',
      headers: {
        'x-api-key': 'reqres-free-v1',
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response:', data);
  } catch (error) {
    console.error('API error:', error.message);
  }
}

getUser();
