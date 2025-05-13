<template>
    <v-container class="py-6">
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-2">{{ garage?.title }}</h1>
          <div class="text-subtitle-1">{{ garage?.address }}</div>
        </v-col>
      </v-row>
  
      <v-row v-if="garage?.items?.length">
        <v-col
          v-for="item in garage.items"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card class="h-100" elevation="2">
            <v-card-title>{{ item.title }}</v-card-title>
            <v-card-subtitle>${{ item.price }}</v-card-subtitle>
            <v-card-actions>
              <v-btn variant="outlined" disabled>Reserve (Coming Soon)</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <v-alert type="info" v-else>
        This garage hasn’t listed any items yet.
      </v-alert>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const garageId = route.params.id
  
  const garage = ref(null)
  
  onMounted(async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/garage/${garageId}`)
      const result = await res.json()
      if (result.success) {
        garage.value = result.garage
      } else {
        console.error('❌ Could not load garage')
      }
    } catch (err) {
      console.error('🚨 Network error loading garage:', err)
    }
  })
  </script>
  