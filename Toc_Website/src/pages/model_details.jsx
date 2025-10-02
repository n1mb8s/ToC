import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function ModelDetails() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { brandName, model_name } = useParams();

  useEffect(() => {
    const fetchModelData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/model/${brandName}/${model_name}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response body:', errorText);
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const textResponse = await response.text();
          console.error('Non-JSON response:', textResponse);
          throw new Error(`Expected JSON but got: ${contentType}. Response: ${textResponse.substring(0, 200)}...`);
        }

        const data = await response.json();
        console.log('Model API response:', data);
        setModels(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error('Error fetching model data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (brandName && model_name) {
      fetchModelData();
    }
  }, [brandName, model_name]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="w-full min-h-screen bg-[#0D1017] text-white flex flex-col items-center justify-center">
          <div className="text-xl">Loading model details...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="w-full min-h-screen bg-[#0D1017] text-white flex flex-col items-center justify-center">
          <div className="text-xl text-red-500">Error: {error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-[#0D1017] text-white">
        {models.map((model, index) => (
          <div key={model.id || index} className="flex flex-col items-center">
            {/* Title Section */}
            <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center md:text-start">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                {model.name || `${brandName} ${model_name}`}
                {model.year_range && ` (${model.year_range})`}
              </h1>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-6xl px-8 flex flex-col lg:flex-row gap-8">
              {/* Image */}
              <img
                src={model.image_url || "https://placehold.co/360x230"}
                alt={model.name || `${brandName} ${model_name}`}
                className="rounded-xl border border-gray-700 w-[360px] h-[230px] object-cover"
              />

              <div className="flex-1 flex flex-col gap-6">
                <p className="text-gray-300 text-base leading-relaxed">
                  {model.description || "No description available for this model."}
                </p>

                <div className="flex flex-col gap-2 pt-4 border-t border-gray-700 pb-20">
                  <h2 className="text-2xl font-bold">Gasoline Engines</h2>
                  {model.engines && model.engines.length > 0 ? (
                    <ul className="text-gray-300 font-medium space-y-1">
                      {model.engines.map((engine, engineIndex) => (
                        <li key={engineIndex} className="flex items-center">
                          {engine}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-300 font-medium">
                      No engine information for this model
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
