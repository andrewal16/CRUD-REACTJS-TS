import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../model/UserModel";
import axios from "axios";

const baseURL = "https://crudcrud.com/api/";
const key = "89340c1cdb95470ba48b9b93f43d34d6";

export const fetchAllUser = createAsyncThunk(
  "user/fetchAllUser",
  async (_, { rejectWithValue }) => {
    try {
      const result = await axios.get(`${baseURL}${key}/users`);
      console.log("Data fetched from API:", result.data);
      let userResponse: User[] = result.data.map((res: any) => ({
        Id: res._id,
        Name: res.name,
        Job: res.job,
      }));
      console.log("Mapped User Data:", userResponse);
      return userResponse;
    } catch (error) {
      console.error("Error fetching users:", error);
      return rejectWithValue("Failed to fetch users. Please try again.");
    }
  }
);
// export const updateUser = createAsyncThunk(
//   "user/updateUser",
//   async (userData: User, { rejectWithValue }) => {
//     try {
//       const result = await axios.put(
//         `${baseURL}${key}/users/${userData.Id}`,
//         {
//           name: userData.Name,
//           job: userData.Job,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       return userData; // Return the updated user data
//     } catch (error) {
//       console.error("Error updating user:", error);
//       return rejectWithValue("Failed to update user. Please try again.");
//     }
//   }
// );

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userData: User, { rejectWithValue }) => {
    try {
      const result = await axios.put(
        `${baseURL}${key}/users/${userData.Id}`,
        {
          name: userData.Name,
          job: userData.Job,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return userData;
    } catch (error) {
      console.error("Error updating user:", error);
      return rejectWithValue("Failed to update user. Please try again.");
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const result = await axios.get(`${baseURL}${key}/users/${userId}`);
      const userData: User = {
        Id: result.data._id,
        Name: result.data.name,
        Job: result.data.job,
      };
      return userData;
    } catch (error) {
      console.error("Error fetching user:", error);
      return rejectWithValue("Failed to fetch user. Please try again.");
    }
  }
);

export const deleteUserById = createAsyncThunk(
  "user/deleteUserById",
  async (userId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${baseURL}${key}/users/${userId}`);
      return userId;
    } catch (error) {
      console.error("Error deleting user:", error);
      return rejectWithValue("Failed to delete user. Please try again.");
    }
  }
);

export const addUser = createAsyncThunk(
  "user/addUser",
  async (userData: Omit<User, "Id">, { dispatch, rejectWithValue }) => {
    try {
      const result = await axios.post(
        `${baseURL}${key}/users`,
        {
          name: userData.Name,
          job: userData.Job,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const newUser: User = {
        Id: result.data._id,
        Name: result.data.name,
        Job: result.data.job,
      };

      await dispatch(fetchAllUser());

      return newUser;
    } catch (error) {
      console.error("Failed to add user:", error);
      return rejectWithValue("Failed to add user. Please try again.");
    }
  }
);

const UserSlice = createSlice({
  name: "user",
  initialState: {
    count: 0,
    userData: [] as User[],
    selectedUser: null as User | null,
    isLoading: false,
    isError: false,
    errorMessage: null as string | null,
  },
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchAllUser.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.errorMessage = action.payload as string;
      })
      .addCase(fetchAllUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
        state.isError = false;
        state.errorMessage = null;
      })
      // ... (keep other cases as they are)
      .addCase(addUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // We don't need to push the new user here anymore
        // because we're refetching all users in the thunk
      })
      .addCase(addUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
      .addCase(deleteUserById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.errorMessage = action.payload as string;
      })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = state.userData.filter(
          (user) => user.Id !== action.payload
        );
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUser = action.payload;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUser = action.payload;
        state.userData = state.userData.map((user) =>
          user.Id === action.payload.Id ? action.payload : user
        );
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      });
  },
});

export const { clearSelectedUser } = UserSlice.actions;
export default UserSlice.reducer;
