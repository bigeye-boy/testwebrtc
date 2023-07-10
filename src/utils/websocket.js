
const getuuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          // eslint-disable-next-line no-mixed-operators
          v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

let Socket = ''
let setIntervalWesocketPush = null
let setIntervalHeartBeat = null;



/**
 * Establish a websocket connection
 * @param {string} url  wss://im-dev.neuxnet.com:8443/neuwss
 */
export const createSocket = (url="wss://safana-neom-hcso.api.emotechlab.com/nc1render9/") => {
  Socket && Socket.close()
  if (!Socket) {
    console.log('Establish a websocket connection', url)
    Socket = new WebSocket(url)
    Socket.onopen = onopenWS
    Socket.onmessage = onmessageWS
    Socket.onerror = onerrorWS
    Socket.onclose = oncloseWS
    
  } else {
    console.log('websocket connected')
  }
}

/**
 * Login */ 
export const socketLogin = ()=>{
  const formid = sessionStorage.getItem("uid");
    const time = new Date().getTime();
    const uuid = getuuid();
    const dataContent = {
      "loginUserId": formid,
      "loginToken":"867055e02f4ee324a120e419e5ba619a80e04c514e094683efb836ccdf74e7e1",
      "firstLoginTime": time,
      "did": getuuid() // deviceId 
    }
    const data ={
      "typeu": 1,
      "from": formid,
      "to": "0",
      "fp": uuid,
      "qos": true,
      "stime": time,
      "data": {
        "event": 0,
        "dataContent": JSON.stringify(dataContent),
        "isRefUIMsg": false,
        "isReceipt": false
      }   
    }  
    sendWSPush(data)

}

/**
 * Send heartbeat after opening WS
 */
const onopenWS = (e) => {
  const uid = sessionStorage.getItem("uid");
  sendPingPong(10000, uid);
}

/**
 * Connection failed and reconnected 
 */
const onerrorWS = (e) => {
  Socket.close()
  clearInterval(setIntervalWesocketPush)
  console.log('Connection failed reconnecting')
  if (Socket.readyState !== 3) {
    Socket = null
    createSocket()
    // socketLogin()
  }
}

/**
 * Unified processing of WS data reception
 */
const onmessageWS = e => {
  window.dispatchEvent(new CustomEvent('onmessageWS', {
    detail: {
      data: e.data
    }
  }))
}

/**
 * 发送数据但连接未建立时进行处理等待重发 
 * When data is sent but the connection is not established, process it and wait for resend
 * @param {any} message  data to be sent
 */
const connecting = message => {
  setTimeout(() => {
    if (Socket.readyState === 0) {
      connecting(message)
    } else {
      Socket.send(JSON.stringify(message))
    }
  }, 1000)
}

/**
 * send data
 * @param {any} message data to be sent
 */
export const sendWSPush = message => {
  if (Socket !== null && Socket.readyState === 3) {
    Socket.close()
    createSocket()
  } else if (Socket.readyState === 1) {
    Socket.send(JSON.stringify(message))
  } else if (Socket.readyState === 0) {
    connecting(message)
  }
}

/**
 * Disconnect and reconnect 
 */
const oncloseWS = (e) => {
  clearInterval(setIntervalWesocketPush)
  console.log('websocket disconnected....trying to reconnect')
  console.log('websocket disconnected: ' + e.code + ' ' + e.reason + ' ' + e.wasClean, Socket.readyState)
  if (Socket.readyState !== 2) {
    Socket = null
    // createSocket()
    // socketLogin()
  }
}

/**sendPingPong
 * @param {number} time Heartbeat interval in milliseconds default 10000
 * @param {string} from from which uid
 */
export const sendPingPong = (ntime = 10000, from) => {
  clearInterval(setIntervalHeartBeat)
  const time = new Date().getTime();
  const uuid = getuuid();
   let data = {
        "typeu": 3,
        "from": from,
        "to": "0",
        "fp": uuid,
        "stime": time,
        "qos": false, 
      }
    setIntervalHeartBeat = setInterval(() => {
      if(Socket.readyState === 1) {
          // Socket.send(JSON.stringify(data))
      }
    }, ntime)

}