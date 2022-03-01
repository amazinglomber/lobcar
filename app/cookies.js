import { createCookie } from 'remix';

export const categoryCookie = createCookie('category', {
  maxAge: 604_800, // one week
});

export const userPrefs = createCookie('user-prefs', {
  maxAge: 604_800, // one week
});
