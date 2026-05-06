import IncidentAnalyzer from "./components/IncidentAnalyzer";
import LogAnalyzer from "./components/LogAnalyzer";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          AI Tools Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <IncidentAnalyzer />
          <LogAnalyzer />
        </div>
      </div>
    </div>
  );
}

export default App;