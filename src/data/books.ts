import { Book } from "@/contexts/CartContext";

export const books: Book[] = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    rating: 4.8,
    category: "Fiction",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    isbn: "978-0525559474",
    pages: 304,
    publisher: "Viking",
    publishDate: "2020-09-29",
    blurb: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices. Would you have done anything different, if you had the chance to undo your regrets? A dazzling novel about all the choices that go into a life well lived, from the internationally bestselling author of Reasons to Stay Alive and How To Stop Time.",
    biography: "Matt Haig is a British author known for his works that often blend fiction with discussions of mental health. He has written for both children and adults, and his books have been translated into over forty languages. His memoir 'Reasons to Stay Alive' was a number one bestseller. He has authored over a dozen books, including novels such as 'How to Stop Time', 'The Humans', and 'The Radleys'. Haig lives in Brighton with his wife and two children.",
    hardbackInfo: {
      isbn: "0-525-55947-1",
      isbn13: "978-0-525-55947-4",
      publicationDate: "2020-09-29"
    },
    paperbackInfo: {
      isbn: "0-525-55948-X",
      isbn13: "978-0-525-55948-1",
      publicationDate: "2021-05-04"
    },
    ebookInfo: {
      isbn: "0-525-55949-8",
      isbn13: "978-0-525-55949-8",
      publicationDate: "2020-09-29"
    },
    categories: ["Fiction", "Fantasy", "Contemporary Fiction"],
    subjectCodes: {
      bic: ["FA", "FM"],
      bisac: ["FIC045000", "FIC031000"],
      thema: ["FB", "FBA"]
    },
    samplePdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf"
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
    rating: 4.9,
    category: "Self-Help",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones. No matter your goals, Atomic Habits offers a proven framework for improving every day.",
    isbn: "978-0735211292",
    pages: 320,
    publisher: "Avery",
    publishDate: "2018-10-16",
    blurb: "No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results. If you're having trouble changing your habits, the problem isn't you. The problem is your system. Bad habits repeat themselves again and again not because you don't want to change, but because you have the wrong system for change.",
    biography: "James Clear is an author and speaker focused on habits, decision making, and continuous improvement. His work has appeared in the New York Times, Time, and Entrepreneur, and on CBS This Morning. He is a regular speaker at Fortune 500 companies and his work is used by teams in the NFL, NBA, and MLB. His website, jamesclear.com, receives millions of visitors each month, and hundreds of thousands subscribe to his email newsletter. He is a graduate of Denison University, where he was an Academic All-American on the baseball team.",
    hardbackInfo: {
      isbn: "0-7352-1129-5",
      isbn13: "978-0-7352-1129-2",
      publicationDate: "2018-10-16"
    },
    ebookInfo: {
      isbn: "0-7352-1131-7",
      isbn13: "978-0-7352-1131-5",
      publicationDate: "2018-10-16"
    },
    categories: ["Self-Help", "Psychology", "Business"],
    subjectCodes: {
      bic: ["VS", "VSC"],
      bisac: ["SEL027000", "BUS107000"],
      thema: ["VS", "VSC"]
    },
    samplePdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf"
  },
  {
    id: "3",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    rating: 4.7,
    category: "Fiction",
    description: "A novel about a young woman who raises herself in the marshes of the deep South and becomes a suspect in the murder of a man she was once involved with.",
    isbn: "978-0735219090",
    pages: 384,
    publisher: "G.P. Putnam's Sons",
    publishDate: "2018-08-14",
    blurb: "For years, rumors of the 'Marsh Girl' have haunted Barkley Cove, a quiet town on the North Carolina coast. So in late 1969, when handsome Chase Andrews is found dead, the locals immediately suspect Kya Clark, the so-called Marsh Girl. But Kya is not what they say. Sensitive and intelligent, she has survived for years alone in the marsh that she calls home, finding friends in the gulls and lessons in the sand. Then the time comes when she yearns to be touched and loved. When two young men from town become intrigued by her wild beauty, Kya opens herself to a new life—until the unthinkable happens.",
    biography: "Delia Owens is the co-author of three internationally bestselling nonfiction books about her life as a wildlife scientist in Africa—Cry of the Kalahari, The Eye of the Elephant, and Secrets of the Savanna. She has won the John Burroughs Award for Nature Writing and has been published in Nature, the African Journal of Ecology, and International Wildlife, among many others. She currently lives in the mountains of North Carolina. Where the Crawdads Sing is her first novel.",
    hardbackInfo: {
      isbn: "0-7352-1909-1",
      isbn13: "978-0-7352-1909-0",
      publicationDate: "2018-08-14"
    },
    paperbackInfo: {
      isbn: "0-7352-1910-5",
      isbn13: "978-0-7352-1910-6",
      publicationDate: "2019-03-26"
    },
    ebookInfo: {
      isbn: "0-7352-1911-3",
      isbn13: "978-0-7352-1911-3",
      publicationDate: "2018-08-14"
    },
    categories: ["Fiction", "Mystery", "Southern Fiction"],
    subjectCodes: {
      bic: ["FA", "FF"],
      bisac: ["FIC019000", "FIC050000"],
      thema: ["FA", "FF"]
    }
  },
  {
    id: "4",
    title: "Educated",
    author: "Tara Westover",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    rating: 4.8,
    category: "Non-Fiction",
    description: "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
    isbn: "978-0399590504",
    pages: 352,
    publisher: "Random House",
    publishDate: "2018-02-20",
    blurb: "Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom. Her family was so isolated from mainstream society that there was no one to ensure the children received an education, and no one to intervene when one of Tara's older brothers became violent. When another brother got himself into college, Tara decided to try a new kind of life. Her quest for knowledge transformed her, taking her over oceans and across continents, to Harvard and to Cambridge University. Only then would she wonder if she'd traveled too far, if there was still a way home.",
    biography: "Tara Westover is an American author. Born in Idaho to a father opposed to public education, she never attended school. She spent her days working in her father's junkyard or stewing herbs for her mother, a self-taught herbalist and midwife. She was seventeen the first time she set foot in a classroom, and after that first taste, she pursued learning for a decade. She graduated magna cum laude from Brigham Young University in 2008 and was subsequently awarded a Gates Cambridge Scholarship. She earned an MPhil from Trinity College, Cambridge in 2009, and a PhD in history in 2014.",
    hardbackInfo: {
      isbn: "0-399-59050-4",
      isbn13: "978-0-399-59050-4",
      publicationDate: "2018-02-20"
    },
    paperbackInfo: {
      isbn: "0-399-59051-2",
      isbn13: "978-0-399-59051-1",
      publicationDate: "2018-11-06"
    },
    ebookInfo: {
      isbn: "0-399-59052-0",
      isbn13: "978-0-399-59052-8",
      publicationDate: "2018-02-20"
    },
    categories: ["Biography", "Memoir", "Education"],
    subjectCodes: {
      bic: ["BM", "JNMT"],
      bisac: ["BIO026000", "EDU040000"],
      thema: ["DNBF", "JNM"]
    }
  },
  {
    id: "5",
    title: "The Very Hungry Caterpillar",
    author: "Eric Carle",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=400&h=600&fit=crop",
    rating: 4.9,
    category: "Children",
    description: "The beloved classic picture book, with die-cut pages and gorgeous illustrations, will delight readers of all ages.",
    isbn: "978-0399226908",
    pages: 26,
    publisher: "Philomel Books",
    publishDate: "1969-06-03",
    blurb: "THE all-time classic picture book, from generation to generation, sold somewhere in the world every 30 seconds! Have you shared it with a child or grandchild in your life? A tiny caterpillar comes out of an egg and starts looking for food. What follows is an all-time classic tale of self-discovery and transformation from caterpillar to beautiful butterfly. Including die-cut pages and Eric Carle's distinctive collage illustrations, this is a book that has been enjoyed by millions and will continue to delight generations to come.",
    biography: "Eric Carle (1929-2021) was an American designer, illustrator, and writer of children's books. He illustrated more than seventy books, most of which he also wrote, and more than 170 million copies of his books have sold around the world. Born in the United States to German immigrant parents, he moved to Germany with his family at age six. He returned to New York in 1952 and worked as a graphic designer before becoming a children's book illustrator and writer. His distinctive collage illustrations are created by gluing layers of hand-painted tissue paper.",
    hardbackInfo: {
      isbn: "0-399-22690-8",
      isbn13: "978-0-399-22690-8",
      publicationDate: "1994-03-23"
    },
    ebookInfo: {
      isbn: "0-399-25693-X",
      isbn13: "978-0-399-25693-6",
      publicationDate: "2011-07-07"
    },
    categories: ["Children's Books", "Picture Books"],
    subjectCodes: {
      bic: ["YBC", "YBCS"],
      bisac: ["JUV002000", "JUV009020"],
      thema: ["YBC", "YBCS"]
    }
  },
  {
    id: "6",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
    rating: 4.7,
    category: "Non-Fiction",
    description: "A Brief History of Humankind. A groundbreaking narrative of humanity's creation and evolution that explores the ways in which biology and history have defined us.",
    isbn: "978-0062316097",
    pages: 464,
    publisher: "Harper",
    publishDate: "2015-02-10",
    blurb: "100,000 years ago, at least six human species inhabited the earth. Today there is just one. Us. Homo sapiens. How did our species succeed in the battle for dominance? Why did our foraging ancestors come together to create cities and kingdoms? How did we come to believe in gods, nations and human rights; to trust money, books and laws; and to be enslaved by bureaucracy, timetables and consumerism? And what will our world be like in the millennia to come? In Sapiens, Dr Yuval Noah Harari spans the whole of human history, from the very first humans to walk the earth to the radical – and sometimes devastating – breakthroughs of the Cognitive, Agricultural and Scientific Revolutions.",
    biography: "Yuval Noah Harari is an Israeli public intellectual, historian and professor in the Department of History at the Hebrew University of Jerusalem. He is the author of the popular science bestsellers Sapiens: A Brief History of Humankind, Homo Deus: A Brief History of Tomorrow, and 21 Lessons for the 21st Century. His writings examine free will, consciousness, and intelligence. Harari holds a PhD in History from the University of Oxford and lectures on world history. His books have sold over 35 million copies worldwide and have been translated into 65 languages.",
    hardbackInfo: {
      isbn: "0-06-231609-7",
      isbn13: "978-0-06-231609-7",
      publicationDate: "2015-02-10"
    },
    paperbackInfo: {
      isbn: "0-06-231610-0",
      isbn13: "978-0-06-231610-3",
      publicationDate: "2018-05-15"
    },
    ebookInfo: {
      isbn: "0-06-231611-9",
      isbn13: "978-0-06-231611-0",
      publicationDate: "2015-02-10"
    },
    categories: ["History", "Anthropology", "Science"],
    subjectCodes: {
      bic: ["HBT", "JFS"],
      bisac: ["HIS000000", "SCI027000"],
      thema: ["NHB", "JFS"]
    }
  },
  {
    id: "7",
    title: "Project Hail Mary",
    author: "Andy Weir",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1614544048536-0d28caf77f41?w=400&h=600&fit=crop",
    rating: 4.9,
    category: "Fiction",
    description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the author of The Martian.",
    isbn: "978-0593135204",
    pages: 496,
    publisher: "Ballantine Books",
    publishDate: "2021-05-04",
    blurb: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it. All he knows is that he's been asleep for a very, very long time. And he's just been awakened to find himself millions of miles from home, with nothing but two corpses for company. His crewmates dead, his memories fuzzily returning, he realizes that an impossible task now confronts him. Alone on this tiny ship that's been cobbled together by every pointy-head on Earth, it's up to him to conquer an extinction-level threat to our species.",
    biography: "Andy Weir built a career as a software engineer until the success of his first published novel, The Martian, allowed him to live out his dream of writing full-time. He is a lifelong space nerd and a devoted hobbyist of subjects such as relativistic physics, orbital mechanics, and the history of manned spaceflight. When he's not writing, he enjoys playing video games and exploring new technologies. He lives in California. His other novels include Artemis and Project Hail Mary.",
    hardbackInfo: {
      isbn: "0-593-13520-7",
      isbn13: "978-0-593-13520-4",
      publicationDate: "2021-05-04"
    },
    paperbackInfo: {
      isbn: "0-593-13521-5",
      isbn13: "978-0-593-13521-1",
      publicationDate: "2022-05-03"
    },
    ebookInfo: {
      isbn: "0-593-13522-3",
      isbn13: "978-0-593-13522-8",
      publicationDate: "2021-05-04"
    },
    categories: ["Science Fiction", "Adventure", "Thriller"],
    subjectCodes: {
      bic: ["FL", "FLS"],
      bisac: ["FIC028000", "FIC028030"],
      thema: ["FL", "FLS"]
    }
  },
  {
    id: "8",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    price: 17.99,
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=600&fit=crop",
    rating: 4.8,
    category: "Self-Help",
    description: "Timeless lessons on wealth, greed, and happiness. Doing well with money isn't necessarily about what you know. It's about how you behave.",
    isbn: "978-0857197689",
    pages: 256,
    publisher: "Harriman House",
    publishDate: "2020-09-08",
    blurb: "Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people. Money—investing, personal finance, and business decisions—is typically taught as a math-based field, where data and formulas tell us exactly what to do. But in the real world people don't make financial decisions on a spreadsheet. They make them at the dinner table, or in a meeting room, where personal history, your own unique view of the world, ego, pride, marketing, and odd incentives are scrambled together. In The Psychology of Money, award-winning author Morgan Housel shares 19 short stories exploring the strange ways people think about money.",
    biography: "Morgan Housel is a partner at The Collaborative Fund and a former columnist at The Motley Fool and The Wall Street Journal. He is a two-time winner of the Best in Business Award from the Society of American Business Editors and Writers, and the New York Times Sidney Award. He lives in Seattle with his wife and two children. His work focuses on behavioral finance and the intersection of money, history, and psychology.",
    hardbackInfo: {
      isbn: "0-85719-768-5",
      isbn13: "978-0-85719-768-9",
      publicationDate: "2020-09-08"
    },
    ebookInfo: {
      isbn: "0-85719-769-3",
      isbn13: "978-0-85719-769-6",
      publicationDate: "2020-09-08"
    },
    categories: ["Personal Finance", "Psychology", "Business"],
    subjectCodes: {
      bic: ["KFF", "VSP"],
      bisac: ["BUS050020", "SEL027000"],
      thema: ["KFF", "VSP"]
    }
  },
  {
    id: "9",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    rating: 4.6,
    category: "Academic",
    description: "Some books on algorithms are rigorous but incomplete; others cover masses of material but lack rigor. This book combines rigor and comprehensiveness.",
    isbn: "978-0262046305",
    pages: 1312,
    publisher: "MIT Press",
    publishDate: "2022-04-05",
    blurb: "A comprehensive update of the leading algorithms text, with new material on matchings in bipartite graphs, online algorithms, machine learning, and other topics. Some books on algorithms are rigorous but incomplete; others cover masses of material but lack rigor. Introduction to Algorithms uniquely combines rigor and comprehensiveness. It covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers, with self-contained chapters and algorithms in pseudocode. The fourth edition has been updated throughout, with new chapters on matchings in bipartite graphs, online algorithms, and machine learning.",
    biography: "Thomas H. Cormen is Professor of Computer Science and former Chair of the Computer Science Department at Dartmouth College. He is the coauthor (with Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein) of the leading textbook on computer algorithms, Introduction to Algorithms. He received his PhD in Electrical Engineering and Computer Science from MIT. Professor Cormen has taught at the undergraduate and graduate levels and was honored with Dartmouth's Distinguished Teaching Award. His research interests include algorithm engineering, parallel computing, and algorithm design.",
    hardbackInfo: {
      isbn: "0-262-04630-X",
      isbn13: "978-0-262-04630-5",
      publicationDate: "2022-04-05"
    },
    ebookInfo: {
      isbn: "0-262-36706-4",
      isbn13: "978-0-262-36706-6",
      publicationDate: "2022-04-05"
    },
    categories: ["Computer Science", "Algorithms", "Textbooks"],
    subjectCodes: {
      bic: ["UMB", "UMK"],
      bisac: ["COM051300", "COM051000"],
      thema: ["UMB", "UMK"]
    }
  },
  {
    id: "10",
    title: "Goodnight Moon",
    author: "Margaret Wise Brown",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=400&h=600&fit=crop",
    rating: 4.8,
    category: "Children",
    description: "In a great green room, tucked away in bed, is a little bunny. 'Goodnight room, goodnight moon.' The classic bedtime story by Margaret Wise Brown.",
    isbn: "978-0694003617",
    pages: 32,
    publisher: "HarperFestival",
    publishDate: "1991-09-01",
    blurb: "In a great green room, tucked away in bed, is a little bunny. 'Goodnight room, goodnight moon.' And to all the familiar things in the softly lit room—to the picture of the three little bears sitting on chairs, to the clocks and his socks, to the mittens and the kittens, to everything one by one—the little bunny says goodnight. In this classic of children's literature, beloved by generations of readers and listeners, the quiet poetry of the words and the gentle, lulling illustrations combine to make a perfect book for the end of the day.",
    biography: "Margaret Wise Brown (1910-1952) was one of the most beloved children's book authors of the twentieth century. Her books have sold millions of copies worldwide. In her brief life, she wrote over 100 children's books, including Goodnight Moon and The Runaway Bunny, both illustrated by Clement Hurd. She pioneered a new approach to children's literature, focusing on the world from a child's perspective and using rhythmic, poetic language. She studied education and child development before turning to writing, which influenced her unique approach to children's books.",
    hardbackInfo: {
      isbn: "0-06-020706-X",
      isbn13: "978-0-06-020706-1",
      publicationDate: "1947-09-03"
    },
    ebookInfo: {
      isbn: "0-06-177588-5",
      isbn13: "978-0-06-177588-7",
      publicationDate: "2007-01-23"
    },
    categories: ["Children's Books", "Bedtime Stories", "Picture Books"],
    subjectCodes: {
      bic: ["YBC", "YBCH"],
      bisac: ["JUV002000", "JUV010000"],
      thema: ["YBC", "YBCH"]
    }
  },
  {
    id: "11",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop",
    rating: 4.5,
    category: "Fiction",
    description: "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house. One evening her husband returns home late and she shoots him five times.",
    isbn: "978-1250301697",
    pages: 336,
    publisher: "Celadon Books",
    publishDate: "2019-02-05",
    blurb: "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London's most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word. Alicia's refusal to talk, or give any kind of explanation, turns a domestic tragedy into something far grander, a mystery that captures the public imagination and casts Alicia into notoriety. The price of her art skyrockets, and she, the silent patient, is hidden away from the tabloids in a secure forensic unit in North London.",
    biography: "Alex Michaelides was born and raised in Cyprus. He has an MA in English Literature from Trinity College, Cambridge, and an MA in Screenwriting from the American Film Institute in Los Angeles. The Silent Patient was his first novel, which spent more than a year on the New York Times bestseller list and was the biggest-selling debut of 2019. It has sold over six million copies worldwide and has been translated into over 50 languages. His second novel, The Maidens, was also a New York Times bestseller. He lives in London.",
    hardbackInfo: {
      isbn: "1-250-30169-7",
      isbn13: "978-1-250-30169-7",
      publicationDate: "2019-02-05"
    },
    paperbackInfo: {
      isbn: "1-250-30170-0",
      isbn13: "978-1-250-30170-3",
      publicationDate: "2020-03-03"
    },
    ebookInfo: {
      isbn: "1-250-30171-9",
      isbn13: "978-1-250-30171-0",
      publicationDate: "2019-02-05"
    },
    categories: ["Psychological Thriller", "Mystery", "Suspense"],
    subjectCodes: {
      bic: ["FF", "FH"],
      bisac: ["FIC030000", "FIC022000"],
      thema: ["FF", "FH"]
    }
  },
  {
    id: "12",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=600&fit=crop",
    rating: 4.6,
    category: "Non-Fiction",
    description: "In this book, Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.",
    isbn: "978-0374533557",
    pages: 499,
    publisher: "Farrar, Straus and Giroux",
    publishDate: "2013-04-02",
    blurb: "In the international bestseller, Thinking, Fast and Slow, Daniel Kahneman, the renowned psychologist and winner of the Nobel Prize in Economics, takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think. System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical. The impact of overconfidence on corporate strategies, the difficulties of predicting what will make us happy in the future, the profound effect of cognitive biases on everything from playing the stock market to planning our next vacation—each of these can be understood only by knowing how the two systems shape our judgments and decisions.",
    biography: "Daniel Kahneman is the Eugene Higgins Professor of Psychology Emeritus at Princeton University and Professor of Psychology and Public Affairs Emeritus at Princeton's Woodrow Wilson School of Public and International Affairs. He received the 2002 Nobel Prize in Economic Sciences for his pioneering work with Amos Tversky on decision-making. He is a fellow of the American Academy of Arts and Sciences and the National Academy of Sciences. His research focuses on judgment and decision-making, with a focus on the psychology of intuitive beliefs and choices.",
    hardbackInfo: {
      isbn: "0-374-27563-7",
      isbn13: "978-0-374-27563-1",
      publicationDate: "2011-10-25"
    },
    paperbackInfo: {
      isbn: "0-374-53355-5",
      isbn13: "978-0-374-53355-7",
      publicationDate: "2013-04-02"
    },
    ebookInfo: {
      isbn: "0-374-70855-6",
      isbn13: "978-0-374-70855-2",
      publicationDate: "2011-10-25"
    },
    categories: ["Psychology", "Economics", "Behavioral Science"],
    subjectCodes: {
      bic: ["JM", "KJC"],
      bisac: ["PSY008000", "BUS069030"],
      thema: ["JM", "KJC"]
    }
  },
];

export const categories = [
  { name: "Fiction", icon: "📚", count: 4, description: "Novels, short stories, and literary fiction" },
  { name: "Non-Fiction", icon: "📖", count: 3, description: "Biographies, history, and true stories" },
  { name: "Children", icon: "🧒", count: 2, description: "Picture books and young readers" },
  { name: "Academic", icon: "🎓", count: 1, description: "Textbooks and scholarly works" },
  { name: "Self-Help", icon: "✨", count: 2, description: "Personal development and motivation" },
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Avid Reader",
    content: "Biblioscape has transformed my reading experience. The curated collections always introduce me to books I would have never discovered on my own.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "James Chen",
    role: "Book Club Host",
    content: "The quality of service and book recommendations is unmatched. My book club has found all our best reads through this wonderful bookstore.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Literature Professor",
    content: "As someone who reads professionally, I appreciate the thoughtful curation and the beautiful shopping experience Biblioscape provides.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
];