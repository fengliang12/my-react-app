import { configure, observable, action } from 'mobx'

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const store = observable({
  // 数据字段
  updateStyle: observable.map(),
  updateCom: {
    current: observable.map(),
    src: observable.map(),
    offset: observable.map(),
    nodes: observable.map(),
    muted: observable.map()
  },
  eventPointTo: observable.map(),
  popup: observable.map(),
  // actions
  setCom: action(function (payload, pageId) {
    if (Array.isArray(payload)) {
      payload.forEach(item => {
        this.updateCom[item.type].set(`${pageId}_${item.key}`, item.value)
      })
    } else {
      this.updateCom[payload.type].set(`${pageId}_${payload.key}`, payload.value)
    }
  }),
  setStyle: action(function (payload, pageId) {
    if (Array.isArray(payload)) {
      payload.forEach(item => {
        this.updateStyle.set(`${pageId}_${item.key}`, item.value)
      })
    } else {
      this.updateStyle.set(`${pageId}_${payload.key}`, payload.value)
    }
  }),
  setEventPointTo: action(function (payload, pageId) {
    this.eventPointTo.set(`${pageId}_${payload.key}`, payload.value)
  }),
  setToggleEventPointTo: action(function (key, pageId) {
    this.eventPointTo.set(`${pageId}_${key}`, this.eventPointTo.get(key) === 'ev' ? 'e' : 'ev')
  }),
  setPopup: action(function (payload) {
    this.popup.set(`${payload.key}`, payload.value)
  }),
  setComCurrent: action(function (payload, pageId) {
    const { updateCurrent, relation, swiperRelation } = payload
    const changeDatas = [{ key: updateCurrent?.id, value: updateCurrent?.newCurrent }]
    if (relation?.length > 0) {
      const gap = updateCurrent?.newCurrent - updateCurrent?.oldCurrent
      swiperRelation.forEach(cur => {
        if (relation.includes(cur.id)) {
          let current = (this.updateCom.current.get(`${pageId}_${cur.id}`) || 0) + gap
          if (current >= cur.count) {
            current = cur.count - 1
          }
          if (current < 0) {
            current = 0
          }
          changeDatas.push({
            key: cur.id,
            value: current
          })
        }
      })
    }
    changeDatas?.forEach(item => {
      this.updateCom.current.set(`${pageId}_${item.key}`, item.value)
    })
  })
})
