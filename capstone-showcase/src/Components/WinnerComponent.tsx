
import "../CSS/WinnerComponent.css";

import { Link } from "react-router-dom";

const displayDepartmentMap: Record<string, string> = {
  "computer-science": "Computer Science",
  "computer-systems-engineering": "Computer Systems Engineering",
  "biomedical-engineering": "Biomedical Engineering",
  "mechanical-engineering": "Mechanical Engineering",
  "electrical-engineering": "Electrical Engineering",
  "industrial-engineering": "Industrial Engineering",
  "informatics": "Informatics",
  "interdisciplinary": "Interdisciplinary",
};

type ShowcaseEntry = {
  course: string;
  id: number;
  video: string;
  shouldDisplay: "YES" | "NO";
  position: number;
  members: string;
  Sponsor: string;
  description: string;
  ProjectTitle: string;
  winning_pic: string | null;
  department?: string;
  NDA: "Yes" | "No";
  year: number;
  semester: "Spring" | "Summer" | "Fall" | "Winter";
};

export function WinnerComponent({ winners }: { winners: ShowcaseEntry[] }) {
  const getSource = (position?: number) => {
    switch (position) {
      case 1:
        return "/1stplace.svg";
      case 2:
        return "/2ndplace.svg";
      case 3:
        return "/3rdplace.svg";
      default:
        return "";
    }
  };

  const getbackground = (position?: number) => {
    switch (position) {
      case 1:
        return "#FFD700";
      case 2:
        return "#C0C0C0";
      case 3:
        return "#CD7F32";
      default:
        return "";
    }
  };
    const STATIC_BASE_URL =
    import.meta.env.PROD ? "" : "http://localhost:3000";

  const API_BASE_URL =
    import.meta.env.PROD
      ? "/api"
      : "http://localhost:3000/api";

    const normalizePathToUrl = (path: string) => {
    if (!path) return "";
    const thumbnail = path.split(",")[0];
    if (!thumbnail) return "";
    const trimmed = thumbnail.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `${STATIC_BASE_URL}/${trimmed.replace(/^\/+/, "")}`;
  };

  return (
    <div className="winner-component__parent-container">
      {winners.length === 0 ? (
        <p className="winner-component__no-results">No results found.</p>
      ) : (
        <div className="winner-component__winner-container">
          {winners.map((winner: ShowcaseEntry, index: number) => (
            <div key={index} className="winner-component__winner-card">
              {/* Image placeholder */}
              <div className="winner-component__winner-image">
                <img
                  src={normalizePathToUrl(winner.winning_pic || "")}
                  alt={winner.ProjectTitle}
                  className="winners-winners-winningpic"
                />
                <img
                  src={getSource(winner.position) || ""}
                  alt={winner.ProjectTitle}
                  className="winner-component__winner-medal"
                  style={{ background: getbackground(winner.position) }}
                />
              </div>

              {/* Text section */}
              <div className="winner-component__winner-text-section">
                <p
                  className="winner-component__winner-project"
                  title={winner.ProjectTitle}
                >
                  {winner.ProjectTitle}
                </p>
                <p
                  className="winner-component__winner-author"
                  title={winner.Sponsor || "John Doe"}
                >
                  by {winner.Sponsor || "John Doe"}
                </p>
                <div className="winner-component__winner-info-row">
                  <span className="winner-component__winner-semester">
                    {winner.semester} {winner.year}
                  </span>
                  <span className="winner-component__winner-department">
                    {displayDepartmentMap[winner.course] || winner.course || "General Engineering"}
                  </span>
                </div>
                <p className="winner-component__winner-description">
                  {winner.description}
                </p>
                <div className="winner-component__winner-details-link-container">
                  <Link
                    to={`/winners/entry/${winner.id || 0}`}
                    state={winner}
                    className="winner-component__winner-details-link"
                  >
                    More Details
                  </Link>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}