<template>
    <v-container class="py-6">
      <h1 class="text-h5 mb-6">Create a Garage Sale</h1>
  
      <v-form @submit.prevent="submit">
        <v-text-field v-model="form.name" label="Garage Sale Name" required />
        <v-text-field v-model="form.neighborhood_id" label="Neighborhood ID" required />
        <v-text-field v-model="form.house_id" label="House ID (Admin)" required />
  
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.start_date"
              label="Start Date"
              type="date"
              required
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.end_date"
              label="End Date"
              type="date"
              required
            />
          </v-col>
        </v-row>
  
        <v-btn type="submit" color="primary" :loading="loading">Create</v-btn>
      </v-form>
  
      <v-snackbar v-model="snackbar" :timeout="3000" color="success">
        Garage sale created successfully!
      </v-snackbar>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const form = ref({
    name: '',
    neighborhood_id: '',
    house_id: '',
    start_date: '',
    end_date: '',
  })
  
  const loading = ref(false)
  const snackbar = ref(false)
  
  const submit = async () => {
    loading.value = true
    try {
      const res = await fetch('http://localhost:3001/api/garage-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      })
  
      const data = await res.json()
      if (data.success) {
        snackbar.value = true
      } else {
        alert(data.message || '❌ Failed to create garage sale')
      }
    } catch (err) {
      console.error(err)
      alert('🚨 Network error')
    } finally {
      loading.value = false
    }
  }
  </script>  