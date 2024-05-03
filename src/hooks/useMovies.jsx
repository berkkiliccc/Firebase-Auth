import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { useState } from "react";
import { deleteObject, listAll, ref } from "firebase/storage";

export default function useMovies() {
  const [movieList, setMovieList] = useState([]);
  const [movie, setMovie] = useState(null);

  const moviesCollectionRef = collection(db, "Movies");

  const getMovieList = async () => {
    try {
      const moviesCollectionRef = collection(db, "Movies");
      const snap = await getDocs(moviesCollectionRef);
      const docs = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMovieList(docs);

      // console.log("MovieList =>", filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  const getMovie = async (movieId) => {
    try {
      const docRef = doc(moviesCollectionRef, movieId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMovie(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log("Error getting document:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const colRef = collection(db, "Movies");
      const movieDoc = doc(colRef, id);
      const directoryRef = ref(storage, `/moviePicture/${id}`);

      // Tüm dosyaları listele
      const listResult = await listAll(directoryRef);

      // Her dosyayı tek tek sil
      await Promise.all(
        listResult.items.map(async (item) => {
          await deleteObject(item);
        })
      );

      await deleteDoc(movieDoc);
      setMovieList((prev) => prev.filter((movie) => movie.id !== id));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  return {
    getMovieList,
    movieList,
    getMovie,
    movie,
    handleDelete,
  };
}
