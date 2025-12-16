import { useSelector } from "react-redux";

const SUPER_ADMIN_ID = "677aa3c758cef46378eb42ab";

export const useUserRole = () => {
  const { currentUser } = useSelector((state) => state.user);

  const isSuperAdmin = currentUser?._id === SUPER_ADMIN_ID;
  const isAdmin = currentUser?.isAdmin === true;
  const isNormalUser = !isAdmin && !isSuperAdmin;

  return {
    isSuperAdmin,
    isAdmin,
    isNormalUser,
    currentUser,
  };
};

