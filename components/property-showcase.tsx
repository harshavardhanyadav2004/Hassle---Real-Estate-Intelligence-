"use client"

import { motion } from "framer-motion"
import {
  Image,
  Wrench,
  MessageCircleQuestion,
  FileText,
  MapPin,
  Share2,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
const features = [
  {
    name: "Image-Based Issue Detection",
    description: "Upload property images to detect visible issues like mold, cracks, or water damage using AI.",
    icon: Image,
  },
  {
    name: "Troubleshooting Assistant",
    description: "Get helpful suggestions to fix problems such as leaks, poor lighting, or structural damage.",
    icon: Wrench,
  },
  {
    name: "Interactive Follow-up Questions",
    description: "Agent 1 asks smart questions to understand the issue better and guide the next steps.",
    icon: MessageCircleQuestion,
  },
  {
    name: "Tenancy FAQ Bot",
    description: "Ask anything about rental laws, notice periods, deposits, or landlord responsibilities.",
    icon: FileText,
  },
  {
    name: "Location-Aware Legal Advice",
    description: "Receive accurate tenancy information based on your city, state, or country.",
    icon: MapPin,
  },
  {
    name: "Smart Agent Routing",
    description: "Automatically routes your query to the right agent based on text or image context.",
    icon: Share2,
  },
]

export default function FeatureGrid() {
  return (
    <div className="relative py-24 overflow-hidden">
      {/* Blue gradient blobs just like Hero */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute top-60 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      <Separator className="my-12 relative z-10" />
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-extrabold text-white mb-12 text-center">Features built for scale</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                rotateX: index % 2 === 0 ? 5 : -5,
                rotateY: index % 3 === 0 ? 5 : -5,
                transition: { duration: 0.3 },
              }}
              className="flex flex-col items-center space-y-4 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-md p-6 h-full hover:border-blue-600 transition-all shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white text-center">{feature.name}</h3>
              <p className="text-center text-gray-400 flex-grow">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <Separator className="my-16 relative z-10" />
      
      {/* Call to Action */}
      <div className="relative z-10 mt-20 text-center">
        <h3 className="text-3xl font-extrabold text-white mb-6">Ready to get started?</h3>
         <Link href="/signup">
        <button className="bg-white hover:bg-gray-300 text-black font-semibold py-4 px-8 rounded-xl transition-all shadow-lg">
          Start Now
        </button>
        </Link>
      </div>

      <Separator className="my-16 relative z-10" />

      {/* Socials */}
      <div className="relative z-10 mt-10 flex justify-center gap-6 text-gray-400">
        <a href="https://x.com/sri_boora73837" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
          <Twitter className="w-6 h-6" />
        </a>
        <a href="https://www.linkedin.com/in/harshavardhanboora/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
          <Linkedin className="w-6 h-6" />
        </a>
        <a href="https://www.instagram.com/harsha_vardhan_boora/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
          <Instagram className="w-6 h-6" />
        </a>
      </div>
    </div>
  )
}
