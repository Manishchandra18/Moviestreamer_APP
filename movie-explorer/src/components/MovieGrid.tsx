import { Grid, Card, CardMedia, CardContent, Typography, Skeleton, Container, IconButton  } from "@mui/material";
import { motion } from "framer-motion";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

type Movie = {
  id: number;
  title: string;
  poster_path: string;
};

type Props = {
  movies: Movie[];
  loading: boolean;
  onSelect: (movieId: number) => void;
  favorites?: Movie[];
  onToggleFavorite?: (movie: Movie) => void;
};

export const MovieGrid = ({ movies, loading, onSelect, favorites = [], onToggleFavorite }: Props) => {
  const isFavoritesPanel = favorites && movies.length === favorites.length && movies.length === 2;
  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 10, md: 12 }, ml: { xs: 0, sm: 0, md: '3cm' }, mr: { xs: 0, sm: 0, md: '3cm' } }}>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{
          margin: '0 auto',
          maxWidth: { xs: '100%', sm: 600, md: 960, lg: 1280 },
          px: { xs: 0, sm: 2 },
        }}
      >
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <Grid size={{xs:6,sm:4,md:3,lg:3}} key={i}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={320}
                  sx={{
                    borderRadius: 3,
                    minWidth: { xs: 180, sm: 220, md: 240, lg: 260 },
                    maxWidth: { xs: '100%', sm: 320, md: 340, lg: 360 },
                    mx: 'auto',
                  }}
                />
              </Grid>
            ))
        : movies.map((movie, idx) => {
            const isFavorite = favorites.some(fav => fav.id === movie.id);
            return (
              <Grid
                size={{xs:12,sm:4,md:3,lg:3}}
                key={movie.id}
                sx={isFavoritesPanel ? { mr: 6 } : {}}
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.5, type: "spring" }}
                  whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(144,202,249,0.25)" }}
                  style={{ borderRadius: 16, width: '100%' }}
                >
                  <Card
                    onClick={() => onSelect(movie.id)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 3,
                      boxShadow: 6,
                      transition: 'box-shadow 0.3s',
                      position: 'relative',
                      minWidth: { xs: 180, sm: 220, md: 240, lg: 260 },
                      maxWidth: { xs: '100%', sm: 320, md: 340, lg: 360 },
                      mx: 'auto',
                    }}
                  >
                    <IconButton
                      onClick={e => {
                        e.stopPropagation();
                        onToggleFavorite && onToggleFavorite(movie);
                      }}
                      sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, color: isFavorite ? 'error.main' : 'grey.400' }}
                      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                    <CardMedia
                      component="img"
                      height="320"
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
                </motion.div>
              </Grid>
            );
          })}
      </Grid>
    </Container>
  );
};
