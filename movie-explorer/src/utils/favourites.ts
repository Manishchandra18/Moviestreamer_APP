export const getFavorites = (username: string): number[] => {
    return JSON.parse(localStorage.getItem(`favorites_${username}`) || "[]");
  };
  
  export const saveFavorite = (username: string, id: number) => {
    const favs = getFavorites(username);
    if (!favs.includes(id)) {
      localStorage.setItem(`favorites_${username}`, JSON.stringify([...favs, id]));
    }
  };
  
  export const removeFavorite = (username: string, id: number) => {
    const updated = getFavorites(username).filter((fid) => fid !== id);
    localStorage.setItem(`favorites_${username}`, JSON.stringify(updated));
  };
  
  export const isFavorite = (username: string, id: number) => {
    return getFavorites(username).includes(id);
  };

  export function getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  