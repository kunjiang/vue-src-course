

export default class ToJSONArray extends Array {
  type () {
    return 'ToJSONArray';
  }
  toString() {
    return `[${this.join( ',' )}]`;
  }
}
