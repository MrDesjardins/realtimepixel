import { JSX, createContext, createSignal, useContext, Accessor } from "solid-js";
import { CONSTS } from "../models/constants";
import { Color, Coordinate } from "../models/game";

export interface UserDataContextModel extends UserDataContextValues, UserDataContextActions {}
export interface UserDataContextValues {
  zoom: Accessor<number>;
  coordinate: Accessor<Coordinate | undefined>;
  selectedCoordinate: Accessor<Coordinate | undefined>;
  selectedColor: Accessor<Color | undefined>;
  isAuthenticated: Accessor<boolean>;
}
export interface UserDataContextActions {
  setZoom: (zoom: number) => void;
  setCoordinate: (coord: Coordinate | undefined) => void;
  setSelectedCoordinate: (coord: Coordinate | undefined) => void;
  setSelectedColor: (color: Color | undefined) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
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
      console.log("Saving the selection", coord);
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
  };
  return <UserDataContext.Provider value={store}>{props.children}</UserDataContext.Provider>;
}

export function useUserData(): UserDataContextModel | undefined {
  return useContext(UserDataContext);
}
