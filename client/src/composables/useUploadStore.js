import { defineStore } from 'pinia';
import { getRecentNotificationSums } from "../../../api/uploadApi";
import { get } from 'lodash';

export const useUploadsStore = defineStore('uploads', {
  state: () => ({
    recentUploads: [],
  }),
  actions: {
    addUpload(upload) {
      this.recentUploads.unshift(upload);
    },
    async getRecentUploads() {
      const response = await getRecentNotificationSums();
      this.recentUploads = get(response, 'data', []);
    },
  },
});