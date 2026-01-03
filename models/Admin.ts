import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export interface AdminUser {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function createAdminUser(email: string, password: string, name: string): Promise<AdminUser> {
  const client = await clientPromise;
  const db = client.db();
  
  // Check if user already exists
  const existingUser = await db.collection('admins').findOne({ email });
  if (existingUser) {
    throw new Error('Admin user with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const adminUser: AdminUser = {
    email,
    password: hashedPassword,
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection('admins').insertOne(adminUser);
  adminUser._id = result.insertedId;

  return adminUser;
}

export async function findAdminByEmail(email: string): Promise<AdminUser | null> {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('admins').findOne({ email }) as AdminUser | null;
}

export async function verifyAdminPassword(admin: AdminUser, password: string): Promise<boolean> {
  return await bcrypt.compare(password, admin.password);
}

