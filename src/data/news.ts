import { NewsArticle } from "@/services/api";

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "New Academic Publishing Standards for 2024",
    slug: "new-academic-publishing-standards-2024",
    excerpt: "The academic publishing landscape is evolving with new standards for open access, peer review, and digital distribution.",
    content: `
      <p>The academic publishing industry is undergoing significant transformations as we enter 2024. New standards are being implemented across the board to improve accessibility, transparency, and the overall quality of scholarly communication.</p>
      
      <h2>Open Access Initiatives</h2>
      <p>Major funding bodies are now requiring open access publication for all research they support. This shift is democratizing access to academic knowledge and accelerating the pace of scientific discovery.</p>
      
      <h2>Enhanced Peer Review</h2>
      <p>New peer review models are being adopted, including open peer review and post-publication review, to ensure more rigorous quality control while reducing bias.</p>
      
      <h2>Digital-First Publishing</h2>
      <p>Publishers are increasingly adopting digital-first strategies, with print becoming secondary. This approach allows for richer multimedia content and faster dissemination.</p>
    `,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=400&fit=crop",
    category: "Social Sciences",
    author: "Editorial Team",
    publishedAt: "2024-01-15T10:00:00Z",
    tags: ["Publishing", "Open Access", "Academic Standards"],
    featured: true
  },
  {
    id: "2",
    title: "Cambridge Scholars Announces Spring 2024 Catalog",
    slug: "spring-2024-catalog-announcement",
    excerpt: "Our spring catalog features over 150 new titles across humanities, social sciences, and STEM disciplines.",
    content: `
      <p>We are thrilled to announce the release of our Spring 2024 catalog, featuring an exceptional collection of scholarly works from leading academics worldwide.</p>
      
      <h2>Highlights</h2>
      <p>This season's catalog includes groundbreaking works in artificial intelligence ethics, climate policy, contemporary literature, and global health. Each title has undergone our rigorous peer review process to ensure the highest scholarly standards.</p>
      
      <h2>Featured Authors</h2>
      <p>We are honored to publish works by several distinguished scholars, including multiple award-winning researchers from prestigious institutions across North America, Europe, and Asia.</p>
    `,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    category: "Physical Sciences",
    author: "Publishing Team",
    publishedAt: "2024-01-10T09:00:00Z",
    tags: ["Catalog", "New Releases", "Spring 2024"],
    featured: true
  },
  {
    id: "3",
    title: "Interview with Award-Winning Historian Dr. Sarah Mitchell",
    slug: "interview-dr-sarah-mitchell",
    excerpt: "Dr. Mitchell discusses her latest book on 20th-century European transformations and the importance of historical perspective.",
    content: `
      <p>In this exclusive interview, we speak with Dr. Sarah Mitchell about her award-winning research and her approach to making history accessible to broader audiences.</p>
      
      <h2>On Her Latest Work</h2>
      <p>"I wanted to show how interconnected European history is with global events. The transformations of the 20th century didn't happen in isolation—they were shaped by colonialism, migration, and technological change."</p>
      
      <h2>Advice for Aspiring Historians</h2>
      <p>"Read widely, beyond your specialization. The best historical insights often come from unexpected connections between different fields and periods."</p>
    `,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=400&fit=crop",
    category: "Social Sciences",
    author: "Interview by James Wilson",
    publishedAt: "2024-01-05T14:00:00Z",
    tags: ["Interview", "History", "Author Spotlight"],
    featured: true
  },
  {
    id: "4",
    title: "The Future of Academic Libraries in the Digital Age",
    slug: "future-academic-libraries-digital-age",
    excerpt: "How libraries are adapting to serve researchers and students in an increasingly digital academic environment.",
    content: `
      <p>Academic libraries are undergoing a fundamental transformation as they adapt to the digital age. This article explores the trends shaping the future of scholarly resources and services.</p>
      
      <h2>Digital Collections</h2>
      <p>Libraries are expanding their digital collections, providing access to e-books, journals, and databases that researchers can access from anywhere in the world.</p>
      
      <h2>Research Support Services</h2>
      <p>Beyond housing collections, libraries are becoming hubs for research support, offering data management services, publishing assistance, and specialized research consultations.</p>
    `,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop",
    category: "Life Sciences",
    author: "Dr. Emma Richardson",
    publishedAt: "2024-01-03T11:00:00Z",
    tags: ["Libraries", "Digital Transformation", "Research"]
  },
  {
    id: "5",
    title: "Grant Writing Workshop: Tips for Academic Authors",
    slug: "grant-writing-workshop-tips",
    excerpt: "Essential strategies for securing research funding and crafting compelling grant proposals.",
    content: `
      <p>Securing research funding is crucial for academic success. This guide provides essential tips for writing compelling grant proposals that stand out.</p>
      
      <h2>Understanding Your Audience</h2>
      <p>Before writing, thoroughly research the funding body's priorities and past awards. Tailor your proposal to align with their mission and interests.</p>
      
      <h2>Crafting Your Narrative</h2>
      <p>Tell a compelling story about why your research matters. Connect your work to broader societal challenges and demonstrate potential impact.</p>
      
      <h2>Budget Planning</h2>
      <p>Be realistic and detailed in your budget. Reviewers appreciate proposals that show careful financial planning and cost-effectiveness.</p>
    `,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop",
    category: "Health Science",
    author: "Academic Services Team",
    publishedAt: "2023-12-28T10:00:00Z",
    tags: ["Grant Writing", "Funding", "Academic Writing"]
  },
  {
    id: "6",
    title: "Celebrating Excellence: Annual Academic Achievement Awards",
    slug: "annual-academic-achievement-awards",
    excerpt: "Recognizing outstanding contributions to scholarship across disciplines at our annual awards ceremony.",
    content: `
      <p>We are proud to celebrate the exceptional achievements of authors and researchers at our annual Academic Achievement Awards.</p>
      
      <h2>Award Categories</h2>
      <p>This year's awards recognized excellence in research monographs, edited collections, breakthrough research, and contributions to public scholarship.</p>
      
      <h2>This Year's Winners</h2>
      <p>Congratulations to all winners, whose work exemplifies the highest standards of scholarly excellence and innovation.</p>
    `,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    category: "Physical Sciences",
    author: "Events Team",
    publishedAt: "2023-12-20T15:00:00Z",
    tags: ["Awards", "Recognition", "Academic Excellence"]
  },
  {
    id: "7",
    title: "Understanding Impact Factor and Citation Metrics",
    slug: "understanding-impact-factor-citation-metrics",
    excerpt: "A comprehensive guide to academic metrics and their role in evaluating scholarly work.",
    content: `
      <p>Academic metrics play an important role in evaluating research impact, but they must be understood in context.</p>
      
      <h2>What is Impact Factor?</h2>
      <p>Impact factor measures the average number of citations received by articles published in a journal. While widely used, it has important limitations.</p>
      
      <h2>Alternative Metrics</h2>
      <p>New metrics like h-index, Altmetric scores, and download statistics provide additional perspectives on research impact and reach.</p>
    `,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    category: "Life Sciences",
    author: "Dr. Michael Torres",
    publishedAt: "2023-12-15T09:00:00Z",
    tags: ["Metrics", "Citation", "Research Impact"]
  },
  {
    id: "8",
    title: "Sustainable Publishing: Our Environmental Commitment",
    slug: "sustainable-publishing-environmental-commitment",
    excerpt: "How we're reducing our environmental footprint through sustainable publishing practices.",
    content: `
      <p>As publishers, we have a responsibility to minimize our environmental impact while continuing to disseminate knowledge.</p>
      
      <h2>Paper and Printing</h2>
      <p>We use FSC-certified paper and environmentally friendly printing processes for all our physical publications.</p>
      
      <h2>Digital First</h2>
      <p>Our digital-first approach significantly reduces paper consumption while improving access to scholarly content.</p>
      
      <h2>Carbon Offset</h2>
      <p>We offset our carbon emissions through verified environmental projects and continue to seek ways to further reduce our footprint.</p>
    `,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop",
    category: "Health Science",
    author: "Sustainability Team",
    publishedAt: "2023-12-10T12:00:00Z",
    tags: ["Sustainability", "Environment", "Publishing"]
  }
];

export const newsCategories = [
  "All Categories",
  "Social Sciences",
  "Physical Sciences",
  "Health Science",
  "Life Sciences",
];
