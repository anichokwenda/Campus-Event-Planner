import React from "react";

export default function EventFilter({filters, setFilters}) {
    const handleChange = (e) => {
        const {name, value } = e.target;
        const newValue = name === "date" && value === ""? "All" : value;
        setFilters({...filters, [name]: newValue});
    };

    const clearDate = () =>{
        setFilters({...filters, date: "All"});
    }

    return(
        <div className="filters">
            <select name="category" value={filters.category} onChange={handleChange}>
                <option value="All">All Categories</option>
                <option value="Career">Career</option>
                <option value="Club">Club</option>
                <option value="Sports">Sports</option>
                <option value="Academic">Academic</option>

            </select>

            <input
              type="date"
              name="date"
              value={filters.date === "All"? "" : filters.date}
              onChange={handleChange}
            />
            {filters.date!== "All" && (
                <button onClick={clearDate} style={{marginLeft: "8px"}}>
                    Clear Date
                </button>
            )}
        </div>
    );
}