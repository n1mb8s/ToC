import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import Filter from "./Filter";

const SearchAndFilter = ({
  filters = [],
  query: queryProp = "",
  onChange,
  showSearch = true,
}) => {
  const [query, setQuery] = useState(queryProp);
  useEffect(() => {
    setQuery(queryProp);
  }, [queryProp]);

  const normalizedFilters = useMemo(
    () => (filters || []).filter(Boolean),
    [filters]
  );

  const initialFilterValues = useMemo(() => {
    const obj = {};
    normalizedFilters.forEach(({ key, options = [], initial }) => {
      const optionValues = options.map((o) => o.value);
      const hasInitial = initial != null && optionValues.includes(initial);
      obj[key] = hasInitial ? initial : options[0]?.value ?? "";
    });
    return obj;
  }, [normalizedFilters]);

  const [values, setValues] = useState(initialFilterValues);

  useEffect(() => {
    setValues((prev) => {
      const keys = Object.keys({ ...prev, ...initialFilterValues });
      const equal = keys.every((k) => prev[k] === initialFilterValues[k]);
      return equal ? prev : initialFilterValues;
    });
  }, [initialFilterValues]);

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
