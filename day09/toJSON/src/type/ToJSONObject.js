

export default class ToJSONObject extends Object {
  type () {
    return 'ToJSONObject';
  }
  toString() {
    let ret = [];
    let keys = Object.keys( this );
    for ( let i = 0, len = keys.length; i < len; i++ ) {
      ret.push( `"${ keys[ i ]}":${ this[ keys[ i ] ] }` );
    }
    return `{${ret.join( ',' )}}`;
  }
}
