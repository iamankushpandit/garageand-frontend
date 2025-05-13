<template>
  <v-container class="py-8 text-center">
    <h1 class="text-h5 mb-4">Your Reservation Ticket</h1>

    <v-card class="mx-auto pa-4" max-width="400">
      <v-card-title class="text-center">Ticket ID: {{ ticket?.ticketId }}</v-card-title>
      <v-card-text>
        <div><strong>Item ID:</strong> {{ ticket?.itemId }}</div>
        <div><strong>Expires:</strong> {{ formatTime(ticket?.expiresAt) }}</div>
        <v-divider class="my-4"></v-divider>
        <div v-if="qrData">
          <img :src="qrData" alt="QR Code" style="max-width: 250px" />
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import QRCode from 'qrcode'

const route = useRoute()
const ticketId = route.params.ticketId

const ticket = ref(null)
const qrData = ref('')

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3001/api/reserve/ticket/${ticketId}`)
    const result = await res.json()
    if (result.success) {
      ticket.value = result
      qrData.value = await QRCode.toDataURL(result.ticketId)
    }
  } catch (err) {
    console.error('Failed to load ticket:', err)
  }
})
</script>
