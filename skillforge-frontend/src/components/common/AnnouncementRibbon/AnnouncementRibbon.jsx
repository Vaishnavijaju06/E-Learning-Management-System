import "./AnnouncementRibbon.css";

const announcements = [
  "🔥 Independence Sale - Flat 50% OFF on all Premium Courses",
  "🚀 New Course Added: System Design for Interviews",
  "🤖 Coming Soon: AI Prompt Engineering Masterclass",
  "💻 Java Spring Boot Advanced Batch starts on 15 August",
  "🎁 Use Code SKILL50 to get instant discount",
  "📢 New DSA Sheet with 250 Problems Added"
];

export default function AnnouncementRibbon() {
  return (
    <div className="announcement-wrapper">
      <div className="announcement-track">
        {[...announcements, ...announcements].map((item, index) => (
          <span key={index} className="announcement-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}