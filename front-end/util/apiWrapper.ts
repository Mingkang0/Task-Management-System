'use client';
import { useGeneralContext } from "./generalProvider";
import { useCallback } from "react";

interface ApiCallback {
  apiCallback: (...args: any[]) => Promise<any>;
  args: any[];
}

interface ApiWrapperSkipModel {
  pageLoading?: boolean;
  buttonLoading?: boolean;
}

const useApiWrapper = () => {
  const generalContext = useGeneralContext();

  const apiWrapper = useCallback(
    async (apiCallbacks: ApiCallback[], isSkip?: ApiWrapperSkipModel) => {
      if(!isSkip) {
        generalContext.setIsLoading(true);
      }
      if (isSkip?.buttonLoading) {
        generalContext.setIsButtonLoading(true);
      }

      try {
        const respond = await Promise.all(
          apiCallbacks.map(({ apiCallback, args = [] }) => apiCallback(...args))
        );
        return respond;
      } catch (error: any) {
        let errorMessage = error?.response?.data?.message;

        if (typeof errorMessage !== "string") {
          errorMessage = "Please contact administrator for support.";
        }

        generalContext.notification.error(errorMessage);
        throw new Error(errorMessage);

      } finally {
        if(!isSkip?.pageLoading) {
          generalContext.setIsLoading(false);
        }

        if (isSkip?.buttonLoading) {
          generalContext.setIsButtonLoading(false);
        }
      }
    },
    [generalContext]
  );
  return { apiWrapper, isLoading: generalContext.isLoading, isButtonLoading: generalContext.isButtonLoading };
}

export default useApiWrapper;