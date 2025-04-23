/**
 * Admin endpoint to toggle between NeDB and static JSON data sources
 * POST - Toggle the data source
 */
import { NextRequest, NextResponse } from 'next/server';
import { getConfig, useNeDb } from '@/lib/config';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Toggle between NeDB and static JSON data sources
 */
export async function POST(request: NextRequest) {
  try {
    // Only allow this in development mode for security
    if (process.env.NODE_ENV === 'production' && !request.headers.get('x-admin-key')) {
      return NextResponse.json(
        { error: 'Unauthorized. This endpoint is only available in development mode or with an admin key.' },
        { status: 401 }
      );
    }
    
    // Get current state
    const currentState = useNeDb();
    const newState = !currentState;
    
    // Update .env.local file
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace or add the USE_NEDB line
    if (envContent.includes('USE_NEDB=')) {
      envContent = envContent.replace(/USE_NEDB=(true|false)/, `USE_NEDB=${newState}`);
    } else {
      envContent += `\nUSE_NEDB=${newState}`;
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(envPath, envContent);
    
    // Update process.env for the current process
    process.env.USE_NEDB = String(newState);
    
    // If toggling to NeDB mode, reset and initialize the database
    if (newState) {
      try {
        // Reset database directory first
        const dbDir = path.join(process.cwd(), 'db');
        if (fs.existsSync(dbDir)) {
          // Remove all .db files
          const files = fs.readdirSync(dbDir).filter(f => f.endsWith('.db'));
          for (const file of files) {
            fs.unlinkSync(path.join(dbDir, file));
          }
          console.log(`Cleaned up ${files.length} database files.`);
        } else {
          // Create the directory if it doesn't exist
          fs.mkdirSync(dbDir, { recursive: true });
          console.log('Created database directory.');
        }
        
        // Now initialize collections with the fixed initialization logic
        const { initializeAllCollections } = await import('@/lib/db/setup');
        await initializeAllCollections();
        console.log('Database initialized successfully.');
      } catch (error) {
        console.error('Error initializing database:', error);
        // Continue anyway - we want to toggle the mode even if initialization fails
      }
    }
    
    return NextResponse.json({
      success: true,
      previousState: currentState,
      currentState: newState,
      message: `Data source switched to ${newState ? 'NeDB' : 'static JSON'}`,
      mode: newState ? 'write' : 'read-only'
    });
  } catch (error) {
    console.error('Error toggling database mode:', error);
    
    return NextResponse.json(
      { error: 'Failed to toggle database mode' },
      { status: 500 }
    );
  }
}

/**
 * Get current database status
 */
export async function GET() {
  try {
    const isNeDbEnabled = useNeDb();
    const dbPath = getConfig('DB_PATH');
    
    let dbStats = null;
    
    // If NeDB is enabled, get stats about the database
    if (isNeDbEnabled) {
      try {
        const dbDir = path.resolve(process.cwd(), dbPath);
        if (fs.existsSync(dbDir)) {
          const files = fs.readdirSync(dbDir);
          const dbFiles = files.filter(f => f.endsWith('.db'));
          
          // Get stats about each file
          const fileStats = dbFiles.map(file => {
            const filePath = path.join(dbDir, file);
            const stats = fs.statSync(filePath);
            return {
              name: file,
              collection: file.replace('.db', ''),
              size: stats.size,
              modified: stats.mtime
            };
          });
          
          dbStats = {
            files: dbFiles.length,
            fileDetails: fileStats,
            directory: dbDir
          };
        }
      } catch (err) {
        dbStats = { error: 'Could not read database directory' };
      }
    }
    
    return NextResponse.json({
      dataSource: isNeDbEnabled ? 'NeDB' : 'Static JSON',
      mode: isNeDbEnabled ? 'read-write' : 'read-only',
      dbPath: isNeDbEnabled ? dbPath : null,
      dbStats
    });
  } catch (error) {
    console.error('Error getting database status:', error);
    
    return NextResponse.json(
      { error: 'Failed to get database status' },
      { status: 500 }
    );
  }
} 