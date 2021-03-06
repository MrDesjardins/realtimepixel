import { JSX, createContext, createSignal, useContext, Accessor } from "solid-js";

export interface ControlContextModel extends ControlContextValues, ControlContextActions {}
export interface ControlContextValues {
  isDragging: Accessor<boolean>;
  isClicking: Accessor<boolean>;
  isHelpOpen: Accessor<boolean>;
}
export interface ControlContextActions {
  setIsDragging: (isDragging: boolean) => void;
  setIsClicking: (isClicking: boolean) => void;
  setIsHelpOpen: (isHelpOpen: boolean) => void;
}

export interface ControlContextProps {
  children: JSX.Element;
}

export const ControlContext = createContext<ControlContextModel>();

export function ControlProvider(props: ControlContextProps) {
  const [isDragging, setIsDragging] = createSignal<boolean>(false);
  const [isClicking, setIsClicking] = createSignal<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = createSignal<boolean>(false);

  const actions: ControlContextModel = {
    setIsClicking: (isClicking: boolean) => {
      setIsClicking(isClicking);
    },
    setIsDragging: (isDragging: boolean) => {
      setIsDragging(isDragging);
    },
    setIsHelpOpen: (isHelpOpen: boolean) => {
      setIsHelpOpen(isHelpOpen);
    },
    isClicking,
    isDragging,
    isHelpOpen,
  };

  return <ControlContext.Provider value={actions}>{props.children}</ControlContext.Provider>;
}

/**
 * Hook to access the SensorsContext
 */
export function useControl(): ControlContextModel | undefined {
  return useContext(ControlContext);
}
