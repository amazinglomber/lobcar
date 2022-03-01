import {
  Outlet, ActionFunction, Form, LoaderFunction, redirect, useLoaderData,
} from 'remix';
import { Category } from '@prisma/client';
import { categoryCookie } from '~/cookies';
import Navbar from '~/components/Navbar';
import Dialog from '~/components/Dialog';
import Button from '~/components/Button';
import { getCategories } from '~/data';

interface LoaderData {
  category: string;
  categories: Category[];
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const categories = await getCategories();
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await categoryCookie.parse(cookieHeader)) || { category: null };

  return {
    category: cookie.category,
    categories,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await categoryCookie.parse(cookieHeader)) || {};
  const bodyParams = await request.formData();

  cookie.category = bodyParams.get('category');

  return redirect('/app', {
    headers: {
      'Set-Cookie': await categoryCookie.serialize(cookie),
    },
  });
};

export default function Index() {
  const { category, categories } = useLoaderData<LoaderData>();

  const openDialog = !category;

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
                name="category"
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
