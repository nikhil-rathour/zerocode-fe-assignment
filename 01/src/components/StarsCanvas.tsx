"use client";

import { Points, PointMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as random from "maath/random";
import { useState, useRef, Suspense } from "react";
import { Points as PointsType } from "three";


const StarBackground = () => {
  const ref = useRef<PointsType | null>(null);
  const [sphere] = useState(() =>
    Float32Array.from(random.inSphere(new Float32Array(5000), { radius: 1.2 }))
  );

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        stride={3}
        positions={sphere}
        frustumCulled
      >
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => (
  <div className="w-full h-auto fixed inset-0 -z-10">
    
    <Canvas style={{ background: "black" }}
     camera={{ position: [0, 0, 1] }}>
      
      <Suspense fallback={null}>
        <StarBackground />
      </Suspense>
    </Canvas>
     
   
  </div>
);

export default StarsCanvas;

<PointMaterial
  transparent
  color="#ff0000"  // Bright red for testing
  size={0.05}     // Much larger size
  sizeAttenuation={false} // Disable attenuation
/>

