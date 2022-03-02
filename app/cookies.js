import { createCookie } from 'remix';

export const categoryIdCookie = createCookie('categoryId', {
  maxAge: 604_800, // one week
});
