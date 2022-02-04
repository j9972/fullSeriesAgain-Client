import React, { useState } from "react";
import axios from "axios";

function ChangePassword() {
  const [oldPassword, setOldpassword] = useState("");
  const [newPassword, setNewpassword] = useState("");

  const ChangePassword = () => {
    axios
      .put(
        "http://localhost:3001/auth/changepassword",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        }
      });
  };
  return (
    <div>
      <h1>change ur password</h1>
      <input
        type="text"
        placeholder="old password.."
        onChange={(e) => {
          setOldpassword(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="new password.."
        onChange={(e) => {
          setNewpassword(e.target.value);
        }}
      />
      <button onClick={ChangePassword}>save changes</button>
    </div>
  );
}

export default ChangePassword;
