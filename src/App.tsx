/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111] font-serif select-none p-8 md:p-16 flex flex-col justify-between">
      {/* Header */}
      <header className="flex justify-between items-start border-b border-[#111] pb-8">
        <div className="space-y-1">
          <p className="font-sans text-[10px] uppercase tracking-widest text-neutral-500 font-bold italic">Project Index / 001</p>
          <h2 className="text-2xl italic font-medium">Spring Boot Quickstart</h2>
        </div>
        <div className="text-right space-y-1">
          <p className="font-sans text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Environment</p>
          <p className="text-sm font-sans font-medium">Java 17 / Maven 3.9 / STS</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-12 mt-12 mb-12">
        <section className="md:col-span-7 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-orange-600 font-bold mb-6 block">Initial Deployment</span>
            <h1 className="text-7xl md:text-[120px] leading-[0.9] font-medium -ml-1 mb-8">
              Hello<br />World.
            </h1>
            <p className="text-xl max-w-md leading-relaxed text-neutral-700 italic">
              A minimalist implementation of the Spring MVC architectural pattern, packaged for seamless import into Spring Tool Suite.
            </p>
          </motion.div>
        </section>

        <section className="md:col-span-5 flex flex-col gap-10 justify-center">
          {/* Project Blueprint */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="border-l-2 border-black pl-8 space-y-4"
          >
            <h3 className="font-sans text-[10px] uppercase tracking-widest font-bold">Project Blueprint</h3>
            <ul className="font-sans text-[11px] space-y-3 font-medium">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                <span className="tracking-tight text-neutral-600 font-mono">src/main/java/.../HelloController.java</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                <span className="tracking-tight text-neutral-600 font-mono">src/main/resources/application.properties</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                <span className="tracking-tight text-neutral-600 font-mono">pom.xml <span className="opacity-40 italic">Spring Boot 3.2.0</span></span>
              </li>
            </ul>
          </motion.div>

          {/* Import Sequence */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-[#111] text-white p-8 space-y-6"
          >
            <h3 className="font-sans text-[10px] uppercase tracking-widest font-bold text-neutral-400">Import Sequence</h3>
            <div className="font-sans text-[11px] leading-relaxed space-y-5">
              <div className="flex gap-4">
                <span className="text-orange-500 font-bold">01</span>
                <p className="opacity-90">Launch Spring Tool Suite (STS) and navigate to <span className="text-orange-200">File &gt; Import</span>.</p>
              </div>
              <div className="flex gap-4">
                <span className="text-orange-500 font-bold">02</span>
                <p className="opacity-90">Select <span className="text-orange-200">"Existing Maven Projects"</span> under the Maven subdirectory.</p>
              </div>
              <div className="flex gap-4">
                <span className="text-orange-500 font-bold">03</span>
                <p className="opacity-90">Select Root Directory, ensure <span className="font-mono">pom.xml</span> is detected, and click Finish.</p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row justify-between items-center md:items-end border-t border-[#111] pt-8 gap-6 md:gap-0">
        <div className="flex gap-12 font-sans text-[10px] uppercase tracking-widest font-bold">
          <div>
            <p className="text-neutral-400 mb-1">Artifact</p>
            <p className="text-[#111]">spring-boot-hello-world</p>
          </div>
          <div>
            <p className="text-neutral-400 mb-1">Group</p>
            <p className="text-[#111]">com.example.starter</p>
          </div>
        </div>
        <div className="bg-orange-600 text-white px-8 py-4 font-sans text-xs font-bold tracking-[0.2em] hover:bg-orange-700 transition-colors cursor-pointer text-center w-full md:w-auto">
          EXPORT MAVEN PROJECT
        </div>
      </footer>
    </div>
  );
}
