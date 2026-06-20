import { easeIn, easeInOut, easeOut, motion, } from 'framer-motion';
import { animateByRef, IconHandle } from '@/lib/animateByRef';
import { useRef } from 'react';
import { redirect } from 'next/navigation';
import { RocketIcon } from '../animated-icons/RocketIcon';
import Link from 'next/link';

export function HeroSection() {
  const parent = {
    hidden: { opacity: 0, y: 0 },
    show: {
      opacity: [0.2, 0.4, 0.6, 0.8, 1],
      transition: {
        duration: 1.3,
      },
    },
  };
  const left = {
    hidden: { x: -300 },
    show: {
      x: [-300, 0, -15, 0,],
      transition: {
        duration: 0.9,
        ease: easeIn,
      },
    },
  };

  const center = {
    hidden: {
      x: 0,
    },
    show: {
      x: [0, 15, 0],
      transition: {
        delay: 0.3,
        duration: 0.45,
        ease: easeOut,
      },
    },
  };
  const right = {
    hidden: { x: 300, opacity: 0 },
    show: {
      x: [300, 0, 10, 0],
      opacity: 1,
      transition: {
        duration: 0.96,
        delay: 0.8,
        ease: easeIn,
      },
    },
  };

  const description = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: [0, 1],
      y: 0,
      transition: {
        delay: 1.9,
        duration: 0.7,
        ease: easeInOut,
      },
    },
  };

  const AnimateRef = useRef<IconHandle | null>(null);

  return (
    <motion.div className="flex flex-col">
      <motion.div
        className="flex flex-col items-center justify-center gap-2"
        animate={{
          y: [50, 0],
          transition: { duration: 0.5, delay: 2.6 },
        }}>
        <motion.div className="uppercase flex text-9xl" variants={parent} initial={'hidden'} animate="show">
          <motion.span variants={left}>Re</motion.span>
          <motion.span variants={center}>c</motion.span>
          <motion.span variants={right}>on</motion.span>
        </motion.div>
        <motion.div variants={description} initial="hidden" animate="show">
          This is Recon your AI powered detective.
        </motion.div>

        <motion.div className="py-10"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1],
            transition: {
              delay: 3,
              duration: 0.7
            }
          }}
        >
          <Link className="border py-2 px-3  justify-center  border-black flex items-center gap-3 rounded-sm"
            href={'/auth/sign-in'}
            {...animateByRef(AnimateRef)}>
            Let's start
            <RocketIcon size={19} ref={AnimateRef} className='inline-block' />
          </Link>
        </motion.div>
      </motion.div>
    </motion.div >
  );
}
