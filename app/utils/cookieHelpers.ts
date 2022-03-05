import { categoryIdCookie } from '~/cookies';

export async function getCategoryCookie(request: Request): Promise<{ categoryId: number | null }> {
  const cookieHeader = request.headers.get('Cookie');
  return (await categoryIdCookie.parse(cookieHeader)) || { categoryId: null };
}
