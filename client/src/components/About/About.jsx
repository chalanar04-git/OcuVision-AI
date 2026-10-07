function About() {
return ( <section id="about" className="py-20 bg-slate-50"> <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center"> <div className="flex justify-center"> <div className="w-80 h-80 rounded-2xl bg-blue-100 flex items-center justify-center text-8xl">
🩺 </div> </div>


    <div>
      <h2 className="text-4xl font-bold text-slate-800">
        About OcuVision AI
      </h2>

      <p className="mt-6 text-gray-600 leading-8">
        OcuVision AI is an explainable deep learning platform designed to
        assist in the early detection of ocular cancer. By combining
        artificial intelligence, medical image analysis, and Grad-CAM
        visualizations, the system helps healthcare professionals make
        faster and more informed decisions.
      </p>

      <p className="mt-4 text-gray-600 leading-8">
        The platform provides secure image uploads, AI-powered predictions,
        confidence scores, downloadable reports, and role-based dashboards
        for patients, doctors, and administrators.
      </p>
    </div>
  </div>
</section>


);
}

export default About;
