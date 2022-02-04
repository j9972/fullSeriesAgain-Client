import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const navigate = useNavigate();
  const initialValue = {
    title: "",
    postText: "",
  };

  // 로그인이 되어 있지 않다면, home or createpost 페이지 이동이 아닌 login page로 먼저 이동 시킴
  useEffect(() => {
    /*
    if (!authState.status) {
      navigate("/login");
    } -> if i refresh with this code and loged in status browser show us login page ( ERROR )
    */
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("u must type title"),
    postText: Yup.string().required("u must type text"),
  });

  // axios.post 로 db쪽으로 데이터를 보내줌.
  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/posts", data, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        navigate("/");
      });
  };

  // Field의 name은 db의 테이블 column들과 같아야 함
  // autoComplete는 자동완성을 막아준다
  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValue}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="title.."
          />
          <label>Post: </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="postText"
            placeholder="post.."
          />

          <button type="submit"> Create a Post </button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
