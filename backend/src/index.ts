import express from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import cors from "cors";
import querystring from "querystring";
import cookieParser from "cookie-parser";
import models from "../database/models";
import {
  SERVER_ROOT_URI,
  GOOGLE_CLIENT_ID,
  JWT_SECRET,
  GOOGLE_CLIENT_SECRET,
  COOKIE_NAME,
  UI_ROOT_URI,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
} from "./config";
import dayjs from "dayjs";
const { user } = models;
const port = 4000;

const app = express();

app.use(
  cors({
    // Sets Access-Control-Allow-Origin to the UI URI
    origin: UI_ROOT_URI,
    // Sets Access-Control-Allow-Credentials to true
    credentials: true,
  })
);

app.use(cookieParser());

const redirectURIGoogle = "auth/google";
const redirectURIFacebook = "auth/facebook";
function getFacebookAuthURL() {
  const rootUrl = "https://www.facebook.com/v10.0/dialog/oauth";
  const options = {
    redirect_uri: `${SERVER_ROOT_URI}/${redirectURIFacebook}`,
    client_id: FACEBOOK_CLIENT_ID,
    state: "{st=state123abc,ds=123456789}",
    scope: "email,public_profile",
  };
  console.log(`${rootUrl}?${querystring.stringify(options)}`);
  return `${rootUrl}?${querystring.stringify(options)}`;
}
function getGoogleAuthURL() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${SERVER_ROOT_URI}/${redirectURIGoogle}`,
    client_id: GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    display: "popup",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  return `${rootUrl}?${querystring.stringify(options)}`;
}

// Getting login URL
app.get("/auth/google/url", (req, res) => {
  return res.send(getGoogleAuthURL());
});
app.get("/auth/facebook/url", (req, res) => {
  console.log(getFacebookAuthURL());
  return res.send(getFacebookAuthURL());
});
function getTokens({
  type,
  code,
  clientId,
  clientSecret,
  redirectURIGoogle,
}: {
  type: string;
  code: string;
  clientId: string;
  clientSecret: string;
  redirectURIGoogle: string;
}): Promise<{
  access_token: string;
  token_type?: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token?: string;
  email?: string;
  user_profile?: string;
}> {
  /*
   * Uses the code to get tokens
   * that can be used to fetch the user's profile
   */
  console.log(code);
  if (type === "google") {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectURIGoogle,
      grant_type: "authorization_code",
    };

    return axios
      .post(url, querystring.stringify(values), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch auth tokens`);
        throw new Error(error.message);
      });
  } else {
    const url =
      "https://graph.facebook.com/v10.0/oauth/access_token?" +
      `client_id=${FACEBOOK_CLIENT_ID}&` +
      `client_secret=${FACEBOOK_CLIENT_SECRET}&` +
      `redirect_uri=${encodeURIComponent(
        "http://localhost:4000/auth/facebook"
      )}&` +
      `code=${encodeURIComponent(code)}`;
    return axios
      .get(url)
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch auth tokens`);
        throw new Error(error.message);
      });
  }
}
app.get(`/${redirectURIFacebook}`, async (req, res) => {
  const code = req.query.code as string;
  const { email, user_profile, access_token, token_type, expires_in } =
    await getTokens({
      type: "facebook",
      code,
      clientId: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      redirectURIGoogle: "http://localhost:4000/auth/facebook",
    });
  const data = await axios
    .get(
      `https://graph.facebook.com/v10.0/me?fields=id%2Cname%2Cemail%2Cfirst_name%2Clast_name%2Cpicture&access_token=${encodeURIComponent(
        access_token
      )}`
    )
    .then((res) => res.data);
  console.log(data);
  const token = jwt.sign(data, JWT_SECRET);

  res.cookie(COOKIE_NAME, token, {
    maxAge: 900000,
    httpOnly: true,
    sameSite: false,
    secure: true,
  });
  let users = [data].map(
    (i: {
      id: string;
      email: string;
      name: string;
      first_name: string;
      last_name: string;
      picture: any;
    }) => {
      return {
        id: i.id,
        email: i.email,
        name: i.name,
        first_name: i.first_name,
        last_name: i.last_name,
        picture: {
          link: i.picture.data.url,
        },
      };
    }
  );
  user.create(users[0]);
  res.redirect(UI_ROOT_URI);
});
// Getting the user from Google with the code
app.get(`/${redirectURIGoogle}`, async (req, res) => {
  const code = req.query.code as string;

  const { id_token, access_token } = await getTokens({
    type: "google",
    code,
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectURIGoogle: `${SERVER_ROOT_URI}/${redirectURIGoogle}`,
  });

  // Fetch the user's profile with the access token and bearer
  const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch user`);
      throw new Error(error.message);
    });
  const token = jwt.sign(googleUser, JWT_SECRET);
  res.cookie(COOKIE_NAME, token, {
    maxAge: dayjs().add(1, "month").valueOf(),
    httpOnly: true,
    secure: false,
  });
  let users = [googleUser].map(
    (i: {
      id: string;
      email: string;
      name: string;
      given_name: string;
      family_name: string;
      picture: any;
    }) => {
      return {
        id: i.id,
        email: i.email,
        name: i.name,
        first_name: i.given_name,
        last_name: i.family_name,
        picture: {
          link: i.picture,
        },
      };
    }
  );
  user.create(users[0]);
  console.log(Array.isArray(users));

  res.redirect(UI_ROOT_URI);
});

// Getting the current user
app.get("/auth/me", (req, res) => {
  console.log("get me");
  try {
    const decoded = jwt.verify(req.cookies[COOKIE_NAME], JWT_SECRET);
    console.log("decoded", decoded);
    return res.send(decoded);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
});

function main() {
  app.listen(port, () => {
    console.log(`App listening http://localhost:${port}`);
  });
}

main();
