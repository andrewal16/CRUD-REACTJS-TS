import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/Store';
import { fetchUserById, clearSelectedUser } from '../reducer/UserSlice';

const UserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedUser, isLoading, isError, errorMessage } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log('UserDetailPage mounted, userId:', userId);
    if (userId) {
      dispatch(fetchUserById(userId));
    } else {
      console.error('No userId provided');
    }
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [userId, dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {errorMessage || 'Failed to fetch user data'}</div>;
  if (!selectedUser) return <div>No user found</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">User Detail</h1>
      <div className="bg-gray-50 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <p><strong>ID:</strong> {selectedUser.Id}</p>
        <p><strong>Name:</strong> {selectedUser.Name}</p>
        <p><strong>Job:</strong> {selectedUser.Job}</p>
      </div>
      <div className="flex justify-center">
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/user')}
        >
          Back to Users
        </button>
      </div>
    </div>
  </div>
  );
};

export default UserDetailPage;