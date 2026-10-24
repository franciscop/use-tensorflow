import { useState } from "react";
import useAsyncEffect from "use-async-effect";

export default (net, options = {}) => {
  const [model, setModel] = useState(null);
  useAsyncEffect(async (isMounted) => {
    const model = await net.load(options);
    if (!isMounted()) return;
    setModel(model);
  }, []);
  return model;
};
