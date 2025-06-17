import { Book } from '@/pages/Index';

const API_BASE_URL = 'http://localhost:8081/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

interface AuthResponse {
  accessToken: string;
  tokenType: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface BookStats {
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  reservedBooks: number;
  averageRating: number;
}

// Fonction utilitaire pour les requêtes avec authentification
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const response = await fetch(`${API_BASE_URL}${url}`,
     {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const authApi = {
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    console.log('Tentative de connexion avec:', credentials.email);
    
    // APPEL API COMMENTÉ - Mode démo
    /*
    const response = await fetch('http://localhost:8081/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include', 
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erreur de connexion');
    }

    const data = await response.json();
    */
    
    // Simulation d'authentification locale
    const data = {
      accessToken: 'demo-token',
      tokenType: 'Bearer',
      id: 1,
      email: credentials.email,
      firstName: 'Demo',
      lastName: 'User'
    };
    
    // Stocker le token dans localStorage
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName
    }));

    console.log('Connexion réussie pour:', data.email);
    return data;
  },

  register: async (userData: RegisterData): Promise<{ message: string }> => {
    console.log('Tentative d\'inscription avec:', userData.email);
    
    // APPEL API COMMENTÉ - Mode démo
    /*
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erreur lors de l\'inscription');
    }

    const data = await response.json();
    */
    
    // Simulation d'inscription locale
    const data = { message: 'Inscription réussie' };
    console.log('Inscription réussie pour:', userData.email);
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Déconnexion effectuée');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  verifyToken: async () => {
    try {
      return await makeAuthenticatedRequest('/auth/verify');
    } catch (error) {
      console.error('Token invalide:', error);
      authApi.logout();
      throw error;
    }
  }
};

export const booksApi = {
  getAll: async (params?: { search?: string; category?: string }): Promise<Book[]> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    
    const queryString = searchParams.toString();
    const url = `/books${queryString ? `?${queryString}` : ''}`;
    
    console.log('Récupération des livres avec params:', params);
    const books = await makeAuthenticatedRequest(url);
    
    // Transformation des données pour correspondre à l'interface Frontend
    return books.map((book: any) => ({
      id: book.id.toString(),
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      status: book.status.toLowerCase(),
      description: book.description || '',
      publishYear: book.publishYear,
      rating: book.rating,
      coverUrl: book.coverUrl,
      createdAt: new Date(book.createdAt),
      updatedAt: new Date(book.updatedAt)
    }));
  },

  getById: async (id: string): Promise<Book> => {
    console.log('Récupération du livre ID:', id);
    const book = await makeAuthenticatedRequest(`/books/${id}`);
    
    return {
      id: book.id.toString(),
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      status: book.status.toLowerCase(),
      description: book.description || '',
      publishYear: book.publishYear,
      rating: book.rating,
      coverUrl: book.coverUrl,
      createdAt: new Date(book.createdAt),
      updatedAt: new Date(book.updatedAt)
    };
  },

  create: async (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> => {
    console.log('Création d\'un nouveau livre:', bookData.title);
    
    const requestData = {
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      category: bookData.category,
      status: bookData.status.toUpperCase(),
      description: bookData.description,
      publishYear: bookData.publishYear,
      rating: bookData.rating,
      coverUrl: bookData.coverUrl
    };
    
    const book = await makeAuthenticatedRequest('/books', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });

    return {
      id: book.id.toString(),
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      status: book.status.toLowerCase(),
      description: book.description || '',
      publishYear: book.publishYear,
      rating: book.rating,
      coverUrl: book.coverUrl,
      createdAt: new Date(book.createdAt),
      updatedAt: new Date(book.updatedAt)
    };
  },

  update: async (id: string, bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> => {
    console.log('Modification du livre ID:', id);
    
    const requestData = {
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      category: bookData.category,
      status: bookData.status.toUpperCase(),
      description: bookData.description,
      publishYear: bookData.publishYear,
      rating: bookData.rating,
      coverUrl: bookData.coverUrl
    };
    
    const book = await makeAuthenticatedRequest(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    });

    return {
      id: book.id.toString(),
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      status: book.status.toLowerCase(),
      description: book.description || '',
      publishYear: book.publishYear,
      rating: book.rating,
      coverUrl: book.coverUrl,
      createdAt: new Date(book.createdAt),
      updatedAt: new Date(book.updatedAt)
    };
  },

  delete: async (id: string): Promise<void> => {
    console.log('Suppression du livre ID:', id);
    await makeAuthenticatedRequest(`/books/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async (): Promise<BookStats> => {
    console.log('Récupération des statistiques');
    return await makeAuthenticatedRequest('/books/stats');
  }
};

export const healthApi = {
  check: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }
};
