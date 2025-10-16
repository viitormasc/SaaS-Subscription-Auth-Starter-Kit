import type { CategoryDocument } from '@/types/interfaces';
import { createContext, useContext } from 'react';

export interface DashboardContextType {
  selectedCategories: CategoryDocument[];
  selectedTimeRange: string;
}

export const DashboardFilterContext = createContext<DashboardContextType>({
  selectedCategories: [],
  selectedTimeRange: ''
});

export const useDashboardFilterContext = () => {
  return useContext(DashboardFilterContext);
};
