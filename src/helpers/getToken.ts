'use client';

export function getToken() {
  const loggedUserString = localStorage.getItem('loggedUser');

  if (!loggedUserString) {
    throw new Error('User is not signed in');
  }

  let loggedUser;
  try {
    loggedUser = JSON.parse(loggedUserString);
  } catch (e) {
    throw new Error('Failed to parse logged user data');
  }

  if (
    !loggedUser ||
    !loggedUser.stsTokenManager ||
    !loggedUser.stsTokenManager.accessToken
  ) {
    throw new Error('User is not signed in');
  }

  const token = loggedUser.stsTokenManager.accessToken;
  return token;
}
// 'use client';

// export function getToken() {
//   const loggedUserString = localStorage.getItem('loggedUser');

//   if (!loggedUserString) {
//     throw new Error('User is not signed in');
//   }

//   let loggedUser;
//   try {
//     loggedUser = JSON.parse(loggedUserString);
//   } catch (e) {
//     throw new Error('Failed to parse logged user data');
//   }

//   if (
//     !loggedUser ||
//     !loggedUser.stsTokenManager ||
//     !loggedUser.stsTokenManager.accessToken
//   ) {
//     throw new Error('User is not signed in');
//   }

//   const token = loggedUser.stsTokenManager.accessToken;
//   return token;
// }

// export function removeToken() {
//   localStorage.removeItem('loggedUser');
// }
