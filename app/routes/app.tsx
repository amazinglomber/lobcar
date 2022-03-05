import {
  ActionFunction, Form, LoaderFunction, Outlet, redirect, useLoaderData,
} from 'remix';
import { Category } from '@prisma/client';
import Navbar from '~/components/Navbar';
import Dialog from '~/components/Dialog';
import Button from '~/components/Button';
import { getCategories } from '~/data';
import { getCategoryCookie } from '~/utils/cookieHelpers';
import { categoryIdCookie } from '~/cookies';

interface LoaderData {
  categoryId: number | null;
  categories: Category[];
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const categories = await getCategories();

  const cookie = await getCategoryCookie(request);

  return {
    categoryId: cookie.categoryId,
    categories,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const cookie = await getCategoryCookie(request);
  const bodyParams = await request.formData();

  const catId = bodyParams.get('categoryId');

  if (!catId) {
    cookie.categoryId = null;
  } else {
    cookie.categoryId = +catId;
  }

  return redirect(request.url, {
    headers: {
      'Set-Cookie': await categoryIdCookie.serialize(cookie),
    },
  });
};

export default function Index() {
  const { categoryId, categories } = useLoaderData<LoaderData>();

  const openDialog = categoryId === null;

  return (
    <div>
      <Navbar />

      <Dialog open={openDialog}>
        <h1 className="text-2xl mb-2">Wybierz kategorię</h1>
        <Form method="post">
          <div className="flex flex-row items-start gap-4">

            {categories.map((cat) => (
              <Button
                variant="outlined"
                key={`form-${cat.id}`}
                type="submit"
                value={cat.id}
                name="categoryId"
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </Form>
      </Dialog>

      {!openDialog && <Outlet />}

    </div>
  );
}
