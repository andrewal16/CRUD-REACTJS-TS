import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/Store';
import { addUser } from '../reducer/UserSlice';

const UserAddPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isLoading, isError } = useSelector((state: RootState) => state.user);

  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !job.trim()) {
      setError('Please fill in both name and job fields.');
      return;
    }

    try {
      await dispatch(addUser({ Name: name.trim(), Job: job.trim() })).unwrap();
      navigate('/user');
    } catch (error) {
      console.error('Failed to add user:', error);
      setError('Failed to add user. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Add New User</h2>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="input input-bordered w-full"
            placeholder="Enter name"
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
            type="text"
            id="job"
            className="input input-bordered w-full"
            placeholder="Enter job"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add User'}
        </button>
      </form>
    </div>
  );
};

export default UserAddPage;