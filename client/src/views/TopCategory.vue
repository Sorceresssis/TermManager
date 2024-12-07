<template>
  <div id="top-categories"
       class="fill-parent-height flex-column">
    <div class="flex-1">
      <draggable :list="topCategories"
                 item-key="id"
                 animation="200"
                 @change="handleDrag">
        <template #item="{ element }">
          <div class="top-category-item"
               :class="[activeTopCategory === element.id ? 'actived-top-category' : '']"
               @click="handleTopCategoryClick(element.id)"
               @contextmenu.prevent="showTopCategoryCtm($event, element)">
            {{ element.name }}
          </div>
        </template>
      </draggable>
    </div>
    <div class="operate">
      <button1 @click.prevent="createTopCategory"> 添加 </button1>
    </div>
    <context-menu v-model:show="ctmTopCategoryFlag"
                  :options="ctmOptions">
      <context-menu-item label="重命名"
                         @click="editTopCategory">
        <template #icon> <span class="iconfont"> &#xe722; </span> </template>
      </context-menu-item>
      <context-menu-item label="删除"
                         @click="deleteTopCategory">
        <template #icon> <span class="iconfont"> &#xe636; </span> </template>
      </context-menu-item>
    </context-menu>
  </div>
</template>

<script setup lang="ts">
import {ContextMenu, ContextMenuItem} from '@imengyu/vue3-context-menu';
import {ElMessage, ElMessageBox} from 'element-plus';
import {inject, onMounted, Ref, ref} from 'vue';
import draggable from 'vuedraggable';

import TopCategoryApi from '@/api/topCategoryApi';
import Button1 from '@/components/Button1.vue';

const topCategories = inject<Ref<VO.TopCategory[]>>('topCategories')!;
const activeTopCategory = inject<Ref<number>>('activeTopCategory')!;

function handleTopCategoryClick(id: number) {
  activeTopCategory.value = id;
}

const ctmTopCategoryFlag = ref(false);
let ctmTopCategory: VO.TopCategory | null = null;
const ctmOptions = {
  zIndex: 3000,
  minWidth: 180,
  x: 500,
  y: 200,
};
const showTopCategoryCtm = (e: MouseEvent, topCategory: VO.TopCategory) => {
  e.preventDefault();
  ctmOptions.x = e.clientX;
  ctmOptions.y = e.clientY;

  ctmTopCategory = topCategory;

  ctmTopCategoryFlag.value = true;
};

const createTopCategory = () => {
  ElMessageBox.prompt('请输入一级分类名称', '添加一级分类',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /.+/,
      inputErrorMessage: '请输入一级分类名称',
    }
  ).then(({value}) => {
    ElMessageBox.confirm('确定添加该一级分类吗？', '添加一级分类',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      TopCategoryApi.create(value).then(resp => {
        if (resp.success && resp.data) {
          ElMessage.success('添加成功');
          topCategories.value.push(resp.data);
        } else {
          ElMessage.error('添加失败');
        }
      });
    });
  });
};

const editTopCategory = () => {
  // 异步的，contextCurCategoryId可能会变，所以先把id存起来
  const curTopCategory = ctmTopCategory!;

  ElMessageBox.prompt('请输入新的一级分类名称', '重命名一级分类',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /.+/,
      inputErrorMessage: '请输入新的一级分类名称',
      inputValue: curTopCategory.name,
    }
  ).then(({value}) => {
    ElMessageBox.confirm('确定重命名该二级分类吗？', '重命名二级分类',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      TopCategoryApi.edit({
        id: curTopCategory.id, name: value,
      }).then(resp => {
        if (resp.success) {
          ElMessage.success('重命名成功');
          curTopCategory.name = value;
        } else {
          ElMessage.error('重命名失败');
        }
      });
    });
  });
};

const deleteTopCategory = () => {
  const {id, name} = ctmTopCategory!;

  ElMessageBox.prompt(
    `请输入【 ${name} 】以确认删除`,
    '删除一级分类',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      inputPattern: new RegExp(`^${name}$`),
      inputErrorMessage: '输入的一级分类名称不一致',
      dangerouslyUseHTMLString: true,
    }
  ).then(() => {
    ElMessageBox.confirm('确定删除该一级分类吗？', '删除一级分类',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      TopCategoryApi.delete(id).then(resp => {
        if (resp.success) {
          ElMessage.success('删除成功');
          topCategories.value = topCategories.value.filter(item => item.id !== id);
          if (activeTopCategory.value === id) {
            activeTopCategory.value = topCategories.value[0].id;
          }
        } else {
          ElMessage.error('删除失败');
        }
      });
    });
  });
};

const handleDrag = (e: DraggableComponent.ChangeEvent<VO.TopCategory>) => {
  if (e.moved) {
    const curId = e.moved.element.id;
    const targetNextId = topCategories.value[e.moved.newIndex + 1]?.id || 0;

    TopCategoryApi.changeOrder(curId, targetNextId).then(resp => {
      if (!resp.success) {
        ElMessage.error('移动失败');
      }
    });
  }
};

onMounted(() => {
  TopCategoryApi.getAll().then(resp => {
    if (resp.success && resp.data.length > 0) {
      topCategories.value = resp.data;
      activeTopCategory.value = topCategories.value[0].id;
    }
  });
});

</script>


<style scoped>
#top-categories {
  width: 200px;
  border-right: 2px solid #eeeeed;
}

.top-category-item {
  display: flex;
  align-items: center;
  height: 40px;
  padding-left: 15px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.top-category-item:hover:not(.actived-category) {
  background-color: #f4f5f7;
}

.actived-top-category {
  background-color: #e6eaf2;
}
</style>