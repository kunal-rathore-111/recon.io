'use client';

import { GithubIcon } from '@/components/animated-icons/GithubIcon';
import { IdCardIcon } from '@/components/animated-icons/IdCardIcon';
import { LinkedinIcon } from '@/components/animated-icons/LinkdinIcon';
import { MailCheckIcon } from '@/components/animated-icons/MailIcon';
import { HeroSection } from '@/components/Landing-Page/HeroSection';
import { GithubURL } from '@/lib/urls';
import { motion } from "framer-motion"



export default function Home() {
  const Social = [
    { Icon: GithubIcon, label: "Github", url: GithubURL },
    { Icon: MailCheckIcon, label: "Gmaial", url: "" },
    { Icon: LinkedinIcon, label: "Linkdin", url: "" },
    { Icon: IdCardIcon, label: "Portfolio", url: "" }
  ]

  const footerParent = {
    hidden: {
      opacity: 0,
      y: 10
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 3,
      }

    }
  }


  return (
    <div className=" flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">

      <main className=" relative flex flex-1 w-full bg-white dark:bg-black sm:items-start">
        <div className="h-screen w-screen flex items-center justify-center">
          <HeroSection />
          <footer className="absolute bottom-4  px-10 w-full">
            <div className="justify-center flex items-center w-full">
              {' '}
              <motion.div
                variants={footerParent}
                initial={"hidden"}
                animate={"show"}
                className="text-lg border flex p-4 justify-evenly w-lg rounded-sm ">
                {Social.map((data) => {
                  return <motion.div key={data.label}>
                    {<data.Icon size={24} />}
                  </motion.div>
                })}
              </motion.div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
