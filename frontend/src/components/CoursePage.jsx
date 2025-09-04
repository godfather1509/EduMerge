/*
This page has logic of bookmarking and unbookmarking a course, playing course videos from AWS cloudfront and navigating to other course modules
*/

import api from '../api/baseusrl'
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';

const CoursePage = () => {
    let { id, moduleId } = useParams();
    const [course, setCourse] = useState(null);
    const [bookmark, setBookmark] = useState(false)
    const [bookmarkData, setBookmarkData] = useState([])
    const avgRating = 0;
    moduleId = moduleId || 0;
    const navigate = useNavigate()

    const [reviews, setReviews] = useState([]);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewRating, setReviewRating] = useState(4);
    const [reviewText, setReviewText] = useState("");
    const [reviewError, setReviewError] = useState("");
    const handleSubmitReview = async () => {

    }
    const courseBookmark = async () => {
        const bookmarkName = course[0].course_name + "-" + course[0].instructor.first_name + " " + course[0].instructor.last_name
        // if course is not bookmarked
        if (bookmark === false) {
            // bookmark the course
            const newBookmark = {
                email: sessionStorage.getItem('email'),
                bookmark: [{
                    course_name_bookmark: bookmarkName,
                    bookmark_url: `/course/${id}`,
                    course_name: course[0].course_name,
                    instructor_name: course[0].instructor.first_name + " " + course[0].instructor.last_name,
                    instructor_email: course[0].instructor.email,
                    instructor_qualification: course[0].instructor.qualification
                }]
            }
            try {
                const response = await api.patch(`/auth/bookmark/`, newBookmark);
                // console.log(response.data);
                setBookmark(true)
                setBookmarkData(prev => [...prev, { course_name_bookmark: bookmarkName }]);
            } catch (error) {
                console.log(error.response?.data);
                console.log(error.response?.status);
                setBookmark(false)
            }
        }
        // if course is bookmarked already
        else {
            // un bookmark the course
            try {
                const response = await api.delete(`/auth/bookmark/`, { data: { bookmarkName } })
                // console.log("Course Removed", response)
                setBookmark(false)
                setBookmarkData(prev =>
                    prev.filter(b => b.course_name_bookmark !== bookmarkName)
                );
            } catch (error) {
                console.log(error.response?.data);
                console.log(error.response?.status);
            }
        }
    }

    useEffect(
        // get and set all bookmarks
        () => {
            const bookmarks = JSON.parse(sessionStorage.getItem('bookmarks')) // name of course bookmarked in database
            setBookmarkData(bookmarks)
        }, []
    )

    useEffect(() => {

        if (!course) return;

        const bookmarkName = `${course[0].course_name}-${course[0].instructor.first_name} ${course[0].instructor.last_name}`;

        let isBookmarked = undefined;
        for (let i = 0; i < bookmarkData.length; i++) {
            if (bookmarkData[i].course_name_bookmark === bookmarkName) {
                // match to see if bookmark present in backend matches bookmark name here
                isBookmarked = bookmarkData[i];
                break; // Stop the loop once we find a match
            }
        }

        if (isBookmarked === undefined) {
            setBookmark(false)
        }
        else {
            setBookmark(true)
        }
    }, [course, bookmarkData]); // will only run if bookmarkData and course are present

    useEffect(() => {
        // get the course info from database
        const getCourse = async () => {
            try {
                const response = await api.get("/upload/course/", {
                    params: {
                        course: id
                    },
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('access')}`
                    }
                });

                setCourse(response.data); // Store course data
                // setReviews(response.data['reviews'])
                console.log(response.data[0]['reviews'])
                console.log("Fetched course:", response.data);
            } catch (error) {
                console.log(error.response?.data);
                console.log(error.response?.status);
            }
        };
        if (id) getCourse(); // Only fetch if id exists
    }, [id]);

    useEffect(
        () => {
            sessionStorage.setItem('bookmarks', JSON.stringify(bookmarkData))
        }, [bookmarkData]
    )

    const handleClick = (index) => {
        navigate(`/course/${id}/${index}`)
    }

    return (
        <>
            {course ? (
                <>
                    <div className="max-w-screen-xl mx-auto px-6 mt-6">
                        <div className="flex flex-col lg:flex-row gap-10 items-start">

                            {/* Left Column: Video + Info + Reviews */}
                            <div className="flex-grow flex flex-col gap-6 order-1 lg:order-1">

                                {/* Video */}
                                <div className="relative pb-[56.25%] rounded-lg overflow-hidden shadow-lg">
                                    <ReactPlayer
                                        url={`${import.meta.env.VITE_CLOUDFRONT_URL}/${course[0].modules[moduleId]['video_url']}`}
                                        controls
                                        pip
                                        width="100%"
                                        height="100%"
                                        className="absolute top-0 left-0"
                                    />
                                </div>
                                {/* Title */}
                                <h2 className="font-bold text-3xl">{course[0].course_name}</h2>

                                {/* Instructor Info + Bookmark Button */}
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={
                                                course[0].instructor['gender'] === "FEMALE" ||
                                                    course[0].instructor['gender'] === "Female"
                                                    ? "../femaleInstructor.avif"
                                                    : "../maleInstructor.jpg"
                                            }
                                            alt="Instructor"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold">
                                                Instructor: {course[0].instructor.first_name}{" "}
                                                {course[0].instructor.last_name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {course[0].instructor.qualification}
                                            </p>
                                        </div>
                                    </div>

                                    {sessionStorage.getItem("name") !==
                                        `${course[0].instructor.first_name} ${course[0].instructor.last_name}` && (
                                            <button
                                                className={`cursor-pointer text-white font-semibold px-4 py-2 rounded transition ${bookmark
                                                        ? "bg-gray-500 hover:bg-gray-600"
                                                        : "bg-red-600 hover:bg-red-700"
                                                    }`}
                                                onClick={courseBookmark}
                                            >
                                                {bookmark ? "Bookmarked" : "Bookmark"}
                                            </button>
                                        )}
                                </div>

                                {/* Description */}
                                <p className="text-base text-white whitespace-pre-wrap">
                                    {course[0].description}
                                </p>
                                {/* ================= Modules (mobile: directly below video, desktop: right column) ================= */}
                                <div className="block lg:hidden w-full flex flex-col gap-4">
                                    <h3 className="text-center text-lg font-semibold text-white">Modules</h3>
                                    {course[0].modules.map((module, index) => (
                                        <button
                                            key={index}
                                            className="cursor-pointer text-left text-black px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                                            onClick={() => handleClick(index)}
                                        >
                                            {index + 1}. {module.module_name}
                                        </button>
                                    ))}
                                </div>

                                {/* ================= REVIEWS SECTION ================= */}
                                <section className="mt-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-bold text-white">Reviews</h2>
                                        <div className="text-sm text-gray-400">
                                            {avgRating ? (
                                                <>
                                                    <span className="font-semibold">{avgRating}</span>{" "}
                                                    <span className="text-gray-500">avg</span> •{" "}
                                                    <span className="text-gray-500">{reviews.length} reviews</span>
                                                </>
                                            ) : (
                                                <span className="text-gray-500">No reviews yet</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Review form */}
                                    <form
                                        onSubmit={handleSubmitReview}
                                        className="bg-gray-900 rounded-lg p-4 shadow-sm mb-6"
                                    >
                                        {reviewError && (
                                            <div className="text-sm text-red-600 mb-2">{reviewError}</div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-10 mb-3">
                                            <div>
                                                <label
                                                    htmlFor="rev-name"
                                                    className="block text-sm font-medium text-white"
                                                >
                                                    Title
                                                </label>
                                                <input
                                                    id="rev-name"
                                                    value={reviewTitle}
                                                    onChange={(e) => setReviewTitle(e.target.value)}
                                                    className="mt-1 bg-gray-50 block w-full border-gray-300 rounded-md text-black shadow-sm"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="rev-rating"
                                                    className="block text-sm font-medium text-white"
                                                >
                                                    Rating (1–5)
                                                </label>
                                                <input
                                                    id="rev-rating"
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                    value={reviewRating}
                                                    onChange={(e) => setReviewRating(e.target.value)}
                                                    className="mt-1 block bg-gray-50 w-full text-black border-gray-300 rounded-md shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <textarea
                                                id="rev-text"
                                                rows={2}
                                                value={reviewText}
                                                onChange={(e) => setReviewText(e.target.value)}
                                                className="mt-1 block w-full border-gray-300 bg-gray-800 text-white rounded-md shadow-sm"
                                                placeholder="Tell others what you thought..."
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="submit"
                                                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold"
                                            >
                                                Post
                                            </button>
                                        </div>
                                    </form>

                                    {/* Review list */}
                                    <div className="space-y-4">
                                        {reviews.length === 0 ? (
                                            <div className="text-gray-500">
                                                Be the first to review this course.
                                            </div>
                                        ) : (
                                            reviews.map((r, i) => (
                                                <article key={i} className="bg-white rounded-lg p-4 shadow-sm">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="text-sm text-black font-semibold">{r.title}</div>
                                                                <div className="text-xs text-black">
                                                                    • {new Date(r.createdAt).toLocaleDateString("en-GB")}
                                                                </div>
                                                            </div>
                                                            <div className="mt-2 text-sm text-black">{r.body}</div>
                                                        </div>
                                                        <div className="ml-4 flex-shrink-0">
                                                            <div className="bg-black px-3 py-1 rounded-full text-sm font-semibold text-white">
                                                                {r.rating}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </article>
                                            ))
                                        )}
                                    </div>
                                </section>
                                {/* ================= END REVIEWS ================= */}
                            </div>

                            {/* Right Column: Modules (desktop only) */}
                            <div className="hidden lg:flex w-[400px] flex-shrink-0 flex-col gap-4 order-2">
                                <h3 className="text-center text-lg font-semibold text-white">Modules</h3>
                                {course[0].modules.map((module, index) => (
                                    <button
                                        key={index}
                                        className="cursor-pointer text-left text-black px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                                        onClick={() => handleClick(index)}
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
