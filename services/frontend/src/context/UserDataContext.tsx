import { secondsUntilNextAction } from "@shared/logics/time";
import { Color, Coordinate, getTileKey, Tile } from "@shared/models/game";
import {
  MsgBroadcastNewPixel,
  MsgBroadcastNewPixelKind,
  MsgBroadcastRemovedPixels,
  MsgBroadcastRemovedPixelsKind,
  MsgError,
  MsgErrorKind,
  MsgUserPixel,
  MsgUserPixelKind,
  MsgUserPixelValidation,
  MsgUserPixelValidationKind,
} from "@shared/models/socketMessages";
import { createContext, createEffect, createSignal, JSX, on, onCleanup, onMount, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { HttpRequest } from "../communications/httpRequest";
import { CONSTS } from "../models/constants";
import { getTokenFromUserMachine, persistTokenInUserMachine } from "../persistences/localStorage";
import { io, Socket } from "socket.io-client";
import { ENV_VARIABLES } from "../generated/constants_env";
import { getCoordinateToPixelValue } from "../logics/pixel";
import { NotificationType, useNotification } from "./NotificationContext";
import { TokenResponse } from "../../../shared/models/login";

export interface UserDataContextState {
  zoom: number;
  coordinate: Coordinate | undefined; // Pixel
  selectedCoordinate: Coordinate | undefined; // Pixel
  selectedColor: Color | undefined;
  isAuthenticated: boolean;
  isReadyForAction: boolean;
  lastActionEpochtime: EpochTimeStamp | undefined;
  userToken: TokenResponse | undefined;
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
  setUserToken: (token: TokenResponse | undefined) => void;
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
  const http = new HttpRequest();
  const notification = useNotification();
  const [state, setState] = createStore<UserDataContextState>(initialValue);
  const [socketReady, setSocketReady] = createSignal(false);
  let socket: Socket | undefined = undefined;

  const listenUserToken = () => state.userToken;
  createEffect(
    on(listenUserToken, (token: TokenResponse | undefined) => {
      console.log("Trying to initialize Socket.io");
      // Initialize only once the user has an access token
      if (socket === undefined && token !== undefined) {
        console.log("---> Socket.io: Done");
        socket = io(`${ENV_VARIABLES.SERVER_IP}:${ENV_VARIABLES.DOCKER_SERVER_PORT_FORWARD}`, {
          transports: ["websocket"],
          query: { access_token: token.accessToken },
        });
        setSocketReady(true);
      }
    }),
  );

  createEffect(() => {
    if (socketReady()) {
      console.log("Trying to set Socket.io listening with on()");
      if (socket !== undefined) {
        console.log("---> Socket.io listening with on(): Done");
        socket.on(MsgErrorKind, (error: MsgError) => {
          console.error("From server:", error);
        });

        /**
         * Needed because we cannot solely rely on the response from the server since the user
         * might have many devices connected to the server (many sockets).
         **/
        socket.on(MsgUserPixelValidationKind, (response: MsgUserPixelValidation) => {
          console.log("From server Confirmation:", response);
          manageResponseFromMsgUserPixel(response);
        });

        socket.on(MsgBroadcastNewPixelKind, (newPixel: MsgBroadcastNewPixel) => {
          console.log("From server Broadcast:", newPixel);
          newPixel.tile.coordinate = getCoordinateToPixelValue(newPixel.tile.coordinate); // Convert from coordinate to pixel
          actions.addTile(newPixel.tile);
        });

        socket.on(MsgBroadcastRemovedPixelsKind, (removedTiles: MsgBroadcastRemovedPixels) => {
          console.log("From server Broadcast:", removedTiles);
          for (const tile of removedTiles.tiles) {
            state.tiles.delete(getTileKey(tile));
          }
        });

        socket.on("disconnect", () => {
          console.log("UserDataContext> Socket.io disconnected");
          notification?.setMessage({
            message: "Refresh the page to reconnect to the server",
            type: NotificationType.Error,
          });
        });
        socket.on("connect_error", () => {
          console.log("UserDataContext> Socket.io Connect_Error");
          setTimeout(async () => {
            if (state.userToken !== undefined) {
              try {
                const refreshResponse = await http.refreshToken({
                  id: state.userToken.id,
                  refreshToken: state.userToken.refreshToken,
                });

                actions.setUserToken(refreshResponse);
                setTimeout(async () => {
                  if (socket !== undefined) {
                    // Give some time for the new refresh token to be in the state
                    socket.connect();
                  }
                }, 1000);
              } catch (e: unknown) {
                notification?.setMessage({
                  message: "You need to login again",
                  type: NotificationType.Error,
                });
              }
            }
          }, 1000); // Give some time before trying to reconnect
        });
      }
    }
  });

  onMount(async () => {
    const token = getTokenFromUserMachine();
    if (token !== undefined) {
      actions.setUserToken(token);
    }

    // Fetch all existing tiles from the server

    const tiles = await http.getAllTiles();
    const tiles2 = tiles.tiles.map((i) => {
      i.coordinate = getCoordinateToPixelValue(i.coordinate);
      return [getTileKey(i), i];
    });
    setState({
      tiles: new Map(tiles2 as any),
    });
  });

  onCleanup(() => {
    if (socket !== undefined) {
      socket.close();
    }
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
          const response = await http.getLastUserAction({ accessToken: state.userToken.accessToken });
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
    setUserToken: (token: TokenResponse | undefined) => {
      setState({ userToken: token });
      persistTokenInUserMachine(token);
      if (token !== undefined) {
        actions.setIsAuthenticated(token.accessToken !== "");
      }
    },
    submitSocketMessage: (message: MsgUserPixel) => {
      console.log("SubmitSocketMessage", socket);
      if (socket !== undefined) {
        socket.emit(MsgUserPixelKind, message, (response: MsgUserPixelValidation) => {
          console.log("From server Confirmation:", response);
          manageResponseFromMsgUserPixel(response);
        });
      }
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

  function manageResponseFromMsgUserPixel(response: MsgUserPixelValidation): void {
    if (response.status === "ok") {
      const newTile: Tile = {
        color: response.colorBeforeRequest,
        coordinate: getCoordinateToPixelValue(response.coordinate),
        time: response.last ?? Date.now().valueOf(),
        userId: response.userId,
      };

      actions.addTile(newTile);
      actions.setLastActionEpochtime(response.last);
      actions.setSelectedColor(undefined);
      notification?.setMessage({ message: "Pixel submitted successfully" });
    } else {
      // 1) Set back the pixel to the original color
      // - Nothing to do, haven't change it
      // 2) Popup message error
      notification?.setMessage({ message: "Pixel submission failed" });
      // 3) Reset the time for last action
      // - Nothing to do, the last action has not been changed
    }
  }
}

export function useUserData(): UserDataContextModel | undefined {
  return useContext(UserDataContext);
}
