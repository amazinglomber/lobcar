import { createCookie } from 'remix';

export const categoryIdCookie = createCookie('categoryId', {
  expires: new Date('January 19 2038 03:14:07'), // end of the world
});
