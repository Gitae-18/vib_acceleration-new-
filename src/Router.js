import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Main from "./components/main";
import Login from "./Login";
import General from "./components/menus/general";
import Measurements from "./components/menus/measurements";
import Network from "./components/menus/network";
import Server from "./components/menus/server";
import Storage from "./components/menus/storage";
import Triggers from "./components/menus/triggers";

export default function Router() {
    return(
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/main" element={<Main/>}/>
              <Route path="/general" element={<General/>}/>
              <Route path="/measurement" element={<Measurements/>}/>
              <Route path="/network" element={<Network/>}/>
              <Route path="/server" element={<Server/>}/>
              <Route path="/storage" element={<Storage/>}/>
              <Route path="/trigger" element={<Triggers/>}/>
            </Routes>
        </BrowserRouter>
    )
}