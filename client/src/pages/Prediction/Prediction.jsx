import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Prediction() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError("Please select a fundus image first.");
      return;
    }

    const token = localStorage.getItem("ocuvision_token");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        "http://localhost:3001/api/predictions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Prediction failed."
        );
        return;
      }

      setResult(data);

    } catch (error) {
      console.error("Prediction error:", error);

      setError(
        "Unable to connect to the prediction service."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!result?.id) {
      return;
    }

    const token = localStorage.getItem("ocuvision_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/reports/${result.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();

        setError(
          data.message || "Failed to generate PDF report."
        );

        return;
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = downloadUrl;

      link.download = `OcuVision_Report_${result.id}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

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

  return (
    <div className="min-h-screen bg-gray-100">

      <header className="bg-blue-700 px-6 py-6 text-white shadow-md">

        <div className="mx-auto flex max-w-6xl items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              OcuVision AI
            </h1>

            <p className="mt-1 text-blue-100">
              Ocular Tumor Prediction
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg bg-white px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50"
          >
            Dashboard
          </button>

        </div>

      </header>


      <main className="mx-auto max-w-6xl px-6 py-10">

        <div className="grid gap-8 lg:grid-cols-2">


          {/* Upload Section */}

          <section className="rounded-xl bg-white p-8 shadow">

            <h2 className="text-2xl font-bold text-gray-800">
              Upload Fundus Image
            </h2>

            <p className="mt-2 text-gray-600">
              Upload a JPG, JPEG or PNG fundus image for AI-based classification.
            </p>

            <div className="mt-6">

              <label className="mb-2 block font-medium text-gray-700">
                Select Image
              </label>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-gray-300 bg-white p-3"
              />

            </div>


            {preview && (

              <div className="mt-6">

                <p className="mb-3 font-semibold text-gray-700">
                  Image Preview
                </p>

                <img
                  src={preview}
                  alt="Selected fundus image"
                  className="max-h-80 w-full rounded-lg border object-contain"
                />

              </div>

            )}


            <button
              onClick={handlePredict}
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading
                ? "Analyzing Image..."
                : "Predict"}
            </button>


            {error && (

              <div className="mt-5 rounded-lg bg-red-50 p-4 text-red-700">
                {error}
              </div>

            )}

          </section>


          {/* Result Section */}

          <section className="rounded-xl bg-white p-8 shadow">

            <h2 className="text-2xl font-bold text-gray-800">
              Prediction Result
            </h2>

            {!result && !loading && (

              <div className="mt-10 rounded-lg bg-gray-50 p-8 text-center">

                <p className="text-gray-500">
                  Upload an image and click Predict to view the AI result.
                </p>

              </div>

            )}


            {loading && (

              <div className="mt-10 rounded-lg bg-blue-50 p-8 text-center">

                <p className="text-lg font-medium text-blue-700">
                  AI model is analyzing the image...
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Please wait while OcuVision AI generates the prediction and Grad-CAM visualization.
                </p>

              </div>

            )}


            {result && (

              <div className="mt-6">

                <div className="rounded-xl border border-gray-200 p-6">

                  <p className="text-sm font-medium text-gray-500">
                    Predicted Class
                  </p>

                  <p className="mt-2 text-2xl font-bold text-blue-700">
                    {result.prediction}
                  </p>


                  <div className="mt-6">

                    <div className="flex items-center justify-between">

                      <p className="font-medium text-gray-700">
                        Confidence
                      </p>

                      <p className="font-bold text-gray-800">
                        {Number(result.confidence).toFixed(2)}%
                      </p>

                    </div>


                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">

                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{
                          width: `${Math.min(
                            Number(result.confidence),
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>


                {result.gradcam_image && (

                  <div className="mt-6">

                    <h3 className="text-lg font-bold text-gray-800">
                      Grad-CAM Visualization
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Highlighted regions indicate areas that contributed to the model's prediction.
                    </p>

                    <img
                      src={`data:image/jpeg;base64,${result.gradcam_image}`}
                      alt="Grad-CAM visualization"
                      className="mt-4 w-full rounded-lg border"
                    />

                  </div>

                )}


                <button
                  onClick={handleDownloadReport}
                  className="mt-6 w-full rounded-lg bg-gray-900 py-3 font-semibold text-white transition hover:bg-gray-800"
                >
                  Download PDF Report
                </button>


                <p className="mt-4 text-center text-xs text-gray-500">
                  This AI result is for research and educational purposes and should not be considered a medical diagnosis.
                </p>

              </div>

            )}

          </section>

        </div>

      </main>

    </div>
  );
}

export default Prediction;