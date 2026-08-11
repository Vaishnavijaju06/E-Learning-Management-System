import { useEffect, useRef, useState } from "react";
import "./StatsCounter.css";

const stats = [
    {
        icon: "bi-people-fill",
        number: 10000,
        suffix: "+",
        title: "Students Enrolled",
        color: "#FFF4E5",
    },
    {
        icon: "bi-journal-bookmark-fill",
        number: 150,
        suffix: "+",
        title: "Premium Courses",
        color: "#FDECEC",
    },
    {
        icon: "bi-camera-video-fill",
        number: 2500,
        suffix: "+",
        title: "Video Lessons",
        color: "#E8F7FD",
    },
    {
        icon: "bi-award-fill",
        number: 5000,
        suffix: "+",
        title: "Certificates Issued",
        color: "#F0ECFF",
    },
];

function Counter({ end }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const increment = Math.ceil(end / (duration / 20));

        const timer = setInterval(() => {
            start += increment;

            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 20);

        return () => clearInterval(timer);
    }, [end]);

    return <>{count.toLocaleString()}</>;
}

export default function StatsCounter() {
    const sectionRef = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.3,
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section className="stats-section" ref={sectionRef}>
            <div className="container">

                <div className="text-center mb-5">
                    <h2 className="fw-bold">A Platform Trusted by Learners</h2>
                    <p className="text-muted">
                        Numbers that reflect our growing learning community.
                    </p>
                </div>

                <div className="row g-4">

                    {stats.map((item) => (
                        <div className="col-md-6 col-lg-3" key={item.title}>
                            <div
                                className="stats-card"
                                style={{ background: item.color }}
                            >
                                <i className={`bi ${item.icon}`}></i>

                                <h2>
                                    {visible ? <Counter end={item.number} /> : 0}
                                    {item.suffix}
                                </h2>

                                <p>{item.title}</p>

                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
}