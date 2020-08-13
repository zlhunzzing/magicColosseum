import React from 'react';
import '../presenterStyles/FieldPresenter.css';
import store from '..';
import { Player } from '../common/interface/BattleInterface';
import * as battleActions from '../modules/Battle';
import CARD_DICTIONARY from '../common/CardDictionary';
const imageRequires = {
  PLAYER: require('../images/player.gif'),
};

interface Props {
  player1: Player;
  player2: Player;
  field: Array<object>;
  isUsing: Array<Array<boolean>>;
}

const FieldPresenter: React.FunctionComponent<Props> = ({
  player1,
  player2,
  field,
  isUsing,
}: Props) => (
  <div className="Main">
    {player1 ? (
      <div className="status">
        <div className="player1Status">
          <div>
            <div>NAME: {player1.name}</div>
            <div>HP: {player1.hp}</div>
            <div>MP: {player1.mp}</div>
          </div>
        </div>
        <div className="player2Status">
          <div>NAME: {player2.name}</div>
          <div>HP: {player2.hp}</div>
          <div>MP: {player2.mp}</div>
        </div>
      </div>
    ) : null}
    <button
      onClick={() => {
        store.dispatch(battleActions.set_is_turn());
      }}
    >
      임시
    </button>

    <div className="field">
      {field
        ? field.map((floor: any, floorId: number) => (
            <div key={floorId} className="floor">
              {floor.map((room: any, roomId: number) => (
                <div
                  key={roomId}
                  className={`room ${room.effect ? 'activeRoom' : ''}`}
                >
                  {player1.position.x === roomId &&
                  player1.position.y === floorId ? (
                    <img
                      src={imageRequires.PLAYER}
                      style={{
                        width: '75px',
                      }}
                    />
                  ) : null}
                  {player2.position.x === roomId &&
                  player2.position.y === floorId ? (
                    <img
                      src={imageRequires.PLAYER}
                      style={{
                        width: '75px',
                      }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          ))
        : null}
    </div>

    <div className="control">
      <span className="playerHand">
        {player1.hand
          ? player1.hand
              .slice(0)
              .reverse()
              .map((card: any, id: number) => (
                <img
                  src={isUsing[id][0] ? card.image : CARD_DICTIONARY.NONE.image}
                  alt=""
                  key={id}
                  className="card"
                ></img>
              ))
          : null}
      </span>
      <span className="player2Hand">
        {player2.hand
          ? player2.hand.map((card: any, id: number) => (
              <img
                src={isUsing[id][1] ? card.image : CARD_DICTIONARY.NONE.image}
                alt=""
                key={id}
                className="card"
              ></img>
            ))
          : null}
      </span>
    </div>
  </div>
);

export default FieldPresenter;
