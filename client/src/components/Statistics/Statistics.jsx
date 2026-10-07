function Statistics() {
  const stats = [
    { number: "78.33%", label: "Validation Accuracy" },
    { number: "2,031", label: "Fundus Images" },
    { number: "6", label: "Tumor Classes" },
    { number: "Grad-CAM", label: "Explainable AI" },
  ];

  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <h2 className="text-4xl font-bold">{stat.number}</h2>
              <p className="mt-2 text-blue-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Statistics;