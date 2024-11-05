"use client";

import { useState } from 'react';

export default function Dashboard() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [stakeOptIn, setStakeOptIn] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          amount: Number(amount), // Convert to number
          message,
          stakeOptIn,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send invoice');
      }

      const data = await response.json();
      setSuccess(data.message);
      // Clear the form after successful submission
      setName('');
      setEmail('');
      setAmount('');
      setMessage('');
      setStakeOptIn(false);
    } catch (error) {
      console.error(error);
      setSuccess('Failed to send invoice. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-indigo-600 mb-6">Dashboard - Send Invoice</h1>
        {success && <p className="text-center text-green-600 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-900">
          <div>
            <label htmlFor="name" className="block font-medium">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block font-medium">Amount (Rs):</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={stakeOptIn}
              onChange={() => setStakeOptIn(!stakeOptIn)}
              className="mr-2 focus:ring-indigo-500"
            />
            <label className="font-medium">Opt-in for Stake (1% per 1000 Rs)</label>
          </div>
          <div>
            <label htmlFor="message" className="block font-medium">Message:</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Send Invoice
          </button>
        </form>
      </div>
    </div>
  );
}
