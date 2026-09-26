'use strict';

const requestURL = 'https://reqres.in/api/users?page=2';

async function fetchData(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

const options = {method: 'GET'};

try {
  const data = await fetchData(requestURL, options);
  console.log('API response:', data);
} catch (error) {
  console.error('Failed to fetch data:', error.message);
}
