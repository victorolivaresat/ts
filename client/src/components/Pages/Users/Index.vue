<template>
  <div class="flex justify-between items-center mb-4">
    <input v-model="searchTerm" type="text" placeholder="Buscar por e-mail"
      class="w-1/4 px-3 py-2 border border-gray-300 rounded-md"  @input="fetchFilteredData"/>

    <button class="bg-indigo-600 px-4 py-2 text-white rounded-md hover:bg-indigo-700" @click="openModal('create')">
      <BxPlusCircle class="inline-block"/> Create User
    </button>
  </div>


  <TableLite 
    :is-slot-mode="true" 
    :isLoading="tableConfig.isLoading" 
    :title="'Users'"
    :columns="tableConfig.columns" 
    :rows="filterRows" 
    :pageSize="tableConfig.itemsPerPage"
    :total="tableConfig.totalItems" 
    :page="tableConfig.currentPage" 
    :messages="tableConfig.messages"
    @do-search="handleSearch"
  >

    <!-- Slot for status-->
    <template v-slot:status="data">
      <Switch :value="data.value.status === true" :label="data.value.status ? 'Active' : 'Inactive'"
        @update:value="(newValue) => handleChangeStatus(data.value.id, newValue ? true : false)" />
    </template>

    <!-- Slot for actions-->
    <template v-slot:actions="data">
      <button class="px-2 py-1"
        @click="openModal('edit', data.value.id)">
        <BxEdit class="text-lg text-yellow-500"/>
      </button>
    </template>

  </TableLite>

  <!-- Modal -->
  <Modal v-model="isModalVisible" :title="modalMode === 'create' ? 'Create User' : 'Edit User'">
    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-2 gap-4">

        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">First Name</label>
          <input v-model="formData.first_name" type="text" class="w-full px-3 py-2 border border-slate-200 rounded-md"
            required />
        </div>

        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Last Name</label>
          <input v-model="formData.last_name" type="text" class="w-full px-3 py-2 border border-slate-200 rounded-md"
            required />
        </div>

        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Email</label>
          <input v-model="formData.email" type="email" class="w-full px-3 py-2 border border-slate-200 rounded-md"
            required />
        </div>

        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Password</label>
          <input v-model="formData.password" type="password" class="w-full px-3 py-2 border border-slate-200 rounded-md"
            :required="modalMode === 'create'" />
        </div>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {{ modalMode === 'create' ? 'Create' : 'Update' }}
        </button>
      </div>
    </form>
  </Modal>

</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { getAllUsers, createUser, updateUser, changeUserStatus } from '../../../api/userApi';
import { formatDateTime } from '../../../utils/dateFormatter';
import { BxEdit, BxPlusCircle } from '@kalimahapps/vue-icons';
import { useTable } from '../../../composables/useTable';
import TableLite from '../../Shared/TableLite.vue';
import Switch from '../../Shared/Switch.vue';
import Modal from '../../Shared/Modal.vue';

const initialColumns = [
  { label: "ID", field: "id", sortable: true, width: "5%" },
  { label: "First Name", field: "first_name", sortable: true, width: "15%" },
  { label: "Last Name", field: "last_name", sortable: true, width: "15%" },
  { label: "Email", field: "email", sortable: true, width: "20%" },
  { label: "Created", field: "created_at", sortable: true, width: "15%", display: (row) => formatDateTime(row.created_at) },
  { label: "Status", field: "status", width: "15%", columnClasses: ["text-center"], },
  { label: "Actions", field: "actions", width: "15%", columnClasses: ["text-center"], },
];

const { tableConfig, fetchTableData } = useTable(getAllUsers, initialColumns);

// Modal
const isModalVisible = ref(false);
const modalMode = ref('create');

// Form data
const currentUserId = ref(null);
const searchTerm = ref(""); 
const formData = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
});

// Filter rows
const filterRows = computed(() => {
  return tableConfig.rows.filter(
    (x) =>
      x.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      x.first_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      x.last_name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Función para manejar la paginación
const handleSearch = async (offset, limit, sort, order) => {
  const page = offset / limit + 1;
  tableConfig.currentPage = page;
  tableConfig.itemsPerPage = limit;

  await fetchTableData(page, limit, sort, order);
};

// Actualización dinámica al buscar
const fetchFilteredData = async () => {
  tableConfig.currentPage = 1;
  await fetchTableData(1, tableConfig.itemsPerPage);
};

// Modal functions
const openModal = (mode, id = null) => {
  modalMode.value = mode;
  currentUserId.value = id;

  if (mode === 'edit' && id) {
    const user = tableConfig.rows.find((row) => row.id === id);
    if (user) {
      formData.value = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: '',
      };
    }
  } else {
    formData.value = { first_name: '', last_name: '', email: '', password: '' };
  }

  isModalVisible.value = true;
};

const handleSubmit = async () => {
  try {
    if (modalMode.value === 'create') {
      await createUser(formData.value);
    } else if (modalMode.value === 'edit' && currentUserId.value) {
      await updateUser(currentUserId.value, formData.value);
    }
    isModalVisible.value = false;
    fetchTableData();
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

const handleChangeStatus = async (id, newStatus) => {
  try {
    await changeUserStatus(id, newStatus);
    await fetchTableData(tableConfig.currentPage, tableConfig.itemsPerPage);
  } catch (error) {
    console.error('Error changing user status:', error);
  }
};

onMounted(() => {
  fetchTableData();
});
</script>