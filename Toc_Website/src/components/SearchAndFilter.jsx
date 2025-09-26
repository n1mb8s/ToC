import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import Filter from "./Filter";

/**
 * Props:
 * - filters: Array<{ key: string; label: string; initial?: string; options: { value: string; label: string }[] }>
 * - query?: string                // initial (and external updates) for search text
 * - onChange?: (state) => void    // { query, [key]: value }
 * - showSearch?: boolean          // default: true
 */
const SearchAndFilter = ({
  filters = [],
  query: queryProp = "",
  onChange,
  showSearch = true,
}) => {
  // query: initialize from prop, update if prop changes
  const [query, setQuery] = useState(queryProp);
  useEffect(() => {
    setQuery(queryProp);
  }, [queryProp]);

  // Normalize filters (ensure truthy and shaped)
  const normalizedFilters = useMemo(
    () => (filters || []).filter(Boolean),
    [filters]
  );

  // Build initial values per filter:
  // - prefer filter.initial if present and valid
  // - else first option's value
  const initialFilterValues = useMemo(() => {
    const obj = {};
    normalizedFilters.forEach(({ key, options = [], initial }) => {
      const optionValues = options.map((o) => o.value);
      const hasInitial = initial != null && optionValues.includes(initial);
      obj[key] = hasInitial ? initial : options[0]?.value ?? ""; // default to first option (e.g., 'All')
    });
    return obj;
  }, [normalizedFilters]);

  const [values, setValues] = useState(initialFilterValues);

  // Keep internal filter values in sync if filters change
  useEffect(() => {
    setValues(initialFilterValues);
  }, [initialFilterValues]);

  // Bubble up changes
  useEffect(() => {
    onChange?.({ query, ...values });
  }, [query, values, onChange]);

  const handleFilterChange = (key) => (val) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
      {showSearch && (
        <div className="flex-1 w-full">
          {/* If your SearchBar supports a value prop, you can pass `value={query}` */}
          <SearchBar onSearch={setQuery} />
        </div>
      )}

      {normalizedFilters.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {normalizedFilters.map(({ key, label, options }) => (
            <Filter
              key={key}
              label={label}
              options={options}
              value={values[key]}
              onChange={handleFilterChange(key)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
