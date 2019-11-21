
export function isPrimaryType( value ) {
  let type = typeof value;
  return type === 'number' ||
         type === 'string' || 
         type === 'boolean';
}

export function isFunction( value ) {
  return typeof value === 'function';
}

export function isObject( value ) {
  return typeof value === 'object';
}

export function gettype( value ) {
  if ( isPrimaryType( value ) ) {
    return typeof value;
  }
  if ( isFunction( value ) ) {
    return 'Function';
  }
  if ( value.type && typeof value.type === 'function' ) {
    return value.type();
  }
  // [object Object]
  return Object.prototype.toString.call( value ).slice( 8 ).slice( 0, -1 );
}