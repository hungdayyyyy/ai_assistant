"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  X,
  Send,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Upload,
  FileText,
  MessageCircle,
  Briefcase,
  Sparkles,
  Coffee,
  Code,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

interface ChatboxProps {
  className?: string;
}

type ChatMode = "cv" | "general";

export function Chatbox({ className }: ChatboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>("general");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cvChat = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    messages: [
      {
        id: "cv-1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Hello! I'm your AI CV assistant. I can help you optimize your resume, provide feedback, and answer questions about your career. How can I help you today?",
          },
        ],
      },
    ],
  });

  const generalChat = useChat({
    transport: new DefaultChatTransport({ api: "/api/general-chat" }),
    messages: [
      {
        id: "general-1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Hi there! I'm your AI assistant. I can help you with questions, brainstorming, learning, coding, or just have a friendly chat. What would you like to talk about?",
          },
        ],
      },
    ],
  });

  const currentChat = chatMode === "cv" ? cvChat : generalChat;
  const { messages, sendMessage, status } = currentChat;

  const [inputValue, setInputValue] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || status === "streaming") return;

    sendMessage({ text: inputValue });
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleQuickAction = (action: string) => {
    let message = "";
    switch (action) {
      case "cv-tips":
        message = "Can you give me some general tips for improving my CV?";
        break;
      case "upload-cv":
        message =
          "I would like to upload my CV for analysis. How can I do that?";
        break;
      case "general-help":
        message = "What can you help me with?";
        break;
      case "coding":
        message = "I need help with coding. Can you assist me?";
        break;
      case "learning":
        message = "I want to learn something new. What do you recommend?";
        break;
      case "creative":
        message =
          "I need help with a creative project. Can you brainstorm with me?";
        break;
      default:
        return;
    }
    sendMessage({ text: message });
  };

  const switchMode = (mode: ChatMode) => {
    setChatMode(mode);
  };

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={toggleChatbox}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card
          className={cn(
            "w-80 sm:w-96 shadow-2xl border-border/40 bg-card/95 backdrop-blur-sm transition-all duration-300",
            isMinimized ? "h-14" : "h-[500px]"
          )}
        >
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-border/40">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 bg-primary/10">
                <AvatarFallback className="bg-primary/10">
                  {chatMode === "cv" ? (
                    <Briefcase className="h-4 w-4 text-primary" />
                  ) : (
                    <Bot className="h-4 w-4 text-primary" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-medium">
                  {chatMode === "cv" ? "AI CV Assistant" : "AI Assistant"}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {status === "streaming" ? "Thinking..." : "Online"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMinimize}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChatbox}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Chat Content */}
          {!isMinimized && (
            <CardContent className="flex flex-col h-[calc(500px-80px)] p-0">
              <div className="p-3 border-b border-border/40">
                <div className="flex gap-2">
                  <Button
                    variant={chatMode === "general" ? "default" : "outline"}
                    size="sm"
                    className="text-xs h-7 flex-1"
                    onClick={() => switchMode("general")}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    General Chat
                  </Button>
                  <Button
                    variant={chatMode === "cv" ? "default" : "outline"}
                    size="sm"
                    className="text-xs h-7 flex-1"
                    onClick={() => switchMode("cv")}
                  >
                    <Briefcase className="h-3 w-3 mr-1" />
                    CV Assistant
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        (message.role as string) === "user"
                          ? "justify-end"
                          : "justify-start"
                      )}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 bg-primary/10 mt-1">
                          <AvatarFallback className="bg-primary/10">
                            {chatMode === "cv" ? (
                              <Briefcase className="h-4 w-4 text-primary" />
                            ) : (
                              <Bot className="h-4 w-4 text-primary" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                          (message.role as string) === "user"
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {message.parts.map((part, index) => {
                          if (part.type === "text") {
                            return (
                              <p
                                key={index}
                                className="text-pretty whitespace-pre-wrap"
                              >
                                {part.text}
                              </p>
                            );
                          }
                          return null;
                        })}
                        <p
                          className={cn(
                            "text-xs mt-1 opacity-70",
                            (message.role as string) === "user"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground/70"
                          )}
                        >
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {(message.role as string) === "user" && (
                        <Avatar className="h-8 w-8 bg-accent/10 mt-1">
                          <AvatarFallback className="bg-accent/10">
                            <User className="h-4 w-4 text-accent" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              <div className="px-4 py-2 border-t border-border/40">
                <div className="flex gap-2 mb-3 flex-wrap">
                  {chatMode === "cv" ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 bg-transparent"
                        onClick={() => handleQuickAction("upload-cv")}
                        disabled={status === "streaming"}
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Upload CV
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 bg-transparent"
                        onClick={() => handleQuickAction("cv-tips")}
                        disabled={status === "streaming"}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        CV Tips
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 bg-transparent"
                        onClick={() => handleQuickAction("general-help")}
                        disabled={status === "streaming"}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Help
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 bg-transparent"
                        onClick={() => handleQuickAction("coding")}
                        disabled={status === "streaming"}
                      >
                        <Code className="h-3 w-3 mr-1" />
                        Coding
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 bg-transparent"
                        onClick={() => handleQuickAction("learning")}
                        disabled={status === "streaming"}
                      >
                        <BookOpen className="h-3 w-3 mr-1" />
                        Learning
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 bg-transparent"
                        onClick={() => handleQuickAction("creative")}
                        disabled={status === "streaming"}
                      >
                        <Coffee className="h-3 w-3 mr-1" />
                        Creative
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border/40">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      chatMode === "cv"
                        ? "Ask me about your CV..."
                        : "Ask me anything..."
                    }
                    className="flex-1 text-sm"
                    disabled={status === "streaming"}
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    disabled={!inputValue.trim() || status === "streaming"}
                    className="px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
