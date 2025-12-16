import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiDocumentText,
  HiUser,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
  HiPlusCircle,
  HiTag,
  HiPencilAlt,
  HiFolderAdd,
  HiShieldCheck,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useUserRole } from "../hooks/useUserRole";

export default function DashSidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [unviewedCount, setUnviewedCount] = useState(0);

  const { currentUser } = useSelector((state) => state.user);
  const { isSuperAdmin, isAdmin } = useUserRole();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchUnviewedCount = async () => {
      if (isAdmin && !isSuperAdmin) {
        try {
          const res = await fetch("/api/permission/unviewed-count", {
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok) {
            setUnviewedCount(data.count || 0);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchUnviewedCount();
    const interval = setInterval(fetchUnviewedCount, 30000);
    
    const handlePermissionUpdate = () => {
      fetchUnviewedCount();
    };
    window.addEventListener("permission-updated", handlePermissionUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("permission-updated", handlePermissionUpdate);
    };
  }, [isAdmin, isSuperAdmin]);

  const handleSignout = async () => {
    try {
      const res = fetch("api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      }
    } catch (error) {
      dispatch(signoutSuccess());
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser?.isAdmin && (
            <Link to={"/dashboard?tab=dash"}>
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={HiChartPie}
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser?.isAdmin ? "Admin" : "User"}
              labelColor={"dark"}
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser && currentUser?.isAdmin && (
            <>
              <Link to={"/dashboard?tab=posts"}>
                <Sidebar.Item
                  active={tab === "posts"}
                  icon={HiDocumentText}
                  as="div"
                >
                  Posts
                </Sidebar.Item>
              </Link>
              <Link to={"/dashboard?tab=create-post"}>
                <Sidebar.Item
                  active={tab === "create-post"}
                  icon={HiPlusCircle}
                  as="div"
                >
                  Create Post
                </Sidebar.Item>
              </Link>
              <Link to={"/dashboard?tab=categories"}>
                <Sidebar.Item
                  active={tab === "categories"}
                  icon={HiTag}
                  as="div"
                >
                  Categories
                </Sidebar.Item>
              </Link>
              <Link to={"/dashboard?tab=create-category"}>
                <Sidebar.Item
                  active={tab === "create-category"}
                  icon={HiFolderAdd}
                  as="div"
                >
                  Create Category
                </Sidebar.Item>
              </Link>
              <Link to={"/dashboard?tab=users"}>
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to={"/dashboard?tab=comments"}>
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link>
              {isSuperAdmin && (
                <Link to={"/dashboard?tab=permissions"}>
                  <Sidebar.Item
                    active={tab === "permissions"}
                    icon={HiShieldCheck}
                    as="div"
                  >
                    Permission Requests
                  </Sidebar.Item>
                </Link>
              )}
              {isAdmin && !isSuperAdmin && (
                <Link to={"/dashboard?tab=my-permissions"}>
                  <Sidebar.Item
                    active={tab === "my-permissions"}
                    icon={HiShieldCheck}
                    as="div"
                    label={unviewedCount > 0 ? unviewedCount.toString() : undefined}
                    labelColor={unviewedCount > 0 ? "failure" : "dark"}
                  >
                    My Permissions
                  </Sidebar.Item>
                </Link>
              )}
            </>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
