import type { LoaderFunction, MetaFunction } from 'remix';
import { Outlet, redirect } from 'remix';
import PageOffset from '~/components/PageOffset';

import { getCategoryCookie } from '~/utils/cookieHelpers';

export const loader: LoaderFunction = async ({ request }) => {
  const categoryCookie = await getCategoryCookie(request);

  if (!categoryCookie.categoryId) {
    throw redirect('/app/category');
  }

  return null;
};

export const meta: MetaFunction = () => ({
  title: 'lobcar - Egzamin',
  description: 'Sprawdź swoją wiedzę rozwiązując egzamin',
});

export default function Exam() {
  return (
    <PageOffset>
      <Outlet />
    </PageOffset>
  );
}
