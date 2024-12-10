<template>
  <div class="fill-parent-height flex-1 flex-row">
    <div id="second-categories"
         class="fill-parent-height flex-column">
      <div class="flex-1 scrollbar-y-w4 second-categories-wrap">
        <draggable :list="secondCategoryWithTagsMap.get(activeTopCategory) ?? []"
                   item-key="id"
                   animation="200"
                   @change="handleSecondCategoryDrag">
          <template #item="{ element }">
            <div class="second-category-item"
                 @click="scrollToSection(`second_category_anchor_${element.id}`)"
                 @contextmenu.prevent="showSecondCategoryCtm($event, element)">
              {{ element.name }}
            </div>
          </template>
        </draggable>
      </div>
      <div class="operate">
        <button1 @click.prevent="createSecondCategory"> 添加 </button1>
      </div>
    </div>
    <div class="flex-1 flex-column">
      <div id="tag-list"
           ref="tagListRef"
           class="flex-1 scrollbar-y-w8">
        <div v-for="category in secondCategoryWithTagsMap.get(activeTopCategory) ?? []"
             :key="category.id">
          <h3 :id="`second_category_anchor_${category.id}`"
              class="second-categories-title">{{ category.name }}</h3>
          <draggable class="item-list__wrap"
                     :list="category.tags"
                     :disabled="tagDraggable"
                     group="second-category"
                     item-key="id"
                     animation="200"
                     @change="(e: any) => handleTagDrag(category, e)">
            <template #item="{ element }">
              <div :key="element.id"
                   class="tag-item flex-row">
                <a :href="UrlsConfig.getTagExplanationIndexUrl(element.id)"
                   target="_blank"
                   rel="noopener noreferrer">
                  <el-image class="tag-item__icon"
                            :src="UrlsConfig.getTagIconUrl(element.id, false)"
                            loading="lazy"
                            fit="cover" />
                </a>
                <div class="flex-1 flex-column">
                  <div class="flex-1">
                    <h4 class="tag-item__title">
                      <a :href="UrlsConfig.getTagExplanationIndexUrl(element.id)"
                         target="_blank"
                         rel="noopener noreferrer">
                        {{ element.name }}
                      </a>
                    </h4>
                    <p v-if="element.name_zh"
                       class="tag-item__meta">
                      <span class="inline-list-title"> ZH </span>
                      <span> {{ element.name_zh }} </span>
                    </p>
                    <p v-if="element.name_ja"
                       class="tag-item__meta">
                      <span class="inline-list-title"> JA </span>
                      <span> {{ element.name_ja }} </span>
                    </p>
                    <p v-if="element.name_en"
                       class="tag-item__meta">
                      <span class="inline-list-title"> EN </span>
                      <span> {{ element.name_en }} </span>
                    </p>
                  </div>
                  <p class="ops">
                    <span class="op-item"
                          @click="editTag($event, element)"> 编辑 </span>
                    <a class="op-item"
                       :href="UrlsConfig.getOpenTagExplanationIndexFileInEditorUrl(element.id)"
                       rel="noopener noreferrer">编辑文档</a>
                    <span class="op-item"
                          @click="createTagRef(element)">添加ref</span>
                    <span class="op-item"
                          @click="showTagMoveDialog(category.id, element)"> 移动 </span>
                    <span class="op-item op-delete"
                          @click="deleteTag(category, element)"> 删除 </span>
                  </p>
                </div>
              </div>
            </template>
          </draggable>
        </div>
        <el-dialog v-model="tagInputDialogVisible"
                   :title="tagInputDialogTitle"
                   width="600">
          <el-form :model="tagFormData"
                   label-width="120px"
                   label-position="left"
                   require-asterisk-position="right">
            <el-form-item label="图片">
              <div class="update-tag-icon">
                <el-image class="update-tag-icon__wrap"
                          :src="tagFormData.icon"
                          fit="cover" />
                <div class="image-select-btn">
                  <label for="tag-icon-input">选择图片</label>
                  <input id="tag-icon-input"
                         type="file"
                         accept="image/jpeg, image/jpg, image/png, image/webp, image/avif"
                         style="display: none;"
                         clearable
                         @change="handleUpdateTagIconChange">
                  <span :class="[tagFormData.icon === tagFormData.originIcon ? 'disabled' : '']"
                        @click.prevent="resetTagInputShowIconLink"> 重置图片 </span>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="标签名称"
                          required>
              <el-input v-model="tagFormData.name" />
            </el-form-item>
            <el-form-item label="中文同义词">
              <el-input v-model="tagFormData.name_zh" />
            </el-form-item>
            <el-form-item label="日文同义词">
              <el-input v-model="tagFormData.name_ja" />
            </el-form-item>
            <el-form-item label="英文同义词">
              <el-input v-model="tagFormData.name_en" />
            </el-form-item>
          </el-form>

          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary"
                         @click="handleSubmitTagFrom">Create</el-button>
            </div>
          </template>
        </el-dialog>
        <el-dialog v-model="tagMoveDialogVisible"
                   title="移动到"
                   width="400">
          <el-select v-model="tagMoveToTopCategoryId"
                     size="large"
                     style="margin-bottom: 10px;"
                     @change="setSecondCategoriesSelectOptions">
            <el-option v-for="topCategory in topCategories"
                       :key="topCategory.id"
                       :label="topCategory.name"
                       :value="topCategory.id" />
          </el-select>
          <el-select v-model="tagMoveToSecondCategoryId"
                     size="large">
            <el-option v-for="secondCategory in secondCategoriesSelectOptions"
                       :key="secondCategory.id"
                       :label="secondCategory.name"
                       :value="secondCategory.id" />
          </el-select>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary"
                         @click="handleTagMove">移动</el-button>
            </div>
          </template>
        </el-dialog>
      </div>
      <div class="operate">
        <div style="width: 700px;">
          <tag-autocomplete />
        </div>
        <el-switch v-model="tagDraggable"
                   size="large"
                   inline-prompt
                   style="

                    --el-switch-on-color: #ff4949;
                    --el-switch-off-color:#13ce66;"
                   active-text="锁定"
                   inactive-text="可拖动" />
      </div>
    </div>
    <context-menu v-model:show="ctmSecondCategoryFlag"
                  :options="ctmOptions">
      <context-menu-item label="重命名"
                         @click="editSecondCategory">
        <template #icon> <span class="iconfont"> &#xe722; </span> </template>
      </context-menu-item>
      <context-menu-item label="添加标签"
                         @click="createTag">
        <template #icon> <span class="iconfont"> &#xe661; </span> </template>
      </context-menu-item>
      <context-menu-group label="移动">
        <context-menu-item v-for="topCategory in topCategories.filter((item) => item.id !== activeTopCategory)"
                           :key="topCategory.id"
                           :label="topCategory.name"
                           @click="moveSecondCategory(topCategory.id)" />
      </context-menu-group>
      <context-menu-item label="删除"
                         @click="deleteSecondCategory">
        <template #icon> <span class="iconfont"> &#xe636; </span> </template>
      </context-menu-item>
    </context-menu>
  </div>
