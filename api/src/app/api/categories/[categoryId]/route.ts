/**
 * Category API endpoint
 * GET - Get a single category by ID
 * PUT - Update a category (when NeDB is enabled)
 * DELETE - Delete a category (when NeDB is enabled)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCategoryById, updateCategory, deleteCategory } from '@/lib/unified-data-service';
import { useNeDb } from '@/lib/config';

interface RouteParams {
  params: {
    categoryId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { categoryId } = params;
    
    // Get category
    const category = await getCategoryById(categoryId);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check if NeDB is enabled
    if (!useNeDb()) {
      return NextResponse.json(
        { error: 'Write operations not enabled. Enable NeDB mode to update categories.' },
        { status: 400 }
      );
    }
    
    const { categoryId } = params;
    
    // Get category to update
    const existingCategory = await getCategoryById(categoryId);
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Parse request body
    const updateData = await request.json();
    
    // Update category
    const updatedCategory = await updateCategory(categoryId, updateData);
    
    return NextResponse.json({ category: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    
    // Handle specific errors
    if (error instanceof Error && error.message === 'Cannot write to static JSON files') {
      return NextResponse.json(
        { error: 'Write operations not enabled. Enable NeDB mode to update categories.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check if NeDB is enabled
    if (!useNeDb()) {
      return NextResponse.json(
        { error: 'Write operations not enabled. Enable NeDB mode to delete categories.' },
        { status: 400 }
      );
    }
    
    const { categoryId } = params;
    
    // Get category to delete
    const existingCategory = await getCategoryById(categoryId);
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Delete category
    const result = await deleteCategory(categoryId);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to delete category' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting category:', error);
    
    // Handle specific errors
    if (error instanceof Error && error.message === 'Cannot write to static JSON files') {
      return NextResponse.json(
        { error: 'Write operations not enabled. Enable NeDB mode to delete categories.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 