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
      "subcategory.livingRoomDecoration",
      "subcategory.bedroomDesign", 
      "subcategory.kitchenDecoration",
      "subcategory.bathroomsAndSmallSpaces",
      "subcategory.seasonalDecoration",
      "subcategory.diyHomeProjects",
      "subcategory.recycledFurniture",
      "subcategory.homeOrganization",
      "subcategory.budgetDecoration",
      "subcategory.homeStyles"
    ]
  },
  {
    icon: ChefHat,
    titleKey: "sector.recipes",
    emoji: "🍲",
    subcategoriesKeys: [
      "subcategory.healthyRecipes",
      "subcategory.quickAndEasyFood",
      "subcategory.dessertsAndBaking",
      "subcategory.mealPrepAndPlanning",
      "subcategory.veganAndVegetarian",
      "subcategory.glutenFreeRecipes",
      "subcategory.internationalCuisine",
      "subcategory.drinksAndCocktails",
      "subcategory.specialOccasionRecipes",
      "subcategory.cookingTechniques"
    ]
  },
  {
    icon: Shirt,
    titleKey: "sector.fashion",
    emoji: "👗",
    subcategoriesKeys: [
      "subcategory.casualOutfits",
      "subcategory.formalAndOfficeWear",
      "subcategory.seasonalFashion",
      "subcategory.capsuleWardrobe",
      "subcategory.sustainableFashion",
      "subcategory.accessoriesAndJewelry",
      "subcategory.shoesAndBags",
      "subcategory.fashionForBodyTypes",
      "subcategory.fashionTrends",
      "subcategory.specialOccasionLooks"
    ]
  },
  {
    icon: Sparkles,
    titleKey: "sector.beauty",
    emoji: "💄",
    subcategoriesKeys: [
      "subcategory.makeupTutorials",
      "subcategory.skincare",
      "subcategory.hairstylesAndCare",
      "subcategory.manicureAndNailArt",
      "subcategory.naturalBeautyProducts",
      "subcategory.beautyRoutines",
      "subcategory.specialOccasionMakeup",
      "subcategory.antiAgingCare",
      "subcategory.beautyForSkinTones",
      "subcategory.diyBeautyProducts"
    ]
  },
  {
    icon: Users,
    titleKey: "sector.weddings",
    emoji: "👰",
    subcategoriesKeys: [
      "subcategory.weddingDresses",
      "subcategory.weddingDecoration",
      "subcategory.centerpieces",
      "subcategory.weddingInvitations",
      "subcategory.bridalHairstyles",
      "subcategory.weddingFlowers",
      "subcategory.weddingCakes",
      "subcategory.birthdayParties",
      "subcategory.babyShowers",
      "subcategory.graduationsAndCelebrations"
    ]
  },
  {
    icon: Baby,
    titleKey: "sector.maternity",
    emoji: "👶",
    subcategoriesKeys: [
      "subcategory.nurseryDecoration",
      "subcategory.babyClothes",
      "subcategory.kidsActivities",
      "subcategory.familyCrafts",
      "subcategory.babyFood",
      "subcategory.diyToys",
      "subcategory.familyOrganization",
      "subcategory.babyPhotography",
      "subcategory.childrenPartyIdeas",
      "subcategory.maternityProducts"
    ]
  },
  {
    icon: Car,
    titleKey: "sector.travel",
    emoji: "✈️",
    subcategoriesKeys: [
      "subcategory.travelDestinations",
      "subcategory.cityGuides",
      "subcategory.travelTips",
      "subcategory.travelOutfits",
      "subcategory.travelPhotography",
      "subcategory.budgetTravel",
      "subcategory.outdoorAdventures",
      "subcategory.mapsAndRoutes",
      "subcategory.hotelsAndAccommodations",
      "subcategory.localCuisine"
    ]
  },
  {
    icon: Dumbbell,
    titleKey: "sector.fitness",
    emoji: "💪",
    subcategoriesKeys: [
      "subcategory.exerciseRoutines",
      "subcategory.yogaAndMeditation",
      "subcategory.homeWorkouts",
      "subcategory.fitnessMotivation",
      "subcategory.sportswear",
      "subcategory.sportsNutrition",
      "subcategory.weightTraining",
      "subcategory.cardioAndRunning",
      "subcategory.specificExercises",
      "subcategory.physicalTransformations"
    ]
  },
  {
    icon: Heart,
    titleKey: "sector.health",
    emoji: "🧘",
    subcategoriesKeys: [
      "subcategory.healthyEating",
      "subcategory.detoxRecipes",
      "subcategory.mentalHealth",
      "subcategory.healthyHabits",
      "subcategory.naturalRemedies",
      "subcategory.selfCare",
      "subcategory.mindfulness",
      "subcategory.balancedLiving",
      "subcategory.naturalSupplements",
      "subcategory.alternativeTherapies"
    ]
  },
  {
    icon: Camera,
    titleKey: "sector.photography",
    emoji: "📸",
    subcategoriesKeys: [
      "subcategory.photographyTechniques",
      "subcategory.photoPoses",
      "subcategory.landscapePhotography",
      "subcategory.portraitsAndSelfies",
      "subcategory.productPhotography",
      "subcategory.photoEditing",
      "subcategory.photographyEquipment",
      "subcategory.mobilePhotography",
      "subcategory.photographicComposition",
      "subcategory.visualInspiration"
    ]
  }
];

