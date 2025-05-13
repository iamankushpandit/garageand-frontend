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
              <v-btn
                :disabled="reservedItems.has(item.id)"
                color="primary"
                variant="outlined"
                @click="reserve(item.id)"
              >
                {{ reservedItems.has(item.id) ? 'Reserved' : 'Reserve' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <v-alert type="info" v-else>
        This garage hasn’t listed any items yet.
      </v-alert>
  
      <v-snackbar v-model="snackbar" :timeout="6000" color="primary" multi-line>
        {{ snackbarText }}
      </v-snackbar>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const garageId = route.params.id
  
  const garage = ref(null)
  const reservedItems = ref(new Set())
  const snackbar = ref(false)
  const snackbarText = ref('')
  
  onMounted(async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/garage/${garageId}`)
      const result = await res.json()
      if (result.success) {
        garage.value = result.garage
      }
    } catch (err) {
      console.error('🚨 Failed to load garage:', err)
    }
  })
  
  const reserve = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/reserve/${itemId}`, {
        method: 'POST',
      })
      const result = await res.json()
  
      if (result.success) {
        reservedItems.value.add(itemId)
        snackbarText.value = `🎟️ Reservation confirmed.\nYour Ticket ID: ${result.ticketId}`
      } else {
        snackbarText.value = `❌ ${result.message || 'Reservation failed'}`
      }
  
      snackbar.value = true
    } catch (err) {
      snackbarText.value = '🚨 Network error'
      snackbar.value = true
    }
  }
  </script>
  