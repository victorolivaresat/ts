<template>
    <div class="flex">
        <!-- Backdrop -->
        <div :class="isOpen ? 'block' : 'hidden'"
            class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden" @click="isOpen = false" />
        <!-- End Backdrop -->

        <div :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
            class="fixed inset-y-0 left-0 z-30 w-56 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0">
            <div class="flex items-center justify-center bg-red-700 p-4">
                <div class="flex items-center">
                    <span class="mx-2 text-2xl font-semibold text-white">at</span>
                </div>
            </div>

            <nav class="mt-10">
                <router-link class="flex items-center px-6 py-2 mt-2 duration-200 border-l-4"
                    :class="[$route.name === 'Dashboard' ? activeClass : inactiveClass]" to="/">
                    <span class="mx-4">Dashboard</span>
                </router-link>

                <router-link class="flex items-center px-6 py-2 mt-2 duration-200 border-l-4"
                    :class="[$route.name === 'Users' ? activeClass : inactiveClass]" to="/users">
                    <span class="mx-4">Users</span>
                </router-link>

                <router-link class="flex items-center px-6 py-2 mt-2 duration-200 border-l-4"
                    :class="[$route.name === 'Roles' ? activeClass : inactiveClass]" to="/roles">
                    <span class="mx-4">Roles</span>
                </router-link>

                <router-link class="flex items-center px-6 py-2 mt-2 duration-200 border-l-4"
                    :class="[$route.name === 'DataLoad' ? activeClass : inactiveClass]" to="/data-load">
                    <span class="mx-4">DataLoad</span>
                </router-link>

                <router-link class="flex items-center px-6 py-2 mt-2 duration-200 border-l-4"
                    :class="[$route.name === 'Reconciliations' ? activeClass : inactiveClass]" to="/reconciliations">
                    <span class="mx-4">Reconciliations</span>
                </router-link>

                <router-link class="flex items-center px-6 py-2 mt-2 duration-200 border-l-4"
                    :class="[$route.name === 'Transactions' ? activeClass : inactiveClass]" to="/transactions">
                    <span class="mx-4">Transactions</span>
                </router-link>
            </nav>

            <hr class="my-8 border-gray-700" />

            <div class="px-6 my-6">
                <div class="p-4 bg-gray-800 rounded-lg shadow-md">
                    <img :src="rocket" class="w-20 h-20 mx-auto" />
                    <p class="block mt-6 text-sm text-center text-gray-500">
                        Equipo de Prevención de Fraude - {{ year }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useSidebar } from '../../composables/useSidebar.js';
import rocket from '../../assets/rocket.svg';


const { isOpen } = useSidebar();
const activeClass = 'bg-gray-600 bg-opacity-25 text-gray-100 border-red-600';
const inactiveClass = 'border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100';

const year = new Date().getFullYear();
</script>
