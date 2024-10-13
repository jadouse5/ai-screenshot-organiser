'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Instagram } from "lucide-react"
import Link from "next/link"

export default function About() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">About Morocco AI Solutions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            Morocco AI Solutions is at the forefront of AI-driven innovation, specializing in creating cutting-edge solutions that transform how businesses and individuals interact with technology. Our Screenshot Organizer is just one example of our commitment to simplifying complex tasks through intelligent automation.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We strive to empower organizations and individuals by providing smart, user-friendly platforms that streamline workflows and unlock the potential of visual information. Our passion for AI and open-source development drives us to continuously innovate and contribute to the global tech community.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Hackathons & Open Source</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            At Morocco AI Solutions, we actively participate in hackathons like this one, pushing the boundaries of what's possible with AI and modern web technologies. We're also committed to the open-source community, regularly contributing to and maintaining projects that benefit developers worldwide.
          </p>
          <Button asChild variant="outline">
            <Link href="https://github.com/jadouse5">
              View Our Open Source Projects
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Connect With Us</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button asChild variant="outline">
            <Link href="https://github.com/jadouse5">
              <Github className="mr-2 h-4 w-4" /> GitHub
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="https://www.linkedin.com/in/jad-tounsi-el-azzoiani-87499a21a/">
              <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="https://www.instagram.com/doctoria_morocco/">
              <Instagram className="mr-2 h-4 w-4" /> Instagram
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We value your feedback and are always looking for ways to improve our services. If you have any questions, suggestions, or concerns, please don't hesitate to reach out to us at <a href="mailto:jadtounsi5@gmail.com" className="text-blue-600 hover:underline">jadtounsi5@gmail.com</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
