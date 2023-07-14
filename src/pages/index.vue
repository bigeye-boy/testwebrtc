<script setup>
import { createSocket, sendWSPush, socketLogin } from '@/utils/websocket';
import { onMounted, ref,toRaw } from 'vue';
const connect = () => {
    createSocket('wss://safana-neom-hcso.api.emotechlab.com/nc1render10/');
}
const RTCConfig = ref('')
const iceOffer = ref({})
const localOffer = ref({})
let peerConnect = null
let iceCandidateArr = []
let Status = ref('unconnected')
window.addEventListener('onmessageWS', (e) => {
    try {
        let iceobj = JSON.parse(e.detail.data)
        if (iceobj.type == 'config') {
            RTCConfig.value = JSON.stringify(iceobj.peerConnectionOptions)
            console.log('The account password:',RTCConfig.value );
            setTimeout(() => {
                initPeer(iceobj.peerConnectionOptions)
            }, 3000);
            
        }
        if (iceobj.type == 'offer') {
            iceOffer.value = iceobj
            setTimeout(() => {
                sendOffer()
            }, 4000);
            
        }
        if (iceobj.type == 'iceCandidate') {
            iceCandidateArr.push(iceobj.candidate)

        }
    } catch (error) {

    }
});
let streams = null
let StreamArr = []
const initPeer = (config) => {
    config = toRaw(config)
    console.log("config", config);
    peerConnect = new RTCPeerConnection(config)
    streams && streams.getTracks().forEach((track) => {
        console.log('添加track',track);
        peerConnect.addTrack(track, streams)
    })
    peerConnect.onconnectionstatechange =  (event) => {
        console.log('连接状态：', peerConnect.connectionState);
        Status.value = peerConnect.connectionState
        if (peerConnect.connectionState == 'connected') {
            // openCam()
        }
    };

    peerConnect.onicecandidate = (event) => {
        console.log('onicecandidate',event);
        if (event.candidate !== null) {
            sendWSPush({
                type: 'iceCandidate',
                candidate:event.candidate
            });
        }
    };
    console.log('初始化完成', peerConnect);
    
    peerConnect.ontrack = (track) => {
        console.log('track',track);
        if (track.track.kind === 'video') { 
           
            StreamArr.push(track.track)
            setStream()
        }
        if (track.track.kind === 'audio') {
            StreamArr.push(track.track)
            setStream()
        }
        
    }

    peerConnect.addEventListener('addstream', event => {
            console.log('addstream事件触发', event.stream);
    })
}
const setStream = () => {
    if (StreamArr.length == 2) {
        let combined = new MediaStream([StreamArr[0], StreamArr[1]]);
        let recorder = new MediaRecorder(combined);
        console.log(recorder);
        const video = document.getElementById('remoteVideo')
        video.srcObject = recorder.stream
    }
}
const incoming = ref('')
const submit = () => {
    console.log('发送输入框内容');
    // p.signal(JSON.parse(incoming.value))
}


const openCam = async () => {
    new window.VConsole();
    Status.value = 'Waiting'
    window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((stream) => {
            console.log('stream', stream.getTracks());
            streams = stream
            var video = document.getElementById('localVideo')
            if ('srcObject' in video) {
                video.srcObject = stream
                video.play()
            }
            connect()
            // streams.getTracks().forEach((track) => {
            //     peerConnect.addTrack(track, streams)
            // })
        })
}

const sendOffer = async () => {
    // console.log('send remote Offer signal: ',JSON.stringify(iceOffer.value));
    await peerConnect.setRemoteDescription(iceOffer.value);
    const answer = await peerConnect.createAnswer();
    console.log('answer@@',answer);
    await peerConnect.setLocalDescription(answer);
    sendWSPush(answer)
    for (let i = 0; i < iceCandidateArr.length; i++) {
        await peerConnect.addIceCandidate(iceCandidateArr[i])
    }
    
}
const reset = () => {
    location.reload()
}
</script>
<template>
    <div class="container mx-auto">
        <div class="space-x-6 flex items-center">
        <!-- <div @click="openCam()" class="p-4 bg-blue text-white">Open Camera</div> -->
        <div @click="openCam()" class="p-4 bg-blue text-white">Connect Safana</div>
        <div @click="reset()" class="p-4 bg-amber text-white">Reset</div>
        <div class="text-lg text-lightBlue">{{ Status }}</div>
        <!-- <button @click="connectSdp()" class="p-4 bg-blue">连接远程 SDP</button> -->
        <!-- <button @click="sendOffer()" class="p-4 bg-blue">发送对方Offer</button> -->
        </div>

    <div >
        <div class="flex space-x-6">
        <!-- <div>
            <div>config:</div>
            <textarea class="border-2 border-#000 w-full h-100px" v-model="RTCConfig"></textarea>
        </div> -->
        <!-- <div>
            <div>提交信息</div>
            <textarea class="border-2 border-#000 w-500px h-200px" v-model="incoming"></textarea>
        </div> -->
        <!-- <button class="p-4 bg-blue" @click="submit">submit</button> -->
        </div>
        <div class="flex md:flex-row flex-col md:w-xl">
            <video src="" id="localVideo" class="w-full flex-1 mt-4" autoplay controls></video>
            <video id="remoteVideo" src="" class="w-full flex-1  mt-4" autoplay controls></video>
        </div>

    </div>
    </div>
    
</template>
<route lang="yaml">
    meta:
      layout: blank
</route>
<style>
</style>