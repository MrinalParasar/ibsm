import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/middleware/auth';
import { deleteFormSubmission } from '@/models/FormSubmission';

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
    const deleted = await deleteFormSubmission(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Submission deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete submission error:', error);
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    );
  }
}

