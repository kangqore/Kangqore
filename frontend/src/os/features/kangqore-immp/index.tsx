import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import {
  Brain, TrendingUp, BookOpen, Satellite, Bell, Activity,
  Search, Target, FileText, UserCheck, CheckSquare, Newspaper, Cpu, Scale, Zap, GitBranch, LayoutDashboard, Shield, Gauge, Rocket, Radio, LineChart, Building2, Award, Lightbulb, FlaskConical, Globe2, FileJson, Command, BookMarked, Crown,
} from 'lucide-react'
import { cn } from '@design-system/cn'
import { getSocket } from '@lib/socket'
import { isDemo } from '@lib/api'
import { useKIMMPStore, toInsight } from '@store/kimmp'
import { BriefingPage }  from './pages/BriefingPage'
import { KIMMMPage }    from './pages/KIMMPPage'
import { ForecastPage } from './pages/ForecastPage'
import { MemoryPage }   from './pages/MemoryPage'
import { ScoutPage }    from './pages/ScoutPage'
import { AlertsPage }   from './pages/AlertsPage'
import { SignalsPage }  from './pages/SignalsPage'
import { ResearchPage } from './pages/ResearchPage'
import { GoalsPage }    from './pages/GoalsPage'
import { ReportsPage }  from './pages/ReportsPage'
import { BehaviorPage } from './pages/BehaviorPage'
import { ActionsPage }   from './pages/ActionsPage'
import { TrainingPage }        from './pages/TrainingPage'
import { DecisionsPage }      from './pages/DecisionsPage'
import { OperationsPage }     from './pages/OperationsPage'
import { WorkflowsPage }      from './pages/WorkflowsPage'
import { MissionControlPage } from './pages/MissionControlPage'
import { AIGovernancePage }   from './pages/AIGovernancePage'
import { QEFPage }             from './pages/QEFPage'
import { G7Page }              from './pages/G7Page'
import { G8Page }                    from './pages/G8Page'
import { FlightRecorderPage }        from './pages/FlightRecorderPage'
import { EnterpriseDefinitionPage }  from './pages/EnterpriseDefinitionPage'
import { CustomerZeroPage }          from './pages/CustomerZeroPage'
import { EnterpriseCoachPage }       from './pages/EnterpriseCoachPage'
import { DecisionEnginePage }        from './pages/DecisionEnginePage'
import { DeploymentsPage }           from './pages/DeploymentsPage'
import { BlueprintPage }             from './pages/BlueprintPage'
import { CommandCenterPage }          from './pages/CommandCenterPage'
import { MemoryTimelinePage }         from './pages/MemoryTimelinePage'
import ReflectionPage                 from './pages/ReflectionPage'
import { AuthorityPage }              from './pages/AuthorityPage'
import { BlueprintCustomizePage }     from './pages/BlueprintCustomizePage'
import { BlueprintWizardPage }        from './pages/BlueprintWizardPage'
import { RevenuePipelinePage }        from './pages/RevenuePipelinePage'
import { ProposalBuilderPage }        from './pages/ProposalBuilderPage'
import { CustomerZeroCaseStudyPage }   from './pages/CustomerZeroCaseStudyPage'
import { CustomerOnePage }             from './pages/CustomerOnePage'
import { MultiAgentCoordinationPage }  from './pages/MultiAgentCoordinationPage'
import { WAANDAFoundationPage }         from './pages/WAANDAFoundationPage'
import { PSPackExtractionPage }         from './pages/PSPackExtractionPage'
import { COIGDashboardPage }            from './pages/COIGDashboardPage'
import { IndustryPackPage }             from './pages/IndustryPackPage'
import { CustomerSuccessPlatformPage }  from './pages/CustomerSuccessPlatformPage'
import { CustomerTwoPage }              from './pages/CustomerTwoPage'
import { CustomerThreePage }            from './pages/CustomerThreePage'
import { PMOAdminPage }                 from './pages/PMOAdminPage'
import { COIGNorthStarPage }            from './pages/COIGNorthStarPage'
import { BlueprintVersionPage }         from './pages/BlueprintVersionPage'
import { CustomerFourPage }             from './pages/CustomerFourPage'
import { CustomerFivePage }             from './pages/CustomerFivePage'
import { CustomerSixPage }             from './pages/CustomerSixPage'
import { CustomerSevenPage }           from './pages/CustomerSevenPage'
import { CustomerEightPage }           from './pages/CustomerEightPage'
import { CustomerNinePage }            from './pages/CustomerNinePage'
import { CustomerTenPage }             from './pages/CustomerTenPage'
import { ChurnEarlyWarningPage }       from './pages/ChurnEarlyWarningPage'
import { CustomerPipelinePage }         from './pages/CustomerPipelinePage'
import { WaandaGen2Page }               from './pages/WaandaGen2Page'
import { TenantAdminPage }              from './pages/TenantAdminPage'
import { ChurnRiskPage }                from './pages/ChurnRiskPage'
import { RenewalWorkflowPage }          from './pages/RenewalWorkflowPage'
import { ExecutiveDashboardPage }       from './pages/ExecutiveDashboardPage'
import { WaandaGen3Page }               from './pages/WaandaGen3Page'
import { KEOSBillingPage }              from './pages/KEOSBillingPage'
import { PackActivationPage }           from './pages/PackActivationPage'
import { RevenueIntelPage }             from './pages/RevenueIntelPage'
import { Gen2AccuracyPage }             from './pages/Gen2AccuracyPage'
import { BlueprintMarketplacePage }     from './pages/BlueprintMarketplacePage'
import { PartnerOrgPage }              from './pages/PartnerOrgPage'
import { SDKv2Page }                   from './pages/SDKv2Page'
import { SOC2AuditPage }               from './pages/SOC2AuditPage'
import { RegionAdminPage }             from './pages/RegionAdminPage'
import { PrivacyDashboardPage }        from './pages/PrivacyDashboardPage'
import { CustomerElevenPage }          from './pages/CustomerElevenPage'
import { CustomerTwelvePage }          from './pages/CustomerTwelvePage'
import { CustomerThirteenPage }        from './pages/CustomerThirteenPage'
import { CustomerFourteenPage }        from './pages/CustomerFourteenPage'
import { CustomerFifteenPage }         from './pages/CustomerFifteenPage'
import { PartnerCertificationPage }    from './pages/PartnerCertificationPage'
import { CustomerSixteenPage }         from './pages/CustomerSixteenPage'
import { CustomerSeventeenPage }       from './pages/CustomerSeventeenPage'
import { CustomerEighteenPage }        from './pages/CustomerEighteenPage'
import { CustomerNineteenPage }        from './pages/CustomerNineteenPage'
import { CustomerTwentyPage }          from './pages/CustomerTwentyPage'
import { CustomerTwentyMilestonePage } from './pages/CustomerTwentyMilestonePage'
import { PlatformLaunchPage }          from './pages/PlatformLaunchPage'
import { AnimatePresence, motion } from 'framer-motion'

