// src/services/auth.service.ts
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const baseURL = "https://jsonplaceholder.typicode.com/";

export const login = createAsyncThunk(
  'auth/userlogin',
  async (data: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseURL}/login`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
