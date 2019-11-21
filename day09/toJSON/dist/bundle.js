(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.toJSON = factory());
}(this, (function () { 'use strict';

  function isPrimaryType( value ) {
    let type = typeof value;
    return type === 'number' ||
           type === 'string' || 
           type === 'boolean';
  }

  function isFunction( value ) {
    return typeof value === 'function';
  }

  function gettype( value ) {
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

  class ToJSONString extends String {
    toString() {
      return `"${ this.valueOf() }"`;
    }
  }

  function createToJSONString( target ) {
    return new ToJSONString( target );
  }

  class ToJSONObject extends Object {
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

  class ToJSONArray extends Array {
    type () {
      return 'ToJSONArray';
    }
    toString() {
      return `[${this.join( ',' )}]`;
    }
  }

  function toJSON( target ) {
    return trace( target ).toString();
  }


  /**
   * 这里只考虑基本类型, 数组, 和 Object 类型. 
   * @param {any} target 数据
   */
  function create( target ) {
    if ( isPrimaryType( target ) ) {
      return [ gettype( target ) === 'string' ? createToJSONString( target ) : target, true ]; 
    }
    if ( gettype( target ) === 'Object' ) {
      return [ new ToJSONObject(), false ];
    }
    if ( gettype( target ) === 'Array' ) {
      return [ new ToJSONArray(), false ];
    }
    return [null, true];
  }

  function trace( target ) {
    let [ o, isPrimary ] = create( target );
    if ( !isPrimary ) {
      let t = gettype( o );
      switch( t ) {
        case 'ToJSONObject': {
          let keys = Object.keys( target );
          for( let i = 0, len = keys.length; i < len; i++ ) {
            o[ keys[ i ] ] = trace( target[ keys[ i ] ] );
          }
        } break;

        case 'ToJSONArray': {
          for ( let i = 0, len = target.length; i < len; i++ ) {
            o[ i ] = trace( target[ i ] );
          }
        } break;
      }
    }
    return o;
  }

  return toJSON;

})));
