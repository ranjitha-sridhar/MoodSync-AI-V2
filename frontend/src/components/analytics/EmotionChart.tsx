import {

    Line

} from "react-chartjs-2";


import {

    Chart as ChartJS,

    CategoryScale,

    LinearScale,

    PointElement,

    LineElement,

    Tooltip,

    Legend

} from "chart.js";


import "./EmotionChart.css";



ChartJS.register(

    CategoryScale,

    LinearScale,

    PointElement,

    LineElement,

    Tooltip,

    Legend

);



export default function EmotionChart(){


    const data = {


        labels:[

            "Mon",

            "Tue",

            "Wed",

            "Thu",

            "Fri",

            "Sat",

            "Sun"

        ],


        datasets:[

            {

                label:"Mood Score",


                data:[

                    65,

                    72,

                    80,

                    60,

                    90,

                    85,

                    92

                ],


                tension:0.4,


                borderWidth:3


            }


        ]

    };



    const options = {


        responsive:true,


        plugins:{


            legend:{


                display:true,


                labels:{


                    color:"white"


                }


            }


        },


        scales:{


            x:{


                ticks:{


                    color:"#aaa"


                }

            },


            y:{


                ticks:{


                    color:"#aaa"


                },


                min:0,


                max:100


            }


        }


    };



    return (

        <div className="chart-card">


            <h2>
                Emotion History 📈
            </h2>


            <Line

                data={data}

                options={options}

            />


        </div>

    );

}