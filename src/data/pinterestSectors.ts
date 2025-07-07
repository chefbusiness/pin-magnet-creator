import { 
  Home, 
  ChefHat, 
  Shirt, 
  Sparkles, 
  Users, 
  Baby, 
  Car, 
  Dumbbell, 
  Heart, 
  Camera,
  Briefcase,
  GraduationCap,
  Palette,
  Monitor,
  Leaf,
  Gift,
  Music,
  BookOpen,
  Gamepad2,
  Globe,
  Calendar
} from "lucide-react";

type TranslationFunction = (key: string) => string;

export const getTopSectors = (t: TranslationFunction) => [
  {
    icon: Home,
    titleKey: "sector.homeDecor",
    emoji: "🏠",
    subcategoriesKeys: [
      "Living room decoration",
      "Bedroom design", 
      "Kitchen decoration",
      "Bathrooms and small spaces",
      "Seasonal decoration (Christmas, Halloween, spring)",
      "DIY home projects",
      "Recycled furniture and upcycling",
      "Home organization",
      "Budget decoration",
      "Styles: minimalist, bohemian, rustic, modern, farmhouse"
    ]
  },
  {
    icon: ChefHat,
    titleKey: "sector.recipes",
    emoji: "🍲",
    subcategoriesKeys: [
      "Healthy recipes",
      "Quick and easy food",
      "Desserts and baking",
      "Meal prep and meal planning",
      "Vegan and vegetarian recipes",
      "Gluten-free recipes",
      "International cuisine",
      "Drinks and cocktails",
      "Special occasion recipes",
      "Cooking techniques and culinary tips"
    ]
  },
  {
    icon: Shirt,
    titleKey: "sector.fashion",
    emoji: "👗",
    subcategoriesKeys: [
      "Casual outfits",
      "Formal and office wear",
      "Seasonal fashion",
      "Capsule wardrobe",
      "Sustainable fashion",
      "Accessories and jewelry",
      "Shoes and bags",
      "Fashion for different body types",
      "Fashion trends",
      "Special occasion looks"
    ]
  },
  {
    icon: Sparkles,
    titleKey: "sector.beauty",
    emoji: "💄",
    subcategoriesKeys: [
      "Makeup tutorials",
      "Skincare",
      "Hairstyles and hair care",
      "Manicure and nail art",
      "Natural beauty products",
      "Beauty routines",
      "Special occasion makeup",
      "Anti-aging care",
      "Beauty for different skin tones",
      "DIY beauty products"
    ]
  },
  {
    icon: Users,
    titleKey: "sector.weddings",
    emoji: "👰",
    subcategoriesKeys: [
      "Wedding dresses",
      "Wedding decoration",
      "Centerpieces",
      "Wedding invitations",
      "Bridal hairstyles",
      "Wedding flowers",
      "Wedding cakes",
      "Birthday parties",
      "Baby showers",
      "Graduations and celebrations"
    ]
  },
  {
    icon: Baby,
    titleKey: "sector.maternity",
    emoji: "👶",
    subcategoriesKeys: [
      "Nursery decoration",
      "Baby clothes",
      "Kids activities",
      "Family crafts",
      "Baby food",
      "DIY toys",
      "Family organization",
      "Baby photography",
      "Children's party ideas",
      "Maternity products"
    ]
  },
  {
    icon: Car,
    titleKey: "sector.travel",
    emoji: "✈️",
    subcategoriesKeys: [
      "Travel destinations",
      "City guides",
      "Travel tips",
      "Travel outfits",
      "Travel photography",
      "Budget travel",
      "Outdoor adventures",
      "Maps and routes",
      "Hotels and accommodations",
      "Local cuisine"
    ]
  },
  {
    icon: Dumbbell,
    titleKey: "sector.fitness",
    emoji: "💪",
    subcategoriesKeys: [
      "Exercise routines",
      "Yoga and meditation",
      "Home workouts",
      "Fitness motivation",
      "Sportswear",
      "Sports nutrition",
      "Weight training",
      "Cardio and running",
      "Specific exercises",
      "Physical transformations"
    ]
  },
  {
    icon: Heart,
    titleKey: "sector.health",
    emoji: "🧘",
    subcategoriesKeys: [
      "Healthy eating",
      "Detox recipes",
      "Mental health",
      "Healthy habits",
      "Natural remedies",
      "Self-care",
      "Mindfulness",
      "Balanced living",
      "Natural supplements",
      "Alternative therapies"
    ]
  },
  {
    icon: Camera,
    titleKey: "sector.photography",
    emoji: "📸",
    subcategoriesKeys: [
      "Photography techniques",
      "Photo poses",
      "Landscape photography",
      "Portraits and selfies",
      "Product photography",
      "Photo editing",
      "Photography equipment",
      "Mobile photography",
      "Photographic composition",
      "Visual inspiration"
    ]
  }
];

