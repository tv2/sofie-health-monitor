export const getRundown = (host: any) => {
  try {
    return host.state.rundown.actives[0] || {}
  } catch (e) {
    return {}
  }
}
