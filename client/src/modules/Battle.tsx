import { createAction } from 'redux-actions';
import { Card, PhaseNumber } from '../common/interface/BattleInterface';
import store from '..';
import CARD_DICTIONARY, {
  Deck1,
  Seki_Deck,
  Reti_Deck,
} from '../common/CardDictionary';
import { Dispatch } from 'react';
import * as handleModalActions from '../modules/HandleModal';
import { cardRanges } from '../common/CardDictionary'

const SELECT_PLAYER1 = 'App/Battle/SELECT_PLAYER1';
const SELECT_PLAYER2 = 'App/Battle/SELECT_PLAYER2';
const SET_TURN_TRUE = 'App/Battle/SET_TURN_TRUE';
const SET_TURN_FALSE = 'App/Battle/SET_TURN_FALSE';
const SET_IS_TURN = 'App/Battle/SET_IS_TURN';
const SET_USER_HAND = 'App/Battle/SET_USER_HAND';
const SET_PLAYER1_HAND = 'App/Battle/SET_PLAYER1_HAND';
const SET_PLAYER1_HP = 'App/Battle/SET_PLAYER1_HP';
const SET_PLAYER1_MP = 'App/Battle/SET_PLAYER1_MP';
const SET_PLAYER1_DEF = 'App/Battle/SET_PLAYER1_DEF';
const SET_PLAYER2_HAND = 'App/Battle/SET_PLAYER2_HAND';
const SET_PLAYER2_HP = 'App/Battle/SET_PLAYER2_HP';
const SET_PLAYER2_MP = 'App/Battle/SET_PLAYER2_MP';
const SET_PLAYER2_DEF = 'App/Battle/SET_PLAYER2_DEF';
const MOVE_PLAYER1_X_POSITION = 'App/Battle/MOVE_PLAYER1_X_POSITION';
const MOVE_PLAYER1_Y_POSITION = 'App/Battle/MOVE_PLAYER1_Y_POSITION';
const MOVE_PLAYER2_X_POSITION = 'App/Battle/MOVE_PLAYER2_X_POSITION';
const MOVE_PLAYER2_Y_POSITION = 'App/Battle/MOVE_PLAYER2_Y_POSITION';
const FIELD_RESET = 'App/Battle/FIELD_RESET';
const FIELD_ACTIVATION = 'App/Battle/FIELD_ACTIVATION';
const SET_USING_CARD = 'App/Battle/SET_USING_CARD';

export const select_player1 = createAction(SELECT_PLAYER1);
// payload: {name: Seki <string> }
export const select_player2 = createAction(SELECT_PLAYER2);
// payload: {name: Seki <string> }
export const set_turn_true = createAction(SET_TURN_TRUE);
export const set_turn_false = createAction(SET_TURN_FALSE);
export const set_is_turn = createAction(SET_IS_TURN);
export const set_user_hand = createAction(SET_USER_HAND);
// payload: {hand: [{},{},{}] Array<Card> }
export const set_player1_hand = createAction(SET_PLAYER1_HAND);
// payload: {hand: [{},{},{}] Array<Card> }
export const set_player1_hp = createAction(SET_PLAYER1_HP);
// payload: {hp: 75 <number> }
export const set_player1_mp = createAction(SET_PLAYER1_MP);
// payload: {mp: 50 <mumber> }
export const set_player1_def = createAction(SET_PLAYER1_DEF);
// payload: {defence: 10 <number> }
export const set_player2_hand = createAction(SET_PLAYER2_HAND);
// payload: {hand: [{},{},{}] Array<Card> }
export const set_player2_hp = createAction(SET_PLAYER2_HP);
// payload: {hp: 75 <number> }
export const set_player2_mp = createAction(SET_PLAYER2_MP);
// payload: {mp: 50 <mumber> }
export const set_player2_def = createAction(SET_PLAYER2_DEF);
// payload: {defence: 10 <number> }
export const move_player1_x_position = createAction(MOVE_PLAYER1_X_POSITION);
// payload: {x: 1 <number> }
export const move_player1_y_position = createAction(MOVE_PLAYER1_Y_POSITION);
// payload: {y: 1 <number> }
export const move_player2_x_position = createAction(MOVE_PLAYER2_X_POSITION);
// payload: {x: 1 <number> }
export const move_player2_y_position = createAction(MOVE_PLAYER2_Y_POSITION);
// payload: {y: 1 <number> }
export const field_reset = createAction(FIELD_RESET);
export const field_activation = createAction(FIELD_ACTIVATION);
// payload: {field: ...[[{effect:true},{},{},{}],[],[]] Array<Array<object>> }
export const set_using_card = createAction(SET_USING_CARD);
// payload: {usingCard: <Card> }

