import { categoryIdCookie } from '~/cookies';

export async function getCategoryCookie(request: Request): Promise<{ categoryId: number | null }> {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await categoryIdCookie.parse(cookieHeader)) || { categoryId: null };

  return cookie;
}
