/**
 * Internal dependencies
 */
import Preview from './preview';

export default function Save( { attributes } ) {
	return (
		<div className={ `align${ attributes.align }` }>
			<Preview { ...attributes } />
		</div>
	);
}
