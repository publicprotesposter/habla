import EventEmitter from 'EventEmitter'

class Page extends EventEmitter{
    constructor( node ){
        super()
        this.node = node
    }

    onEnterPage(){
    
    }

    // onLeavePage(){
    //     console.log( 'bye' )
    // }
}

export { Page as default }