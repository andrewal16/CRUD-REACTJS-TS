import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/Store';
import { fetchUserById, updateUser, clearSelectedUser } from '../reducer/UserSlice';
import Swal from 'sweetalert2';
const UserUpdatePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedUser, isLoading, isError, errorMessage } = useSelector((state: RootState) => state.user);

  const [name, setName] = useState('');
  const [job, setJob] = useState('');

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [userId, dispatch]);

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.Name);
      setJob(selectedUser.Job);
    }
  }, [selectedUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Save Changes!'
    })
    .then(async (result) => { 
      if (result.isConfirmed) {
        if (selectedUser) {
          try {
            await dispatch(updateUser({ ...selectedUser, Name: name, Job: job })).unwrap();
            navigate('/user');
          } catch (error) {
            console.error('Failed to update user:', error);
          }
        }
      }
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {errorMessage || 'Failed to fetch user data'}</div>;
  if (!selectedUser) return <div>No user found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Update User</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="job">
            Job
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="job"
            type="text"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="btn btn-primary"
            type="submit"
          >
            Update User
          </button>
          <button
            className="btn btn-outline btn-error mr-2"
            type="button"
            onClick={() => navigate('/user')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserUpdatePage;