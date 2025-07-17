import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Waves, 
  Calendar, 
  ShoppingBag, 
  Bot, 
  Users, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react'
import { blink } from '@/blink/client'

export default function LandingPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      blink.auth.login('/dashboard')
    }
  }

  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'AI-powered dive schedule management with weather integration and automatic booking optimization.'
    },
    {
      icon: ShoppingBag,
      title: 'Equipment Store',
      description: 'Integrated e-commerce platform for diving equipment with inventory management and customer tracking.'
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Intelligent chatbot to help customers with bookings, equipment recommendations, and dive planning.'
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Complete CRM system to manage customer relationships, certifications, and dive history.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights into your business performance, popular dive sites, and revenue tracking.'
    },
    {
      icon: Waves,
      title: 'Digital Business Card',
      description: 'Professional online presence showcasing your dive shop with booking capabilities and testimonials.'
    }
  ]

  const testimonials = [
    {
      name: 'Marina Rodriguez',
      role: 'Owner, Blue Depths Diving',
      content: 'This platform transformed our business. Bookings increased 40% and customer management is effortless.',
      rating: 5
    },
    {
      name: 'Captain James Wilson',
      role: 'Deep Sea Adventures',
      content: 'The AI scheduling feature is incredible. It optimizes our dive trips based on weather and customer preferences.',
      rating: 5
    },
    {
      name: 'Sarah Chen',
      role: 'Coral Reef Expeditions',
      content: 'Our equipment sales doubled thanks to the integrated shop. Customers love the seamless experience.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Waves className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">DiveShop Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Button onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
              ) : (
                <Button onClick={() => blink.auth.login()}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%230EA5E9%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6">
              🌊 The Complete Dive Shop Solution
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Transform Your
              <span className="text-primary block">Dive Shop Business</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              The all-in-one SaaS platform that serves as your digital business card, 
              manages dive schedules with AI assistance, and powers your equipment sales.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed specifically for dive shop owners to streamline operations and grow their business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Dive Shop Owners
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our customers have to say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-background">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Dive Into Success?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of dive shops already using our platform to grow their business.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={handleGetStarted}
            className="text-lg px-8 py-6"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Waves className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">DiveShop Pro</span>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              © 2024 DiveShop Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}