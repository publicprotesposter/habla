import Page from '../Page'

class Upload extends Page{
    constructor( p ){
        super( p )
        // document.querySelector( '.souvenirNavi' ).addEventListener( 'click', () => this.emit( 'updateFlow' , { action : 'souvenirRequest', data : { } } ) )
    }

    onEnterPage(){
        if( window.inLocal ) return console.log('not send because local')
        var vector = document.getElementsByTagName( 'svg' )[ 0 ]
        fetch('https://susurros.herokuapp.com/upload',{ 
            method: 'post', 
            body: JSON.stringify( { 
                data : new XMLSerializer().serializeToString( vector ),
                title : 'title',
                description : 'un' || ''
            } ),
            headers: {'Content-Type': 'application/json'}
            
        } ).then( (response) => { 
            if( response.status == 200 ) return response.json()
        } )
        .then( ( myJson ) => {
            window.posterId = myJson.file
        })
    }
}

export { Upload as default}