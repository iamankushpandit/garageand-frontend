<template>
    <v-container class="py-6">
      <h1 class="text-h5 mb-4">Create a Neighborhood</h1>
  
      <v-form @submit.prevent="submit">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.name" label="Neighborhood Name" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="form.city" label="City" required />
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="form.zip_codes" label="ZIP Codes (comma-separated)" required />
          </v-col>
        </v-row>
  
        <h3 class="text-subtitle-1 mt-6">Admin Houses</h3>
  
        <div
          v-for="(house, index) in form.admin_houses"
          :key="index"
          class="mb-4"
        >
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="house.address"
                label="Admin House Address"
                required
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="house.title"
                label="Optional Title"
              />
            </v-col>
            <v-col cols="12" md="1" class="d-flex align-center">
              <v-btn
                icon
                variant="plain"
                color="red"
                @click="removeHouse(index)"
                v-if="form.admin_houses.length > 1"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
  
        <v-btn
          variant="outlined"
          class="mb-4"
          color="secondary"
          @click.prevent="addHouse"
        >
          ➕ Add Another Admin House
        </v-btn>
  
        <v-btn type="submit" color="primary" :loading="loading">
          Create
        </v-btn>
      </v-form>
  
      <v-snackbar v-model="snackbar" :timeout="3000" color="success">
        Neighborhood created successfully!
      </v-snackbar>
    </v-container>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const form = reactive({
    name: '',
    city: '',
    zip_codes: '',
    admin_houses: [{ address: '', title: '' }],
  })
  
  const loading = ref(false)
  const snackbar = ref(false)
  
  const addHouse = () => {
    form.admin_houses.push({ address: '', title: '' })
  }
  
  const removeHouse = (index) => {
    form.admin_houses.splice(index, 1)
  }
  
  const submit = async () => {
    loading.value = true
    try {
      const res = await fetch('http://localhost:3001/api/neighborhood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          city: form.city,
          zip_codes: (form.zip_codes || '').split(',').map(z => z.trim()),
          admin_houses: form.admin_houses,
        }),
      })
  
      const data = await res.json()
      if (data.success) {
        snackbar.value = true
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        alert(data.message || '❌ Failed to create neighborhood')
      }
    } catch (err) {
      alert('🚨 Network error')
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  </script>
  