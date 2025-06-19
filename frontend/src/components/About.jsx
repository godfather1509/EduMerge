const About = () => {

    return (
        <>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '40px 20px',
                fontFamily: 'Segoe UI, sans-serif',
                lineHeight: '1.8',
                color: 'white',
            }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                    <strong style={{ color: '#1a73e8' }}>EduMerge</strong> is a fully open-source platform created for researchers, students, and lifelong learners to easily discover and access high-quality, free educational content from across the internet. As a unified ecosystem, EduMerge consolidates open courseware, educational repositories, and freely available learning resources from various platforms into a single, well-organized interface. Our mission is to make education universally accessible by centralizing diverse learning materials and making them simple to search, explore, and manage.
                </p>
                <p style={{ fontSize: '1.2rem' }}>
                    With advanced resource management capabilities, EduMerge allows users to create, retrieve, update, and delete educational content while categorizing it by subject, difficulty level, and content type (e.g., video, article, or course). The platform includes a secure user management system with authentication, enabling personalized learning experiences through features such as bookmarking, progress tracking, ratings, and user reviews. Whether you’re self-learning, teaching, or conducting research, EduMerge provides a powerful, all-in-one solution for accessing and managing the world’s best free educational resources.
                </p>
            </div>
        </>
    )
}


export default About;