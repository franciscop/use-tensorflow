import { useState } from "react";
import useAsyncEffect from "use-async-effect";

import useRefData from "./useRefData";
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
  const [objects, setObjects] = useState(null);
  const model = useModel(cocoSsd, options);
  const data = useRefData(ref);
  useAsyncEffect(
    async isMounted => {
      if (!model) return null;
      if (!data) return null;

      const objects = await model.detect(data);
      if (!isMounted()) return;
      // Give it some breathing room between infinite loops
      requestAnimationFrame(() => {
        setObjects(objects.map(mapObjects));
      });
    },
    [model, data, objects]
  );
  return objects;
};
