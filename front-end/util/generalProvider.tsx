'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { Spinner } from 'flowbite-react';
import { usePathname } from 'next/navigation';

type NotificationPromptType = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  open: (message: string) => void;
  destroy: (message?: string) => void;
};

interface GeneralContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isButtonLoading: boolean;
  setIsButtonLoading: (loading: boolean) => void;
  notification: NotificationPromptType;
}

const notificationInstance: NotificationPromptType = {
  success: (message) => console.log(`Success: ${message}`),
  error: (message) => console.error(`Error: ${message}`),
  info: (message) => console.info(`Info: ${message}`),
  warning: (message) => console.warn(`Warning: ${message}`),
  open: (message) => console.log(`Open: ${message}`),
  destroy: (_?: string) => console.log(`Notification destroyed`)
};

const GeneralContext = createContext<GeneralContextType | undefined>(undefined);

export const GeneralProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const pathname = usePathname(); // 👈 Detect route changes

  const notificationPrompt: NotificationPromptType = {
    success: (msg) => {
      notificationInstance.success(msg);
    },
    error: (msg) => {
      notificationInstance.error(msg);
    },
    info: (msg) => {
      notificationInstance.info(msg);
    },
    warning: (msg) => {
      notificationInstance.warning(msg);
    },
    open: (msg) => {
      notificationInstance.open(msg);
    },
    destroy: () => {
      notificationInstance.destroy();
    }
  };

  // 👇 Spinner on route change
  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 200); // delay for smoother spinner

    return () => clearTimeout(timeout);
  }, [pathname]); // re-run on route change

  return (
    <GeneralContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isButtonLoading,
        setIsButtonLoading,
        notification: notificationPrompt
      }}
    >
      {isLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <Spinner size="xl" />
          <p className="text-center mt-2">Loading...</p>
        </div>
      )}
      
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneralContext = () => {
  const context = useContext(GeneralContext);
  if (!context) {
    throw new Error("useGeneralContext must be used within a GeneralProvider");
  }
  return context;
};