import redis from '../../../lib/redis'; // Ensure this path is correct based on your project structure

export async function GET(req: Request) {
  try {
    // Retrieve all keys matching 'invoice:*'
    const keys = await redis.keys('invoice:*');
    const invoices = await Promise.all(
      keys.map(async (key) => {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null; // Handle case where data might be null
      })
    );

    // Filter out any null values (if parsing failed)
    const filteredInvoices = invoices.filter((invoice) => invoice !== null);
    
    return new Response(JSON.stringify(filteredInvoices), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch invoices' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req: Request) {
  const { email } = await req.json();

  if (!email || typeof email !== 'string') {
    return new Response(JSON.stringify({ error: 'Valid email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = await redis.del(`invoice:${email}`);

    if (result === 0) {
      return new Response(JSON.stringify({ error: 'Invoice not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Invoice deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete invoice' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
