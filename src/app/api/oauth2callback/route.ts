import { NextResponse } from "next/server";
import { google } from 'googleapis';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * GET handler - OAuth2 callback to exchange code for tokens
 */
export async function GET(request: Request) {
  try {
    // Get the URL and extract the authorization code
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return NextResponse.redirect(new URL('/admin/oauth?error=no-code', request.url));
    }
    
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    
    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.access_token || !tokens.refresh_token) {
      return NextResponse.redirect(new URL('/admin/oauth?error=invalid-tokens', request.url));
    }
    
    // Optional: Make a test call to Drive API to verify the tokens work
    try {
      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      await drive.about.get({ fields: 'user' });
    } catch (apiError) {
      console.error('Error validating tokens with Drive API:', apiError);
      // Continue anyway, as we'll still show the tokens
    }    // Create a page to display the tokens
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>NoteSphere - OAuth Tokens Generated</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: system-ui, sans-serif;
            line-height: 1.5;
            padding: 2rem;
            max-width: 800px;
            margin: 0 auto;
            color: #333;
            background-color: #f9fafb;
          }
          pre {
            background: #f5f5f5;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            border: 1px solid #e0e0e0;
          }
          .token-container {
            margin-bottom: 2rem;
            padding: 1rem;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #fafafa;
          }
          .copy-button {
            background: #0070f3;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
          }
          .copy-button:hover {
            background: #005aca;
          }
          .success {
            background: #10b981;
          }
          .steps {
            margin: 2rem 0;
            padding: 1.5rem;
            background: #f0f9ff;
            border-left: 4px solid #0070f3;
            border-radius: 4px;
          }
          .steps ol {
            margin-left: 1rem;
            padding-left: 1rem;
          }
          .steps li {
            margin-bottom: 0.5rem;
          }
          .header {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
          }
          .logo {
            font-size: 1.5rem;
            font-weight: bold;
            margin-right: 1rem;
            color: #0070f3;
          }
          .back-button {
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
        <div class="header">
          <div class="logo">NoteSphere</div>
          <h1>OAuth Tokens Generated</h1>
        </div>
        
        <div class="steps">
          <h3>Next Steps:</h3>
          <ol>
            <li>Copy the tokens below to your <code>.env</code> file</li>
            <li>Restart your application for the changes to take effect</li>
            <li>Your application will now be able to access Google Drive</li>
          </ol>
        </div>
        
        <div class="token-container">
          <h3>Access Token:</h3>
          <pre id="access-token">${tokens.access_token}</pre>
          <button class="copy-button" onclick="copyToken('access-token', this)">Copy Access Token</button>
        </div>
        
        <div class="token-container">
          <h3>Refresh Token:</h3>
          <pre id="refresh-token">${tokens.refresh_token}</pre>
          <button class="copy-button" onclick="copyToken('refresh-token', this)">Copy Refresh Token</button>
        </div>
        
        <div class="token-container">          <h3>Add to your .env file:</h3>
          <pre id="env-content">GOOGLE_ACCESS_TOKEN="${tokens.access_token}"
GOOGLE_REFRESH_TOKEN="${tokens.refresh_token}"</pre>
          <button class="copy-button" onclick="copyToken('env-content', this)">Copy Environment Variables</button>
        </div>
        
        <div class="token-container">
          <h3>Important Notes:</h3>
          <ul>
            <li>The access token will expire after an hour, but the application will use the refresh token to get new access tokens automatically.</li>
            <li>Keep your refresh token secure - anyone with this token can access your Google Drive with the granted permissions.</li>
            <li>If you deploy to a different environment, update the REDIRECT_URI and generate new tokens.</li>
            <li>After adding tokens to your .env file, restart your application for the changes to take effect.</li>
          </ul>
        </div>
        
        <a href="/admin/oauth" class="back-button">Back to OAuth Management</a>
        <script>
          function copyToken(elementId, buttonElement) {
            const element = document.getElementById(elementId);
            const text = element.textContent;
            
            navigator.clipboard.writeText(text).then(() => {
              buttonElement.textContent = 'Copied!';
              buttonElement.classList.add('success');
              
              setTimeout(() => {
                buttonElement.textContent = 'Copy';
                buttonElement.classList.remove('success');
              }, 2000);
            });
          }
        </script>
      </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent((error as Error).message)}`, request.url));
  }
}