export const getOtherSectors = (t: TranslationFunction) => [
  {
    icon: Briefcase,
    titleKey: "sector.business",
    emoji: "💼",
    subcategoriesKeys: [
      "subcategory.digitalMarketing",
      "subcategory.personalBranding",
      "subcategory.productivity",
      "subcategory.networking",
      "subcategory.personalFinance",
      "subcategory.leadership",
      "subcategory.startupLife",
      "subcategory.freelancing",
      "subcategory.investments",
      "subcategory.professionalDevelopment"
    ]
  },
  {
    icon: GraduationCap,
    titleKey: "sector.education",
    emoji: "📚",
    subcategoriesKeys: [
      "subcategory.studyTechniques",
      "subcategory.languages",
      "subcategory.onlineCourses",
      "subcategory.newSkills",
      "subcategory.certifications",
      "subcategory.personalDevelopment",
      "subcategory.reading",
      "subcategory.writing",
      "subcategory.mathematics",
      "subcategory.sciences"
    ]
  },
  {
    icon: Palette,
    titleKey: "sector.art",
    emoji: "🎨",
    subcategoriesKeys: [
      "subcategory.paintingAndDrawing",
      "subcategory.crafts",
      "subcategory.scrapbooking",
      "subcategory.calligraphy",
      "subcategory.ceramics",
      "subcategory.knittingAndEmbroidery",
      "subcategory.handmadeJewelry",
      "subcategory.graphicDesign",
      "subcategory.digitalIllustration",
      "subcategory.abstractArt"
    ]
  },
  {
    icon: Monitor,
    titleKey: "sector.technology",
    emoji: "💻",
    subcategoriesKeys: [
      "subcategory.gadgetsAndDevices",
      "subcategory.usefulApps",
      "subcategory.desktopSetup",
      "subcategory.gamingSetup",
      "subcategory.techReviews",
      "subcategory.programming",
      "subcategory.artificialIntelligence",
      "subcategory.technologicalInnovation",
      "subcategory.smartphones",
      "subcategory.techAccessories"
    ]
  },
  {
    icon: Leaf,
    titleKey: "sector.garden",
    emoji: "🌱",
    subcategoriesKeys: [
      "subcategory.indoorPlants",
      "subcategory.gardening",
      "subcategory.plantCare",
      "subcategory.urbanGardens",
      "subcategory.succulentPlants",
      "subcategory.gardenDesign",
      "subcategory.medicinalPlants",
      "subcategory.potsAndDecoration",
      "subcategory.plantPropagation",
      "subcategory.verticalGardens"
    ]
  },
  {
    icon: Gift,
    titleKey: "sector.gifts",
    emoji: "🎁",
    subcategoriesKeys: [
      "subcategory.giftIdeas",
      "subcategory.diyGifts",
      "subcategory.birthdays",
      "subcategory.christmas",
      "subcategory.valentinesDay",
      "subcategory.mothersAndFathersDay",
      "subcategory.anniversaries",
      "subcategory.graduations",
      "subcategory.personalizedGifts",
      "subcategory.creativeWrapping"
    ]
  }
];

