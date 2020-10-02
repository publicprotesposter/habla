import Page from '../Page'

import dump from './../galleryDump.json'

class Gallery extends Page{
    constructor( p ){
        super( p )
        
        
    }

    fetchGallery(){
        var api_key = 'AIzaSyC8y5mzWn4GeKgezS4_s1j0OZ4wg5cATVY';
        var folderId = '1ol-3_PGZ226BbCBIGMcQPTZB0f96LX0a';
        var url = "https://cors-anywhere.herokuapp.com/https://www.googleapis.com/drive/v2/files?q='" + folderId + "'+in+parents&key=" + api_key + "&orderBy=modifiedDate desc";
        fetch(url).then(function(response) { return response.json(); }).then( (myJson) => {
            myJson.items.forEach( f => {
                console.log( f )
                if( f.mimeType == 'image/svg+xml' ) this.addItem( f )
            })
        });
    }

    fetchLocal(){
        dump.items.forEach( f => {
            if( f.mimeType == 'image/svg+xml' ) this.addItem( f )
        })
    }

    onEnterPage(){
        this.fetchGallery()
        
    }

    addItem( f ){

        var list = this.node.querySelector( 'ul' )

        var listItem = document.createElement( 'li' )
        listItem.classList.add( 'block', 'clearfix' )

        var topContainer = document.createElement( 'div' )
        topContainer.classList.add( 'title', 'clearfix' )
        listItem.appendChild( topContainer )

        var date = document.createElement( 'span' )
        date.classList.add( 'date' )
        var d = new Date( f.createdDate )
        date.innerHTML = d.getDate().toString().padStart( 2, "0" ) + '.' + ( d.getMonth() + 1 ).toString().padStart( 2, "0" ) + '.' + ( d.getFullYear().toString().substring(2, 4) )
        topContainer.appendChild( date )
        
        var util = document.createElement( 'span' )
        util.classList.add( 'util' )
        topContainer.appendChild( util )
        util.innerHTML = ' '

        var imgCont = document.createElement( 'div' )
        imgCont.classList.add( 'imgCont' )
        listItem.appendChild( imgCont )
        imgCont.style.backgroundImage = 'url( "https://drive.google.com/uc?id=' + f.id + '" )'
        
        var signature = document.createElement( 'div' )
        signature.classList.add( 'signature' )
        imgCont.appendChild( signature )
        

        list.appendChild( listItem )
        
    }
}

export { Gallery as default }