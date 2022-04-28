import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import clientOnly from '~/utils/clientOnly';

/**
 * Get category info from cookie
 */
const useCategory = () => {
  const categoryCookie = Cookies.get('category');

  const [selectedCategory, setSelectedCategory] = useState<Category>();

  useEffect(() => {
    clientOnly(() => {
      if (!categoryCookie) return;

      const { category } = JSON.parse(window.atob(categoryCookie));
      setSelectedCategory(category);
    });
  }, [categoryCookie]);

  return {
    selectedCategory,
  };
};

export default useCategory;
