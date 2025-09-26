import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search..."
                style={{ padding: '8px', flex: 1 }}
            />
            <button type="submit" style={{ padding: '8px 16px', marginLeft: '8px' }}>
                Search
            </button>
        </form>
    );
};

export default SearchBar;