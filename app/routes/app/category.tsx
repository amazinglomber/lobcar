import React from 'react';
import {
  ActionFunction, Form, LoaderFunction, redirect, useLoaderData,
} from 'remix';
import { Category } from '@prisma/client';
import { getCategoryCookie } from '~/utils/cookieHelpers';
import { categoryCookie } from '~/cookies';
import PageOffset from '~/components/PageOffset';
import Card from '~/components/Card';
import Button from '~/components/Button';
import { getCategories } from '~/data';

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

  const cat = bodyParams.get('categoryId');

  if (!cat) {
    cookie.categoryId = null;
    cookie.categoryName = null;
  } else {
    const [catId, catName] = (cat as string).split('|');
    cookie.categoryId = +catId;
    cookie.categoryName = catName;
  }

  return redirect(request.url, {
    headers: {
      'Set-Cookie': await categoryCookie.serialize(cookie),
    },
  });
};

function Category() {
  const { categoryId, categories } = useLoaderData<LoaderData>();

  return (
    <PageOffset>
      <Card>
        <h1 className="text-2xl mb-4">Wybierz kategorię</h1>
        <Form method="post">
          <div className="flex flex-row flex-wrap justify-center gap-4">

            {categories.map((cat) => (
              <div key={`form-${cat.id}`}>
                <Button
                  variant={cat.id === categoryId ? 'contained' : 'outlined'}
                  type="submit"
                  value={`${cat.id}|${cat.name}`}
                  name="categoryId"
                >
                  {cat.name}
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
