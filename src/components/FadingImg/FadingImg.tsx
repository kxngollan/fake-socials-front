"use client";
import Image from "next/image";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import drinking from "@/assets/images/drinking.jpeg";
import friends from "@/assets/images/friends.jpg";
import people from "@/assets/images/people.jpg";

const FadingImg = () => {
  const photos = [drinking, friends, people];
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (active) {
        setIndex((prev) => (prev + 1) % photos.length);
      }
    }, 8000); // change image every 8s

    return () => clearInterval(interval);
  }, [active]);
  return (
    <div
      onMouseEnter={() => setActive(false)}
      onMouseLeave={() => setActive(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <Image
            src={photos[index]}
            alt=""
            width={0}
            height={0}
            style={{ height: "300px", width: "auto" }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FadingImg;
