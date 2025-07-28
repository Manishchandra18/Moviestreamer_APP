import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Pagination, Typography, Box, CircularProgress, BottomNavigation, BottomNavigationAction, Paper, Button } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import api from "./api";
import { SearchBar } from "./components/SearchBar";
import { MovieGrid } from "./components/MovieGrid";
import { MovieDialog } from "./components/MovieDialog";
import { getCurrentUser, updateCurrentUserFavorites } from "./utils/user";

function Explorer() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [navValue, setNavValue] = useState(0);
  const [favorites, setFavorites] = useState<any[]>([]);

  const fetchMovies = useCallback(async (searchQuery = query, searchPage = page) => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await api.get("/search/movie", {
        params: { query: searchQuery, page: searchPage },
      });
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  const fetchMovieDetails = async (id: number) => {
    try {
      const res = await api.get(`/movie/${id}`);
      setSelectedMovie(res.data);
      setDialogOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      if (user.favorites && user.favorites.length > 0) {
        setFavorites(user.favorites);
      } else {
      
        const storedFavs = localStorage.getItem(`favorites_${user.username}`);
        if (storedFavs) {
          const parsedFavs = JSON.parse(storedFavs);
          setFavorites(parsedFavs);
          // Update user profile with localStorage data
          updateCurrentUserFavorites(parsedFavs);
        }
      }
    }
    // No else/redirect needed!
  }, []);

  useEffect(() => {
    if (query) {
      fetchMovies(query, page);
    } else {
      setMovies([]);
      setTotalPages(0);
    }
  }, [query, page, fetchMovies]);

  const handleSearch = () => {
    setPage(1);
    fetchMovies(query, 1);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val === "") {
      setMovies([]);
      setTotalPages(0);
    }
  };

  const toggleFavorite = (movie: any) => {
    const user = getCurrentUser();
    if (!user) return;
    setFavorites((prev) => {
      const exists = prev.find((fav) => fav.id === movie.id);
      const updated = exists ? prev.filter((fav) => fav.id !== movie.id) : [...prev, movie];
      localStorage.setItem(`favorites_${user.username}`, JSON.stringify(updated));
      updateCurrentUserFavorites(updated);
      return updated;
    });
  };

  const showNoMovies = query && !loading && movies.length === 0;
  const showPrompt = !query && !loading;
  const gridMovies = navValue === 1 ? favorites : movies;

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/")}
          sx={{ position: 'absolute', top: 16, left: 16, zIndex: 20 }}
          disabled={!!query}
        >
          Go back to Home
        </Button>
      </Box>
      <SearchBar
        value={query}
        onChange={handleQueryChange}
        onSearch={handleSearch}
      />
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10, mb: 4 }}>
          <CircularProgress size={60} thickness={4.5} />
        </Box>
      )}
      {showPrompt && navValue === 0 && (
        <Box sx={{ position: 'absolute', top: { xs: 80, md: 110 }, left: '50%', transform: 'translateX(-50%)', width: { xs: '90%', sm: 500, md: 700, lg: 900 }, maxWidth: '95vw', zIndex: 9 }}>
          <Typography variant="h5" align="center" color="text.secondary">
            Please search to get movies
          </Typography>
        </Box>
      )}
      {showNoMovies && navValue === 0 && (
        <Box sx={{ position: 'absolute', top: { xs: 80, md: 110 }, left: '50%', transform: 'translateX(-50%)', width: { xs: '90%', sm: 500, md: 700, lg: 900 }, maxWidth: '95vw', zIndex: 9 }}>
          <Typography variant="h5" align="center" color="text.secondary">
            No movies found
          </Typography>
        </Box>
      )}
      <MovieGrid
        movies={gridMovies}
        loading={loading}
        onSelect={fetchMovieDetails}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
      {totalPages > 1 && navValue === 0 && (
        <Pagination
          count={totalPages > 500 ? 500 : totalPages}
          page={page}
          onChange={(_, val) => setPage(val)}
          sx={{ mt: 4, mb: 10, display: "flex", justifyContent: "center" }}
          size="large"
        />
      )}
      <MovieDialog open={dialogOpen} movie={selectedMovie} onClose={() => setDialogOpen(false)} />
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1300 }} elevation={3}>
        <BottomNavigation showLabels value={navValue} onChange={(_, newValue) => setNavValue(newValue)}>
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
    </Container>
  );
}

export default Explorer; 