<template>
  <div class="palette-button">
    <a :href="UrlsConfig.getOpenDataFolderInEditorUrl()"
       rel="noopener noreferrer"
       title="打开数据文件夹"
       class="open-data-folder">
      <span class="iconfont"> &#xe73e; </span>
    </a>
  </div>
</template>

<script setup lang="ts">
import UrlsConfig from '@/config/urls.config';

</script>

<style scoped>
.palette-button {
  position: fixed;
  right: 20px;
  bottom: 100px;
  text-align: center;
  background-color: transparent;
}

.palette-button .iconfont {
  font-size: 20px;
}

.open-data-folder {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: #FFF;
  border: 1px solid #E3E5E7;
  border-radius: 6px;
  transition: all .2s linear;
  cursor: pointer;
}

.open-data-folder:hover {
  background-color: #EEE;
}
</style>