const initialState = {
  Instance: class Character {
    name: string;
    hp: number;
    mp: number;
    def: number;
    deck: Array<object>;
    hand: Array<Card>;
    position: object;
    isAction: boolean;

    constructor(name: string, deck: Array<Card>) {
      this.name = name;
      this.hp = 100;
      this.mp = 100;
      this.def = 0;
      this.deck = deck;
      this.hand = [
        CARD_DICTIONARY.NONE,
        CARD_DICTIONARY.NONE,
        CARD_DICTIONARY.NONE,
      ];
      this.position = { x: 0, y: 1 };
      this.isAction = false;
    }
  },
  createCharacter: function (name: string, sequenceNum: number) {
    const character = new initialState.Instance(name, Deck1);
    if (name === '세키') character.deck = Seki_Deck;
    if (name === '레티') character.deck = Reti_Deck;

    if (sequenceNum === 1) {
      character.position = { x: 0, y: 1 };
    } else {
      character.position = { x: 3, y: 1 };
    }
    return character;
  },
  player1: {},
  player2: {},
  userhand: [CARD_DICTIONARY.NONE, CARD_DICTIONARY.NONE, CARD_DICTIONARY.NONE],
  usingCard: null,
  isTurn: false,
  field: [
    [
      { effect: false },
      { effect: false },
      { effect: false },
      { effect: false },
    ],
    [
      { effect: false },
      { effect: false },
      { effect: false },
      { effect: false },
    ],
    [
      { effect: false },
      { effect: false },
      { effect: false },
      { effect: false },
    ],
  ],
  checkHand: function (card: Card) {
    let hand = store.getState().Battle.userhand;
    for (let i = 0; i < hand.length; i++) {
      if (hand[i].id === card.id) {
        return true;
      }
    }
    return false;
  },
  nextTurn: function (
    setPlayer1: Dispatch<object>,
    setPlayer2: Dispatch<object>,
    setField: Dispatch<Array<object>>,
    setIsUsing: Dispatch<Array<Array<boolean>>>,
  ) {
    let firstPhase = false;
    let middlePhase = false;
    let lastPhase = false;
    let continueTurn = false;
    let player1Hand = store.getState().Battle.player1.hand;
    let player2Hand = store.getState().Battle.player2.hand;

    firstPhase = !firstPhase;
    if (firstPhase) {
      initialState.phase(
        PhaseNumber.FIRST,
        player1Hand,
        player2Hand,
        setPlayer1,
        setPlayer2,
        setField,
        setIsUsing,
      );
    }
    setTimeout(() => {
      middlePhase = initialState.turnCheck(setField);
      if (middlePhase) {
        initialState.phase(
          PhaseNumber.MIDDLE,
          player1Hand,
          player2Hand,
          setPlayer1,
          setPlayer2,
          setField,
          setIsUsing,
        );
      }
    }, 2000);
    setTimeout(() => {
      if (middlePhase) {
        lastPhase = initialState.turnCheck(setField);
      }
      if (lastPhase) {
        initialState.phase(
          PhaseNumber.LAST,
          player1Hand,
          player2Hand,
          setPlayer1,
          setPlayer2,
          setField,
          setIsUsing,
        );
      }
    }, 4000);
    setTimeout(() => {
      if (lastPhase) {
        continueTurn = initialState.turnCheck(setField);
        if (continueTurn) {
          let player1Mp = store.getState().Battle.player1.mp + 15
          store.dispatch(set_player1_mp({ mp: player1Mp }))
          let player2Mp = store.getState().Battle.player2.mp + 15
          store.dispatch(set_player2_mp({ mp: player2Mp }))
          store.dispatch(set_is_turn());
        }
      }
    }, 6000);
  },
  phase(
    phaseNumber: PhaseNumber,
    player1Hand: Array<Card>,
    player2Hand: Array<Card>,
    setPlayer1: Dispatch<object>,
    setPlayer2: Dispatch<object>,
    setField: Dispatch<Array<Array<object>>>,
    setIsUsing: Dispatch<Array<Array<boolean>>>,
  ) {
    const isUsings = [
      [
        [false, true],
        [false, false],
        [true, false],
      ],
      [
        [false, false],
        [true, true],
        [false, false],
      ],
      [
        [true, false],
        [false, false],
        [false, true],
      ],
    ];
    store.dispatch(set_player1_def({ def: 0 }));
    store.dispatch(set_player2_def({ def: 0 }));
    setIsUsing(isUsings[phaseNumber].slice(0));
    if (player1Hand[phaseNumber].speed <= player2Hand[phaseNumber].speed) {
      initialState.cardAction(
        true,
        player1Hand[phaseNumber],
        setPlayer1,
        setPlayer2,
        setField,
      );
      setTimeout(
        () =>
          initialState.cardAction(
            false,
            player2Hand[phaseNumber],
            setPlayer1,
            setPlayer2,
            setField,
          ),
        1000,
      );
    } else {
      initialState.cardAction(
        false,
        player2Hand[phaseNumber],
        setPlayer1,
        setPlayer2,
        setField,
      );
      setTimeout(
        () =>
          initialState.cardAction(
            true,
            player1Hand[phaseNumber],
            setPlayer1,
            setPlayer2,
            setField,
          ),
        1000,
      );
    }
  },
  cardAction(
    isUser: boolean,
    card: Card,
    setPlayer1: Dispatch<object>,
    setPlayer2: Dispatch<object>,
    setField: Dispatch<Array<Array<object>>>,
  ) {
    store.dispatch(field_reset());
    setField(store.getState().Battle.field);
    setPlayer1(store.getState().Battle.player1);
    setPlayer2(store.getState().Battle.player2);
    store.dispatch(set_using_card({ usingCard: card }));
    if (isUser) {
      switch (card.type) {
        case CARD_DICTIONARY.UP.type:
          store.getState().SoundControl.playMoveSound()
          let upY = store.getState().Battle.player1.position.y - 1;
          if (upY < 0) upY = 0;
          store.dispatch(move_player1_y_position({ y: upY }));
          setPlayer1({ ...store.getState().Battle.player1 });
          break;
        case CARD_DICTIONARY.DOWN.type:
          store.getState().SoundControl.playMoveSound()
          let downY = store.getState().Battle.player1.position.y + 1;
          if (downY > 2) downY = 2;
          store.dispatch(move_player1_y_position({ y: downY }));
          setPlayer1({ ...store.getState().Battle.player1 });
          break;
        case CARD_DICTIONARY.LEFT.type:
          store.getState().SoundControl.playMoveSound()
          let leftX = store.getState().Battle.player1.position.x - 1;
          if (leftX < 0) leftX = 0;
          store.dispatch(move_player1_x_position({ x: leftX }));
          setPlayer1({ ...store.getState().Battle.player1 });
          break;
        case CARD_DICTIONARY.RIGHT.type:
          store.getState().SoundControl.playMoveSound()
          let rightX = store.getState().Battle.player1.position.x + 1;
          if (rightX > 3) rightX = 3;
          store.dispatch(move_player1_x_position({ x: rightX }));
          setPlayer1({ ...store.getState().Battle.player1 });
          break;
        case 'ATT':
          let mana = store.getState().Battle.player1.mp - card.cost;
          store.dispatch(set_player1_mp({ mp: mana }));
          setPlayer1({ ...store.getState().Battle.player1, isAction: true });

          let effectiveRangeX = null;
          let effectiveRangeY = null;
          let player1Position = store.getState().Battle.player1.position;
          let player2Position = store.getState().Battle.player2.position;
          let field = store.getState().Battle.field;
          let cardRange = (cardRanges as any)[card.range]
          for (let i = 0; i < cardRange.length; i++) {
            effectiveRangeX = player1Position.x + cardRange[i][0];
            effectiveRangeY = player1Position.y + cardRange[i][1];
            if (
              effectiveRangeX <= 3 &&
              effectiveRangeX >= 0 &&
              effectiveRangeY <= 2 &&
              effectiveRangeY >= 0 &&
              field[effectiveRangeY][effectiveRangeX]
            ) {
              field[effectiveRangeY][effectiveRangeX].effect = true;
              if (
                effectiveRangeX === player2Position.x &&
                effectiveRangeY === player2Position.y
              ) {
                store.getState().SoundControl.playHitSound()
                if(store.getState().Battle.player2.def) {
                  store.getState().SoundControl.playGuardSound()
                }
                let hp =
                  store.getState().Battle.player2.hp -
                  (card.power - store.getState().Battle.player2.def);
                store.dispatch(
                  set_player2_hp({
                    hp: hp,
                  }),
                );
                store.dispatch(set_player2_def({ def: 0 }));
                setPlayer2({ ...store.getState().Battle.player2 });
              }
            }
            store.dispatch(field_activation({ field: field.slice(0, 3) }));
            setField(store.getState().Battle.field);
          }
          break;
        case CARD_DICTIONARY.MANA_UP.type:
          store.getState().SoundControl.playManaUpSound()
          setPlayer1({ ...store.getState().Battle.player1, isAction: true });
          let mp = store.getState().Battle.player1.mp + 15;
          if (mp >= 100) mp = 100;
          store.dispatch(
            set_player1_mp({
              mp,
            }),
          );
          break;
        case CARD_DICTIONARY.GUARD.type:
          setPlayer1({ ...store.getState().Battle.player1, isAction: true });
          store.dispatch(
            set_player1_def({
              def: 15,
            }),
          );
          break;
      }
    } else {
      switch (card.type) {
        case CARD_DICTIONARY.UP.type:
          store.getState().SoundControl.playMoveSound()
          let upY = store.getState().Battle.player2.position.y - 1;
          if (upY < 0) upY = 0;
          store.dispatch(move_player2_y_position({ y: upY }));
          setPlayer2({ ...store.getState().Battle.player2 });
          break;
        case CARD_DICTIONARY.DOWN.type:
          store.getState().SoundControl.playMoveSound()
          let downY = store.getState().Battle.player2.position.y + 1;
          if (downY > 2) downY = 2;
          store.dispatch(move_player2_y_position({ y: downY }));
          setPlayer2({ ...store.getState().Battle.player2 });
          break;
        case CARD_DICTIONARY.LEFT.type:
          store.getState().SoundControl.playMoveSound()
          let leftX = store.getState().Battle.player2.position.x - 1;
          if (leftX < 0) leftX = 0;
          store.dispatch(move_player2_x_position({ x: leftX }));
          setPlayer2({ ...store.getState().Battle.player2 });
          break;
        case CARD_DICTIONARY.RIGHT.type:
          store.getState().SoundControl.playMoveSound()
          let rightX = store.getState().Battle.player2.position.x + 1;
          if (rightX > 3) rightX = 3;
          store.dispatch(move_player2_x_position({ x: rightX }));
          setPlayer2({ ...store.getState().Battle.player2 });
          break;
        case 'ATT':
          let mana = store.getState().Battle.player2.mp - card.cost;
          store.dispatch(set_player2_mp({ mp: mana }));
          store.dispatch(set_using_card({ usingCard: card }));
          setPlayer2({ ...store.getState().Battle.player2, isAction: true });

          let effectiveRangeX = null;
          let effectiveRangeY = null;
          let player2Position = store.getState().Battle.player2.position;
          let player1Position = store.getState().Battle.player1.position;
          let field = store.getState().Battle.field;
          let cardRange = (cardRanges as any)[card.range]
          for (let i = 0; i < cardRange.length; i++) {
            effectiveRangeX = player2Position.x + cardRange[i][0];
            effectiveRangeY = player2Position.y + cardRange[i][1];
            if (
              effectiveRangeX <= 3 &&
              effectiveRangeX >= 0 &&
              effectiveRangeY <= 2 &&
              effectiveRangeY >= -1 &&
              field[effectiveRangeY][effectiveRangeX]
            ) {
              field[effectiveRangeY][effectiveRangeX].effect = true;
              if (
                effectiveRangeX === player1Position.x &&
                effectiveRangeY === player1Position.y
              ) {
                store.getState().SoundControl.playHitSound()
                if(store.getState().Battle.player1.def) {
                  store.getState().SoundControl.playGuardSound()
                }
                let hp =
                  store.getState().Battle.player1.hp -
                  (card.power - store.getState().Battle.player1.def);
                store.dispatch(
                  set_player1_hp({
                    hp: hp,
                  }),
                );
                store.dispatch(set_player1_def({ def: 0 }));
                setPlayer1({ ...store.getState().Battle.player1 });
              }
            }
            store.dispatch(field_activation({ field: field.slice(0, 3) }));
            setField(store.getState().Battle.field);
          }
          break;
        case CARD_DICTIONARY.MANA_UP.type:
          store.getState().SoundControl.playManaUpSound()
          setPlayer2({ ...store.getState().Battle.player2, isAction: true });
          let mp = store.getState().Battle.player2.mp + 15;
          if (mp >= 100) mp = 100;
          store.dispatch(
            set_player2_mp({
              mp,
            }),
          );
          break;
        case CARD_DICTIONARY.GUARD.type:
          setPlayer2({ ...store.getState().Battle.player2, isAction: true });
          store.dispatch(
            set_player2_def({
              def: 15,
            }),
          );
          break;
      }
    }
  },
  // autoCardSet: function () {
  //   let cardSet: Array<Card> = [];
  //   let player1 = store.getState().Battle.player1;
  //   let player2 = store.getState().Battle.player2;
  //   let mana = store.getState().Battle.player2.mp;

  //   const checkHand = function (card: Card) {
  //     for (let i = 0; i < cardSet.length; i++) {
  //       if (cardSet[i].id === card.id) {
  //         return false;
  //       }
  //     }
  //     return true;
  //   };

  //   if (
  //     player1.position.y < player2.position.y &&
  //     checkHand(CARD_DICTIONARY.UP)
  //   ) {
  //     cardSet.push(CARD_DICTIONARY.UP);
  //   }
  //   if (
  //     player1.position.y > player2.position.y &&
  //     checkHand(CARD_DICTIONARY.DOWN)
  //   ) {
  //     cardSet.push(CARD_DICTIONARY.DOWN);
  //   }
  //   if (
  //     player1.position.x < player2.position.x &&
  //     checkHand(CARD_DICTIONARY.LEFT)
  //   ) {
  //     cardSet.push(CARD_DICTIONARY.LEFT);
  //   }
  //   if (
  //     player1.position.x > player2.position.x &&
  //     checkHand(CARD_DICTIONARY.RIGHT)
  //   ) {
  //     cardSet.push(CARD_DICTIONARY.RIGHT);
  //   }
  //   if (Math.abs(player1.position.x - player2.position.x) <= 1) {
  //     if (mana >= 15) {
  //       mana = mana - 15;
  //       cardSet.push(CARD_DICTIONARY.ATT1);
  //     }
  //     if (mana < 15) {
  //       cardSet.push(CARD_DICTIONARY.MANA_UP);
  //     }
  //   }
  //   if (Math.abs(player1.position.x - player2.position.x) <= 1) {
  //     if (mana >= 25) {
  //       mana = mana - 25;
  //       cardSet.push(CARD_DICTIONARY.ATT2);
  //     }
  //     if (mana < 25 && checkHand(CARD_DICTIONARY.MANA_UP)) {
  //       cardSet.push(CARD_DICTIONARY.MANA_UP);
  //     }
  //   }
  //   if (
  //     Math.abs(player1.position.x - player2.position.x) <= 1 &&
  //     Math.abs(player1.position.y - player2.position.y) <= 1
  //   ) {
  //     if (mana >= 25) {
  //       mana = mana - 25;
  //       cardSet.push(CARD_DICTIONARY.ATT3);
  //     }
  //     if (mana < 25 && checkHand(CARD_DICTIONARY.MANA_UP)) {
  //       cardSet.push(CARD_DICTIONARY.MANA_UP);
  //     }
  //   }
  //   if (player1.position === player2.position) {
  //     if (mana >= 45) {
  //       mana = mana - 45;
  //       cardSet.push(CARD_DICTIONARY.ATT4);
  //     }
  //     if (mana < 45 && checkHand(CARD_DICTIONARY.MANA_UP)) {
  //       cardSet.push(CARD_DICTIONARY.MANA_UP);
  //     }
  //   }
  //   if (checkHand(CARD_DICTIONARY.GUARD)) {
  //     cardSet.push(CARD_DICTIONARY.GUARD);
  //   }
  //   if (mana < 15) {
  //     if (
  //       player1.position.y < player2.position.y &&
  //       checkHand(CARD_DICTIONARY.DOWN)
  //     ) {
  //       cardSet.push(CARD_DICTIONARY.DOWN);
  //     }
  //     if (
  //       player1.position.y > player2.position.y &&
  //       checkHand(CARD_DICTIONARY.UP)
  //     ) {
  //       cardSet.push(CARD_DICTIONARY.UP);
  //     }
  //     if (
  //       player1.position.x <= player2.position.x &&
  //       checkHand(CARD_DICTIONARY.RIGHT)
  //     ) {
  //       cardSet.push(CARD_DICTIONARY.RIGHT);
  //     }
  //     if (
  //       player1.position.x >= player2.position.x &&
  //       checkHand(CARD_DICTIONARY.LEFT)
  //     ) {
  //       cardSet.push(CARD_DICTIONARY.LEFT);
  //     }
  //   }
  //   if (checkHand(CARD_DICTIONARY.MANA_UP)) {
  //     cardSet.push(CARD_DICTIONARY.MANA_UP);
  //   }
  //   store.dispatch(set_player2_hand({ hand: cardSet.slice(0, 3) }));
  // },
  turnCheck: function (setField: Dispatch<Array<Array<object>>>) {
    let player1Hp = store.getState().Battle.player1.hp;
    let player2Hp = store.getState().Battle.player2.hp;
    if (player2Hp <= 0 && player1Hp <= 0) {
      store.getState().SoundControl.playDrawSound()
      store.dispatch(
        handleModalActions.setModalContent({
          content: '무승부 했다.',
        }),
      );
      store.dispatch(handleModalActions.set_is_link());
      store.dispatch(handleModalActions.setModalIsOpen({ isOpen: true }));
      store.dispatch(field_reset());
      setField(store.getState().Battle.field);
      store.dispatch(set_turn_false());
      return false;
    } 
    if (player2Hp <= 0) {
      if(store.getState().Socket.roomInfo.player1 === store.getState().Auth.userId) {
        store.getState().SoundControl.playWinSound()
      } else { 
        store.getState().SoundControl.playLoseSound()
      }
      store.dispatch(
        handleModalActions.setModalContent({
          content:
            store.getState().Socket.roomInfo.player1name + '가 이겼다.',
        }),
      );
      store.dispatch(handleModalActions.set_is_link());
      store.dispatch(handleModalActions.setModalIsOpen({ isOpen: true }));
      store.dispatch(field_reset());
      setField(store.getState().Battle.field);
      store.dispatch(set_turn_false());
      return false;
    }
    if (player1Hp <= 0) {
      if(store.getState().Socket.roomInfo.player2 === store.getState().Auth.userId) {
        store.getState().SoundControl.playWinSound()
      } else { 
        store.getState().SoundControl.playLoseSound()
      }
      store.dispatch(
        handleModalActions.setModalContent({
          content: store.getState().Socket.roomInfo.player2name + '가 이겼다.',
        }),
      );
      store.dispatch(handleModalActions.set_is_link());
      store.dispatch(handleModalActions.setModalIsOpen({ isOpen: true }));
      store.dispatch(field_reset());
      setField(store.getState().Battle.field);
      store.dispatch(set_turn_false());
      return false;
    }
    return true;
  },
  clearHand: function () {
    store.dispatch(
      set_player1_hand({
        hand: [
          CARD_DICTIONARY.NONE,
          CARD_DICTIONARY.NONE,
          CARD_DICTIONARY.NONE,
        ].slice(0, 3),
      }),
    );
  },
};

