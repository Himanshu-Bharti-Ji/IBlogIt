import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { About, Dashboard, Home, Projects, SignIn, SignUp, } from "./pages"
import { Header } from "./components"
import FooterCom from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

export default function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/projects" element={<Projects />} />
      </Routes>
      <FooterCom />
    </BrowserRouter>
  )
}

