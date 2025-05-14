
import * as React from "react";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant: "default" | "destructive" | "success" | "warning";
};

type ToastActionElement = React.ReactElement<{
  altText: string;
  onClick: () => void;
}>;

// Update ToasterType to match the actual implementation
type ToasterType = {
  toasts: ToasterToast[];
  toast: (data: {
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: ToastActionElement;
    variant?: "default" | "destructive" | "success" | "warning";
    duration?: number;
  }) => { id: string; dismiss: () => void; update: (props: ToasterToast) => void };
  dismiss: (id?: string) => void;
  dismissAll: () => void;
};

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
  DISMISS_ALL: "DISMISS_ALL",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % 1000000;
  return `toast-${count}-${Date.now()}`;
}

type Action =
  | {
      type: typeof actionTypes.ADD_TOAST;
      toast: ToasterToast;
    }
  | {
      type: typeof actionTypes.UPDATE_TOAST;
      toast: Partial<ToasterToast>;
      id: string;
    }
  | {
      type: typeof actionTypes.DISMISS_TOAST;
      toastId?: string;
    }
  | {
      type: typeof actionTypes.REMOVE_TOAST;
      toastId?: string;
    }
  | {
      type: typeof actionTypes.DISMISS_ALL;
    };

interface State {
  toasts: ToasterToast[];
}

const toastReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;
      
      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId ? { ...t } : t
          ),
        };
      }

      return {
        ...state,
        toasts: state.toasts.map((t) => ({ ...t })),
      };
    }

    case actionTypes.REMOVE_TOAST: {
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    }

    case actionTypes.DISMISS_ALL:
      return {
        ...state,
        toasts: state.toasts.map((t) => ({ ...t })),
      };

    default:
      return state;
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = toastReducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// Improved toast function with better default styling and clearer behaviors
export function toast({
  title,
  description,
  action,
  variant = "default",
  duration = 5000,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive" | "success" | "warning";
  duration?: number;
}) {
  const id = genId();

  // Add the toast to the state
  const dismiss = () => dispatch({
    type: actionTypes.DISMISS_TOAST,
    toastId: id,
  });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      id,
      title,
      description,
      action,
      variant,
    },
  });

  // Set a timeout to dismiss the toast after `duration`
  const timer = setTimeout(() => {
    dismiss();
  }, duration);

  // Cleanup timeout when toast is dismissed
  toastTimeouts.set(id, timer);

  return {
    id,
    dismiss,
    update: (props: ToasterToast) =>
      dispatch({
        type: actionTypes.UPDATE_TOAST,
        id,
        toast: props,
      }),
  };
}

// Create specialized toast methods for common use cases
toast.success = (title: string, description?: string) => {
  return toast({ 
    title, 
    description, 
    variant: "success",
    duration: 3000 
  });
};

toast.error = (title: string, description?: string) => {
  return toast({ 
    title, 
    description, 
    variant: "destructive",
    duration: 5000 
  });
};

toast.warning = (title: string, description?: string) => {
  return toast({ 
    title, 
    description, 
    variant: "warning",
    duration: 4000 
  });
};

toast.info = (title: string, description?: string) => {
  return toast({ 
    title, 
    description, 
    variant: "default",
    duration: 3000 
  });
};

export function useToast(): ToasterType {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    toasts: state.toasts,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
    dismissAll: () => dispatch({ type: actionTypes.DISMISS_ALL }),
  };
}
