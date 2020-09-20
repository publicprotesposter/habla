import Fonts from './../assets/fonts/*.otf'
import TextToSVG from 'text-to-svg'

class Poster{
    constructor(){
        this.colors = [ '#000000', '#ff00ff', '#3a1c1f', '#966e1f', '#00ff00', '#eb5d40', '#660033', '#330066', '#00ffff', '#ff0000', '#003300', '#0000ff' ]
        this.fonts = [
            [ 'TwoPointH-032ExtraLight', 'TwoPointH-096Regular', 'TwoPointH-160Bold', 'TwoPointH-192ExtraBold' ],
            [ 'TwoStrokeA21', 'TwoStrokeA22', 'TwoStrokeA23', 'TwoStrokeA24' ],
            [ 'TwoTone-RightRegular', 'TwoTone-RightBold', 'TwoTone-LeftBold', 'TwoTone-LeftRegular' ]
        ]

        var g = Math.floor( Math.random() * this.fonts.length )
        var f = Math.floor( Math.random() * this.fonts[ g ].length )
        this.font = this.fonts[ g ][ f ]
        
        this.node = document.getElementById( 'posterPreview' ).children[ 0 ]
    
        document.getElementById( 'posterPreview' ).style.backgroundColor = this.colors[ Math.floor( Math.random() * this.colors.length ) ]

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
        this.posterExport()
        
    }
}


export { Poster as default }