const BASE = '/kangqore-view/admin/kangqore-immp'

// Navigation is now handled by the global WorkspaceSidebar

function useKIMMPSocket() {
  const { addLiveSignal, insights } = useKIMMPStore()

  useEffect(() => {
    if (isDemo()) return

    const socket = getSocket()

    const onSignal = (data: Record<string, unknown>) => {
      const idx = insights.length
      addLiveSignal(toInsight(data, idx))
    }

    const onUpdate = (data: { insights?: Record<string, unknown>[] }) => {
      if (Array.isArray(data.insights)) {
        data.insights.forEach((raw, i) => addLiveSignal(toInsight(raw, i)))
      }
    }

    const onLeadUpdated = () => {
      addLiveSignal({
        id:         `live-lead-${Date.now()}`,
        type:       'reactive',
        category:   'revenue',
        priority:   'medium',
        title:      'Lead pipeline updated',
        summary:    'A lead stage changed. KIMMP is re-evaluating pipeline signals.',
        detail:     '',
        action:     'Check the Leads module for updated pipeline status.',
        module:     'Leads',
        confidence: 90,
        impact:     '—',
        createdAt:  new Date().toISOString(),
      })
    }

    const onInvoiceOverdue = (data: Record<string, unknown>) => {
      addLiveSignal({
        id:         `live-invoice-${Date.now()}`,
        type:       'reactive',
        category:   'ops',
        priority:   'high',
        title:      `Invoice overdue: ${data.ref ?? 'unknown'}`,
        summary:    `Invoice ${data.ref ?? ''} has exceeded the payment threshold. Escalation required.`,
        detail:     '',
        action:     'Review the overdue invoice in Finance and initiate contact.',
        module:     'Finance',
        confidence: 99,
        impact:     data.amount ? `₹${data.amount}` : '—',
        createdAt:  new Date().toISOString(),
      })
    }

    socket.on('kimmp:signal',    onSignal)
    socket.on('kimmp:update',    onUpdate)
    socket.on('lead:updated',    onLeadUpdated)
    socket.on('invoice:overdue', onInvoiceOverdue)

    return () => {
      socket.off('kimmp:signal',    onSignal)
      socket.off('kimmp:update',    onUpdate)
      socket.off('lead:updated',    onLeadUpdated)
      socket.off('invoice:overdue', onInvoiceOverdue)
    }
  }, [addLiveSignal, insights.length])
}

