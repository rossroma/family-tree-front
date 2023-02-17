import { LS } from '@/utils'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return LS.get(TokenKey)
}

export function setToken(token) {
  return LS.set(TokenKey, token, 7 * 24 * 60)
}

export function removeToken() {
  return LS.remove(TokenKey)
}
