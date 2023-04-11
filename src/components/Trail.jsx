import * as THREE from 'three'
import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload, ScrollControls, Scroll, useScroll, Image as ImageImpl } from '@react-three/drei'
import Jet from './Jet'

function Image({ c = new THREE.Color(), ...props }) {
  const ref = useRef()
  const [hovered, hover] = useState(false)
  useFrame(() => {
    ref.current.material.color.lerp(c.set(hovered ? 'white' : '#ccc'), hovered ? 0.4 : 0.05)
  })
  return <ImageImpl ref={ref} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} {...props} />
}

function Images() {
  const { width, height } = useThree((state) => state.viewport)
  const data = useScroll()
  const group = useRef()
  useFrame(() => {
    group.current.children[0].material.zoom = 1 + data.range(0, 1 / 3) / 3
    group.current.children[1].material.zoom = 1 + data.range(0, 1 / 3) / 3
    group.current.children[2].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 3
    group.current.children[3].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2
    group.current.children[4].material.zoom = 1 + data.range(1.25 / 3, 1 / 3) / 1
    group.current.children[5].material.zoom = 1 + data.range(1.8 / 3, 1 / 3) / 3
    group.current.children[5].material.grayscale = 1 - data.range(1.6 / 3, 1 / 3)
    group.current.children[6].material.zoom = 1 + (1 - data.range(2 / 3, 1 / 3)) / 3
  })
  return (
    <group ref={group}>
      <Image position={[-2, 0, 0]} scale={[4, height, 1]} url="https://media.defense.gov/2021/Aug/13/2002830972/2000/2000/0/210809-D-IJ948-9001.JPG" />
      <Image position={[2, 0, 1]} scale={3} url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYQN_uLmiAscB8COpEut6Y2vLhlBgIraQkVBv3j4i2QKW5JRaYdUnyRetW1vLl-P02BTc&usqp=CAU" />
      <Image position={[-2.3, -height, 2]} scale={[1, 3, 1]} url="https://media.defense.gov/2021/Aug/13/2002830972/2000/2000/0/210809-D-IJ948-9001.JPG" />
      <Image position={[-0.6, -height, 3]} scale={[1, 2, 1]} url="https://media.defense.gov/2021/Aug/13/2002830972/2000/2000/0/210809-D-IJ948-9001.JPG" />
      <Image position={[0.75, -height, 3.5]} scale={1.5} url="https://cdn.shopify.com/s/files/1/1254/2471/products/latest.jpg?v=1545269069" />
      <Image position={[0, -height * 1.5, 2.5]} scale={[1.5, 3, 1]} url="https://media.defense.gov/2021/Aug/13/2002830972/2000/2000/0/210809-D-IJ948-9001.JPG" />
      <Image position={[0, -height * 2 - height / 4, 0]} scale={[width, height / 2, 1]} url="https://qph.cf2.quoracdn.net/main-qimg-d610e3354142aa67672033b23c60b1af-lq" />
     
      
    </group>
  )
}

export default function Trail() {
  return (
    <Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <ScrollControls damping={1} pages={3} >
          <Scroll>
            <Images />
          </Scroll>
          <Scroll html >
            <div className='font-mono'>
          <h1 style={{ position: 'absolute', top: '8.5vh',  fontSize: '14vw' }}>nicoroc </h1>
            <h1 style={{ position: 'absolute', top: '60vh',  fontSize: '14vw' }}>presents...</h1>
            <h1 className='text-blue-900 font-bold tracking-tight border rounded-full bg-white bg-opacity-80 p-4 ml-3'style={{ position: 'absolute', top: '120vh', left: '6vw', fontSize: '20vw' }}>a new single</h1>
            <h1 className='border rounded-full bg-white p-2 ml-3'style={{ position: 'absolute', top: '220.5vh', left: '0.5vw', fontSize: '10vw' }}>raptor</h1></div>
          </Scroll>
          
        </ScrollControls>
        <Preload />
      </Suspense>
    </Canvas>
  )
}

