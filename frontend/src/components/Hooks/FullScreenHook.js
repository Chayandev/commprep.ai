import { useEffect } from 'react';

const useFullScreen = () => {
  useEffect(() => {
    // Function to trigger full-screen mode
    const enterFullScreen = () => {
      const docElm = document.documentElement;

      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) { // Firefox
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) { // Chrome, Safari, Opera
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) { // IE/Edge
        docElm.msRequestFullscreen();
      }
    };

    // Trigger full-screen when the component mounts
    enterFullScreen();

    return () => {
      // Optionally, exit full-screen on cleanup or when the component is unmounted
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    };
  }, []);
};

export default useFullScreen;
