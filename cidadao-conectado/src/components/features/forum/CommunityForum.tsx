"use client";

import { useState } from "react";
import { AlertTriangle, Search, ThumbsUp, UserCircle, MessageSquare, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockForumPosts, ForumPost } from "@/data/forumMocks";
import { CreatePostModal } from "./CreatePostModal";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function CommunityForum() {
  const [posts, setPosts] = useState<ForumPost[]>(mockForumPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("Todos");
  const [upvotedPosts, setUpvotedPosts] = useState<Record<string, boolean>>({});

  const handleUpvote = (postId: string) => {
    const isUpvoted = upvotedPosts[postId];
    
    setPosts(current => 
      current.map(post => {
        if (post.id === postId) {
          return { ...post, upvotes: post.upvotes + (isUpvoted ? -1 : 1) };
        }
        return post;
      })
    );

    setUpvotedPosts(prev => ({ ...prev, [postId]: !isUpvoted }));
  };

  const handleNewPost = (newPost: ForumPost) => {
    setPosts([newPost, ...posts]);
  };

  // Filtragem e Ordenação
  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTopic = topicFilter === "Todos" || post.topic === topicFilter;
      return matchesSearch && matchesTopic;
    })
    .sort((a, b) => b.upvotes - a.upvotes); // Ordenar por upvotes descendente

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Aviso Legal */}
      <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start gap-3 mt-4">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
          <strong>Atenção:</strong> Os relatos abaixo são experiências pessoais de outros usuários e NÃO constituem aconselhamento jurídico oficial. Para ações legais garantidas, consulte a Defensoria Pública.
        </p>
      </div>

      {/* Barra de Ferramentas */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex-1 flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por palavras-chave..." 
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={topicFilter} onValueChange={setTopicFilter}>
            <SelectTrigger className="w-[160px] bg-background">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Tópico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos Tópicos</SelectItem>
              <SelectItem value="Saúde">Saúde</SelectItem>
              <SelectItem value="Trabalho">Trabalho</SelectItem>
              <SelectItem value="Documentação">Documentação</SelectItem>
              <SelectItem value="Benefícios">Benefícios</SelectItem>
              <SelectItem value="Outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-auto shrink-0">
          <CreatePostModal onPostCreated={handleNewPost} />
        </div>
      </div>

      {/* Feed de Posts */}
      <div className="space-y-4 pb-12">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-card/30 rounded-2xl border border-border/50 border-dashed">
            <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhuma discussão encontrada.</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex gap-4">
              {/* Upvote Column */}
              <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                <button 
                  onClick={() => handleUpvote(post.id)}
                  className={`p-2 rounded-full transition-colors ${upvotedPosts[post.id] ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                  aria-label="Apoiar relato"
                >
                  <ThumbsUp className={`w-5 h-5 ${upvotedPosts[post.id] ? 'fill-primary' : ''}`} />
                </button>
                <span className={`font-bold text-sm ${upvotedPosts[post.id] ? 'text-primary' : 'text-muted-foreground'}`}>
                  {post.upvotes}
                </span>
              </div>

              {/* Content Column */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <Badge variant="outline" className="bg-muted text-xs">
                    {post.topic}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-foreground leading-tight">
                  {post.title}
                </h3>
                <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

                <div className="flex items-center gap-2 pt-3 mt-2 border-t border-border/40">
                  {post.author === "Cidadão Anônimo" ? (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <UserCircle className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <UserCircle className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <span className="text-xs font-medium text-muted-foreground">
                    {post.author}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
