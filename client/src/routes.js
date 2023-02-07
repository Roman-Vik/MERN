import React from "react";
import {
    createBrowserRouter,
} from "react-router-dom";
import {LinksPage} from "./pages/LinksPage";
import {CreatePage} from "./pages/CreatePage";
import {DetailPage} from "./pages/DetailPage";
import {AuthPage} from "./pages/AuthPage";

export const router = (isAuthenticated) => {
    if (!isAuthenticated) {
        return createBrowserRouter([
            {
                path: "/links",
                element: (
                    <LinksPage/>
                ),
            },
            {
                path: "/create",
                element: (
                    <CreatePage/>
                ),
            }, {
                path: "/detail/:id",
                element: (
                    <DetailPage/>
                ),
            },
        ]);
    }

    return createBrowserRouter([
        {
            path: "/",
            element: (
                <AuthPage/>
            ),
        },
    ])
}

