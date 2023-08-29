"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pagination from "./Pagination";
import Noimage from "../../public/noimg.png";

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [formatFilter, setFormatFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [tcount, setTcount] = useState(0);

  const [totalpage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [copyrightFilter, setCopyrightFilter] = useState("");
  const [subject, setSubject] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const handleReset = () => {
    setSearchTerm("");
    setSearchResults([]);
    setFormatFilter("");
    setLanguageFilter("");
    setSelectedLanguages([]);
    setTcount(0);
    setTotalPage(0);
    setCurrentPage(1);
    // setLoading(false);
    // setNoData(false);
  };

  const handleSearch = debounce(async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      return;
    }

    try {
      setLoading(true);
      setNoData(false);
      let url;
      const isNumeric = /^\d+(,\d+)*$/.test(searchTerm);
      !isNumeric
        ? (url = `https://gutendex.com/books?search=${searchTerm}`)
        : (url = `https://gutendex.com/books?ids=${searchTerm}`);

      const response = await fetch(url);
      // const response = await fetch(
      //   `https://gutendex.com/books?search=${searchTerm}`
      // );
      if (!response.ok) {
        console.log("No Data found");
        setNoData(true); // Show noData message
        setLoading(false); // Hide loading spinner
        return;
      }
      const { count, results } = await response.json();
      setTcount(count);
      setTotalPage(Math.ceil(count / 32));
      setSearchResults(results);
      setCurrentPage(1);
      setLoading(false);
      if (count === 0) {
        setNoData(true); // Show noData message
        setTcount(count);
      }
    } catch (error) {
      console.log("Error occurred while fetching data:", error);
      setLoading(false);
    }
  }, 500);

  const sortResults = (results, order) => {
    const sortedResults = [...results]; // Clone the array to avoid mutating the original
    sortedResults.sort((a, b) => {
      const idA = a.id;
      const idB = b.id;
      if (order === "asc") {
        return idA - idB;
      } else {
        return idB - idA;
      }
    });
    setSearchResults(sortedResults);
  };
  const handleSortOrder = (e) => {
    setSortOrder(e.target.value);
    sortResults(searchResults, e.target.value);
  };

  const getData = async (cpage) => {
    try {
      setLoading(true);
      setNoData(false);
      const queryParams = [];
      if (searchTerm.trim() !== "") {
        console.log(searchTerm);
        const isNumeric = /^\d+(,\d+)*$/.test(searchTerm);
        !isNumeric
          ? queryParams.push(`search=${encodeURIComponent(searchTerm)}`)
          : queryParams.push(`ids=${encodeURIComponent(searchTerm)}`);
      }
      if (selectedLanguages.length > 0) {
        queryParams.push(`languages=${selectedLanguages.join(",")}`);
      }
      if (copyrightFilter !== "") {
        queryParams.push(`copyright=${copyrightFilter}`);
      }

      const queryString =
        queryParams.length > 0 ? `&${queryParams.join("&")}` : "";
      const url = `https://gutendex.com/books/?page=${cpage}${queryString}`;
      const response = await fetch(url);

      if (!response.ok) {
        setNoData(true); // Show noData message
        setLoading(false);
        throw new Error("No Data found");
      }
      const { count, results } = await response.json();
      const uniqueSubjects = new Set();
      results.forEach((b) => {
        b.subjects.forEach((s) => {
          uniqueSubjects.add(s);
        });
      });
      setSubject(Array.from(uniqueSubjects));

      sortResults(results, sortOrder);

      setTcount(count);
      setTotalPage(Math.ceil(count / 32));
      setSearchResults(results);
      setLoading(false);
      if (count === 0) {
        setNoData(true); // Show noData message
        setTcount(count);
      }
    } catch (error) {
      console.log("Error occurred while fetching data:", error);
      setLoading(false);
    }
  };

  const handleCheckboxChange = (language) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(
        selectedLanguages.filter((lang) => lang !== language)
      );
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  useEffect(() => {
    getData(currentPage);
  }, [currentPage, selectedLanguages, copyrightFilter]);

  return (
    <main className={styles.main}>
      <div>
        <div style={{ padding: "10px", textAlign: "center" }}>
          <h1>Book Lookup App</h1>
        </div>

        <div className={styles.search_bar}>
          <input
            type="text"
            placeholder="Enter book title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <button onClick={handleReset}>Reset</button>
        </div>
        <div>
          <h2>
            Results:{" "}
            {tcount > 1 ? `${tcount} books found.` : `${tcount} book found.`}
          </h2>
        </div>

        <div className={styles.mainwrapper}>
          <div className={styles.sidebar}>
            <div className={styles.format_filter}>
              <h2>Language</h2>
              <div>
                <div style={{ margin: "5px", padding: "5px" }}>
                  <input
                    type="checkbox"
                    value="en"
                    checked={selectedLanguages.includes("en")}
                    onChange={() => handleCheckboxChange("en")}
                  />
                  <label style={{ marginLeft: "5px" }}>English</label>
                </div>

                <div style={{ margin: "5px", padding: "5px" }}>
                  <input
                    type="checkbox"
                    value="fr"
                    checked={selectedLanguages.includes("fr")}
                    onChange={() => handleCheckboxChange("fr")}
                  />
                  <label style={{ marginLeft: "5px" }}>French</label>
                </div>
                <div style={{ margin: "5px", padding: "5px" }}>
                  <input
                    type="checkbox"
                    value="fi"
                    checked={selectedLanguages.includes("fi")}
                    onChange={() => handleCheckboxChange("fi")}
                  />
                  <label style={{ marginLeft: "5px" }}>Swedish</label>
                </div>
              </div>
            </div>

            <div className={styles.format_filter}>
              <h2>Copyright</h2>
              <select
                value={copyrightFilter}
                onChange={(e) => setCopyrightFilter(e.target.value)}
              >
                <option value="">Select Copyright</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className={styles.format_filter}>
              <h2>Sort by ID</h2>
              <select value={sortOrder} onChange={handleSortOrder}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <div className={styles.book_card}>
            {loading && <div>Loading...</div>}
            {noData && <div>No Data Found!</div>}
            {!loading &&
              !noData &&
              searchResults.map((result, index) => (
                <div key={index}>
                  <BookCard result={result} />
                  {/* <p>Title: {result.title}</p>
              <p>Author: {result.author}</p>
              <p>Format: {result.format}</p>
              <p>Language: {result.language}</p> */}
                </div>
              ))}
          </div>
        </div>
      </div>

      {totalpage > 1 && (
        <Pagination
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalpage={totalpage}
        />
      )}
    </main>
  );
}

const BookCard = ({ result }) => {
  return (
    <div className={styles.product_card}>
      <div className={styles.image_wrapper}>
        <Image
          width={100}
          height={100}
          className={styles.product_image}
          src={
            result.formats?.["image/jpeg"]
              ? result.formats?.["image/jpeg"]
              : Noimage
          }
          alt={
            result.formats?.["image/jpeg"]
              ? result.formats?.["image/jpeg"]
              : Noimage
          }
        />
      </div>
      <div className={styles.product_info}>
        {/* <div className={styles.titlehead}> */}
        <div> Book Id: {result.id}</div>
        <div className={styles.titlehead}>Book Title: {result.title}</div>
        {/* </div> */}
        <div className={styles.product_description}>
          {result.authors?.map((p, index) => (
            <p className={styles.author} key={index}>
              Author : {p.name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
