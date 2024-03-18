import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    
    const id = params.id;

    // why are we fetching from the DB? When the user comes here from clicking the edit button, is the data not already in the store?
    // this is because the user could have come here directly from the URL, so we need to fetch the data from the server
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
      ]);

    if (!invoice) {
        notFound();
    }

    return (
    <main>
        <Breadcrumbs
        breadcrumbs={[
            { label: 'Invoices', href: '/dashboard/invoices' },
            {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
            },
        ]}
        />
        <Form invoice={invoice} customers={customers} />
    </main>
    );
}