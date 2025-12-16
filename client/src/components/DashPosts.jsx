import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table, Alert } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle, HiOutlineDownload } from "react-icons/hi";
import { useUserRole } from "../hooks/useUserRole";
import { exportPostsToExcelSimple } from "../utils/excelExport";

const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { isSuperAdmin, isAdmin } = useUserRole();
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [downloadPermission, setDownloadPermission] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `/api/post/get-posts?userId=${currentUser._id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const checkDownloadPermission = async () => {
      try {
        const res = await fetch("/api/permission/check-permission", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setDownloadPermission(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const checkPendingRequest = async () => {
      try {
        const res = await fetch("/api/permission/my-requests", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          const pending = data.requests.find(
            (req) =>
              req.requestType === "download_all_posts" &&
              req.status === "pending"
          );
          setPendingRequest(!!pending);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser?.isAdmin || isSuperAdmin) {
      fetchPosts();
      if (!isSuperAdmin) {
        checkDownloadPermission();
        checkPendingRequest();
      }
    }

    let interval;
    if (currentUser?.isAdmin && !isSuperAdmin) {
      interval = setInterval(() => {
        checkDownloadPermission();
        checkPendingRequest();
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentUser._id, currentUser?.isAdmin, isSuperAdmin]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;

    try {
      const res = await fetch(
        `/api/post/get-posts?userId=${currentUser._id}&startIndex=${startIndex}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setUserPosts([...userPosts, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await fetch(
        `/api/post/delete-post/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data?.message);
        setShowModel(false);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
        setShowModel(false);
      }
    } catch (error) {
      console.log(error);
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
        setShowPermissionModal(false);
        setAlertMessage({
          type: "success",
          message: "Permission request submitted successfully. Waiting for super admin approval.",
        });
        setTimeout(() => setAlertMessage(null), 5000);
        const refreshRes = await fetch("/api/permission/check-permission", {
          credentials: "include",
        });
        const refreshData = await refreshRes.json();
        if (refreshRes.ok) {
          setDownloadPermission(refreshData);
        }
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

  const handleDownload = async () => {
    if (isSuperAdmin) {
      setIsDownloading(true);
      try {
        const res = await fetch(
          `/api/post/download-posts?userId=${currentUser._id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          await exportPostsToExcelSimple(data.posts);
          setAlertMessage({
            type: "success",
            message: `Successfully downloaded ${data.posts.length} posts`,
          });
          setTimeout(() => setAlertMessage(null), 5000);
        } else {
          setAlertMessage({
            type: "failure",
            message: data.message || "Failed to download posts",
          });
          setTimeout(() => setAlertMessage(null), 5000);
        }
      } catch (error) {
        console.log(error);
        setAlertMessage({
          type: "failure",
          message: "Error downloading posts",
        });
        setTimeout(() => setAlertMessage(null), 5000);
      } finally {
        setIsDownloading(false);
      }
      return;
    }

    if (
      downloadPermission?.maxRecords === 9 &&
      userPosts.length > 9
    ) {
      setShowPermissionModal(true);
      return;
    }

    setIsDownloading(true);
    try {
      const res = await fetch(
        `/api/post/download-posts?userId=${currentUser._id}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        await exportPostsToExcelSimple(data.posts);
        const message = data.maxRecords === 9 
          ? `Successfully downloaded ${data.posts.length} posts (limited to 9). Request permission to download all posts.`
          : `Successfully downloaded ${data.posts.length} posts`;
        setAlertMessage({
          type: "success",
          message,
        });
        setTimeout(() => setAlertMessage(null), 5000);
      } else {
        setAlertMessage({
          type: "failure",
          message: data.message || "Failed to download posts",
        });
        setTimeout(() => setAlertMessage(null), 5000);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "failure",
        message: "Error downloading posts",
      });
      setTimeout(() => setAlertMessage(null), 5000);
    } finally {
      setIsDownloading(false);
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

      {(isAdmin || isSuperAdmin) && userPosts.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold dark:text-white">Posts</h2>
          {(isAdmin || isSuperAdmin) && userPosts.length > 0 && (
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              gradientDuoTone="purpleToBlue"
              className="flex items-center gap-2"
            >
              <HiOutlineDownload className="w-5 h-5" />
              {isDownloading ? "Downloading..." : "Download Excel"}
            </Button>
          )}
        </div>
      )}

      {(isAdmin || isSuperAdmin) && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts?.map((post) => (
              <Table.Body key={post._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      <span dangerouslySetInnerHTML={{ __html: post?.title }} />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModel(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-teal-500 hover:underline"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <div className="w-full text-center py-7">
              <button
                onClick={handleShowMore}
                className="text-teal-500  text-md font-semibold hover:underline"
              >
                Show More
              </button>
            </div>
          )}
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size={"lg"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-xl text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={handleDeletePost}>
                Yes, I&apos;m sure
              </Button>
              <Button color={"gray"} onClick={() => setShowModel(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        popup
        size={"lg"}
      >
        <Modal.Header>Permission Required</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-yellow-400 dark:text-yellow-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-xl text-gray-500 dark:text-gray-400">
              {pendingRequest
                ? "You have a pending permission request. Please wait for super admin approval."
                : downloadPermission?.isRevoked
                ? "Your permission has been revoked by super admin. Would you like to request permission again?"
                : "You can download up to 9 posts. To download all posts, you need permission from super admin. Would you like to request permission?"}
            </h3>
            {!pendingRequest && (
              <div className="flex justify-center gap-4">
                <Button
                  color={"success"}
                  onClick={handleRequestPermission}
                >
                  {downloadPermission?.isRevoked ? "Request Permission Again" : "Request Permission"}
                </Button>
                <Button
                  color={"gray"}
                  onClick={() => setShowPermissionModal(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
            {pendingRequest && (
              <div className="flex justify-center gap-4">
                <Button
                  color={"gray"}
                  onClick={() => setShowPermissionModal(false)}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashPosts;
