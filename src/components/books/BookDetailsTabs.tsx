import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, User, Info, Calendar, Hash, Tag, FileText, Layers } from "lucide-react";
import { Book } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface BookDetailsTabsProps {
  book: Book;
}

type TabType = "blurb" | "biography" | "book-info";

export function BookDetailsTabs({ book }: BookDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("blurb");
  
  const hasBlurb = book.blurb || book.description;
  const hasBiography = book.biography;
  const hasBookInfo = book.hardbackInfo || book.paperbackInfo || book.ebookInfo || book.categories || book.subjectCodes;

  if (!hasBlurb && !hasBiography && !hasBookInfo) {
    return null;
  }

  const tabs = [
    { id: "blurb" as TabType, label: "Blurb", icon: BookOpen, available: hasBlurb },
    { id: "biography" as TabType, label: "Biography", icon: User, available: hasBiography },
    { id: "book-info" as TabType, label: "Book Information", icon: Info, available: hasBookInfo },
  ].filter(tab => tab.available);

  return (
    <section className="container-wide mt-20">
      {/* Decorative top border */}
      <div className="relative mb-12">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-6 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            More Details
          </span>
        </div>
      </div>

      {/* Custom Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative group flex items-center gap-2 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-300",
                isActive 
                  ? "text-accent" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 transition-colors duration-300",
                isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span>{tab.label}</span>
              
              {/* Animated underline */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                initial={false}
                animate={{ 
                  scaleX: isActive ? 1 : 0,
                  opacity: isActive ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              
              {/* Hover underline */}
              {!isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted-foreground/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content with Animation */}
      <div className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === "blurb" && hasBlurb && (
            <motion.div
              key="blurb"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <div className="bg-gradient-to-br from-secondary/50 to-secondary/30 rounded-2xl p-8 md:p-12 border border-border/50">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-accent/10 text-accent">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-1">About This Book</h3>
                    <p className="text-sm text-muted-foreground">A detailed overview of the content</p>
                  </div>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground/80 leading-relaxed text-lg first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-accent first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                    {book.blurb || book.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "biography" && hasBiography && (
            <motion.div
              key="biography"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <div className="bg-gradient-to-br from-secondary/50 to-secondary/30 rounded-2xl p-8 md:p-12 border border-border/50">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-accent/10 text-accent">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-1">About the Author</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground/80 leading-relaxed text-lg first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-accent first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                    {book.biography}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "book-info" && hasBookInfo && (
            <motion.div
              key="book-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <div className="space-y-8">
                {/* Format-specific ISBN Cards */}
                {(book.hardbackInfo || book.paperbackInfo || book.ebookInfo) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {book.hardbackInfo && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="group bg-gradient-to-br from-secondary to-secondary/50 rounded-xl p-6 border border-border hover:shadow-lg hover:border-accent/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <h4 className="font-semibold text-foreground uppercase tracking-wider text-sm">Hardback</h4>
                        </div>
                        <ul className="space-y-3 text-sm">
                          {book.hardbackInfo.isbn && (
                            <li className="flex items-start gap-2">
                              <Hash className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-muted-foreground">ISBN:</span>
                                <span className="ml-2 text-foreground font-mono">{book.hardbackInfo.isbn}</span>
                              </div>
                            </li>
                          )}
                          {book.hardbackInfo.isbn13 && (
                            <li className="flex items-start gap-2">
                              <Hash className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-muted-foreground">ISBN13:</span>
                                <span className="ml-2 text-foreground font-mono">{book.hardbackInfo.isbn13}</span>
                              </div>
                            </li>
                          )}
                          {book.hardbackInfo.publicationDate && (
                            <li className="flex items-start gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-muted-foreground">Published:</span>
                                <span className="ml-2 text-foreground">{book.hardbackInfo.publicationDate}</span>
                              </div>
                            </li>
                          )}
                        </ul>
                      </motion.div>
                    )}

                    {book.paperbackInfo && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="group bg-gradient-to-br from-secondary to-secondary/50 rounded-xl p-6 border border-border hover:shadow-lg hover:border-accent/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            <FileText className="h-5 w-5" />
                          </div>
                          <h4 className="font-semibold text-foreground uppercase tracking-wider text-sm">Paperback</h4>
                        </div>
                        <ul className="space-y-3 text-sm">
                          {book.paperbackInfo.isbn && (
                            <li className="flex items-start gap-2">
                              <Hash className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-muted-foreground">ISBN:</span>
                                <span className="ml-2 text-foreground font-mono">{book.paperbackInfo.isbn}</span>
                              </div>
                            </li>
                          )}
                          {book.paperbackInfo.isbn13 && (
                            <li className="flex items-start gap-2">
                              <Hash className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-muted-foreground">ISBN13:</span>
                                <span className="ml-2 text-foreground font-mono">{book.paperbackInfo.isbn13}</span>
                              </div>
                            </li>
                          )}
                          {book.paperbackInfo.publicationDate && (
                            <li className="flex items-start gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-muted-foreground">Published:</span>
                                <span className="ml-2 text-foreground">{book.paperbackInfo.publicationDate}</span>
                              </div>
                            </li>
                          )}
                        </ul>
                      </motion.div>
                    )}

                    {book.ebookInfo && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="group bg-gradient-to-br from-secondary to-secondary/50 rounded-xl p-6 border border-border hover:shadow-lg hover:border-accent/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            <Layers className="h-5 w-5" />
                          </div>
                          <h4 className="font-semibold text-foreground uppercase tracking-wider text-sm">eBook</h4>
                        </div>
                        <ul className="space-y-3 text-sm">
                          {book.ebookInfo.isbn && (
                            <li className="flex items-start gap-2">
                              <Hash className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-muted-foreground">ISBN:</span>
                                <span className="ml-2 text-foreground font-mono">{book.ebookInfo.isbn}</span>
                              </div>
                            </li>
                          )}
                          {book.ebookInfo.isbn13 && (
                            <li className="flex items-start gap-2">
                              <Hash className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-muted-foreground">ISBN13:</span>
                                <span className="ml-2 text-foreground font-mono">{book.ebookInfo.isbn13}</span>
                              </div>
                            </li>
                          )}
                          {book.ebookInfo.publicationDate && (
                            <li className="flex items-start gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-muted-foreground">Published:</span>
                                <span className="ml-2 text-foreground">{book.ebookInfo.publicationDate}</span>
                              </div>
                            </li>
                          )}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Categories and Pages Row */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {book.categories && book.categories.length > 0 && (
                    <div className="bg-secondary/50 rounded-xl p-6 border border-border/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                          <Tag className="h-5 w-5" />
                        </div>
                        <h4 className="font-semibold text-foreground uppercase tracking-wider text-sm">Categories</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {book.categories.map((category, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-background rounded-full text-sm text-foreground border border-border hover:border-accent hover:text-accent transition-colors duration-200"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {book.pages && (
                    <div className="bg-secondary/50 rounded-xl p-6 border border-border/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <h4 className="font-semibold text-foreground uppercase tracking-wider text-sm">Page Count</h4>
                      </div>
                      <p className="text-4xl font-serif font-bold text-foreground">
                        {book.pages}
                        <span className="text-base font-sans font-normal text-muted-foreground ml-2">pages</span>
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Subject Codes */}
                {book.subjectCodes && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-secondary/50 rounded-xl p-6 border border-border/50"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-accent/10 text-accent">
                        <Hash className="h-5 w-5" />
                      </div>
                      <h4 className="font-semibold text-foreground uppercase tracking-wider text-sm">Subject Codes</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {book.subjectCodes.bic && book.subjectCodes.bic.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">BIC</p>
                          <div className="flex flex-wrap gap-1.5">
                            {book.subjectCodes.bic.map((code, index) => (
                              <code key={index} className="px-2 py-1 bg-background rounded text-sm font-mono text-foreground border border-border">
                                {code}
                              </code>
                            ))}
                          </div>
                        </div>
                      )}
                      {book.subjectCodes.bisac && book.subjectCodes.bisac.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">BISAC</p>
                          <div className="flex flex-wrap gap-1.5">
                            {book.subjectCodes.bisac.map((code, index) => (
                              <code key={index} className="px-2 py-1 bg-background rounded text-sm font-mono text-foreground border border-border">
                                {code}
                              </code>
                            ))}
                          </div>
                        </div>
                      )}
                      {book.subjectCodes.thema && book.subjectCodes.thema.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">THEMA</p>
                          <div className="flex flex-wrap gap-1.5">
                            {book.subjectCodes.thema.map((code, index) => (
                              <code key={index} className="px-2 py-1 bg-background rounded text-sm font-mono text-foreground border border-border">
                                {code}
                              </code>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}