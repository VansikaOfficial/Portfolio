import { Grid, Skeleton, Stack } from '@mui/material';

export default function CardGridSkeleton({ count = 6, minHeight = 220 }: { count?: number; minHeight?: number }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Stack spacing={1.5}>
            <Skeleton variant="rounded" height={minHeight} sx={{ borderRadius: 3 }} />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="45%" />
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
}
