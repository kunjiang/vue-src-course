
/** 由 HTML DOM -> VNode: 将这个函数当做 compiler 函数 */
function getVNode(node) {
  let nodeType = node.nodeType;
  let _vnode = null;
  if (nodeType === 1) {
    // 元素
    let nodeName = node.nodeName;
    let attrs = node.attributes;
    let _attrObj = {};
    for (let i = 0; i < attrs.length; i++) { // attrs[ i ] 属性节点 ( nodeType == 2 )
      _attrObj[attrs[i].nodeName] = attrs[i].nodeValue;
    }
    _vnode = new VNode(nodeName, _attrObj, undefined, nodeType);

    // 考虑 node 的子元素
    let childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      _vnode.appendChild(getVNode(childNodes[i])); // 递归
    }

  } else if (nodeType === 3) {

    _vnode = new VNode(undefined, undefined, node.nodeValue, nodeType);
  }

  return _vnode;
}

/** 将虚拟 DOM 转换成真正的 DOM */
function parseVNode(vnode) {
  // 创建 真实的 DOM
  let type = vnode.type;
  let _node = null;
  if (type === 3) {
    return document.createTextNode(vnode.value); // 创建文本节点
  } else if (type === 1) {

    _node = document.createElement(vnode.tag);

    // 属性
    let data = vnode.data; // 现在这个 data 是键值对
    Object.keys(data).forEach((key) => {
      let attrName = key;
      let attrValue = data[key];
      _node.setAttribute(attrName, attrValue);
    });

    // 子元素
    let children = vnode.children;
    children.forEach(subvnode => {
      _node.appendChild(parseVNode(subvnode)); // 递归转换子元素 ( 虚拟 DOM )
    });

    return _node;
  }

}


let rkuohao = /\{\{(.+?)\}\}/g;
/** 根据路径 访问对象成员 */
function getValueByPath(obj, path) {
  let paths = path.split('.'); // [ xxx, yyy, zzz ]
  let res = obj;
  let prop;
  while (prop = paths.shift()) {
    res = res[prop];
  }
  return res;
}


/** 将 带有 坑的 Vnode 与数据 data 结合, 得到 填充数据的 VNode: 模拟 AST -> VNode */
function combine(vnode, data) {
  let _type = vnode.type;
  let _data = vnode.data;
  let _value = vnode.value;
  let _tag = vnode.tag;
  let _children = vnode.children;


  let _vnode = null;

  if (_type === 3) { // 文本节点 

    // 对文本处理
    _value = _value.replace(rkuohao, function (_, g) {
      return getValueByPath(data, g.trim()); // 除了 get 读取器
    });

    _vnode = new VNode(_tag, _data, _value, _type)

  } else if (_type === 1) { // 元素节点
    _vnode = new VNode(_tag, _data, _value, _type);
    _children.forEach(_subvnode => _vnode.appendChild(combine(_subvnode, data)));
  }

  return _vnode;
}
