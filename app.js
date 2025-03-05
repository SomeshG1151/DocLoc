import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import { FaPassport, FaFileMedical, FaCar, FaHome, FaGraduationCap, FaIdCard } from "react-icons/fa";
import { MdMenu, MdSearch, MdUpload, MdAccountCircle, MdExitToApp } from "react-icons/md";
import Educational from "./pages/Educational";
import Property from "./pages/Property";
import Medical from "./pages/Medical";
import Driving from "./pages/Driving";
import Passport from "./pages/Passport";
import GovernmentIDs from "./pages/GovernmentIDs";

export default function App() {
  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileUpload = () => {
    if (!file) {
      alert("Upload Failed: No file selected");
      return;
    }
    setUploadSuccess(true);
    setTimeout(() => {
      setShowUploadBox(false);
      setUploadSuccess(false);
    }, 2000);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col items-center">
        {/* Header */}
        <header className="w-full bg-gray-900 shadow-md p-5 flex justify-between items-center px-6">
          <div>
            <h1 className="text-3xl font-bold">DocLoc</h1>
            <p className="text-gray-400">Your Data, Your Control</p>
          </div>
          <button className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-500 transition-all flex items-center gap-2" onClick={() => alert('Logged Out!')}>
            <MdExitToApp size={20} /> Logout
          </button>
        </header>

        {/* Quick Access Search */}
        <div className="w-full max-w-3xl p-5">
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Document Categories */}
        <section className="w-full max-w-4xl p-5">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-center">Document Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: <FaGraduationCap />, name: "Educational", path: "/educational" },
                { icon: <FaHome />, name: "Property", path: "/property" },
                { icon: <FaFileMedical />, name: "Medical", path: "/medical" },
                { icon: <FaCar />, name: "Driving", path: "/driving" },
                { icon: <FaPassport />, name: "Passport", path: "/passport" },
                { icon: <FaIdCard />, name: "Government IDs", path: "/government-ids" },
              ].map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex flex-col items-center p-4 border border-gray-700 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-all shadow-md"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <span className="text-base font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Profile Tab */}
        {showProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center" onClick={() => setShowProfile(false)}>
            <div className="bg-gray-900 p-6 rounded-xl shadow-2xl w-80 text-center border border-gray-700" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-semibold mb-5">Profile</h2>
              <div className="text-left text-lg space-y-3">
                <p><strong>Name:</strong> John Doe</p>
                <p><strong>UID:</strong> 123456789012</p>
                <p><strong>DOB:</strong> 01/01/2000</p>
                <p><strong>Mobile:</strong> +1234567890</p>
                <p><strong>Email:</strong> johndoe@example.com</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Box */}
        {showUploadBox && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center" onClick={() => setShowUploadBox(false)}>
            <div className="bg-gray-900 p-6 rounded-xl shadow-2xl w-80 text-center border border-gray-700" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-semibold mb-5">Upload Document</h2>
              <input
                type="file"
                accept=".png, .jpg, .jpeg, .pdf"
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {uploadSuccess && <p className="text-green-400 mt-2">Upload Successful!</p>}
              <button className="mt-6 px-6 py-3 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-all" onClick={handleFileUpload}>Submit</button>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-700 shadow-lg">
          <div className="grid grid-cols-4 py-4">
            <button className="flex flex-col items-center justify-center text-white hover:text-gray-400 transition-all">
              <MdMenu size={28} />
              <span className="text-sm mt-1">Menu</span>
            </button>
            <button className="flex flex-col items-center justify-center text-white hover:text-gray-400 transition-all">
              <MdSearch size={28} />
              <span className="text-sm mt-1">Search</span>
            </button>
            <button className="flex flex-col items-center justify-center text-white hover:text-gray-400 transition-all" onClick={() => setShowUploadBox(true)}>
              <MdUpload size={28} />
              <span className="text-sm mt-1">Upload</span>
            </button>
            <button className="flex flex-col items-center justify-center text-white hover:text-gray-400 transition-all" onClick={() => setShowProfile(true)}>
              <MdAccountCircle size={28} />
              <span className="text-sm mt-1">Profile</span>
            </button>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/educational" element={<Educational />} />
          <Route path="/property" element={<Property />} />
          <Route path="/medical" element={<Medical />} />
          <Route path="/driving" element={<Driving />} />
          <Route path="/passport" element={<Passport />} />
          <Route path="/government-ids" element={<GovernmentIDs />} />
        </Routes>
      </div>
    </Router>
  );
}
