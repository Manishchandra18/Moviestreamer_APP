import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Pagination,
} from '@mui/material';
import { useEffect, useState } from 'react';
import api from './api';
import { MovieDialog } from './components/MovieDialog';
import { getRequestToken } from "./api";

function paginate<T>(array: T[], page: number, perPage: number) {
  const start = (page - 1) * perPage;
  return array.slice(start, start + perPage);
}

function LandingPage({ onExplore, onBack }: {
  onExplore: () => void;
  onBack?: () => void;
}) {
  const [featured, setFeatured] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredPage, setFeaturedPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [seriesPage, setSeriesPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const perPage = 5;

  useEffect(() => {
    async function fetchLanding() {
      setLoading(true);
      try {
        const [featuredRes, topRatedRes, seriesRes] = await Promise.all([
          api.get("/movie/now_playing", { params: { page: 1 } }),
          api.get("/movie/top_rated", { params: { page: 1 } }),
          api.get("/tv/top_rated", { params: { page: 1 } }),
        ]);
        setFeatured((featuredRes.data.results || []).filter((m: any) => m.poster_path));
        setTopRated((topRatedRes.data.results || []).filter((m: any) => m.poster_path));
        setSeries((seriesRes.data.results || []).filter((m: any) => m.poster_path));
      } catch (e) {
        setFeatured([]); setTopRated([]); setSeries([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLanding();
  }, []);

  const handleCardClick = (movie: any) => {
    setSelectedMovie(movie);
    setDialogOpen(true);
  };

  const handleLogin = async () => {
    const token = await getRequestToken();
    const redirectUrl = encodeURIComponent(window.location.origin + "/auth/callback");
    window.location.href = `https://www.themoviedb.org/authenticate/${token}?redirect_to=${redirectUrl}`;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#111', color: 'white' }}>
      <AppBar position="sticky" sx={{ bgcolor: '#181818', color: 'white' }} elevation={3}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 2 }}>
            MovieStreamX
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {onExplore && (
              <Button color="inherit" onClick={onExplore} sx={{ fontWeight: 600 }}>
                Explorer
              </Button>
            )}
            {onBack && (
              <Button color="inherit" onClick={onBack} sx={{ fontWeight: 600 }}>
                Back to Landing
              </Button>
            )}
            <Button onClick={handleLogin} color="inherit">Login with TMDB</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: '100%', px: 0, pt: 6, pb: 2, bgcolor: '#111' }}>
        <Container maxWidth={false} disableGutters sx={{ width: '100%' }}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center', 
              flexWrap: 'wrap',
              mb: 6,
              px: 2,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 320 }}>
              <Typography variant="h2" fontWeight={900} sx={{ mb: 2, letterSpacing: 2, color: 'white' }}>
                Welcome to MovieStreamX
              </Typography>
              <Typography variant="h5" color="grey.400" sx={{ mb: 4, maxWidth: 600 }}>
                Discover, favorite, and explore the best movies and series. Enjoy a cinematic experience from your desktop.
              </Typography>
              <Button variant="contained" color="primary" size="large" onClick={onExplore} sx={{ fontWeight: 700, px: 5, py: 1.5, borderRadius: 3, bgcolor: '#333', color: 'white', '&:hover': { bgcolor: '#444' } }}>
                Go to Explorer
              </Button>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
              <CircularProgress size={60} thickness={4.5} color="inherit" />
            </Box>
          ) : (
            <>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, mt: 6, color: 'white', px: { xs: 2, md: 8 } }}>Featured Movies</Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
                {paginate(featured, featuredPage, perPage).map((movie) => (
                  <Card key={movie.id} sx={{ minWidth: 240, maxWidth: 260, bgcolor: '#181818', color: 'white', borderRadius: 3, boxShadow: 6, mx: 1, mb: 2, cursor: 'pointer' }} onClick={() => handleCardClick(movie)}>
                    <CardMedia
                      component="img"
                      height="340"
                      image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" align="center" sx={{ fontWeight: 600 }}>
                        {movie.title}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
                {featured.length === 0 && (
                  <Typography align="center" color="grey.500" sx={{ px: 2 }}>No featured movies available.</Typography>
                )}
              </Box>
              {featured.length > perPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                  <Pagination
                    count={Math.ceil(featured.length / perPage)}
                    page={featuredPage}
                    onChange={(_, val) => setFeaturedPage(val)}
                    color="primary"
                  />
                </Box>
              )}

              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, mt: 6, color: 'white', px: { xs: 2, md: 8 } }}>Top Rated Movies</Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
                {paginate(topRated, topRatedPage, perPage).map((movie) => (
                  <Card key={movie.id} sx={{ minWidth: 240, maxWidth: 260, bgcolor: '#181818', color: 'white', borderRadius: 3, boxShadow: 6, mx: 1, mb: 2, cursor: 'pointer' }} onClick={() => handleCardClick(movie)}>
                    <CardMedia
                      component="img"
                      height="340"
                      image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" align="center" sx={{ fontWeight: 600 }}>
                        {movie.title}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
                {topRated.length === 0 && (
                  <Typography align="center" color="grey.500" sx={{ px: 2 }}>No top rated movies available.</Typography>
                )}
              </Box>
              {topRated.length > perPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                  <Pagination
                    count={Math.ceil(topRated.length / perPage)}
                    page={topRatedPage}
                    onChange={(_, val) => setTopRatedPage(val)}
                    color="primary"
                  />
                </Box>
              )}

              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, mt: 6, color: 'white', px: { xs: 2, md: 8 } }}>Top Rated Series</Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
                {paginate(series, seriesPage, perPage).map((tv) => (
                  <Card key={tv.id} sx={{ minWidth: 240, maxWidth: 260, bgcolor: '#181818', color: 'white', borderRadius: 3, boxShadow: 6, mx: 1, mb: 2, cursor: 'pointer' }} onClick={() => handleCardClick(tv)}>
                    <CardMedia
                      component="img"
                      height="340"
                      image={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                      alt={tv.name}
                      sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" align="center" sx={{ fontWeight: 600 }}>
                        {tv.name}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
                {series.length === 0 && (
                  <Typography align="center" color="grey.500" sx={{ px: 2 }}>No top rated series available.</Typography>
                )}
              </Box>
              {series.length > perPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                  <Pagination
                    count={Math.ceil(series.length / perPage)}
                    page={seriesPage}
                    onChange={(_, val) => setSeriesPage(val)}
                    color="primary"
                  />
                </Box>
              )}
              <MovieDialog open={dialogOpen} onClose={() => setDialogOpen(false)} movie={selectedMovie} />
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage; 