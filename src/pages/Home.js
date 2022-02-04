import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { AuthContext } from "../helpers/AuthContext";

function Home() {
  // Posts에 대해서 담을 배열을 useState를 통해 state를 나타내고 있음
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  // axios를 통해서 : server - localhost:3001/posts 이라는 Endpoint에 있는 데이터를 가져올것임
  useEffect(() => {
    /*
    if (!authState.status) {
      navigate("/login");
    } -> 이렇게만 했을때 로그인이 된 상태에서 새로고침을 했을때 로그인 화면이 뜸,,, 홈페이지가 뜨게 고쳐야함
    */
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          // setListOfPosts(response.data); -> likedPost에 대한 변화에 반응을 안해줘서 이렇게만 하면 에러,
          // 지금과 같이 header도 필요
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
        });
    }
  }, []);

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        // alert(response.data); 안써도됨 -> routes -> likes.js를 res.json liked의 boolean를 trigger
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );
        // liked를 누르면 array를 만들어 그 안에 넣어주고, filter를 통해 넣었다 뼀다 함
        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          // postId가 다르다면 기존의 keep each post likeBtn
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  // value는 element object 그 자체를 나타내는데, key는 index를 의미
  // value.Likes.length로 like를 판단하고 array로 표현해서 쌓일 수 있게 해줌
  return (
    <div>
      {listOfPosts.map((value, key) => {
        return (
          <div key={key} className="post">
            <div className="title"> {value.title} </div>
            <div
              className="body"
              onClick={() => {
                navigate(`/post/${value.id}`);
              }}
            >
              {value.postText}
            </div>
            <div className="footer">
              <div className="username">
                {/* <Link to={`/profile/${value.UserId}`}>로 유저 이름을 누르면 프로필로 이동하게 해줌 */}
                {/* link to에 연결된 syntax주의 */}
                <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
              </div>
              <div className="buttons">
                <ThumbUpIcon
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  // 삼항연산자를 통해 like에 on - off 를 적어준다
                  className={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                />

                <label> {value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
