import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();


  const token = auth?.token;  
  useEffect(() => {

    if (token) {
      const authCheck = async () => {
          try {
              const res = await axios.get("/api/v1/auth/user-auth");
              setOk(res.data.ok)
          } catch (error) {
              // ...handle/report error...
          }
      };
      authCheck();
  }
}, [token]);
  //   const authCheck = async () => {
  //     const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/user-auth`)
  //     if (res.data.ok) {
  //       setOk(true);
  //     } else {
  //       setOk(false);
  //     }
  //   };
  //   if (token) authCheck();   // <======
  //   // if (auth?.token) authCheck();
  //  },  [token]);
 

  return ok ? <Outlet /> : <Spinner />;
}

