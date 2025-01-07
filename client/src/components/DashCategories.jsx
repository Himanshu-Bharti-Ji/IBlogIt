import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashCategories = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [categories, setCategories] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/category/get-categories`);
        const data = await res.json();
        if (res.ok) {
          setCategories(data?.categories);
          if (data.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser?.isAdmin) {
      fetchCategories();
    }
  }, [currentUser._id, currentUser?.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = categories.length;

    try {
      const res = await fetch(
        `/api/category/get-categories?startIndex=${startIndex}`
      );

      const data = await res.json();
      if (res.ok) {
        setCategories([...categories, ...data.categories]);
        if (data.categories.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteCategroy = async () => {
    setShowModel(false);

    try {
      const res = await fetch(
        `api/category/deleteCategory/${categoryIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data?.message);
      } else {
        setCategories((prev) =>
          prev.filter((post) => post._id !== categoryIdToDelete)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && categories.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Category Title</Table.HeadCell>
              <Table.HeadCell>Discription</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {categories?.map((category) => (
              <Table.Body key={category._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(category.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{category?.title}</Table.Cell>
                  <Table.Cell>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: category?.description,
                      }}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModel(true);
                        setCategoryIdToDelete(category._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-teal-500 hover:underline hover:cursor-pointer"
                      onClick={() =>
                        navigate("/dashboard?tab=create-category", {
                          state: { categoryId: category?._id },
                        })
                      }
                    >
                      Edit
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
        <p>You have no Categories yet!</p>
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
              Are you sure you want to delete this category ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={handleDeleteCategroy}>
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

export default DashCategories;
