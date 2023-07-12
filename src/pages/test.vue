<script setup>
import { createSocket, sendWSPush, socketLogin } from '@/utils/websocket';
import { onMounted, ref,toRaw } from 'vue';
const connect = () => {
    createSocket('wss://safana-neom-hcso.api.emotechlab.com/nc1render9/');
}
const RTCConfig = ref('')
const iceOffer = ref({})
const localOffer = ref({})
let peerConnect = null
let iceCandidateArr = []
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
            }, 3000);
            
        }
        if (iceobj.type == 'iceCandidate') {
            iceCandidateArr.push(iceobj.candidate)

        }
    } catch (error) {

    }
});

const disconnect = () => {
    socket.disconnect();
}

let streams = null
const initiator = ref(false)
const initPeer = (config) => {
    config = toRaw(config)
    console.log("config", config);
    peerConnect = new RTCPeerConnection(config)

    streams && streams.getTracks().forEach((track) => {
     peerConnect.addTrack(track, streams)
    })
    peerConnect.onconnectionstatechange =  (event) => {
        console.log('连接状态：',peerConnect.connectionState);
        if (peerConnect.connectionState == 'connected') {
            openCam()
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
    console.log('初始化完成',peerConnect);
    peerConnect.ontrack = (track) => {
        console.log('track',track);
        if (track.track.kind === 'video') { 
            const video = document.getElementById('remoteVideo')
            video.srcObject = track.streams[0];
        }
    }
}

const incoming = ref('')
const outgoing = ref('')
const submit = () => {
    console.log('发送输入框内容');
}


const openCam = async() => {
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

</script>
<template>
    <!-- <div class="p-6">
        身份1：
        <select v-model="initiator" class="border p-2 border-#000">
            <option :value="true"> 发起人</option>
             <option :value="false"> 接收人</option>
        </select>
    </div> -->
    <div class="space-x-6">
        <button @click="connect()" class="p-4 bg-blue">Connect Socket</button>
        <button @click="openCam()" class="p-4 bg-blue">Open Camera</button>

    </div>

    <div>
        <div class="flex space-x-6">
        <div>
            <div>服务器配置</div>
            <textarea class="border-2 border-#000 w-500px h-200px" v-model="RTCConfig"></textarea>
        </div>
        <div>
            <div>提交信息</div>
            <textarea class="border-2 border-#000 w-500px h-200px" v-model="incoming"></textarea>
        </div>
        <button class="p-4 bg-blue" @click="submit">submit</button>
        </div>
        
        <pre id="outgoing" class="border-2 border-#000 min-h-17">{{ outgoing }}</pre>
        <div class="flex space-x-6">
            <video src="" id="localVideo" class="w-500px" autoplay controls></video>
            <video id="remoteVideo" src="" class="w-500px" autoplay controls></video>
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