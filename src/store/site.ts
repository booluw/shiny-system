import { defineStore } from 'pinia'

export const useSiteStore = defineStore('site', {
  state: () => ({
    loading: false
  })
})