import React from "react";

function Search() {
  return (
    <div className="w-full    relative">
      <input
        placeholder="Search for anything..."
        className="w-full px-4 border-2 border-gray-100 rounded-md  overflow-hidden   pr-10 h-10"
        type="text"
        // onBlur={handleBlur}
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5625 15.625C13.1869 15.625 16.125 12.6869 16.125 9.0625C16.125 5.43813 13.1869 2.5 9.5625 2.5C5.93813 2.5 3 5.43813 3 9.0625C3 12.6869 5.93813 15.625 9.5625 15.625Z" stroke="#191C1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.2031 13.7031L18 17.5" stroke="#191C1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export default Search;
