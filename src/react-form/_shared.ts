import BranchNode from "./Branch";
import InputNode from "./Input";
import RootNode from "./Root";

export function getOrCreateInputNode(parent: RootNode | BranchNode, name: string) {
  const path = name.split('.');
  let _parent: RootNode | BranchNode = parent;
  for (let i = 0; i < path.length - 1; i++) {
    const _name = path[i];
    if (!parent.children.has(_name)) _parent = new BranchNode(_parent, _name);
    else _parent = _parent.children.get(_name) as BranchNode;
  }
  return new InputNode(_parent, path[path.length - 1]);
}