</template>

<script setup lang="ts">
import { ContextMenu, ContextMenuGroup, ContextMenuItem } from '@imengyu/vue3-context-menu';
import { ElButton, ElDialog, ElForm, ElFormItem, ElImage, ElInput, ElMessage, ElMessageBox, ElOption, ElSelect, ElSwitch } from 'element-plus';
import { inject, reactive, readonly, Ref, ref, toRaw, watch } from 'vue';
import draggable from 'vuedraggable';

import SecondCategoryApi from '@/api/secondCategoryApi';
import TagApi from '@/api/tagApi';
import Button1 from '@/components/Button1.vue';
import UrlsConfig from '@/config/urls.config';
import { throttle } from '@/utils/common';
import TagAutocomplete from '@/views/TagAutocomplete.vue';


const topCategories = readonly(inject<Ref<VO.TopCategory[]>>('topCategories')!);
const activeTopCategory = readonly(inject<Ref<number>>('activeTopCategory')!);
const secondCategoryWithTagsMap = inject<Ref<Map<number, VO.SecondCategoryWithTags[]>>>('secondCategoryWithTagsMap')!;


const ctmOptions = {
  zIndex: 3000,
  minWidth: 180,
  x: 500,
  y: 200,
};
const tagListRef = ref<HTMLElement | null>(null);
const tagDraggable = ref<boolean>(true);

