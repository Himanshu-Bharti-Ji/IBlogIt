import React, { useEffect, useState } from "react";
import { Table, Alert, Badge, Button } from "flowbite-react";
import { HiCheck, HiX, HiClock, HiBan } from "react-icons/hi";
import { useUserRole } from "../hooks/useUserRole";

const MyPermissionRequests = () => {
  const { isAdmin, isSuperAdmin } = useUserRole();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(false);

  useEffect(() => {
    if (isAdmin && !isSuperAdmin) {
      fetchRequests();
    }
  }, [isAdmin, isSuperAdmin]);

  useEffect(() => {
    const pending = requests.find(
      (req) =>
        req.requestType === "download_all_posts" &&
        req.status === "pending"
    );
    setPendingRequest(!!pending);
  }, [requests]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/permission/my-requests", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "failure",
        message: "Error fetching permission requests",
      });
      setTimeout(() => setAlertMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPermission = async () => {
    try {
      const res = await fetch("/api/permission/request", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setPendingRequest(true);
        setAlertMessage({
          type: "success",
          message: "Permission request submitted successfully. Waiting for super admin approval.",
        });
        setTimeout(() => setAlertMessage(null), 5000);
        fetchRequests();
        window.dispatchEvent(new Event("permission-updated"));
      } else {
        setAlertMessage({
          type: "failure",
          message: data.message || "Failed to submit request",
        });
        setTimeout(() => setAlertMessage(null), 5000);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "failure",
        message: "Error submitting request",
      });
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const handleMarkAsViewed = async (requestId) => {
    try {
      const res = await fetch(`/api/permission/mark-viewed/${requestId}`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setAlertMessage({
          type: "success",
          message: "Request marked as viewed",
        });
        setTimeout(() => setAlertMessage(null), 5000);
        fetchRequests();
        window.dispatchEvent(new Event("permission-updated"));
      } else {
        setAlertMessage({
          type: "failure",
          message: data.message || "Failed to mark as viewed",
        });
        setTimeout(() => setAlertMessage(null), 5000);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "failure",
        message: "Error marking request as viewed",
      });
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  if (isSuperAdmin || !isAdmin) {
    return null;
  }

  const getStatusBadge = (status, viewed) => {
    if (status === "approved") {
      return (
        <Badge
          color={viewed ? "success" : "warning"}
          icon={viewed ? HiCheck : HiClock}
        >
          {viewed ? "Approved" : "Approved (New!)"}
        </Badge>
      );
    } else if (status === "rejected") {
      return (
        <Badge color="failure" icon={HiX}>
          Rejected
        </Badge>
      );
    } else if (status === "revoked") {
      return (
        <Badge color="failure" icon={HiBan}>
          Revoked
        </Badge>
      );
    } else {
      return (
        <Badge color="info" icon={HiClock}>
          Pending
        </Badge>
      );
    }
  };

  return (
    <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {alertMessage && (
        <Alert
          color={alertMessage.type === "success" ? "success" : "failure"}
          className="mb-4"
          onDismiss={() => setAlertMessage(null)}
        >
          {alertMessage.message}
        </Alert>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold dark:text-white">
          My Permission Requests
        </h2>
        {!pendingRequest && (
          <Button
            color="success"
            onClick={handleRequestPermission}
            disabled={loading}
          >
            Request Permission
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : requests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You have no permission requests yet.
          </p>
          {!pendingRequest && (
            <Button
              color="success"
              onClick={handleRequestPermission}
              disabled={loading}
            >
              Request Permission
            </Button>
          )}
        </div>
      ) : (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Request Type</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Requested At</Table.HeadCell>
            <Table.HeadCell>Approved/Rejected At</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {requests.map((request) => (
              <Table.Row
                key={request._id}
                className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${
                  (request.status === "approved" && !request.viewed) || 
                  (request.status === "revoked" && !request.viewed)
                    ? "bg-yellow-50 dark:bg-yellow-900/20"
                    : ""
                }`}
              >
                <Table.Cell className="font-medium text-gray-900 dark:text-white">
                  {request.requestType === "download_all_posts"
                    ? "Download All Posts"
                    : request.requestType}
                </Table.Cell>
                <Table.Cell>{getStatusBadge(request.status, request.viewed)}</Table.Cell>
                <Table.Cell>
                  {new Date(request.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {request.approvedAt
                    ? new Date(request.approvedAt).toLocaleDateString()
                    : "-"}
                </Table.Cell>
                <Table.Cell>
                  {(request.status === "approved" || request.status === "revoked") && !request.viewed ? (
                    <button
                      onClick={() => handleMarkAsViewed(request._id)}
                      className="text-teal-500 hover:underline font-medium"
                    >
                      Mark as Viewed
                    </button>
                  ) : (request.status === "rejected" || request.status === "revoked") && request.rejectionReason ? (
                    <span
                      className="text-gray-500 dark:text-gray-400"
                      title={request.rejectionReason}
                    >
                      Reason: {request.rejectionReason}
                    </span>
                  ) : (
                    "-"
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default MyPermissionRequests;

