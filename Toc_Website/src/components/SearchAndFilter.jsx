import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import Filter from "./Filter";
import { ALPHABET_OPTIONS, COLOR_OPTIONS, YEAR_OPTIONS } from "../mocks/filter";

// Map built-in keys -> config
const BUILTIN_FILTERS = {
  alphabet: { key: "alphabet", label: "Alphabet", options: ALPHABET_OPTIONS },
  color: { key: "color", label: "Color", options: COLOR_OPTIONS },
  year: { key: "year", label: "Year", options: YEAR_OPTIONS },
};

/**
 * Props:
 * - onChange: ({ query, ...filterValues }) => void
 * - initial:  { query?: string, [filterKey: string]: string }
 * - filters:  Array<string | { key: string; label: string; options: {value,label}[] }>
 *             e.g. ['alphabet', 'color'] or [{ key:'status', label:'Status', options:[...]}]
 * - showSearch?: boolean (default: true)
 */
const SearchAndFilter = ({ onChange, initial, filters, showSearch = true }) => {
  const [query, setQuery] = useState(initial.query ?? "");

  // Normalize filters prop into full objects
  const normalizedFilters = useMemo(() => {
    return filters
      .map((f) => (typeof f === "string" ? BUILTIN_FILTERS[f] : f))
      .filter(Boolean);
  }, [filters]);

  // Build initial values per filter
  const initialFilterValues = useMemo(() => {
    const obj = {};
    normalizedFilters.forEach(({ key, options }) => {
      const init = initial[key];
      const defaultVal = options?.[0]?.value ?? ""; // 'All' if present, or first option
      obj[key] = init ?? defaultVal;
    });
    return obj;
  }, [normalizedFilters, initial]);

  const [values, setValues] = useState(initialFilterValues);

  useEffect(() => {
    setValues(initialFilterValues); // update if filters/initial change
  }, [initialFilterValues]);

  // Notify parent on any change
  useEffect(() => {
    onChange?.({ query, ...values });
  }, [query, values, onChange]);

  const handleFilterChange = (key) => (val) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
      {showSearch && (
        <div className="flex-1 w-full">
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
