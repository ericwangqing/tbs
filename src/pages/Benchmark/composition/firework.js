import * as THREE from 'three'
export class Fireworks {
  constructor(container) {
    this.running = true
    const width = container.offsetWidth
    const height = container.offsetHeight
    this.screen = {
      width: width,
      height: height,
      centerx: width / 2,
      centery: height / 2,
      ratio: width / height,
    }
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    this.camera = new THREE.PerspectiveCamera(60, this.screen.ratio, 0.1, 20000)
    this.scene = new THREE.Scene()
    this.camera.position.set(0, 0, 0)
    this.camera.rotation.set(0, 0, 0)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.sortObjects = true
    this.fireworks = []
    this.renderer.setSize(width, height)
    this.frameId = ''
    container.append(this.renderer.domElement)
  }

  draw() {
    this.frameId = requestAnimationFrame(() => this.draw())
    if (!this.running) return

    // add fireworks
    if (THREE.MathUtils.randInt(1, 20) === 10) {
      this.fireworks.push(new Firework(this.screen, this.scene))
    }
    // update fireworks
    for (var i = 0; i < this.fireworks.length; i++) {
      if (this.fireworks[i].done) {
        // cleanup
        this.fireworks.splice(i, 1)
        continue
      }
      this.fireworks[i].update()
    }
    // render
    this.renderer.render(this.scene, this.camera)
  }

  start() {
    this.running = true
    this.draw()
  }

  stop() {
    this.running = false
    this.fireworks.map((firework) => firework.reset())
    this.fireworks = []
  }

  dispose() {
    if (this.frameId) cancelAnimationFrame(this.frameId)
  }
}

class Firework {
  constructor(screen, scene, camera) {
    this.screen = screen
    this.scene = scene
    this.done = false
    this.dest = []
    this.colors = []
    this.geometry = null
    this.points = null
    this.material = new THREE.PointsMaterial({
      size: 16,
      color: 0xffffff,
      opacity: 1,
      vertexColors: true,
      transparent: true,
      depthTest: false,
    })
    this.launch()
  }

  reset() {
    this.scene.remove(this.points)
    this.dest = []
    this.colors = []
    this.geometry = null
    this.points = null
  }

  launch() {
    const x = THREE.MathUtils.randInt(-this.screen.width * 1.5, this.screen.width * 1.5)
    const y = THREE.MathUtils.randInt(500, 1200)
    const z = THREE.MathUtils.randInt(-2000, -4000)

    const from = new THREE.Vector3(x, -200, z)
    const to = new THREE.Vector3(x, y, z)

    const aColor = []
    const color = new THREE.Color()
    color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), 1, 0.9)
    aColor.push(color.r)
    aColor.push(color.g)
    aColor.push(color.b)

    this.geometry = new THREE.BufferGeometry().setFromPoints([from])
    this.points = new THREE.Points(this.geometry, this.material)

    this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(aColor), 3))

    this.dest.push(to)
    this.colors.push(color)
    this.scene.add(this.points)
  }

  explode(vector) {
    this.scene.remove(this.points)
    this.dest = []
    this.colors = []
    this.geometry = new THREE.BufferGeometry()
    this.points = new THREE.Points(this.geometry, this.material)

    const froms = []
    for (let i = 0; i < 80; i++) {
      const color = new THREE.Color()
      color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), 1, 0.5)

      this.colors.push(color.r)
      this.colors.push(color.g)
      this.colors.push(color.b)

      const from = new THREE.Vector3(
        THREE.MathUtils.randInt(vector.x - 10, vector.x + 10),
        THREE.MathUtils.randInt(vector.y - 10, vector.y + 10),
        THREE.MathUtils.randInt(vector.z - 10, vector.z + 10)
      )
      const to = new THREE.Vector3(
        THREE.MathUtils.randInt(vector.x - 1000, vector.x + 1000),
        THREE.MathUtils.randInt(vector.y - 1000, vector.y + 1000),
        THREE.MathUtils.randInt(vector.z - 1000, vector.z + 1000)
      )
      froms.push(from)
      this.dest.push(to)
    }
    this.geometry.setFromPoints(froms)
    this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(this.colors), 3))
    this.scene.add(this.points)
  }

  update() {
    // only if objects exist
    if (this.points && this.geometry) {
      const positions = this.geometry.attributes.position.array
      const total = positions.length
      this.geometry.attributes.position.needsUpdate = true

      // lerp particle positions
      for (let i = 0; i < total; i += 3) {
        positions[i] += (this.dest[i / 3].x - positions[i]) / 20
        positions[i + 1] += (this.dest[i / 3].y - positions[i + 1]) / 20
        positions[i + 2] += (this.dest[i / 3].z - positions[i + 2]) / 20
      }
      // watch first particle for explosion
      if (total === 3) {
        if (Math.ceil(positions[1]) > this.dest[0].y - 20) {
          this.explode(new THREE.Vector3(positions[0], positions[1], positions[2]))
          return
        }
      }
      // fade out exploded particles
      if (total > 3) {
        this.material.opacity -= 0.015
        this.material.needsUpdate = true
      }
      // remove, reset and stop animating
      if (this.material.opacity <= 0) {
        this.reset()
        this.done = true
        return
      }
    }
  }
}
