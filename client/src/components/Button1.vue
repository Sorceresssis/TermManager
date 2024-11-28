<template>
  <button class="button-1"
          type="button">
    <span>
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang='ts'></script>

<style>
.button-1 {
  --button-1-height: 32px;

  box-sizing: border-box;
  display: inline-block;
  place-content: center center;
  height: var(--button-1-height);
  padding: 0 10px;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  transition: .1s;
}

.button-1:hover {
  background-color: #e7e7e7;
}

.button-1 span {
  display: inline-block;
  min-width: 65px;
  line-height: var(--button-1-height);
}

.button-1:active span {
  transform: translate(0, 0.5px);
}
</style>