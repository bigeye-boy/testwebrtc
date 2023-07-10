<script setup>
import { ref } from 'vue'
import { useIndexStore } from '@/stores/index'
const store = useIndexStore()
const InitState = ref(false)
store.getTournamentlist().then(res => {
    store.getIndexOverview(store.activeTournament.id).then(res => {
        InitState.value = true
    })
    store.getPlatformList()
    store.getLanguageList()
})
if (typeof window !== 'undefined') {
    !(function () {
        let e = document.createElement("script"),
            t = document.head || document.getElementsByTagName("head")[0];
        (e.src =
            "https://cdn.jsdelivr.net/npm/rasa-webchat@1.0.1/lib/index.js"),
            // Replace 1.x.x with the version that you want
            (e.async = !0),
            (e.onload = () => {
                window.WebChat.default(
                    {
                        customData: { language: "en" },
                        socketUrl: "http://172.16.0.27:5005",
                        showFullScreenButton: true,
                        onSocketEvent: {
                            'bot_uttered': bot_uttered
                        }
                    },
                    null
                );
            }),
            t.insertBefore(e, t.firstChild);
    })();
}

const bot_uttered = (e) => {
    console.log('the bot said something', e)
    if (e.command) {
        store.setBotCommand(e.command)
    }
}
setTimeout(() => {
    // bot_uttered({
    //     command: {
    //         route: 'teams',
    //         // hash:'languages'
    //     }
    // })
}, 2000);


</script>
<template>
    <main class="flex flex-col">
        <Header></Header>
        <SecondaryHeader v-if="InitState"></SecondaryHeader>
        <RouterView v-if="InitState" />
        <Footer></Footer>
    </main>
</template>