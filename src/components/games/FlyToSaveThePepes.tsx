import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import Confetti from "react-dom-confetti"
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
  DepthOfField,
} from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card"
import toast from "react-hot-toast"
import { AnimatePresence, motion } from "framer-motion"
import BlurryEntranceFaster from "../BlurryEntranceFaster"

// Tree component: cylinder trunk and sphere foliage
const Tree: React.FC<{ position: [number, number, number] }> = ({
  position,
}) => {
  // Random rotation for variety
  const rotation = useMemo<[number, number, number]>(
    () => [0, Math.random() * Math.PI * 2, 0],
    []
  )
  // Random scale for variety (between 2-3.5x bigger)
  const scale = useMemo(() => 2 + Math.random() * 1.5, [])

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main trunk */}
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.8, 6, 12]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Tree foliage - multiple layers for more realistic look */}
      <mesh position={[0, 7, 0]} castShadow receiveShadow>
        <coneGeometry args={[3, 4, 8]} />
        <meshStandardMaterial color="#006400" roughness={0.7} />
      </mesh>
      <mesh position={[0, 9, 0]} castShadow receiveShadow>
        <coneGeometry args={[2.2, 3, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.7} />
      </mesh>
      <mesh position={[0, 10.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.5, 2.5, 8]} />
        <meshStandardMaterial color="#32CD32" roughness={0.7} />
      </mesh>

      {/* Add some small branches */}
      <mesh position={[0.8, 4, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <cylinderGeometry args={[0.15, 0.1, 1.5, 6]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      <mesh
        position={[-0.7, 3, 0.5]}
        rotation={[0, 0, -Math.PI / 3]}
        castShadow
      >
        <cylinderGeometry args={[0.15, 0.1, 1.2, 6]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
    </group>
  )
}

// House component: simple cube
const House: React.FC<{ position: [number, number, number] }> = ({
  position,
}) => {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  )
}

// Wing component: animated plane for flapping effect
const Wing: React.FC<{ side: "left" | "right" }> = ({ side }) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      meshRef.current.rotation.x = Math.sin(time * 5) * 0.5 // Flapping motion
    }
  })
  const position: [number, number, number] =
    side === "left" ? [-1, -0.5, -1] : [1, -0.5, -1]
  return (
    <mesh ref={meshRef} position={position} castShadow>
      <planeGeometry args={[1, 0.5]} />
      <meshStandardMaterial color="white" side={THREE.DoubleSide} />
    </mesh>
  )
}