export default function Battle(state: any = initialState, action: any) {
  switch (action.type) {
    case SELECT_PLAYER1:
      return {
        ...state,
        player1: initialState.createCharacter(action.payload.name, 1),
      };
    case SELECT_PLAYER2:
      return {
        ...state,
        player2: initialState.createCharacter(action.payload.name, 2),
      };
    case SET_TURN_TRUE:
      return {
        ...state,
        isTurn: true,
      };
    case SET_TURN_FALSE:
      return {
        ...state,
        isTurn: false,
      };
    case SET_IS_TURN:
      return {
        ...state,
        isTurn: !state.isTurn,
      };
    case SET_USER_HAND:
      return {
        ...state,
        userhand: action.payload.hand,
      };
    case SET_PLAYER1_HAND:
      return {
        ...state,
        player1: {
          ...state.player1,
          hand: action.payload.hand,
        },
      };
    case SET_PLAYER1_HP:
      return {
        ...state,
        player1: { ...state.player1, hp: action.payload.hp },
      };
    case SET_PLAYER1_MP:
      return {
        ...state,
        player1: { ...state.player1, mp: action.payload.mp },
      };
    case SET_PLAYER1_DEF:
      return {
        ...state,
        player1: {
          ...state.player1,
          def: action.payload.def,
        },
      };
    case SET_PLAYER2_HAND:
      return {
        ...state,
        player2: {
          ...state.player2,
          hand: action.payload.hand,
        },
      };
    case SET_PLAYER2_HP:
      return {
        ...state,
        player2: { ...state.player2, hp: action.payload.hp },
      };
    case SET_PLAYER2_MP:
      return {
        ...state,
        player2: { ...state.player2, mp: action.payload.mp },
      };
    case SET_PLAYER2_DEF:
      return {
        ...state,
        player2: {
          ...state.player2,
          def: action.payload.def,
        },
      };
    case MOVE_PLAYER1_X_POSITION:
      return {
        ...state,
        player1: {
          ...state.player1,
          position: { ...state.player1.position, x: action.payload.x },
        },
      };
    case MOVE_PLAYER1_Y_POSITION:
      return {
        ...state,
        player1: {
          ...state.player1,
          position: { ...state.player1.position, y: action.payload.y },
        },
      };
    case MOVE_PLAYER2_X_POSITION:
      return {
        ...state,
        player2: {
          ...state.player2,
          position: { ...state.player2.position, x: action.payload.x },
        },
      };
    case MOVE_PLAYER2_Y_POSITION:
      return {
        ...state,
        player2: {
          ...state.player2,
          position: { ...state.player2.position, y: action.payload.y },
        },
      };
    case FIELD_RESET:
      return {
        ...state,
        field: [
          [
            { effect: false },
            { effect: false },
            { effect: false },
            { effect: false },
          ],
          [
            { effect: false },
            { effect: false },
            { effect: false },
            { effect: false },
          ],
          [
            { effect: false },
            { effect: false },
            { effect: false },
            { effect: false },
          ],
        ].slice(0, 3),
      };
    case FIELD_ACTIVATION:
      return {
        ...state,
        field: action.payload.field,
      };
    case SET_USING_CARD:
      return {
        ...state,
        usingCard: action.payload.usingCard,
      };
    default:
      return state;
  }
}
