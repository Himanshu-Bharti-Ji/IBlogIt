import PermissionRequest from "../models/permissionRequest.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";

const SUPER_ADMIN_ID = "677aa3c758cef46378eb42ab";

export const requestPermission = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const existingPendingRequest = await PermissionRequest.findOne({
      requesterId: req.user.id,
      requestType: "download_all_posts",
      status: "pending",
    });

    if (existingPendingRequest) {
      return next(errorHandler(400, "You already have a pending request"));
    }

    const existingApprovedRequest = await PermissionRequest.findOne({
      requesterId: req.user.id,
      requestType: "download_all_posts",
      status: "approved",
    });

    if (existingApprovedRequest) {
      const revokedRequest = await PermissionRequest.findOne({
        requesterId: req.user.id,
        requestType: "download_all_posts",
        status: "revoked",
        approvedAt: { $gt: existingApprovedRequest.approvedAt },
      });

      if (!revokedRequest) {
        return next(errorHandler(400, "You already have an approved permission request"));
      }
    }

    const permissionRequest = new PermissionRequest({
      requesterId: req.user.id,
      requesterEmail: user.email,
      requesterUsername: user.username,
      requestType: "download_all_posts",
    });

    await permissionRequest.save();
    res.status(201).json({
      success: true,
      message: "Permission request submitted successfully",
      request: permissionRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const getPermissionRequests = async (req, res, next) => {
  try {
    if (req.user.id !== SUPER_ADMIN_ID) {
      return next(errorHandler(403, "Only super admin can view all requests"));
    }

    const requests = await PermissionRequest.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPermissionRequests = async (req, res, next) => {
  try {
    const requests = await PermissionRequest.find({
      requesterId: req.user.id,
    })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

export const approvePermissionRequest = async (req, res, next) => {
  try {
    if (req.user.id !== SUPER_ADMIN_ID) {
      return next(errorHandler(403, "Only super admin can approve requests"));
    }

    const request = await PermissionRequest.findById(req.params.requestId);
    if (!request) {
      return next(errorHandler(404, "Request not found"));
    }

    request.status = "approved";
    request.approvedBy = req.user.id;
    request.approvedAt = new Date();
    request.viewed = false;

    await request.save();

    res.status(200).json({
      success: true,
      message: "Permission request approved",
      request,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectPermissionRequest = async (req, res, next) => {
  try {
    if (req.user.id !== SUPER_ADMIN_ID) {
      return next(errorHandler(403, "Only super admin can reject requests"));
    }

    const request = await PermissionRequest.findById(req.params.requestId);
    if (!request) {
      return next(errorHandler(404, "Request not found"));
    }

    request.status = "rejected";
    request.rejectionReason = req.body.reason || "No reason provided";
    request.approvedBy = req.user.id;
    request.approvedAt = new Date();

    await request.save();

    res.status(200).json({
      success: true,
      message: "Permission request rejected",
      request,
    });
  } catch (error) {
    next(error);
  }
};

export const revokePermission = async (req, res, next) => {
  try {
    if (req.user.id !== SUPER_ADMIN_ID) {
      return next(errorHandler(403, "Only super admin can revoke permissions"));
    }

    const request = await PermissionRequest.findById(req.params.requestId);
    if (!request) {
      return next(errorHandler(404, "Request not found"));
    }

    if (request.status !== "approved") {
      return next(errorHandler(400, "Only approved permissions can be revoked"));
    }

    request.status = "revoked";
    request.rejectionReason = req.body.reason || "Permission revoked by super admin";
    request.approvedBy = req.user.id;
    request.approvedAt = new Date();
    request.viewed = false;

    await request.save();

    res.status(200).json({
      success: true,
      message: "Permission revoked successfully",
      request,
    });
  } catch (error) {
    next(error);
  }
};

export const markRequestAsViewed = async (req, res, next) => {
  try {
    const request = await PermissionRequest.findById(req.params.requestId);
    if (!request) {
      return next(errorHandler(404, "Request not found"));
    }

    if (request.requesterId !== req.user.id) {
      return next(errorHandler(403, "You can only mark your own requests as viewed"));
    }

    request.viewed = true;
    await request.save();

    res.status(200).json({
      success: true,
      message: "Request marked as viewed",
      request,
    });
  } catch (error) {
    next(error);
  }
};

export const getUnviewedApprovalCount = async (req, res, next) => {
  try {
    const count = await PermissionRequest.countDocuments({
      requesterId: req.user.id,
      status: { $in: ["approved", "revoked"] },
      viewed: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    next(error);
  }
};

export const checkDownloadPermission = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isSuperAdmin = userId === SUPER_ADMIN_ID;

    if (isSuperAdmin) {
      return res.status(200).json({
        success: true,
        hasPermission: true,
        isSuperAdmin: true,
        maxRecords: null,
      });
    }

    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      return res.status(200).json({
        success: true,
        hasPermission: false,
        isSuperAdmin: false,
        maxRecords: 0,
      });
    }

    const revokedRequest = await PermissionRequest.findOne({
      requesterId: userId,
      requestType: "download_all_posts",
      status: "revoked",
    }).sort({ approvedAt: -1 });

    if (revokedRequest) {
      const newerApprovedRequest = await PermissionRequest.findOne({
        requesterId: userId,
        requestType: "download_all_posts",
        status: "approved",
        approvedAt: { $gt: revokedRequest.approvedAt },
      });

      if (!newerApprovedRequest) {
        return res.status(200).json({
          success: true,
          hasPermission: false,
          isSuperAdmin: false,
          maxRecords: 9,
          isRevoked: true,
        });
      }
    }

    const approvedRequest = await PermissionRequest.findOne({
      requesterId: userId,
      requestType: "download_all_posts",
      status: "approved",
    }).sort({ approvedAt: -1 });

    if (approvedRequest) {
      if (revokedRequest && approvedRequest.approvedAt < revokedRequest.approvedAt) {
        return res.status(200).json({
          success: true,
          hasPermission: false,
          isSuperAdmin: false,
          maxRecords: 9,
          isRevoked: true,
        });
      }

      return res.status(200).json({
        success: true,
        hasPermission: true,
        isSuperAdmin: false,
        maxRecords: null,
        approvedAt: approvedRequest.approvedAt,
      });
    }
    return res.status(200).json({
      success: true,
      hasPermission: true,
      isSuperAdmin: false,
      maxRecords: 9,
    });
  } catch (error) {
    next(error);
  }
};

