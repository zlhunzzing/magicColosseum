import React, { Dispatch } from 'react';
import '../presenterStyles/MainPresenter.css';
// import { Link } from 'react-router-dom';
import * as apis from '../apis/Auth';

interface Props {
  email: string;
  setEmail: Dispatch<string>;
  password: string;
  setPassword: Dispatch<string>;
  history: any;
}

const MainPresenter: React.FunctionComponent<Props> = ({
  email,
  setEmail,
  password,
  setPassword,
  history,
}: Props) => {
  return (
    <div className="Main">
      <h1 className="MainTitle">MagicColosseum</h1>
      <h2>- 매직콜로세움 -</h2>

      <div className="account">
        <form
          className="accountForm"
          onSubmit={(e) => {
            e.preventDefault();
            apis.signin(email, password, history);
          }}
        >
          <div className="accountInputs">
            <input
              type="email"
              className="accountInput"
              placeholder="이메일을 입력 해주세요"
              onChange={({ target: { value } }) => setEmail(value)}
            ></input>
            <input
              type="password"
              className="accountInput"
              placeholder="비밀번호를 입력 해주세요"
              onChange={({ target: { value } }) => setPassword(value)}
            ></input>
          </div>
          <button className="accountButton" type="submit">
            로그인
          </button>
        </form>
        <a className="accountLink" href="/signup">
          회원가입
        </a>
      </div>
      {/* <Link to="/selectCharacter" className="forSelectLink">
        Play
      </Link> */}
    </div>
  );
};

export default MainPresenter;
