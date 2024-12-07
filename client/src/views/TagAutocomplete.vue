<template>
  <el-autocomplete v-model="tagSearchInputValue"
                   clearable
                   :trigger-on-focus="false"
                   fit-input-width
                   :spellcheck="false"
                   :placeholder="tagAutocompletePlaceholder"
                   :debounce="tagAutocompleteDebunce"
                   :value-key="TagAutocompleteValueKey"
                   :fetch-suggestions="searchTag"
                   @select="handleTagAutocompleteSelect">
    <template #default="{ item }">
      <div :key="item.id"
           class="tag-autocomplete-suggestion__item">
        <el-image :src="UrlsConfig.getTagIconUrl(item.id)"
                  class="tag-icon"
                  loading="lazy"
                  fit="cover" />
        <div class="tag-content">
          <div class="tag-title"> {{ item.name }} </div>
          <div class="tag-meta">
            <span class="inline-list-title"> ZH </span>
            <span> {{ item.name_zh }} </span>
          </div>
          <div class="tag-meta">
            <span class="inline-list-title"> JA </span>
            <span> {{ item.name_ja }} </span>
          </div>
          <div class="tag-meta">
            <span class="inline-list-title"> EN </span>
            <span> {{ item.name_en }} </span>
          </div>
        </div>
      </div>
    </template>
  </el-autocomplete>
</template>

<script setup lang="ts">
import { type AutocompleteFetchSuggestionsCallback, ElAutocomplete, ElImage, ElMessage } from 'element-plus';
import { ref } from 'vue';

import TagApi from '@/api/tagApi';
import UrlsConfig from '@/config/urls.config';

const tagAutocompletePlaceholder: string = '搜索';
const tagAutocompleteDebunce: number = 400;
const TagAutocompleteValueKey: keyof VO.Tag = 'name';

const tagSearchInputValue = ref<string>('');

function searchTag(queryword: string, cb: AutocompleteFetchSuggestionsCallback) {
  TagApi.getTagsByKeyword(queryword).then(resp => {
    if (resp.success) {
      cb(resp.data);
    } else {
      cb([]);
      ElMessage.error('搜索失败');
    }
  });
}

function handleTagAutocompleteSelect(item: Record<keyof VO.Tag, any>) {
  window.open(UrlsConfig.getTagExplanationUrl(item.id), '_blank');
}

</script>

<style scoped>
.tag-autocomplete-suggestion__item {
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 100px;
  padding: 4px 0

}

.tag-autocomplete-suggestion__item .tag-icon {
  width: 82px;
  height: 82px;
}

.tag-autocomplete-suggestion__item .tag-content {
  flex: 1 0;
  margin-left: 10px;
  line-height: 1;
}

.tag-autocomplete-suggestion__item .tag-title {
  margin-bottom: 10px;
  font-size: 14px;
  color: #007AB3;
}

.tag-autocomplete-suggestion__item .tag-meta {
  margin-top: 6px;
  font-size: 12px;
}

</style>