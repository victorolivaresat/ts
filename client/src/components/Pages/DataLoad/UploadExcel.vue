<template>
    <div class="w-full p-6 text-center bg-white border border-gray-200 rounded-lg shadow">
        <h5 class="mb-2 text-2xl font-bold text-gray-900">Data Upload</h5>
        <p class="mb-5 text-base text-gray-500 sm:text-lg">Please upload a file in .xlsx format.</p>

        <div id="dropzone"
            class="w-full py-9 bg-gray-50 rounded-xl border border-gray-300 border-dashed relative flex flex-col items-center justify-center"
            :class="{ 'border-blue-600 bg-blue-50': isDragging }" @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop">
            <FaFileExcel class="text-green-500 text-4xl" />
            <h2 class="text-center text-gray-400 text-xs leading-4 my-4">XLSX, smaller than 2MB</h2>

            <label class="mt-4 cursor-pointer">
                <input ref="fileInput" type="file" class="hidden" accept=".xlsx, .xls" @change="handleFileChange">
                <div class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md shadow hover:bg-blue-700">
                    Choose File
                </div>
            </label>
        </div>

        <div v-if="file !== null" class="mt-4 p-4 bg-white rounded-lg shadow">
            <p class="text-sm text-green-600">File: {{ file.name }} ({{ formatBytes(file.size) }})</p>
            <button @click="handleSubmit" :disabled="isLoading || !isFileValid"
                class="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 disabled:opacity-50">
                {{ isLoading ? "Uploading..." : "Upload File" }}
            </button>
            <p v-if="!isFileValid" class="text-red-500 text-sm mt-2">
                Invalid file type. Please select an .xlsx or .xls file.
            </p>
        </div>

        <Toast ref="toast" />

    </div>


</template>

<script setup>
import { ref } from "vue";
import emitter from "../../../eventBus";
import Toast from "../../Shared/Toast.vue";
import { uploadFile } from "../../../api/uploadApi";
import { FaFileExcel } from "@kalimahapps/vue-icons";
import { formatBytes } from "../../../utils/fileFormatter";

const file = ref(null);
const isLoading = ref(false);
const isDragging = ref(false);
const allowedExtensions = [".xlsx", ".xls"];
const isFileValid = ref(false);
const toast = ref(null);
const fileInput = ref(null);

const showSuccessToast = () => {
    toast.value.showToast('Operation successful!', 'success');
};

const showErrorToast = () => {
    toast.value.showToast('An error occurred.', 'error');
};

const validateFile = (file) => {
    const fileExtension = file.name.slice(file.name.lastIndexOf("."));
    isFileValid.value = allowedExtensions.includes(fileExtension);
};

const handleFileChange = (event) => {
    file.value = event.target.files[0];
    validateFile(file.value);
};

const handleDrop = (event) => {
    file.value = event.dataTransfer.files[0];
    validateFile(file.value);
    isDragging.value = false;
};

const handleDragOver = () => {
    isDragging.value = true;
};

const handleDragLeave = () => {
    isDragging.value = false;
};

const handleSubmit = async () => {
    if (!file.value || !isFileValid.value) {
        return;
    }

    try {
        isLoading.value = true;
        const response = await uploadFile(file.value);
        showSuccessToast();
        emitter.emit("file-uploaded");
    } catch (error) {
        showErrorToast();
    } finally {
        resetFile();
    }
};

// Function to reset the file state
const resetFile = () => {
    file.value = null;
    isFileValid.value = false;
    isLoading.value = false;
    fileInput.value.value && (fileInput.value.value = null);
};

</script>
