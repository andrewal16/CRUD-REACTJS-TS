import { createBrowserRouter } from "react-router-dom";
import { userRoute } from "./user/userRoutes";
import { initRoute } from "./initialRoutes";

export const router = createBrowserRouter([
    ...initRoute
])