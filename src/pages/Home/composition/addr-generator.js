import mockIp from './mock-ip-lng-lat.json'

class AddrGenerator {
  constructor() {
    this.ipCache = {}
    mockIp.map((data) => {
      this.ipCache[data[0]] = {
        longitude: data[1],
        latitude: data[2],
      }
    })
  }

  randomIp() {
    return mockIp[Math.floor(Math.random() * mockIp.length)][0]
  }

  ip2LngLat(ip) {
    return this.ipCache[ip] || { longitude: 0, latitude: 0 }
  }
}

export default new AddrGenerator()