// Wind particles: moving particles to simulate wind
const WindParticles: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null!)
  const particleCount = 500
  const positions = useMemo(() => {
    const posArray = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 100 // x
      posArray[i * 3 + 1] = Math.random() * 20 // y
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 100 // z
    }
    return posArray
  }, [])

  useFrame((_, delta) => {
    if (particlesRef.current) {
      particlesRef.current.position.x -= 1 * delta // Move left
      if (particlesRef.current.position.x < -50) {
        particlesRef.current.position.x = 50 // Reset to right
      }
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="white" size={0.1} transparent opacity={0.6} />
    </points>
  )
}

// Speed particles: particles that fly past the bird to create a sense of speed
const SpeedParticles: React.FC<{ isBoosting: boolean }> = ({ isBoosting }) => {
  const particlesRef = useRef<THREE.Points>(null!)
  const particleCount = 200

  // Generate particles in a tunnel-like formation around the camera's view
  const positions = useMemo(() => {
    const posArray = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      // Create particles in a cylindrical formation ahead of the bird
      const angle = Math.random() * Math.PI * 2
      const radius = 2 + Math.random() * 8
      posArray[i * 3] = Math.cos(angle) * radius // x
      posArray[i * 3 + 1] = Math.sin(angle) * radius // y
      posArray[i * 3 + 2] = -20 - Math.random() * 30 // z (ahead of the bird)
    }
    return posArray
  }, [])

  // Update particles to create the illusion of speed
  useFrame((_, delta) => {
    if (
      particlesRef.current &&
      particlesRef.current.geometry.attributes.position
    ) {
      const positions = particlesRef.current.geometry.attributes
        .position as THREE.BufferAttribute
      const speed = isBoosting ? 30 : 10

      // Move particles toward the camera
      for (let i = 0; i < particleCount; i++) {
        positions.array[i * 3 + 2] += speed * delta

        // If a particle passes the camera, reset it to a position ahead
        if (positions.array[i * 3 + 2] > 5) {
          const angle = Math.random() * Math.PI * 2
          const radius = 2 + Math.random() * 8
          positions.array[i * 3] = Math.cos(angle) * radius
          positions.array[i * 3 + 1] = Math.sin(angle) * radius
          positions.array[i * 3 + 2] = -20 - Math.random() * 10
        }
      }

      positions.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={isBoosting ? "#ffaa00" : "#ffffff"}
        size={isBoosting ? 0.15 : 0.08}
        transparent
        opacity={0.8}
      />
    </points>
  )
}

// Bird component: contains camera and wings
const Bird: React.FC<{
  keys: {
    left: boolean
    right: boolean
    up: boolean
    down: boolean
    boost: boolean
  }
}> = ({ keys }) => {
  const groupRef = useRef<THREE.Group>(null!)
  const { camera } = useThree()
  const baseSpeed = 20 // Base units per second
  const boostMultiplier = 3 // Speed multiplier when boosting
  const turnSpeed = 2 // Radians per second

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.add(camera)
      camera.position.set(0, 0, 0) // Camera at bird's "head"
    }
  }, [camera])

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Update rotation based on controls
      if (keys.left) groupRef.current.rotation.y += turnSpeed * delta
      if (keys.right) groupRef.current.rotation.y -= turnSpeed * delta
      if (keys.up) groupRef.current.rotation.x += turnSpeed * delta
      if (keys.down) groupRef.current.rotation.x -= turnSpeed * delta
      // Clamp pitch to prevent flipping
      groupRef.current.rotation.x = Math.max(
        -Math.PI / 4,
        Math.min(Math.PI / 4, groupRef.current.rotation.x)
      )

      // Calculate current speed based on boost state
      const currentSpeed = keys.boost ? baseSpeed * boostMultiplier : baseSpeed

      // Move forward along local -z axis
      groupRef.current.translateZ(-currentSpeed * delta)
    }
  })

  return (
    <group ref={groupRef} position={[0, 5, 10]}>
      <Wing side="left" />
      <Wing side="right" />
      <SpeedParticles isBoosting={keys.boost} />
    </group>
  )
}

// Scene fog component to manage fog settings
const SceneFog: React.FC<{ isBoosting: boolean }> = ({ isBoosting }) => {
  const { scene } = useThree()

  useEffect(() => {
    // Create fog
    scene.fog = new THREE.FogExp2("#87CEEB", 0.02)

    return () => {
      scene.fog = null
    }
  }, [scene])

  // Adjust fog density based on boost state
  useFrame(() => {
    if (scene.fog && scene.fog instanceof THREE.FogExp2) {
      // Target density: thinner when boosting for better visibility
      const targetDensity = isBoosting ? 0.01 : 0.02
      // Smoothly interpolate current density to target
      scene.fog.density += (targetDensity - scene.fog.density) * 0.05
    }
  })

  return null
}

