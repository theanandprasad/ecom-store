import { NextRequest } from 'next/server';
import DataService from '@/lib/data-service';
import { successResponse, errorResponse } from '@/utils/api-utils';
import { FAQ } from '@/types';

/**
 * GET /api/faq/lookup
 * Find the most relevant FAQ answer for a given query
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameter
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    // Validate the query parameter
    if (!query) {
      return errorResponse('VALIDATION_ERROR', 'query parameter is required');
    }
    
    // Get all FAQ items
    const faqs = await DataService.getFAQs();
    
    // Simple keyword matching for finding relevant FAQ
    // In a real implementation, this would use more sophisticated 
    // natural language processing or vector search
    const queryWords = query.toLowerCase().split(/\s+/);
    
    // Calculate relevance score for each FAQ
    const scoredFaqs = faqs.map(faq => {
      // Convert question and answer to lowercase
      const question = faq.question.toLowerCase();
      const answer = faq.answer.toLowerCase();
      
      // Count how many query words are found in the question and answer
      let score = 0;
      for (const word of queryWords) {
        if (word.length > 2) { // Ignore very short words
          // Direct match in question has higher weight
          if (question.includes(word)) {
            score += 2;
          }
          // Match in answer
          if (answer.includes(word)) {
            score += 1;
          }
        }
      }
      
      return { faq, score };
    });
    
    // Sort by score (descending)
    scoredFaqs.sort((a, b) => b.score - a.score);
    
    // Get the best match if score is above a threshold
    const bestMatch = scoredFaqs[0];
    if (bestMatch && bestMatch.score > 0) {
      // Calculate confidence based on score
      // This is a simple approach - in a real implementation, 
      // confidence would be calculated differently
      const maxPossibleScore = queryWords.length * 3; // Maximum possible score
      const confidence = Math.min(bestMatch.score / maxPossibleScore, 1);
      
      return successResponse({
        answer: bestMatch.faq.answer,
        confidence: parseFloat(confidence.toFixed(2)),
        source: `FAQ ${bestMatch.faq.id}`
      });
    }
    
    // If no good match found
    return successResponse({
      answer: "We couldn't find a specific answer to your question. Please contact our support team for assistance.",
      confidence: 0,
      source: "Default Response"
    });
    
  } catch (error) {
    console.error('Error performing FAQ lookup:', error);
    return errorResponse(
      'INTERNAL_SERVER_ERROR',
      'An error occurred while searching for FAQ answers'
    );
  }
} 