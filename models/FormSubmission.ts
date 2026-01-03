import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export type FormSource = 'hero-consultation' | 'contact-page' | 'career-application';

export interface FormSubmission {
  _id: string;
  formSource: FormSource;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  position?: string;
  experience?: string;
  cvUrl?: string;
  cvFileName?: string;
  agreedToTerms?: boolean;
  createdAt: Date;
}

export interface FormSubmissionStats {
  total: number;
  bySource: {
    source: FormSource;
    count: number;
  }[];
}

export async function createFormSubmission(
  submissionData: Omit<FormSubmission, '_id' | 'createdAt'>
): Promise<FormSubmission> {
  const client = await clientPromise;
  const db = client.db();
  
  const submission = {
    ...submissionData,
    createdAt: new Date(),
  };

  const result = await db.collection('form_submissions').insertOne(submission);
  return {
    ...submission,
    _id: result.insertedId.toString(),
  } as FormSubmission;
}

export async function getAllFormSubmissions(
  source?: FormSource
): Promise<FormSubmission[]> {
  const client = await clientPromise;
  const db = client.db();
  
  const query = source ? { formSource: source } : {};
  const submissions = await db.collection('form_submissions')
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();
  
  return submissions.map(sub => ({
    ...sub,
    _id: sub._id.toString(),
    createdAt: sub.createdAt,
  })) as FormSubmission[];
}

export async function getFormSubmissionStats(): Promise<FormSubmissionStats> {
  const client = await clientPromise;
  const db = client.db();
  
  const total = await db.collection('form_submissions').countDocuments();
  
  const bySource = await db.collection('form_submissions').aggregate([
    {
      $group: {
        _id: '$formSource',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]).toArray();
  
  return {
    total,
    bySource: bySource.map(item => ({
      source: item._id as FormSource,
      count: item.count,
    })),
  };
}

export async function deleteFormSubmission(id: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();
  
  const result = await db.collection('form_submissions').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

