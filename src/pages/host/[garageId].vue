<template>
    <v-container class="py-6">
      <h1 class="text-h5 mb-6">Garage Host View</h1>
  
      <v-row>
        <v-col
          v-for="item in garage?.items"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card>
            <v-card-title>{{ item.title }}</v-card-title>
            <v-card-subtitle>${{ item.price }}</v-card-subtitle>
  
            <v-card-text v-if="reservations[item.id]">
              <strong>Reserved</strong><br />
              Ticket ID: <code>{{ reservations[item.id].ticketId }}</code><br />
              Expires: {{ formatTime(reservations[item.id].expiresAt) }}
            </v-card-text>
  
            <v-card-text v-else>
              <em>Available</em>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const garageId = route.params.garageId
  
  const garage = ref(null)
  const reservations = ref({})
  
  onMounted(async () => {
    try {
      // Fetch items from the garage
      const res = await fetch(`http://localhost:3001/api/garage/${garageId}`)
      const result = await res.json()
      if (result.success) {
        garage.value = result.garage
      }
  
      // Fetch reservation map
      const resv = await fetch('http://localhost:3001/api/reservations')
      const data = await resv.json()
      if (data.success) {
        reservations.value = data.reservations
      }
    } catch (err) {
      console.error('Failed to load host view:', err)
    }
  })
  
  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  </script>
  