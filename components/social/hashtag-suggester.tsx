"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Hash, Plus } from "lucide-react"

interface HashtagSuggesterProps {
  value: string
  onChange: (value: string) => void
  niche?: string
}

// Hashtags populares por nicho
const HASHTAG_SUGGESTIONS: Record<string, string[]> = {
  fitness: ["#fitness", "#workout", "#gym", "#healthy", "#fitnessmotivation", "#bodybuilding", "#training", "#muscle"],
  beauty: ["#beauty", "#makeup", "#skincare", "#beautyblogger", "#makeupartist", "#cosmetics", "#beautytips"],
  tech: ["#technology", "#tech", "#innovation", "#gadgets", "#ai", "#programming", "#developer", "#coding"],
  lifestyle: ["#lifestyle", "#lifestyleblogger", "#dailylife", "#inspiration", "#motivation", "#goals", "#success"],
  fashion: ["#fashion", "#style", "#ootd", "#fashionblogger", "#instafashion", "#fashionista", "#streetstyle"],
  food: ["#food", "#foodie", "#instafood", "#cooking", "#recipe", "#delicious", "#foodporn", "#yummy"],
  travel: ["#travel", "#travelgram", "#wanderlust", "#adventure", "#explore", "#vacation", "#travelphotography"],
  gaming: ["#gaming", "#gamer", "#game", "#videogames", "#twitch", "#streamer", "#gamers", "#gameplay"],
  education: ["#education", "#learning", "#knowledge", "#student", "#study", "#teacher", "#elearning", "#school"],
  business: ["#business", "#entrepreneur", "#startup", "#marketing", "#success", "#leadership", "#businessowner"],
  default: ["#viral", "#trending", "#instagood", "#photooftheday", "#follow", "#like", "#amazing", "#instalike"],
}

export function HashtagSuggester({ value, onChange, niche = "default" }: HashtagSuggesterProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)

  const suggestions = HASHTAG_SUGGESTIONS[niche] || HASHTAG_SUGGESTIONS.default

  const currentHashtags = value
    .split(/[\s\n]+/)
    .filter((tag) => tag.startsWith("#") && tag.length > 1)

  const addHashtag = (hashtag: string) => {
    if (!value.includes(hashtag)) {
      const newValue = value ? `${value} ${hashtag}` : hashtag
      onChange(newValue)
    }
  }

  const removeHashtag = (hashtag: string) => {
    const newValue = value
      .split(/[\s\n]+/)
      .filter((tag) => tag !== hashtag)
      .join(" ")
    onChange(newValue)
  }

  const hashtagCount = currentHashtags.length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Hashtags</Label>
        <span className="text-xs text-muted-foreground">
          {hashtagCount} / 30 hashtags
        </span>
      </div>

      <Textarea
        placeholder="#exemplo #hashtags #aqui"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        maxLength={1000}
      />

      {/* Current Hashtags */}
      {currentHashtags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {currentHashtags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => removeHashtag(tag)}
            >
              {tag} ×
            </Badge>
          ))}
        </div>
      )}

      {/* Suggestions Toggle */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setShowSuggestions(!showSuggestions)}
        className="gap-2"
      >
        <Hash className="h-4 w-4" />
        {showSuggestions ? "Ocultar sugestões" : "Ver sugestões"}
      </Button>

      {/* Suggestion List */}
      {showSuggestions && (
        <div className="border rounded-lg p-3 space-y-2">
          <p className="text-sm font-medium">Hashtags Sugeridas</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((hashtag) => {
              const isUsed = value.includes(hashtag)
              return (
                <Badge
                  key={hashtag}
                  variant={isUsed ? "default" : "outline"}
                  className="cursor-pointer gap-1"
                  onClick={() => (isUsed ? removeHashtag(hashtag) : addHashtag(hashtag))}
                >
                  {isUsed ? "✓" : <Plus className="h-3 w-3" />}
                  {hashtag}
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      {hashtagCount >= 30 && (
        <p className="text-xs text-destructive">
          Limite de 30 hashtags atingido (Instagram)
        </p>
      )}
    </div>
  )
}
