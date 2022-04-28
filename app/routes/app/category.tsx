import React from 'react';
import {
  ActionFunction, Form, LoaderFunction, redirect, useLoaderData,
} from 'remix';
import { getCategoryCookie } from '~/utils/cookieHelpers';
import { categoryCookie } from '~/cookies';
import PageOffset from '~/components/PageOffset';
import Card from '~/components/Card';
import Button from '~/components/Button';
import { getCategories } from '~/data/data';

interface LoaderData {
  category: Category | null;
  categories: Category[];
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const categories = getCategories();
  const cookie = await getCategoryCookie(request);

  return {
    category: cookie.category,
    categories,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const cookie = await getCategoryCookie(request);
  const bodyParams = await request.formData();

  const cat = bodyParams.get('categoryId');

  if (!cat) {
    cookie.category = null;
  } else {
    cookie.category = cat as string;
  }

  return redirect('/app', {
    headers: {
      'Set-Cookie': await categoryCookie.serialize(cookie),
    },
  });
};

function Category() {
  const { category, categories } = useLoaderData<LoaderData>();

  return (
    <PageOffset>
      <Card>
        <h1 className="text-2xl mb-4">Wybierz kategorię</h1>
        <Form method="post">
          <div className="flex flex-row flex-wrap justify-center gap-4">

            {categories.map((cat) => (
              <div key={`form-${cat}`}>
                <Button
                  variant={cat === category ? 'contained' : 'outlined'}
                  type="submit"
                  value={cat}
                  name="categoryId"
                >
                  {cat}
                </Button>
              </div>
            ))}
          </div>
        </Form>
      </Card>
    </PageOffset>
  );
}

export default Category;
