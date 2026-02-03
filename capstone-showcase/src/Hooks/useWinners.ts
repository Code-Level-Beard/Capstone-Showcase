import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // To detect when URL changes, to force hook fetch data whenever user clicks something in the top nav

export type ShowcaseEntry = {
  course: string;
  video: string;
  id: number;
  shouldDisplay: "YES" | "NO";
  position: number;
  members: string;
  Sponsor: string;
  description: string;
  ProjectTitle: string;
  winning_pic: string | null;
  NDA: "Yes" | "No";
  year: number;
  semester: "Spring" | "Summer" | "Fall" | "Winter";
  department?: string;
};

interface Filters {
  semester: string;
  year: string;
  department: string;
};

export default function useWinners() {
  const location = useLocation(); // To listen to URL changes
  const [pastWinnersData, setPastWinnersData] = useState<ShowcaseEntry[]>([]);
  const [filteredWinnersData, setFilteredWinnersData] = useState<ShowcaseEntry[]>([]);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState<Filters>({
    semester: "all",
    year: "all",
    department: "all",
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i);
  const API_BASE_URL = import.meta.env.PROD
    ? "/api" // Relative URL - will use https://showcase.asucapstone.com/api
    : "http://localhost:3000/api";
  // EFFECT 1: Sync URL with Data
  // Rruns whenever URL changes (e.g., clicking "Fall 2024" in Nav)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlSem = queryParams.get("semester") || "all";
    const urlYear = queryParams.get("year") || "all";
    setFilters(prev => ({ ...prev, semester: urlSem, year: urlYear })); // Update the dropdown states to match the URL

    // Fetch from backend using URL params
    fetch(`${API_BASE_URL}/winners?semester=${urlSem}&year=${urlYear}`)
      .then((res) => res.json())
      .then((data) => {
        setPastWinnersData(data);
        setHasFiltered(false); // Resets in-page filtering when moving to new year
        setSearchValue("");
      })
      .catch(() => setPastWinnersData([]));
  }, [location.search]); // Triggered by URL changes

  const departmentMap: Record<string, string> = {
    "computer-science": "CS/E",
    "computer-systems-engineering": "Computer Systems Engineering",
    "biomedical-engineering": "Biomedical Engineering",
    "mechanical-engineering": "Mechanical Engineering",
    "electrical-engineering": "Electrical Engineering",
    "industrial-engineering": "IEE",
    "informatics": "Informatics",
    "interdisciplinary": "Interdisciplinary",
  };

  function applyTextSearch(data: ShowcaseEntry[], text: string) {
    if (!text) return data;
    const value = text.toLowerCase();
    return data.filter((entry) => {
      return (
        entry.ProjectTitle.toLowerCase().includes(value) ||
        entry.members.toLowerCase().includes(value) ||
        entry.description.toLowerCase().includes(value) ||
        entry.Sponsor.toLowerCase().includes(value)
      );
    });
  }

  function applySelectFilters(data: ShowcaseEntry[], f: Filters) {
    return data.filter((entry) => {
      const semester = f.semester.toLowerCase();
      const year = f.year.toLowerCase();
      const department = f.department.toLowerCase();

      return (
        (semester === "all" || entry.semester.toLowerCase() === semester) &&
        (year === "all" || entry.year.toString() === year) &&
        (department === "all" || entry.ProjectTitle.includes(departmentMap[department as keyof typeof departmentMap]))
      );
    });
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setHasFiltered(true);
    const searched = applyTextSearch(pastWinnersData, value);
    setFilteredWinnersData(searched);
  };

  // This handles the "In-Page" filter button
  const handleFilterSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setHasFiltered(true);

    let results = [...pastWinnersData]; // To filter the data we already fetched for specific year

    // Apply Department filter
    if (filters.department !== "all") {

      const prefix = departmentMap[filters.department]; // e.g., "CS/E"
      results = results.filter((entry) => {
        const matchesMajor = entry.course === filters.department; // Matches the official Major
        const matchesPrefix = entry.ProjectTitle.startsWith(prefix); // OR title starts with the Department Code (CS/E, MEE, etc.)
        return matchesMajor || matchesPrefix;
      });

      // old filter
      //const deptKey = departmentMap[filters.department];
      //results = results.filter(entry => entry.ProjectTitle.includes(deptKey));
    }

    // Apply Search text
    if (searchValue) {
      results = applyTextSearch(results, searchValue);
    }
    setFilteredWinnersData(results);

    // old filter
    //const filtered = applySelectFilters(pastWinnersData, filters);
    //setFilteredWinnersData(filtered);
  };

  const clearFilters = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setHasFiltered(false);
    setSearchValue("");
    setFilteredWinnersData([]);
    setFilters({ semester: "all", year: "all", department: "all" });
  };

  return {
    pastWinnersData,
    filteredWinnersData,
    hasFiltered,
    searchValue,
    setSearchValue,
    filters,
    setFilters,
    years,
    handleSearchChange,
    handleFilterSubmit,
    clearFilters,
  } as const;
}