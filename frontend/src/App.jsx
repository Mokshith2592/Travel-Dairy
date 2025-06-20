import React from "react"
import {BrowserRouter ,Routes ,Route} from "react-router-dom"
import Login from "./pages/auth/Login"
import SignUp from "./pages/auth/SignUp"
import Home from "./pages/home/Home"
import PrivateRoute from "./components/PrivateRoute"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />}></Route>
          </Route>
          {/* <Route path="/" element={<Home />}></Route> */}
          <Route path="/login" element={<Login />}></Route>
          <Route path="/sign-up" element={<SignUp />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
