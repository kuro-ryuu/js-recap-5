'use strict';

const requestURL = 'https://reqres.in/api/users?page=2';

async function fetchData(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}
