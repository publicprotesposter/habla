import Fonts from './../assets/fonts/*.otf'
import TextToSVG from 'text-to-svg'

class Poster{
    constructor(){

        let s = new Date();
        
        console.log( s.getHours().toLocaleString() % 4 );
        console.log( Math.round( s.getMinutes() / 2 ) );
        
        this.bgColors = [
            [ '#660033', '#662DF2', '#662D36', '#DE6300', '#FF3C00', '#003C00', '#5B5039', '#3A3321', '#3A1B21', '#2A033A', '#4C0000', '#3C2913', '#3C2913', '#722913', '#72294B', '#9B294B', '#C4294B', '#09294B', '#095F4B', '#095FA3', '#1D1D1B', '#1F0000', '#1F2A00', '#1F2A27', '#3E2A27', '#3E3C27', '#3E3C42', '#583C42', '#585442', '#585463'],
            [ '#0980FF', '#09800E', '#095E0E', '#09420E', '#092F0E', '#092F2B', '#5B432B', '#5B1B2B', '#271B2B', '#001B2B', '#540000', '#542600', '#542636', '#54265D', '#2D265D', '#2D035D', '#2D0382', '#2D03B1', '#8203B1', '#AC03B1', '#0910A3', '#5810A3', '#9810A3', '#98105F', '#4D105F', '#2D4516', '#D84516', '#C00B4C', '#6A0B4C', '#053863'],
            [ '#0000FF', '#0000AB', '#5E00AB', '#5E4F00', '#A34F00', '#304F00', '#304FF6', '#3034FF', '#30343D', '#303400', '#330066', '#090066', '#510042', '#770042', '#770083', '#7700AD', '#FF0000', '#FF0079', '#FF00FF', '#7D00FF', '#0000FF', '#000097', '#005C97', '#005C42', '#003142', '#763142', '#3900AD', '#D000D8', '#D0007F', '#FF0030'],
            [ '#C12D00', '#C10000', '#360000', '#362B00', '#022B00', '#022B2B', '#3A2B2B', '#552B62', '#102B62', '#8F0000', '#002000', '#083400', '#453400', '#452800', '#292800', '#522800', '#962800', '#752844', '#292844', '#004179', '#966E1F', '#914B1B', '#8E3717', '#623320', '#443124', '#2D1F13', '#454E0E', '#450E0E', '#6E0E0E', '#A90E0E']
        ]

        this.fonts = [
            [ 'TwoPointH-032ExtraLight', 'TwoPointH-096Regular', 'TwoPointH-160Bold', 'TwoPointH-192ExtraBold' ],
            [ 'TwoStrokeA21', 'TwoStrokeA22', 'TwoStrokeA23', 'TwoStrokeA24' ],
            [ 'TwoTone-TopRegular', 'TwoTone-TopBold', 'TwoTone-LeftBold', 'TwoTone-LeftRegular' ],
            [ 'TwoLineASoft-096Regular', 'TwoLineASoft-160Bold' ],
            [ 'TwoPointI-096Regular', 'TwoPointI-160Bold' ]
        ]

        var g = Math.floor( Math.random() * this.fonts.length )
        var f = Math.floor( Math.random() * this.fonts[ g ].length )
        this.font = this.fonts[ g ][ f ]
        console.log( this.font )
        this.node = document.getElementById( 'posterPreview' ).children[ 0 ]
    
        document.getElementById( 'posterPreview' ).style.backgroundColor = this.bgColors[ s.getHours().toLocaleString() % 4 ][ Math.round( s.getMinutes() / 2 ) ]

        var aligns = [ 'left', 'center', 'right' ]
        this.align = aligns[ Math.floor( Math.random( ) * aligns.length ) ]
        this.node.style['text-align'] = this.align

        this.node.style['letter-spacing'] = -2

        var sizes = [ 120 ]
        this.fontSize = sizes[ Math.floor( Math.random( ) * sizes.length ) ]
        this.node.style['font-size'] = this.fontSize + 'px'
        this.node.style['line-height'] = this.fontSize * 0.9 + 'px'
        

        new FontFace( 'selected' , 'url(' + Fonts[ this.font ]+ ' )') .load().then( ( loaded_face ) => {
            document.fonts.add( loaded_face )
            this.node.style.fontFamily = 'selected'
            
            this.node.dataset.font = 'selected'
            document.getElementById( 'posterPreview' ).style.fontFamily = 'selected'  
        })
    }


