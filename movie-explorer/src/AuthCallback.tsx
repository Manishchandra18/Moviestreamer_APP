import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createSession } from "./api";


function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestToken = params.get("request_token");
    if (requestToken) {
      createSession(requestToken).then((sessionId) => {
        localStorage.setItem("session_id", sessionId);
        navigate("/explorer"); 
      });
    }
  }, [navigate]);

  return <div>Authenticating...</div>;
  
}

export default AuthCallback;

