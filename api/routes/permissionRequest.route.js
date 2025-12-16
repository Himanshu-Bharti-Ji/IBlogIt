import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  requestPermission,
  getPermissionRequests,
  getUserPermissionRequests,
  approvePermissionRequest,
  rejectPermissionRequest,
  revokePermission,
  checkDownloadPermission,
  markRequestAsViewed,
  getUnviewedApprovalCount,
} from "../controllers/permissionRequest.controller.js";

const router = express.Router();

router.post("/request", verifyToken, requestPermission);
router.get("/check-permission", verifyToken, checkDownloadPermission);
router.get("/my-requests", verifyToken, getUserPermissionRequests);
router.get("/all-requests", verifyToken, getPermissionRequests);
router.get("/unviewed-count", verifyToken, getUnviewedApprovalCount);
router.put("/approve/:requestId", verifyToken, approvePermissionRequest);
router.put("/reject/:requestId", verifyToken, rejectPermissionRequest);
router.put("/revoke/:requestId", verifyToken, revokePermission);
router.put("/mark-viewed/:requestId", verifyToken, markRequestAsViewed);

export default router;

