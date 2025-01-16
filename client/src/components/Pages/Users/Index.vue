<template>
  <h1>Users</h1>
</template>

<script setup>
import { ref } from 'vue'
import { getAllUsers } from '../../../api/userApi'

const users = async () => {
  const users = await getAllUsers();
  return users
}

const usersData = ref(users())

</script>