import { useEffect } from 'react';

const useDisableHotReload = (disableOnMount) => {
  useEffect(() => {
    if (import.meta.hot && disableOnMount) {
      // This will prevent hot reloading for this module
      import.meta.hot.decline();
    }
  }, [disableOnMount]);
};

export default useDisableHotReload;
