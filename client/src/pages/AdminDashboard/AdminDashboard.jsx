import { useEffect, useState } from "react";

function AdminDashboard() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  const token = localStorage.getItem("ocuvision_token");

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/predictions/admin",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch prediction records"
          );
        }

        setPredictions(data.predictions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [token]);

  const handleDownloadPDF = async (predictionId) => {
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
        throw new Error("Failed to download PDF");
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
    } catch (err) {
      alert(err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ocuvision_token");
    localStorage.removeItem("ocuvision_user");

    window.location.href = "/login";
  };

  const totalPredictions = predictions.length;

  const averageConfidence =
    totalPredictions > 0
      ? (
          predictions.reduce(
            (sum, item) => sum + Number(item.confidence),
            0
          ) / totalPredictions
        ).toFixed(2)
      : "0.00";

  const normalResults = predictions.filter(
    (item) => item.prediction === "Normal"
  ).length;

  const abnormalResults =
    totalPredictions - normalResults;

  const classCounts = {};

  predictions.forEach((item) => {
    if (classCounts[item.prediction]) {
      classCounts[item.prediction]++;
    } else {
      classCounts[item.prediction] = 1;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              OcuVision AI
            </h1>

            <p className="text-sm text-blue-100">
              Admin Dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-white px-5 py-2 font-semibold text-blue-700 shadow hover:bg-blue-50"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h2>

          <p className="mt-2 text-gray-600">
            OcuVision AI system monitoring and model evaluation
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-5">
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              Total Predictions
            </p>

            <h3 className="mt-2 text-3xl font-bold text-blue-700">
              {totalPredictions}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              Average Confidence
            </p>

            <h3 className="mt-2 text-3xl font-bold text-green-600">
              {averageConfidence}%
            </h3>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              Validation Accuracy
            </p>

            <h3 className="mt-2 text-3xl font-bold text-purple-600">
              78.33%
            </h3>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              Normal Results
            </p>

            <h3 className="mt-2 text-3xl font-bold text-green-600">
              {normalResults}
            </h3>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              Abnormal Results
            </p>

            <h3 className="mt-2 text-3xl font-bold text-red-600">
              {abnormalResults}
            </h3>
          </div>
        </div>

        {/* Model Evaluation */}
        <section className="mt-10 rounded-xl bg-white p-6 shadow">
          <h3 className="text-xl font-bold text-gray-800">
            Model Evaluation
          </h3>

          <div className="mt-6 grid gap-6 md:grid-cols-5">
            <div>
              <p className="text-sm text-gray-500">
                Model Architecture
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                EfficientNetB0
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Validation Accuracy
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                78.33%
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Input Resolution
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                224 × 224
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Number of Classes
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                6
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Explainability
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                Grad-CAM
              </p>
            </div>
          </div>
        </section>

        {/* Dataset Information */}
        <section className="mt-8 rounded-xl bg-white p-6 shadow">
          <h3 className="text-xl font-bold text-gray-800">
            Dataset Information
          </h3>

          <div className="mt-6 grid gap-6 md:grid-cols-5">
            <div>
              <p className="text-sm text-gray-500">
                Total Images
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                2,031
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Training Images
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                1,625
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Validation Images
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                406
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Number of Classes
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                6
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Image Type
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                Ultra-wide Fundus
              </p>
            </div>
          </div>
        </section>

        {/* Prediction Class Distribution */}
        <section className="mt-8 rounded-xl bg-white p-6 shadow">
          <h3 className="text-xl font-bold text-gray-800">
            Prediction Class Distribution
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Number of predictions recorded for each classification
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {Object.entries(classCounts).map(
              ([className, count]) => (
                <div
                  key={className}
                  className="rounded-lg border border-gray-200 p-5"
                >
                  <p className="font-semibold text-gray-800">
                    {className}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-blue-600">
                    {count}
                  </p>

                  <p className="text-sm text-gray-500">
                    predictions
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        {/* System Prediction Records */}
        <section className="mt-8 rounded-xl bg-white p-6 shadow">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              System Prediction Records
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Overview of AI prediction activity
            </p>
          </div>

          {loading && (
            <p className="py-10 text-center text-gray-500">
              Loading prediction records...
            </p>
          )}

          {error && (
            <p className="py-10 text-center text-red-600">
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            predictions.length === 0 && (
              <p className="py-10 text-center text-gray-500">
                No prediction records found.
              </p>
            )}

          {!loading &&
            !error &&
            predictions.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left">
                      <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                        Patient
                      </th>

                      <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                        Image
                      </th>

                      <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                        Prediction
                      </th>

                      <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                        Confidence
                      </th>

                      <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                        Date
                      </th>

                      <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                        Report
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {predictions.map((prediction) => (
                      <tr
                        key={prediction.id}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-4 py-5">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {prediction.patient_name}
                            </p>

                            <p className="text-sm text-gray-500">
                              {prediction.patient_email}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-5 text-sm text-gray-700">
                          {prediction.image_path}
                        </td>

                        <td className="px-4 py-5">
                          <span
                            className={`font-semibold ${
                              prediction.prediction ===
                              "Normal"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {prediction.prediction}
                          </span>
                        </td>

                        <td className="px-4 py-5 font-semibold text-gray-700">
                          {Number(
                            prediction.confidence
                          ).toFixed(2)}
                          %
                        </td>

                        <td className="px-4 py-5 text-sm text-gray-600">
                          {new Date(
                            prediction.created_at
                          ).toLocaleString()}
                        </td>

                        <td className="px-4 py-5">
                          <button
                            onClick={() =>
                              handleDownloadPDF(
                                prediction.id
                              )
                            }
                            disabled={
                              downloadingId ===
                              prediction.id
                            }
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {downloadingId ===
                            prediction.id
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
      </main>
    </div>
  );
}

export default AdminDashboard;