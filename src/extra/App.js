import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { db } from "./config/firebase";
import { getDocs,doc, collection,addDoc,deleteDoc,updateDoc } from "firebase/firestore";

function App() {
  const [movieList, setMovieList] = useState([]);

  //new movie states
  const [newMovieTitle, setnewMovieTitle] = useState("");
  const [newReleaseDate, setnewReleaseDate] = useState(0);
  const [isOscar, setisOscar] = useState(false);

  const [updatedTitle, setupdatedTitle] = useState("")
  const movieCollectionRef = collection(db, "movies");
  
  const getMovieList = async () => {
    try {
      const data = await getDocs(movieCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
      // console.log(filteredData);
    } catch (err) {
      console.error(err);
    }
    //setstate
  };
  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () =>{
    try{
    await addDoc(movieCollectionRef,{
      title: newMovieTitle,
      releasedDate: newReleaseDate,
      receivedAnOscar: isOscar
    });

    getMovieList();
  }catch (err) {
    console.error(err);
  }
  };

  const deleteMovie = async (id) => {
      const movieDoc = doc(db,"movies",id);
      await deleteDoc(movieDoc);
      getMovieList();
  }

  const UpdateMovie = async (id) => {
    const movieDoc = doc(db,"movies",id);
    await updateDoc(movieDoc, {title:updatedTitle});
    getMovieList();
}
  return (
    <div className="App">
      <Auth />
      <hr />
      <div>
        <input
          placeholder="title"
          onChange={(e) => setnewMovieTitle(e.target.value)}
        />
        <input
          placeholder="Released"
          type="number"
          onChange={(e) => setnewReleaseDate(Number(e.target.value))}

        />
        <input type="checkbox" onChange={(e) => setisOscar(e.target.checked)} checked={isOscar}/>
        <label>Received An Oscar</label>
        <button onClick={onSubmitMovie}>Add movie</button>
      </div>
      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
              {movie.title} | 
              <small> {movie.releasedDate}</small>
            </h1>
            <button onClick={()=>deleteMovie(movie.id)}>Delete Movie</button>

            <input placeholder="new Tilte" onChange={(e)=> setupdatedTitle(e.target.value)}/>
            <button onClick={()=> UpdateMovie(movie.id)}>Update title</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
