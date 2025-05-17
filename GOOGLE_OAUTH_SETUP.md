# Setting Up Google Drive OAuth Tokens for NoteSphere

This document explains how to obtain and set up OAuth tokens for NoteSphere's centralized Google Drive integration.

## Prerequisites

1. Google Cloud project with Drive API enabled
2. OAuth client credentials (client ID and client secret)
3. Admin access to NoteSphere application

## Initial Configuration

Make sure your `.env` file contains your Google OAuth client credentials:

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
REDIRECT_URI=http://localhost:3000/api/oauth2callback
GOOGLE_DRIVE_FOLDER_NAME="NoteSphere Files"
```

## Built-in OAuth Flow (Recommended)

NoteSphere now includes a built-in OAuth management page:

1. Start your NoteSphere application
2. Log in as an administrator
3. Navigate to `/admin/oauth` in your browser
4. Click on "Connect to Google Drive" button
5. Complete the Google authentication process
6. After authorization, you'll receive the access and refresh tokens
7. Add these tokens to your `.env` file:

```
GOOGLE_ACCESS_TOKEN="your-access-token"
GOOGLE_REFRESH_TOKEN="your-refresh-token"
```

8. Restart the application for changes to take effect
9. Return to the `/admin/oauth` page to verify the connection status

## Important Notes

- The access token expires after an hour, but the application will use the refresh token to get a new access token when needed.
- The refresh token is long-lived but can be revoked if you change your Google account password or explicitly revoke access.
- For security, never commit these tokens to version control.

## Testing the Integration

After configuring OAuth:

1. Try uploading a file through the application
2. Check if the file appears in your Google Drive under the "NoteSphere Files" folder
3. Try downloading the file back through the application
4. Verify the file metadata is correctly stored in your database

## Token Management

### Token Expiration and Refresh

- Access tokens expire after one hour
- The application automatically uses the refresh token to get new access tokens
- The refresh token is long-lived but can be refreshed if you reconnect

### Revoking Tokens

If you need to revoke access:

1. Navigate to `/admin/oauth` in your browser
2. Click the "Revoke Tokens" button
3. Remove the tokens from your `.env` file

Alternatively, you can revoke access from your Google Account settings:
1. Go to https://myaccount.google.com/permissions
2. Find NoteSphere and click "Remove Access"

## Security Best Practices

- Store OAuth tokens securely in environment variables
- Never commit these tokens to version control
- Use appropriate file permissions for your `.env` file
- For production, consider using a secure vault or secret management service
- Regularly rotate your OAuth tokens, especially in production environments

## Troubleshooting

If you encounter connection issues:

1. Verify your client ID and secret are correct
2. Check that the Google Drive API is enabled in your Google Cloud project
3. Ensure your OAuth consent screen has the required scopes
4. Try revoking tokens and generating new ones
5. Check server logs for detailed error messages
