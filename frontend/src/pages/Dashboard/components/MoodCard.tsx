import "./MoodCard.css";


const MoodCard = () => {

    return (

        <div className="mood-card">

            <h2>
                Today's Mood 😊
            </h2>

            <div className="emoji">
                😄
            </div>

            <p>
                You seem positive today!
            </p>


            <button>
                Analyze Mood
            </button>

        </div>

    );

};


export default MoodCard;