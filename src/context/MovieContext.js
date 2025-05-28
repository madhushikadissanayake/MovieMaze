import { createContext, useState, useEffect } from 'react';

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (movie) => {
    if (!favorites.find(m => m.id === movie.id)) {
      setFavorites([...favorites, movie]);
    }
  };

  const removeFavorite = (id) => {
    setFavorites(favorites.filter(movie => movie.id !== id));
  };

  const isFavorite = (id) => {
    return favorites.some(movie => movie.id === id);
  };

  return (
    <MovieContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </MovieContext.Provider>
  );
};
