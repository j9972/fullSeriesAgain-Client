import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/*
정리를 하면,

회원가입 같이 데이터를 c -> s 방향으로 보낼떄는 axios를 post 방식에 실어서 obSubmit 같은 함수에 넣어주며, 
endpoint를 지정해주고 이를 User라는 route에서 처리 해준다. 

로그인 같은 경우는 data를 c -> s로 보내지만 회원가입과는 다른 endpoint를 지정해줘야 하지만, 
회원가입과 같은 페이지에서 다른 endpoint로 데이터를 처리하면 된다

*/

function Registration() {
  const navigate = useNavigate();
  const initialValue = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(20).required("u must type username"),
    password: Yup.string().min(3).max(20).required("u must type password"),
  });

  // axios.post 로 db쪽으로 데이터를 보내줌.
  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth", data).then((response) => {
      console.log(data);
      //navigate("/");
    });
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValue}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Username: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="username"
            placeholder="username.."
          />
          <label>Password: </label>
          <ErrorMessage name="password" component="span" />
          <Field
            autoComplete="off"
            type="password"
            id="inputCreatePost"
            name="password"
            placeholder="password.."
          />

          <button type="submit"> Register </button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
