"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConstituentsTable from "./DataTable";
import { ThemeProvider } from "@emotion/react";
import { createTheme, Typography } from "@mui/material";
import { themeOptions } from "@/app/ThemeOptions";

export default function Home() {
  const queryClient = new QueryClient();
  const theme = createTheme(themeOptions);

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Typography variant="h3">
          Constituents
        </Typography>
        <ConstituentsTable />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
