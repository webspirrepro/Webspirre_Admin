// hooks/usePersistToken.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";
import useLocalStorage from "./useLocalStorage";

const usePersistToken = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const [persist] = useLocalStorage("persist", true);

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };
    // Check if access token is not available and persist is enabled
    if (!auth?.user_metadata?.access_token && persist) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [auth, refresh]);

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`aT: ${JSON.stringify(auth?.user_metadata?.access_token)}`);
  }, [isLoading, auth]);

  // useEffect(() => {
  //   // Redirect to login if token is not present
  //   if (!auth || !auth.access_token || !isLoading) {
  //     // Added null check for auth
  //     router.push("/login");
  //   }
  // }, [auth]);

  return { isLoading, persist };
};

export default usePersistToken;
