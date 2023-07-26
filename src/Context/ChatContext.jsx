import { createContext, useContext, useReducer, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
    selectedUser: null,
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        const newChatId =
          currentUser?.uid > action.payload.uid
            ? currentUser.uid + action.payload.uid
            : action.payload.uid + currentUser.uid;

        return {
          ...state, // Keep all existing state properties
          user: action.payload,
          chatId: newChatId,
        };

      case "SELECT_USER":
        return {
          ...state,
          selectedUser: action.payload,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  // useEffect hook to update chatId when selectedUser changes
  useEffect(() => {
    if (state.selectedUser && currentUser) {
      const newChatId =
        currentUser.uid > state.selectedUser.uid
          ? currentUser.uid + state.selectedUser.uid
          : state.selectedUser.uid + currentUser.uid;
      dispatch({ type: "CHANGE_USER", payload: state.selectedUser });
    }
  }, [currentUser, state.selectedUser]);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
