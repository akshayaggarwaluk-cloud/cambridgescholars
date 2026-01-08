import { Category } from "@/services/api";

export const categories: Category[] = [
  {
    id: "1",
    name: "Social Sciences",
    slug: "social-sciences",
    description: "Sociology, politics, economics, and human behavior studies",
    icon: "🌍",
    bookCount: 189,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    subcategories: [
      { id: "1-1", name: "Sociology", slug: "sociology", description: "Study of society and social behavior", icon: "👥", bookCount: 56 },
      { id: "1-2", name: "Political Science", slug: "political-science", description: "Political systems and governance", icon: "🏛️", bookCount: 45 },
      { id: "1-3", name: "Economics", slug: "economics", description: "Economic theory and practice", icon: "📊", bookCount: 52 },
      { id: "1-4", name: "Psychology", slug: "psychology", description: "Study of mind and behavior", icon: "🧠", bookCount: 36 },
    ],
  },
  {
    id: "2",
    name: "Physical Sciences",
    slug: "physical-sciences",
    description: "Physics, chemistry, mathematics, and engineering",
    icon: "🔬",
    bookCount: 156,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
    subcategories: [
      { id: "2-1", name: "Physics", slug: "physics", description: "Study of matter, energy, and forces", icon: "⚛️", bookCount: 45 },
      { id: "2-2", name: "Chemistry", slug: "chemistry", description: "Study of substances and reactions", icon: "🧪", bookCount: 38 },
      { id: "2-3", name: "Mathematics", slug: "mathematics", description: "Mathematical theory and applications", icon: "📐", bookCount: 42 },
      { id: "2-4", name: "Engineering", slug: "engineering", description: "Engineering disciplines and applications", icon: "⚙️", bookCount: 31 },
    ],
  },
  {
    id: "3",
    name: "Health Science",
    slug: "health-science",
    description: "Medicine, nursing, public health, and clinical research",
    icon: "🏥",
    bookCount: 134,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
    subcategories: [
      { id: "3-1", name: "Medicine", slug: "medicine", description: "Medical research and practice", icon: "⚕️", bookCount: 45 },
      { id: "3-2", name: "Nursing", slug: "nursing", description: "Nursing practice and research", icon: "👩‍⚕️", bookCount: 32 },
      { id: "3-3", name: "Public Health", slug: "public-health", description: "Community health and epidemiology", icon: "🩺", bookCount: 28 },
      { id: "3-4", name: "Clinical Research", slug: "clinical-research", description: "Clinical trials and research", icon: "📋", bookCount: 29 },
    ],
  },
  {
    id: "4",
    name: "Life Sciences",
    slug: "life-sciences",
    description: "Biology, ecology, genetics, and environmental studies",
    icon: "🌿",
    bookCount: 112,
    image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&h=600&fit=crop",
    subcategories: [
      { id: "4-1", name: "Biology", slug: "biology", description: "Study of living organisms", icon: "🧬", bookCount: 34 },
      { id: "4-2", name: "Ecology", slug: "ecology", description: "Study of ecosystems and environment", icon: "🌳", bookCount: 28 },
      { id: "4-3", name: "Genetics", slug: "genetics", description: "Study of genes and heredity", icon: "🔬", bookCount: 26 },
      { id: "4-4", name: "Environmental Studies", slug: "environmental-studies", description: "Environmental science and conservation", icon: "🌍", bookCount: 24 },
    ],
  },
];

// Simple categories for backward compatibility
export const simpleCategories = [
  { name: "Social Sciences", icon: "🌍", count: 189, description: "Sociology, politics, and economics" },
  { name: "Physical Sciences", icon: "🔬", count: 156, description: "Physics, chemistry, and mathematics" },
  { name: "Health Science", icon: "🏥", count: 134, description: "Medicine, nursing, and public health" },
  { name: "Life Sciences", icon: "🌿", count: 112, description: "Biology, ecology, and genetics" },
];
