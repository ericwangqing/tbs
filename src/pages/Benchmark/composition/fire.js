import * as THREE from 'three'
import { randomBetween } from './util'

const fireVertexShader = `
  attribute vec4 orientation;
  attribute vec3 offset;
  attribute vec2 scale;
  attribute float life;
  attribute float random;

  varying vec2 vUv;
  varying float vRandom;
  varying float vAlpha;

  float range(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
      float oldRange = oldMax - oldMin;
      float newRange = newMax - newMin;
      return (((oldValue - oldMin) * newRange) / oldRange) + newMin;
  }

  // From Inigo Quilez http://www.iquilezles.org/www/articles/functions/functions.htm
  float pcurve(float x, float a, float b) {
      float k = pow(a + b, a + b) / (pow(a, a) * pow(b, b));
      return k * pow(x, a) * pow(1.0 - x, b);
  }

  void main() {
      vUv = uv;
      vRandom = random;

      vAlpha = pcurve(life, 1.0, 2.0);

      vec3 pos = position;

      pos.xy *= scale * vec2(range(pow(life, 1.5), 0.0, 1.0, 1.0, 0.6), range(pow(life, 1.5), 0.0, 1.0, 0.6, 1.2));

      vec4 or = orientation;
      vec3 vcV = cross(or.xyz, pos);
      pos = vcV * (2.0 * or.w) + (cross(or.xyz, vcV) * 2.0 + pos);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fireFragmentShader = `
  uniform sampler2D uMap;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uTime;

  varying vec2 vUv;
  varying float vAlpha;
  varying float vRandom;

  void main() {
      vec2 uv = vUv;

      float spriteLength = 10.0;
      uv.x /= spriteLength;
      float spriteIndex = mod(uTime * 0.1 + vRandom * 2.0, 1.0);
      uv.x += floor(spriteIndex * spriteLength) / spriteLength;

      vec4 map = texture2D(uMap, uv);

      gl_FragColor.rgb = mix(uColor2, uColor1, map.r);
      gl_FragColor.a = vAlpha * map.a;
  }
  `;

const embersVertexShader = `
  attribute float size;
  attribute float life;
  attribute vec3 offset;

  varying float vAlpha;

  // From Inigo Quilez http://www.iquilezles.org/www/articles/functions/functions.htm
  float impulse(float k, float x) {
      float h = k * x;
      return h * exp(1.0 - h);
  }

  void main() {
      vAlpha = impulse(6.28, life);

      vec3 pos = position;
      pos += offset * vec3(life * 0.7 + 0.3, life * 0.9 + 0.1, life * 0.7 + 0.3);

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = size * (80.0 / length(mvPosition.xyz));
      gl_Position = projectionMatrix * mvPosition;
  }
`;

const embersFragmentShader = `
  uniform sampler2D uMap;
  uniform vec3 uColor;

  varying float vAlpha;

  void main() {
      vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
      vec4 mask = texture2D(uMap, uv);

      gl_FragColor.rgb = uColor;
      gl_FragColor.a = mask.a * vAlpha * 0.8;
  }
`;

const hazeVertexShader = `
  attribute vec3 base;
  attribute vec3 offset;
  attribute vec4 orientation;
  attribute vec2 scale;
  attribute float life;

  varying float vAlpha;
  varying vec2 vUv;

  // From Inigo Quilez http://www.iquilezles.org/www/articles/functions/functions.htm
  float impulse(float k, float x) {
      float h = k * x;
      return h * exp(1.0 - h);
  }

  float pcurve(float x, float a, float b) {
      float k = pow(a + b, a + b) / (pow(a, a) * pow(b, b));
      return k * pow(x, a) * pow(1.0 - x, b);
  }

  void main() {
      vUv = uv;
      vAlpha = pcurve(life, 1.0, 2.0);

      vec3 pos = position;

      pos.xy *= scale * (life * 0.7 + 0.3);

      vec4 or = orientation;
      vec3 vcV = cross(or.xyz, pos);
      pos = vcV * (2.0 * or.w) + (cross(or.xyz, vcV) * 2.0 + pos);

      pos += base;
      pos += offset * vec3(life * 0.7 + 0.3, life * 0.9 + 0.1, life * 0.7 + 0.3);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);;
  }
`;

const hazeFragmentShader = `
  uniform sampler2D uMap;
  uniform sampler2D uMask;
  uniform vec2 uResolution;

  varying float vAlpha;
  varying vec2 vUv;

  void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;
      vec2 mask = texture2D(uMask, vUv).ra - vec2(0.5);
      uv -= mask * 0.1;
      vec4 tex = texture2D(uMap, uv);

      gl_FragColor.rgb = tex.rgb;
      gl_FragColor.a = vAlpha * 0.5;
  }
