<script setup>
// import { state, socket } from "@/utils/socket";
import { createSocket, sendWSPush, socketLogin } from '@/utils/websocket';
import { onMounted, ref } from 'vue';
const connect = () => {
    // socket.connect();
    createSocket('wss://safana-neom-hcso.api.emotechlab.com/nc1render9/');
}
const iceConfig = ref({})
const iceOffer = ref({})
const localOffer = ref({})
let iceCandidate = null
window.addEventListener('onmessageWS', (e) => {
    try {
        let iceobj = JSON.parse(e.detail.data)
        if (iceobj.type == 'config') {
            iceConfig.value = iceobj.peerConnectionOptions
            console.log('The account password:',iceobj.peerConnectionOptions);
        }
        if (iceobj.type == 'offer') {
            iceOffer.value = iceobj
            console.log('offer: ',iceobj);
        }
        if (iceobj.type == 'iceCandidate') {
            iceCandidate = iceobj
        }
    } catch (error) {

    }
});

const disconnect = () => {
    socket.disconnect();
}

let p = null
let streams = null
const initiator = ref(false)
const initPeer = (config) => {
    console.log('init peer config:',iceConfig.value);
    p = new SimplePeer({
        initiator: initiator.value,
        trickle: false,
        // stream: (initiator.value && streams)?true:false,
        // streams:streams?[streams]:undefined,
        config: config
    })
    p.on('error', err => console.log('error', err))

    p.on('signal', data => {
        console.log('on signal: ', JSON.stringify(data))
        outgoing.value = JSON.stringify(data)
        if (data.type == 'candidate') {
            data.type = 'iceCandidate'
            sendWSPush(data)
            console.log('send Socket:',data);
        }
        else if(data.type == 'answer') {
            sendWSPush(data)
            console.log('send Socket:',data);
        }
        // else if(data.type == 'transceiverRequest'){
        //     sendWSPush(data)
        // }


        if (data.type == 'offer') {
            localOffer.value = data
            console.log('get local Offer ok');
        }

    })

    p.on('connect', () => {
        console.log('CONNECT')
        p.send('whatever' + Math.random())
        alert('连接成功！')
    })

    p.on('data', data => {
        console.log('on data: ' + data)
    })

    p.on('track', (track, stream) => {
        console.log('on track  ',track);
    })
    p.on('stream', stream => {
        console.log('on stream  ',stream);
        // got remote video stream, now let's show it in a video tag
        // if (stream.id.indexOf('video') >= 0) {
            // var video = document.getElementById('remoteVideo')
            // if ('srcObject' in video) {
            //     video.srcObject = stream
            // } else {
            //     video.src = window.URL.createObjectURL(stream) // for older browsers
            // }

            // video.play()
        // }

    })


}

const incoming = ref('')
const outgoing = ref('')
const submit = () => {
    console.log('发送输入框内容');
    p.signal(JSON.parse(incoming.value))
    // p.signal(iceCandidate)
    // p.signal(iceOffer.value)
    // sendWSPush({"name":"1","date":1688698120960,"id":1688697471083,"type":"username"}	)
}


const openCam = async() => {
    window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((stream) => {
            var video = document.getElementById('localVideo')
            console.log('stream', stream);
            streams = stream
            if ('srcObject' in video) {
                video.srcObject = stream
                video.play()
            }
            // p.addStream(stream)
        })
}

const connectSdp = () => {
    initPeer(iceConfig.value)
    // openCam()
}
const connectMockSdp = () => {
    initPeer({})
}

const sendOffer = () => {
    console.log('send remote Offer signal: ',iceOffer.value);
    p.signal(iceOffer.value)
}

const sendLocalOffer = () => {
    console.log('发送自己 Offer');
    p.signal(localOffer.value)
}

</script>
<template>
    <div class="p-6">
        身份：
        <select v-model="initiator" class="border p-2 border-#000">
            <option :value="true"> 发起人</option>
             <option :value="false"> 接收人</option>
        </select>
    </div>
    <div class="space-x-6">
        <button @click="connect()" class="p-4 bg-blue">Connect Socket</button>
        <!-- <button @click="disconnect()" class="p-4 bg-blue ml-4">Disconnect</button> -->
        <button @click="connectSdp()" class="p-4 bg-blue">连接远程 SDP</button>
        <button @click="sendOffer()" class="p-4 bg-blue">发送对方Offer</button>
        <button @click="sendLocalOffer()" class="p-4 bg-blue" v-if="initiator">发送自己 Offer</button>
        <button @click="openCam()" class="p-4 bg-blue">Open Camera</button>
        <button @click="connectMockSdp()" class="p-4 bg-blue">模拟连接SDP</button>

    </div>

    <div>
        <textarea class="border-2 border-#000 w-500px h-200px" v-model="incoming"></textarea>
        <button class="p-4 bg-blue" @click="submit">submit</button>
        <pre id="outgoing" class="border-2 border-#000">{{ outgoing }}</pre>
        <div class="flex space-x-6">
            <video src="" id="localVideo" class="w-500px"></video>
            <video id="remoteVideo" class="w-500px"></video>
        </div>

    </div>
</template>
<route lang="yaml">
    meta:
      layout: blank
</route>
<style>
#outgoing {
    width: 600px;
    word-wrap: break-word;
    white-space: normal;
}
</style>