'use strict';

const requestURL = 'https://reqres.in/api/users?page=2';

async function getUser() {
  const response = await fetch(requestURL, {
    method: 'GET',
    headers: {
      'x-api-key': 'reqres-free-v1',
    },
  });

  const data = await response.json();
  console.log('API response:', data);
}

getUser();
