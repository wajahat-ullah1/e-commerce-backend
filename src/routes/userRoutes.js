const express = require("express");

const userController = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validate = require("../middleware/validateMiddleware");
const { changePasswordSchema } = require("../validators/authValidator");

const router = express.Router();

router.use(authenticate);

// Get my profile
router.get("/profile", userController.getMyProfile);

// Update my profile
router.put("/profile", userController.updateMyProfile);

// Upload Image
router.put(
  "/profile/image",
  upload.single("image"),
  userController.updateProfileImage,
);

router.put(
  "/change-password",
  validate(changePasswordSchema),
  userController.changePassword,
);

module.exports = router;
