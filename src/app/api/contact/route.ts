import { NextResponse } from 'next/server';
import { notifyContactForm } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    await notifyContactForm({
      name: name.trim(),
      email: email.trim(),
      subject: typeof subject === 'string' ? subject.trim() : '',
      message: message.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /contact] Error:', err);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
