import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Category } from '@prisma/client';
import clientOnly from '~/utils/clientOnly';

/**
 * Get category info from cookie
 */
const useCategory = () => {
  const categoryCookie = Cookies.get('category');

  const [selectedCategoryId, setSelectedCategoryId] = useState<Category['id']>();
  const [selectedCategoryName, setSelectedCategoryName] = useState<Category['name']>();

  useEffect(() => {
    clientOnly(() => {
      if (!categoryCookie) return;

      const { categoryId, categoryName } = JSON.parse(window.atob(categoryCookie));
      setSelectedCategoryId(categoryId);
      setSelectedCategoryName(categoryName);
    });
  }, [categoryCookie]);

  return {
    selectedCategoryId,
    selectedCategoryName,
  };
};

export default useCategory;
