
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category } from '../types';
import { CATEGORIES as INITIAL_DATA } from '../data';

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  reorderCategory: (index: number, direction: 'up' | 'down') => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(
    INITIAL_DATA.map(c => ({ ...c, isActive: true }))
  );

  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const reorderCategory = (index: number, direction: 'up' | 'down') => {
    setCategories((prev) => {
      const newList = [...prev];
      if (newList.length < 2) return newList;
      if (direction === 'up' && index > 0) {
        [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
      } else if (direction === 'down' && index < newList.length - 1) {
        [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
      }
      return newList;
    });
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory, reorderCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategoryContext must be used within a CategoryContextProvider');
  }
  return context;
};