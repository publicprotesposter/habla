import Page from './../Page'

class Record extends Page{
    constructor( p ){
        super( p )
        
        this.but = document.getElementById('recordBut')
        this.isRecording = false
        this.but.addEventListener( 'click', () => this.toggleRecord() )
        this.mediaRecorder = null
        this.recordTimer = null
        this.stream = null
        this.input = null
        this.audioNode = null
        this.encoder = null
        this.posterCopy = null
    }

    startRecording( stream ){
        this.isRecording = true

        var AudioContext = window.AudioContext || window.webkitAudioContext
        var audio_context = new AudioContext

        
        this.input = audio_context.createMediaStreamSource(stream);
        this.stream = stream
        if(this.input.context.createJavaScriptNode) this.audioNode = this.input.context.createJavaScriptNode(4096, 1, 1);
		else if(this.input.context.createScriptProcessor) this.audioNode = this.input.context.createScriptProcessor(4096, 1, 1);
        else console.error('Could not create audio node for JavaScript based Audio Processing.');
        
        this.encoder.postMessage({ cmd: 'init', config: { samplerate: 44100, bps: 16, channels: 1, compression:5 } });

        
		this.audioNode.onaudioprocess = (e) => {
            // console.log( e.playbackTime )
            var int = Math.floor( e.playbackTime )
            var res = e.playbackTime - Math.floor( e.playbackTime.toFixed( 2 ) )
            this.node.querySelector( '.timeElapsed' ).innerHTML = '00:' + ("00" + int ).slice(-2) + ':' + ("00" + res ).slice(-2)
			if (!this.isRecording) return;
		    this.encoder.postMessage({ cmd: 'encode', buf: e.inputBuffer.getChannelData(0)});
		};
 
		this.input.connect(this.audioNode);
		this.audioNode.connect(audio_context.destination);
        this.recordTimer = setTimeout( () => this.stopRecording(), 10000 )
        this.node.classList.add('recording')
        this.but.classList.add( 'recording' )
    }

    stopRecording(){
    
        if (!this.isRecording) return
		var tracks = this.stream.getAudioTracks()
		for(var i = tracks.length - 1; i >= 0; --i) tracks[i].stop();
		this.isRecording = false
		this.encoder.postMessage({ cmd: 'finish' });

		this.input.disconnect();
		this.audioNode.disconnect();
        this.input = this.audioNode = null;
        
        this.node.classList.remove('recording')
        this.node.classList.add('analyizing')
        this.but.classList.remove( 'recording' )
    }

    toggleRecord(){
        if( !this.isRecording ){
            this.encoder = new Worker('./../encoder.js')
            this.encoder.onmessage = (e) => {
                if (e.data.cmd == 'end') {	
                    console.log('made it ghere')			
                    this.forceDownload(e.data.buf);
                    this.encoder.terminate();
                    this.encoder = null;	
                }
            };
            navigator.mediaDevices.getUserMedia( { audio: true, video: false } ).then( ( stream ) => this.startRecording( stream ) )
        } else {
            this.stopRecording()
        }
    }

    forceDownload( blob ){
        var reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = () => {
            var audioData = reader.result.replace(/^data:audio\/flac;base64,/,'');             
            fetch('https://cors-anywhere.herokuapp.com/https://susurros.herokuapp.com/api',{ 
            // fetch('http://localhost:5000/debug',{ 
            method: 'POST', 
            body: JSON.stringify( { data : audioData } ),
            headers:{ 'Content-Type': 'application/json' }
            } ).then( (response) => { 
                if( response.status == 200 ) return response.text()
            } )
            .then( ( myJson ) => {
                this.posterCopy = myJson
                this.nextPage()
            })
        }   
    }

    nextPage(){
        this.emit( 'updateFlow' , { action : 'speechRecorded', data : { copy : this.posterCopy } } )
    }

    onEnterPage(){
        document.querySelector( '#footer' ).dataset.navitype = 'blockNext'
    }
}

export { Record as default}