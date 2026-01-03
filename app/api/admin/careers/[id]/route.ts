import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/middleware/auth';
import { getCareerById, updateCareer, deleteCareer } from '@/models/Career';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await authenticateAdmin(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const career = await getCareerById(id);
    if (!career) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ career }, { status: 200 });
  } catch (error: any) {
    console.error('Get career error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch career' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await authenticateAdmin(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { title, location, type, description, requirements } = body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (location) updateData.location = location;
    if (type) updateData.type = type;
    if (description) updateData.description = description;
    if (requirements) {
      if (!Array.isArray(requirements)) {
        return NextResponse.json(
          { error: 'Requirements must be an array' },
          { status: 400 }
        );
      }
      updateData.requirements = requirements;
    }

    const career = await updateCareer(id, updateData);
    if (!career) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Career updated successfully', career },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update career error:', error);
    return NextResponse.json(
      { error: 'Failed to update career' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await authenticateAdmin(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deleted = await deleteCareer(id);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Career deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete career error:', error);
    return NextResponse.json(
      { error: 'Failed to delete career' },
      { status: 500 }
    );
  }
}

