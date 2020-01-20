<template>
  <div class="flex">
    <img :src="imgSrc">
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'ImageViewer',
  data () {
    return {
      imgSrc: ''
    }
  },
  mounted () {
    ipcRenderer.send('img-viewer-loaded')
    ipcRenderer.on('imgdata', (event, params) => {
      this.imgSrc = params
    })
  }
}
</script>

<style>
.flex {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
