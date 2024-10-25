// authWrapper.js (convert to a hook)
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { autoLoginUser } from "../actions/auth.actions.js";

const useAuthWrapper = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isProcessing = useSelector((state) => state.auth.isProcessing);

  useEffect(() => {

      dispatch(autoLoginUser());
    
  }, []);

  return { isAuthenticated, isProcessing };
};

export default useAuthWrapper;
