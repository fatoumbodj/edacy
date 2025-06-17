
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Book } from '@/pages/Index';

interface BookFormProps {
  book?: Book;
  onSubmit: (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const BookForm: React.FC<BookFormProps> = ({ book, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    isbn: book?.isbn || '',
    category: book?.category || 'Littérature',
    status: book?.status || 'available' as const,
    description: book?.description || '',
    publishYear: book?.publishYear || new Date().getFullYear(),
    rating: book?.rating || 0,
    coverUrl: book?.coverUrl || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Titre requis';
    if (!formData.author.trim()) newErrors.author = 'Auteur requis';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN requis';
    if (formData.publishYear < 1000 || formData.publishYear > new Date().getFullYear()) {
      newErrors.publishYear = 'Année de publication invalide';
    }
    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Note entre 0 et 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">{/* Réduit de space-y-6 à space-y-4 et mt-6 à mt-4 */}
      <div className="space-y-2">
        <Label htmlFor="title">Titre *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Entrez le titre du livre"
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Auteur *</Label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e) => handleChange('author', e.target.value)}
          placeholder="Nom de l'auteur"
        />
        {errors.author && <p className="text-sm text-red-500">{errors.author}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="isbn">ISBN *</Label>
        <Input
          id="isbn"
          value={formData.isbn}
          onChange={(e) => handleChange('isbn', e.target.value)}
          placeholder="978-0123456789"
        />
        {errors.isbn && <p className="text-sm text-red-500">{errors.isbn}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="Littérature">Littérature</option>
          <option value="Poésie">Poésie</option>
          <option value="Théâtre">Théâtre</option>
          <option value="Histoire">Histoire</option>
          <option value="Essai">Essai</option>
          <option value="Roman">Roman</option>
          <option value="Nouvelles">Nouvelles</option>
          <option value="Biographie">Biographie</option>
          <option value="Sciences">Sciences</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div className="space-y-3">
        <Label>Statut</Label>
        <RadioGroup
          value={formData.status}
          onValueChange={(value) => handleChange('status', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="available" id="available" />
            <Label htmlFor="available">Disponible</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="borrowed" id="borrowed" />
            <Label htmlFor="borrowed">Emprunté</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="reserved" id="reserved" />
            <Label htmlFor="reserved">Réservé</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="publishYear">Année de publication</Label>
          <Input
            id="publishYear"
            type="number"
            value={formData.publishYear}
            onChange={(e) => handleChange('publishYear', parseInt(e.target.value) || 0)}
            min="1000"
            max={new Date().getFullYear()}
          />
          {errors.publishYear && <p className="text-sm text-red-500">{errors.publishYear}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Note (0-5)</Label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            value={formData.rating}
            onChange={(e) => handleChange('rating', parseFloat(e.target.value) || 0)}
            min="0"
            max="5"
          />
          {errors.rating && <p className="text-sm text-red-500">{errors.rating}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Description du livre..."
          className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[80px] resize-y"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverUrl">URL de la couverture (optionnel)</Label>
        <Input
          id="coverUrl"
          value={formData.coverUrl}
          onChange={(e) => handleChange('coverUrl', e.target.value)}
          placeholder="https://exemple.com/couverture.jpg"
        />
      </div>

      <Button type="submit" className="w-full">
        {book ? 'Modifier le livre' : 'Ajouter le livre'}
      </Button>
    </form>
  );
};