function scrollToSection(sectionId: string) {
  const offset = 10;
  const target = document.getElementById(sectionId);

  if (tagListRef.value && target) {
    tagListRef.value.scrollTo({
      top: target.offsetTop - offset,
      behavior: 'smooth',
    });
  }
};

watch(activeTopCategory, throttle(async newVal => {
  // 重置高度
  if (tagListRef.value) {
    tagListRef.value.scrollTo({
      top: 0, behavior: 'auto',
    });
  }

  if (!secondCategoryWithTagsMap.value.has(newVal)) {
    TagApi.getSecondCategoryWithTags(newVal).then(resp => {
      if (resp.success) {
        secondCategoryWithTagsMap.value.set(newVal, resp.data);
      } else {
        ElMessage.error('Term 获取失败');
      }
    });
  }
}, 200, false));


const ctmSecondCategoryFlag = ref(false);
let ctmSecondCategoryWithTags: VO.SecondCategoryWithTags | null = null;

const showSecondCategoryCtm = (e: MouseEvent, secondCategoryWithTags: VO.SecondCategoryWithTags) => {
  e.preventDefault();
  ctmOptions.x = e.clientX;
  ctmOptions.y = e.clientY;

  ctmSecondCategoryWithTags = secondCategoryWithTags;

  ctmSecondCategoryFlag.value = true;
};

const createSecondCategory = () => {
  const curTopCategoryId = activeTopCategory.value;

  ElMessageBox.prompt('请输入二级分类名称', '添加二级分类',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /.+/,
      inputErrorMessage: '请输入二级分类名称',
    }
  ).then(({ value }) => {
    ElMessageBox.confirm('确定添加该二级分类吗？', '添加二级分类',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      SecondCategoryApi.create({
        name: value,
        topCategoryId: curTopCategoryId,
      }).then(resp => {
        if (resp.success) {
          ElMessage.success('添加成功');
          secondCategoryWithTagsMap.value.get(curTopCategoryId)?.push({
            ...resp.data,
            tags: [],
          });
        } else {
          ElMessage.error('添加失败');
        }
      });
    });
  });
};

const editSecondCategory = () => {
  // 保存对象地址，直接修改数据驱动视图
  const curSecondCategoryWithTags = ctmSecondCategoryWithTags!;

  ElMessageBox.prompt('请输入新的二级分类名称', '重命名二级分类',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /.+/,
      inputErrorMessage: '请输入新的二级分类名称',
      inputValue: curSecondCategoryWithTags.name,
    }
  ).then(({ value }) => {
    ElMessageBox.confirm('确定重命名该二级分类吗？', '重命名二级分类',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      SecondCategoryApi.edit({
        id: curSecondCategoryWithTags.id,
        name: value,
      }).then(resp => {
        if (resp.success) {
          ElMessage.success('重命名成功');
          curSecondCategoryWithTags.name = value;
        } else {
          ElMessage.error('重命名失败');
        }
      });
    });
  });
};

