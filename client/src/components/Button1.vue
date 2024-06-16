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
    display: inline-block;
    justify-content: center;
    align-content: center;
    height: var(--button-1-height);
    white-space: nowrap;
    cursor: pointer;
    text-align: center;
    box-sizing: border-box;
    vertical-align: middle;
    transition: .1s;
    padding: 0 10px;
    background-color: #f5f7fa;
    border: 1px solid #dcdfe6;
    font-size: 14px;
    user-select: none;
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
    transform: translate(0px, 0.5px);
}
</style>