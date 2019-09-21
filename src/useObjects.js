import { useRef, useState } from "react";
import useAsyncEffect from "use-async-effect";

import useModel from "./useModel";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const mapObjects = ({ score, bbox, ...obj }) => ({
  label: obj.class,
  score,
  left: Math.floor(bbox[0]),
  top: Math.floor(bbox[1]),
  width: Math.floor(bbox[2]),
  height: Math.floor(bbox[3])
});

export default (ref, options) => {
  const img = useRef(null);
  const [objects, setObjects] = useState([]);
  const model = useModel(cocoSsd, options);
  useAsyncEffect(
    async isMounted => {
      if (!model) return null;
      if (!ref.current) return null;

      if (ref.current.nodeName === "IMG") {
        // Skip if it's the same image to avoid doing empty work
        if (img.current && img.current === ref.current.src) return;
        img.current = ref.current.src;
      } else if (img.current) {
        // Clean up if the previous render was an image and now it's not
        img.current = null;
      }

      const objects = await model.detect(ref.current);
      if (!isMounted()) return;
      // Give it some breathing room between infinite loops
      requestAnimationFrame(() => {
        setObjects(objects.map(mapObjects));
      });
    },
    [model, objects]
  );
  return objects;
};