const deleteSecondCategory = () => {
  const curTopCategoryId = activeTopCategory.value;
  const { id, name } = ctmSecondCategoryWithTags!;

  ElMessageBox.prompt(
    `请输【 ${name} 】以确认删除`,
    '删除二级分类',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      inputPattern: new RegExp(`^${name}$`),
      inputErrorMessage: '输入的二级分类名称不一致',
    }
  ).then(() => {
    ElMessageBox.confirm('确定删除该二级分类吗？', '删除二级分类',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      SecondCategoryApi.delete(id).then(resp => {
        if (resp.success) {
          ElMessage.success('删除成功');
          const filtered = secondCategoryWithTagsMap.value.get(curTopCategoryId)?.filter(item => item.id !== id) ?? [];
          secondCategoryWithTagsMap.value.set(curTopCategoryId, filtered);
        } else {
          ElMessage.error('删除失败');
        }
      });
    });
  });
};

const handleSecondCategoryDrag = (e: DraggableComponent.ChangeEvent<VO.SecondCategory>) => {
  const curTopCategoryId = activeTopCategory.value;

  if (e.moved) {
    const curId = e.moved.element.id;
    const targetNextId = secondCategoryWithTagsMap.value.get(curTopCategoryId)![e.moved.newIndex + 1]?.id || 0;

    SecondCategoryApi.changeOrderAndMove(curId, targetNextId, curTopCategoryId);
  }
};

const moveSecondCategory = (moveToTopCategoryId: number) => {
  const curSecondCategoryWithTags = ctmSecondCategoryWithTags!;

  SecondCategoryApi.changeOrderAndMove(curSecondCategoryWithTags.id, 0, moveToTopCategoryId).then(resp => {
    if (resp.success) {
      ElMessage.success('移动成功');
      // 把要移动的二级分类从当前顶级分类的数组中删除
      const filtered = secondCategoryWithTagsMap.value.get(activeTopCategory.value)?.filter(item => item.id !== curSecondCategoryWithTags.id) ?? [];
      secondCategoryWithTagsMap.value.set(activeTopCategory.value, filtered);
      secondCategoryWithTagsMap.value.get(moveToTopCategoryId)?.push(curSecondCategoryWithTags);
    } else {
      ElMessage.error('移动失败');
    }
  });
};

const tagInputDialogVisible = ref(false);
const tagInputDialogTitle = ref('');
const tagFormData = reactive({
  id: 0,
  name: '',
  name_zh: '',
  name_ja: '',
  name_en: '',
  icon: '',
  originIcon: '',
});
function resetTagInputShowIconLink() {
  tagFormData.icon = tagFormData.originIcon;
  tagInputNewIconFile = void 0;
};
let tagInputNewIconFile: File | undefined = void 0;
function handleUpdateTagIconChange(e: Event) {
  tagFormData.icon = window.URL.createObjectURL(((e.target as HTMLInputElement)?.files as FileList)[0]);
  tagInputNewIconFile = ((e.target as HTMLInputElement)?.files as FileList)[0];
};
function showTagInputDialog(type: 'create' | 'edit', submited: () => void, defaultFormData?: VO.Tag): void {
  submitedFun = submited;

  switch (type) {
    case 'create':
      tagInputDialogTitle.value = '添加新的标签';
      Object.assign(tagFormData, {
        id: 0,
        name: '',
        name_zh: '',
        name_ja: '',
        name_en: '',
      });
      tagFormData.icon = tagFormData.originIcon = '';
      break;
    case 'edit':
      if (!defaultFormData) return;
      tagInputDialogTitle.value = '编辑标签';

      Object.assign(tagFormData, defaultFormData);
      tagFormData.icon = tagFormData.originIcon = UrlsConfig.getTagIconUrl(defaultFormData.id);
      break;
  }

  tagInputDialogVisible.value = true;
};
let submitedFun: () => void;
function handleSubmitTagFrom() {
  submitedFun();
  tagInputDialogVisible.value = false;
};