export const getOtherSectors = (t: TranslationFunction) => [
  {
    icon: Briefcase,
    titleKey: "sector.business",
    emoji: "💼",
    subcategoriesKeys: [
      "Digital marketing",
      "Personal branding",
      "Productivity",
      "Networking",
      "Personal finance",
      "Leadership",
      "Startup life",
      "Freelancing",
      "Investments",
      "Professional development"
    ]
  },
  {
    icon: GraduationCap,
    titleKey: "sector.education",
    emoji: "📚",
    subcategoriesKeys: [
      "Study techniques",
      "Languages",
      "Online courses",
      "New skills",
      "Certifications",
      "Personal development",
      "Reading",
      "Writing",
      "Mathematics",
      "Sciences"
    ]
  },
  {
    icon: Palette,
    titleKey: "sector.art",
    emoji: "🎨",
    subcategoriesKeys: [
      "Painting and drawing",
      "Crafts",
      "Scrapbooking",
      "Calligraphy",
      "Ceramics",
      "Knitting and embroidery",
      "Handmade jewelry",
      "Graphic design",
      "Digital illustration",
      "Abstract art"
    ]
  },
  {
    icon: Monitor,
    titleKey: "sector.technology",
    emoji: "💻",
    subcategoriesKeys: [
      "Gadgets and devices",
      "Useful apps",
      "Desktop setup",
      "Gaming setup",
      "Tech reviews",
      "Programming",
      "Artificial intelligence",
      "Technological innovation",
      "Smartphones",
      "Tech accessories"
    ]
  },
  {
    icon: Leaf,
    titleKey: "sector.garden",
    emoji: "🌱",
    subcategoriesKeys: [
      "Indoor plants",
      "Gardening",
      "Plant care",
      "Urban gardens",
      "Succulent plants",
      "Garden design",
      "Medicinal plants",
      "Pots and decoration",
      "Plant propagation",
      "Vertical gardens"
    ]
  },
  {
    icon: Gift,
    titleKey: "sector.gifts",
    emoji: "🎁",
    subcategoriesKeys: [
      "Gift ideas",
      "DIY gifts",
      "Birthdays",
      "Christmas",
      "Valentine's Day",
      "Mother's/Father's Day",
      "Anniversaries",
      "Graduations",
      "Personalized gifts",
      "Creative wrapping"
    ]
  }
];

