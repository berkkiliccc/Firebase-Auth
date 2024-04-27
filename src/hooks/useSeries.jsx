import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useState } from "react";

export default function useSeries() {
  const [seriesList, setSeriesList] = useState([]);
  const [serie, setSerie] = useState(null);

  const seriesCollectionRef = collection(db, "Series");

  const getSeriesList = async () => {
    try {
      const data = await getDocs(seriesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSeriesList(filteredData);

      // console.log("MovieList =>", filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  const getSerie = async (seriesId) => {
    try {
      const docRef = doc(seriesCollectionRef, seriesId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSerie(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log("Error getting document:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const seriesDoc = doc(seriesCollectionRef, id);
      await deleteDoc(seriesDoc);
      setSeriesList((prev) => prev.filter((series) => series.id !== id));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  return {
    seriesList,
    getSeriesList,
    handleDelete,
    serie,
    getSerie,
  };
}