    posterExport( format = null, meta = null ){
    
        var textarea = this.node
        
        var composerText = document.getElementById( 'composerText' )
        composerText.style.width =  textarea.parentNode.getBoundingClientRect().width + 'px'
        composerText.style.height = textarea.parentNode.getBoundingClientRect().height + 'px'

        var inner = document.getElementById( 'composerInner' )
        inner.style.width =  textarea.getBoundingClientRect().width + 'px'
        inner.style.height = textarea.getBoundingClientRect().height + 'px'

        var svgns = 'http://www.w3.org/2000/svg'
        var vector = document.getElementsByTagName( 'svg' )[ 0 ]
        vector.setAttribute( 'width',  textarea.parentNode.getBoundingClientRect().width )
        vector.setAttribute( 'height', textarea.parentNode.getBoundingClientRect().height )

        const style = getComputedStyle( textarea )
        while (vector.lastChild) vector.removeChild( vector.lastChild )
        // console.log( style, style.backgroundColor )
        
        var rect = document.createElementNS( svgns, 'rect' );
        rect.setAttributeNS( null, 'width', textarea.parentNode.getBoundingClientRect().width )
        rect.setAttributeNS( null, 'height', textarea.parentNode.getBoundingClientRect().height )
        rect.setAttributeNS( null, 'fill', getComputedStyle( textarea.parentNode ).backgroundColor )
        vector.appendChild( rect )
        
        inner.style[ 'font-size' ] = textarea.style[ 'font-size' ]
        inner.dataset.font = textarea.dataset.font
        inner.style[ 'font-family' ] = textarea.dataset.font
        inner.style[ 'letter-spacing' ] = textarea.style[ 'letter-spacing' ]
        inner.style[ 'line-height' ] = textarea.style[ 'line-height' ]
        inner.style[ 'text-align' ] = textarea.style[ 'text-align' ]
        document.body.appendChild( composerText )

        var content = textarea.innerHTML.split('')
        inner.innerHTML = ''
        
        content.forEach( g => {
            var skipGlyph = false
            var s = document.createElement( 'span' )
            s.innerHTML = g
            inner.appendChild( s )
            if( g.indexOf('\n') >= 0 ){
                s.innerHTML = '<br/>'
                skipGlyph = true
            }

            if( g.indexOf(' ') >= 0 ){
                s.innerHTML = ' '
                skipGlyph = true
            }

            if( !skipGlyph ){
                TextToSVG.load( Fonts[ this.font ], ( err, textToSVG ) => {
                    const attributes = { fill: style.color }
                    const options = { 
                        x : s.offsetLeft + 15, 
                        y : s.offsetTop + 15, 
                        fontSize: parseInt( style.fontSize ), 
                        attributes: attributes,
                        anchor : 'left top'
                    }

                    var path = new DOMParser().parseFromString( textToSVG.getSVG( g, options ), 'image/svg+xml').querySelector( 'path' )
                    vector.appendChild( path )
                })
            }
        })
    }

    update( data ){

        
        this.node.innerHTML = data.copy
        while( this.node.offsetHeight > document.getElementById( 'posterPreview' ).offsetHeight * ( 0.8 - Math.random() * 0.2 ) ){
            this.fontSize -= 5
            this.node.style['font-size'] = this.fontSize + 'px'
            this.node.style['line-height'] = this.fontSize * 0.9 + 'px'
        }
        console.log( this.fontSize )
        this.posterExport()
        
    }
}


export { Poster as default }