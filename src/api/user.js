import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: 'user/update',
    method: 'post',
    data
  })
}

export function getUserList(data) {
  return request({
    url: '/user/lists',
    method: 'post',
    data
  })
}

export function removeUser(data) {
  return request({
    url: '/user/remove',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
