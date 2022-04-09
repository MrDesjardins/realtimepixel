import { JSX, createContext, createSignal, useContext } from "solid-js";

export interface ControlContextModel extends ControlContextActions {}
export interface ControlContextValues {
  isDragging: boolean;
  isClicking: boolean;
}
export interface ControlContextActions {
  setIsDragging: (isDragging: boolean) => void;
  setIsClicking: (isClicking: boolean) => void;
  getIsDragging: () => boolean;
  getIsClicking: () => boolean;
}

export interface ControlContextProps {
  children: JSX.Element;
}

export const ControlContext = createContext<ControlContextModel>();

export function ControlProvider(props: ControlContextProps) {
  const [model, setModel] = createSignal<ControlContextValues>({
    isClicking: false,
    isDragging: false,
  });

  const actions: ControlContextActions = {
    setIsClicking: (isClicking: boolean) => {
      setModel((prev) => {
        return { ...prev, isClicking };
      });
    },
    setIsDragging: (isDragging: boolean) => {
      setModel((prev) => {
        return { ...prev, isDragging };
      });
    },
    getIsClicking: () => {
      return model().isClicking;
    },
    getIsDragging: () => {
      return model().isDragging;
    },
  };

  return (
    <ControlContext.Provider value={actions}>
      {props.children}
    </ControlContext.Provider>
  );
}

/**
 * Hook to access the SensorsContext
 */
export function useControl(): ControlContextModel | undefined {
  return useContext(ControlContext);
}
