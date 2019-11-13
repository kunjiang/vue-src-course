class VNode {
  constructor( tag, data, value, type ) {
    this.tag = tag && tag.toLowerCase();
    this.data = data;
    this.value = value;
    this.type = type;
    this.children = [];
  }

  appendChild ( vnode ) {
    this.children.push( vnode );
  }
}
