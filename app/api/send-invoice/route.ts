import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import redis from '../../../lib/redis';

export async function POST(req: Request) {
  try {
    const { name, email, amount, message, stakeOptIn } = await req.json();

    if (!name || !email || !amount) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Calculate stake if opted in, with a maximum of 40%
    const stakePercent = stakeOptIn ? Math.min((amount / 1000) * 1, 40) : 0;

    // Create invoice data
    const invoiceData = {
      name,
      email,
      amount,
      message,
      stakePercent,
    };

    // Save data to Redis
    const key = `invoice:${email}:${Date.now()}`;
    await redis.set(key, JSON.stringify(invoiceData));

    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your email password or app password
      },
    });

    // Define the email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Invoice from Bradcn`,
      text: `Hello ${name},\n\nThank you for your support! Here is your invoice:\n
      Amount: ${amount} Rs\n
      Stake Opt-in: ${stakeOptIn ? `Yes (${stakePercent}%)` : 'No'}\n
      Message: ${message}\n\n
      Best regards,\nBradcn Team`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Invoice sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Failed to send invoice' }, { status: 500 });
  }
}
