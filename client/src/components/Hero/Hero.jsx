function Hero() {
  return (
    <section className="bg-slate-50 min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* Left Side */}
        <div>
          <h1 className="text-5xl font-bold text-slate-800 leading-tight">
            AI-Powered
            <span className="text-blue-600"> Ocular Cancer </span>
            Detection
          </h1>

          <p className="mt-6 text-gray-600 text-lg leading-8">
            Upload retinal or ocular images and receive AI-assisted predictions
            with confidence scores, Grad-CAM visual explanations, and
            downloadable medical reports.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
              Get Started
            </button>

            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex justify-center">
          <div className="w-80 h-80 rounded-full bg-blue-100 flex items-center justify-center text-8xl">
            👁️
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;