export function KIMMMModule() {
  useKIMMPSocket()

  const { pathname } = useLocation()

  return (
    <div className="admin-bento-theme max-w-[1400px] mx-auto p-6 space-y-6 min-h-screen">
      {/* Local navigation removed, handled globally by WorkspaceSidebar */}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15,ease:'easeOut'}}>

        <Routes>
          <Route path="command-center"  element={<CommandCenterPage />} />
          <Route path="briefing"        element={<BriefingPage />} />
          <Route index                  element={<KIMMMPage />}    />
          <Route path="forecast"      element={<ForecastPage />} />
          <Route path="memory"          element={<MemoryPage />}          />
          <Route path="memory-timeline" element={<MemoryTimelinePage />} />
          <Route path="goals"         element={<GoalsPage />}    />
          <Route path="alerts"        element={<AlertsPage />}   />
          <Route path="signals"       element={<SignalsPage />}  />
          <Route path="scout"         element={<ScoutPage />}    />
          <Route path="research"      element={<ResearchPage />} />
          <Route path="reports"       element={<ReportsPage />}  />
          <Route path="behavior"      element={<BehaviorPage />} />
          <Route path="actions"       element={<ActionsPage />}    />
          <Route path="training"      element={<TrainingPage />}   />
          <Route path="mission-control" element={<MissionControlPage />} />
          <Route path="decisions"       element={<DecisionsPage />}    />
          <Route path="operations"      element={<OperationsPage />}   />
          <Route path="workflows"        element={<WorkflowsPage />}    />
          <Route path="ai-governance"       element={<AIGovernancePage />} />
          <Route path="quality-engineering" element={<QEFPage />}            />
          <Route path="release-governance"  element={<G7Page />}             />
          <Route path="operational-intel"   element={<G8Page />}                   />
          <Route path="flight-recorder"     element={<FlightRecorderPage />}       />
          <Route path="enterprise"          element={<EnterpriseDefinitionPage />} />
          <Route path="customer-zero"       element={<CustomerZeroPage />}          />
          <Route path="customers/zero"      element={<CustomerZeroPage />}          />
          <Route path="coach"               element={<EnterpriseCoachPage />}       />
          <Route path="decision-engine"     element={<DecisionEnginePage />}        />
          <Route path="deployments"         element={<DeploymentsPage />}           />
          <Route path="blueprint"           element={<BlueprintPage />}             />
          <Route path="blueprint-customize" element={<BlueprintCustomizePage />}   />
          <Route path="blueprint-wizard"    element={<BlueprintWizardPage />}      />
          <Route path="revenue-pipeline"    element={<RevenuePipelinePage />}       />
          <Route path="proposal-builder"    element={<ProposalBuilderPage />}       />
          <Route path="case-study"          element={<CustomerZeroCaseStudyPage />} />
          <Route path="customer-one"        element={<CustomerOnePage />}            />
          <Route path="customers/one"       element={<CustomerOnePage />}            />
          <Route path="agent-coordination"  element={<MultiAgentCoordinationPage />} />
          <Route path="foundation-model"   element={<WAANDAFoundationPage />}       />
          <Route path="ps-pack-extraction"       element={<PSPackExtractionPage />}          />
          <Route path="coig"                    element={<COIGDashboardPage />}             />
          <Route path="industry-packs"          element={<IndustryPackPage />}              />
          <Route path="customer-success-platform" element={<CustomerSuccessPlatformPage />} />
          <Route path="customer-two"              element={<CustomerTwoPage />}               />
          <Route path="customers/two"           element={<CustomerTwoPage />}               />
          <Route path="customers/three"         element={<CustomerThreePage />}             />
          <Route path="customers/pipeline"      element={<CustomerPipelinePage />}          />
          <Route path="waanda-gen2"             element={<WaandaGen2Page />}                />
          <Route path="tenants"                 element={<TenantAdminPage />}               />
          <Route path="churn-risk"              element={<ChurnRiskPage />}                 />
          <Route path="renewals"                element={<RenewalWorkflowPage />}           />
          <Route path="exec-dashboard"          element={<ExecutiveDashboardPage />}        />
          <Route path="gen3"                    element={<WaandaGen3Page />}                />
          <Route path="billing-dashboard"       element={<KEOSBillingPage />}               />
          <Route path="pack-activation"         element={<PackActivationPage />}            />
          <Route path="revenue-intel"           element={<RevenueIntelPage />}              />
          <Route path="gen2-accuracy"           element={<Gen2AccuracyPage />}              />
          <Route path="pmo"                     element={<PMOAdminPage />}                  />
          <Route path="coig-north-star"         element={<COIGNorthStarPage />}             />
          <Route path="blueprint-versions"      element={<BlueprintVersionPage />}          />
          <Route path="customers/four"          element={<CustomerFourPage />}              />
          <Route path="customers/five"          element={<CustomerFivePage />}              />
          <Route path="customers/six"           element={<CustomerSixPage />}               />
          <Route path="customers/seven"         element={<CustomerSevenPage />}             />
          <Route path="customers/eight"         element={<CustomerEightPage />}             />
          <Route path="customers/nine"          element={<CustomerNinePage />}              />
          <Route path="customers/ten"           element={<CustomerTenPage />}               />
          <Route path="churn-early-warning"     element={<ChurnEarlyWarningPage />}         />
          <Route path="reflection"              element={<ReflectionPage />}                />
          <Route path="authority"               element={<AuthorityPage />}                 />
          <Route path="blueprint-marketplace"   element={<BlueprintMarketplacePage />}      />
          <Route path="partner-network"         element={<PartnerOrgPage />}                />
          <Route path="sdk-v2"                  element={<SDKv2Page />}                     />
          <Route path="soc2-audit"              element={<SOC2AuditPage />}                 />
          <Route path="region-admin"            element={<RegionAdminPage />}               />
          <Route path="privacy-dashboard"       element={<PrivacyDashboardPage />}          />
          <Route path="customers/eleven"        element={<CustomerElevenPage />}            />
          <Route path="customers/twelve"        element={<CustomerTwelvePage />}            />
          <Route path="customers/thirteen"      element={<CustomerThirteenPage />}          />
          <Route path="customers/fourteen"      element={<CustomerFourteenPage />}          />
          <Route path="customers/fifteen"       element={<CustomerFifteenPage />}           />
          <Route path="partner-certification"   element={<PartnerCertificationPage />}      />
          <Route path="customers/sixteen"       element={<CustomerSixteenPage />}           />
          <Route path="customers/seventeen"     element={<CustomerSeventeenPage />}         />
          <Route path="customers/eighteen"      element={<CustomerEighteenPage />}          />
          <Route path="customers/nineteen"      element={<CustomerNineteenPage />}          />
          <Route path="customers/twenty"        element={<CustomerTwentyPage />}            />
          <Route path="customer-twenty-milestone" element={<CustomerTwentyMilestonePage />} />
          <Route path="platform-launch"         element={<PlatformLaunchPage />}            />
          <Route path="*"                       element={<Navigate to={BASE} replace />}    />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
