// import RootNode from "./Root";
// import BranchNode from "./Branch";


// export default class InputNode {
//   dirty = false;
//   touched = false;
//   updateEvent = new Publisher();

//   protected parent: BranchNode | RootNode;
//   protected name: string;

//   constructor(parent: BranchNode | RootNode, name: string) {
//     this.parent = parent;
//     this.name = name;

//     this.handleChange = this.handleChange.bind(this);
//     this.handleBlur = this.handleBlur.bind(this);
//   }

//   get value() {
//     const { parent, name } = this;
//     return parent.values?.[name];
//   }

//   set value(value) {
//     const { parent, name } = this;
//     if (parent.values == null) parent.values = {};
//     parent.values[name] = value;

//     this.dirty = true;
//     parent.dispatchEvent('change', this);
//   }

//   get initialValue() {
//     const { parent, name } = this;
//     return parent.initialValues?.[name];
//   }

//   handleBlur({ relatedTarget }) {
//     if (!this.touched
//       && !relatedTarget?.attributes['data-control']
//     ) {
//       this.touched = true;
//       this.updateEvent.publish();
//     }
//   }

//   handleEvent(event: string, ...args: any[]) {

//     let shouldUpdate = false;

//     switch (event) {

//       case 'validate': {
//         const [inputNode] = args;
//         const { validate, value, parent, name } = this;
//         const error = validate(value) || parent.errors?.[name];
//         if (this.error !== error || inputNode === this) {
//           this.error = error;
//           this.update();
//         }
//       }

//       case 'reset': {
//         const [prevValue] = args;
//         shouldUpdate = this.error !== error || this.dirty || this.touched || prevValue !== this.value;
//         this.error = error;
//         this.dirty = false;
//         this.touched = false;
//       }

//       case 'submit': {
//         if (this.error && (!this.dirty || !this.touched)) {
//           this.dirty = true;
//           this.touched = true;
//           this.update();
//         }
//       }

//     }

//     return shouldUpdate;

//   }

// }