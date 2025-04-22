import Header from "@/components/header"
import Hero from "@/components/hero"
import FeatureGrid from "@/components/property-showcase"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <Hero />
      <FeatureGrid />
    </main>
  )
}
