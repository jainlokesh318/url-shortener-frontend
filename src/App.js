import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [fullUrl, setFullUrl] = useState("");
  const [urls, setUrls] = useState(null);
  const [expiryTime, setExpiryTime] = useState("");

  const setUrlTable = () => {
    fetch("http://localhost:5000/api/url/")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUrls(data);
      });
  };

  useEffect(() => {
    setUrlTable();
  }, []);

  const handleFormSubmit = () => {
    let databody = {
      longUrl: fullUrl,
      expiresOn: expiryTime,
    };

    fetch("http://localhost:5000/api/url/shorten", {
      method: "POST",
      body: JSON.stringify(databody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUrlTable();
        console.log(data);
      });

    setFullUrl("");
  };

  return (
    <div className="App container">
      <h1>URL Shortener</h1>
      <div className="my-4">
        <input
          type="url"
          className="form-control"
          placeholder="Enter Full URL"
          onChange={(e) => setFullUrl(e.target.value)}
          value={fullUrl}
          required
        />

        <input
          type="datetime-local"
          onChange={(e) => setExpiryTime(e.target.value)}
        />

        <button
          className="btn btn-success my-2"
          type="submit"
          onClick={handleFormSubmit}
        >
          Shorten URL
        </button>
      </div>
      {urls ? (
        <table className="table table-striped my-4">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Full Url</th>
              <th scope="col">Short Url</th>
              <th scope="col">Expires On</th>
            </tr>
          </thead>
          <tbody>
            {urls
              .filter((url) => {
                console.log(Date.parse(url.expiryDate));
                if (
                  url.expiryDate === null ||
                  Date.parse(url.expiryDate) > Date.now()
                )
                  return true;
              })
              .map((url, index) => {
                return (
                  <tr key={url.shortUrl}>
                    <th>{index + 1}</th>
                    <th>{url.longUrl}</th>
                    <th>{url.shortUrl}</th>
                    <th>{url.expiryDate || "No Expiry"}</th>
                  </tr>
                );
              })}
          </tbody>
        </table>
      ) : (
        "Loading..."
      )}
    </div>
  );
}

export default App;
