# 0.2

Removed the empty array as default `[]`, instead it will return `null` until the model has loaded and starts working, so you can differentiate between loading and empty state:

```js
const poses = usePoses();
if (!poses) return 'Loading!';
return poses.map(...);
```

# 0.1

Initial release
