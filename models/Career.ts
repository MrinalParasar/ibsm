import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export interface Career {
  _id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllCareers(): Promise<Career[]> {
  const client = await clientPromise;
  const db = client.db();
  const careers = await db.collection('careers').find({}).sort({ createdAt: -1 }).toArray();
  return careers.map(career => ({
    ...career,
    _id: career._id.toString(),
  })) as Career[];
}

export interface PaginatedCareersResult {
  careers: Career[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getCareersPaginated(
  page: number = 1,
  limit: number = 9
): Promise<PaginatedCareersResult> {
  const client = await clientPromise;
  const db = client.db();
  
  const skip = (page - 1) * limit;
  const total = await db.collection('careers').countDocuments();
  const totalPages = Math.ceil(total / limit);
  
  const careers = await db.collection('careers')
    .find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  
  return {
    careers: careers.map(career => ({
      ...career,
      _id: career._id.toString(),
    })) as Career[],
    total,
    page,
    limit,
    totalPages,
  };
}

export async function getCareerById(id: string): Promise<Career | null> {
  const client = await clientPromise;
  const db = client.db();
  const career = await db.collection('careers').findOne({ _id: new ObjectId(id) });
  if (!career) return null;
  return {
    ...career,
    _id: career._id.toString(),
  } as Career;
}

export async function createCareer(careerData: Omit<Career, '_id' | 'createdAt' | 'updatedAt'>): Promise<Career> {
  const client = await clientPromise;
  const db = client.db();
  
  const careerToInsert = {
    ...careerData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection('careers').insertOne(careerToInsert);
  return {
    ...careerToInsert,
    _id: result.insertedId.toString(),
  } as Career;
}

export async function updateCareer(id: string, careerData: Partial<Omit<Career, '_id' | 'createdAt'>>): Promise<Career | null> {
  const client = await clientPromise;
  const db = client.db();
  
  const updateData = {
    ...careerData,
    updatedAt: new Date(),
  };

  const result = await db.collection('careers').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  if (!result) return null;
  return {
    ...result,
    _id: result._id.toString(),
  } as Career;
}

export async function deleteCareer(id: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();
  
  const result = await db.collection('careers').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

export async function initializeDefaultCareers(): Promise<void> {
  const client = await clientPromise;
  const db = client.db();
  
  const defaultCareers: Omit<Career, '_id' | 'createdAt' | 'updatedAt'>[] = [
    {
      title: "Security Guard (Unarmed)",
      location: "Ghaziabad / Delhi NCR",
      type: "Full Time",
      description: "Responsible for monitoring premises and personnel. Patrolling, monitoring surveillance equipment, and inspecting buildings.",
      requirements: [
        "High school diploma or equivalent",
        "Physical fitness",
        "Good communication skills",
      ],
    },
    {
      title: "Armed Security Officer",
      location: "Noida / Gurugram",
      type: "Full Time",
      description: "Provide high-level security for high-value assets and VIPs. Requires valid arms license and extensive experience.",
      requirements: [
        "Valid Arms License",
        "Ex-Servicemen preferred",
        "5+ years experience",
      ],
    },
    {
      title: "Security Supervisor",
      location: "Ghaziabad",
      type: "Full Time",
      description: "Supervise a team of security guards, conduct orientation, and ensure all security protocols are followed strictly.",
      requirements: [
        "Leadership skills",
        "Previous supervisory experience",
        "Conflict resolution skills",
      ],
    },
    {
      title: "Event Bouncer",
      location: "Delhi NCR",
      type: "Part Time / Contract",
      description: "Managing crowd control and ensuring safety at high-profile events, clubs, and private functions.",
      requirements: [
        "Height: 5'10\"+",
        "Strong build",
        "Experience in crowd management",
      ],
    },
    {
      title: "Housekeeping Staff",
      location: "Noida",
      type: "Full Time",
      description: "Perform cleaning and maintenance duties to ensure premises are kept clean and in orderly condition.",
      requirements: ["Punctuality", "Hardworking", "Attention to detail"],
    },
  ];

  // Check if careers already exist
  const existingCount = await db.collection('careers').countDocuments();
  if (existingCount === 0) {
    await db.collection('careers').insertMany(
      defaultCareers.map(career => ({
        ...career,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
  }
}

