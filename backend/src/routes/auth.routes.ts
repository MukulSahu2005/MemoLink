import { Router } from 'express';
import { userModel } from '../models/user.model.js';
import jwt from "jsonwebtoken";

const router = Router();

// Placeholder OAuth endpoints for Google
// GET /api/v1/auth/google -> Redirects to Google OAuth consent page (not implemented)
// GET /api/v1/auth/google/callback -> Handles Google callback and issues session (not implemented)


// 1. Send user to google 
// sended to the google wuth my client id so that they know i had sended the request for checking 
router.get('/google',(req,res)=>{
  // const googleAuthUrl=`https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email`
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=https://memolink-js1f.onrender.com/api/v1/auth/google/callback&response_type=code&scope=profile email`;

  
  res.redirect(googleAuthUrl);
});

// 2. catch the user and send them back 
//  the google will return a random code wich my server dont know , so it will create a token 
// 
// router.get('/google/callback', async (req, res) => {
//   const { code } = req.query;

//   try {
//     // A. Exchange the code for an Access Token
//     const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       body: new URLSearchParams({
//         code: code as string,
//         client_id: process.env.GOOGLE_CLIENT_ID as string,
//         client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
//         redirect_uri: process.env.GOOGLE_REDIRECT_URI as string,
//         grant_type: 'authorization_code',
//       }),
//     });
  
//     const tokenData = await tokenResponse.json();

//     // B. Get the user info from Google
//     const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
//       headers: { Authorization: `Bearer ${tokenData.access_token}` },
//     });
//     const userData = await userResponse.json();
    
//     console.log("SUCCESS! Google says this is:", userData.email);

//     // --- C. THE NEW JWT & DATABASE LOGIC ---
    
//     // 1. Check if this person is already in your database by email (case-insensitive)
//     const email = userData.email.toLowerCase().trim();
//     let databaseUser = await userModel.findOne({ email });

//     // 1b. If not found by email, try matching by normalized username prefix
//     if (!databaseUser) {
//       const googlePrefix = email.split('@')[0].replace(/[^a-z0-9]/g, '');
//       const allUsers = await userModel.find({});
      
//       databaseUser = allUsers.find(u => {
//         const localNorm = u.username.toLowerCase().replace(/[^a-z0-9]/g, '');
//         return localNorm === googlePrefix;
//       }) || null;

//       if (databaseUser) {
//         console.log(`Linking Google OAuth email (${email}) to existing local user account: ${databaseUser.username}`);
//         databaseUser.email = email;
//         await databaseUser.save();
//       }
//     }

//     // 2. If they don't exist, create a new account for them instantly
//     if (!databaseUser) {
//       databaseUser = await userModel.create({
//         email: email,
//         username: email.split('@')[0], 
//         authProvider: 'google'
//       });
//     }

//     // 3. Generate your standard JWT (Here is the 7d!)
//     const memolinkToken = jwt.sign(
//       { _id: databaseUser._id, username: databaseUser.username }, 
//       process.env.JWT_SECRET as string, 
//       { expiresIn: '7d' } 
//     );

//     // 4. Redirect back to Vite, sending the REAL token and REAL user
//     // const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
//     const frontendUrl = "https://memo-link-sigma.vercel.app/dashboard"; 
//     const userString = encodeURIComponent(JSON.stringify(databaseUser));
    
//     res.redirect(`${frontendUrl}/dashboard?token=${memolinkToken}&user=${userString}`);

//   } 
//   catch(error) {
//     console.error("OAuth Error:", error);
//     res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/signin?error=oauth_failed`);
//   }
// });

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  const FRONTEND_URL = "https://memo-link-sigma.vercel.app"; // Absolute Fevicol

  try {
    // A. Exchange code for Token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code as string,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        redirect_uri: "https://memolink-js1f.onrender.com/api/v1/auth/google/callback",
        grant_type: 'authorization_code',
      }),
    });
  
    const tokenData = await tokenResponse.json();

    // 🚨 AIRBAG 1: Agar Google ne token dene me nakhre kiye, toh yahi dhar lo!
    if (tokenData.error) {
      console.error("❌ TOKEN EXCHANGE FAILED. Google says:", tokenData);
      return res.redirect(`${FRONTEND_URL}/signin?error=google_token_rejected`);
    }

    // B. Get User Info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userResponse.json();
    
    // 🚨 AIRBAG 2: Agar user object me 'email' miss hua, toh behosh mat hona!
    if (!userData || !userData.email) {
      console.error("❌ USERINFO FAILED. Google gave us this weird object:", JSON.stringify(userData));
      return res.redirect(`${FRONTEND_URL}/signin?error=no_email_scope`);
    }

    console.log("SUCCESS! Google gave us a legitimate email:", userData.email);

    // --- C. THE DATABASE LOGIC (Now 100% safe to use .toLowerCase) ---
    const email = userData.email.toLowerCase().trim();
    let databaseUser = await userModel.findOne({ email });

    if (!databaseUser) {
      const googlePrefix = email.split('@')[0].replace(/[^a-z0-9]/g, '');
      const allUsers = await userModel.find({});
      
      databaseUser = allUsers.find(u => {
        const localNorm = u.username.toLowerCase().replace(/[^a-z0-9]/g, '');
        return localNorm === googlePrefix;
      }) || null;

      if (databaseUser) {
        databaseUser.email = email;
        await databaseUser.save();
      }
    }

    if (!databaseUser) {
      databaseUser = await userModel.create({
        email: email,
        username: email.split('@')[0], 
        authProvider: 'google'
      });
    }

    const memolinkToken = jwt.sign(
      { _id: databaseUser._id, username: databaseUser.username }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: '7d' } 
    );

    const userString = encodeURIComponent(JSON.stringify(databaseUser));
    
    // Final kick to your real Vercel domain:
    res.redirect(`${FRONTEND_URL}/dashboard?token=${memolinkToken}&user=${userString}`);

  } catch(error) {
    console.error("❌ FATAL CATCH BLOCK ERROR:", error);
    res.redirect("https://memo-link-sigma.vercel.app/signin?error=server_exploded");
  }
});
export default router;
