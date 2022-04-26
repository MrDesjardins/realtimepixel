import { JSX, createContext, createSignal, useContext, Accessor, on, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { secondsUntilNextAction } from "@shared/logics/time";
import { Color } from "@shared/models/game";
import { Token } from "@shared/models/primitive";
import { CONSTS } from "../models/constants";
import { Coordinate } from "../models/game";
import { HttpRequest } from "../communications/httpRequest";

export interface UserDataContextState {
  zoom: number;
  coordinate: Coordinate | undefined;
  selectedCoordinate: Coordinate | undefined;
  selectedColor: Color | undefined;
  isAuthenticated: boolean;
  isReadyForAction: boolean;
  lastActionEpochtime: EpochTimeStamp | undefined;
  userToken: Token | undefined;
}

export interface UserDataContextModel {
  state: UserDataContextState;
  actions: UserDataContextActions;
}

export interface UserDataContextActions {
  setZoom: (zoom: number) => void;
  setCoordinate: (coord: Coordinate | undefined) => void;
  setSelectedCoordinate: (coord: Coordinate | undefined) => void;
  setSelectedColor: (color: Color | undefined) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setLastActionEpochtime: (time: EpochTimeStamp | undefined) => void;
  setUserToken: (token: Token | undefined) => void;
}

export interface UserDataContextProps {
  children: JSX.Element;
}
const initialValue: UserDataContextState = {
  zoom: CONSTS.gameBoard.defaultZoom,
  coordinate: undefined,
  selectedColor: undefined,
  selectedCoordinate: undefined,
  isAuthenticated: false,
  userToken: undefined,
  lastActionEpochtime: undefined,
  isReadyForAction: false,
};
export const UserDataContext = createContext<UserDataContextModel>();

export function UserDataProvider(props: UserDataContextProps) {
  const [state, setState] = createStore<UserDataContextState>(initialValue);

  // Update every second the status "is ready for action"
  setInterval(() => {
    const last = state.lastActionEpochtime;
    if (last !== undefined) {
      // Undefined means that the user has not yet retrieved its last time
      const t = secondsUntilNextAction(last);
      const readyForAction = t <= 0;
      console.log("Time==>", t, readyForAction, state.isReadyForAction);
      if (readyForAction && !state.isReadyForAction) {
        console.log("Setting isReadyForAction to true");
        setState({ isReadyForAction: true });
      } else if (!readyForAction && state.isReadyForAction) {
        console.log("Setting isReadyForAction to false");
        setState({ isReadyForAction: false });
      }
    }
  }, 1000);

  const actions: UserDataContextActions = {
    setZoom: (zoom: number) => {
      setState({ zoom: zoom });
    },
    setCoordinate: (coord: Coordinate | undefined) => {
      setState({ coordinate: coord });
    },
    setSelectedCoordinate: (coord: Coordinate | undefined) => {
      setState({ selectedCoordinate: coord });
    },
    setSelectedColor: (color: Color | undefined) => {
      setState({ selectedColor: color });
    },
    setIsAuthenticated: async (isAuthenticated: boolean) => {
      setState({ isAuthenticated: isAuthenticated });
      if (isAuthenticated) {
        // Get the latest action for the authenticated user
        try {
          const http = new HttpRequest();
          const response = await http.getLastUserAction({ token: state.userToken });
          if (response.last !== undefined) {
            setState({ lastActionEpochtime: response.last });
          }
        } catch (e) {
          console.error(e); //Todo: log the error in a logging system
        } finally {
        }
      }
    },
    setLastActionEpochtime: (time: EpochTimeStamp | undefined) => {
      setState({ lastActionEpochtime: time });
    },
    setUserToken: (token: Token | undefined) => {
      setState({ userToken: token });
      if (token !== undefined) {
        actions.setIsAuthenticated(token !== "");
      }
    },
  };

  return (
    <UserDataContext.Provider
      value={{
        state: state,
        actions: actions,
      }}
    >
      {props.children}
    </UserDataContext.Provider>
  );
}

export function useUserData(): UserDataContextModel | undefined {
  return useContext(UserDataContext);
}
