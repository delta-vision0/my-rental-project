"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Star,
  Calendar,
  MessageCircle,
  Phone,
  Mail,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Building,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface RoomDetails {
  id: number
  title: string
  rent: string
  deposit: string
  description: string
  images: string[]
  location: string
  amenities: string[]
  featured?: boolean
  rating?: number
  reviews?: number
  owner?: string
  ownerDetails?: {
    name: string
    image: string
    responseRate: number
    responseTime: string
  }
  reviewsList?: {
    id: number
    user: string
    avatar: string
    rating: number
    date: string
    comment: string
  }[]
}

export default function RoomDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [room, setRoom] = useState<RoomDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    date: "",
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])

  // Check if dark mode is enabled
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setDarkMode(isDark)
  }, [])

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Load user data from localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (!savedUser) {
      // If user is not logged in, redirect to login page
      router.push("/login")
      return
    }

    setCurrentUser(JSON.parse(savedUser))
    setIsLoggedIn(true)

    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      const favs = JSON.parse(savedFavorites)
      setFavorites(favs)

      // Check if current room is in favorites
      const id = Number(params.id)
      setIsFavorite(favs.includes(id))
    }
  }, [params.id, router])

  // Fetch room data
  useEffect(() => {
    // Simulate API call
    setLoading(true)

    setTimeout(() => {
      // This would be a real API call in production
      // For now, we'll use the ID from the URL to simulate fetching the specific room
      const id = Number(params.id)

      // Sample data - in a real app, this would come from your API
      const roomData: RoomDetails = {
        id: id,
        title:
          id === 1
            ? "Luxury Studio Apartment"
            : id === 2
              ? "Cozy Single Room in Shared Flat"
              : id === 3
                ? "Spacious 2BHK with Balcony"
                : `Room #${id}`,
        rent: id === 1 ? "15000" : id === 2 ? "8000" : id === 3 ? "22000" : "12000",
        deposit: id === 1 ? "30000" : id === 2 ? "16000" : id === 3 ? "44000" : "24000",
        description:
          id === 1
            ? "Modern studio apartment with premium furnishings, high ceilings, and lots of natural light. Located in the heart of the city with easy access to public transportation. The apartment features a fully equipped kitchen, a comfortable living area, and a spacious bathroom. All utilities are included in the rent, and the building has 24/7 security. Perfect for young professionals or students looking for a convenient and comfortable living space."
            : "This comfortable and well-maintained room is perfect for anyone looking for a convenient and affordable living space. The property is located in a quiet neighborhood with easy access to public transportation, shopping centers, and restaurants.",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        location: id === 1 ? "Downtown" : id === 2 ? "University Area" : id === 3 ? "East Side" : "Central",
        amenities:
          id === 1
            ? [
                "WiFi",
                "AC",
                "Furnished",
                "Attached Bathroom",
                "Kitchen Access",
                "Parking",
                "Balcony",
                "TV",
                "Washing Machine",
                "Gym Access",
              ]
            : ["WiFi", "Furnished", "Kitchen Access", "Washing Machine"],
        featured: id === 1 || id === 3,
        rating: id === 1 ? 4.8 : id === 2 ? 4.2 : id === 3 ? 4.9 : 4.5,
        reviews: id === 1 ? 24 : id === 2 ? 15 : id === 3 ? 32 : 10,
        owner: id === 1 || id === 3 ? "admin@example.com" : "john@example.com",
        ownerDetails: {
          name: "John Doe",
          image: "/placeholder.svg?height=100&width=100",
          responseRate: 95,
          responseTime: "within a few hours",
        },
        reviewsList: [
          {
            id: 1,
            user: "Sarah Johnson",
            avatar: "/placeholder.svg?height=50&width=50",
            rating: 5,
            date: "2 weeks ago",
            comment:
              "This place is absolutely amazing! The location is perfect, and the amenities are top-notch. I would definitely recommend it to anyone looking for a comfortable stay.",
          },
          {
            id: 2,
            user: "Michael Brown",
            avatar: "/placeholder.svg?height=50&width=50",
            rating: 4,
            date: "1 month ago",
            comment:
              "Great place overall. The room was clean and well-maintained. The only issue was that the WiFi was a bit slow at times, but everything else was perfect.",
          },
          {
            id: 3,
            user: "Emily Davis",
            avatar: "/placeholder.svg?height=50&width=50",
            rating: 5,
            date: "2 months ago",
            comment:
              "I had a wonderful stay here. The host was very responsive and accommodating. The room was spacious and had all the amenities I needed. Would definitely stay here again!",
          },
        ],
      }

      setRoom(roomData)
      setLoading(false)
    }, 1000)
  }, [params.id])

  const handlePrevImage = () => {
    if (!room) return
    setCurrentImageIndex((prev) => (prev === 0 ? room.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    if (!room) return
    setCurrentImageIndex((prev) => (prev === room.images.length - 1 ? 0 : prev + 1))
  }

  const toggleFavorite = () => {
    let newFavorites: number[]
    if (isFavorite) {
      newFavorites = favorites.filter((fav) => fav !== room?.id)
      toast({
        title: "Removed from favorites",
        description: "Room has been removed from your favorites",
        variant: "default",
      })
    } else {
      newFavorites = [...favorites, room?.id || 0]
      toast({
        title: "Added to favorites",
        description: "Room has been added to your favorites",
        variant: "default",
      })
    }

    setFavorites(newFavorites)
    setIsFavorite(!isFavorite)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  const handleDeleteRoom = () => {
    setShowDeleteAlert(true)
  }

  const confirmDeleteRoom = () => {
    toast({
      title: "Room Deleted",
      description: "Your room has been successfully removed",
      variant: "default",
    })
    router.push("/dashboard")
  }

  const handleEditRoom = () => {
    // Store the room ID in localStorage to edit it on the home page
    localStorage.setItem("editRoomId", room?.id?.toString() || "")
    router.push("/dashboard")
  }

  const handleInquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInquiryForm({
      ...inquiryForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Inquiry Sent",
      description: "Your inquiry has been sent to the owner. They will contact you soon.",
      variant: "default",
    })
    setInquiryForm({
      name: "",
      email: "",
      phone: "",
      message: "",
      date: "",
    })
  }

  const handleShare = () => {
    // Copy URL to clipboard
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link Copied",
      description: "Room link has been copied to clipboard",
      variant: "default",
    })
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (!room) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}
      >
        <h2 className="text-2xl font-bold mb-4">Room Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The room you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
      </div>
    )
  }

  const isOwner = isLoggedIn && currentUser?.email === room.owner

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-amber-800 to-rose-900 dark:from-gray-900 dark:to-gray-800 text-white p-4 flex flex-wrap justify-between items-center shadow-lg"
      >
        <div className="flex items-center">
          <Building className="h-6 w-6 text-amber-400 mr-2" />
          <h1 className="text-xl font-bold">Premium Room Finder</h1>
        </div>
        <div className="flex flex-wrap space-x-2 items-center mt-2 sm:mt-0">
          <Button
            variant="ghost"
            size="sm"
            className="text-white flex items-center hover:bg-white/10"
            onClick={() => router.push("/dashboard")}
          >
            <Home className="w-4 h-4 mr-1" /> Home
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white flex items-center hover:bg-white/10"
            onClick={() => {
              router.push("/dashboard")
              localStorage.setItem("activeTab", "favorites")
            }}
          >
            <Heart className="w-4 h-4 mr-1" /> Wishlist
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light" : "Dark"}
          </Button>
        </div>
      </motion.nav>

      {/* Back button */}
      <div className="container mx-auto px-4 py-4">
        <Button
          variant="ghost"
          className="mb-4 text-gray-600 dark:text-gray-300"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to listings
        </Button>
      </div>

      {/* Image Gallery */}
      <div className="container mx-auto px-4 mb-8">
        <div className="relative rounded-lg overflow-hidden h-[300px] md:h-[500px] bg-gray-200 dark:bg-gray-800">
          {room.images.map((image, index) => (
            <motion.img
              key={index}
              src={image}
              alt={`${room.title} - Image ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{
                opacity: index === currentImageIndex ? 1 : 0,
                scale: index === currentImageIndex ? 1 : 1.1,
              }}
              transition={{ duration: 0.5 }}
            />
          ))}

          {/* Image navigation */}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70"
              onClick={handlePrevImage}
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="sr-only">Previous image</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70"
              onClick={handleNextImage}
            >
              <ChevronRight className="w-6 h-6" />
              <span className="sr-only">Next image</span>
            </Button>
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {room.images.length}
          </div>

          {/* Featured badge */}
          {room.featured && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-amber-500 hover:bg-amber-500 text-white">Featured</Badge>
            </div>
          )}

          {/* Owner controls */}
          {isOwner && (
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-white text-gray-800 flex items-center"
                onClick={handleEditRoom}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-white text-red-500 flex items-center"
                onClick={handleDeleteRoom}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          )}
        </div>

        {/* Thumbnail navigation */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {room.images.map((image, index) => (
            <button
              key={index}
              className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                index === currentImageIndex ? "border-amber-600 dark:border-amber-400" : "border-transparent"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Room Details */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold dark:text-white">{room.title}</h1>
                <div className="flex flex-wrap items-center mt-2 text-gray-600 dark:text-gray-400 text-sm">
                  <div className="flex items-center mr-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{room.location}</span>
                  </div>

                  {room.rating && (
                    <div className="flex items-center text-amber-500 mt-1 sm:mt-0">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1">{room.rating}</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">({room.reviews} reviews)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-2 sm:mt-0">
                <Button variant="outline" size="icon" className="rounded-full" onClick={toggleFavorite}>
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite ? "fill-red-500 text-red-500" : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  <span className="sr-only">Add to favorites</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full" onClick={handleShare}>
                  <Share2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
            </div>

            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="mb-4 flex flex-wrap">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Rent</h3>
                        <p className="text-xl font-bold text-rose-700 dark:text-rose-400">₹{room.rent}/month</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Deposit</h3>
                        <p className="text-xl font-bold text-gray-700 dark:text-gray-300">₹{room.deposit}</p>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 dark:text-white">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line">{room.description}</p>

                    <h3 className="text-lg font-semibold mb-2 dark:text-white">About the Owner</h3>
                    {room.ownerDetails && (
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={room.ownerDetails.image} alt={room.ownerDetails.name} />
                          <AvatarFallback>{room.ownerDetails.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <p className="font-medium dark:text-white">{room.ownerDetails.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Response rate: {room.ownerDetails.responseRate}%
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Typically responds {room.ownerDetails.responseTime}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="amenities" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 dark:text-white">Amenities</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {room.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center">
                          <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-6">
                      <div className="flex items-center text-amber-500 text-2xl mr-4">
                        <Star className="w-6 h-6 fill-current mr-1" />
                        <span className="font-bold">{room.rating}</span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">Based on {room.reviews} reviews</span>
                    </div>

                    <div className="space-y-6">
                      {room.reviewsList?.map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={review.avatar} alt={review.user} />
                                <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="ml-3">
                                <p className="font-medium dark:text-white">{review.user}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : ""}`} />
                              ))}
                            </div>
                          </div>
                          <p className="mt-3 text-gray-700 dark:text-gray-300">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 dark:text-white">Location</h3>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">Map view would be displayed here</p>
                    </div>
                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                      Located in {room.location}, this property offers easy access to public transportation, shopping
                      centers, and restaurants. The neighborhood is safe and quiet, perfect for students and working
                      professionals.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Book a Viewing</h3>
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={inquiryForm.name}
                        placeholder="Enter your name"
                        onChange={handleInquiryChange}
                        required
                        className="dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={inquiryForm.email}
                        placeholder="Enter your email"
                        onChange={handleInquiryChange}
                        required
                        className="dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={inquiryForm.phone}
                        placeholder="Enter your phone number"
                        onChange={handleInquiryChange}
                        className="dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Viewing Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={inquiryForm.date}
                        onChange={handleInquiryChange}
                        required
                        className="dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={inquiryForm.message}
                      placeholder="Any specific questions or requirements?"
                      rows={2}
                      onChange={handleInquiryChange}
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Viewing
                  </Button>
                </form>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium mb-3 dark:text-white">Contact Options</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Button variant="outline" className="justify-start dark:text-gray-300 dark:border-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" className="justify-start dark:text-gray-300 dark:border-gray-600">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                    <Button variant="outline" className="justify-start dark:text-gray-300 dark:border-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>

                {/* Add a quick availability checker */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium mb-3 dark:text-white">Quick Availability Check</h4>
                  <div className="bg-amber-50 dark:bg-gray-800/50 p-3 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium dark:text-gray-300">Available From</span>
                      <span className="text-sm font-bold text-amber-700 dark:text-amber-400">Immediate</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium dark:text-gray-300">Minimum Stay</span>
                      <span className="text-sm font-bold text-amber-700 dark:text-amber-400">6 months</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your room listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRoom} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

