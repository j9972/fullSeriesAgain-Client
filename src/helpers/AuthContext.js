// pedro 강의 12분짜리 정리되어 있는 영상이 있음 그거 보면 될듯
import { createContext } from "react";

export const AuthContext = createContext("");

// react의 문제가 하향식으로 state가 전달되늗네 level이 깊어질수록 state변경에 대한 불편함이 있음
// 이를, context로 변경이 가능하게 끔 한다

// react.createContext(default)로 context 객체 생성
// provider을 사용해 context 변경사랑을 자손들에게 제공

// useContext로 context 객체의 value를 가져올 수 있다
