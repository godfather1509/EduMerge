import api from '../api/baseusrl'
import { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';

const CoursePage = () => {
    let { id,moduleId } = useParams();
    const [course, setCourse] = useState(null);
    moduleId=moduleId||0;
    const navigate = useNavigate()


    // const updateEnrolled = async () => {
    //     const newEnrolled = course[0].total_enrolled + 1;
    //     console.log(course)
    //     console.log(newEnrolled)
    //     try {
    //         const response = await api.patch(`/upload/enroll/${id}/`, {
    //             total_enrolled: newEnrolled
    //         });
    //         setCourse(response.data); // Store course data
    //         console.log("Fetched course:", response.data);
    //     } catch (error) {
    //         console.log(error.response?.data);
    //         console.log(error.response?.status);
    //     }
    // }

    useEffect(() => {
        const getCourse = async () => {
            try {
                const response = await api.get("/upload/course/", {
                    params: {
                        course: id
                    },
                    // headers: {
                    //     Authorization: `Bearer ${sessionStorage.getItem('access')}`
                    // }
                });

                setCourse(response.data); // Store course data
                console.log("Fetched course:", response.data);

            } catch (error) {
                console.log(error.response?.data);
                console.log(error.response?.status);
            }
        };

        if (id) getCourse(); // Only fetch if id exists
    }, [id]);

    const handleClick=(index)=>{
        navigate(`/course/${id}/${index}`)
    }

    return (
        <>
            {course ? (
                <>
                    <div className="max-w-screen-xl mx-auto px-6 mt-6">
                        <div className="flex flex-col lg:flex-row gap-10 items-start">

                            {/* Left Column: Video + Info */}
                            <div className="flex-grow flex flex-col gap-6">

                                {/* Video */}
                                <div className="relative pb-[56.25%] rounded-lg overflow-hidden shadow-lg">
                                    <ReactPlayer
                                        // url="https://www.youtube.com/watch?v=3BS4dOBQvIY" // replace with actual video URL
                                        url={`${import.meta.env.VITE_CLOUDFRONT_URL}/${course[0].modules[moduleId]['video_url']}`}
                                        // cloudfront url/aws key of each file
                                        controls
                                        pip
                                        width="100%"
                                        height="100%"
                                        className="absolute top-0 left-0"
                                    />
                                </div>

                                {/* Title */}
                                <h2 className="font-bold text-3xl">{course[0].course_name}</h2>

                                {/* Instructor Info + Enroll Button */}
                                <div className="flex items-center justify-between flex-wrap gap-4">

                                    {/* Instructor Info */}
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={
                                                course[0].instructor['gender'] === "FEMALE" ||
                                                    course[0].instructor['gender'] === "Female"
                                                    ? "../femaleInstructor.avif"
                                                    :
                                                    "../maleInstructor.jpg"
                                            }
                                            alt="Instructor"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold">
                                                Instructor: {course[0].instructor.first_name} {course[0].instructor.last_name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {course[0].instructor.qualification}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Enroll Button */}
                                    {/* {sessionStorage.getItem("role") === "student" && (
                                        <button className="bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-red-700 transition" onClick={updateEnrolled}>
                                            Enroll
                                        </button>
                                    )} */}
                                </div>

                                {/* Description */}
                                <p className="text-base text-white whitespace-pre-wrap">
                                    {course[0].description}
                                </p>
                            </div>

                            {/* Right Column: Modules */}
                            <div className="w-[400px] flex-shrink-0 flex flex-col gap-4">
                                <h3 className="text-center text-lg font-semibold text-white">Modules</h3>
                                {course[0].modules.map((module, index) => (
                                    <button
                                        key={index}
                                        className="cursor-pointer text-left text-black px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                                        onClick={()=>{handleClick(index)}}
                                    >
                                        {index + 1}. {module.module_name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>


            ) : (
                <>
                    <p className="text-center font-semibold">Loading course details...</p>
                </>
            )}
        </>

    );
};

export default CoursePage;
