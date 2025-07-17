import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Bot, 
  Send, 
  Waves, 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Thermometer,
  Wind,
  Eye,
  AlertTriangle
} from 'lucide-react'
import { blink } from '@/blink/client'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
  diveRecommendation?: {
    title: string
    location: string
    time: string
    difficulty: string
    conditions: {
      temperature: number
      windSpeed: number
      visibility: number
      waveHeight: number
    }
    suitability: 'excellent' | 'good' | 'fair' | 'poor'
    warnings?: string[]
  }
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI dive scheduling assistant. I can help you plan dives based on weather conditions, customer preferences, and safety requirements. How can I assist you today?',
      timestamp: new Date(),
      suggestions: [
        'Check today\'s dive conditions',
        'Recommend dives for beginners',
        'Plan a night dive',
        'Check weather forecast'
      ]
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const mockResponses = {
    'weather': {
      content: 'Current weather conditions are excellent for diving! Here\'s what I recommend:',
      diveRecommendation: {
        title: 'Morning Reef Exploration',
        location: 'Rainbow Reef',
        time: '09:00 AM',
        difficulty: 'beginner',
        conditions: {
          temperature: 28,
          windSpeed: 8,
          visibility: 30,
          waveHeight: 0.5
        },
        suitability: 'excellent' as const,
        warnings: []
      }
    },
    'beginner': {
      content: 'Perfect! I\'ve found some great beginner-friendly dive options:',
      diveRecommendation: {
        title: 'Shallow Coral Garden',
        location: 'Banana Reef',
        time: '10:00 AM',
        difficulty: 'beginner',
        conditions: {
          temperature: 27,
          windSpeed: 6,
          visibility: 25,
          waveHeight: 0.3
        },
        suitability: 'excellent' as const,
        warnings: []
      }
    },
    'night': {
      content: 'Night diving can be magical! Here\'s a safe night dive recommendation:',
      diveRecommendation: {
        title: 'Moonlight Marine Life',
        location: 'Protected Bay',
        time: '07:30 PM',
        difficulty: 'intermediate',
        conditions: {
          temperature: 26,
          windSpeed: 4,
          visibility: 20,
          waveHeight: 0.2
        },
        suitability: 'good' as const,
        warnings: ['Ensure all divers have proper night diving certification', 'Check underwater lights before dive']
      }
    },
    'forecast': {
      content: 'Here\'s the 3-day weather forecast for diving:',
      diveRecommendation: {
        title: 'Weekend Dive Planning',
        location: 'Multiple Sites',
        time: 'Various',
        difficulty: 'all levels',
        conditions: {
          temperature: 28,
          windSpeed: 12,
          visibility: 28,
          waveHeight: 0.7
        },
        suitability: 'good' as const,
        warnings: ['Saturday afternoon may have stronger currents', 'Sunday morning offers best visibility']
      }
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Use real AI to generate response
      const { text } = await blink.ai.generateText({
        prompt: `You are an AI dive scheduling assistant for a dive shop. The user asked: "${inputMessage}". 
        
        Provide helpful advice about dive scheduling, weather conditions, safety, or equipment. 
        Keep responses concise and practical. If they ask about booking or scheduling, mention they can use the "Schedule this dive" suggestion button.
        
        Current context: You help with dive planning, weather assessment, safety recommendations, and scheduling advice.`,
        maxTokens: 200
      })

      // Generate dive recommendation if relevant
      let diveRecommendation = null
      if (inputMessage.toLowerCase().includes('recommend') || 
          inputMessage.toLowerCase().includes('suggest') || 
          inputMessage.toLowerCase().includes('dive') ||
          inputMessage.toLowerCase().includes('weather') ||
          inputMessage.toLowerCase().includes('conditions')) {
        
        const locations = ['Rainbow Reef', 'Banana Reef', 'SS Maldivian Victory', 'Protected Bay', 'Coral Garden']
        const difficulties = ['beginner', 'intermediate', 'advanced']
        const times = ['09:00 AM', '10:00 AM', '02:00 PM', '07:30 PM']
        
        diveRecommendation = {
          title: inputMessage.toLowerCase().includes('night') ? 'Night Dive Experience' : 
                inputMessage.toLowerCase().includes('wreck') ? 'Wreck Diving Adventure' :
                inputMessage.toLowerCase().includes('beginner') ? 'Beginner Reef Dive' : 'Reef Exploration',
          location: locations[Math.floor(Math.random() * locations.length)],
          time: times[Math.floor(Math.random() * times.length)],
          difficulty: inputMessage.toLowerCase().includes('beginner') ? 'beginner' :
                     inputMessage.toLowerCase().includes('advanced') ? 'advanced' : 
                     difficulties[Math.floor(Math.random() * difficulties.length)],
          conditions: {
            temperature: 26 + Math.floor(Math.random() * 4),
            windSpeed: 4 + Math.floor(Math.random() * 10),
            visibility: 20 + Math.floor(Math.random() * 15),
            waveHeight: 0.2 + Math.random() * 0.8
          },
          suitability: Math.random() > 0.3 ? 'excellent' : Math.random() > 0.5 ? 'good' : 'fair',
          warnings: inputMessage.toLowerCase().includes('night') ? 
            ['Ensure all divers have proper night diving certification', 'Check underwater lights before dive'] : []
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: text,
        timestamp: new Date(),
        diveRecommendation,
        suggestions: [
          'Schedule this dive',
          'Check equipment availability',
          'Find similar dives',
          'Get safety briefing'
        ]
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI Assistant error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact support if the issue persists.',
        timestamp: new Date(),
        suggestions: [
          'Check today\'s dive conditions',
          'Recommend dives for beginners',
          'Plan a night dive',
          'Check weather forecast'
        ]
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === 'Schedule this dive') {
      // Find the last message with a dive recommendation
      const lastRecommendation = [...messages].reverse().find(m => m.diveRecommendation)
      if (lastRecommendation?.diveRecommendation) {
        handleBookDive(lastRecommendation.diveRecommendation)
      }
    } else {
      setInputMessage(suggestion)
    }
  }

  const handleBookDive = (diveRecommendation: any) => {
    // Create a booking dialog or redirect to booking page
    const bookingData = {
      title: diveRecommendation.title,
      location: diveRecommendation.location,
      time: diveRecommendation.time,
      difficulty: diveRecommendation.difficulty,
      conditions: diveRecommendation.conditions
    }
    
    // For now, show a confirmation message
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `Great! I've prepared a booking for "${diveRecommendation.title}" at ${diveRecommendation.location} for ${diveRecommendation.time}. To complete the booking, please provide your contact details and any special requirements. You can also visit the Schedule Management page to finalize this booking.`,
      timestamp: new Date(),
      suggestions: [
        'Go to Schedule Management',
        'Add customer details',
        'Check equipment needs',
        'View safety requirements'
      ]
    }
    
    setMessages(prev => [...prev, confirmationMessage])
  }

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'fair': return 'bg-yellow-100 text-yellow-800'
      case 'poor': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg">
          <Bot className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            AI Dive Assistant
          </DialogTitle>
          <DialogDescription>
            Get intelligent recommendations for dive scheduling and planning
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    
                    {message.diveRecommendation && (
                      <Card className="mt-3 bg-background">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Waves className="w-4 h-4" />
                            {message.diveRecommendation.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 text-xs">
                            <MapPin className="w-3 h-3" />
                            {message.diveRecommendation.location}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {message.diveRecommendation.time}
                              </div>
                              <Badge className={getSuitabilityColor(message.diveRecommendation.suitability)}>
                                {message.diveRecommendation.suitability}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1">
                                <Thermometer className="w-3 h-3" />
                                {message.diveRecommendation.conditions.temperature}°C
                              </div>
                              <div className="flex items-center gap-1">
                                <Wind className="w-3 h-3" />
                                {message.diveRecommendation.conditions.windSpeed} km/h
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {message.diveRecommendation.conditions.visibility}m
                              </div>
                              <div className="flex items-center gap-1">
                                <Waves className="w-3 h-3" />
                                {message.diveRecommendation.conditions.waveHeight}m
                              </div>
                            </div>

                            {message.diveRecommendation.warnings && message.diveRecommendation.warnings.length > 0 && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                                <div className="flex items-center gap-1 text-yellow-800 text-xs font-medium mb-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Safety Notes
                                </div>
                                {message.diveRecommendation.warnings.map((warning, index) => (
                                  <p key={index} className="text-xs text-yellow-700">• {warning}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-6"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 animate-pulse" />
                      <span className="text-sm">Analyzing conditions...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Ask about dive conditions, scheduling, or safety..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}