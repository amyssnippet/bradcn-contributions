import { useState, useEffect } from 'react';

interface Invoice {
  name: string;
  email: string;
  amount: number;
  stakePercent: number;
}

const Data = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const response = await fetch('/api/invoices');
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setError('Failed to load invoices.');
      }
    }

    fetchInvoices();
  }, []);

  const handleDelete = async (email: string) => {
    try {
      const response = await fetch('/api/invoices', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete invoice');
      }

      // Remove the deleted invoice from state
      setInvoices((prev) => prev.filter((invoice) => invoice.email !== email));
    } catch (error) {
      console.error('Error deleting invoice:', error);
      setError('Failed to delete invoice.');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-indigo-600 mb-4">Stored Invoices</h1>
      {error && <p className="text-red-500">{error}</p>}
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-indigo-200 text-gray-700">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Amount (Rs)</th>
              <th className="p-2 border">Stake (%)</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={index} className="text-center border-t">
                <td className="p-2 border">{invoice.name}</td>
                <td className="p-2 border">{invoice.email}</td>
                <td className="p-2 border">{invoice.amount}</td>
                <td className="p-2 border">{invoice.stakePercent}</td>
                <td className="p-2 border">
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(invoice.email)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Data;
