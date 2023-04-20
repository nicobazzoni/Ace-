import { MeshPhongMaterial, Vector3 } from "three";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF, Stage, PresentationControls, OrbitControls, Gltf, Cloud, Stars, useBoxProjectedEnv, Html, useProgress, Sparkles, MeshWobbleMaterial, Text, RandomizedLight } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Trail} from "@react-three/drei";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import {
  shipPositionState,
  enemyPositionState,
  
  laserPositionState,
  scoreState,
  bulletPositionState

} from "./gameState";
import { Suspense } from "react";
import { TextureLoader } from "three";
import  F35 from './F35.jsx';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Valley from './Valley.jsx';
import { useThree } from "@react-three/fiber";
import {Physics, useParticle} from '@react-three/cannon';



//create extend function to load meshWobbleMaterial

const LASER_RANGE = 100;
const LASER_Z_VELOCITY = 1;
const ENEMY_SPEED = 0.2;
const GROUND_HEIGHT = -50;



 //useFrame to rerender the models every ten second


  //useFrame to rerender the models every ten seconds
 

  //useFrame to rerender the models every ten seconds

  function Loader() {
    return (
      <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry attach="geometry" args={[1, 16, 16]} />
        <meshStandardMaterial
          attach="material"
          color="white"
          transparent
          opacity={0.6}
          roughness={1}
          metalness={0}
        />
      </mesh>
    );
  }






function Flyer(props) {
  const { nodes, materials } = useGLTF('/fighter_jet.glb')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.Object_2.geometry} material={materials.engine_trim} />
        <mesh geometry={nodes.Object_3.geometry} material={materials.glass} />
        <mesh geometry={nodes.Object_4.geometry} material={materials.rusty} />
        <mesh geometry={nodes.Object_5.geometry} material={materials.trim1} />
        <mesh geometry={nodes.Object_6.geometry} material={materials.vents} />
        <mesh geometry={nodes.Object_7.geometry} material={materials.wings} />
        <mesh geometry={nodes.Object_8.geometry} material={materials.wings} />
        <mesh geometry={nodes.Object_9.geometry} material={materials.wings} />
        <mesh geometry={nodes.Object_10.geometry} material={materials.wings} />
      </group>
    </group>
  )
}

useGLTF.preload('/fighter_jet.glb')

function Flyer2(props) {
   const { nodes, materials } = useGLTF('/polyjet.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Object_4.geometry} material={materials.Material} />
      <mesh geometry={nodes.Object_5.geometry} material={materials['Material.001']} />
      <mesh geometry={nodes.Object_6.geometry} material={materials['Material.004']} />
      <mesh geometry={nodes.Object_8.geometry} material={materials.Material} />
      <mesh geometry={nodes.Object_10.geometry} material={materials['Material.001']} />
      <mesh geometry={nodes.Object_11.geometry} material={materials['Material.003']} />
    </group>
  )
}





function Engine() {
  const [shipPosition, setShipPosition] = useRecoilState(shipPositionState);
  const ship = useRef();
  useFrame(({ mouse }) => {
    setShipPosition({
      position: { x: mouse.x * 6, y: mouse.y * 2 },
      rotation: { z: -mouse.x * 0.5, x: -mouse.x * 0.5, y: -mouse.y * 0.2 }
    });
  });
  // Update the ships position from the updated state.
  useFrame(() => {
    ship.current.rotation.z = shipPosition.rotation.z;
    ship.current.rotation.y = shipPosition.rotation.x;
    ship.current.rotation.x = shipPosition.rotation.y;
    ship.current.position.y = shipPosition.position.y;
    ship.current.position.x = shipPosition.position.x;
  });
 //find out geometry of the model

  const { nodes} = useLoader(GLTFLoader, "/fighter_jet.glb");


  return (
    <group ref={ship} >

      <Flyer position={[0, -2, 0]} scale={[0.2, 0.2, 0.2]}  rotation={[-3,0,3]}  />

    </group>
  );
}






function Sound() {
  const [sound] = useState(() => new Audio("/laser.wav"));
 onmousedown = () => {
    sound.currentTime = 0;
    sound.play();
  };
  return null;
}






// Just a placeholder sphere to use with React Suspense while waiting for loaders to resolve.

