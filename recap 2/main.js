'use strict';

const requestURL = 'https://reqres.in/api/users';

async function createUser() {
  const response = await fetch(requestURL, {
    method: 'POST',
    headers: {
      'x-api-key': 'reqres-free-v1',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'John Name',
      job: 'McJob',
    }),
  });

  const data = await response.json();
  console.log('API response:', data);
}

createUser();
