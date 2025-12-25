import { Category } from "@/services/api";

export const categories: Category[] = [
  {
    id: "1",
    name: "Humanities",
    slug: "humanities",
    description: "Explore the breadth of human culture, history, and thought through our humanities collection.",
    icon: "📚",
    bookCount: 245,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
    subcategories: [
      { id: "1-1", name: "History", slug: "history", description: "Historical studies and analysis", icon: "📜", bookCount: 89 },
      { id: "1-2", name: "Philosophy", slug: "philosophy", description: "Philosophical works and treatises", icon: "🤔", bookCount: 67 },
      { id: "1-3", name: "Literature", slug: "literature", description: "Literary criticism and theory", icon: "📖", bookCount: 89 },
    ]
  },
  {
    id: "2",
    name: "Social Sciences",
    slug: "social-sciences",
    description: "Understanding society through rigorous academic research and analysis.",
    icon: "🌍",
    bookCount: 189,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    subcategories: [
      { id: "2-1", name: "Sociology", slug: "sociology", description: "Study of society and social behavior", icon: "👥", bookCount: 56 },
      { id: "2-2", name: "Political Science", slug: "political-science", description: "Political systems and governance", icon: "🏛️", bookCount: 45 },
      { id: "2-3", name: "Economics", slug: "economics", description: "Economic theory and practice", icon: "📊", bookCount: 48 },
      { id: "2-4", name: "Psychology", slug: "psychology", description: "Human behavior and mental processes", icon: "🧠", bookCount: 40 },
    ]
  },
  {
    id: "3",
    name: "Science & Technology",
    slug: "science-technology",
    description: "Cutting-edge research and developments in science and technology.",
    icon: "🔬",
    bookCount: 156,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
    subcategories: [
      { id: "3-1", name: "Computer Science", slug: "computer-science", description: "Computing and information technology", icon: "💻", bookCount: 45 },
      { id: "3-2", name: "Engineering", slug: "engineering", description: "Engineering disciplines and applications", icon: "⚙️", bookCount: 38 },
      { id: "3-3", name: "Biology", slug: "biology", description: "Life sciences and biological research", icon: "🧬", bookCount: 42 },
      { id: "3-4", name: "Physics", slug: "physics", description: "Physical sciences and astronomy", icon: "⚛️", bookCount: 31 },
    ]
  },
  {
    id: "4",
    name: "Arts & Media",
    slug: "arts-media",
    description: "Creative expressions, visual arts, and media studies.",
    icon: "🎨",
    bookCount: 134,
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop",
    subcategories: [
      { id: "4-1", name: "Fine Arts", slug: "fine-arts", description: "Painting, sculpture, and visual arts", icon: "🖼️", bookCount: 45 },
      { id: "4-2", name: "Film Studies", slug: "film-studies", description: "Cinema and film analysis", icon: "🎬", bookCount: 32 },
      { id: "4-3", name: "Music", slug: "music", description: "Musicology and music theory", icon: "🎵", bookCount: 28 },
      { id: "4-4", name: "Architecture", slug: "architecture", description: "Architectural design and history", icon: "🏗️", bookCount: 29 },
    ]
  },
  {
    id: "5",
    name: "Law & Politics",
    slug: "law-politics",
    description: "Legal studies, governance, and political analysis.",
    icon: "⚖️",
    bookCount: 112,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
    subcategories: [
      { id: "5-1", name: "Constitutional Law", slug: "constitutional-law", description: "Constitutional studies and jurisprudence", icon: "📜", bookCount: 34 },
      { id: "5-2", name: "International Law", slug: "international-law", description: "International relations and law", icon: "🌐", bookCount: 42 },
      { id: "5-3", name: "Criminal Law", slug: "criminal-law", description: "Criminal justice and criminology", icon: "🔒", bookCount: 36 },
    ]
  },
  {
    id: "6",
    name: "Education",
    slug: "education",
    description: "Teaching methodologies, educational research, and learning sciences.",
    icon: "🎓",
    bookCount: 98,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    subcategories: [
      { id: "6-1", name: "Higher Education", slug: "higher-education", description: "University and college education", icon: "🏫", bookCount: 35 },
      { id: "6-2", name: "Pedagogy", slug: "pedagogy", description: "Teaching methods and practice", icon: "📝", bookCount: 33 },
      { id: "6-3", name: "Educational Technology", slug: "educational-technology", description: "Technology in education", icon: "📱", bookCount: 30 },
    ]
  },
  {
    id: "7",
    name: "Health & Medicine",
    slug: "health-medicine",
    description: "Medical research, healthcare, and wellness publications.",
    icon: "🏥",
    bookCount: 87,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
    subcategories: [
      { id: "7-1", name: "Public Health", slug: "public-health", description: "Community health and epidemiology", icon: "🩺", bookCount: 32 },
      { id: "7-2", name: "Nursing", slug: "nursing", description: "Nursing practice and research", icon: "👩‍⚕️", bookCount: 28 },
      { id: "7-3", name: "Mental Health", slug: "mental-health", description: "Psychiatry and mental wellness", icon: "🧘", bookCount: 27 },
    ]
  },
  {
    id: "8",
    name: "Language & Linguistics",
    slug: "language-linguistics",
    description: "Study of language, linguistics, and communication.",
    icon: "💬",
    bookCount: 76,
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop",
    subcategories: [
      { id: "8-1", name: "Applied Linguistics", slug: "applied-linguistics", description: "Practical language applications", icon: "🗣️", bookCount: 28 },
      { id: "8-2", name: "Translation Studies", slug: "translation-studies", description: "Translation theory and practice", icon: "🔄", bookCount: 24 },
      { id: "8-3", name: "Sociolinguistics", slug: "sociolinguistics", description: "Language in society", icon: "👥", bookCount: 24 },
    ]
  },
];

// Simple categories for backward compatibility
export const simpleCategories = [
  { name: "Humanities", icon: "📚", count: 245, description: "History, philosophy, and literature" },
  { name: "Social Sciences", icon: "🌍", count: 189, description: "Sociology, politics, and economics" },
  { name: "Science & Technology", icon: "🔬", count: 156, description: "Computer science, engineering, and biology" },
  { name: "Arts & Media", icon: "🎨", count: 134, description: "Fine arts, film, and music" },
  { name: "Law & Politics", icon: "⚖️", count: 112, description: "Legal studies and governance" },
  { name: "Education", icon: "🎓", count: 98, description: "Teaching and learning sciences" },
  { name: "Health & Medicine", icon: "🏥", count: 87, description: "Medical research and healthcare" },
  { name: "Language & Linguistics", icon: "💬", count: 76, description: "Language studies and communication" },
];
