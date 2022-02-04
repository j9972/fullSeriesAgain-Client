import "./App.css";
// Switch -> Routes 로 변경됨.
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

/*
change component -> element
 from    <Route path="/" exact component={Home} />
 to      <Route path="/" element={<Home />} />
*/
function App() {
  // false로 두면 새로고침하면 로그인한거 날아감 -> useEffect로 고침
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    // if (localStorage.getItem("accessToked")) {
    //   setAuthState(true);
    // } -> 얘를 axios를 써서 만들어봄
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          // hook에서는 위의 useState와 인자 개수가 가르지만 ...authState로 기존의 2개의 데이터를 받을 수 있게함
          setAuthState({
            ...authState,
            status: false,
          });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  // Token도 remove 해야하고, state에도 변화를 줘야 한다
  const logout = () => {
    localStorage.removeItem("accessToken");

    /*
    이렇게만 하면 username이 지워지지가 않음 -> we need to clear everything
    setAuthState({
      ...authState,
      status: false,
    });
    */

    setAuthState({
      username: "",
      id: 0,
      status: false,
    });
  };

  // value는 element object 그 자체를 나타내는데, key는 index를 의미
  // 로그인의 유무에 따라 navbar를 바꾸는 방법 -> storage.getItme("accessToken")으로 할 수 있음
  // storage.getItem(keyName); -> keyName(DOMString) 을 반환하고, key가 없으면 Null 반환
  // authState가 login state 대한 정보를 가지고 있다 -> localStorage.getItem("accessToken") == authState
  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              {/* {!authState && ( -> &&를 ?로 만들어서 삼항연산자로 로그인 했을때 로그아웃했을때를 보여줌 
              <>
                <Link to="/login">Login</Link>
                <Link to="/registration">Registration</Link>
              </>
            )} */}
              {/* 삼항 연산자를 통해 로그인의 유무에 따라 navbar를 바꿔줌 */}
              {!authState.status ? (
                <>
                  <Link to="/login"> Login</Link>
                  <Link to="/registration"> Registration</Link>
                </>
              ) : (
                <>
                  <Link to="/">Home</Link>
                  <Link to="/createpost">Create a Post</Link>
                </>
              )}
            </div>
            <div className="loggedInContainer">
              <h1>{authState.username} </h1>
              {authState.status && <button onClick={logout}> Logout</button>}
            </div>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
