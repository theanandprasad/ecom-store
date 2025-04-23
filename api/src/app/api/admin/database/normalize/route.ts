/**
 * Admin endpoint to normalize database structure
 * POST - Normalize all collections to use individual documents
 */
import { NextRequest, NextResponse } from 'next/server';
import { useNeDb } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    // Only allow this in development mode for security
    if (process.env.NODE_ENV === 'production' && !request.headers.get('x-admin-key')) {
      return NextResponse.json(
        { error: 'Unauthorized. This endpoint is only available in development mode or with an admin key.' },
        { status: 401 }
      );
    }
    
    // Check if NeDB is enabled
    if (!useNeDb()) {
      return NextResponse.json(
        { error: 'Database normalization is only available when NeDB mode is enabled.' },
        { status: 400 }
      );
    }
    
    // Run the normalization - dynamically import to avoid Edge Runtime issues
    const { normalizeAllCollections } = await import('@/lib/db/migrate');
    await normalizeAllCollections();
    
    return NextResponse.json({
      success: true,
      message: 'Database structure normalized successfully.'
    });
  } catch (error) {
    console.error('Error normalizing database structure:', error);
    
    return NextResponse.json(
      { error: 'Failed to normalize database structure' },
      { status: 500 }
    );
  }
} 