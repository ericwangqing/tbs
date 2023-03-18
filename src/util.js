async function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

export {
  sleep
}
