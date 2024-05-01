import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../config/firebase";

export default function EditeSeriesModal() {
  const [editedSerie, setEditedSerie] = useState({
    title: "",
    topic: "",
    year: "",
    photoUrl: "",
  });

  const handleSave = async (id) => {
    const serieRef = doc(db, "Series", id);
    await updateDoc(serieRef, {
      title: editedSerie.title,
      topic: editedSerie.topic,
      year: editedSerie.year,
      photoUrl: editedSerie.photoUrl,
    });
  };
  return (
    <div>
      <input
        type="text"
        value={editedSerie.title}
        onChange={(e) =>
          setEditedSerie({ ...editedSerie, title: e.target.value })
        }
      />
      <input
        type="text"
        value={editedSerie.topic}
        onChange={(e) =>
          setEditedSerie({ ...editedSerie, topic: e.target.value })
        }
      />
      <input
        type="text"
        value={editedSerie.year}
        onChange={(e) =>
          setEditedSerie({ ...editedSerie, year: e.target.value })
        }
      />
      <input
        type="text"
        value={editedSerie.photoUrl}
        onChange={(e) =>
          setEditedSerie({ ...editedSerie, photoUrl: e.target.value })
        }
      />
      <button onClick={() => handleSave("serieId")}>Save</button>
    </div>
  );
}
