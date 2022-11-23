const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const ejs = require("ejs");

const {
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GOOGLE_SENDER_EMAIL,
} = process.env;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
module.exports = {
  sendEmail: async (dataEmail) => {
    return new Promise(async (resolve, reject) => {
      try {
        const accessToken = await oauth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: GOOGLE_SENDER_EMAIL,
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            refreshToken: GOOGLE_REFRESH_TOKEN,
            accessToken: accessToken,
          },
        });

        const response = await transport.sendMail(dataEmail);

        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },
};
