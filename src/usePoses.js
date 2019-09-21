import { useRef, useState } from "react";
import useAsyncEffect from "use-async-effect";

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

export const usePoses = (ref, options = {}) => {
  const [poses, setPoses] = useState([]);
  const model = useModel(posenet, options);
  useAsyncEffect(
    async () => {
      if (!model) return null;
      // const poses = [await model.estimateSinglePose(ref.current)];
      const poses = await model.estimateMultiplePoses(ref.current);
      requestAnimationFrame(() => {
        setPoses(poses.map(mapPoses));
      });
    },
    [model, poses]
  );
  return poses;
};