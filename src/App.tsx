import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import AiHeadshotGenerator from './pages/AiHeadshotGenerator'
import AiDatingPhotos from './pages/AiDatingPhotos'
import AiPhotoStyles from './pages/AiPhotoStyles'
import AlternativeAragon from './pages/AlternativeAragon'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/ai-headshot-generator" element={<AiHeadshotGenerator />} />
      <Route path="/ai-dating-photos" element={<AiDatingPhotos />} />
      <Route path="/ai-photo-styles" element={<AiPhotoStyles />} />
      <Route path="/alternative/aragon-ai" element={<AlternativeAragon />} />
    </Routes>
  )
}
