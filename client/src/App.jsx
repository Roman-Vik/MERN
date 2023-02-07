import React from "react";
import {router} from './routes.js'
import {RouterProvider} from "react-router-dom"
import 'materialize-css'


function App() {
    return (
            <RouterProvider router={router()}/>
    );
}
export default App;
