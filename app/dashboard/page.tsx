"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  PlusCircle,
  Home,
  Heart,
  X,
  Grid,
  List,
  SlidersHorizontal,
  ChevronDown,
  MapPin,
  Star,
  Share2,
  Edit,
  Trash2,
  LogOut,
  Building,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
}

// Sample amenities list
const amenitiesList = [
  "WiFi",
  "Attached Bathroom",
  "Furnished",
  "AC",
  "Kitchen Access",
  "Parking",
  "Balcony",
  "TV",
  "Washing Machine",
  "Gym Access",
  "Near Metro",
  "Pets Allowed",
]

// Sample locations for filter
const locations = [
  "Downtown",
  "North Side",
  "South Side",
  "East Side",
  "West Side",
  "Central",
  "Suburban",
  "University Area",
]

export default function Dashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [favorites, setFavorites] = useState<number[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const [roomDetails, setRoomDetails] = useState<RoomDetails>({
    id: 0,
    title: "",
    rent: "",
    deposit: "",
    description: "",
    images: [],
    location: "",
    amenities: [],
  })

  // Sample data for initial rooms
  const [rooms, setRooms] = useState<RoomDetails[]>([
    {
      id: 1,
      title: "Luxury Studio Apartment",
      rent: "15000",
      deposit: "30000",
      description:
        "Modern studio apartment with premium furnishings, high ceilings, and lots of natural light. Located in the heart of the city with easy access to public transportation.",
      images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
      location: "Downtown",
      amenities: ["WiFi", "AC", "Furnished", "Attached Bathroom", "Kitchen Access"],
      featured: true,
      rating: 4.8,
      reviews: 24,
      owner: "admin@example.com",
    },
    {
      id: 2,
      title: "Cozy Single Room in Shared Flat",
      rent: "8000",
      deposit: "16000",
      description:
        "Comfortable single room in a well-maintained shared apartment. All utilities included. Great for students or young professionals.",
      images: ["/placeholder.svg?height=400&width=600"],
      location: "University Area",
      amenities: ["WiFi", "Furnished", "Kitchen Access", "Washing Machine"],
      rating: 4.2,
      reviews: 15,
      owner: "john@example.com",
    },
    {
      id: 3,
      title: "Spacious 2BHK with Balcony",
      rent: "22000",
      deposit: "44000",
      description:
        "Large two-bedroom apartment with a beautiful balcony overlooking the city. Recently renovated with modern amenities.",
      images: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
      location: "East Side",
      amenities: ["WiFi", "AC", "Furnished", "Attached Bathroom", "Balcony", "Parking"],
      featured: true,
      rating: 4.9,
      reviews: 32,
      owner: "admin@example.com",
    },
  ])

  // Check if user is logged in
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
      setFavorites(JSON.parse(savedFavorites))
    }

    // Check if there's an active tab in localStorage
    const storedTab = localStorage.getItem("activeTab")
    if (storedTab) {
      setActiveTab(storedTab)
      localStorage.removeItem("activeTab")
    }
  }, [router])

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => prev + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRoomDetails({ ...roomDetails, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const files = Array.from(e.target.files)
    setRoomDetails({
      ...roomDetails,
      images: files.map((file) => URL.createObjectURL(file)),
    })
  }

  const toggleAmenity = (amenity: string) => {
    if (roomDetails.amenities.includes(amenity)) {
      setRoomDetails({
        ...roomDetails,
        amenities: roomDetails.amenities.filter((a) => a !== amenity),
      })
    } else {
      setRoomDetails({
        ...roomDetails,
        amenities: [...roomDetails.amenities, amenity],
      })
    }
  }

  const handleAddRoom = () => {
    if (!roomDetails.title || !roomDetails.rent || !roomDetails.deposit || !roomDetails.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (isEditing) {
      // Update existing room
      const updatedRooms = rooms.map((room) =>
        room.id === roomDetails.id ? { ...roomDetails, owner: currentUser?.email || "" } : room,
      )
      setRooms(updatedRooms)
      toast({
        title: "Room Updated",
        description: "Your room has been successfully updated",
        variant: "default",
      })
    } else {
      // Add new room
      const newRoom = {
        ...roomDetails,
        id: Date.now(),
        rating: 5.0,
        reviews: 0,
        owner: currentUser?.email || "",
      }
      setRooms([newRoom, ...rooms])
      toast({
        title: "Room Added",
        description: "Your room has been successfully listed",
        variant: "default",
      })
    }

    resetForm()
    setShowModal(false)
    setIsEditing(false)
  }

  const resetForm = () => {
    setRoomDetails({
      id: 0,
      title: "",
      rent: "",
      deposit: "",
      description: "",
      images: [],
      location: "",
      amenities: [],
    })
  }

  const handleEditRoom = (room: RoomDetails) => {
    setRoomDetails(room)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleDeleteRoom = (id: number) => {
    setRoomToDelete(id)
    setShowDeleteAlert(true)
  }

  const confirmDeleteRoom = () => {
    if (roomToDelete) {
      setRooms(rooms.filter((room) => room.id !== roomToDelete))
      toast({
        title: "Room Deleted",
        description: "Your room has been successfully removed",
        variant: "default",
      })
      setShowDeleteAlert(false)
      setRoomToDelete(null)
    }
  }

  const toggleFavorite = (id: number) => {
    let newFavorites: number[]
    if (favorites.includes(id)) {
      newFavorites = favorites.filter((fav) => fav !== id)
      toast({
        title: "Removed from favorites",
        description: "Room has been removed from your favorites",
        variant: "default",
      })
    } else {
      newFavorites = [...favorites, id]
      toast({
        title: "Added to favorites",
        description: "Room has been added to your favorites",
        variant: "default",
      })
    }

    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("currentUser")

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
      variant: "default",
    })

    router.push("/")
  }

  const filteredRooms = rooms.filter((room) => {
    // Filter by active tab
    if (activeTab === "my-listings" && room.owner !== currentUser?.email) {
      return false
    }

    if (activeTab === "favorites" && !favorites.includes(room.id)) {
      return false
    }

    // Filter by search query
    const matchesSearch =
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by selected amenities/locations
    const matchesFilters =
      selectedFilters.length === 0 ||
      selectedFilters.every((filter) => room.amenities.includes(filter) || room.location === filter)

    return matchesSearch && matchesFilters
  })

  const viewRoom = (id: number) => {
    // Navigate to the specific room detail page
    router.push(`/room/${id}`)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const handleShare = () => {
    toast({
      title: "Share",
      description: "This feature is not implemented yet.",
      variant: "default",
    })
  }

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
            onClick={() => setActiveTab("all")}
          >
            <Home className="w-4 h-4 mr-1" /> Home
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white flex items-center hover:bg-white/10"
            onClick={() => setActiveTab("favorites")}
          >
            <Heart className="w-4 h-4 mr-1" /> Wishlist
          </Button>

          {isLoggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white flex items-center hover:bg-white/10">
                  <Avatar className="w-5 h-5 mr-1">
                    <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{currentUser?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setActiveTab("my-listings")}>My Listings</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

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

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="text-center py-16 bg-gradient-to-r from-amber-800 to-rose-900 dark:from-gray-800 dark:to-gray-900 text-white"
      >
        <h2 className="text-4xl font-bold mb-4">Find Your Perfect Rental Room</h2>
        <p className="text-lg max-w-2xl mx-auto text-amber-100 dark:text-gray-300">
          Discover premium rental options with verified listings and detailed information
        </p>
      </motion.div>

      {/* Search Bar & Add Room */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 -mt-8 px-4 relative z-10"
      >
        <div className="flex bg-white dark:bg-gray-800 p-2 rounded-lg shadow-xl w-full max-w-2xl">
          <Input
            type="text"
            placeholder="Search by location or title"
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-gray-800 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button className="ml-2 flex items-center bg-amber-500 hover:bg-amber-600 text-white">
            <Search className="w-4 h-4 mr-2" /> Search
          </Button>
        </div>
        <Button
          className="bg-rose-700 hover:bg-rose-800 text-white flex items-center shadow-xl w-full sm:w-auto"
          onClick={() => {
            resetForm()
            setIsEditing(false)
            setShowModal(true)
          }}
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add Room
        </Button>
      </motion.div>

      {/* Dashboard Controls */}
      <div className="container mx-auto mt-8 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mr-4">
                <TabsList className="flex flex-wrap">
                  <TabsTrigger value="all">All Rooms</TabsTrigger>
                  <TabsTrigger value="my-listings">My Listings</TabsTrigger>
                  <TabsTrigger value="favorites">Wishlist</TabsTrigger>
                </TabsList>
              </Tabs>

              <h3 className="font-medium text-gray-700 dark:text-gray-200">
                {filteredRooms.length} {filteredRooms.length === 1 ? "Room" : "Rooms"}
              </h3>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                  <span className="sr-only">Grid view</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">List view</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                className="flex items-center h-8 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-8 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">
                    Sort By <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                  <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                  <DropdownMenuItem>Rating: High to Low</DropdownMenuItem>
                  <DropdownMenuItem>Most Recent</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {selectedFilters.length > 0 && (
                <Button
                  variant="ghost"
                  className="h-8 text-sm dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setSelectedFilters([])}
                >
                  Clear ({selectedFilters.length})
                </Button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t dark:border-gray-700 mt-4">
                  <Tabs defaultValue="amenities">
                    <TabsList className="mb-4">
                      <TabsTrigger value="amenities">Amenities</TabsTrigger>
                      <TabsTrigger value="location">Location</TabsTrigger>
                      <TabsTrigger value="price">Price Range</TabsTrigger>
                    </TabsList>

                    <TabsContent value="amenities" className="mt-0">
                      <div className="flex flex-wrap gap-2">
                        {amenitiesList.map((amenity) => (
                          <Badge
                            key={amenity}
                            variant={selectedFilters.includes(amenity) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              if (selectedFilters.includes(amenity)) {
                                setSelectedFilters(selectedFilters.filter((f) => f !== amenity))
                              } else {
                                setSelectedFilters([...selectedFilters, amenity])
                              }
                            }}
                          >
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="location" className="mt-0">
                      <div className="flex flex-wrap gap-2">
                        {locations.map((location) => (
                          <Badge
                            key={location}
                            variant={selectedFilters.includes(location) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              if (selectedFilters.includes(location)) {
                                setSelectedFilters(selectedFilters.filter((f) => f !== location))
                              } else {
                                setSelectedFilters([...selectedFilters, location])
                              }
                            }}
                          >
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="price" className="mt-0">
                      <div className="flex items-center gap-4">
                        <Input type="number" placeholder="Min" className="w-24 dark:bg-gray-700 dark:border-gray-600" />
                        <span className="dark:text-white">to</span>
                        <Input type="number" placeholder="Max" className="w-24 dark:bg-gray-700 dark:border-gray-600" />
                        <Button size="sm">Apply</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Listings */}
      <div className="container mx-auto px-4 pb-16">
        {filteredRooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-gray-500 dark:text-gray-400 text-xl mt-10 py-16"
          >
            <p className="italic">🔍 No rooms match your search criteria. Try adjusting your filters.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredRooms.map((room) => (
              <motion.div
                key={room.id}
                variants={item}
                whileHover={{
                  scale: viewMode === "grid" ? 1.03 : 1.01,
                  y: viewMode === "grid" ? -5 : -2,
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`rounded-lg shadow-lg overflow-hidden dark:bg-gray-800 dark:border dark:border-gray-700 bg-white ${
                  room.featured ? "ring-2 ring-amber-400" : ""
                }`}
              >
                {viewMode === "grid" ? (
                  <Card className="border-0 h-full flex flex-col">
                    <div className="w-full h-48 overflow-hidden relative">
                      {room.featured && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge className="bg-amber-500 hover:bg-amber-500">Featured</Badge>
                        </div>
                      )}

                      {/* Owner controls */}
                      {room.owner === currentUser?.email && (
                        <div className="absolute top-2 right-2 z-10 flex gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-white/80 hover:bg-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditRoom(room)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-white/80 hover:bg-white text-red-500"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteRoom(room.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {room.images.length > 0 ? (
                        <>
                          {room.images.map((image, index) => (
                            <motion.img
                              key={`${room.id}-${index}`}
                              src={image}
                              alt={`${room.title} - Image ${index + 1}`}
                              className="w-full h-full object-cover absolute inset-0"
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: index === currentImageIndex % room.images.length ? 1 : 0,
                              }}
                              transition={{ duration: 0.5 }}
                            />
                          ))}
                          {/* Image navigation dots */}
                          {room.images.length > 1 && (
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                              {room.images.map((_, index) => (
                                <button
                                  key={`dot-${index}`}
                                  className={`w-2 h-2 rounded-full ${
                                    index === currentImageIndex % room.images.length ? "bg-white" : "bg-white/50"
                                  }`}
                                  onClick={() => setCurrentImageIndex(index)}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                          <p className="text-gray-500 dark:text-gray-400">No image available</p>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between">
                        <h3 className="text-base sm:text-lg font-semibold dark:text-white line-clamp-1">
                          {room.title}
                        </h3>
                        <div className="flex items-center">
                          {room.rating && (
                            <div className="flex items-center text-amber-500 text-sm">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="ml-1">{room.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                        <MapPin className="w-3 h-3 mr-1" />
                        {room.location}
                      </div>

                      <div className="mt-2">
                        <span className="text-lg sm:text-xl font-bold text-rose-700 dark:text-rose-400">
                          ₹{room.rent}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">/month</span>
                      </div>

                      <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
                        Deposit: ₹{room.deposit}
                      </p>

                      {room.description && (
                        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mt-2 line-clamp-2">
                          {room.description}
                        </p>
                      )}

                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {room.amenities.slice(0, 2).map((amenity) => (
                            <Badge key={amenity} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {room.amenities.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{room.amenities.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-auto pt-3">
                        <Button
                          size="sm"
                          className="bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm"
                          onClick={() => viewRoom(room.id)}
                        >
                          View Details
                        </Button>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(room.id)
                            }}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                favorites.includes(room.id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            />
                            <span className="sr-only">Add to favorites</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleShare()
                            }}
                          >
                            <Share2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="sr-only">Share</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  // List view
                  <Card className="border-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                        {room.featured && (
                          <div className="absolute top-2 left-2 z-10">
                            <Badge className="bg-amber-500 hover:bg-amber-500">Featured</Badge>
                          </div>
                        )}

                        {/* Owner controls */}
                        {room.owner === currentUser?.email && (
                          <div className="absolute top-2 right-2 z-10 flex gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-white/80 hover:bg-white"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditRoom(room)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-white/80 hover:bg-white text-red-500"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteRoom(room.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        {room.images.length > 0 ? (
                          <img
                            src={room.images[0] || "/placeholder.svg"}
                            alt={room.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                            <p className="text-gray-500 dark:text-gray-400">No image available</p>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4 flex-1">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold dark:text-white">{room.title}</h3>
                              <div className="flex items-center md:hidden">
                                {room.rating && (
                                  <div className="flex items-center text-amber-500 text-sm">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="ml-1">{room.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400 text-sm">
                              <MapPin className="w-3 h-3 mr-1" />
                              {room.location}
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3 md:max-w-md">
                              {room.description}
                            </p>

                            {room.amenities && room.amenities.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {room.amenities.map((amenity) => (
                                  <Badge key={amenity} variant="outline" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="mt-4 md:mt-0 md:ml-4 md:text-right flex flex-col justify-between">
                            <div>
                              <div className="hidden md:flex md:justify-end items-center text-amber-500 text-sm mb-2">
                                {room.rating && (
                                  <>
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="ml-1">{room.rating}</span>
                                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                                      ({room.reviews} reviews)
                                    </span>
                                  </>
                                )}
                              </div>

                              <div>
                                <span className="text-xl font-bold text-rose-700 dark:text-rose-400">₹{room.rent}</span>
                                <span className="text-gray-500 dark:text-gray-400">/month</span>
                              </div>

                              <p className="text-gray-500 dark:text-gray-400 text-sm">Deposit: ₹{room.deposit}</p>
                            </div>

                            <div className="flex gap-2 mt-4 justify-end">
                              <Button
                                className="bg-amber-500 hover:bg-amber-600 text-white"
                                onClick={() => viewRoom(room.id)}
                              >
                                View Details
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFavorite(room.id)
                                }}
                              >
                                <Heart
                                  className={`w-5 h-5 ${
                                    favorites.includes(room.id)
                                      ? "fill-red-500 text-red-500"
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}
                                />
                                <span className="sr-only">Add to favorites</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modal for Adding/Editing Room */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg w-full max-w-md relative dark:text-white"
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowModal(false)}
              >
                <X className="w-5 h-5" />
                <span className="sr-only">Close</span>
              </button>
              <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Room" : "Add a New Room"}</h2>
              <div className="space-y-3">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={roomDetails.title}
                    placeholder="e.g., Cozy Single Room in Central Location"
                    onChange={handleInputChange}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="rent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Monthly Rent (₹) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="rent"
                      name="rent"
                      value={roomDetails.rent}
                      placeholder="e.g., 5000"
                      type="number"
                      onChange={handleInputChange}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="deposit"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Deposit (₹) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="deposit"
                      name="deposit"
                      value={roomDetails.deposit}
                      placeholder="e.g., 10000"
                      type="number"
                      onChange={handleInputChange}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={roomDetails.location}
                    onChange={(e) => setRoomDetails({ ...roomDetails, location: e.target.value })}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select location</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={roomDetails.description}
                    placeholder="Describe the room, amenities, and location..."
                    rows={2}
                    onChange={handleInputChange}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amenities</label>
                  <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto pr-1">
                    {amenitiesList.map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`amenity-${amenity}`}
                          checked={roomDetails.amenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="mr-2"
                        />
                        <label htmlFor={`amenity-${amenity}`} className="text-sm text-gray-700 dark:text-gray-300">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Images
                  </label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />

                  {roomDetails.images.length > 0 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto py-1">
                      {roomDetails.images.map((image, index) => (
                        <div key={index} className="relative w-12 h-12 flex-shrink-0">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white flex-1" onClick={handleAddRoom}>
                    {isEditing ? "Update Room" : "Add Room"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="dark:text-gray-300 dark:border-gray-600"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

