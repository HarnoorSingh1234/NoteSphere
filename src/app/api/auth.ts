import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export default function handler(req: NextRequest) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  return NextResponse.redirect(new URL(authUrl));
}