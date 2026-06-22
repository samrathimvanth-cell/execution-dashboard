import * as XLSX from 'xlsx'
import { programs } from './src/data/dashboardData.js'

const wb = XLSX.utils.book_new()

// Sheet 1: Programs
const programRows = programs.map(p => ({
  ProgramID: p.id,
  ProgramName: p.name,
  Status: p.status,
  Health: p.health === 'green' ? 'On Track' : p.health === 'yellow' ? 'At Risk' : 'Critical',
  Description: p.description,
  TotalTeams: p.teams.length,
  TotalMembers: p.teams.reduce((s, t) => s + t.memberCount, 0),
  TotalEpics: p.teams.reduce((s, t) => s + t.epics.length, 0),
}))
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(programRows), 'Programs')

// Sheet 2: Risks
const riskRows = programs.flatMap(p =>
  p.risks.map(r => ({
    ProgramID: p.id,
    ProgramName: p.name,
    RiskID: r.id,
    RiskDescription: r.description,
    Severity: r.severity,
    Owner: r.owner,
    BlockedReason: r.blockedReason,
  }))
)
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(riskRows), 'Risks')

// Sheet 3: Accomplishments
const accomplishmentRows = programs.flatMap(p =>
  p.accomplishments.map((a, i) => ({
    ProgramID: p.id,
    ProgramName: p.name,
    ItemNumber: i + 1,
    Accomplishment: a,
  }))
)
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(accomplishmentRows), 'Accomplishments')

// Sheet 4: Goals Next Week
const goalRows = programs.flatMap(p =>
  p.goals.map((g, i) => ({
    ProgramID: p.id,
    ProgramName: p.name,
    ItemNumber: i + 1,
    GoalNextWeek: g,
  }))
)
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(goalRows), 'Goals_Next_Week')

// Sheet 5: Teams
const teamRows = programs.flatMap(p =>
  p.teams.map(t => ({
    ProgramID: p.id,
    ProgramName: p.name,
    TeamID: t.id,
    TeamName: t.name,
    MemberCount: t.memberCount,
    EpicCount: t.epics.length,
    DoneEpics: t.epics.filter(e => e.status === 'Done').length,
    BlockedEpics: t.epics.filter(e => e.status === 'Blocked').length,
  }))
)
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(teamRows), 'Teams')

// Sheet 6: Epics
const epicRows = programs.flatMap(p =>
  p.teams.flatMap(t =>
    t.epics.map(e => ({
      ProgramID: p.id,
      ProgramName: p.name,
      TeamID: t.id,
      TeamName: t.name,
      EpicID: e.id,
      EpicName: e.name,
      Status: e.status,
      Owner: e.owner,
      StartDate: e.startDate,
      EndDate: e.endDate,
    }))
  )
)
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(epicRows), 'Epics')

XLSX.writeFile(wb, 'execution-dashboard-data.xlsx')
console.log('Generated execution-dashboard-data.xlsx with', programs.length, 'programs,', epicRows.length, 'epics')
