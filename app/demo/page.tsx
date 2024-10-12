'use client'

import { useState, useRef, useCallback } from 'react'
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
import Image from 'next/image'

export default function Demo() {
  const { messages, setMessages, input, handleInputChange } = useChat()

  const [files, setFiles] = useState<FileList | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [organizedFiles, setOrganizedFiles] = useState<{ name: string; url: string; type: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files)
      handleUpload(event.target.files)
    }
  }

  const handleUpload = async (selectedFiles: FileList) => {
    if (!selectedFiles.length) return;
    
    setProcessing(true);
    setProgress(0);
    
    const uploadedFiles: { name: string; url: string; type: string }[] = [];
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const url = await convertToDataURL(file);
        
        uploadedFiles.push({ 
          name: file.name, 
          url: url,
          type: file.type
        });
        
        setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }
      
      setOrganizedFiles(uploadedFiles);
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setProcessing(false);
    }
    
    console.log('All files processed:', uploadedFiles);
  };

  const convertToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: input,
        experimental_attachments: organizedFiles.length > 0 ? [{
          name: organizedFiles[0].name,
          url: organizedFiles[0].url,
          contentType: organizedFiles[0].type
        }] : undefined,
      };

      setMessages(prevMessages => [...prevMessages, userMessage]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.content,
        },
      ]);

      setOrganizedFiles([]);
      setFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [input, organizedFiles, messages, setMessages]
  );

  const handleDownload = async () => {
    const zip = new JSZip()

    for (const file of organizedFiles) {
      const response = await fetch(file.url)
      const blob = await response.blob()
      zip.file(file.name, blob)
    }

    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, 'organized_screenshots.zip')
    organizedFiles.forEach(file => URL.revokeObjectURL(file.url))
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
                <div key={m.id} className="whitespace-pre-wrap">
                  {m.role === 'user' ? 'User: ' : 'AI: '}
                  {m.content}
                  <div>
                    {m?.experimental_attachments
                      ?.filter(attachment =>
                        attachment?.contentType?.startsWith('image/'),
                      )
                      .map((attachment, index) => (
                        <Image
                          key={`${m.id}-${index}`}
                          src={attachment.url}
                          width={500}
                          height={500}
                          alt={attachment.name ?? `attachment-${index}`}
                        />
                      ))}
                  </div>
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
