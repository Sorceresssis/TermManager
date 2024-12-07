<template>
  <div class="fill-parent flex-row">
    <top-category />
    <tag-container />
    <palette-button />
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from 'vue';

import ClientApi from '@/api/clientApi';
import PaletteButton from '@/views/PaletteButton.vue';
import TagContainer from '@/views/TagContainer.vue';
import TopCategory from '@/views/TopCategory.vue';

const topCategories = ref<VO.TopCategory[]>([]);
provide('topCategories', topCategories);


// 当前选中的顶级分类
const activeTopCategory = ref<number>(0);
provide('activeTopCategory', activeTopCategory);


// 保存了所有的标签
const secondCategoryWithTagsMap = ref<Map<number, VO.SecondCategoryWithTags[]>>(new Map());
provide('secondCategoryWithTagsMap', secondCategoryWithTagsMap);


onMounted(() => {
  ClientApi.getConfig().then(resp => {
    if (resp.success) {
      document.title = resp.data.title;
    }
  });
});
</script>

<style scoped>

</style>