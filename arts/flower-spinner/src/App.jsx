import React from 'react';
import { motion } from 'framer-motion';
import './App.css';

const FlowerSpinner = () => {
  const petals = Array.from({ length: 10 }, (_, i) => (
    <g key={i} transform={`rotate(${i * 36})`}>
      <use href="#petal" fill="url(#petalGrad)" className="petal" />
    </g>
  ));

  return (
    <div className="app">
      <motion.svg
        className="flower-svg"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: 360 }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <defs>
          <path id="petal" d="M0,0 C10,-20 30,-30 40,-10 C30,10 10,10 0,0 Z"/>
          <radialGradient id="petalGrad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#FFD6F0"/>
            <stop offset="45%" stopColor="#D58BEA"/>
            <stop offset="100%" stopColor="#7C3AED"/>
          </radialGradient>
          <linearGradient id="centerGrad" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE29F"/>
            <stop offset="100%" stopColor="#FF7A18"/>
          </linearGradient>
        </defs>

        <g transform="translate(180,180)">
          {petals}
          <circle r="18" fill="url(#centerGrad)" className="flower-center"/>
          <circle r="8" fill="#FFF5E6" opacity="0.6"/>
        </g>
      </motion.svg>
    </div>
  );
};

export default FlowerSpinner;