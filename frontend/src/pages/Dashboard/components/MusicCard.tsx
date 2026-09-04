import "./MusicCard.css";


const MusicCard = () => {

    return (

        <div className="music-card">

            <h2>
                AI Music Recommendation 🎵
            </h2>

            <p>
                Based on your mood:
                <b> Happy</b>
            </p>


            <div className="song">
                🎧 Perfect - Ed Sheeran
            </div>


            <button>
                Play Song
            </button>


        </div>

    );

};


export default MusicCard;