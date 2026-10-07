import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      const token = localStorage.getItem("ocuvision_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3001/api/predictions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Failed to load prediction history."
          );
          return;
        }

        setPredictions(data.predictions || []);
      } catch (error) {
        console.error("Dashboard error:", error);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [navigate]);

  const totalPredictions = predictions.length;

  const averageConfidence =
    totalPredictions > 0
      ? (
          predictions.reduce(
            (total, item) =>
              total + Number(item.confidence || 0),
            0
          ) / totalPredictions
        ).toFixed(2)
      : "0.00";

  const latestPrediction =
    predictions.length > 0
      ? predictions[0].prediction
      : "No predictions yet";

  const handleLogout = () => {
    localStorage.removeItem("ocuvision_token");
    localStorage.removeItem("ocuvision_user");
    navigate("/login");
  };

  const handleDownloadPDF = async (predictionId) => {
    const token = localStorage.getItem("ocuvision_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setDownloadingId(predictionId);

      const response = await fetch(
        `http://localhost:3001/api/reports/${predictionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        alert(
          data?.message || "Failed to download the PDF report."
        );

        return;
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `OcuVision_Report_${predictionId}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("PDF download error:", error);

      alert("Unable to download the PDF report.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <header className="bg-blue-700 px-6 py-6 text-white shadow-md">

        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              Patient Dashboard
            </h1>

            <p className="mt-1 text-blue-100">
              View your OcuVision AI prediction results
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-white px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50"
          >
            Logout
          </button>

        </div>

      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {loading && (
          <div className="rounded-xl bg-white p-8 text-center shadow">

            <p className="text-lg text-gray-600">
              Loading your prediction data...
            </p>

          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl bg-white p-8 text-center shadow">

            <p className="text-lg text-red-600">
              {error}
            </p>

          </div>
        )}

        {!loading && !error && (
          <>

            <section className="grid gap-6 md:grid-cols-3">

              <div className="rounded-xl bg-white p-6 shadow">

                <p className="text-sm font-medium text-gray-500">
                  Total Predictions
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-700">
                  {totalPredictions}
                </p>

              </div>

              <div className="rounded-xl bg-white p-6 shadow">

                <p className="text-sm font-medium text-gray-500">
                  Average Confidence
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {averageConfidence}%
                </p>

              </div>

              <div className="rounded-xl bg-white p-6 shadow">

                <p className="text-sm font-medium text-gray-500">
                  Latest Result
                </p>

                <p className="mt-2 text-xl font-bold text-gray-800">
                  {latestPrediction}
                </p>

              </div>

            </section>

            <section className="mt-8 rounded-xl bg-white shadow">

              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    My Prediction History
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Your previous AI-generated prediction results
                  </p>

                </div>

                <button
                  onClick={() => navigate("/predict")}
                  className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
                >
                  New Prediction
                </button>

              </div>

              {predictions.length === 0 ? (

                <div className="px-6 py-12 text-center">

                  <p className="text-gray-500">
                    You have no prediction records yet.
                  </p>

                </div>

              ) : (

                <div className="overflow-x-auto">

                  <table className="w-full text-left">

                    <thead className="bg-gray-50">

                      <tr>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                          Image
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                          Prediction
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                          Confidence
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                          Date
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                          Report
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-gray-200">

                      {predictions.map((item) => (

                        <tr
                          key={item.id}
                          className="hover:bg-gray-50"
                        >

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.image_path}
                          </td>

                          <td className="px-6 py-4">

                            <span
                              className={`rounded-full px-3 py-1 text-sm font-medium ${
                                item.prediction === "Normal"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.prediction}
                            </span>

                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                            {Number(item.confidence).toFixed(2)}%
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(
                              item.created_at
                            ).toLocaleString()}
                          </td>

                          <td className="px-6 py-4">

                            <button
                              onClick={() =>
                                handleDownloadPDF(item.id)
                              }
                              disabled={
                                downloadingId === item.id
                              }
                              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {downloadingId === item.id
                                ? "Downloading..."
                                : "Download PDF"}
                            </button>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

          </>
        )}

      </main>

    </div>
  );
}

export default Dashboard;