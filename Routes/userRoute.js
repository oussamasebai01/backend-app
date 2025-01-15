import { Router } from "express";
import {
  adduser,
  getallUsers,
  login,
  getCurrentUser,
  sendMail,
  findUser,
  verifyOtpAndUpdatePassword,
  verifyOtp,
  profile,
} from "../controllers/userController.js";
import { isAuth, logout, userRole } from "../middlewares/isAuth.js";

const roleRoutes = () => {
  const router = Router();
  router.post("/registre", adduser);
  router.post("/login", login);
  router.get("/all_users", isAuth, userRole("admin"), getallUsers);
  router.get("/user", isAuth, getCurrentUser);
  router.get("/profile", isAuth, profile);
  router.post("/logout", logout);
  router.post("/sendmail", sendMail);
  router.post("/finduser", findUser);
  router.post("/verifyotp", verifyOtp);
  router.post("/updatepassword", verifyOtpAndUpdatePassword);

  return router;
};
export default roleRoutes;
