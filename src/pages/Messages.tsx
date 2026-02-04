import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations, useConversation, useMessages, useSendMessage } from "@/hooks/useMessages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, ArrowLeft, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const Messages = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { user } = useAuth();
  const { data: conversations, isLoading: conversationsLoading } = useConversations();
  const { data: activeConversation } = useConversation(conversationId ?? "");
  const { data: messages, isLoading: messagesLoading } = useMessages(conversationId ?? "");
  const sendMessage = useSendMessage();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !conversationId) return;

    try {
      await sendMessage.mutateAsync({
        conversationId,
        content: newMessage.trim(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 container py-4 flex gap-4 h-[calc(100vh-80px)]">
        {/* Conversations List */}
        <Card className={cn(
          "w-full md:w-80 flex-shrink-0 flex flex-col",
          conversationId && "hidden md:flex"
        )}>
          <CardHeader className="py-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full">
              {conversationsLoading ? (
                <div className="space-y-2 p-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : conversations && conversations.length > 0 ? (
                <div className="divide-y">
                  {conversations.map((conv) => (
                    <Link
                      key={conv.id}
                      to={`/messages/${conv.id}`}
                      className={cn(
                        "flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors",
                        conversationId === conv.id && "bg-muted"
                      )}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {user?.id === conv.buyer_id ? "S" : "B"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {(conv.listing as any)?.title || "Conversation"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No conversations yet</p>
                  <Button asChild variant="outline" className="mt-4">
                    <Link to="/marketplace">Browse Marketplace</Link>
                  </Button>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className={cn(
          "flex-1 flex flex-col",
          !conversationId && "hidden md:flex"
        )}>
          {conversationId ? (
            <>
              {/* Chat Header */}
              <CardHeader className="py-4 border-b flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    asChild
                  >
                    <Link to="/messages">
                      <ArrowLeft className="h-5 w-5" />
                    </Link>
                  </Button>
                  {activeConversation?.listing && (
                    <Link
                      to={`/product/${(activeConversation.listing as any).id}`}
                      className="flex items-center gap-3 hover:opacity-80"
                    >
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {(activeConversation.listing as any).title}
                        </p>
                        <p className="text-sm text-primary font-semibold">
                          ₹{(activeConversation.listing as any).price}
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {messagesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton
                        key={i}
                        className={cn("h-12 w-48", i % 2 === 0 && "ml-auto")}
                      />
                    ))}
                  </div>
                ) : messages && messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.sender_id === user?.id;
                      return (
                        <div
                          key={message.id}
                          className={cn(
                            "flex",
                            isOwn ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[70%] rounded-2xl px-4 py-2",
                              isOwn
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            <p className="break-words">{message.content}</p>
                            <p
                              className={cn(
                                "text-xs mt-1",
                                isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                              )}
                            >
                              {formatDistanceToNow(new Date(message.created_at), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!newMessage.trim() || sendMessage.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to start chatting
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
