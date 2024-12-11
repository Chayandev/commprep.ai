import { useLocation } from "react-router-dom";

const useHideOnRoutes = () => {
  const routesToHide = [
    "/practice/reading/assessment/",
    "/practice/listening/assessment/",
    "/practice/grammar/assessment/",
    "/practice/vocabulary/assessment/",
    "/practice/speaking/assessment/",
  ];
  const location = useLocation();

  const shouldHide = routesToHide.some((route) =>
    location.pathname.startsWith(route)
  );

  return shouldHide;
};

export default useHideOnRoutes;
