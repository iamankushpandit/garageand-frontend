<template>
    <v-container class="py-8">
      <h1 class="text-h5 mb-4">Join a Community Garage Sale</h1>
  
      <v-card class="pa-4" elevation="2">
        <v-form @submit.prevent="handleSubmit">
          <v-text-field v-model="address" label="Your Address" required />
          <v-text-field v-model="title" label="Optional Garage Sale Title" />
          <v-btn type="submit" color="primary" class="mt-3">Join Sale</v-btn>
        </v-form>
      </v-card>
  
      <!-- ✅ Snackbar feedback -->
      <v-snackbar v-model="snackbar" :timeout="3000" color="success">
        🎉 Garage successfully joined!
      </v-snackbar>
    </v-container>
  </template>
  
  
  <script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const joinToken = route.params.token

const address = ref('')
const title = ref('')
const snackbar = ref(false)

const handleSubmit = async () => {
  const payload = {
    join_token: joinToken,
    address: address.value,
    title: title.value,
  }

  try {
    const res = await fetch('http://localhost:3001/api/host', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = await res.json()
    if (result.success) {
      snackbar.value = true
    } else {
      alert('⚠️ Something went wrong.')
    }
  } catch (err) {
    console.error(err)
    alert('🚨 Network error. Try again.')
  }
}
</script>

  