import { Routes, Route, Navigate } from 'react-router-dom'
import { VisitorsOverview }  from './pages/VisitorsOverview'
import { VisitorDetail }     from './pages/VisitorDetail'
import { EqoreTranscripts }  from './pages/EqoreTranscripts'
import { EqoreAnalytics }    from './pages/EqoreAnalytics'
import { VisitorPipeline }   from './pages/VisitorPipeline'

export function VisitorsModule() {
  return (
    <Routes>
      <Route index                element={<VisitorsOverview />}  />
      <Route path="pipeline"      element={<VisitorPipeline />}   />
      <Route path="transcripts"   element={<EqoreTranscripts />}  />
      <Route path="analytics"     element={<EqoreAnalytics />}    />
      <Route path=":id"           element={<VisitorDetail />}     />
      <Route path="*"             element={<Navigate to="/kangqore-view/admin/visitors" replace />} />
    </Routes>
  )
}
