import SideNav from '@/app/ui/dashboard/sidenav';

/*
Dashboards have some sort of navigation that is shared across multiple pages. 
In Next.js, you can use a special layout.tsx file to create UI that is shared between multiple pages. 
Let's create a layout for the dashboard pages!
*/

// The <Layout /> component receives a children prop.
// This child can either be a page or another layout.

/*
One benefit of using layouts in Next.js is that on navigation, only the page components update while the layout won't re-render. 
This is called partial rendering: */

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      </div>
    );
  }