export const getNicheSectors = (t: TranslationFunction) => [
  {
    icon: Heart,
    titleKey: "sector.pets",
    emoji: "🐕",
    subcategoriesKeys: [
      "Dog care",
      "Cat care",
      "Pet accessories",
      "Pet training",
      "DIY for pets",
      "Animal nutrition",
      "Veterinary health",
      "Pet photography",
      "Travel with pets",
      "Exotic pets"
    ]
  },
  {
    icon: Car,
    titleKey: "sector.automotive",
    emoji: "🚗",
    subcategoriesKeys: [
      "Classic cars",
      "Vehicle modifications",
      "Automotive maintenance",
      "Motorcycles",
      "Car accessories",
      "Electric cars",
      "Tuning and customization",
      "Road trips",
      "Road safety",
      "Luxury cars"
    ]
  },
  {
    icon: Dumbbell,
    titleKey: "sector.sports",
    emoji: "⚽",
    subcategoriesKeys: [
      "Training routines",
      "Sports equipment",
      "Sports nutrition",
      "Specific sports (soccer, tennis, swimming)",
      "Women's fitness",
      "Functional training",
      "Extreme sports",
      "Sports rehabilitation",
      "Fitness motivation",
      "Sportswear"
    ]
  },
  {
    icon: Music,
    titleKey: "sector.music",
    emoji: "🎵",
    subcategoriesKeys: [
      "Musical instruments",
      "Music production",
      "Festivals and concerts",
      "Vinyl and collecting",
      "Audio equipment",
      "Music learning",
      "Music genres",
      "Artists and bands",
      "Home studio",
      "Karaoke and entertainment"
    ]
  },
  {
    icon: BookOpen,
    titleKey: "sector.literature",
    emoji: "📖",
    subcategoriesKeys: [
      "Book reviews",
      "Library organization",
      "Book clubs and reading communities",
      "Creative writing",
      "Literary genres",
      "Children's books",
      "Bookstagram and book photography",
      "Inspirational quotes",
      "Authors and biographies",
      "E-books and digital reading"
    ]
  },
  {
    icon: Gamepad2,
    titleKey: "sector.gaming",
    emoji: "🎮",
    subcategoriesKeys: [
      "Video games",
      "Board games",
      "Puzzles",
      "Card games",
      "Gaming setup",
      "Cosplay and costumes",
      "Streaming and content",
      "Tournaments and competitions",
      "Gaming collectibles",
      "Retro games"
    ]
  },
  {
    icon: Monitor,
    titleKey: "sector.techGadgets",
    emoji: "📱",
    subcategoriesKeys: [
      "Home gadgets",
      "Wearable technology",
      "Mobile accessories",
      "Home office setup",
      "Gaming and entertainment",
      "Photography and cameras",
      "Educational technology",
      "Apps and software",
      "Technological innovations",
      "Vintage electronics"
    ]
  },
  {
    icon: Globe,
    titleKey: "sector.history",
    emoji: "🏛️",
    subcategoriesKeys: [
      "Ancient history",
      "World cultures",
      "Historical monuments",
      "Historical art",
      "Cultural traditions",
      "Mythology and legends",
      "Archaeology",
      "Museums and heritage",
      "Historical biographies",
      "Historical events"
    ]
  },
  {
    icon: Leaf,
    titleKey: "sector.sustainability",
    emoji: "🌍",
    subcategoriesKeys: [
      "Zero waste living",
      "Eco-friendly products",
      "Renewable energy",
      "Recycling and reuse",
      "Sustainable fashion",
      "Organic food",
      "Sustainable transportation",
      "Eco-friendly home",
      "Natural cosmetics",
      "Environmental activism"
    ]
  },
  {
    icon: Camera,
    titleKey: "sector.photographyNiche",
    emoji: "📸",
    subcategoriesKeys: [
      "Photography techniques",
      "Equipment and accessories",
      "Photo editing",
      "Landscape photography",
      "Portraits and people photography",
      "Product photography",
      "Street photography",
      "Wedding photography",
      "Macro photography",
      "Night photography"
    ]
  },
  {
    icon: Calendar,
    titleKey: "sector.planning",
    emoji: "📅",
    subcategoriesKeys: [
      "Bullet journaling",
      "Planners and agendas",
      "Home organization",
      "Personal productivity",
      "Time management",
      "Event organization",
      "Filing systems",
      "Minimalism and decluttering",
      "Daily routines",
      "Goals and objectives"
    ]
  },
  {
    icon: Heart,
    titleKey: "sector.psychology",
    emoji: "🧠",
    subcategoriesKeys: [
      "Self-esteem and confidence",
      "Emotional intelligence",
      "Mindfulness and meditation",
      "Healthy habits",
      "Personal motivation",
      "Interpersonal relationships",
      "Stress management",
      "Personal growth",
      "Therapy and mental wellness",
      "Life coaching"
    ]
  }
];