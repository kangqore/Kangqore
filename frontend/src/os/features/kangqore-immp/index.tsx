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
import { VerticalEditionPage }         from './pages/VerticalEditionPage'
import { VerticalAnalyticsPage }       from './pages/VerticalAnalyticsPage'
import { VerticalSaasGatePage }        from './pages/VerticalSaasGatePage'
import { CustomerTwentyOnePage }       from './pages/CustomerTwentyOnePage'
import { CustomerTwentyTwoPage }       from './pages/CustomerTwentyTwoPage'
import { CustomerTwentyThreePage }     from './pages/CustomerTwentyThreePage'
import { CustomerTwentyFourPage }      from './pages/CustomerTwentyFourPage'
import { CustomerTwentyFivePage }      from './pages/CustomerTwentyFivePage'
import { CustomerTwentySixPage }       from './pages/CustomerTwentySixPage'
import { CustomerTwentySevenPage }     from './pages/CustomerTwentySevenPage'
import { CustomerTwentyEightPage }     from './pages/CustomerTwentyEightPage'
import { CustomerTwentyNinePage }      from './pages/CustomerTwentyNinePage'
import { OEMPortalPage }              from './pages/OEMPortalPage'
import { OEMBrandingPage }            from './pages/OEMBrandingPage'
import { OEMPersonaPage }             from './pages/OEMPersonaPage'
import { OEMBlueprintPackagerPage }   from './pages/OEMBlueprintPackagerPage'
import { OEMFleetPage }               from './pages/OEMFleetPage'
import { OEMMarginPage }              from './pages/OEMMarginPage'
import { OEMPartnerZeroPage }         from './pages/OEMPartnerZeroPage'
import { OEMGatePage }                from './pages/OEMGatePage'
import { UKLaunchPage }              from './pages/UKLaunchPage'
import { EULaunchPage }              from './pages/EULaunchPage'
import { IndiaLaunchPage }           from './pages/IndiaLaunchPage'
import { RegionalPersonaPage }       from './pages/RegionalPersonaPage'
import { CustomerThirtyPage }        from './pages/CustomerThirtyPage'
import { CustomerThirtyOnePage }     from './pages/CustomerThirtyOnePage'
import { CustomerThirtyTwoPage }     from './pages/CustomerThirtyTwoPage'
import { CustomerThirtyThreePage }   from './pages/CustomerThirtyThreePage'
import { CustomerThirtyFourPage }    from './pages/CustomerThirtyFourPage'
import { CustomerThirtyFivePage }    from './pages/CustomerThirtyFivePage'
import { RegionalAnalyticsPage }     from './pages/RegionalAnalyticsPage'
import { IntlGatePage }              from './pages/IntlGatePage'
import { CorpusAuditPage }          from './pages/CorpusAuditPage'
import { DatasetExportPage }         from './pages/DatasetExportPage'
import { TrainingJobsPage }          from './pages/TrainingJobsPage'
import { Gen4EvalPage }              from './pages/Gen4EvalPage'
import { Gen4RouterPage }            from './pages/Gen4RouterPage'
import { Gen4GatePage }              from './pages/Gen4GatePage'
import { Gen4Scale50Page }           from './pages/Gen4Scale50Page'
import { Gen4Scale80Page }           from './pages/Gen4Scale80Page'
import { ARRIntelPage }              from './pages/ARRIntelPage'
import { DunningPage }               from './pages/DunningPage'
import { EnterprisePipelinePage }    from './pages/EnterprisePipelinePage'
import { Chapter9GatePage }          from './pages/Chapter9GatePage'
// S173–S181 imports
import { FleetOrganicSeedPage }      from './pages/FleetOrganicSeedPage'
import { HealthScoreV2Page }         from './pages/HealthScoreV2Page'
import { OnboardingEnginePage }      from './pages/OnboardingEnginePage'
import { FleetFiftyMilestonePage }   from './pages/FleetFiftyMilestonePage'
import { FleetIntelligencePage }     from './pages/FleetIntelligencePage'
import { PlaybookEnginePage }        from './pages/PlaybookEnginePage'
import { FleetSixtyPage }            from './pages/FleetSixtyPage'
import { RenewalIntelV2Page }        from './pages/RenewalIntelV2Page'
import { FleetSeventyFivePage }      from './pages/FleetSeventyFivePage'
import { FleetGateS182Page }         from './pages/FleetGateS182Page'
// S183–S190 Enterprise Tier
import { SsoSamlPage }                       from './pages/SsoSamlPage'
import { CustomDomainsPage }                 from './pages/CustomDomainsPage'
import { DedicatedComputePage }              from './pages/DedicatedComputePage'
import { SlaManagementPage }                 from './pages/SlaManagementPage'
import { RbacV2Page }                        from './pages/RbacV2Page'
import { EnterpriseBlueprintTemplatesPage }  from './pages/EnterpriseBlueprintTemplatesPage'
import { DigitalContractSuitePage }          from './pages/DigitalContractSuitePage'
import { EnterpriseGateS190Page }            from './pages/EnterpriseGateS190Page'
// S191–S198 BIDS™ Commercial Track
import { BidsScorecardPage }              from './pages/BidsScorecardPage'
import { BidsReportGeneratorPage }        from './pages/BidsReportGeneratorPage'
import { BidsClientPortalPage }           from './pages/BidsClientPortalPage'
import { BidsBlueprintPrescriptionPage }  from './pages/BidsBlueprintPrescriptionPage'
import { BidsVerticalPacksPage }          from './pages/BidsVerticalPacksPage'
import { BidsPartnerDeliveryPage }        from './pages/BidsPartnerDeliveryPage'
import { BidsSmbScanPage }               from './pages/BidsSmbScanPage'
import { BidsGateS198Page }              from './pages/BidsGateS198Page'
import { Gen5ArchitecturePage }          from './pages/Gen5ArchitecturePage'
import { TrainingCorpusV2Page }          from './pages/TrainingCorpusV2Page'
import { SyntheticDataPipelinePage }     from './pages/SyntheticDataPipelinePage'
import { Gen5ReasoningModulePage }       from './pages/Gen5ReasoningModulePage'
import { Gen5PretrainingPage }           from './pages/Gen5PretrainingPage'
import { Gen5EvalSuitePage }             from './pages/Gen5EvalSuitePage'
import { Gen5ABRouterPage }              from './pages/Gen5ABRouterPage'
import { Gen5BetaRoutingPage }           from './pages/Gen5BetaRoutingPage'
import { Gen5GateS207Page }              from './pages/Gen5GateS207Page'
import { ArrDashboardV2Page }            from './pages/ArrDashboardV2Page'
import { ProfServicesPackPage }          from './pages/ProfServicesPackPage'
import { SdkV3PortalPage }               from './pages/SdkV3PortalPage'
import { SeriesADataRoomPage }           from './pages/SeriesADataRoomPage'
import { ChapterTenGatePage }            from './pages/ChapterTenGatePage'
// S291–S292 Series B / IPO Path — Chapter 12 TX
import { SeriesBFundraisePage }     from './pages/SeriesBFundraisePage'
import { GateS292Page }             from './pages/GateS292Page'
// S283–S290 WAANDA-FM Alpha — Foundation Model (Chapter 12 T4)
import { WfmCorpusAssemblyPage }    from './pages/WfmCorpusAssemblyPage'
import { WfmArchitecturePage }       from './pages/WfmArchitecturePage'
import { WfmPretrainingPhase1Page }  from './pages/WfmPretrainingPhase1Page'
import { WfmPretrainingPhase2Page }  from './pages/WfmPretrainingPhase2Page'
import { WfmFinetuningPage }         from './pages/WfmFinetuningPage'
import { WfmBenchmarkPage }          from './pages/WfmBenchmarkPage'
import { WfmShadowModePage }         from './pages/WfmShadowModePage'
import { GateS290Page }              from './pages/GateS290Page'
// S273–S282 500-Customer Fleet · 12+ Regions (Chapter 12 T3)
import { CanadaLaunchPage }          from './pages/CanadaLaunchPage'
import { SingaporeLaunchPage }       from './pages/SingaporeLaunchPage'
import { Fleet250Page }              from './pages/Fleet250Page'
import { SouthKoreaLaunchPage }      from './pages/SouthKoreaLaunchPage'
import { Fleet300Page }              from './pages/Fleet300Page'
import { AfricaLaunchPage }          from './pages/AfricaLaunchPage'
import { Fleet400Page }              from './pages/Fleet400Page'
import { Bids200EngagementsPage }    from './pages/Bids200EngagementsPage'
import { Fleet500Page }              from './pages/Fleet500Page'
import { GateS282Page }              from './pages/GateS282Page'
// S263–S272 Fortune 500 Enterprise Tier (Chapter 12 T2)
import { Soc2TypeIIPage }                  from './pages/Soc2TypeIIPage'
import { FedRampPage }                     from './pages/FedRampPage'
// Overshadow Roadmap P2 — unified compliance readiness across all 4 frameworks
import { ComplianceOverviewPage }          from './pages/ComplianceOverviewPage'
// Overshadow Roadmap P4 — Win the Contested Modules
import { ContestedModulesPage }            from './pages/ContestedModulesPage'
// Overshadow Roadmap P5 — Proof Points & Analyst Validation
import { GtmPipelinePage }                 from './pages/GtmPipelinePage'
// Overshadow Roadmap P6 — The Partner Ecosystem
import { PartnerEcosystemPage }            from './pages/PartnerEcosystemPage'
import { DedicatedSuccessTeamsPage }       from './pages/DedicatedSuccessTeamsPage'
import { ExecutiveBusinessReviewsPage }    from './pages/ExecutiveBusinessReviewsPage'
import { F500SalesMotionPage }             from './pages/F500SalesMotionPage'
import { ResellersProgramPage }            from './pages/ResellersProgramPage'
import { F500ClientOnboardingPage }        from './pages/F500ClientOnboardingPage'
import { EnterpriseACVPage }              from './pages/EnterpriseACVPage'
import { F500LogosPage }                   from './pages/F500LogosPage'
import { GateS272Page }                    from './pages/GateS272Page'
// S253–S262 WAANDA Gen3 Cognitive Engine (Chapter 12 T1)
import { Gen3ArchitecturePage }        from './pages/Gen3ArchitecturePage'
import { Gen3PlanningEnginePage }      from './pages/Gen3PlanningEnginePage'
import { Gen3ReasoningEnginePage }     from './pages/Gen3ReasoningEnginePage'
import { Gen3LanguageGenPage }         from './pages/Gen3LanguageGenPage'
import { Gen3MultiturnPage }           from './pages/Gen3MultiturnPage'
import { Gen3AutonomousGoalsPage }     from './pages/Gen3AutonomousGoalsPage'
import { Gen3SelfCorrectionPage }      from './pages/Gen3SelfCorrectionPage'
import { Gen3TrainingPipelinePage }    from './pages/Gen3TrainingPipelinePage'
import { Gen3Routing50Page }           from './pages/Gen3Routing50Page'
import { GateS262Page }                from './pages/GateS262Page'
// S251–S252 Series A Close (Chapter 11 TX)
import { SeriesADiligencePage }       from './pages/SeriesADiligencePage'
import { GateS252Page }               from './pages/GateS252Page'
// S243–S250 Platform Ecosystem (Chapter 11 T4)
import { AppStorePage }               from './pages/AppStorePage'
import { IntegrationHubPage }         from './pages/IntegrationHubPage'
import { HackathonProgramPage }       from './pages/HackathonProgramPage'
import { DeveloperCommunityPage }     from './pages/DeveloperCommunityPage'
import { WaandaCertificationPage }    from './pages/WaandaCertificationPage'
import { MarketplaceBillingPage }     from './pages/MarketplaceBillingPage'
import { PartnerSummitPage }          from './pages/PartnerSummitPage'
import { GateS250Page }               from './pages/GateS250Page'
// S233–S242 BIDS™ at Scale (Chapter 11 T3)
import { BidsAutomationPage }            from './pages/BidsAutomationPage'
import { BidsEnterpriseTierPage }         from './pages/BidsEnterpriseTierPage'
import { BidsFirstTenClientsPage }        from './pages/BidsFirstTenClientsPage'
import { BidsVerticalExpansionPage }      from './pages/BidsVerticalExpansionPage'
import { BidsAiReviewPage }               from './pages/BidsAiReviewPage'
import { BidsIndustryBenchmarkingPage }   from './pages/BidsIndustryBenchmarkingPage'
import { BidsAnnualSubscriptionPage }     from './pages/BidsAnnualSubscriptionPage'
import { BidsFiftyEngagementPage }        from './pages/BidsFiftyEngagementPage'
import { BidsCertifiedPartnerPage }       from './pages/BidsCertifiedPartnerPage'
import { GateS242Page }                   from './pages/GateS242Page'
// S223–S232 Global Fleet 200 (Chapter 11 T2)
import { FleetHundredPage }              from './pages/FleetHundredPage'
import { JapanLaunchPage }               from './pages/JapanLaunchPage'
import { Fleet125Page }                  from './pages/Fleet125Page'
import { AnzLaunchPage }                 from './pages/AnzLaunchPage'
import { Fleet150Page }                  from './pages/Fleet150Page'
import { LatamLaunchPage }               from './pages/LatamLaunchPage'
import { Fleet175Page }                  from './pages/Fleet175Page'
import { MenaLaunchPage }                from './pages/MenaLaunchPage'
import { Fleet200Page }                  from './pages/Fleet200Page'
import { GateS232Page }                  from './pages/GateS232Page'
// S213–S222 Gen5 Primary Engine (Chapter 11 T1)
import { Gen5RoutingPage }               from './pages/Gen5RoutingPage'
import { Gen5DomainSpecialisationPage }  from './pages/Gen5DomainSpecialisationPage'
import { Gen5FiftyPercentPage }          from './pages/Gen5FiftyPercentPage'
import { Gen5ContinuousTrainingPage }    from './pages/Gen5ContinuousTrainingPage'
import { Gen5ProductionPage }            from './pages/Gen5ProductionPage'
import { Gen5AgenticReasoningPage }      from './pages/Gen5AgenticReasoningPage'
import { Gen5CostIntelPage }             from './pages/Gen5CostIntelPage'
import { Gen5NinetyFivePercentPage }     from './pages/Gen5NinetyFivePercentPage'
import { WaandaGen3ArchitecturePage }    from './pages/WaandaGen3ArchitecturePage'
import { Gen5GateS222Page }              from './pages/Gen5GateS222Page'
// Customer pages C36–C75
import { CustomerThirtySixPage }     from './pages/CustomerThirtySixPage'
import { CustomerThirtySevenPage }   from './pages/CustomerThirtySevenPage'
import { CustomerThirtyEightPage }   from './pages/CustomerThirtyEightPage'
import { CustomerThirtyNinePage }    from './pages/CustomerThirtyNinePage'
import { CustomerFortyPage }         from './pages/CustomerFortyPage'
import { CustomerFortyOnePage }      from './pages/CustomerFortyOnePage'
import { CustomerFortyTwoPage }      from './pages/CustomerFortyTwoPage'
import { CustomerFortyThreePage }    from './pages/CustomerFortyThreePage'
import { CustomerFortyFourPage }     from './pages/CustomerFortyFourPage'
import { CustomerFortyFivePage }     from './pages/CustomerFortyFivePage'
import { CustomerFortySixPage }      from './pages/CustomerFortySixPage'
import { CustomerFortySevenPage }    from './pages/CustomerFortySevenPage'
import { CustomerFortyEightPage }    from './pages/CustomerFortyEightPage'
import { CustomerFortyNinePage }     from './pages/CustomerFortyNinePage'
import { CustomerFiftyPage }         from './pages/CustomerFiftyPage'
import { CustomerFiftyOnePage }      from './pages/CustomerFiftyOnePage'
import { CustomerFiftyTwoPage }      from './pages/CustomerFiftyTwoPage'
import { CustomerFiftyThreePage }    from './pages/CustomerFiftyThreePage'
import { CustomerFiftyFourPage }     from './pages/CustomerFiftyFourPage'
import { CustomerFiftyFivePage }     from './pages/CustomerFiftyFivePage'
import { CustomerFiftySixPage }      from './pages/CustomerFiftySixPage'
import { CustomerFiftySevenPage }    from './pages/CustomerFiftySevenPage'
import { CustomerFiftyEightPage }    from './pages/CustomerFiftyEightPage'
import { CustomerFiftyNinePage }     from './pages/CustomerFiftyNinePage'
import { CustomerSixtyPage }         from './pages/CustomerSixtyPage'
import { CustomerSixtyOnePage }      from './pages/CustomerSixtyOnePage'
import { CustomerSixtyTwoPage }      from './pages/CustomerSixtyTwoPage'
import { CustomerSixtyThreePage }    from './pages/CustomerSixtyThreePage'
import { CustomerSixtyFourPage }     from './pages/CustomerSixtyFourPage'
import { CustomerSixtyFivePage }     from './pages/CustomerSixtyFivePage'
import { CustomerSixtySixPage }      from './pages/CustomerSixtySixPage'
import { CustomerSixtySevenPage }    from './pages/CustomerSixtySevenPage'
import { CustomerSixtyEightPage }    from './pages/CustomerSixtyEightPage'
import { CustomerSixtyNinePage }     from './pages/CustomerSixtyNinePage'
import { CustomerSeventyPage }       from './pages/CustomerSeventyPage'
import { CustomerSeventyOnePage }    from './pages/CustomerSeventyOnePage'
import { CustomerSeventyTwoPage }    from './pages/CustomerSeventyTwoPage'
import { CustomerSeventyThreePage }  from './pages/CustomerSeventyThreePage'
import { CustomerSeventyFourPage }   from './pages/CustomerSeventyFourPage'
import { CustomerSeventyFivePage }   from './pages/CustomerSeventyFivePage'
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
          <Route path="platform-launch"           element={<PlatformLaunchPage />}            />
          <Route path="vertical-editions"       element={<VerticalEditionPage />}           />
          <Route path="vertical-analytics"      element={<VerticalAnalyticsPage />}         />
          <Route path="vertical-gate-s140"      element={<VerticalSaasGatePage />}          />
          <Route path="oem-portal"              element={<OEMPortalPage />}                 />
          <Route path="oem-branding"            element={<OEMBrandingPage />}               />
          <Route path="oem-persona"             element={<OEMPersonaPage />}                />
          <Route path="oem-blueprints"          element={<OEMBlueprintPackagerPage />}      />
          <Route path="oem-fleet"               element={<OEMFleetPage />}                  />
          <Route path="oem-margin"              element={<OEMMarginPage />}                 />
          <Route path="oem-partner-zero"        element={<OEMPartnerZeroPage />}            />
          <Route path="oem-gate-s148"           element={<OEMGatePage />}                   />
          <Route path="uk-launch"              element={<UKLaunchPage />}                  />
          <Route path="eu-launch"              element={<EULaunchPage />}                  />
          <Route path="india-launch"           element={<IndiaLaunchPage />}               />
          <Route path="intl-personas"          element={<RegionalPersonaPage />}           />
          <Route path="intl-analytics"         element={<RegionalAnalyticsPage />}         />
          <Route path="intl-gate-s157"         element={<IntlGatePage />}                  />
          <Route path="gen4-corpus"            element={<CorpusAuditPage />}               />
          <Route path="gen4-dataset"           element={<DatasetExportPage />}             />
          <Route path="gen4-training"          element={<TrainingJobsPage />}              />
          <Route path="gen4-eval"              element={<Gen4EvalPage />}                  />
          <Route path="gen4-router"            element={<Gen4RouterPage />}                />
          <Route path="gen4-gate-s166"         element={<Gen4GatePage />}                  />
          <Route path="gen4-scale-50"          element={<Gen4Scale50Page />}               />
          <Route path="gen4-scale-80"          element={<Gen4Scale80Page />}               />
          <Route path="arr-intelligence"       element={<ARRIntelPage />}                  />
          <Route path="dunning"                element={<DunningPage />}                   />
          <Route path="enterprise-pipeline"    element={<EnterprisePipelinePage />}        />
          <Route path="ch9-gate-s170"          element={<Chapter9GatePage />}              />
          <Route path="customers/thirty"       element={<CustomerThirtyPage />}            />
          <Route path="customers/thirty-one"   element={<CustomerThirtyOnePage />}         />
          <Route path="customers/thirty-two"   element={<CustomerThirtyTwoPage />}         />
          <Route path="customers/thirty-three" element={<CustomerThirtyThreePage />}       />
          <Route path="customers/thirty-four"  element={<CustomerThirtyFourPage />}        />
          <Route path="customers/thirty-five"  element={<CustomerThirtyFivePage />}        />
          {/* S173–S181 feature routes */}
          <Route path="fleet-organic-seed"      element={<FleetOrganicSeedPage />}          />
          <Route path="health-score-v2"         element={<HealthScoreV2Page />}             />
          <Route path="onboarding-engine"       element={<OnboardingEnginePage />}          />
          <Route path="fleet-fifty-milestone"   element={<FleetFiftyMilestonePage />}       />
          <Route path="fleet-intelligence"      element={<FleetIntelligencePage />}         />
          <Route path="playbook-engine"         element={<PlaybookEnginePage />}            />
          <Route path="fleet-sixty"             element={<FleetSixtyPage />}                />
          <Route path="renewal-intel-v2"        element={<RenewalIntelV2Page />}            />
          <Route path="fleet-seventy-five"      element={<FleetSeventyFivePage />}          />
          <Route path="fleet-gate-s182"         element={<FleetGateS182Page />}             />
          {/* S183–S190 Enterprise Tier */}
          <Route path="sso-saml"                         element={<SsoSamlPage />}                        />
          <Route path="custom-domains"                   element={<CustomDomainsPage />}                  />
          <Route path="dedicated-compute"                element={<DedicatedComputePage />}               />
          <Route path="sla-management"                   element={<SlaManagementPage />}                  />
          <Route path="rbac-v2"                          element={<RbacV2Page />}                         />
          <Route path="enterprise-blueprint-templates"   element={<EnterpriseBlueprintTemplatesPage />}   />
          <Route path="digital-contracts"                element={<DigitalContractSuitePage />}           />
          <Route path="enterprise-gate-s190"             element={<EnterpriseGateS190Page />}             />
          {/* S191–S198 BIDS™ Commercial Track */}
          <Route path="bids-scorecard"              element={<BidsScorecardPage />}             />
          <Route path="bids-report-generator"       element={<BidsReportGeneratorPage />}       />
          <Route path="bids-client-portal"          element={<BidsClientPortalPage />}          />
          <Route path="bids-blueprint-prescription" element={<BidsBlueprintPrescriptionPage />} />
          <Route path="bids-vertical-packs"         element={<BidsVerticalPacksPage />}         />
          <Route path="bids-partner-delivery"       element={<BidsPartnerDeliveryPage />}       />
          <Route path="bids-smb-scan"               element={<BidsSmbScanPage />}              />
          <Route path="bids-gate-s198"              element={<BidsGateS198Page />}             />
          {/* S199–S207 Gen5 Foundation */}
          <Route path="gen5-architecture"          element={<Gen5ArchitecturePage />}          />
          <Route path="gen5-corpus-v2"             element={<TrainingCorpusV2Page />}          />
          <Route path="gen5-synthetic-pipeline"    element={<SyntheticDataPipelinePage />}     />
          <Route path="gen5-reasoning-module"      element={<Gen5ReasoningModulePage />}       />
          <Route path="gen5-pretraining"           element={<Gen5PretrainingPage />}           />
          <Route path="gen5-eval-suite"            element={<Gen5EvalSuitePage />}             />
          <Route path="gen5-ab-router"             element={<Gen5ABRouterPage />}              />
          <Route path="gen5-beta-routing"          element={<Gen5BetaRoutingPage />}           />
          <Route path="gen5-gate-s207"             element={<Gen5GateS207Page />}              />
          {/* S208–S212 TX Commercial Close */}
          <Route path="arr-dashboard-v2"           element={<ArrDashboardV2Page />}            />
          <Route path="professional-services-pack" element={<ProfServicesPackPage />}          />
          <Route path="sdk-v3-portal"              element={<SdkV3PortalPage />}               />
          <Route path="series-a-data-room"         element={<SeriesADataRoomPage />}           />
          <Route path="chapter-ten-gate-s212"      element={<ChapterTenGatePage />}            />
          {/* S291–S292 Series B / IPO Path — Chapter 12 TX */}
          <Route path="series-b-fundraise"       element={<SeriesBFundraisePage />}     />
          <Route path="chapter-12-gate-s292"     element={<GateS292Page />}             />
          {/* S283–S290 WAANDA-FM Alpha — Foundation Model (Chapter 12 T4) */}
          <Route path="wfm-corpus-assembly"      element={<WfmCorpusAssemblyPage />}   />
          <Route path="wfm-architecture"         element={<WfmArchitecturePage />}      />
          <Route path="wfm-pretraining-phase1"   element={<WfmPretrainingPhase1Page />} />
          <Route path="wfm-pretraining-phase2"   element={<WfmPretrainingPhase2Page />} />
          <Route path="wfm-finetuning"           element={<WfmFinetuningPage />}        />
          <Route path="wfm-benchmark"            element={<WfmBenchmarkPage />}         />
          <Route path="wfm-shadow-mode"          element={<WfmShadowModePage />}        />
          <Route path="wfm-gate-s290"            element={<GateS290Page />}             />
          {/* S273–S282 500-Customer Fleet · 12+ Regions (Chapter 12 T3) */}
          <Route path="canada-commercial-launch"    element={<CanadaLaunchPage />}         />
          <Route path="singapore-commercial-launch" element={<SingaporeLaunchPage />}      />
          <Route path="fleet-250-milestone"         element={<Fleet250Page />}             />
          <Route path="south-korea-commercial-launch" element={<SouthKoreaLaunchPage />}  />
          <Route path="fleet-300-milestone"         element={<Fleet300Page />}             />
          <Route path="africa-commercial-launch"    element={<AfricaLaunchPage />}         />
          <Route path="fleet-400-milestone"         element={<Fleet400Page />}             />
          <Route path="bids-200-engagements"        element={<Bids200EngagementsPage />}  />
          <Route path="fleet-500-milestone"         element={<Fleet500Page />}             />
          <Route path="fleet-gate-s282"             element={<GateS282Page />}            />
          {/* S263–S272 Fortune 500 Enterprise Tier (Chapter 12 T2) */}
          <Route path="soc2-type2-certification"       element={<Soc2TypeIIPage />}               />
          <Route path="fedramp-moderate"               element={<FedRampPage />}                  />
          <Route path="compliance-overview"            element={<ComplianceOverviewPage />}       />
          <Route path="contested-modules"              element={<ContestedModulesPage />}         />
          <Route path="gtm-pipeline"                   element={<GtmPipelinePage />}               />
          <Route path="partner-ecosystem"              element={<PartnerEcosystemPage />}          />
          <Route path="dedicated-success-teams"        element={<DedicatedSuccessTeamsPage />}    />
          <Route path="executive-business-reviews"     element={<ExecutiveBusinessReviewsPage />} />
          <Route path="f500-sales-motion"              element={<F500SalesMotionPage />}          />
          <Route path="resellers-program"              element={<ResellersProgramPage />}         />
          <Route path="f500-client-onboarding"         element={<F500ClientOnboardingPage />}     />
          <Route path="enterprise-acv"                 element={<EnterpriseACVPage />}            />
          <Route path="f500-logos"                     element={<F500LogosPage />}                />
          <Route path="f500-gate-s272"                 element={<GateS272Page />}                 />
          {/* S253–S262 WAANDA Gen3 Cognitive Engine (Chapter 12 T1) */}
          <Route path="gen3-architecture"              element={<Gen3ArchitecturePage />}         />
          <Route path="gen3-planning-engine"           element={<Gen3PlanningEnginePage />}       />
          <Route path="gen3-reasoning-engine"          element={<Gen3ReasoningEnginePage />}      />
          <Route path="gen3-language-generation"       element={<Gen3LanguageGenPage />}          />
          <Route path="gen3-multiturn-conversation"    element={<Gen3MultiturnPage />}            />
          <Route path="gen3-autonomous-goals"          element={<Gen3AutonomousGoalsPage />}      />
          <Route path="gen3-self-correction"           element={<Gen3SelfCorrectionPage />}       />
          <Route path="gen3-training-pipeline"         element={<Gen3TrainingPipelinePage />}     />
          <Route path="gen3-routing-50pct"             element={<Gen3Routing50Page />}            />
          <Route path="gen3-gate-s262"                 element={<GateS262Page />}                 />
          {/* S251–S252 Series A Close (Chapter 11 TX) */}
          <Route path="series-a-diligence"        element={<SeriesADiligencePage />}     />
          <Route path="chapter-11-gate-s252"      element={<GateS252Page />}             />
          {/* S243–S250 Platform Ecosystem (Chapter 11 T4) */}
          <Route path="app-store-v1"              element={<AppStorePage />}             />
          <Route path="integration-hub"           element={<IntegrationHubPage />}       />
          <Route path="hackathon-program"         element={<HackathonProgramPage />}     />
          <Route path="developer-community"       element={<DeveloperCommunityPage />}   />
          <Route path="waanda-certification"      element={<WaandaCertificationPage />}  />
          <Route path="marketplace-billing"       element={<MarketplaceBillingPage />}   />
          <Route path="partner-summit"            element={<PartnerSummitPage />}        />
          <Route path="ecosystem-gate-s250"       element={<GateS250Page />}             />
          {/* S233–S242 BIDS™ at Scale (Chapter 11 T3) */}
          <Route path="bids-automation-v2"          element={<BidsAutomationPage />}           />
          <Route path="bids-enterprise-tier"        element={<BidsEnterpriseTierPage />}       />
          <Route path="bids-first-ten-clients"      element={<BidsFirstTenClientsPage />}      />
          <Route path="bids-vertical-expansion"     element={<BidsVerticalExpansionPage />}    />
          <Route path="bids-ai-review"              element={<BidsAiReviewPage />}             />
          <Route path="bids-industry-benchmarking"  element={<BidsIndustryBenchmarkingPage />} />
          <Route path="bids-annual-subscription"    element={<BidsAnnualSubscriptionPage />}   />
          <Route path="bids-fifty-engagement"       element={<BidsFiftyEngagementPage />}      />
          <Route path="bids-certified-partners"     element={<BidsCertifiedPartnerPage />}     />
          <Route path="bids-gate-s242"              element={<GateS242Page />}                 />
          {/* S223–S232 Global Fleet 200 (Chapter 11 T2) */}
          <Route path="fleet-100-milestone"        element={<FleetHundredPage />}              />
          <Route path="japan-commercial-launch"    element={<JapanLaunchPage />}               />
          <Route path="fleet-125"                  element={<Fleet125Page />}                  />
          <Route path="anz-commercial-launch"      element={<AnzLaunchPage />}                 />
          <Route path="fleet-150"                  element={<Fleet150Page />}                  />
          <Route path="latam-commercial-launch"    element={<LatamLaunchPage />}               />
          <Route path="fleet-175"                  element={<Fleet175Page />}                  />
          <Route path="mena-commercial-launch"     element={<MenaLaunchPage />}                />
          <Route path="fleet-200-milestone"        element={<Fleet200Page />}                  />
          <Route path="fleet-gate-s232"            element={<GateS232Page />}                  />
          {/* S213–S222 Gen5 Primary Engine (Chapter 11 T1) */}
          <Route path="gen5-25-routing"            element={<Gen5RoutingPage />}               />
          <Route path="gen5-domain-specialisation" element={<Gen5DomainSpecialisationPage />}  />
          <Route path="gen5-50-routing"            element={<Gen5FiftyPercentPage />}          />
          <Route path="gen5-continuous-training"   element={<Gen5ContinuousTrainingPage />}    />
          <Route path="gen5-80-production"         element={<Gen5ProductionPage />}            />
          <Route path="gen5-agentic-reasoning"     element={<Gen5AgenticReasoningPage />}      />
          <Route path="gen5-cost-intelligence"     element={<Gen5CostIntelPage />}             />
          <Route path="gen5-95-routing"            element={<Gen5NinetyFivePercentPage />}     />
          <Route path="waanda-gen3-architecture"   element={<WaandaGen3ArchitecturePage />}    />
          <Route path="gen5-gate-s222"             element={<Gen5GateS222Page />}              />
          {/* Customer pages C36–C40 */}
          <Route path="customers/thirty-six"    element={<CustomerThirtySixPage />}         />
          <Route path="customers/thirty-seven"  element={<CustomerThirtySevenPage />}       />
          <Route path="customers/thirty-eight"  element={<CustomerThirtyEightPage />}       />
          <Route path="customers/thirty-nine"   element={<CustomerThirtyNinePage />}        />
          <Route path="customers/forty"         element={<CustomerFortyPage />}             />
          {/* C41–C50 */}
          <Route path="customers/forty-one"     element={<CustomerFortyOnePage />}          />
          <Route path="customers/forty-two"     element={<CustomerFortyTwoPage />}          />
          <Route path="customers/forty-three"   element={<CustomerFortyThreePage />}        />
          <Route path="customers/forty-four"    element={<CustomerFortyFourPage />}         />
          <Route path="customers/forty-five"    element={<CustomerFortyFivePage />}         />
          <Route path="customers/forty-six"     element={<CustomerFortySixPage />}          />
          <Route path="customers/forty-seven"   element={<CustomerFortySevenPage />}        />
          <Route path="customers/forty-eight"   element={<CustomerFortyEightPage />}        />
          <Route path="customers/forty-nine"    element={<CustomerFortyNinePage />}         />
          <Route path="customers/fifty"         element={<CustomerFiftyPage />}             />
          {/* C51–C60 */}
          <Route path="customers/fifty-one"     element={<CustomerFiftyOnePage />}          />
          <Route path="customers/fifty-two"     element={<CustomerFiftyTwoPage />}          />
          <Route path="customers/fifty-three"   element={<CustomerFiftyThreePage />}        />
          <Route path="customers/fifty-four"    element={<CustomerFiftyFourPage />}         />
          <Route path="customers/fifty-five"    element={<CustomerFiftyFivePage />}         />
          <Route path="customers/fifty-six"     element={<CustomerFiftySixPage />}          />
          <Route path="customers/fifty-seven"   element={<CustomerFiftySevenPage />}        />
          <Route path="customers/fifty-eight"   element={<CustomerFiftyEightPage />}        />
          <Route path="customers/fifty-nine"    element={<CustomerFiftyNinePage />}         />
          <Route path="customers/sixty"         element={<CustomerSixtyPage />}             />
          {/* C61–C75 */}
          <Route path="customers/sixty-one"     element={<CustomerSixtyOnePage />}          />
          <Route path="customers/sixty-two"     element={<CustomerSixtyTwoPage />}          />
          <Route path="customers/sixty-three"   element={<CustomerSixtyThreePage />}        />
          <Route path="customers/sixty-four"    element={<CustomerSixtyFourPage />}         />
          <Route path="customers/sixty-five"    element={<CustomerSixtyFivePage />}         />
          <Route path="customers/sixty-six"     element={<CustomerSixtySixPage />}          />
          <Route path="customers/sixty-seven"   element={<CustomerSixtySevenPage />}        />
          <Route path="customers/sixty-eight"   element={<CustomerSixtyEightPage />}        />
          <Route path="customers/sixty-nine"    element={<CustomerSixtyNinePage />}         />
          <Route path="customers/seventy"       element={<CustomerSeventyPage />}           />
          <Route path="customers/seventy-one"   element={<CustomerSeventyOnePage />}        />
          <Route path="customers/seventy-two"   element={<CustomerSeventyTwoPage />}        />
          <Route path="customers/seventy-three" element={<CustomerSeventyThreePage />}      />
          <Route path="customers/seventy-four"  element={<CustomerSeventyFourPage />}       />
          <Route path="customers/seventy-five"  element={<CustomerSeventyFivePage />}       />
          <Route path="customers/twenty-one"   element={<CustomerTwentyOnePage />}         />
          <Route path="customers/twenty-two"    element={<CustomerTwentyTwoPage />}         />
          <Route path="customers/twenty-three"  element={<CustomerTwentyThreePage />}       />
          <Route path="customers/twenty-four"   element={<CustomerTwentyFourPage />}        />
          <Route path="customers/twenty-five"   element={<CustomerTwentyFivePage />}        />
          <Route path="customers/twenty-six"    element={<CustomerTwentySixPage />}         />
          <Route path="customers/twenty-seven"  element={<CustomerTwentySevenPage />}       />
          <Route path="customers/twenty-eight"  element={<CustomerTwentyEightPage />}       />
          <Route path="customers/twenty-nine"   element={<CustomerTwentyNinePage />}        />
          <Route path="*"                       element={<Navigate to={BASE} replace />}    />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
