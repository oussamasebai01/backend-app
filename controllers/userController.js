import Users from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mailgun from "mailgun-js";
import crypto from "crypto";

// User register
export const adduser = async (req, res) => {
  const email = req.body.email;
  const existingUser = await Users.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already registered !!" });
  }
  const hashpassword = await bcrypt.hash(req.body.password, 10);
  const NewUser = new Users({
    firstName: req.body.firstName,
    lasttName: req.body.lastName,
    password: hashpassword,
    email: email,
    role: req.body.role,
  });
  await NewUser.save()
    .then(() => {
      //console.log("User registered successfully !");
      res.status(201).json({ message: "User registered successfully!" });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while registering the user!" });
    });
};
export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    console.log("hello from backend    :     ", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the current user" });
  }
};

// single User
export const profile = async (req, res) => {
  try {
    console.log("User ID from request:", req.user._id);
    const user = await Users.findOne({ _id: req.user._id });
    console.log(user);
    res.send({ array: user });
    console.log(user);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

// All User
export const getallUsers = async (req, res) => {
  await Users.find()
    .then((result) => {
      res.send({ array: result });
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
      res.Status(500).send();
    });
};

// User login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.KEY, {
      expiresIn: "1h",
    });
    const logedin = user.email;
    console.log(`${logedin} : logged in successfully!`);
    console.log(token);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
};

const MAILGUN_APIKEY = "967c656f6f06f9f2254c55e48cb6f38c-91fbbdba-10fd1f6d";
const DOMAIN = "sandboxefb8e456c9bb41bc8066ee6f3af9ff46.mailgun.org";
const otp = crypto.randomInt(1000, 9999).toString();
const mg = mailgun({ apiKey: MAILGUN_APIKEY, domain: DOMAIN });

export const sendMail = async (req, res) => {
  const data = {
    from: "medelyes.ab@gmail.com",
    to: "abidi.medelyes@gmail.com",
    subject: "Activate your account",
    html: `<h2>Your Code is </h2>
             <p>${otp}</p>`,
  };

  mg.messages().send(data, function (error, body) {
    if (error) {
      return res.json({
        error: error.message,
      });
    }
    return res.json({
      message: "Email sent successfully",
      body,
    });
  });
};

export const findUser = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await Users.findOne({ email: email });

    if (user) {
      const otp = crypto.randomInt(1000, 9999).toString();

      // Mettre à jour l'utilisateur avec l'OTP généré
      user.OTP = otp;
      await user.save();

      const data = {
        from: "First_Stock.project@elyes.tn",
        to: email,
        subject: "Reset Password",
        html: `<h2>Your Code is </h2>
                 <p><i>${otp}</i></p>`,
      };

      mg.messages().send(data, function (error, body) {
        if (error) {
          return res.json({
            error: error.message,
          });
        }
        return res.json({
          message: "Email sent successfully",
          body,
        });
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

export const verifyOtpAndUpdatePassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Rechercher l'utilisateur par email
    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Vérifier si l'OTP correspond
    if (user.OTP !== parseInt(otp, 10)) {
      return res.status(400).send({ message: "Invalid OTP" });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et supprimer l'OTP
    user.password = hashedPassword;
    user.otp = undefined; // Supprimez l'OTP après utilisation
    await user.save();

    return res.send({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.OTP !== parseInt(otp, 10)) {
      console.log(user.OTP);
      console.log(otp);
      return res.status(400).send({ message: "Invalid OTP" });
    }

    return res.send({ message: "OTP verified" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};
