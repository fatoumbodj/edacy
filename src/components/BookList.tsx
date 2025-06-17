
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Edit, Trash2, Star, Calendar, User } from 'lucide-react';
import { Book } from '@/pages/Index';

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
}

export const BookList: React.FC<BookListProps> = ({ books, onEdit, onDelete }) => {
  const getStatusColor = (status: Book['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'borrowed': return 'bg-red-100 text-red-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Book['status']) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'borrowed': return 'Emprunté';
      case 'reserved': return 'Réservé';
      default: return status;
    }
  };

  if (books.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-lg font-semibold mb-2">Aucun livre trouvé</h3>
          <p>Commencez par ajouter votre premier livre à la bibliothèque.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg line-clamp-2 mb-1">{book.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <User className="h-4 w-4 mr-1" />
                  {book.author}
                </div>
              </div>
              <Badge className={`ml-2 ${getStatusColor(book.status)}`}>
                {getStatusText(book.status)}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {book.publishYear}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 mr-2" />
                {book.rating}/5
              </div>
              <div className="text-sm">
                <span className="font-medium">Catégorie:</span> {book.category}
              </div>
              <div className="text-sm">
                <span className="font-medium">ISBN:</span> {book.isbn}
              </div>
            </div>

            {book.description && (
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {book.description}
              </p>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(book)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(book.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
