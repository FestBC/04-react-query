import { useState } from "react";

import css from "./App.module.css";

import toast, { Toaster } from "react-hot-toast";

import { type Movie } from "../../types/movie";
import { fetchTmdb } from "../../services/movieService";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedMovie, setClickedMovie] = useState<Movie>( {
    id: 0,
    poster_path: "",
    backdrop_path: "",
    title: "",
    overview: "",
    release_date: "",
    vote_average: 0
  } );

  const handleSubmit = async (query: string) => {
    try {
      setIsError(false);
      setIsLoading(true);

      const results = await fetchTmdb(query);

      if (results.length > 0) {
        setMovies(results);
      } else {
        toast.error("No movies found for your request.");
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSelect = (movie: Movie): void => {
    setIsModalOpen(true);
    setClickedMovie(movie);
  }

  const handleClose = (): void => {
    setIsModalOpen(false);
    setClickedMovie( {
      id: 0,
      poster_path: "",
      backdrop_path: "",
      title: "",
      overview: "",
      release_date: "",
      vote_average: 0
    } );
  }

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleSubmit} />
      {movies.length > 0 && <MovieGrid onSelect={handleSelect} movies={movies} />}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isModalOpen && <MovieModal movie={clickedMovie} onClose={handleClose} />}
    </div>
  );
}