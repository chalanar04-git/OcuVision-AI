function Services() {
const services = [
{
title: "AI-Based Detection",
description:
"Analyze ultra-wide fundus images using an EfficientNetB0 deep learning model for ocular tumor classification.",
},
{
title: "Grad-CAM Explainability",
description:
"Visualize the regions of the fundus image that contributed to the AI prediction.",
},
{
title: "Prediction Reports",
description:
"Generate downloadable PDF reports containing prediction details and confidence scores.",
},
{
title: "Role-Based Dashboards",
description:
"Provide dedicated dashboards for patients, doctors, and administrators.",
},
];

return ( <section id="services" className="py-20 bg-white"> <div className="max-w-7xl mx-auto px-6"> <div className="text-center"> <h2 className="text-4xl font-bold text-slate-800">
Our Services </h2>


      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
        OcuVision AI combines deep learning, explainable AI, and secure
        healthcare features to support ocular tumor analysis.
      </p>
    </div>

    <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {services.map((service, index) => (
        <div
          key={index}
          className="p-6 rounded-2xl bg-slate-50 shadow-md hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold text-blue-700">
            {service.title}
          </h3>

          <p className="mt-4 text-gray-600 leading-7">
            {service.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>


);
}

export default Services;
