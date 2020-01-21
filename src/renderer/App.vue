<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'electron-chatbox'
  }
</script>

<style>
/* CSS */
#app {
	width: 100%;
	height: 100%;
}
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: transparent;
}
::-webkit-scrollbar-track {
  border-radius: 15px;
}
::-webkit-scrollbar-thumb {
  border-radius: 15px;
  background-color: #999;
  transition: all .2s;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(95, 95, 95, 0.7);
}
</style>
