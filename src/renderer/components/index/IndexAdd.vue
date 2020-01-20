<template>
  <el-container>
    <!-- <el-header>Add Music to Library</el-header> -->
    <el-main>
      <el-table :data="musicList" :show-header="false">
        <el-table-column lable="音乐名字">
          <template slot-scope="scope">
            {{scope.row}}
          </template>
        </el-table-column>
      </el-table>
      <el-button class="full-width" @click="chooseMusic">Choose</el-button>
      <el-button class="full-width" type="primary" @click="importLibrary">Import to Library</el-button>
    </el-main>
  </el-container>
</template>

<script>
import { Container, Header, Main, Table, TableColumn, Button } from 'element-ui'
import { ipcRenderer } from 'electron'
import path from 'path'

export default {
  name: 'IndexAdd',
  components: {
    [Container.name]: Container,
    [Header.name]: Header,
    [Main.name]: Main,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Button.name]: Button
  },
  data () {
    return {
      musicList: []
    }
  },
  created () {
    ipcRenderer.on('selected-file', (event, pathFiles) => {
      if (Array.isArray(pathFiles)) {
        this.musicList = pathFiles.map(item => {
          return path.basename(item)
        })
      }
    })
    ipcRenderer.on('load-add-success', (event, params) => {
      console.log('load-add-success')
    })
  },
  mounted () {
    ipcRenderer.on('load-add-success', (event, params) => {
      console.log('load-add-success')
    })
  },
  methods: {
    chooseMusic () {
      ipcRenderer.send('open-music-file')
    },
    importLibrary () {
      ipcRenderer.send('add-tracks', this.musicList)
    }
  }
}
</script>

<style scoped>
.el-header {
  line-height: 60px;
  font-size: 28px;
  text-align: center;
}
.full-width {
  width: 100%;
}
.el-button {
  margin-left: 0;
  margin-top: 10px;
}
</style>
