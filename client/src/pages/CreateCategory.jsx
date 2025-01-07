import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import MyButton from "../components/MyButton";

const CreateCategory = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state?.user);

  const location = useLocation();
  const categoryId = location?.state?.categoryId;

  if (categoryId) {
    useEffect(() => {
      try {
        const fetchPost = async () => {
          const res = await fetch(
            `/api/category/getCategoryById/${categoryId}`
          );
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
            setPublishError(data.message);
            return;
          }
          if (res.ok) {
            setPublishError(null);
            setFormData({
              title: data?.title,
              description: data?.description,
            });
          }
        };
        fetchPost();
      } catch (error) {
        console.log(error.message);
      }
    }, [categoryId]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (categoryId) {
      // return console.log("values", formData);
      try {
        const res = await fetch(`/api/category/editCategory/${categoryId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          setPublishError(data.message);
        }
        if (res.ok) {
          setPublishError(null);
        }
      } catch (error) {
        setPublishError(
          "An error occurred while updating the post. Please try again later."
        );
      }
    } else {
      try {
        const res = await fetch("/api/category/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          setPublishError(data.message);
        }
        if (res.ok) {
          setPublishError(null);
          setFormData({
            title: "",
            description: "",
          });
          navigate("/dashboard?tab=categories");
        }
      } catch (error) {
        setPublishError(
          "An error occurred while creating the category. Please try again later."
        );
      }
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen w-full">
      <h1 className="text-center text-3xl my-7 font-semibold">
        {categoryId ? "Update" : "Create a"} Category
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            value={formData?.title}
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>
        <ReactQuill
          theme="snow"
          required
          placeholder="Write Something Awesome..."
          className="h-72 mb-12"
          onChange={(value) => {
            setFormData({ ...formData, description: value });
          }}
          value={formData?.description}
        />
        <MyButton type="submit">{categoryId ? "Update" : "Create"}</MyButton>
        {publishError && (
          <Alert className="mt-5" color={"failure"}>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default CreateCategory;
