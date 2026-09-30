// import { useCallback, useEffect, useState } from 'react';

// function useScroll(HEIGHT: number) {
//   const [scrolled, setScrolled] = useState(false);

//   const scrollMonitor = useCallback(() => {
//     setScrolled(window.scrollY >= HEIGHT);
//     console.log('window.scrollY', window.scrollY);
//   }, [HEIGHT]);

//   useEffect(() => {
//     window.addEventListener('scroll', scrollMonitor);
//     return () => {
//       window.removeEventListener('scroll', scrollMonitor);
//     };
//   }, [scrollMonitor]);
//   return scrolled;
// }

// export default useScroll;

import { useCallback, useEffect, useState } from 'react';

function useScroll(ref: React.RefObject<HTMLDivElement>, HEIGHT: number) {
  const [scrolled, setScrolled] = useState(false);

  // console.log('scrolled', scrolled);

  const scrollMonitor = useCallback(() => {
    if (ref.current) {
      setScrolled(ref.current.scrollTop >= HEIGHT);
      // console.log('scrollTop', ref.current.scrollTop);
    }
  }, [ref, HEIGHT]);

  useEffect(() => {
    const current = ref.current;
    if (current) {
      current.addEventListener('scroll', scrollMonitor);
    }
    return () => {
      if (current) {
        current.removeEventListener('scroll', scrollMonitor);
      }
    };
  }, [scrollMonitor, ref]);

  return scrolled;
}

export default useScroll;
