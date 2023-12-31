<script lang="ts" setup>
import { reactive } from "vue";
import interact from 'interactjs';
import { find, indexOf, remove } from "lodash";
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { saveAs } from 'file-saver';

import { polyfill } from "mobile-drag-drop";
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";

polyfill({
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
})

import SidePanel from "@/components/SidePanel.vue"

const items = reactive([]) as any

interact(".dropzone").dropzone({
  ondrop: function(event) {
    const item = find(items, ['img', event.relatedTarget.dataset.img])
    if (!item) {
      items.push({ pos: { x: 0, y: 0 }, img: event.relatedTarget.dataset.img })
      // item.style.transform = `translate(${event.relatedTarget.offsetLeft}px, ${event.relatedTarget.offsetHeight}px)`
    }
  }
}).on("dragenter", function(event) {
  const zone = window.document.getElementById("dropzone");
  zone.classList.add("bg-slate-200");
}).on("dropdeactivate", function(event) {
  const zone = window.document.getElementById("dropzone");
  zone.classList.remove("bg-slate-200");
})

interact(".draggable").draggable({
  listeners: {
    move (event) {
      let item = find(items, ['img', event.target.dataset.img])
      const itemIndex = indexOf(items, item)

      item.pos.x += event.dx
      item.pos.y += event.dy

      event.target.style.transform = `translate(${item.pos.x}px, ${item.pos.y}px)`
    }
  }
})

interact(".draggable").resizable({
  edges: {
    top: true,
    bottom: true,
    left: true,
    right: true,
  },
  listeners: {
    move: function(event) {
      let { x,y } = event.target.dataset
      
      x = (parseFloat(x) || 0) + event.deltaRect.left
      y = (parseFloat(y) || 0) + event.deltaRect.top

      Object.assign(event.target.style, {
        width: `${event.rect.width}px`,
        height: `${event.rect.height}px`,
        transform: `translate(${x}px, ${y}px)`
      })

      Object.assign(event.target.dataset, {x, y})
    }
  }
})

// interact("#bin").dropzone({
//   ondrop: function (event) {
//     const item = (items, ['img', event.relatedTarget.dataset.img])
//     if (item) {
//       remove(items, {
//         img: event.relatedTarget.dataset.img
//       })
//     }
//   }
// })

const addImageToItem = function(image) {
  const item = find(items, ['img', image])
    if (!item) {
      items.push({ pos: { x: 0, y: 0 }, img: image })
    }
}

const downloadImage = async function() {
  let node = document.getElementById('dropzone')
  await htmlToImage.toPng(node)
  .then(function (dataUrl) {
     saveAs(dataUrl, 'my-style.png');
  }).catch(error => {
    console.log(error);
  });
}

</script>
<template>
    <div class="h-screen overflow-hidden">
        <div class="flex justify-between items-center p-2 bg-white border-primary border-b sticky top-0 z-40">
          <img src="@/assets/Logo.png" class="w-16" />
          <el-button @click="downloadImage()" size="large" :disabled="items.length === 0">Download</el-button>
        </div>
        <div class="fixed md:bottom-5 right-5 md:left-5 md:right-auto text-3xl text-black/30 font-bold text-right md:text-left pt-5">
          #GRWM
          <small class="-mt-4 block">app</small>
        </div>
        <div class="md:flex">
          <!-- <div class="fixed top-24 left-4 border-transparent border-4 bg-red-300 p-10 md:p-24 rounded" id="bin" /> -->
          <div
            class="dropzone bg-slate-50 h-screen overflow-hidden md:w-4/6"
            id="dropzone"
          >
            <div class="h-full w-full text-center flex justify-center items-center" v-if="items.length === 0">
              <div class="border-4 border-dashed p-10 text-xl font-bold text-gray-400">
                Drag or click on an item to add
              </div>
            </div>
            <div id="frame">
              <div
                class="draggable w-32 h-auto border border-transparent hover:border-slate-300 rounded absolute"
                :class="item.pos.x === 0 ? 'top-[100px]' : ''"
                v-for="(item, index) in items" :key="index"
                :data-x="item.pos.x"
                :data-y="item.pos.y"
                :data-img="item.img"
              >
                <img :src="item.img" class="w-auto h-auto" />
              </div>
            </div>
          </div>
          <side-panel @addImage="addImageToItem" />
        </div>
    </div>
</template>
