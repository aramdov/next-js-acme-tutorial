
'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';


// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];


// To link between pages, you'd traditionally use the <a> HTML element. 
// At the moment, the sidebar links use <a> elements, 
// but notice what happens when you navigate between the home, invoices, and customers pages on your browser.
// There is a full page refresh, and the entire page is reloaded.
// This is not ideal for a modern web application,
// as it can be slow and cause a poor user experience.
// Next.js has a solution for this: the Link component.
// The Link component is a wrapper around the <a> element,
// and it's used to navigate between pages without a full page refresh.
// You can use it to link between pages in your application.
// It allows you to do client side navigation, which is faster and provides a better user experience.

// Although parts of the app are rendered on the server, there's no full page refresh, making it feel like a web app.
// This is because of Automatic code-splitting and Prefetching.
// To improve navigation performance, Next.js automatically code-splits your app by route segments.
// This is different from traditional React SPA, where the browser loads al your application code on inital load
// Splitting code by routes means that pages become isolated. If a certain page throws an error, the rest of the application will still work.
// Furthermore, in production, whenever <Link> components appear in the browser's viewport, Next.js automatically prefetches the code for the linked route in the background.
// By the time the user clicks the link, the code for the destination page will already be loaded in the background, and this is what makes the page transition near-instant!
export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            // className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