function createTag() {
  const curSecondCategoryWithTags = ctmSecondCategoryWithTags!;

  showTagInputDialog('create', () => {
    const formData = new FormData();
    formData.append('name', tagFormData.name);
    formData.append('name_zh', tagFormData.name_zh);
    formData.append('name_ja', tagFormData.name_ja);
    formData.append('name_en', tagFormData.name_en);
    formData.append('secondCategoryId', curSecondCategoryWithTags.id.toString());
    if (tagFormData.icon !== tagFormData.originIcon && tagInputNewIconFile) {
      formData.append('icon', tagInputNewIconFile);
    }

    TagApi.create(formData).then(resp => {
      if (resp.success && resp.data) {
        ElMessage.success('添加成功');
        curSecondCategoryWithTags.tags.push(resp.data);
      } else {
        ElMessage.error('添加失败');
      }
    });
  });
};
const editTag = (e: Event, tag: VO.Tag) => {
  showTagInputDialog('edit', () => {
    const _tagFormData = toRaw(tagFormData);

    const formData = new FormData();
    formData.append('id', tag.id.toString());
    formData.append('name', _tagFormData.name);
    formData.append('name_zh', _tagFormData.name_zh);
    formData.append('name_ja', _tagFormData.name_ja);
    formData.append('name_en', _tagFormData.name_en);
    if (_tagFormData.icon !== _tagFormData.originIcon && tagInputNewIconFile) {
      formData.append('icon', tagInputNewIconFile);
    }
    TagApi.edit(formData).then(resp => {
      // ANCHOR 刷新图片
      const imgElement = ((e.target as HTMLElement).parentNode?.parentNode?.parentNode?.firstChild?.firstChild as HTMLDivElement).querySelector('img');

      if (imgElement) {
        imgElement.src = UrlsConfig.getTagIconUrl(tag.id);
      }

      if (resp.success) {
        ElMessage.success('编辑成功');

        Object.assign(tag, {
          name: _tagFormData.name,
          name_zh: _tagFormData.name_zh,
          name_ja: _tagFormData.name_ja,
          name_en: _tagFormData.name_en,
        });
      } else {
        ElMessage.error('编辑失败');
      }
    });
  }, tag);
};

// ANCHOR move tag
const tagMoveDialogVisible = ref(false);
const secondCategoriesSelectLoading = ref(false);
const secondCategoriesSelectOptions = ref<VO.SecondCategory[]>([]);
const secondCategoriesSelectOptionsMap = new Map<number, VO.SecondCategory[]>();
const tagMoveToTopCategoryId = ref(0);
const tagMoveToSecondCategoryId = ref(0);
let tagMoveFromTopCategoryId = 0;
let tagMoveFromSecondCategoryId = 0;
let moveTag: VO.Tag | undefined = void 0;
const showTagMoveDialog = (curSecondCategoryId: number, tag: VO.Tag) => {
  tagMoveFromTopCategoryId = tagMoveToTopCategoryId.value = activeTopCategory.value;
  tagMoveFromSecondCategoryId = tagMoveToSecondCategoryId.value = curSecondCategoryId;
  moveTag = tag;
  secondCategoriesSelectOptionsMap.clear();
  setSecondCategoriesSelectOptions(tagMoveFromTopCategoryId);

  tagMoveDialogVisible.value = true;
};
function handleTagMove() {
  const _moveToTopCategoryId = tagMoveToTopCategoryId.value;
  const _moveToSecondCategoryId = tagMoveToSecondCategoryId.value;
  const _fromTopCategoryId = tagMoveFromTopCategoryId;
  const _fromSecondCategoryId = tagMoveFromSecondCategoryId;
  const _moveTag = moveTag!;

  tagMoveDialogVisible.value = false;
  if (_fromTopCategoryId === _moveToTopCategoryId && _fromSecondCategoryId === _moveToSecondCategoryId) return;

  TagApi.changeOrderAndMove(_moveTag.id, 0, _moveToSecondCategoryId).then(resp => {
    if (resp.success) {
      // 把要移动的标签从当前二级分类的数组中删除
      if (secondCategoryWithTagsMap.value.has(_fromTopCategoryId)) {
        const fromSecondCategoryWithTags = secondCategoryWithTagsMap.value.get(_fromTopCategoryId)!.find(item => item.id === _fromSecondCategoryId);
        if (fromSecondCategoryWithTags) {
          fromSecondCategoryWithTags.tags = fromSecondCategoryWithTags.tags.filter(item => item.id !== _moveTag.id);
        };
      }

      if (secondCategoryWithTagsMap.value.has(_moveToTopCategoryId)) {
        secondCategoryWithTagsMap.value.get(_moveToTopCategoryId)!.find(item => item.id === _moveToSecondCategoryId)!.tags.push(_moveTag);
      }

      ElMessage.success('移动成功');
    } else {
      ElMessage.error('移动失败');
    }
  });
};
// 给secondCategoriesSelectOptions赋值
function setSecondCategoriesSelectOptions(newVal: number) {
  if (secondCategoriesSelectOptionsMap.has(newVal)) {
    secondCategoriesSelectOptions.value = secondCategoriesSelectOptionsMap.get(newVal)!;
    tagMoveToSecondCategoryId.value = secondCategoriesSelectOptions.value[0].id;
  } else {
    secondCategoriesSelectLoading.value = true;
    SecondCategoryApi.getAllOfTopCategory(newVal).then(resp => {
      if (!resp.success) return;

      const data = resp.data;
      secondCategoriesSelectOptions.value = data;
      secondCategoriesSelectOptionsMap.set(newVal, data);

      if (data.length < 1) return;

      tagMoveToSecondCategoryId.value = data[0].id;
    }).finally(() => {
      secondCategoriesSelectLoading.value = false;
    });
  }
};

