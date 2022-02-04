import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
  // post의 각 페이지드릉ㄹ 구별해줄때 useParams 사용
  let { id } = useParams();
  const navigate = useNavigate();
  // post들을 담아 둘 객체 생성
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  // server측에서 보내주는 데이터를 axios.get으로 받아줌
  // byId/${id}는 Posts.js 파일에서 지정한 endPoint가 되는것이다
  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            // 이 부분은 authMiddleware 부분에 req.header 부분 참조
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          // this code make comment and username show on browser automatically
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };
          // ...는 previous array 정보들을 가져올 수 있음
          setComments([...comments, commentToAdd]);
          // 인풋창 값 초기화해준다.
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: {
          // 이 부분은 authMiddleware 부분에 req.header 부분 참조
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        // filter () 을 쓸건데 진짜 중요함
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  // "delete" show on browser imeediately with back & client logic
  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: {
          // 이 부분은 authMiddleware 부분에 req.header 부분 참조
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        navigate("/");
      });
  };

  // axios.put을 이용해 게시물안에서 title, postText의 update를하고, change ui immediately
  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter New Title: ");
      axios.put(
        "http://localhost:3001/posts/title",
        {
          newTitle,
          id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );
      setPostObject({ ...postObject, title: newTitle });
    } else {
      let newPostText = prompt("Enter New Text: ");
      axios.put(
        "http://localhost:3001/posts/postText",
        {
          newText: newPostText,
          id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );
      setPostObject({ ...postObject, postText: newPostText });
    }
  };

  // comment 부분에 setnewComment로 바뀌는 comment 데이터를 잡아옴
  // input 창 초기값으로 value={newComment} 넣어두면됨
  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("title");
              }
            }}
          >
            {postObject.title}
          </div>
          <div
            className="body"
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("body");
              }
            }}
          >
            {postObject.postText}
          </div>
          <div className="footer">
            {postObject.username}{" "}
            {authState.username === postObject.username && (
              <button
                onClick={() => {
                  deletePost(postObject.id);
                }}
              >
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment.."
            autoComplete="off"
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
            }}
          />
          <button onClick={addComment}>Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                {comment.commentBody}
                <label>Username: {comment.username}</label>
                {/* user이름과 게시물의 등록자 이름이 같을때만 버튼이 생기게 함 */}
                {authState.username === comment.username && (
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
