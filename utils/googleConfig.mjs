import { google } from "googleapis";
// import { oauth2 } from "googleapis/build/src/apis/oauth2";

const GOOGLE_CLIENT_ID = '920172231947-cgd5ag6uhejni3uauvr0c3okg9e6bjt3.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

export const oauth2client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'postmessage'
)