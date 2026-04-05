import React,{useRef,useMemo} from 'react';
import {Canvas,useFrame} from '@react-three/fiber';
import {Points,PointMaterial} from '@react-three/drei';
import * as THREE from 'three';
//粒子星空组件

function StarField(){
    const ref =useRef<THREE.Points>(null);

    //生成随机粒子位置
    const particles=useMemo(()=>{
        const temp =[];
        for(let i=0;i<2000;i++){
          const x=(Math.random()-0.5)*50;
          const y=(Math.random()-0.5)*50;
          const z=(Math.random()-0.5)*50;
          temp.push(x,y,z);
        }
        return new Float32Array(temp);
    },[]);
    //动画效果
    useFrame((state)=>{
        if(ref.current){
            ref.current.rotation.x=state.clock.getElapsedTime()*0.05;
            ref.current.rotation.y=state.clock.getElapsedTime()*0.075;
        }
    });
return(
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial 
        transparent
        color='#6366f1'
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        />
    </Points>
);
}
//浮动几何体
function FloatingGeometry(){
    const meshRef =useRef<THREE.Mesh>(null);
    useFrame((state) =>{
        if (meshRef.current){
            meshRef.current.rotation.x=state.clock.getElapsedTime()*0.2;
            meshRef.current.rotation.y=state.clock.getElapsedTime()*0.3;
            meshRef.current.position.y=Math.sin(state.clock.getElapsedTime()*0.5);
        }
    });
    return (
        <mesh ref={meshRef} position={[2,0,-5]}>
            <torusKnotGeometry args={[1,0.3,128,16]} />
            <meshStandardMaterial 
            color="#6366f1"
           wireframe
           transparent
           opacity={0.3}
            />
        </mesh>
    );
}
    //主背景组件
    export default function ThreeBackground(){
        return (
          <div className='fixed top-0 left-0 w-full h-full -z-10'>
            <Canvas camera={{position:[0,0,5],fov:75}}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10,10,10]} intensity={1} />
                <StarField />
                <FloatingGeometry />
            </Canvas>
          </div>
        );
    }
