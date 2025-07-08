import { useState, useEffect } from "react";
import { allCategories } from "../constants/common";

export const useMergedCategories = (categories) => {
  const [mergedCategories, setMergedCategories] = useState({});
  const [allCategoryNames, setAllCategoryNames] = useState([]);

  useEffect(() => {
    if (categories) {
      // Create static categories object from allCategories array
      const staticCategories = {};
      allCategories.forEach((category) => {
        if (category !== "Select Category") {
          staticCategories[category] = [];
        }
      });

      // Merge static and dynamic categories
      const merged = { ...staticCategories, ...categories };
      setMergedCategories(merged);

      // Get all unique category names
      const staticCategoryNames = allCategories.filter(
        (cat) => cat !== "Select Category"
      );
      const dynamicCategoryNames = Object.keys(categories || {});
      const allCategoriesList = [
        ...new Set([...staticCategoryNames, ...dynamicCategoryNames]),
      ];
      setAllCategoryNames(allCategoriesList);
    }
  }, [categories]);

  return {
    mergedCategories,
    allCategoryNames,
    hasMergedCategories: Object.keys(mergedCategories).length > 0,
  };
};
