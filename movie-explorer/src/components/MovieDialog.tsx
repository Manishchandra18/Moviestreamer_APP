import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Grid, Box, IconButton, Chip, Stack } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import WhatshotIcon from '@mui/icons-material/Whatshot';


function getRottenTomatoesRating(movie: any): string | null {
 
  if (movie.ratings && Array.isArray(movie.ratings)) {
    const rt = movie.ratings.find((r: any) => r.Source === 'Rotten Tomatoes');
    return rt ? rt.Value : null;
  }
  if (movie.external_ratings && Array.isArray(movie.external_ratings)) {
    const rt = movie.external_ratings.find((r: any) => r.Source === 'Rotten Tomatoes');
    return rt ? rt.Value : null;
  }
  return null;
}

type Props = {
  open: boolean;
  onClose: () => void;
  movie: any;
};

export const MovieDialog = ({ open, onClose, movie }: Props) => {
  if (!movie) return null;
  const rottenTomatoes = getRottenTomatoesRating(movie);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" sx={{ '& .MuiDialog-paper': { borderRadius: 4, position: 'relative' } }}>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          color: (theme) => theme.palette.grey[500],
          zIndex: 10,
        }}
      >
        <CloseIcon fontSize="large" />
      </IconButton>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 28, letterSpacing: 1, pr: 6 }}>{movie.title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid size={{xs:12,md:5}} >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '100%', maxWidth: 320, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}
              />
            </Box>
          </Grid>
          <Grid size={{xs:12,md:7}}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Chip icon={<StarIcon sx={{ color: 'gold' }} />} label={`TMDB: ${movie.vote_average ? movie.vote_average + ' / 10' : 'N/A'}`} color="default" sx={{ fontWeight: 600, fontSize: 16 }} />
              {rottenTomatoes && (
                <Chip icon={<WhatshotIcon sx={{ color: 'red' }} />} label={`Rotten Tomatoes: ${rottenTomatoes}`} color="default" sx={{ fontWeight: 600, fontSize: 16 }} />
              )}
              {movie.popularity && (
                <Chip icon={<WhatshotIcon />} label={`Popularity: ${Math.round(movie.popularity)}`} color="default" />
              )}
            </Stack>
            {movie.tagline && (
              <Typography variant="subtitle1" sx={{ fontStyle: 'italic', color: 'grey.400', mb: 2 }}>
                {movie.tagline}
              </Typography>
            )}
            <Typography variant="body1" sx={{ mb: 2, fontSize: 18 }}>
              {movie.overview || 'No overview available.'}
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 500 }}>
              Release Date: <b>{movie.release_date || 'N/A'}</b>
            </Typography>
            {movie.genres && Array.isArray(movie.genres) && movie.genres.length > 0 && (
              <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 500 }}>
                Genres: <b>{movie.genres.map((g: any) => g.name).join(', ')}</b>
              </Typography>
            )}
            {movie.runtime && (
              <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 500 }}>
                Runtime: <b>{movie.runtime} min</b>
              </Typography>
            )}
            {movie.original_language && (
              <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 500 }}>
                Language: <b>{movie.original_language.toUpperCase()}</b>
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};
