/**
 * WordPress dependencies
 */
import { edit, globe } from '@wordpress/icons';
import {
	BlockControls,
	useBlockProps,
	AlignmentToolbar,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	ComboboxControl,
	Placeholder,
	ToolbarButton,
	ToolbarGroup,
	PanelBody,
	PanelRow,
	ToggleControl,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { select, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import countries from '../assets/countries.json';
import Preview from './preview';
import { getEmojiFlag } from './utils';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { countryCode, relatedPosts, align } = attributes;
	const options = Object.keys( countries ).map( ( code ) => ( {
		value: code,
		label: getEmojiFlag( code ) + '  ' + countries[ code ] + ' — ' + code,
	} ) );

	const [ isPreview, setPreview ] = useState();
	const [ postId, setPostId ] = useState();

	useEffect( () => {
		setPostId( select( 'core/editor' ).getCurrentPostId() );
	}, [] );

	useEffect( () => setPreview( countryCode ), [ countryCode ] );

	const handleChangeCountry = () => {
		if ( isPreview ) setPreview( false );
		else if ( countryCode ) setPreview( true );
	};

	const handleChangeCountryCode = ( newCountryCode ) => {
		if ( newCountryCode ) {
			setAttributes( {
				countryCode: newCountryCode,
				relatedPosts: [],
			} );
			setPreview( true );
		}
	};

	const posts = useSelect(
		( selects ) => {
			return selects( 'core' ).getEntityRecords( 'postType', 'post', {
				search: countries[ countryCode ],
				exclude: postId,
			} );
		},
		[ countryCode, postId ]
	);

	useEffect( () => {
		if ( posts ) {
			setAttributes( {
				relatedPosts:
					posts?.map( ( relatedPost ) => ( {
						...relatedPost,
						title: relatedPost.title?.rendered || relatedPost.link,
						excerpt: relatedPost.excerpt?.rendered || '',
					} ) ) || [],
			} );
		}
	}, [ posts, setAttributes ] );

	return (
		<div { ...useBlockProps() }>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						label={ __( 'Change Country', 'xwp-country-card' ) }
						icon={ edit }
						onClick={ handleChangeCountry }
						disabled={ ! Boolean( countryCode ) }
					/>
					<AlignmentToolbar
						value={ align }
						onChange={ ( value ) =>
							setAttributes( { align: value } )
						}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __( 'Country Card Settings', 'xwp-country-card' ) }
					intialOpen={ true }
				>
					<PanelRow>
						<ToggleControl
							label={ __( 'Change Country', 'xwp-country-card' ) }
							checked={ ! isPreview }
							onChange={ handleChangeCountry }
							disabled={ ! Boolean( countryCode ) }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			{ isPreview ? (
				<Preview
					countryCode={ countryCode }
					relatedPosts={ relatedPosts }
				/>
			) : (
				<Placeholder
					icon={ globe }
					label={ __( 'XWP Country Card', 'xwp-country-card' ) }
					isColumnLayout={ true }
					instructions={ __(
						'Type in a name of a contry you want to display on you site.',
						'xwp-country-card'
					) }
				>
					<ComboboxControl
						label={ __( 'Country', 'xwp-country-card' ) }
						hideLabelFromVision
						options={ options }
						value={ countryCode }
						onChange={ handleChangeCountryCode }
						allowReset={ true }
					/>
				</Placeholder>
			) }
		</div>
	);
}
