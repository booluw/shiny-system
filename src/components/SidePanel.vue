<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import interact from 'interactjs';
import axios from "axios";
import buffer from "buffer";

interact('.item').draggable({})

const loading = ref(false)
let imgs = [...JSON.parse(localStorage.getItem("images"))] ?? []
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
				imgs.unshift(response.data.secure_url);
				localStorage.setItem("images", JSON.stringify([...imgs]));
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
					<input type="file" accept="image/*" ref="file" class="hidden" @change="fileUpload" />
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
        </div>
    </div>
</template>
