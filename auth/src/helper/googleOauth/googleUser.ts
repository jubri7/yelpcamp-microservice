import { google } from "googleapis";
import axios from "axios";
import { generateError } from "../generateError";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https:///sales.dev/api/users/"
);

export const getGoogleUser = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);

  const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.id_token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      throw new Error(JSON.stringify([generateError(500, error.message)]));
    });

  return googleUser;
};