// Pepe component: loads the GLB model
const Pepe: React.FC<{ position: [number, number, number] }> = ({
  position,
}) => {
  const { scene } = useGLTF("/pepe_-_monkas.glb")
  const groupRef = useRef<THREE.Group>(null!)

  // Random rotation for variety
  const rotation = useMemo<[number, number, number]>(
    () => [0, Math.random() * Math.PI * 2, 0],
    []
  )
  // Much larger scale (10x bigger) - base scale of 5-7.5
  const scale = useMemo(() => 5 + Math.random() * 2.5, [])

  useEffect(() => {
    if (scene) {
      // Clone the scene to avoid issues with reusing the same model
      const clonedScene = scene.clone()

      // Ensure original materials and colors are preserved
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Make sure materials are not modified
          if (child.material) {
            // Preserve original colors
            const material = child.material as THREE.MeshStandardMaterial
            if (material.map) {
              // In newer Three.js, colorSpace is used instead of encoding
              material.map.colorSpace = THREE.SRGBColorSpace
            }
            // Ensure materials use original colors
            material.needsUpdate = true
          }
        }
      })

      // Add the cloned scene to our group
      groupRef.current.add(clonedScene)
    }
  }, [scene])

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    />
  )
}

// Main game component
const FlyToSaveThePepes: React.FC<{
  onClose?: () => void
  userId: string
}> = ({ onClose, userId }) => {
  const [revealConfetti, setRevealConfetti] = useState(false)

  const [keys, setKeys] = useState({
    left: false,
    right: false,
    up: false,
    down: false,
    boost: false,
  })
  const [gameOver, setGameOver] = useState(false)
  const [lightning, setLightning] = useState(false)
  const [score, setScore] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  // Add intro state
  const [introStep, setIntroStep] = useState(0) // 0 = step 1, 1 = step 2, 2 = step 3, 3 = game started
  const [gameStarted, setGameStarted] = useState(false)
  // Add audio ref for background music
  const bgMusicRef = useRef<HTMLAudioElement | null>(null)
  // Add ref for wind sound effect
  const windSoundRef = useRef<HTMLAudioElement | null>(null)
  // Add state for audio mute toggle
  const [isMuted, setIsMuted] = useState(false)

  const [specialSfx, setSpecialSfx] = useState<string[]>([])

  const [sentences, setSentences] = useState<string[]>([])
  useEffect(() => {
    const fetchRecentTTS = async () => {
      // POST REQUEST, pass the userId as a parameter:
      const response = await fetch(
        `http://localhost:3000/api/v2/get-recent-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      )
      const data = await response.json()
      console.log("data FROM TTS!!!")
      console.log(data)
      const theAudios = data.map(({ extra5 }: { extra5: string }) => extra5)
      console.log(theAudios)
      setSpecialSfx(theAudios)
      const theSentences = data.map(({ extra }: { extra: string }) => extra)
      console.log(theSentences)
      setSentences(theSentences)
    }
    fetchRecentTTS()
  }, [])

  // Initialize and control background music and wind sounds
  useEffect(() => {
    // Create audio elements
    const externalMusicUrl = "http://localhost:3000/audios/ToucanFly.mp3"
    const windSoundUrl = "http://localhost:3000/audios/wind-noises.mp3" // Add this file to your public folder

    bgMusicRef.current = new Audio(externalMusicUrl)
    bgMusicRef.current.loop = true
    bgMusicRef.current.volume = 0.22

    windSoundRef.current = new Audio(windSoundUrl)
    windSoundRef.current.loop = true
    windSoundRef.current.volume = 0.15 // Lower volume for ambient effect

    // Play sounds when game starts
    if (gameStarted) {
      bgMusicRef.current.play().catch((err) => {
        console.log("Audio playback failed:", err)
      })

      windSoundRef.current.play().catch((err) => {
        console.log("Wind sound playback failed:", err)
      })
    }

    // Cleanup function
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause()
        bgMusicRef.current.currentTime = 0
      }
      if (windSoundRef.current) {
        windSoundRef.current.pause()
        windSoundRef.current.currentTime = 0
      }
    }
  }, [gameStarted])

  // Toggle mute function - update to handle both sounds
  const toggleMute = useCallback(() => {
    if (bgMusicRef.current && windSoundRef.current) {
      if (isMuted) {
        bgMusicRef.current.volume = 0.5
        windSoundRef.current.volume = 0.15
      } else {
        bgMusicRef.current.volume = 0
        windSoundRef.current.volume = 0
      }
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  // Adjust wind sound based on boost state
  useEffect(() => {
    if (windSoundRef.current && !isMuted) {
      // Increase wind volume when boosting for more intense effect
      const targetVolume = keys.boost ? 0.3 : 0.15

      // Smoothly transition the volume
      const adjustVolume = () => {
        if (windSoundRef.current) {
          const currentVol = windSoundRef.current.volume
          const diff = targetVolume - currentVol

          if (Math.abs(diff) > 0.01) {
            windSoundRef.current.volume = currentVol + diff * 0.1
            requestAnimationFrame(adjustVolume)
          } else {
            windSoundRef.current.volume = targetVolume
          }
        }
      }

      adjustVolume()
    }
  }, [keys.boost, isMuted])

  // Stop sounds when game is over or won
  useEffect(() => {
    if ((gameOver || gameWon) && bgMusicRef.current && windSoundRef.current) {
      // Fade out all audio
      const fadeOut = setInterval(() => {
        if (bgMusicRef.current && bgMusicRef.current.volume > 0.05) {
          bgMusicRef.current.volume -= 0.05
        }

        if (windSoundRef.current && windSoundRef.current.volume > 0.05) {
          windSoundRef.current.volume -= 0.05
        } else {
          if (bgMusicRef.current) bgMusicRef.current.pause()
          if (windSoundRef.current) windSoundRef.current.pause()
          clearInterval(fadeOut)
        }
      }, 100)

      return () => clearInterval(fadeOut)
    }
  }, [gameOver, gameWon])

  // Clear message after timeout
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [message])

  // Start timer when game starts
  useEffect(() => {
    if (gameStarted) {
      setStartTime(Date.now())

      // Update timer every 100ms
      const timerInterval = setInterval(() => {
        if (startTime && !gameOver && !gameWon) {
          setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
        }
      }, 100)

      return () => clearInterval(timerInterval)
    }
  }, [startTime, gameOver, gameWon, gameStarted])

  // Handle scoring and win condition
  useEffect(() => {
    if (score >= 25 && !gameWon) {
      setRevealConfetti(true)
      setGameWon(true)
      // play a sound
      const audio = new Audio("http://localhost:3000/audios/crowd-cheers.mp3")
      audio.play()
      // setTimeout(() => {
      //   alert(`You won! Time: ${elapsedTime} seconds`)
      // }, 100)
    }
  }, [score, elapsedTime, gameWon])

  // Keyboard controls - only enable when game has started
  useEffect(() => {
    if (!gameStarted) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          setKeys((prev) => ({ ...prev, left: true }))
          break
        case "ArrowRight":
          setKeys((prev) => ({ ...prev, right: true }))
          break
        case "ArrowUp":
          setKeys((prev) => ({ ...prev, up: true }))
          break
        case "ArrowDown":
          setKeys((prev) => ({ ...prev, down: true }))
          break
        case " ": // Space key
          setKeys((prev) => ({ ...prev, boost: true }))
          break
      }
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          setKeys((prev) => ({ ...prev, left: false }))
          break
        case "ArrowRight":
          setKeys((prev) => ({ ...prev, right: false }))
          break
        case "ArrowUp":
          setKeys((prev) => ({ ...prev, up: false }))
          break
        case "ArrowDown":
          setKeys((prev) => ({ ...prev, down: false }))
          break
        case " ": // Space key
          setKeys((prev) => ({ ...prev, boost: false }))
          break
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [gameStarted])

  // Lightning effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.05) {
        // 5% chance per second
        setLightning(true)
        setTimeout(() => setLightning(false), 100) // Flash for 100ms
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Generate obstacles with useMemo to ensure they're only generated once
  const treePositions = useMemo(
    () =>
      Array.from(
        { length: 50 },
        (_, i) =>
          [(Math.random() - 0.5) * 100, -10, -i * 30] as [
            number,
            number,
            number
          ]
      ),
    []
  )

  const housePositions = useMemo(
    () =>
      Array.from(
        { length: 10 },
        (_, i) =>
          [(Math.random() - 0.5) * 50, -10, -i * 100] as [
            number,
            number,
            number
          ]
      ),
    []
  )

  // Generate Pepe positions - place them between trees
  const pepePositions = useMemo(
    () =>
      Array.from(
        { length: 20 }, // Add 20 Pepes
        (_, i) =>
          [
            (Math.random() - 0.5) * 80,
            -0, // Position at ground level (floor is at -10, model needs to sit on top)
            -(i * 40 + 15), // Offset from trees
          ] as [number, number, number]
      ),
    []
  )

  // Handle next step or start game
  const handleNextStep = () => {
    if (introStep < 2) {
      setIntroStep(introStep + 1)
    } else {
      setGameStarted(true)
    }
  }

  // Render intro screen if game hasn't started
  if (!gameStarted) {
    return (
      <div className="font-grandstander pt-2 relative w-[360px] h-[440px] bg-gradient-to-b from-zinc-900 to-zinc-700 flex flex-col items-center justify-center p-5 text-center">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 left-2 !text-black !bg-white hover:!bg-white/70"
          onClick={onClose}
        >
          ← Back
        </Button>

        {/* <h1 className="text-3xl font-bold mb-8 text-white">
          Flying Game Rules
        </h1> */}

        {introStep === 0 && (
          <Card className="w-11/12 bg-white border-none text-indigo-400">
            <CardHeader>
              <CardTitle className="text-3xl">Step 1</CardTitle>
              <CardDescription className="text-indigo-600 text-2xl text-balance text-center">
                Collect points by touching the Pepes
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center"></CardContent>
            <CardFooter className="flex justify-center">
              <Button
                // onClick={() => {
                //   setRevealConfetti(true)
                // }}
                onClick={handleNextStep}
                className="!bg-emerald-500 hover:!bg-emerald-600 text-white"
              >
                Next CONF
              </Button>
            </CardFooter>
          </Card>
        )}

        {introStep === 1 && (
          <Card className="w-11/12 bg-white border-none text-indigo-400">
            <CardHeader>
              <CardTitle className="text-3xl">Step 2</CardTitle>
              <CardDescription className="text-indigo-600 text-2xl text-balance text-center">
                Don't touch the trees!!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center"></CardContent>
            <CardFooter className="flex justify-center">
              <Button
                onClick={handleNextStep}
                className="!bg-emerald-500 hover:!bg-emerald-600 text-white"
              >
                Next
              </Button>
            </CardFooter>
          </Card>
        )}

        {introStep === 2 && (
          <Card className="w-11/12 bg-white border-none text-indigo-400">
            <CardHeader>
              <CardTitle className="text-3xl">Step 3</CardTitle>
              <CardDescription className="text-indigo-600 text-2xl text-balance text-center">
                Do it as fast as you can!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center"></CardContent>
            <CardFooter className="flex justify-center">
              <Button
                onClick={handleNextStep}
                className="!bg-orange-500 hover:!bg-orange-600 font-bold text-lg px-6 py-5 text-white"
              >
                Start the game!
              </Button>
            </CardFooter>
          </Card>
        )}

        <div className="absolute bottom-4 text-sm text-white/80">
          Use arrow keys to fly, SPACE to boost
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: "relative", width: "360px", height: "450px" }}>
      <Canvas
        style={{ background: "skyblue" }}
        shadows={{ type: THREE.PCFSoftShadowMap }}
        camera={{ fov: 75, near: 0.1, far: 1000 }}
      >
        <ambientLight intensity={lightning ? 2 : 0.3} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <SceneFog isBoosting={keys.boost} />
        <CollisionDetector
          treePositions={treePositions}
          housePositions={housePositions}
          pepePositions={pepePositions}
          setGameOver={setGameOver}
          setScore={setScore}
          setMessage={setMessage}
          specialSfx={specialSfx}
          sentences={sentences}
        />
        <Bird keys={keys} />
        {treePositions.map((pos, i) => (
          <Tree key={`tree-${i}`} position={pos} />
        ))}
        {housePositions.map((pos, i) => (
          <House key={`house-${i}`} position={pos} />
        ))}
        {pepePositions.map((pos, i) => (
          <Pepe key={`pepe-${i}`} position={pos} />
        ))}
        <WindParticles />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -10, 0]}
          receiveShadow
        >
          <planeGeometry args={[1000, 1000]} />
          <meshStandardMaterial color="lightgreen" />
        </mesh>

        {/* Post-processing effects */}
        <EffectComposer>
          <DepthOfField focusDistance={0.01} focalLength={0.2} bokehScale={3} />
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.9}
          />
          <Noise opacity={0.05} />
          <Vignette
            eskil={false}
            offset={0.1}
            darkness={0.5}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>

      {/* Score and Timer Display */}
      <div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded-md font-bold">
        <div>Score: {score}/25</div>
        <div>Time: {elapsedTime}s</div>
      </div>

      <div className="absolute inset-0 z-[99999] pointer-events-none w-full h-full flex items-center justify-center">
        <Confetti active={revealConfetti} />
      </div>

      {/* Mute button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 right-16 !bg-black/50 !text-white hover:!bg-black/70"
        onClick={toggleMute}
      >
        {isMuted ? "🔇" : "🔊"}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 !bg-black/50 !text-white hover:!bg-black/70"
        onClick={onClose}
      >
        Exit
      </Button>

      {gameOver && (
        <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-2xl font-bold">
          <Card className="bg-black/80 w-3/4 max-w-xs">
            <CardHeader>
              <CardTitle className="text-center text-red-500">
                Game Over
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button onClick={onClose} className="!bg-white !text-black">
                Back to Menu
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {gameWon && (
        <div className="absolute inset-0 bg-black/70 text-white flex flex-col items-center justify-center">
          <Card className="bg-black/80 border-green-500 w-3/4 max-w-xs">
            <CardHeader>
              <BlurryEntranceFaster>
                <CardTitle className="text-center text-green-500 text-3xl font-bold">
                  You Made It!!!
                </CardTitle>
              </BlurryEntranceFaster>
              <BlurryEntranceFaster delay={0.12}>
                <CardDescription className="text-center text-white text-lg mt-2">
                  Time: {elapsedTime} seconds
                </CardDescription>
              </BlurryEntranceFaster>
            </CardHeader>

            <CardFooter className="flex justify-center">
              <BlurryEntranceFaster delay={0.16}>
                <Button onClick={onClose} className="!bg-white !text-black">
                  Back to Menu
                </Button>
              </BlurryEntranceFaster>
            </CardFooter>
          </Card>
        </div>
      )}

      {!gameWon && (
        <div className="absolute bottom-2 left-2 text-white bg-black/50 p-1.5 rounded text-sm">
          <BlurryEntranceFaster delay={0.2}>
            Press SPACE to boost speed
          </BlurryEntranceFaster>
        </div>
      )}

      <AnimatePresence>
        {/* Message display */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 18, rotate: 12 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -20, rotate: 50 }}
            // transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-300 text-shadow-like-border2 px-5 py-2.5 rounded text-2xl font-bold tracking-tighter z-10"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// New component to handle collision detection inside Canvas
const CollisionDetector: React.FC<{
  treePositions: [number, number, number][]
  housePositions: [number, number, number][]
  pepePositions: [number, number, number][]
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>
  setScore: React.Dispatch<React.SetStateAction<number>>
  setMessage: React.Dispatch<React.SetStateAction<string | null>>
  specialSfx: string[]
  sentences: string[]
}> = ({
  treePositions,
  housePositions,
  pepePositions,
  setGameOver,
  setScore,
  setMessage,
  specialSfx,
  sentences,
}) => {
  const { scene } = useThree()
  const [hasCollided, setHasCollided] = useState(false)
  const [collectedPepes, setCollectedPepes] = useState<Set<number>>(new Set())
  const [pepeCollisionCooldown, setPepeCollisionCooldown] = useState(false)

  useFrame(() => {
    // Find the Bird group in the scene
    const birdGroup = scene.children.find(
      (child) =>
        child instanceof THREE.Group &&
        child.children.some(
          (c) =>
            c instanceof THREE.Mesh && c.geometry instanceof THREE.PlaneGeometry
        )
    )

    if (birdGroup) {
      const birdPos = birdGroup.position

      // Only check for fatal collisions if not in collision state
      if (!hasCollided) {
        // Check collision with floor (y position)
        if (birdPos.y < -8) {
          // Floor is at -10, add some buffer for collision
          setHasCollided(true)
          setGameOver(true)
          setTimeout(() => {
            alert("You crashed into the ground!")
          }, 100)
          return
        }

        // Check collisions with trees
        for (const pos of treePositions) {
          // Create a position vector that accounts for the tree's height and scale
          // Trees are now much bigger, so adjust collision detection
          const treePos = new THREE.Vector3(pos[0], pos[1] + 7, pos[2]) // Adjusted for taller trees
          const distance = birdPos.distanceTo(treePos)

          // Larger collision radius for bigger trees (5 units)
          if (distance < 5) {
            setHasCollided(true)
            setGameOver(true)
            // Show alert
            setTimeout(() => {
              alert("You crashed into a tree!")
            }, 100)
            return
          }
        }

        // Check collisions with houses
        for (const pos of housePositions) {
          // Create a position vector that accounts for the house's height
          const housePos = new THREE.Vector3(pos[0], pos[1] + 1, pos[2])
          const distance = birdPos.distanceTo(housePos)
          if (distance < 2) {
            setHasCollided(true)
            setGameOver(true)
            // Show alert
            setTimeout(() => {
              alert("You crashed into a house!")
            }, 100)
            return
          }
        }
      }

      // Always check for Pepe collisions, even if hasCollided is true
      // But don't check during the cooldown period
      if (!pepeCollisionCooldown) {
        // Check collisions with Pepes - now for scoring instead of game over
        pepePositions.forEach((pos, index) => {
          const pepePos = new THREE.Vector3(pos[0], pos[1] + 5, pos[2])
          const distance = birdPos.distanceTo(pepePos)

          // If close enough to collect and not already collected
          if (distance < 10 && !collectedPepes.has(index)) {
            // Add to collected set
            setCollectedPepes((prev) => {
              const newSet = new Set(prev)
              newSet.add(index)
              return newSet
            })

            // Increase score
            setScore((prevScore) => prevScore + 5)

            // Show a non-blocking message
            setMessage("+5 points")

            // play one random special sfx
            const randomIndex = Math.floor(Math.random() * specialSfx.length)
            const randomSfx = specialSfx[randomIndex]
            const audio = new Audio(randomSfx)
            audio.play()

            // show a toast with the sentence
            toast.success(sentences[randomIndex])

            // Set a brief cooldown to prevent multiple collisions with different Pepes in the same frame
            setPepeCollisionCooldown(true)
            setTimeout(() => {
              setPepeCollisionCooldown(false)
            }, 200)
          }
        })
      }
    }
  })

  return null
}

// Preload the Pepe model to avoid loading delays during gameplay
useGLTF.preload("/pepe_-_monkas.glb")

export default FlyToSaveThePepes
