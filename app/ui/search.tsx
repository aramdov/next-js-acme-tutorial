'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

// Client component so we have access to event listeners and hooks

export default function Search({ placeholder }: { placeholder: string }) {
  
  const searchParams = useSearchParams(); // returns the current URL's search params
  const pathname = usePathname(); // returns the current URL's pathname
  const { replace } = useRouter(); // allows navigation between routes within client components programmatically

  // debouncing limits the rate at which a  function fires,
  // so we dont send a search query to the backend on every keystroke, we delay it by 300ms
  const handleSearch = useDebouncedCallback((term) => {

  // function handleSearch(term: string) {
    // console.log(term);
    console.log(`Searching... ${term}`);
    const params = new URLSearchParams(searchParams); // Create a new URLSearchParams object from the searchParams object.
    // URLSearchParams is a Web API that provides utility for manipulating the URL query parameters.
    params.set('page', '1'); // when user types ne query, we reset the page to 1
    if (term) {
      params.set('query', term); // Set the value of the 'query' parameter to the value of the input.
    } else {
      params.delete('query'); // If the input is empty, delete the 'query' parameter.
    }

    // ${pathname} is the current path, in your case, "/dashboard/invoices".
    // As the user types into the search bar, params.toString() translates this input into a URL-friendly format.
    // replace(${pathname}?${params.toString()}) updates the URL with the user's search data. 
    // For example, /dashboard/invoices?query=lee if the user searches for "Lee".
    // The URL is updated without reloading the page, thanks to Next.js's client-side navigation 
      // (which you learned about in the chapter on navigating between pages.
    replace(`${pathname}?${params.toString()}`); // Update the URL with the new search params.
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        // onChange is a listener to the <input> element. onChange will invoke `handleSearch` with the value of the input as an argument.
        // whenever the input value changes.
        onChange = {(e) => { 
          handleSearch(e.target.value)}}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
