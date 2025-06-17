
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus, Search, BookOpen, Users, LogOut } from 'lucide-react';
import { BookForm } from '@/components/BookForm';
import { BookList } from '@/components/BookList';
import { BookStats } from '@/components/BookStats';
import { AuthForm } from '@/components/AuthForm';
import { useToast } from '@/hooks/use-toast';
// import { authApi, booksApi } from '@/services/api'; // AUTHENTIFICATION DÉSACTIVÉE

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: 'available' | 'borrowed' | 'reserved';
  description: string;
  publishYear: number;
  rating: number;
  coverUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const Index = () => {
  // AUTHENTIFICATION ACTIVÉE
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [loading] = useState(false); // Pas de chargement en mode démo
  const { toast } = useToast();

  // Livres sénégalais de démonstration
  useEffect(() => {
    const demoBooks: Book[] = [
      {
        id: '1',
        title: 'Une si longue lettre',
        author: 'Mariama Bâ',
        isbn: '9782070370221',
        category: 'Littérature',
        status: 'available',
        description: 'Roman épistolaire emblématique de la littérature africaine',
        publishYear: 1979,
        rating: 4.8,
        coverUrl: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'L\'Aventure ambiguë',
        author: 'Cheikh Hamidou Kane',
        isbn: '9782070361946',
        category: 'Littérature',
        status: 'borrowed',
        description: 'Un classique de la littérature sénégalaise sur la rencontre des cultures',
        publishYear: 1961,
        rating: 4.6,
        coverUrl: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        title: 'Le Docker noir',
        author: 'Ousmane Sembène',
        isbn: '9782070367891',
        category: 'Littérature',
        status: 'available',
        description: 'Premier roman du père du cinéma africain',
        publishYear: 1956,
        rating: 4.3,
        coverUrl: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        title: 'Xala',
        author: 'Ousmane Sembène',
        isbn: '9782070415823',
        category: 'Littérature',
        status: 'reserved',
        description: 'Satire sociale sur la bourgeoisie africaine post-coloniale',
        publishYear: 1973,
        rating: 4.4,
        coverUrl: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '5',
        title: 'Le Ventre de l\'Atlantique',
        author: 'Fatou Diome',
        isbn: '9782253107316',
        category: 'Littérature',
        status: 'available',
        description: 'Roman sur l\'immigration et l\'identité franco-sénégalaise',
        publishYear: 2003,
        rating: 4.5,
        coverUrl: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    setBooks(demoBooks);
  }, []);

  // Fonctions CRUD simplifiées pour le mode démo (sans authentification)
  const handleAddBook = async (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setBooks(prev => [...prev, newBook]);
    setIsAddingBook(false);
    toast({
      title: "Livre ajouté",
      description: `"${bookData.title}" a été ajouté avec succès.`,
    });
  };

  const handleEditBook = async (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingBook) return;
    
    const updatedBook: Book = {
      ...bookData,
      id: editingBook.id,
      createdAt: editingBook.createdAt,
      updatedAt: new Date()
    };
    setBooks(prev => prev.map(book => 
      book.id === editingBook.id ? updatedBook : book
    ));
    setEditingBook(null);
    toast({
      title: "Livre modifié",
      description: `"${bookData.title}" a été modifié avec succès.`,
    });
  };

  const handleDeleteBook = async (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    setBooks(prev => prev.filter(book => book.id !== bookId));
    toast({
      title: "Livre supprimé",
      description: `"${book?.title}" a été supprimé.`,
      variant: "destructive"
    });
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentUser({
      id: 1,
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User"
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(books.map(book => book.category)));

  // Vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Bibliothèque Sénégalaise</h1>
              <Badge variant="outline" className="ml-2 text-xs">Mode Démo</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Bonjour, {currentUser?.firstName} {currentUser?.lastName}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <BookStats books={books} />

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          {/* Bouton d'ajout en haut pour mobile */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Gestion des livres</h2>
            <Sheet open={isAddingBook} onOpenChange={setIsAddingBook}>
              <SheetTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Ajouter un nouveau livre</SheetTitle>
                </SheetHeader>
                <div className="h-full pb-6">
                  <BookForm onSubmit={handleAddBook} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher par titre ou auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtres par catégorie */}
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory('all')}
            >
              Tous
            </Badge>
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Books List */}
        <BookList 
          books={filteredBooks}
          onEdit={setEditingBook}
          onDelete={handleDeleteBook}
        />

        {/* Edit Book Sheet */}
        <Sheet open={!!editingBook} onOpenChange={() => setEditingBook(null)}>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Modifier le livre</SheetTitle>
            </SheetHeader>
            <div className="h-full pb-6">
              {editingBook && (
                <BookForm 
                  book={editingBook}
                  onSubmit={handleEditBook}
                />
              )}
            </div>
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
};

export default Index;
