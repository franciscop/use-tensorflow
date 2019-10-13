import { useState } from "react";
import useAsyncEffect from "use-async-effect";

import useRefData from "./useRefData";
import useModel from "./useModel";
import * as posenet from "@tensorflow-models/posenet";

const mapPoses = ({ keypoints }) => {
  const points = {};
  keypoints.forEach(({ part, position, score }) => {
    points[part] = {
      label: part,
      left: Math.floor(position.x),
      top: Math.floor(position.y),
      score
    };
  });
  return points;
};

export default (ref, options = {}) => {
  const [poses, setPoses] = useState(null);
  const model = useModel(posenet, options);
  const data = useRefData(ref);
  useAsyncEffect(
    async () => {
      if (!model) return null;
      if (!data) return null;

      const poses = await model.estimateMultiplePoses(data);
      requestAnimationFrame(() => {
        setPoses(poses.map(mapPoses));
      });
    },
    [model, data, poses]
  );
  return poses;
};
