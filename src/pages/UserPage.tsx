import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store/Store";
import { fetchAllUser, deleteUserById } from "../reducer/UserSlice";

const UserPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData, isLoading, isError, errorMessage } = useSelector(
    (state: RootState) => state.user
  );
  const navigate = useNavigate();
  const [deletingUser, setDeletingUser] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllUser());
  }, [dispatch]);

  const handleInfoClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleDeleteClick = async (userId: string) => {
    setDeletingUser(userId);
    setDeleteError(null);
    try {
      await dispatch(deleteUserById(userId)).unwrap();
      // No need to refetch all users here, as the state is updated in the slice
    } catch (error) {
      console.error("Failed to delete user:", error);
      setDeleteError("Failed to delete user. Please try again.");
    } finally {
      setDeletingUser(null);
    }
  };

  if (isLoading && userData.length === 0) {
    return <div>Loading users...</div>;
  }

  if (isError) {
    return (
      <div>
        Error:{" "}
        {errorMessage || "Failed to load users. Please refresh the page."}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {isError && <div className="alert alert-error">{errorMessage}</div>}
      {deleteError && <div className="alert alert-error">{deleteError}</div>}
      <table className="table table-zebra">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Name</th>
            <th>Job</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user, index) => (
            <tr key={user.Id}>
              <td>{index + 1}</td>
              <td>{user.Id}</td>
              <td>{user.Name}</td>
              <td>{user.Job}</td>
              <td>
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => handleInfoClick(user.Id)}
                >
                  Info
                </button>
                <button
                  className="btn btn-outline btn-error mr-2"
                  onClick={() => handleDeleteClick(user.Id)}
                  disabled={deletingUser === user.Id}
                >
                  {deletingUser === user.Id ? "Deleting..." : "Delete"}
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => navigate(`/user/${user.Id}/edit`)}
                >
                  Edit User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserPage;