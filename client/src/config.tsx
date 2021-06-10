const config = {
  endpoints: {
    backend: import.meta.env.DEV ? 'http://localhost:8080' : window.location.href,
  },
}

export default config
