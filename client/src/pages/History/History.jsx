import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function History() {
  const navigate = useNavigate();

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
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
            data.message ||
              "Failed to load prediction history."
          );
          return;
        }

        setPredictions(data.predictions || []);

      } catch (error) {
        console.error(
          "History error:",
          error
        );

        setError(
          "Unable to connect to the server."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);


  const handleDownloadReport = async (predictionId) => {
    const token =
      localStorage.getItem("ocuvision_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/reports/${predictionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();

        setError(
          data.message ||
            "Failed to generate PDF report."
        );

        return;
      }

      const blob = await response.blob();

      const downloadUrl =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = downloadUrl;

      link.download =
        `OcuVision_Report_${predictionId}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        downloadUrl
      );

    } catch (error) {
      console.error(
        "PDF report error:",
        error
      );

      setError(
        "Unable to download the PDF report."
      );
    }
  };


  const handleLogout = () => {
    localStorage.removeItem(
      "ocuvision_token"
    );

    localStorage.removeItem(
      "ocuvision_user"
    );

    navigate("/login");
  };


  return (
    <div className="min-h-screen bg-gray-100">

      <header className="bg-blue-700 px-6 py-6 text-white shadow-md">

        <div className="mx-auto flex max-w-6xl items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              Prediction History
            </h1>

            <p className="mt-1 text-blue-100">
              View your previous OcuVision AI prediction results
            </p>

          </div>


          <div className="flex gap-3">

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="rounded-lg bg-white px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50"
            >
              Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-gray-800"
            >
              Logout
            </button>

          </div>

        </div>

      </header>


      <main className="mx-auto max-w-6xl px-6 py-10">

        {loading && (

          <div className="rounded-xl bg-white p-10 text-center shadow">

            <p className="text-lg text-gray-600">
              Loading prediction history...
            </p>

          </div>

        )}


        {error && !loading && (

          <div className="rounded-xl bg-white p-8 text-center shadow">

            <p className="text-red-600">
              {error}
            </p>

          </div>

        )}


        {!loading &&
          !error &&
          predictions.length === 0 && (

            <div className="rounded-xl bg-white p-10 text-center shadow">

              <p className="text-lg text-gray-500">
                No prediction history available.
              </p>

              <button
                onClick={() =>
                  navigate("/predict")
                }
                className="mt-5 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
              >
                Make Your First Prediction
              </button>

            </div>

          )}


        {!loading &&
          !error &&
          predictions.length > 0 && (

            <div className="overflow-hidden rounded-xl bg-white shadow">

              <div className="border-b border-gray-200 px-6 py-5">

                <h2 className="text-xl font-bold text-gray-800">
                  My Prediction History
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your previous AI-generated prediction results
                </p>

              </div>


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

                    {predictions.map(
                      (item) => (

                        <tr
                          key={item.id}
                          className="hover:bg-gray-50"
                        >

                          <td className="px-6 py-4 text-sm text-gray-700">
                            {item.image_path}
                          </td>


                          <td className="px-6 py-4">

                            <span
                              className={`rounded-full px-3 py-1 text-sm font-medium ${
                                item.prediction ===
                                "Normal"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.prediction}
                            </span>

                          </td>


                          <td className="px-6 py-4 font-semibold text-gray-700">
                            {Number(
                              item.confidence
                            ).toFixed(2)}
                            %
                          </td>


                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(
                              item.created_at
                            ).toLocaleString()}
                          </td>


                          <td className="px-6 py-4">

                            <button
                              onClick={() =>
                                handleDownloadReport(
                                  item.id
                                )
                              }
                              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                            >
                              Download PDF
                            </button>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

      </main>

    </div>
  );
}

export default History;