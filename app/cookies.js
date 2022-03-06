import { createCookie } from 'remix';

export const categoryCookie = createCookie('category', {
  expires: new Date('January 19 2038 03:14:07'), // end of the world
});
