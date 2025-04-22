import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * GET /api/docs
 * Serves Swagger UI HTML for API documentation
 */
export async function GET(request: NextRequest) {
  try {
    const swaggerHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>E-Commerce Store API Documentation</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
      <style>
        body {
          margin: 0;
          padding: 0;
        }
        .topbar {
          display: none;
        }
        .swagger-ui .info .title {
          font-size: 2.5em;
        }
        .header-wrapper {
          background-color: #222;
          color: white;
          padding: 15px 0;
          text-align: center;
        }
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-content h1 {
          margin: 0;
        }
        .home-link {
          color: white;
          text-decoration: none;
        }
        .home-link:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="header-wrapper">
        <div class="header-content">
          <h1>E-Commerce Store API</h1>
          <a href="/" class="home-link">Back to Home</a>
        </div>
      </div>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
      <script>
        window.onload = function() {
          const ui = SwaggerUIBundle({
            url: "/api-spec.json",
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIBundle.SwaggerUIStandalonePreset
            ],
            layout: "BaseLayout",
            supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
            requestInterceptor: (req) => {
              // Add basic auth header if not present
              if (!req.headers.Authorization) {
                const credentials = 'admin:admin123';
                const encodedCredentials = btoa(credentials);
                req.headers.Authorization = 'Basic ' + encodedCredentials;
              }
              return req;
            }
          });
          
          // Add basic auth by default to the Swagger UI
          ui.authActions.authorize({
            basicAuth: {
              username: 'admin',
              password: 'admin123'
            }
          });
        }
      </script>
    </body>
    </html>
    `;

    return new NextResponse(swaggerHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error serving Swagger UI:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to load API documentation',
        },
      },
      { status: 500 }
    );
  }
} 