import { NextRequest, NextResponse } from 'next/server';
import { createFormSubmission } from '@/models/FormSubmission';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formSource, name, email, phone, message, position, experience, cvUrl, cvFileName, agreedToTerms } = body;

    // Validate required fields
    if (!formSource || !name || !email) {
      return NextResponse.json(
        { error: 'Form source, name, and email are required' },
        { status: 400 }
      );
    }

    // Validate form source
    const validSources = ['hero-consultation', 'contact-page', 'career-application'];
    if (!validSources.includes(formSource)) {
      return NextResponse.json(
        { error: 'Invalid form source' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const submission = await createFormSubmission({
      formSource,
      name,
      email,
      phone,
      message,
      position,
      experience,
      cvUrl,
      cvFileName,
      agreedToTerms: agreedToTerms || false,
    });

    return NextResponse.json(
      { 
        message: 'Form submitted successfully',
        submission: {
          id: submission._id,
          formSource: submission.formSource,
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}

