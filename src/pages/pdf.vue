<script setup>
// import pdfjsLib from 'pdfjs';
// var url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';
import VuePdfEmbed from 'vue-pdf-embed'
const pdfSource = '/testwebrtc/NeuLoginQrcodeSDK.pdf'

</script>
<template>
    <vue-pdf-embed
      ref="pdfRef"
      :source="pdfSource"
    />
</template>