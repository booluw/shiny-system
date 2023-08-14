import { defineStore } from 'pinia'

export const useItemStore = defineStore('item', {
  state: () => ({
    items: localStorage.getItem("images")
  }),
  getters: {
    itemGetter: (state) => JSON.parse(state.items) ?? []//JSON.parse(localStorage.getItem("images")) ?? []
  },
  actions: {
    addItem(item) {
      localStorage.setItem("images", JSON.stringify([...this.itemGetter, item]))
      this.itemGetter.unshift(item)
      location.reload();
    }
  }
})