`;

export class Fire {
  constructor(dom) {
    this.renderContainer = dom
    this._rtt = null
    this._fire = null
    this._width = 0
    this._height = 0
    this.initWorld()
    this.initScene()
  }

  initWorld() {
    this._renderer = new THREE.WebGLRenderer()
    this._renderer.setPixelRatio(2)
    this._renderer.setSize(this.renderContainer.offsetWidth, this.renderContainer.offsetHeight)
    this._renderer.setClearColor(0x212435, 0)
    this.renderContainer.appendChild(this._renderer.domElement)

    this._scene = new THREE.Scene()

    this._camera = new THREE.PerspectiveCamera(45, this.renderContainer.offsetWidth / this.renderContainer.offsetHeight, 0.1, 1000)
    this._camera.position.set(0, 0, 4)
    this._camera.target = new THREE.Vector3()
    this._camera.lookAt(this._camera.target)

    this.render = this.render.bind(this)
    requestAnimationFrame(this.render)

    this._width = this.renderContainer.offsetWidth
    this._height = this.renderContainer.offsetHeight
    this.resetRT()
  }

  resetRT() {
    const _parameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false
    }
    if (this._rtt) this._rtt.dispose()
    this._rtt = new THREE.WebGLRenderTarget(this._width * 0.5, this._height * 0.5, _parameters)
  }

  render() {
    if (!this) return
    requestAnimationFrame(this.render)
    // if (_controls) _controls.update()
    this._renderer.render(this._scene, this._camera)
  }

  initScene() {
    this._fire = Fireball.init(this._scene)
    const embers = new Embers(this._scene, this._fire)
    const haze = new Haze(this._scene, this._renderer, this._width, this._height, this._fire, this._rtt, this._camera)
  }
}

class Fireball {
  static init(scene) {
    const fireBall = new this(scene)
    return fireBall._fire
  }

  constructor(scene) {
    this._geometry = null
    this._shader = null
    this._mesh = null
    this._group = null
    this._num = 48
    this._x = new THREE.Vector3(1, 0, 0)
    this._y = new THREE.Vector3(0, 1, 0)
    this._z = new THREE.Vector3(0, 0, 1)
    this._scene = scene

    this._tipTarget = new THREE.Vector3()
    this._tip = new THREE.Vector3()
    this._diff = new THREE.Vector3()

    this._quat = new THREE.Quaternion()
    this._quat2 = new THREE.Quaternion()

    this.init()
  }

  init() {
    this.initGeometry()
    this.initInstances()
    this.initShader()
    this.initMesh()
    this.loop = this.loop.bind(this)
    requestAnimationFrame(this.loop)
  }

  initGeometry() {
    this._geometry = new THREE.InstancedBufferGeometry()
    this._geometry.maxInstancedCount = this._num

    const shape = new THREE.PlaneGeometry(1, 1)
    shape.translate(0, 0.4, 0)
    const data = shape.attributes

    this._geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(data.position.array), 3))
    this._geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(data.uv.array), 2))
    this._geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(data.normal.array), 3))
    this._geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(shape.index.array), 1))
    shape.dispose()
  }

  initInstances() {
    const orientation = new THREE.InstancedBufferAttribute(new Float32Array(this._num * 4), 4)
    const randoms = new THREE.InstancedBufferAttribute(new Float32Array(this._num), 1)
    const scale = new THREE.InstancedBufferAttribute(new Float32Array(this._num * 2), 2)
    const life = new THREE.InstancedBufferAttribute(new Float32Array(this._num), 1)

    for (let i = 0; i < this._num; i++) {
      orientation.setXYZW(i, 0, 0, 0, 1)
      life.setX(i, i / this._num + 1)
    }

    this._geometry.setAttribute('orientation', orientation)
    this._geometry.setAttribute('scale', scale)
    this._geometry.setAttribute('life', life)
    this._geometry.setAttribute('random', randoms)
  }

  initShader() {
    const uniforms = {
      uMap: { type: 't', value: null },
      uColor1: { type: 'c', value: new THREE.Color(0x961800) }, // red
      uColor2: { type: 'c', value: new THREE.Color(0x4b5828) }, // yellow
      uTime: { type: 'f', value: 0 }
    }

    this._shader = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: fireVertexShader,
      fragmentShader: fireFragmentShader,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    })

    const textureLoader = new THREE.TextureLoader()
    textureLoader.load('/src/assets/flame.png', t => this._shader.uniforms.uMap.value = t)
  }

  initMesh() {
    this._group = new THREE.Group()
    this._mesh = new THREE.Mesh(this._geometry, this._shader)
    this._mesh.frustumCulled = false
    this._group.add(this._mesh)
    this._scene.add(this._group)
    this._fire = this._group
  }

  loop(e) {
    if (!this) return
    requestAnimationFrame(this.loop)
    this._shader.uniforms.uTime.value = e * 0.001

    let life = this._geometry.attributes.life
    let orientation = this._geometry.attributes.orientation
    let scale = this._geometry.attributes.scale
    let randoms = this._geometry.attributes.random

    for (let i = 0; i < this._num; i++) {
      let value = life.array[i]
      value += 0.04

      if (value > 1) {
        value -= 1

        this._quat.setFromAxisAngle(this._y, randomBetween(0, 3.14, 3))
        this._quat2.setFromAxisAngle(this._x, randomBetween(-1, 1, 2) * 0.1)
        this._quat.multiply(this._quat2)
        this._quat2.setFromAxisAngle(this._z, randomBetween(-1, 1, 2) * 0.3)
        this._quat.multiply(this._quat2)
        orientation.setXYZW(i, this._quat.x, this._quat.y, this._quat.z, this._quat.w)

        scale.setXY(i, randomBetween(1.8, 2.2, 3), randomBetween(2.8, 1.2, 3))
        randoms.setX(i, randomBetween(0, 1, 3))
      }

      life.setX(i, value)
    }
    life.needsUpdate = true
    orientation.needsUpdate = true
    scale.needsUpdate = true
    randoms.needsUpdate = true

    let tipOffset = 0.4
    this._tipTarget.copy(this._group.position)
    this._tipTarget.y += tipOffset
    this._tip.lerp(this._tipTarget, 0.1)

    this._diff.copy(this._tip)
    this._diff.sub(this._group.position)
    let length = this._diff.length()
    this._group.scale.y = (length / tipOffset - 1) * 0.4 + 1

    this._group.quaternion.setFromUnitVectors(this._y, this._diff.normalize())
  }
}

class Embers {
  constructor(scene, fire) {
    this._geometry = null
    this._shader = null
    this._points = null
    this._num = 8
    this._scene = scene
    this._fire = fire
    this.init()
  }

  init() {
    this.initGeometry()
    this.initShader()
    this.initMesh()
    this.loop = this.loop.bind(this)
    requestAnimationFrame(this.loop)
  }

  initGeometry() {
    this._geometry = new THREE.BufferGeometry()
    this._geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this._num * 3), 3))
    this._geometry.setAttribute('offset', new THREE.BufferAttribute(new Float32Array(this._num * 3), 3))
    this._geometry.setAttribute('size', new THREE.BufferAttribute(new Float32Array(this._num), 1))
    this._geometry.setAttribute('life', new THREE.BufferAttribute(new Float32Array(this._num), 1))

    for (let i = 0; i < this._num; i++) {
      this._geometry.attributes.life.setX(i, randomBetween(0, 1, 3) + 1)
    }
  }

  initShader() {
    const uniforms = {
      uMap: { type: 't', value: null },
      uColor: { type: 'c', value: new THREE.Color(0xffe61e) }
    }

    this._shader = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: embersVertexShader,
      fragmentShader: embersFragmentShader,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false
    })

    const textureLoader = new THREE.TextureLoader()
    textureLoader.load('/src/assets/ember.png', t => this._shader.uniforms.uMap.value = t)
  }

  initMesh() {
    this._points = new THREE.Points(this._geometry, this._shader)
    this._points.frustumCulled = false
    this._scene.add(this._points)
  }

  loop() {
    if (!this) return
    requestAnimationFrame(this.loop)
    let life = this._geometry.attributes.life
    let position = this._geometry.attributes.position
    let size = this._geometry.attributes.size
    let offset = this._geometry.attributes.offset
    for (let i = 0; i < this._num; i++) {
      let value = life.array[i]
      value += 0.02

      if (value > 1) {
        value -= 1

        position.setXYZ(i, this._fire.position.x, this._fire.position.y + 0.1, this._fire.position.z)
        offset.setXYZ(i, randomBetween(-0.2, 0.2, 3), randomBetween(0.7, 1.2, 3), randomBetween(-0.2, 0.2, 3))
        size.setX(i, randomBetween(0.2, 0.5, 3))
      }

      life.setX(i, value)
    }

    life.needsUpdate = true
    position.needsUpdate = true
    size.needsUpdate = true
    offset.needsUpdate = true
  }
}

class Haze {
  constructor(scene, renderer, width, height, fire, rtt, camera) {
    this._geometry = null
    this._shader = null
    this._mesh = null
    this._num = 4
    this._scene = scene
    this._renderer = renderer
    this._width = width
    this._height = height
    this._fire = fire
    this._rtt = rtt
    this._camera = camera
    this._z = new THREE.Vector3(0, 0, 1)
    this._quat = new THREE.Quaternion()
    this._quat2 = new THREE.Quaternion()
    this.init()
  }

  init() {
    this.initGeometry()
    this.initInstances()
    this.initShader()
    this.initMesh()
    this.resizeHaze()
    this.loop = this.loop.bind(this)
    requestAnimationFrame(this.loop)
  }

  initGeometry() {
    this._geometry = new THREE.InstancedBufferGeometry()
    this._geometry.maxInstancedCount = this._num

    const shape = new THREE.PlaneGeometry(2, 2)
    const data = shape.attributes

    this._geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(data.position.array), 3))
    this._geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(data.uv.array), 2))
    this._geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(data.normal.array), 3))
    this._geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(shape.index.array), 1))
    shape.dispose()
  }

  initInstances() {
    const base = new THREE.InstancedBufferAttribute(new Float32Array(this._num * 3), 3)
    const offset = new THREE.InstancedBufferAttribute(new Float32Array(this._num * 3), 3)
    const orientation = new THREE.InstancedBufferAttribute(new Float32Array(this._num * 4), 4)
    const scale = new THREE.InstancedBufferAttribute(new Float32Array(this._num * 2), 2)
    const rotation = new THREE.InstancedBufferAttribute(new Float32Array(this._num), 1)
    const life = new THREE.InstancedBufferAttribute(new Float32Array(this._num), 1)

    for (let i = 0; i < this._num; i++) {
        orientation.setXYZW(i, 0, 0, 0, 1)
        life.setX(i, i / this._num + 1)
    }

    this._geometry.setAttribute('base', base)
    this._geometry.setAttribute('offset', offset)
    this._geometry.setAttribute('orientation', orientation)
    this._geometry.setAttribute('scale', scale)
    this._geometry.setAttribute('rotation', rotation)
    this._geometry.setAttribute('life', life)
  }

  initShader() {
    const dpr = this._renderer.getPixelRatio()
    const uniforms = {
      uMap: { type: 't', value: null },
      uMask: { type: 't', value: null },
      uResolution: { type: 'v2', value: new THREE.Vector2(this._width * dpr, this._height * dpr) }
    }

    this._shader = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: hazeVertexShader,
      fragmentShader: hazeFragmentShader,
      transparent: true,
      depthTest: false
    })

    const textureLoader = new THREE.TextureLoader()
    textureLoader.load('/src/assets/haze.png', t => this._shader.uniforms.uMask.value = t)
  }
  
  initMesh() {
    this._mesh = new THREE.Mesh(this._geometry, this._shader)
    this._mesh.frustumCulled = false
    this._scene.add(this._mesh)
  }

  resizeHaze() {
    const dpr = this._renderer.getPixelRatio()
    this._shader.uniforms.uMap.value = this._rtt.texture
    this._shader.uniforms.uResolution.value.set(this._width * dpr, this._height * dpr)
  }

  loop(e) {
    if (!this) return
    requestAnimationFrame(this.loop)

    this._mesh.visible = false
    this._renderer.render(this._scene, this._camera, this._rtt)
    this._mesh.visible = true

    let life = this._geometry.attributes.life
    let base = this._geometry.attributes.base
    let offset = this._geometry.attributes.offset
    let scale = this._geometry.attributes.scale
    let orientation = this._geometry.attributes.orientation
    const rotation = this._geometry.attributes.rotation
    for (let i = 0; i < this._num; i++) {
      let value = life.array[i]
      value += 0.008

      if (value > 1) {
        value -= 1

        rotation.setX(i, randomBetween(0, 3.14, 3))

        base.setXYZ(i, this._fire.position.x, this._fire.position.y + 0.1, this._fire.position.z)
        offset.setXYZ(i, randomBetween(-0.2, 0.2, 3), randomBetween(2.5, 3.0, 3), 0)
        scale.setXY(i, randomBetween(0.6, 1.2, 3), randomBetween(0.6, 1.2, 3))
      }

      this._quat.copy(this._camera.quaternion)
      this._quat2.setFromAxisAngle(this._z, rotation.array[i])
      this._quat.multiply(this._quat2)
      orientation.setXYZW(i, this._quat.x, this._quat.y, this._quat.z, this._quat.w)

      life.setX(i, value)
    }

    life.needsUpdate = true
    base.needsUpdate = true
    scale.needsUpdate = true
    offset.needsUpdate = true
    orientation.needsUpdate = true
  }
}
