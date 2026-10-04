// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import SignupBanner from "./components/common/SignupBanner";
import AudioPlayer from "./components/player/AudioPlayer";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites";
import Artists from "./pages/Artists";
import Playlist from "./pages/Playlist";
import About from "./pages/About";
import Settings from "./pages/admin/Settings";
import Profile from "./pages/Profile";
import Dashboard from "./pages/admin/Dashboard";
import ManageSongs from "./pages/admin/ManageSongs";
import UploadSong from "./pages/admin/UploadSong";
import Users from "./pages/admin/Users";
import SearchPage from "./pages/SearchPage";
import SongDetail from "./pages/SongDetail";
import ManageArtists from "./pages/admin/ManageArtists";
import ArtistDetail from "./pages/admin/ArtistDetail";
import ArtistPlaylist from "./pages/ArtistPlaylist";
import Following from "./pages/Following";
import { ThemeProvider } from "./context/ThemeContext";
import Charts from "./pages/Charts";
function PublicShell() {
  return (
    <ThemeProvider>
      <div className="bg-orbs">
        <div className="orb w-96 h-96 bg-fuchsia-500 -top-20 -left-20" />
        <div
          className="orb w-96 h-96 bg-cyan-400 bottom-0 right-0"
          style={{ animationDelay: "-8s" }}
        />
      </div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-6">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* ✅ Artists Routes */}
          <Route path="/artists" element={<Artists />} />
          <Route path="/artists/:id" element={<ArtistPlaylist />} />
          
          {/* ✅ Playlist Routes */}
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/playlist/artist/:id" element={<ArtistPlaylist />} />
          
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/song/:id" element={<SongDetail />} />
          <Route
            path="/following"
            element={
              <ProtectedRoute>
                <Following />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/charts" element={<Charts />} />
        </Routes>
      </main>
      <Footer />
      <div className="h-28" />
      <SignupBanner />
      <AudioPlayer />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="artists" element={<ManageArtists />} />
        <Route path="artists/:id" element={<ArtistDetail />} />
        <Route path="songs" element={<ManageSongs />} />
        <Route path="upload" element={<UploadSong />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<PublicShell />} />
    </Routes>
  );
}