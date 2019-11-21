
export default class ToJSONString extends String {
  toString() {
    return `"${ this.valueOf() }"`;
  }
}

export function createToJSONString( target ) {
  return new ToJSONString( target );
}