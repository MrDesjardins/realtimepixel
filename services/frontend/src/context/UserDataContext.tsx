import { secondsUntilNextAction } from "@shared/logics/time";
import { Color, Coordinate, getTileKey, Tile } from "@shared/models/game";
import {
  MsgBroadcastNewPixel,
  MsgBroadcastNewPixelKind,
  MsgError,
  MsgErrorKind,
  MsgUserPixel,
  MsgUserPixelKind,
  MsgUserPixelValidation,
  MsgUserPixelValidationKind,
} from "@shared/models/socketMessages";
import { Token } from "@shared/models/primitive";
import { createContext, JSX, onMount, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { HttpRequest } from "../communications/httpRequest";
import { CONSTS } from "../models/constants";
import { getTokenFromUserMachine, persistTokenInUserMachine } from "../persistences/localStorage";
import { io } from "socket.io-client";
import { ENV_VARIABLES } from "../generated/constants_env";
import { HTTP_STATUS } from "../../../shared/constants/backend";
import { getCoordinateToPixelValue } from "../logics/pixel";

export interface UserDataContextState {
  zoom: number;
  coordinate: Coordinate | undefined; // Pixel
  selectedCoordinate: Coordinate | undefined; // Pixel
  selectedColor: Color | undefined;
  isAuthenticated: boolean;
  isReadyForAction: boolean;
  lastActionEpochtime: EpochTimeStamp | undefined;
  userToken: Token | undefined;
  tiles: Map<string, Tile>;
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
  submitSocketMessage: (message: MsgUserPixel) => void;
  addTile: (tile: Tile) => void;
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
  tiles: new Map<string, Tile>(),
};
export const UserDataContext = createContext<UserDataContextModel>();

export function UserDataProvider(props: UserDataContextProps): JSX.Element {
  const [state, setState] = createStore<UserDataContextState>(initialValue);
  const socket = io(`${ENV_VARIABLES.SERVER_IP}:${ENV_VARIABLES.DOCKER_SERVER_PORT_FORWARD}`, {
    transports: ["websocket"],
  });
  socket.on(MsgErrorKind, (error: MsgError) => {
    console.error("From server:", error);
  });
  // socket.on(MsgUserPixelValidationKind, (confirmation: MsgUserPixelValidation) => {
  //   console.log("From server Confirmation:", confirmation);
  //   if (confirmation.status === "ok") {
  //     actions.setLastActionEpochtime(confirmation.last);
  //     actions.setSelectedColor(undefined);
  //     // Todo: Popup message success
  //   } else {
  //     // 1) Set back the pixel to the original color
  //     // 2) Popup message error
  //     // Todo: popup message error
  //     // 3) Reset the time for last action
  //   }
  // });

  socket.on(MsgBroadcastNewPixelKind, (newPixel: MsgBroadcastNewPixel) => {
    console.log("From server Broadcast:", newPixel);
    newPixel.tile.coordinate = getCoordinateToPixelValue(newPixel.tile.coordinate); // Convert from coordinate to pixel
    actions.addTile(newPixel.tile);
  });

  onMount(async () => {
    const token = getTokenFromUserMachine();
    if (token !== undefined) {
      actions.setUserToken(token);
    }

    // Fetch all existing tiles from the server
    const http = new HttpRequest();
    const tiles = await http.getAllTiles();
    const tiles2 = tiles.tiles.map((i) => {
      i.coordinate = getCoordinateToPixelValue(i.coordinate);
      return [getTileKey(i), i];
    });
    setState({
      tiles: new Map(tiles2 as any),
    });
  });

  // Update every second the status "is ready for action"
  setInterval(() => {
    const last = state.lastActionEpochtime;
    if (last !== undefined) {
      // Undefined means that the user has not yet retrieved its last time
      const t = secondsUntilNextAction(last);
      const readyForAction = t <= 0;
      // console.log("Time==>", t, readyForAction, state.isReadyForAction);
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
      if (isAuthenticated && state.userToken !== undefined) {
        // Get the latest action for the authenticated user
        try {
          const http = new HttpRequest();
          const response = await http.getLastUserAction({ accessToken: state.userToken });
          setState({ lastActionEpochtime: response.last });
        } catch (e) {
          // Something wrong happen, ensure we do not keep a stale cookie
          actions.setUserToken(undefined);
        }
      }
    },
    setLastActionEpochtime: (time: EpochTimeStamp | undefined) => {
      setState({ lastActionEpochtime: time });
    },
    setUserToken: (token: Token | undefined) => {
      setState({ userToken: token });
      persistTokenInUserMachine(token);
      if (token !== undefined) {
        actions.setIsAuthenticated(token !== "");
      }
    },
    submitSocketMessage: (message: MsgUserPixel) => {
      socket.emit(MsgUserPixelKind, message, (response: MsgUserPixelValidation) => {
        console.log("From server Confirmation:", response);
        if (response.status === "ok") {
          actions.setLastActionEpochtime(response.last);
          actions.setSelectedColor(undefined);
          // Todo: Popup message success
        } else {
          // 1) Set back the pixel to the original color
          // 2) Popup message error
          // Todo: popup message error
          // 3) Reset the time for last action
        }
      });
    },
    addTile: (tile: Tile) => {
      const newMap = new Map(state.tiles);
      newMap.set(getTileKey(tile), tile);
      setState({ tiles: newMap });
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
