import { isPrimaryType, gettype } from './utils/index';
import { createToJSONString } from './type/ToJSONString';
import ToJSONObject from './type/ToJSONObject';
import ToJSONArray from './type/ToJSONArray';


export default function toJSON( target ) {
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