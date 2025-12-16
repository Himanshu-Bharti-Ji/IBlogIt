import mongoose from "mongoose";

const permissionRequestSchema = new mongoose.Schema({
  requesterId: {
    type: String,
    required: true,
  },
  requesterEmail: {
    type: String,
    required: true,
  },
  requesterUsername: {
    type: String,
    required: true,
  },
  requestType: {
    type: String,
    enum: ["download_all_posts"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "revoked"],
    default: "pending",
  },
  approvedBy: {
    type: String,
    default: null,
  },
  approvedAt: {
    type: Date,
    default: null,
  },
  rejectionReason: {
    type: String,
    default: null,
  },
  viewed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const PermissionRequest = mongoose.model("PermissionRequest", permissionRequestSchema);

export default PermissionRequest;

