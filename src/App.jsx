import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Trail from './components/Trail.jsx'
import Jet from './components/Jet.jsx'
import Game from './components/Game.jsx'
  import { Html, useProgress } from '@react-three/drei'
import { RecoilRoot } from 'recoil'



function App() {



const [loading, setLoading] = useState(true);

useEffect(() => {
  setTimeout(() => {
    setLoading(false);
  }, 3000);
}, []); 






  return (
    <div className="App ">
      




<div className='h-screen'>
 
  <Jet />
 
</div>




 

    </div>
  )
}


  

  

export default App
