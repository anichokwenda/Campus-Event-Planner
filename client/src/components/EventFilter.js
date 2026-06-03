import React from "react";

export default function EventFilter({filters, setFilters}) {
    const handleChange = (e) => {
        setFilters({...filters, [e.target.name]: e.target.value});
    };

    return(
        <div className="filters">
            <select name="category" value={filters.category} onChange={handleChange}>
                <option value="">All Categories</option>
                <option value="career">Career</option>
                <option value="club">Club</option>
                <option value="sports">Sports</option>
                <option value="academic">Academic</option>

            </select>

            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleChange}
            />
        </div>
    );
}