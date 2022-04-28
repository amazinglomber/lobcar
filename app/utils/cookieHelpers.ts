import { categoryCookie } from '~/cookies';

interface CategoryCookie {
  category: string | null;
}

export async function getCategoryCookie(request: Request): Promise<CategoryCookie> {
  const cookieHeader = request.headers.get('Cookie');
  return (await categoryCookie.parse(cookieHeader)) || { category: null };
}
