<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import request from '@/model.js'

const rangeValue = ref(0)
const rangeMin = ref(0)
const rangeMax = ref(100)

const tagList = ref([])
const now = ref(new Date())
let intervalId = null

const generate_tag = async () => {
  const now = new Date()
  const localizedTimeString = now.toLocaleTimeString()
  tagList.value = await request(rangeValue.value, localizedTimeString)
}

const currentTimeText = computed(() => {
  const hours = now.value.getHours()
  const minutes = now.value.getMinutes()
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  const paddedHours = displayHours.toString().padStart(2, '0')
  const paddedMinutes = minutes.toString().padStart(2, '0')
  return `${paddedHours}:${paddedMinutes} ${period}`
})

const updateTime = () => {
  now.value = new Date()
};

onMounted(() => {
  updateTime()
  intervalId = setInterval(updateTime, 1000)
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
});

</script>

<template>
  <main class="relative h-screen">
    <div id="time-container" class="container pt-12">
      <div id="time-display">{{ currentTimeText }}</div>
    </div>

    <div id="slider-container" class="p-5 w-screen absolute bottom-12">
      <div id="tag-container" class="mx-2 my-4 flex gap-1 flex-wrap-reverse">
        <span
          v-for="tag in tagList"
          class="btn bg-transparent font-normal py-4"
          v-show="!tag.selected"
          @click="() => {tag.selected = !tag.selected}"
          >
          {{ tag.label }}
        </span>
      </div>
      <div id="selected-tag-container" class="mx-2 flex gap-1 flex-wrap-reverse">
        <span
          v-for="tag in tagList"
          class="btn font-normal py-2"
          v-show="tag.selected"
          @click="() => {tag.selected = !tag.selected}"
          >
          {{ tag.label }}
        </span>
      </div>
      <input id="slider" type="range" :min="rangeMin" :max="rangeMax" v-model="rangeValue" class="range box-border w-full" @change="generate_tag" />
    </div>
  </main>
</template>

<style scoped>
div#time-display {
  font-size: 3rem;
  text-align: center;
}
</style>