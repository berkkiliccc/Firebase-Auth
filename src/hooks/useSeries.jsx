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

export default function useSeries() {
  const [seriesList, setSeriesList] = useState([]);
  const [serie, setSerie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const seriesCollectionRef = collection(db, "Series");

  const getSeriesList = async () => {
    try {
      setIsLoading(true);
      const data = await getDocs(seriesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSeriesList(filteredData);

      // console.log("MovieList =>", filteredData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSerie = async (seriesId) => {
    try {
      setIsLoading(true);
      const docRef = doc(seriesCollectionRef, seriesId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSerie(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log("Error getting document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const seriesDoc = doc(seriesCollectionRef, id);
      const directoryRef = ref(storage, `/seriesPicture/${id}`);

      // Tüm dosyaları listele
      const listResult = await listAll(directoryRef);

      // Her dosyayı tek tek sil
      await Promise.all(
        listResult.items.map(async (item) => {
          await deleteObject(item);
        })
      );

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
    isLoading,
  };
}
