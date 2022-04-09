import {
  JSX,
  createContext,
  createSignal,
  useContext,
  Accessor,
} from "solid-js";
import { Coordinate } from "../models/game";

export interface UserDataContextModel
  extends UserDataContextValues,
    UserDataContextActions {}
export interface UserDataContextValues {
  zoom: Accessor<number>;
  coordinate: Accessor<Coordinate>;
  selectedCoordinate: Accessor<Coordinate | undefined>;
}
export interface UserDataContextActions {
  setZoom: (zoom: number) => void;
  setCoordinate: (coord: Coordinate) => void;
  setSelectedCoordinate: (coord: Coordinate | undefined) => void;
}

export interface UserDataContextProps {
  children: JSX.Element;
}

export const UserDataContext = createContext<UserDataContextModel>();

export function UserDataProvider(props: UserDataContextProps) {
  const [zoom, setZoom] = createSignal<number>(1);
  const [coordinate, setCoordinate] = createSignal<Coordinate>({ x: 0, y: 0 });
  const [selectedCoordinate, setSelectedCoordinate] = createSignal<
    Coordinate | undefined
  >(undefined);
  const store: UserDataContextModel = {
    zoom,
    setZoom: (zoom: number) => {
      setZoom(zoom);
    },
    coordinate,
    setCoordinate: (coord: Coordinate) => {
      setCoordinate(coord);
    },
    selectedCoordinate,
    setSelectedCoordinate: (coord: Coordinate | undefined) => {
      setSelectedCoordinate(coord);
    },
  };
  return (
    <UserDataContext.Provider value={store}>
      {props.children}
    </UserDataContext.Provider>
  );
}

export function useUserData(): UserDataContextModel | undefined {
  return useContext(UserDataContext);
}
