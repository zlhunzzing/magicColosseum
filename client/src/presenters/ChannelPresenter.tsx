import React, { Dispatch } from 'react';
import '../presenterStyles/ChannelPresenter.css';

interface Props {
  rooms: Array<object>;
  setRoomname: Dispatch<string>;
  isModal: boolean;
  setIsModal: Dispatch<boolean>;
  isUser: boolean;
  createRoom: Function;
  inRoom: Function;
}

const ChannelPresenter: React.FunctionComponent<Props> = ({
  rooms,
  setRoomname,
  isModal,
  setIsModal,
  isUser,
  createRoom,
  inRoom,
}: Props) => (
  <div className="Main">
    <br></br>
    <br></br>
    <br></br>
    <div
      style={{
        display: 'inline-block',
        width: '600px',
        height: '450px',
        border: '1px solid black',
      }}
    >
      {rooms
        ? rooms.map((room: any) => (
            <div
              key={room.id}
              className="room"
              style={{
                width: '596px',
                height: '30px',
                border: '1px solid black',
                float: 'left',
                margin: '1px',
                cursor: 'pointer',
              }}
              onClick={() => {
                if (room.headcount < room.maxHeadcount) {
                  inRoom(room.id);
                } else {
                  alert('방의 자리가 부족합니다.');
                }
              }}
            >
              <span style={{ paddingLeft: '10px', float: 'left' }}>
                {room.id}번방
              </span>
              {room.roomname}
              <span style={{ paddingRight: '10px', float: 'right' }}>
                ({room.headcount}/{room.maxHeadcount})
              </span>
            </div>
          ))
        : null}
    </div>
    <br></br>
    <button
      onClick={() => {
        setIsModal(true);
      }}
    >
      방만들기
    </button>
    <div
      className="wrapper"
      style={{
        display: isModal ? 'block' : 'none',
      }}
    >
      <form
        className="createRoom"
        onSubmit={(e) => {
          e.preventDefault();
          setIsModal(false);
          if (isUser) createRoom();
        }}
      >
        {isUser ? '방 제목을 입력하시오' : '방을 만들려면 로그인 해야합니다'}
        <br></br>
        {isUser ? (
          <input
            type="text"
            className="accountInput"
            onChange={({ target: { value } }) => setRoomname(value)}
          ></input>
        ) : null}
        <br></br>
        <button type="submit">확인</button>
      </form>
    </div>
  </div>
);

export default ChannelPresenter;
