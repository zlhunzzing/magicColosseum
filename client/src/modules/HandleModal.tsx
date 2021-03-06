import { createAction } from 'redux-actions';

const SET_MODAL_IS_OPEN = 'App/HandleModal/SET_MODAL_IS_OPEN';
const SET_MODAL_CONTENT = 'App/HandleModal/SET_MODAL_CONTENT';
const SET_MODAL_IS_BUTTON = 'App/HandleModal/SET_MODAL_IS_BUTTON';
const SET_ENTRY_MODAL = 'App/HandleModal/SET_ENTRY_MODAL';
const SET_IS_LINK = 'App/HandleModal/SET_IS_LINK';
const SET_LINK_TARGET = 'App/HandleModal/SET_LINK_TARGET';

export const setModalIsOpen = createAction(SET_MODAL_IS_OPEN);
// payload: {isOpen: true, false <boolean> }
export const setModalContent = createAction(SET_MODAL_CONTENT);
// payload: {content: "hello" <string> }
export const setModalIsButton = createAction(SET_MODAL_IS_BUTTON);
// payload: {isButton: true, false <boolean> }
export const set_entry_modal = createAction(SET_ENTRY_MODAL);
export const set_is_link = createAction(SET_IS_LINK);
export const set_link_target = createAction(SET_LINK_TARGET);
// payload: {linkTarget: /main (page) <string> }

const initialState = {
  modalIsOpen: false,
  modalContent: '',
  modalIsButton: true,
  entryModal: true,
  isLink: false,
  linkTarget: '',
};

export default function HandleModal(state: any = initialState, action: any) {
  switch (action.type) {
    case SET_MODAL_IS_OPEN:
      return {
        ...state,
        modalIsOpen: action.payload.isOpen,
      };
    case SET_MODAL_CONTENT:
      return {
        ...state,
        modalContent: action.payload.content,
      };
    case SET_MODAL_IS_BUTTON:
      return {
        ...state,
        modalIsButton: action.payload.isButton,
      };
    case SET_ENTRY_MODAL:
      return {
        ...state,
        entryModal: false,
      };
    case SET_IS_LINK:
      return {
        ...state,
        isLink: true,
        modalIsButton: false,
      };
    case SET_LINK_TARGET:
      return {
        ...state,
        linkTarget: action.payload.linkTarget,
      };
    default:
      return state;
  }
}
