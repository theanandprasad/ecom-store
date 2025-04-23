# Plan for Copying Static JSON Data to SQLite Database

## Overview
This plan outlines the process of setting up a SQLite database within the Vercel deployment directory to make the static JSON mock data writable. The SQLite database will be initialized from the existing JSON data and will be maintained within the deployment directory.

## Steps

### 1. Setup SQLite Dependencies
- Add `sqlite3` and `better-sqlite3` packages to the project
- Update `package.json` dependencies
- Install dependencies using `npm install`

### 2. Create Database Structure
- Create a `db` directory in the project root to store the SQLite database file
- Add the SQLite database file to `.gitignore` but ensure the directory is committed
- Create a database schema based on the existing JSON data structure
- Design tables that match the JSON data models (products, customers, orders, etc.)

### 3. Database Initialization Script
- Create a script to initialize the database when the application first deploys
- The script will:
  - Check if the database already exists
  - If not, create the database and necessary tables
  - Load data from the static JSON files into the corresponding tables
  - Set up appropriate indexes for efficient querying

### 4. Data Source Switch Implementation
- Create a configuration system with a data source toggle flag
- Implementation options:
  - Environment variable (e.g., `USE_SQLITE_DB=true/false`)
  - Configuration file with a toggle setting
  - Feature flag in the application settings
- Create a data access layer that switches between data sources based on the flag:
  - When flag is OFF: read directly from JSON files (original behavior)
  - When flag is ON: read/write to SQLite database
- Ensure all API handlers use this data access layer instead of direct data access
- Add ability to reset the database to original JSON state when needed

### 5. Migration Strategy
- Create a version control system for the database schema
- Implement a simple migration system to handle schema changes
- Ensure migrations run automatically when the application deploys

### 6. Database Utilities
- Create utility functions for common database operations:
  - Connection management
  - CRUD operations for each data type
  - Transaction handling
  - Error handling and logging

### 7. API Integration
- Update existing API routes to use the data access layer with the toggle capability
- Implement proper error handling for database operations
- Ensure all write operations are properly validated
- Add endpoints to:
  - Check current data source status
  - Toggle data source at runtime (if needed)
  - Reinitialize database from JSON if corrupted

### 8. Deployment Considerations
- Ensure the SQLite database file is stored in a location accessible by the Vercel serverless functions
- Configure the database path to use `/tmp` for the Vercel environment
- Implement a database initialization check on application startup

### 9. Testing
- Create tests for database operations
- Test data source switching functionality
- Verify data consistency when switching between sources
- Test database initialization process
- Test data integrity after migration from JSON

### 10. Backup Strategy
- Implement a periodic backup mechanism for the database
- Consider exporting data back to JSON for versioning purposes

## Technical Considerations
- SQLite is suitable for this use case because:
  - It's file-based and requires no separate server
  - It works within the Vercel deployment constraints
  - It's lightweight and fast for small to medium datasets
  - It supports concurrent reads but may have limitations with concurrent writes

- The database file will be stored in the `/tmp` directory in the Vercel environment, which has certain limitations:
  - Content in `/tmp` may not persist across function invocations
  - The size is limited to 512MB per Vercel instance
  - Data will be lost on deployment or when scaling occurs

- Data source switching has these benefits:
  - Allows easy rollback to known-good static data
  - Simplifies development and testing
  - Provides a fallback mechanism if database becomes corrupted
  - Enables gradual migration to database-backed storage

## Next Steps
After implementing this basic solution, consider future enhancements:
- Evaluate if a more robust database solution is needed based on usage patterns
- Consider implementing a caching layer for frequently accessed data
- Explore options for persistent storage if the data becomes more critical
- Develop a more sophisticated feature flag system for granular control of data sources 