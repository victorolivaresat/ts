<template>
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
    <div class="col-span-2">
      <UploadExcel />
    </div>

    <div class="col-span-3">
      <RecentUpload />
    </div>
  </div>
</template>


<script setup>

import UploadExcel from "./UploadExcel.vue";
import RecentUpload from "./RecentUpload.vue";

</script>