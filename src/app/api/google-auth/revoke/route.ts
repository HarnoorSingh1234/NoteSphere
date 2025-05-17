import { NextResponse } from "next/server";
import { google } from 'googleapis';

/**
 * GET route to revoke Google OAuth tokens
 */
export async function GET() {
  try {
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    
    // Set credentials from environment variables
    const accessToken = process.env.GOOGLE_ACCESS_TOKEN;
    
    if (!accessToken) {
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Token Revocation Failed</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: system-ui, sans-serif;
              line-height: 1.5;
              padding: 2rem;
              max-width: 800px;
              margin: 0 auto;
            }
            .error {
              color: #e11d48;
            }
            .button {
              display: inline-block;
              background: #0070f3;
              color: white;
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              cursor: pointer;
              text-decoration: none;
              margin-top: 1rem;
            }
          </style>
        </head>
        <body>
          <h1>Token Revocation Failed</h1>
          <p class="error">No access token found in environment variables.</p>
          <a href="/admin/oauth" class="button">Back to OAuth Management</a>
        </body>
        </html>
        `,
        {
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }
    
    try {
      // Attempt to revoke the token
      await oauth2Client.revokeToken(accessToken);
      
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Token Revocation Successful</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: system-ui, sans-serif;
              line-height: 1.5;
              padding: 2rem;
              max-width: 800px;
              margin: 0 auto;
            }
            .success {
              color: #10b981;
            }
            .warning {
              color: #f59e0b;
              margin-top: 1rem;
            }
            .button {
              display: inline-block;
              background: #0070f3;
              color: white;
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              cursor: pointer;
              text-decoration: none;
              margin-top: 1rem;
            }
          </style>
        </head>
        <body>
          <h1>Token Revocation Successful</h1>
          <p class="success">Your Google OAuth tokens have been successfully revoked.</p>
          <div class="warning">
            <p><strong>Important:</strong> You need to manually remove the tokens from your .env file:</p>
            <pre>
GOOGLE_ACCESS_TOKEN="remove-this-token"
GOOGLE_REFRESH_TOKEN="remove-this-token"
            </pre>
          </div>
          <a href="/admin/oauth" class="button">Back to OAuth Management</a>
        </body>
        </html>
        `,
        {
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    } catch (revokeError) {
      console.error('Error revoking token:', revokeError);
      
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Token Revocation Error</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: system-ui, sans-serif;
              line-height: 1.5;
              padding: 2rem;
              max-width: 800px;
              margin: 0 auto;
            }
            .error {
              color: #e11d48;
            }
            .button {
              display: inline-block;
              background: #0070f3;
              color: white;
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              cursor: pointer;
              text-decoration: none;
              margin-top: 1rem;
            }
          </style>
        </head>
        <body>
          <h1>Token Revocation Error</h1>
          <p class="error">Failed to revoke token: ${(revokeError as Error).message}</p>
          <a href="/admin/oauth" class="button">Back to OAuth Management</a>
        </body>
        </html>
        `,
        {
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }
  } catch (error) {
    console.error('Error in revoke route:', error);
    return NextResponse.json(
      { error: 'Failed to revoke tokens' },
      { status: 500 }
    );
  }
}
