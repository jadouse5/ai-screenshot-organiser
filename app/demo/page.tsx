'use client'

import { useState, useRef, useCallback } from 'react'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, FileType, Download, Send, Edit } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import Image from 'next/image'
import { FileUpload } from '@/components/ui/file-upload'

export default function Demo() {
  const { messages, setMessages, input, handleInputChange, handleSubmit: handleChatSubmit } = useChat()

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
        
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('file', file);

        // Send the file to your server endpoint that handles Pinata uploads
        const response = await fetch('/api/files', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        
        uploadedFiles.push({ 
          name: file.name, 
          url: data.url, // URL returned from Pinata
          type: file.type
        });
        
        setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }
      
      setOrganizedFiles(uploadedFiles);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setProcessing(false);
    }
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
      if (organizedFiles.length === 0) return;

      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: "Analyze this screenshot. Provide only a concise name for the file, with no additional details or description. Respond with only the name no formatting {name_of_file}.",
        experimental_attachments: [{
          name: organizedFiles[0].name,
          url: organizedFiles[0].url,
          contentType: organizedFiles[0].type
        }],
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
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
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

      // Update the file name with the AI's suggestion
      const aiSuggestion = data.content.split('\n')[0].trim();
      setOrganizedFiles(prevFiles => [
        { ...prevFiles[0], name: `${aiSuggestion}.${prevFiles[0].name.split('.').pop()}` },
        ...prevFiles.slice(1)
      ]);
    },
    [organizedFiles, messages, setMessages]
  );

  const handleDownload = async () => {
    try {
      const zip = new JSZip();

      for (const file of organizedFiles) {
        if (!file.url) {
          console.error(`URL manquante pour le fichier: ${file.name}`);
          continue;
        }

        try {
          const response = await fetch(file.url);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const arrayBuffer = await response.arrayBuffer();
          zip.file(file.name, arrayBuffer, {binary: true});
        } catch (fetchError) {
          console.error(`Erreur lors du téléchargement de ${file.name}:`, fetchError);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "screenshots.zip");
    } catch (error) {
      console.error("Erreur lors de la création du fichier zip:", error);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 row-span-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">Screenshot Organizer Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {messages.map(m => (
                <div key={m.id} className={`mb-4 p-3 rounded-lg ${m.role === 'user' ? 'bg-indigo-100 dark:bg-indigo-800 ml-auto' : 'bg-purple-100 dark:bg-purple-800'} max-w-[80%]`}>
                  <p className={`font-semibold mb-1 ${m.role === 'user' ? 'text-indigo-800 dark:text-indigo-200' : 'text-purple-800 dark:text-purple-200'}`}>
                    {m.role === 'user' ? 'You' : 'AI'}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{m.content}</p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleChatSubmit} className="flex w-full items-center space-x-2">
              <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-grow bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
              <Button type="submit" size="icon" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                <Send className="h-4 w-4 text-white" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">Upload Files</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload onChange={(files) => {
              if (files.length > 0) {
                handleFileChange({ target: { files: files } } as unknown as React.ChangeEvent<HTMLInputElement>);
              }
            }} />
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            {processing ? (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-indigo-600 dark:text-indigo-300">{progress}% complete</p>
              </div>
            ) : (
              <p className="text-sm text-purple-600 dark:text-purple-300">No active processing</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">Download</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {organizedFiles.length > 0 ? (
              <>
                <ScrollArea className="h-[100px]">
                  <ul className="space-y-2">
                    {organizedFiles.map((file, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <FileType className="text-indigo-600 dark:text-indigo-400 w-4 h-4" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
                >
                  Download Files
                </Button>
                <Button 
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)}
                  className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Rename Screenshot
                </Button>
              </>
            ) : (
              <p className="text-sm text-purple-600 dark:text-purple-300">No files to download</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
