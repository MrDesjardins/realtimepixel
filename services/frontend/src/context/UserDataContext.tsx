import { JSX, createContext, createSignal, useContext, Accessor, on, createEffect } from "solid-js";
import { secondsUntilNextAction } from "@shared/logics/time";
import { Color } from "@shared/models/game";
import { Token } from "@shared/models/primitive";
import { CONSTS } from "../models/constants";
import { Coordinate } from "../models/game";
import { HttpRequest } from "../communications/httpRequest";

export interface UserDataContextModel extends UserDataContextValues, UserDataContextActions {}
export interface UserDataContextValues {
  zoom: Accessor<number>;
  coordinate: Accessor<Coordinate | undefined>;
  selectedCoordinate: Accessor<Coordinate | undefined>;
  selectedColor: Accessor<Color | undefined>;
  isAuthenticated: Accessor<boolean>;
  isReadyForAction: Accessor<boolean>;
  lastActionEpochtime: Accessor<EpochTimeStamp | undefined>;
  userToken: Accessor<Token | undefined>;
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

export const UserDataContext = createContext<UserDataContextModel>();

export function UserDataProvider(props: UserDataContextProps) {
  const [zoom, setZoom] = createSignal<number>(CONSTS.gameBoard.defaultZoom);
  const [coordinate, setCoordinate] = createSignal<Coordinate | undefined>(undefined);
  const [selectedCoordinate, setSelectedCoordinate] = createSignal<Coordinate | undefined>(undefined);
  const [selectedColor, setSelectedColor] = createSignal<Color | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = createSignal<boolean>(false);
  const [userToken, setUserToken] = createSignal<Token | undefined>(false);
  const [lastActionEpochtime, setLastActionEpochtime] = createSignal<EpochTimeStamp | undefined>(undefined);
  const [isReadyForAction, setIsReadyForAction] = createSignal<boolean>(false);

  createEffect(
    on(isAuthenticated, async (newValue) => {
      if (newValue) {
        // Get the latest action for the authenticated user
        try {
          const http = new HttpRequest();
          const response = await http.getLastUserAction({ token: userToken });
          if (response.last !== undefined) {
            setLastActionEpochtime(response.last);
          }
        } catch (e) {
          console.error(e); //Todo: log the error in a logging system
        } finally {
        }
      }
    }),
  );

  createEffect(
    on(userToken, async (newValue: Token | undefined) => {
      if (newValue) {
        setIsAuthenticated(newValue !== "");
      }
    }),
  );

  // Update every second the status "is ready for action"
  setInterval(() => {
    const last = lastActionEpochtime();
    if (last !== undefined) { // Undefined means that the user has not yet retrieved its last time
      const t = secondsUntilNextAction(last);
      const readyForAction = t <= 0;
      // console.log("Time==>", t, readyForAction, isReadyForAction());
      if (readyForAction && !isReadyForAction()) {
        console.log("Setting isReadyForAction to true");
        setIsReadyForAction(true);
      } else if (!readyForAction && isReadyForAction()) {
        console.log("Setting isReadyForAction to false");
        setIsReadyForAction(false);
      }
    }
  }, 1000);

  const store: UserDataContextModel = {
    zoom,
    setZoom: (zoom: number) => {
      setZoom(zoom);
    },
    coordinate,
    setCoordinate: (coord: Coordinate | undefined) => {
      setCoordinate(coord);
    },
    selectedCoordinate,
    setSelectedCoordinate: (coord: Coordinate | undefined) => {
      setSelectedCoordinate(coord);
    },
    selectedColor,
    setSelectedColor: (color: Color | undefined) => {
      setSelectedColor(color);
    },
    isAuthenticated,
    setIsAuthenticated: (isAuthenticated: boolean) => {
      setIsAuthenticated(isAuthenticated);
    },
    lastActionEpochtime,
    setLastActionEpochtime: (time: EpochTimeStamp | undefined) => {
      setLastActionEpochtime(time);
    },
    isReadyForAction,
    userToken,
    setUserToken: (token: Token | undefined) => {
      setUserToken(token);
    },
  };
  return <UserDataContext.Provider value={store}>{props.children}</UserDataContext.Provider>;
}

export function useUserData(): UserDataContextModel | undefined {
  return useContext(UserDataContext);
}
