
import React from 'react';
import { Card } from '@/components/ui/card';
import { BookOpen, Users, TrendingUp, Star } from 'lucide-react';
import { Book } from '@/pages/Index';

interface BookStatsProps {
  books: Book[];
}

export const BookStats: React.FC<BookStatsProps> = ({ books }) => {
  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.status === 'available').length;
  const borrowedBooks = books.filter(book => book.status === 'borrowed').length;
  const averageRating = books.length > 0 
    ? (books.reduce((sum, book) => sum + book.rating, 0) / books.length).toFixed(1)
    : '0';

  const stats = [
    {
      title: 'Total des livres',
      value: totalBooks,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Disponibles',
      value: availableBooks,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Empruntés',
      value: borrowedBooks,
      icon: TrendingUp,
      color: 'text-red-600',  
      bgColor: 'bg-red-100'
    },
    {
      title: 'Note moyenne',
      value: averageRating,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="text-2xl font-bold">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
