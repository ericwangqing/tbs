import * as THREE from 'three'
//Declare three.js variables
export class StarField {
  constructor(option) {
    this.camera = []
    this.scene = []
    this.renderer = []
    this.stars = []
    this.option = option || {}
    this.speed = 1
    this.speedInterval = null
    this.running = false
  }

  init(container) {
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.offsetWidth / container.offsetHeight,
      1,
      1000
    )
    this.camera.position.z = 5
    this.camera.position.y = -600
    this.camera.rotateX(0.5);
  
    //scene
    this.scene = new THREE.Scene()
  
    //renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: 1 })
    this.renderer.setClearColor(0x1890ff,0)
    //set the size of the renderer
    this.renderer.setSize(container.offsetWidth, container.offsetHeight, false)
  
    //add the renderer to the html document body
    container.appendChild(this.renderer.domElement)

    this.addSphere()
  }

  addSphere() {
    // The loop will move from z position of -1000 to z position 1000, adding a random particle at each position.
    for (let z = -2000; z < 2000; z += 20) {
      // Make a sphere (exactly the same as before).
      let geometry = new THREE.SphereGeometry(0.5, 32, 32)
      let material = new THREE.MeshBasicMaterial({ color: 0xffffff })
      let sphere = new THREE.Mesh(geometry, material)
  
      // This time we give the sphere random x and y positions between -500 and 500
      sphere.position.x = Math.random() * 1000 - 500
      sphere.position.y = Math.random() * 1000 - 500
  
      // Then set the z position to where it is in the loop (distance of camera)
      sphere.position.z = z
  
      // scale it up a bit
      sphere.scale.x = sphere.scale.y = 1.5
  
      //add the sphere to the scene
      this.scene.add(sphere)
  
      //finally push it to the stars array
      this.stars.push(sphere)
    }
  }

  animateStars() {
    // loop through each star
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i]

      // and move it forward dependent on the mouseY position.
      star.position.z += i / 10 * this.speed

      // if the particle is too close move it to the back
      if (star.position.z > 1000) star.position.z -= 2000
    }
  }

  render() {
    //get the frame
    requestAnimationFrame(() => this.render())
    if (!this.running) return
    //render the scene
    this.renderer.render(this.scene, this.camera)
    this.animateStars()
  }

  speedUp() {
    // this.speed = 10
    if (this.speedInterval) clearInterval(this.speedInterval)
    this.speedInterval = setInterval(() => {
      if (this.speed >= 10) clearInterval(this.speedInterval)
      this.speed += 2
      this.speed = Math.min(this.speed, 10)
    }, 50)
    this.stars.map((star) => {
      star.scale.z = Math.random() * 30 + 15;
      star.scale.x = star.scale.y = 0.5;
    })
  }

  speedDown() {
    // this.speed = 1
    if (this.speedInterval) clearInterval(this.speedInterval)
    this.speedInterval = setInterval(() => {
      if (this.speed <= 1) clearInterval(this.speedInterval)
      this.speed -= 2
      this.speed = Math.max(this.speed, 1)
    }, 50)
    this.stars.map((star) => {
      star.scale.z = 1;
      star.scale.x = star.scale.y = 1.5;
    })
  }

  start() {
    this.running = true
  }

  stop() {
    this.running = false
  }
}
