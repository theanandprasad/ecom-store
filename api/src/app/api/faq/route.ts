import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { paginatedResponse, successResponse, errorResponse } from '@/utils/api-utils';
import { FAQ } from '@/types';

/**
 * GET /api/faq
 * Fetch all FAQ items with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Get all FAQ items
    const faqs = await DataService.getFAQs();
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
    // Apply filters
    let filteredFaqs = faqs;
    
    // Filter by category if provided
    if (category) {
      filteredFaqs = filteredFaqs.filter(
        faq => faq.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Search in question and answer if search is provided
    if (search) {
      const searchLower = search.toLowerCase();
      filteredFaqs = filteredFaqs.filter(
        faq => 
          faq.question.toLowerCase().includes(searchLower) ||
          faq.answer.toLowerCase().includes(searchLower)
      );
    }
    
    // Calculate pagination
    const total = filteredFaqs.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedFaqs = filteredFaqs.slice(startIndex, endIndex);
    
    // Return paginated results
    return paginatedResponse(paginatedFaqs, total, page, limit);
    
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while fetching FAQs'
    );
  }
} 