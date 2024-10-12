'use client'

import { useState, useRef } from 'react'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, FileType, Download, Send } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export default function BentoScreenshotOrganizer() {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat()
  const [files, setFiles] = useState<FileList | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [organizedFiles, setOrganizedFiles] = useState<{ name: string; url: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files)
    }
  }

  const handleUpload = async () => {
    if (files) {
      setProcessing(true)
      setProgress(0)

      const uploadedFiles = Array.from(files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }))

      // Simulate processing
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // Simulate AI organizing files
      const organizedFileNames = uploadedFiles.map(file => ({
        name: `organized_${file.name}`,
        url: file.url
      }))

      setOrganizedFiles(organizedFileNames)
      setProcessing(false)
      setFiles(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Add message to chat
      append({
        role: 'assistant',
        content: `I've organized ${files.length} screenshots for you. You can now download them.`
      })
    }
  }

  const handleDownload = async () => {
    const zip = new JSZip()

    // Fetch each file and add it to the zip
    for (const file of organizedFiles) {
      const response = await fetch(file.url)
      const blob = await response.blob()
      zip.file(file.name, blob)
    }

    // Generate the zip file
    const content = await zip.generateAsync({ type: 'blob' })

    // Save the zip file
    saveAs(content, 'organized_screenshots.zip')
  }

  return (
    <div className="container mx-auto p-4 min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-purple-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
        <Card className="md:col-span-2 row-span-3">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-800">Screenshot Organizer Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {messages.map(m => (
                <div key={m.id} className={`mb-4 p-3 rounded-lg ${m.role === 'user' ? 'bg-purple-100' : 'bg-pink-100'}`}>
                  <p className="font-semibold">{m.role === 'user' ? 'You:' : 'AI:'}</p>
                  <p>{m.content}</p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-grow"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-800">Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                multiple
                ref={fileInputRef}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
              />
              <Upload className="text-purple-600" />
            </div>
            <Button 
              onClick={handleUpload} 
              disabled={!files}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Upload
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-800">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            {processing ? (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-pink-600">{progress}% complete</p>
              </div>
            ) : (
              <p className="text-sm text-purple-600">No active processing</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-800">Download</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {organizedFiles.length > 0 ? (
              <>
                <ScrollArea className="h-[100px]">
                  <ul className="space-y-2">
                    {organizedFiles.map((file, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <FileType className="text-pink-600 w-4 h-4" />
                        <span className="text-sm text-purple-600">{file.name}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Download Files
                </Button>
              </>
            ) : (
              <p className="text-sm text-purple-600">No files to download</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}