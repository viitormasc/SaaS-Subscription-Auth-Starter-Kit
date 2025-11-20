import type { CategoryDocument, TimerDocument } from '@/types/interfaces';
import { useEffect, useState } from 'react';
import { DashboardFilterContextProvider } from '@/utils/DashboardFilterContext';
export interface FilterSectionProps {
  categories: CategoryDocument[];
  categoryColors: Record<string, string>;
  children: any;
}

export default function FilterSectionComponent({
  categories,
  categoryColors,
  children,
}: FilterSectionProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [selectedCategories, setSelectedCategories] =
    useState<CategoryDocument[]>(categories);
  const [selectedCategoriesFilter, setSelectedCategoriesFilter] =
    useState('Current Categories');

  const timeRanges = ['Week', 'Month', 'Last 30 Days', 'All Time'];

  const categoriesRange = ['Current Categories', 'All categories'];

  useEffect(() => {
    if (selectedCategoriesFilter === 'Current Categories') {
      setSelectedCategories(
        categories.filter((category) => !category.archived),
      );
    }
    if (selectedCategoriesFilter === 'All categories') {
      setSelectedCategories(categories);
    }
  }, [selectedCategoriesFilter]);

  const toggleCategory = (selectedCategory: CategoryDocument) => {
    if (selectedCategories.includes(selectedCategory)) {
      setSelectedCategories(
        selectedCategories.filter((category) => category !== selectedCategory),
      );
    } else {
      setSelectedCategories([...selectedCategories, selectedCategory]);
    }
  };

  return (
    <DashboardFilterContextProvider
      value={{ selectedCategories, selectedTimeRange }}
    >
      <div className="flex flex-wrap gap-4 mb-6 ">
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="font-semibold text-sm">Time Range:</div>
          <div className="flex gap-2">
            {timeRanges.map((range) => (
              <div
                key={range}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                  selectedTimeRange === range.toLowerCase().replace(' ', '-')
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
                onClick={() =>
                  setSelectedTimeRange(range.toLowerCase().replace(' ', '-'))
                }
              >
                {range}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className=" flex flex-wrap gap-4 mb-6">
            <div className="font-semibold text-sm my-2">Categories:</div>
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              {categoriesRange.map((filterCategorie) => (
                <div
                  key={filterCategorie}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer
${
  selectedCategoriesFilter === filterCategorie
    ? 'bg-primary text-white'
    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
}`}
                  onClick={() => setSelectedCategoriesFilter(filterCategorie)}
                >
                  {filterCategorie}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {selectedCategories.map((category, index) => (
                <div
                  key={category._id}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 cursor-pointer dark:text-white ${
                    selectedCategories.includes(category)
                      ? 'bg-opacity-30'
                      : 'bg-opacity-10'
                  }`}
                  style={{
                    backgroundColor: selectedCategories.includes(category)
                      ? `${categoryColors[category._id as string]}33` // Add transparency
                      : `${categoryColors[category._id as string]}1a`, // More transparency
                    // color: categoryColors[category._id as string],
                  }}
                  onClick={() => toggleCategory(category)}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryColors[index] }}
                  ></div>
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {children}
    </DashboardFilterContextProvider>
  );
}
