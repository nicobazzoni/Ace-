import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Trail from './components/Trail.jsx'
import Jet from './components/Jet.jsx'
import Game from './components/Game.jsx'
  import { Html, useProgress } from '@react-three/drei'
import { RecoilRoot } from 'recoil'

const song = new Audio("https://storage.googleapis.com/nicoroc_audio/solo%20zr%20mar%205%20synt%20(2).mp3");

function App() {
  
  const [playing, setPlaying] = useState(false);


const [loading, setLoading] = useState(true);

useEffect(() => {
  setTimeout(() => {
    setLoading(false);
  }, 3000);
}, []); 

function Reload() {
  return (
    <div className="reload">
      <button onClick={() => window.location.reload(false)}>
        <h1>Reload</h1>
      </button>
    </div>
  );
}


return (
    <div className="App ">
      <Reload />
      <button onClick={() => song.play()}>Play</button>
      
<div className='h-screen'>
 
  <Jet />
 
</div>

 </div>
  )
}


  

  

export default App
