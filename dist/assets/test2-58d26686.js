import{e as a,r as V,o as b,c as O,f as o,g as S,w as f,v as h,h as T,i as k,t as M,a as $,j as D,F as U,k as _,l as B,m as E}from"./index-68488a57.js";const P={class:"p-6"},j=o("option",{value:!0}," 发起人",-1),F=o("option",{value:!1}," 接收人",-1),L=[j,F],R={class:"space-x-6"},G={class:"flex space-x-6"},H=o("div",null,"服务器配置",-1),W=o("div",null,"提交信息",-1),q={id:"outgoing",class:"border-2 border-#000 min-h-17"},z=o("div",{class:"flex space-x-6"},[o("video",{src:"",id:"localVideo",class:"w-500px"}),o("video",{id:"remoteVideo",class:"w-500px"})],-1),A={__name:"test2",setup(I){const p=()=>{B("wss://safana-neom-hcso.api.emotechlab.com/nc1render9/")},l=a(""),c=a({}),v=a({});window.addEventListener("onmessageWS",s=>{try{let e=JSON.parse(s.detail.data);e.type=="config"&&(l.value=JSON.stringify(e.peerConnectionOptions),console.log("The account password:",l.value),N()),e.type=="offer"&&(c.value=e,console.log("Socket Get offer: ",JSON.stringify(e)))}catch{}});let t=null,r=null;const i=a(!1),g=s=>{s=E(s),console.log("config",s),t=new SimplePeer({initiator:i.value,trickle:!0,config:s,allowHalfTrickle:!0,stream:!!(i.value&&r),streams:r?[r]:void 0}),t.on("error",e=>console.log("error",e)),t.on("signal",e=>{console.log("on signal: ",JSON.stringify(e)),e.type=="candidate"?(e.type="iceCandidate",console.log("send Socket:",JSON.stringify(e))):e.type=="answer"&&(console.log("send Socket:",JSON.stringify(e)),d.value=JSON.stringify(e)),e.type=="offer"&&(v.value=e,console.log("get local Offer ok"),d.value=JSON.stringify(e))}),t.on("connect",()=>{console.log("CONNECT"),t.send("whatever"+Math.random()),alert("连接成功！")}),t.on("data",e=>{console.log("on data: "+JSON.stringify(e))}),t.on("track",(e,m)=>{console.log("on track  ",e)}),t.on("stream",e=>{console.log("on stream  ",e)})},u=a(""),d=a(""),y=()=>{console.log("发送输入框内容"),t.signal(JSON.parse(u.value))},x=async()=>{window.navigator.mediaDevices.getUserMedia({video:!0,audio:!0}).then(s=>{console.log("stream",s),r=s,p()})},N=()=>{g(JSON.parse(l.value))},w=()=>{g(JSON.parse(l.value))},C=()=>{console.log("send remote Offer signal: ",JSON.stringify(c.value)),t.signal(c.value)},J=()=>{console.log("发送自己 Offer"),t.signal(v.value)};return(s,e)=>{const m=V("router-link");return b(),O(U,null,[o("div",P,[S(" 身份： "),f(o("select",{"onUpdate:modelValue":e[0]||(e[0]=n=>i.value=n),class:"border p-2 border-#000"},L,512),[[h,i.value]])]),o("div",R,[o("button",{onClick:e[1]||(e[1]=n=>p()),class:"p-4 bg-blue"},"Connect Socket"),o("button",{onClick:e[2]||(e[2]=n=>C()),class:"p-4 bg-blue"},"发送对方Offer"),i.value?(b(),O("button",{key:0,onClick:e[3]||(e[3]=n=>J()),class:"p-4 bg-blue"},"发送自己 Offer")):T("",!0),o("button",{onClick:e[4]||(e[4]=n=>x()),class:"p-4 bg-blue"},"Open Camera"),o("button",{onClick:e[5]||(e[5]=n=>w()),class:"p-4 bg-blue"},"模拟连接SDP")]),o("div",null,[o("div",G,[o("div",null,[H,f(o("textarea",{class:"border-2 border-#000 w-500px h-200px","onUpdate:modelValue":e[6]||(e[6]=n=>l.value=n)},null,512),[[k,l.value]])]),o("div",null,[W,f(o("textarea",{class:"border-2 border-#000 w-500px h-200px","onUpdate:modelValue":e[7]||(e[7]=n=>u.value=n)},null,512),[[k,u.value]])]),o("button",{class:"p-4 bg-blue",onClick:y},"submit")]),o("pre",q,M(d.value),1),z,$(m,{to:"/test"},{default:D(()=>[S("test")]),_:1})])],64)}}};typeof _=="function"&&_(A);export{A as default};
