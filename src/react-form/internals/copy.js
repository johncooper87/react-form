function copyObject(target) {
  const newObject = {};
  for (const key in target) newObject[key] = copy(target[key]);
  return newObject;
}

export function copy(target) {
  if (target instanceof Array) return target.map(copy);
  if (target instanceof Object && target.constructor === Object) return copyObject(target);
  return target;
}

