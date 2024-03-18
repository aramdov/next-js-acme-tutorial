'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

/*
By adding the 'use server', you mark all the exported functions within the file as server functions. 
These server functions can then be imported into Client and Server components, making them extremely versatile.

You can also write Server Actions directly inside Server Components by adding "use server" inside the action. 
But for this course, we'll keep them all organized in a separate file.

*/


// this schema is for the form data
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({invalid_type_error: 'Please select a customer.'}), // z.string() will ensure the value is a string and not empty
    amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.'}), // z.coerce.number() will attempt to convert the value to a number
    status: z.enum(['pending', 'paid'], { invalid_type_error: 'Please select an invoice status.'}), // z.enum() will ensure the value is one of the provided options
    date: z.string(),
  });

// below is the schema for the form data without the id and date
const CreateInvoice = FormSchema.omit({ id: true, date: true });
// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });


// This is temporary until @types/react-dom is updated
export type State = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
  };

// Behind the scenes, Server Actions create a POST API endpoint. 
// This is why you don't need to create API endpoints manually when using Server Actions.
// You can call these functions from both the client and the server.

// prevState - contains the state passed from the useFormState hook. You won't be using it in the action in this example, but it's a required prop.
export async function createInvoice(prevState: State, formData: FormData) {
    // Tip: If you're working with forms that have many fields, you may want to consider using the entries() method with JavaScript's Object.fromEntries(). 
    // For example: const rawFormData = Object.fromEntries(formData.entries())

    // Use Zod to validate the form data
    // For your example, we'll use Zod, a TypeScript-first validation library that can simplify this task for you.
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });
        // safeParse returns an object containing either a success or error field
        // handles validation more gracefully wtihout having to wrap it in a try/catch block


    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100; // Convert the amount to cents. For example, $10.00 becomes 1000
    // this is a best practice to store money in the database to avoid floating point errors and ensure greater accuracy
    const date = new Date().toISOString().split('T')[0];

    // right not were not handling any errors in the db insert, but later we will
    //TODO: Handle errors
    try {
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
    }   catch (error) {
        return {
            message: 'Database Error: Failed to create invoice',
        };
    }
    revalidatePath('/dashboard/invoices'); // Revalidate the invoices page to update the cache
    // we clear the cache so the data displayed in the invoices route will be cleared and trigger a new request to the server
    // now redirect user back to the invoices page
    redirect('/dashboard/invoices');
    // Test it out:
//   console.log(typeof rawFormData.amount);
//   console.log(rawFormData);

}


export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
   
    
    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to update invoice',
        };
    }
   
    revalidatePath('/dashboard/invoices'); // clear the client cache and make a new server request
    redirect('/dashboard/invoices'); // redirect user back to the invoices page
        // also redirect is called outside the try/catch block because redirect works by throwing an error
        // so if we call it inside the try/catch block, it will not work as expected, it would be caught by the catch block
  }


export async function deleteInvoice(id: string) {

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices'); // clear the client cache and make a new server request
            // this leads to re-rendering the table by fetching the data from the server
        // since this action is called when in the /dashboard/invoices path, we don't need to redirect the user
        return { message: 'Invoice deleted successfully' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to delete invoice',
        };
    }
}


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }