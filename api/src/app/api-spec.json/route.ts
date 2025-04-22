import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * GET /api-spec.json
 * Serves the Swagger/OpenAPI JSON specification file
 */
export async function GET(request: NextRequest) {
  try {
    // Path to the Swagger JSON file
    const filePath = path.join(process.cwd(), 'public', 'swagger.json');
    
    // Read the file
    const fileContents = await fs.promises.readFile(filePath, 'utf-8');
    
    // Parse the JSON to validate it
    const swaggerSpec = JSON.parse(fileContents);
    
    // Return the swagger spec as JSON
    return NextResponse.json(swaggerSpec);
  } catch (error) {
    console.error('Error serving Swagger JSON:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to load API specification',
        },
      },
      { status: 500 }
    );
  }
} 