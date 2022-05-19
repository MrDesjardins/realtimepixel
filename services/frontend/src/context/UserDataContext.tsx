import { isNextActionReadyForUser } from "@shared/logics/time";
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
import { io, Socket } from "socket.io-client";
import { createContext, createEffect, createSignal, JSX, on, onCleanup, onMount, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { RefreshTokenResponse, TokenResponse } from "../../../shared/models/login";
import { buildMapFromList } from "../builders/tilesBuilder";
import { HttpRequest } from "../communications/httpRequest";
import { ENV_VARIABLES } from "../generated/constants_env";
import { CONSTS } from "../models/constants";
import { getTokenFromUserMachine, persistTokenInUserMachine } from "../persistences/localStorage";
import { NotificationType, useNotification } from "./NotificationContext";

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
  removeTiles: (tiles: Tile[]) => void;
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

  /**
   * Listen to the user token, when it changes (from nothing or from a new one) we establish a new socket connection
   **/
  const listenUserToken = () => state.userToken;
  createEffect(on(listenUserToken, initializeSocket));

  /**
   * Attach socket listened once the socker is ready (initialized)
   **/
  createEffect(() => {
    if (socketReady()) {
      console.log("Trying to set Socket.io listening with on()");
      if (socket !== undefined) {
        console.log("---> Socket.io listening with on(): Done");
        socket.on(MsgErrorKind, manageErrorResponse);
        socket.on(MsgUserPixelValidationKind, manageResponseFromMsgUserPixel);
        socket.on(MsgBroadcastNewPixelKind, manageResponseFromNewPixel);
        socket.on(MsgBroadcastRemovedPixelsKind, manageResponseFromRemovePixel);
        socket.on("disconnect", socketOnDisconnect);
        socket.on("connect_error", socketConnectError);
        socket.on("error", socketError);
      }
    }
  });

  onMount(async () => {
    // 1) Get access token
    const token = getTokenFromUserMachine();
    if (token !== undefined) {
      actions.setUserToken(token);
    }

    // 2) Fetch all existing tiles from the server (Regardless of the token)
    const responseAllTiles = await http.getAllTiles();
    setState({
      tiles: buildMapFromList(responseAllTiles.tiles),
    });
  });

  onCleanup(() => {
    if (socket !== undefined) {
      socket.close();
    }
  });

  /**
   * Update every second the status "is ready for action".
   * Allows to have the UI refreshed the button status, the header next action time
   */
  setInterval(() => {
    const last = state.lastActionEpochtime;
    if (last !== undefined) {
      // Undefined means that the user has not yet retrieved its last time
      const readyForAction = isNextActionReadyForUser(last);
      // Only alter the state if there is a change (true->false or false->true)
      if (readyForAction && !state.isReadyForAction) {
        setState({ isReadyForAction: true });
      } else if (!readyForAction && state.isReadyForAction) {
        setState({ isReadyForAction: false });
      }
    }
  }, CONSTS.frequencies.isReadyForActionUpdate);

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
      if (socket !== undefined) {
        socket.emit(MsgUserPixelKind, message, (response: MsgUserPixelValidation) => {
          manageResponseFromMsgUserPixel(response);
        });
      }
    },
    addTile: (tile: Tile) => {
      const newMap = new Map(state.tiles);
      newMap.set(getTileKey(tile), tile);
      setState({ tiles: newMap });
    },
    removeTiles: (tiles: Tile[]) => {
      const newMap = new Map(state.tiles);
      for (const tile of tiles) {
        console.log("Removing tile:", tile.coordinate);
        newMap.delete(getTileKey(tile));
      }
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

  /**
   * Give some time before trying to reconnect
   **/
  function socketConnectError(): void {
    // Timeout because we only want to try once in a short time.
    // If we decide to have several retries, we should ensure to clear the timeout/interval
    setTimeout(async () => {
      if (state.userToken !== undefined) {
        try {
          const refreshResponse: RefreshTokenResponse = await http.refreshToken({
            id: state.userToken.id,
            refreshToken: state.userToken.refreshToken,
          });

          actions.setUserToken(refreshResponse);
          setTimeout(async () => {
            if (socket !== undefined) {
              // Give some time for the new refresh token to be in the state from the actions.setUserToken above
              socket.connect();
            }
          }, CONSTS.frequencies.delayAfterSet);
        } catch (e: unknown) {
          notification?.setMessage({
            message: "You need to login again",
            type: NotificationType.Error,
          });
        }
      }
    }, CONSTS.frequencies.connectionRetry);
  }

  function socketError(err: any): void {
    console.log("Socket Error", err);
  }

  function socketOnDisconnect(): void {
    notification?.setMessage({
      message: "Refresh the page to reconnect to the server",
      type: NotificationType.Error,
    });
  }

  /**
   * Handle the response from the ation of a client sending a pixel to the server
   *
   * If the response is validating the action, we change the last action epochtime to
   * be in-sync with the server. We also remove the selection of color and add the title
   * on the board
   *
   * If the response is not validating the action, we do nothing,
   * the last action remains the same old time.
   *
   * Needed because we cannot solely rely on the response from the server since the user
   * might have many devices connected to the server (many sockets).
   **/
  function manageResponseFromMsgUserPixel(response: MsgUserPixelValidation | MsgError): void {
    if (response.kind === MsgUserPixelValidationKind) {
      const newTile: Tile = {
        color: response.colorBeforeRequest,
        coordinate: response.coordinate,
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
      notification?.setMessage({ message: "Pixel submission failed. " + response.errorMessage });
      // 3) Reset the time for last action
      // - Nothing to do, the last action has not been changed
    }
  }

  function manageResponseFromNewPixel(newPixel: MsgBroadcastNewPixel): void {
    actions.addTile(newPixel.tile);
  }

  function manageResponseFromRemovePixel(removedTiles: MsgBroadcastRemovedPixels): void {
    actions.removeTiles(removedTiles.tiles);
  }

  function manageErrorResponse(error: MsgError): void {
    console.error("From server:", error);
  }

  function initializeSocket(token: TokenResponse | undefined): void {
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
  }
}

export function useUserData(): UserDataContextModel | undefined {
  return useContext(UserDataContext);
}
