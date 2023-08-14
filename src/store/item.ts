import { defineStore } from 'pinia'

export const useItemStore = defineStore('item', {
  state: () => ({
    loading: false
  })
})