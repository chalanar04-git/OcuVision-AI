function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center text-slate-800">
          Why Choose OcuVision AI?
        </h2>

        <p className="text-center text-gray-600 mt-4">
          Our platform combines Artificial Intelligence with Explainable Deep
          Learning to assist doctors in early ocular cancer detection.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">

          <div className="bg-slate-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600">
              AI Detection
            </h3>
            <p className="mt-3 text-gray-600">
              Detect ocular cancer using a deep learning model trained on medical images.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600">
              Grad-CAM
            </h3>
            <p className="mt-3 text-gray-600">
              Visualize which regions of the image influenced the AI prediction.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600">
              PDF Reports
            </h3>
            <p className="mt-3 text-gray-600">
              Generate downloadable medical reports with prediction details.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Features;