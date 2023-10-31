<script lang="ts" setup>
import { ref, reactive } from 'vue';

import interact from 'interactjs';
import axios from "axios";
import buffer from "buffer";
import { useItemStore } from '../store/item';

interact('.item').draggable({})

const loading = ref(false)
const itemStore = useItemStore()
let imgs = itemStore.itemGetter
const hidden = ref(false)

const fileUpload = function(e) {
	loading.value = true;
	let imgBuffer = null

	let formData = new FormData();
	formData.append("size", "auto");
	formData.append("image_file", e.target.files[0]);

	let cloudinaryForm = new FormData();
	cloudinaryForm.append("upload_preset", "slotImages")
	cloudinaryForm.append("folder", "dressMe")

	axios({
		method: "post",
		url: "https://api.remove.bg/v1.0/removebg",
		data: formData,
		responseType: "arraybuffer",
		headers: {
			'X-Api-Key': '3e3uT8stkaErSfPRRWJKZF2B' // "iiitjkN91SMHhtsFzTrGk91f", "2MKbGLqGf3Tdj9QvpGQWEMD5"
		}
	}).then((response) => {
		if (response.status != 200) {
			return console.error(response.status, response.statusText)
		} else {
			imgBuffer = buffer.Buffer.from(response.data).toString("base64")
			cloudinaryForm.append("file", encodeURI("data:image/png;base64," + imgBuffer))

			axios({
				method: "post",
				url: "https://api.cloudinary.com/v1_1/booluw/upload",
				data: cloudinaryForm
			}).then((response) => {
				itemStore.addItem(response.data.secure_url)
				// imgs.unshift(response.data.secure_url);
				// localStorage.setItem("images", JSON.stringify([...imgs]));
				// console.log(imgs)
			}).catch((error) => {
				console.assert(error);
			})
		}
	}).catch((error) => {
		console.log(error)
	})

	loading.value = false
}
</script>
<template>
    <div class="fixed bottom-0 right-0 left-0 bg-white rounded-t-3xl md:w-2/6 md:relative md:h-[90vh]">
        <div
            :class="hidden ? 'bg-secondary' : 'bg-primary'"
            class="p-5 rounded-t-3xl md:hidden"
            @click="hidden = !hidden"
        ></div>
        <div class="h-[45vh] md:h-full md:mb-16 relative" :class="hidden ? 'block' : 'hidden md:block'">
					<input type="file" accept="image/png, image/jpeg" ref="file" class="hidden" @change="fileUpload" />
            <div
                class="flex justify-between items-center sticky top-0 p-5 bg-white"
            >
							<el-badge :value="imgs.length">
                <h1 class="text-xl font-serif">
									Choose Item
								</h1>
							</el-badge>
                <el-button type="" size="large" @click="$refs.file.click()" :loading="loading">Upload Image</el-button>
            </div>
            <div
                class="h-full py-3 px-5 grid grid-cols-2 gap-5 overflow-scroll pb-24"
								v-if="imgs.length !== 0"
            >
                <div
									class="item bg-slate-50 border-4 border-white h-48 rounded-xl text-3xl flex justify-center items-center hover:border-primary"
									v-for="(img, index) in imgs"
									:key="index"
									:data-img="img"
									@click="$emit('addImage', img)"
                >
									<img :src="img" class="w-3/4 h-auto" />
                </div>
            </div>
						<div v-else>
							<div
								class="mt-20 mx-auto w-3/4 text-center border-4 border-dashed p-10 text-gray-500 font-bold text-2xl cursor-pointer hover:border-gray-300 hover:bg-gray-100"
								@click="$refs.file.click()"
							>
								Nothing here
								<p class="text-sm font-normal">Click to upload</p>
							</div>
							<div class="w-3/4 mx-auto mt-5">
								<h2 class="font-semibold">How to use</h2>
								<ul class="list-inside list-disc">
									<li>Place the dress you want to upload on a flat surface</li>
									<li>Take a clear picture</li>
									<li>Click on the 'upload' button to upload to Dresser</li>
									<li>Style your outfit. <i class="text-red-500">Images are stored on your browser cache. Online backup would come in subsequent versions</i></li>
								</ul>
							</div>
						</div>
        </div>
    </div>
</template>
