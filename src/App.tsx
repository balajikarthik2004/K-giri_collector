import { I18nProvider } from './i18n'
import { AppProvider, useApp } from './app/store'
import { Shell } from './app/Shell'
import { OverviewPage } from './pages/Overview'
import { ActionQueuePage } from './pages/ActionQueue'
import { MapViewPage } from './pages/MapView'
import { RevenuePage } from './pages/Revenue'
import { GrievancesPage } from './pages/Grievances'
import { FinancePage } from './pages/Finance'
import { StaffPage } from './pages/Staff'
import { ElectionsPage } from './pages/Elections'
import { SchemesPage } from './pages/Schemes'
import { AgriculturePage } from './pages/Agriculture'
import { IndustriesPage } from './pages/Industries'
import { InfrastructurePage } from './pages/Infrastructure'
import { HealthPage } from './pages/Health'
import { EducationPage } from './pages/Education'
import { LawOrderPage } from './pages/LawOrder'

function Router() {
  const { section } = useApp()

  switch (section) {
    case 'actions':
      return <ActionQueuePage />
    case 'maps':
      return <MapViewPage />
    case 'revenue':
      return <RevenuePage />
    case 'grievances':
      return <GrievancesPage />
    case 'finance':
      return <FinancePage />
    case 'hr':
      return <StaffPage />
    case 'elections':
      return <ElectionsPage />
    case 'schemes':
      return <SchemesPage />
    case 'agriculture':
      return <AgriculturePage />
    case 'industries':
      return <IndustriesPage />
    case 'infrastructure':
      return <InfrastructurePage />
    case 'health':
      return <HealthPage />
    case 'education':
      return <EducationPage />
    case 'lawOrder':
      return <LawOrderPage />
    case 'overview':
    default:
      return <OverviewPage />
  }
}

export default function App() {
  return (
    <I18nProvider>
      <AppProvider>
        <Shell>
          <Router />
        </Shell>
      </AppProvider>
    </I18nProvider>
  )
}
