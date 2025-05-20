<script setup>
import { ClerkProvider } from '@clerk/clerk-vue'
</script>

<template>
  <ClerkProvider>
    <router-view />
  </ClerkProvider>
</template>