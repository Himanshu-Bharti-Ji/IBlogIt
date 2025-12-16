import React, { useEffect, useState } from "react";
import { Button, Modal, Table, Alert, Textarea, Tabs, Badge } from "flowbite-react";
import { HiOutlineExclamationCircle, HiCheck, HiX, HiBan } from "react-icons/hi";
import { useUserRole } from "../hooks/useUserRole";

const PermissionRequests = () => {
  const { isSuperAdmin } = useUserRole();
  const [requests, setRequests] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    if (isSuperAdmin) {
      fetchRequests();
    }
  }, [isSuperAdmin]);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/permission/all-requests", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = async (requestId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/permission/approve/${requestId}`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setAlertMessage({
          type: "success",
          message: "Permission request approved successfully",
        });
        setTimeout(() => setAlertMessage(null), 5000);
        fetchRequests();
      } else {
        setAlertMessage({
          type: "failure",
          message: data.message || "Failed to approve request",
        });
        setTimeout(() => setAlertMessage(null), 5000);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "failure",
        message: "Error approving request",
      });
      setTimeout(() => setAlertMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/permission/reject/${selectedRequest._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ reason: rejectionReason }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setAlertMessage({
          type: "success",
          message: "Permission request rejected",
        });
        setTimeout(() => setAlertMessage(null), 5000);
        setShowRejectModal(false);
        setRejectionReason("");
        setSelectedRequest(null);
        fetchRequests();
      } else {
        setAlertMessage({
          type: "failure",
          message: data.message || "Failed to reject request",
        });
        setTimeout(() => setAlertMessage(null), 5000);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "failure",
        message: "Error rejecting request",
      });
      setTimeout(() => setAlertMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const openRevokeModal = (request) => {
    setSelectedRequest(request);
    setShowRevokeModal(true);
  };

  const handleRevoke = async () => {
    if (!selectedRequest) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/permission/revoke/${selectedRequest._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ reason: rejectionReason }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setAlertMessage({
          type: "success",
          message: "Permission revoked successfully",
        });
        setTimeout(() => setAlertMessage(null), 5000);
        setShowRevokeModal(false);
        setRejectionReason("");
        setSelectedRequest(null);
        fetchRequests();
      } else {
        setAlertMessage({
          type: "failure",
          message: data.message || "Failed to revoke permission",
        });
        setTimeout(() => setAlertMessage(null), 5000);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "failure",
        message: "Error revoking permission",
      });
      setTimeout(() => setAlertMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (!isSuperAdmin) {
    return null;
  }

  const pendingRequests = requests.filter((req) => req.status === "pending");
  const approvedRequests = requests.filter((req) => req.status === "approved");
  const rejectedRequests = requests.filter((req) => req.status === "rejected" || req.status === "revoked");

  return (
    <div className="w-full p-3">
      {alertMessage && (
        <Alert
          color={alertMessage.type === "success" ? "success" : "failure"}
          className="mb-4"
          onDismiss={() => setAlertMessage(null)}
        >
          {alertMessage.message}
        </Alert>
      )}

      <h2 className="text-2xl font-semibold dark:text-white mb-4">
        Permission Requests
      </h2>

      <Tabs aria-label="Permission requests tabs" style="underline">
        <Tabs.Item active={activeTab === "pending"} title={`Pending (${pendingRequests.length})`} onClick={() => setActiveTab("pending")}>
          {pendingRequests.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              No pending permission requests
            </p>
          ) : (
            <Table hoverable className="shadow-md mt-4">
              <Table.Head>
                <Table.HeadCell>Requester</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Request Type</Table.HeadCell>
                <Table.HeadCell>Requested At</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {pendingRequests.map((request) => (
                  <Table.Row
                    key={request._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      {request.requesterUsername}
                    </Table.Cell>
                    <Table.Cell>{request.requesterEmail}</Table.Cell>
                    <Table.Cell>{request.requestType}</Table.Cell>
                    <Table.Cell>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          color="success"
                          onClick={() => handleApprove(request._id)}
                          disabled={loading}
                        >
                          <HiCheck className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => openRejectModal(request)}
                          disabled={loading}
                        >
                          <HiX className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Tabs.Item>

        <Tabs.Item active={activeTab === "approved"} title={`Approved (${approvedRequests.length})`} onClick={() => setActiveTab("approved")}>
          {approvedRequests.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              No approved permission requests
            </p>
          ) : (
            <Table hoverable className="shadow-md mt-4">
              <Table.Head>
                <Table.HeadCell>Requester</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Request Type</Table.HeadCell>
                <Table.HeadCell>Approved At</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {approvedRequests.map((request) => (
                  <Table.Row
                    key={request._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      {request.requesterUsername}
                    </Table.Cell>
                    <Table.Cell>{request.requesterEmail}</Table.Cell>
                    <Table.Cell>{request.requestType}</Table.Cell>
                    <Table.Cell>
                      {request.approvedAt
                        ? new Date(request.approvedAt).toLocaleDateString()
                        : "-"}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="success" icon={HiCheck}>
                        Approved
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => openRevokeModal(request)}
                        disabled={loading}
                      >
                        <HiBan className="w-4 h-4 mr-1" />
                        Revoke
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Tabs.Item>

        <Tabs.Item active={activeTab === "rejected"} title={`Rejected/Revoked (${rejectedRequests.length})`} onClick={() => setActiveTab("rejected")}>
          {rejectedRequests.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              No rejected or revoked permission requests
            </p>
          ) : (
            <Table hoverable className="shadow-md mt-4">
              <Table.Head>
                <Table.HeadCell>Requester</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Request Type</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Reason</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {rejectedRequests.map((request) => (
                  <Table.Row
                    key={request._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      {request.requesterUsername}
                    </Table.Cell>
                    <Table.Cell>{request.requesterEmail}</Table.Cell>
                    <Table.Cell>{request.requestType}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={request.status === "revoked" ? "failure" : "failure"}
                        icon={request.status === "revoked" ? HiBan : HiX}
                      >
                        {request.status === "revoked" ? "Revoked" : "Rejected"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="max-w-xs truncate" title={request.rejectionReason}>
                      {request.rejectionReason || "-"}
                    </Table.Cell>
                    <Table.Cell>
                      {request.approvedAt
                        ? new Date(request.approvedAt).toLocaleDateString()
                        : "-"}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Tabs.Item>
      </Tabs>

      <Modal
        show={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectionReason("");
          setSelectedRequest(null);
        }}
        popup
        size="md"
      >
        <Modal.Header>Reject Permission Request</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <p className="text-gray-500 dark:text-gray-400">
              Please provide a reason for rejecting this request:
            </p>
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-4">
              <Button
                color="gray"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                  setSelectedRequest(null);
                }}
              >
                Cancel
              </Button>
              <Button
                color="failure"
                onClick={handleReject}
                disabled={loading || !rejectionReason.trim()}
              >
                Reject
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showRevokeModal}
        onClose={() => {
          setShowRevokeModal(false);
          setRejectionReason("");
          setSelectedRequest(null);
        }}
        popup
        size="md"
      >
        <Modal.Header>Revoke Permission</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <HiOutlineExclamationCircle className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Are you sure you want to revoke this permission? The admin will lose access to download all posts.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Please provide a reason (optional):
            </p>
            <Textarea
              placeholder="Enter revocation reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-4">
              <Button
                color="gray"
                onClick={() => {
                  setShowRevokeModal(false);
                  setRejectionReason("");
                  setSelectedRequest(null);
                }}
              >
                Cancel
              </Button>
              <Button
                color="failure"
                onClick={handleRevoke}
                disabled={loading}
              >
                Revoke Permission
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PermissionRequests;

