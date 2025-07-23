import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Container, Pagination, Typography, Box, CircularProgress, BottomNavigation, BottomNavigationAction, Paper, Button } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import api from "./api";
import { SearchBar } from "./components/SearchBar";
import { MovieGrid } from "./components/MovieGrid";
import { MovieDialog } from "./components/MovieDialog";
import LandingPage from "./LandingPage";
import AuthCallback  from "./AuthCallback.tsx";
import { getAccountDetails, getFavoriteMovies } from "./api";

function MyFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = localStorage.getItem("session_id");
    if (!sessionId) return;

    async function fetchFavorites() {
      setLoading(true);
      if (!sessionId) {
        setLoading(false);
        return;
      }
      const account = await getAccountDetails(sessionId as string);
      const favs = await getFavoriteMovies(account.id, sessionId as string);
      setFavorites(favs);
      setLoading(false);
    }

    fetchFavorites();
  }, []);

  if (loading) return <div>Loading favorites...</div>;
  if (!favorites.length) return <div>No favorites found.</div>;

  return (
    <div>
      <h2>My Favorites</h2>
      <ul>
        {(favorites as { id: number; title: string }[]).map(movie => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
}

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
    setFavorites((prev) => {
      const exists = prev.find((fav) => fav.id === movie.id);
      if (exists) {
        return prev.filter((fav) => fav.id !== movie.id);
      } else {
        return [...prev, movie];
      }
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
          disabled={!!query} // Disable when searchValue is not empty
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
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 80, md: 110 },
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: '90%', sm: 500, md: 700, lg: 900 },
            maxWidth: '95vw',
            zIndex: 9,
          }}
        >
          <Typography variant="h5" align="center" color="text.secondary">
            Please search to get movies
          </Typography>
        </Box>
      )}
      {showNoMovies && navValue === 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 80, md: 110 },
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: '90%', sm: 500, md: 700, lg: 900 },
            maxWidth: '95vw',
            zIndex: 9,
          }}
        >
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
        <BottomNavigation
          showLabels
          value={navValue}
          onChange={(_, newValue) => setNavValue(newValue)}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
    </Container>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage onExplore={() => window.location.href = '/explorer'} onBack={undefined} />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
      {localStorage.getItem("session_id") && <MyFavorites />}
    </BrowserRouter>
  );
}

export default App;