const deleteTag = (secondCategory: VO.SecondCategoryWithTags, tag: VO.Tag) => {
  ElMessageBox.prompt(`请输【 ${tag.name} 】以确认删除`, '删除标签', {
    inputPattern: new RegExp(`^${tag.name}$`),
    inputErrorMessage: '输入的标签名称不一致',
  }
  ).then(() => {
    ElMessageBox.confirm('确定删除该标签吗？', '删除标签').then(() => {
      TagApi.delete(tag.id).then(resp => {
        if (resp.success) {
          ElMessage.success('删除成功');
          const filtered = secondCategory.tags.filter(item => item.id !== tag.id);
          secondCategory.tags = filtered;
        } else {
          ElMessage.error('删除失败, 请刷新网页试试');
        }
      });
    });
  });
};

function handleTagDrag(secondCategoryWithTags: VO.SecondCategoryWithTags, e: DraggableComponent.ChangeEvent<VO.Tag>) {
  if (e.removed) return;

  let curId = 0;
  let newIndex = -1;
  if (e.moved) {
    curId = e.moved.element.id;
    newIndex = e.moved.newIndex;
  } else if (e.added) {
    curId = e.added.element.id;
    newIndex = e.added.newIndex;
  }
  // removed 不需要处理，因为removed和added是一对的，added发送到后端，后端自动删除removed

  const targetNextId = secondCategoryWithTags.tags[newIndex + 1]?.id || 0;

  TagApi.changeOrderAndMove(curId, targetNextId, secondCategoryWithTags.id);
};

function createTagRef(tag: VO.Tag) {
  ElMessageBox.confirm('确定给该标签的添加一个引用吗', '添加引用').then(() => {
    TagApi.createTagExplanationReference(tag.id).then(resp => {
      if (resp.success) {
        const data = resp.data;
        window.open(UrlsConfig.getTagExplanationReferenceUrl(data.tagId, data.refIndex), '_blank', 'noopener,noreferrer');
      } else {
        ElMessage.error('添加引用失败');
      }
    });
  });
}
</script>

<style scoped>
.item-list__wrap {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}
</style>