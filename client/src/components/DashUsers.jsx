import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/get-users`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id, currentUser?.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = users.length;

    try {
      const res = await fetch(`/api/user/get-users?startIndex=${startIndex}`);

      const data = await res.json();
      if (res.ok) {
        setUsers([...users, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data?.message);
      } else {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModel(false);
      }
    } catch (error) {
      console.log(data?.message);
    }
  };

  return (
    <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users?.map((user) => (
              <Table.Body key={user?._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user?.profilePicture}
                      alt={user?.username}
                      className="w-10 h-10 object-cover rounded-full bg-gray-500"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user?.username}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user?.email}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {user?.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModel(true);
                        setUserIdToDelete(user?._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
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
        <p>You have no users yet!</p>
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
              Are you sure you want to delete this user ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color={"gray"} onClick={() => setShowModel(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashUsers;
