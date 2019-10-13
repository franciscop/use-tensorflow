import { useEffect, useRef, useState } from "react";

export default ref => {
  const img = useRef(null);
  const [data, setData] = useState(null);
  const current = ref && ref.current;

  // This should only be used onMount and keep state afterwards
  useEffect(
    () => {
      const id = setInterval(() => {
        const clear = () => clearInterval(id);
        if (!current) return clear;

        if (current.nodeName === "IMG") {
          // Skip if it's the same image to avoid doing empty work
          if (img.current && img.current === current.src) return clear;
          img.current = current.src;
        } else if (img.current) {
          // Clean up if the previous render was an image and now it's not
          img.current = null;
        }

        // Make sure data is available before we try to do any recognition
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
        // It throws ""
        if (current.nodeName === "VIDEO") {
          // HAVE_NOTHING || HAVE_METADATA
          if (current.readyState <= 1) {
            current.addEventListener("loadeddata", function() {
              // HAVE_CURRENT_DATA || HAVE_FUTURE_DATA || HAVE_ENOUGH_DATA
              if (current.readyState >= 2) {
                setData(current);
              }
            });
            return clear;
          }
        }

        // Everything is clear, go ahead
        setData(current);

        return clear;
      }, 100);
    },
    [current]
  );

  return data;
};