export const getNicheSectors = (t: TranslationFunction) => [
  {
    icon: Heart,
    titleKey: "sector.pets",
    emoji: "🐕",
    subcategoriesKeys: [
      "subcategory.dogCare",
      "subcategory.catCare",
      "subcategory.petAccessories",
      "subcategory.petTraining",
      "subcategory.diyForPets",
      "subcategory.animalNutrition",
      "subcategory.veterinaryHealth",
      "subcategory.petPhotography",
      "subcategory.travelWithPets",
      "subcategory.exoticPets"
    ]
  },
  {
    icon: Car,
    titleKey: "sector.automotive",
    emoji: "🚗",
    subcategoriesKeys: [
      "subcategory.classicCars",
      "subcategory.vehicleModifications",
      "subcategory.automotiveMaintenance",
      "subcategory.motorcycles",
      "subcategory.carAccessories",
      "subcategory.electricCars",
      "subcategory.tuningAndCustomization",
      "subcategory.roadTrips",
      "subcategory.roadSafety",
      "subcategory.luxuryCars"
    ]
  },
  {
    icon: Dumbbell,
    titleKey: "sector.sports",
    emoji: "⚽",
    subcategoriesKeys: [
      "subcategory.trainingRoutines",
      "subcategory.sportsEquipment",
      "subcategory.sportsNutrition",
      "subcategory.specificSports",
      "subcategory.womensFitness",
      "subcategory.functionalTraining",
      "subcategory.extremeSports",
      "subcategory.sportsRehabilitation",
      "subcategory.fitnessMotivation",
      "subcategory.sportswear"
    ]
  },
  {
    icon: Music,
    titleKey: "sector.music",
    emoji: "🎵",
    subcategoriesKeys: [
      "subcategory.musicalInstruments",
      "subcategory.musicProduction",
      "subcategory.festivalsAndConcerts",
      "subcategory.vinylAndCollecting",
      "subcategory.audioEquipment",
      "subcategory.musicLearning",
      "subcategory.musicGenres",
      "subcategory.artistsAndBands",
      "subcategory.homeStudio",
      "subcategory.karaokeAndEntertainment"
    ]
  },
  {
    icon: BookOpen,
    titleKey: "sector.literature",
    emoji: "📖",
    subcategoriesKeys: [
      "subcategory.bookReviews",
      "subcategory.libraryOrganization",
      "subcategory.bookClubs",
      "subcategory.creativeWriting",
      "subcategory.literaryGenres",
      "subcategory.childrensBooks",
      "subcategory.bookstagram",
      "subcategory.inspirationalQuotes",
      "subcategory.authorsAndBiographies",
      "subcategory.ebooksAndDigitalReading"
    ]
  },
  {
    icon: Gamepad2,
    titleKey: "sector.gaming",
    emoji: "🎮",
    subcategoriesKeys: [
      "subcategory.videoGames",
      "subcategory.boardGames",
      "subcategory.puzzles",
      "subcategory.cardGames",
      "subcategory.gamingSetup",
      "subcategory.cosplayAndCostumes",
      "subcategory.streamingAndContent",
      "subcategory.tournamentsAndCompetitions",
      "subcategory.gamingCollectibles",
      "subcategory.retroGames"
    ]
  },
  {
    icon: Monitor,
    titleKey: "sector.techGadgets",
    emoji: "📱",
    subcategoriesKeys: [
      "subcategory.homeGadgets",
      "subcategory.wearableTechnology",
      "subcategory.mobileAccessories",
      "subcategory.homeOfficeSetup",
      "subcategory.gamingAndEntertainment",
      "subcategory.photographyAndCameras",
      "subcategory.educationalTechnology",
      "subcategory.appsAndSoftware",
      "subcategory.technologicalInnovations",
      "subcategory.vintageElectronics"
    ]
  },
  {
    icon: Globe,
    titleKey: "sector.history",
    emoji: "🏛️",
    subcategoriesKeys: [
      "subcategory.ancientHistory",
      "subcategory.worldCultures",
      "subcategory.historicalMonuments",
      "subcategory.historicalArt",
      "subcategory.culturalTraditions",
      "subcategory.mythologyAndLegends",
      "subcategory.archaeology",
      "subcategory.museumsAndHeritage",
      "subcategory.historicalBiographies",
      "subcategory.historicalEvents"
    ]
  },
  {
    icon: Leaf,
    titleKey: "sector.sustainability",
    emoji: "🌍",
    subcategoriesKeys: [
      "subcategory.zeroWasteLiving",
      "subcategory.ecoFriendlyProducts",
      "subcategory.renewableEnergy",
      "subcategory.recyclingAndReuse",
      "subcategory.sustainableFashion",
      "subcategory.organicFood",
      "subcategory.sustainableTransportation",
      "subcategory.ecoFriendlyHome",
      "subcategory.naturalCosmetics",
      "subcategory.environmentalActivism"
    ]
  },
  {
    icon: Camera,
    titleKey: "sector.photographyNiche",
    emoji: "📸",
    subcategoriesKeys: [
      "subcategory.photographyTechniques",
      "subcategory.equipmentAndAccessories",
      "subcategory.photoEditing",
      "subcategory.landscapePhotography",
      "subcategory.portraitsAndSelfies",
      "subcategory.productPhotography",
      "subcategory.streetPhotography",
      "subcategory.weddingPhotography",
      "subcategory.macroPhotography",
      "subcategory.nightPhotography"
    ]
  },
  {
    icon: Calendar,
    titleKey: "sector.planning",
    emoji: "📅",
    subcategoriesKeys: [
      "subcategory.bulletJournaling",
      "subcategory.plannersAndAgendas",
      "subcategory.homeOrganization",
      "subcategory.productivity",
      "subcategory.timeManagement",
      "subcategory.eventOrganization",
      "subcategory.filingSystems",
      "subcategory.minimalismAndDecluttering",
      "subcategory.dailyRoutines",
      "subcategory.goalsAndObjectives"
    ]
  },
  {
    icon: Heart,
    titleKey: "sector.psychology",
    emoji: "🧠",
    subcategoriesKeys: [
      "subcategory.selfEsteemAndConfidence",
      "subcategory.emotionalIntelligence",
      "subcategory.mindfulness",
      "subcategory.healthyHabits",
      "subcategory.personalMotivation",
      "subcategory.interpersonalRelationships",
      "subcategory.stressManagement",
      "subcategory.personalGrowth",
      "subcategory.therapyAndMentalWellness",
      "subcategory.lifeCoaching"
    ]
  }
];