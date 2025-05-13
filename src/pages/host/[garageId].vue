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

          <!-- Reservation Info -->
          <v-card-text v-if="reservations[item.id]">
            <strong>Reserved</strong><br />
            Ticket ID: <code>{{ reservations[item.id].ticketId }}</code><br />
            Expires: {{ formatTime(reservations[item.id].expiresAt) }}
          </v-card-text>

          <v-card-text v-else>
            <em>Available</em>
          </v-card-text>

          <!-- Description or AI Generator -->
          <v-card-text>
            <div v-if="item.description">
              {{ item.description }}
              <v-textarea
                v-model="aiNotesMap[item.id]"
                label="Optional notes for regeneration"
                rows="2"
                class="mt-2"
                variant="outlined"
                density="compact"
              />
              <v-btn
                size="x-small"
                class="mt-2"
                variant="text"
                color="primary"
                :loading="loadingMap[item.id]"
                @click="generateAI(item)"
              >
                Regenerate
              </v-btn>
            </div>

            <div v-else>
              <v-textarea
                v-model="aiNotesMap[item.id]"
                label="Optional notes for AI"
                rows="2"
                class="mb-2"
                variant="outlined"
                density="compact"
              />
              <v-btn
                size="small"
                color="primary"
                variant="outlined"
                :loading="loadingMap[item.id]"
                @click="generateAI(item)"
              >
                Generate Description with AI
              </v-btn>
            </div>
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
const loadingMap = ref({})
const aiNotesMap = ref({})


onMounted(async () => {
  try {
    // Fetch garage items
    const res = await fetch(`http://localhost:3001/api/garage/${garageId}`)
    const result = await res.json()
    if (result.success) {
      garage.value = result.garage
    }

    // Fetch reservations
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

  const generateAI = async (item) => {
  loadingMap.value[item.id] = true

  try {
    const res = await fetch('http://localhost:3001/api/ai/generate-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: item.title,
        condition: 'good',
        notes: aiNotesMap.value[item.id] || '',
      }),
    })

    const data = await res.json()

    if (data.success) {
      item.description = data.description
    } else {
      alert('❌ AI failed: ' + (data.message || 'Unknown error'))
    }
  } catch (err) {
    alert('🚨 Network error')
    console.error(err)
  } finally {
    loadingMap.value[item.id] = false
  }
}
</script>
