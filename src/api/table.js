import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/list/get',
    method: 'post',
    data
  })
}

export function getTreeList() {
  return request({
    url: '/list/getTree',
    method: 'post'
  })
}

export function removeItem(data) {
  return request({
    url: '/item/remove',
    method: 'post',
    data
  })
}

export function getItem(data) {
  return request({
    url: '/item/get',
    method: 'post',
    data
  })
}

export function createItem(data) {
  return request({
    url: '/item/create',
    method: 'post',
    data
  })
}

export function updateItem(data) {
  return request({
    url: '/item/update',
    method: 'post',
    data
  })
}
