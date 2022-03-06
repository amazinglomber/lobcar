import { categoryCookie } from '~/cookies';

interface CategoryCookie {
  categoryId: number | null;
  categoryName: string | null;
}

export async function getCategoryCookie(request: Request): Promise<CategoryCookie> {
  const cookieHeader = request.headers.get('Cookie');
  return (await categoryCookie.parse(cookieHeader)) || { categoryId: null, categoryName: null };
}
