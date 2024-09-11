import { RouteObject } from "react-router-dom";
import Layouts from "../components/layouts";
import { userRoute } from "./user/userRoutes";

export const initRoute: RouteObject[] = [
    {
        element: <Layouts/>,
        children:[
            ...userRoute,
        ]
    }

]