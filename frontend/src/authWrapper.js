// authWrapper.js (normal function version)
import { store } from "./app/store.js";
import { autoLoginUser } from "../actions/auth.actions.js";

const authWrapper = async () => {
  console.log("authwrapper");
  await store.dispatch(autoLoginUser());
};

export default authWrapper;