function Terrain() {
  const terrain = useRef();

 
  const loader = new TextureLoader();
  // A png with transparency to use as the target sprite.
  const valley = loader.load("/galaxyTexture.jpeg");

  useFrame(() => {
    terrain.current.position.z += 0.4;
  });
  // Returns a mesh at GROUND_HEIGHT below the player. Scaled to 5000, 5000 with 128 segments.
  // X Rotation is -Math.PI / 2 which is 90 degrees in radians.
  return (
    <mesh
      visible
      position={[0, GROUND_HEIGHT, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      ref={terrain}
    >
      <planeBufferGeometry attach="geometry" args={[5000, 5000, 128, 128]} />
      <meshStandardMaterial
        attach="material"
        color="white"
        roughness={1}
        metalness={0}
       
        map={valley}
      />
    </mesh>
  );
}
    









function Target() {
  const rearTarget = useRef();
  const frontTarget = useRef();

  const loader = new TextureLoader();
  // A png with transparency to use as the target sprite.
  const texture = loader.load("crosshair.png");

  // Update the position of the reticle based on the ships current position.
  useFrame(({ mouse }) => {
    rearTarget.current.position.y = -mouse.y * 10;
    rearTarget.current.position.x = -mouse.x * 30;

    frontTarget.current.position.y = -mouse.y * 20;
    frontTarget.current.position.x = -mouse.x * 60;
  });
  // Sprite material has a prop called map to set the texture on.
  return (
    <group>
      <sprite position={[0, 0, -8]} ref={rearTarget}>
        <spriteMaterial attach="material" map={texture} />
      </sprite>
      <sprite position={[0, 0, -16]} ref={frontTarget}>
        <spriteMaterial attach="material" map={texture} />
      </sprite>
    
    </group>  
  );

}



function NME() {
  const enemies = useRecoilValue(enemyPositionState);
  return (
    <group>
      {enemies.map((enemy) => (
        <mesh position={[enemy.x, enemy.y, enemy.z]} key={`${enemy.x}`}>
          
   <F35 position={[3, 3, 0]} scale={[1, 1, 1]} metalness={1} rotation={[0,0,0]}    />
 </mesh>
      ))}
    </group>
  );

}




function NME2() {
  const enemies = useRecoilValue(enemyPositionState);
  return (
    <group>
      {enemies.map((enemy) => (
        <mesh position={[enemy.x, enemy.y, enemy.z ] } key={`${enemy.x}`}>
          <ambientLight intensity={2} />
          <pointLight position={[-5, -2, 2]} />

    <Flyer2 position={[-7, 4, 6] } scale={[1, 1, 1]} metalness={1} sprite={3} rotation={[0,0,0]}  />
    <Flyer2 position={[7, 12, 6] } scale={[1, 1, 1]} sprite={3} rotation={[0,0,0]}  /> 
   
          
        </mesh>
      ))}
    </group>
  );


}




function LaserController() {
  const shipPosition = useRecoilValue(shipPositionState);
  const [lasers, setLasers] = useRecoilState(laserPositionState);
  return (
    <mesh
      position={[0, 0, -8]}
      onClick={() =>
    
        setLasers([
          ...lasers,
          {
            id: Math.random(), // This needs to be unique.. Random isn't perfect but it works. Could use a uuid here.
            x: 0,
            y: 0,
            z: 0,
            velocity: [shipPosition.rotation.x * 6, shipPosition.rotation.y * 5]
          }
        ])
      
      

      } 
    >
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial
        attach="material"
        color="orange"
        emissive="#ff0860"
        visible={false}
      /> 
     
    </mesh>
   
  );
}

// Draws all of the lasers existing in state.
function Lasers() {
  const loader = new TextureLoader();
  const iris = loader.load("/boom.png");
  const lasers = useRecoilValue(laserPositionState);
  return (
    <group>
      {lasers.map((laser) => (
        <mesh position={[laser.x, laser.y, laser.z]} key={`${laser.id}`}>
          <sphereBufferGeometry attach="geometry" args={[1]} />
          <meshStandardMaterial attach="material" color='red'  />
        </mesh>
      ))}
    </group>
  );
}

//function that shows huge tortionGeometry objects that are used as the background for the game



function Streak() {
  <Trail
  width={0.2} // Width of the line
  color={'hotpink'} // Color of the line
  length={1} // Length of the line
  decay={1} // How fast the line fades away
  local={false} // Wether to use the target's world or local positions
  stride={0} // Min distance between previous and current point
  interval={1} // Number of frames to wait before next calculation
  target={undefined} // Optional target. This object will produce the trail.
  attenuation={(width) => width} // A function to define the width in each point along it.
>
  {/* If `target` is not defined, Trail will use the first `Object3D` child as the target. */}
  <mesh>
    <sphereGeometry />
    <meshBasicMaterial />
  </mesh>

  {/* You can optionally define a custom meshLineMaterial to use. */}
  {/* <meshLineMaterial color={"red"} /> */}
</Trail>
}




//function that show 'you win' text when score reaches 20 points

function Win() {
  
  const [enemies, setEnemies] = useRecoilState(enemyPositionState);
  const [lasers, setLaserPositions] = useRecoilState(laserPositionState);
  const [score, setScore] = useRecoilState(scoreState);
  const scene = useThree(({ scene }) => scene);

  return (
    <group>
      <Text
        position={[0, 0, 0]}
        color="red"
        fontSize={1.5}
        maxWidth={10}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {score === 20 ? "YOU WIN!" : null} 
        
      </Text>

    </group> 
    
  ) 
 
   
  
  
}

function Lose() {
  const [timer, setTimer] = useState(30);
  const [enemies, setEnemies] = useRecoilState(enemyPositionState);
  const [lasers, setLaserPositions] = useRecoilState(laserPositionState);
  const [score, setScore] = useRecoilState(scoreState);
  const [clock] = useState('clock')

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((timer) => timer - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  if (timer === 0 && score < 20) {
    setEnemies([]);
    setLaserPositions([]);
    setScore(0);
    setTimer(20);
  }

  return (
    <group>
      <Text fontSize={0.2} position={[1, -3.5, 0]}>
      Time left
      </Text>
      <Text
        position={[1, -3, 0]}
        color="blue"
        fontSize={0.5}
        maxWidth={10}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        
        {timer}
     {timer === 0 && score < 20 ? <Text position={[0, 0, 0]}
        color="red"
        fontSize={0.2}
        maxWidth={10}
        lineHeight={1}
        letterSpacing={0.04}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      > YOU LOSE</Text> : null}
      </Text>
    </group>

  );


}


//play music
  

function Score() {
  
  const [enemies, setEnemies] = useRecoilState(enemyPositionState);
  const [lasers, setLaserPositions] = useRecoilState(laserPositionState);
  const [score, setScore] = useRecoilState(scoreState);
  const scene = useThree(({ scene }) => scene);

  return (
    <group>
      <Text fontSize={0.2} position={[-1, -3.5, 0]}>
        Kills
      </Text>
      <Text
        position={[-1, -3, 0]}
        color="red"
        fontSize={0.5}
        maxWidth={10}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {score}
      </Text>
    </group>
  );
}




function distance(p1, p2) {
  const a = p2.x - p1.x;
  const b = p2.y - p1.y;
  const c = p2.z - p1.z;

  return Math.sqrt(a * a + b * b + c * c);
}
// This component runs game logic on each frame draw to update game state.
function GameTimer() {
  const [enemies, setEnemies] = useRecoilState(enemyPositionState);
  const [lasers, setLaserPositions] = useRecoilState(laserPositionState);
  const [score, setScore] = useRecoilState(scoreState);
const [bullets, setBullets] = useRecoilState(enemyPositionState);
  const scene = useThree(({ scene }) => scene);
  
 

  useFrame(({ mouse }) => {
    // Calculate hits and remove lasers and enemies, increase score.

    const hitEnemies = enemies
      ? enemies.map(
          (enemy) =>
            lasers.filter(
              () =>
                lasers.filter((laser) => distance(laser, enemy) < 3).length > 0
            ).length > 0
        )
      : [];

    if (hitEnemies.includes(true) && enemies.length > 0) {
      setScore(score + 1); 

  
      
    console.log("hit" )
    
    }
      
// Move all of the enemies. Remove enemies that have been destroyed, or passed the player.
setEnemies(
      enemies
        .map((enemy) => ({ x: enemy.x, y: enemy.y, z: enemy.z + ENEMY_SPEED }))
        .filter((enemy, idx) => !hitEnemies[idx] && enemy.z < 0)
        
      );
     
    
    // Move the Lasers and remove lasers at end of range or that have hit the ground.
    setLaserPositions(
      lasers
        .map((laser) => ({
          id: laser.id,
          x: laser.x + laser.velocity[0],
          y: laser.y + laser.velocity[1],
          z: laser.z - LASER_Z_VELOCITY,
          velocity: laser.velocity
        }))
        .filter((laser) => laser.z > -LASER_RANGE && laser.y > GROUND_HEIGHT)
    );

    // Add a new enemy every 5 seconds aand make them slower 
    if (Math.random() < 0.01) {
      setEnemies([
        ...enemies,
        {
          x: Math.random() * 5 - 2,
          y: Math.random() * 4 - 2,
          z: -100
        }
      ]);
    } 
    //add a new bullet every 5 seconds
   


    //play explosion sound when enemy is hit
    if (hitEnemies.includes(true) && enemies.length > 0) {
      const sound = new Audio("/boom.wav");
      sound.play();
    }
 
   
    //explosion animation when enemy is hit
    if (hitEnemies.includes(true) && enemies.length > 0) {

    
    
      
     //load boom.glb file
      const loader = new GLTFLoader();
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      loader.load("/boom.glb", function (gltf) {
        const explosion = gltf.scene;
        explosion.scale.set(0.1, 0.1, 0.1);
        explosion.rotation.set(0, 0, 0);
        //include material to make explosion red
        explosion.traverse((o) => {
          if (o.isMesh) o.material = material;
        });
         
          explosion.position.set(
          enemies[hitEnemies.indexOf(true)].x,
          enemies[hitEnemies.indexOf(true)].y,
          enemies[hitEnemies.indexOf(true)].z
        );

        explosion.rotation.set(0, 0, 0);

        

        scene.add(explosion);
        //make explosion disappear after 1 second
        setTimeout(() => {
          scene.remove(explosion);
        }, 500);
      });

  
    }

    //use drei trail to create motion effecct for lasers



   
 
});

  return null;

}



//floating spheres that move behind the planes that look like planets made of meshwobblematerial

function Shoooot() {
  const [enemies, setEnemies] = useRecoilState(enemyPositionState);
  const scene = useThree(({ scene }) => scene);

  return (
    <>
      {enemies.map((enemy) => (
        <group key={enemy.id} position={[enemy.x, enemy.y, enemy.z]}>
          <mesh>
            <sphereGeometry attach="geometry" args={[0.5, 13 ,25, ]} />
            <meshPhongMaterial
              attach="material"
              color="black"
              opacity={0.5}
              speed={10}
              factor={0.2}
              shininess={100}
              metalness={0.5}
              map={new THREE.TextureLoader().load("/iris.png")}

            />
          </mesh>


        </group>
      ))}
    </>
  );
}





<Trail
  width={0.2} // Width of the line
  color={'hotpink'} // Color of the line
  length={1} // Length of the line
  decay={1} // How fast the line fades away
  local={false} // Wether to use the target's world or local positions
  stride={0} // Min distance between previous and current point
  interval={1} // Number of frames to wait before next calculation
  target={null} // Optional target. This object will produce the trail.
  attenuation={(width) => width} // A function to define the width in each point along it.
>
  {/* If `target` is not defined, Trail will use the first `Object3D` child as the target. */}
  <mesh>
    <sphereGeometry />
    <meshBasicMaterial />
  </mesh>

  {/* You can optionally define a custom meshLineMaterial to use. */}
  {/* <meshLineMaterial color={"red"} /> */}
</Trail>








function Jet() {



return ( 


  
  <>
  <Canvas style={{ background: "black" }}>
    <RecoilRoot >
     
    <directionalLight intensity={1} />
    <ambientLight intensity={2} />
    <Suspense fallback={<Loader />}>
    <Engine scale={1}/>
    </Suspense>
    <Sound />
    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
    <Cloud   position={[-1, 4, 5]} scale={[0.5, 0.5, 0.5]}  rotation={[3,3,3]} intensity={0.5}  /> 
    <NME /> 
    <Trail position={[1,1,1]}  />
    
    <Terrain />
    <NME2/> 
    <Target />
    <Score />
  <Win />
  <Lose />
 

  <RandomizedLight castShadow amount={8} frames={100} position={[5, 5, -10]} />

  

    <Lasers />
    <LaserController />
  
   

  
   
    <GameTimer /> 
     
   </RecoilRoot>
  </Canvas>
  
  </>
   
 

)

}
 



  

export default Jet;



//git erase origin 