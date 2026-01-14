export const employees = [
  {
    id: "ENG001",
    name: "Sarah Johnson",
    email: "sarah.johnson@humana.com",
    department: "Engineering",
    position: "Senior Developer",
    joinDate: "2022-01-15",
    phone: "+62 812-3456-7890",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    id: "MKT002",
    name: "Michael Chen",
    email: "michael.chen@humana.com",
    department: "Marketing",
    position: "Marketing Manager",
    joinDate: "2021-06-20",
    phone: "+62 813-4567-8901",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
  },
  {
    id: "HR003",
    name: "Priya Patel",
    email: "priya.patel@humana.com",
    department: "HR",
    position: "HR Specialist",
    joinDate: "2023-03-10",
    phone: "+62 814-5678-9012",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
  },
  {
    id: "ENG004",
    name: "James Wilson",
    email: "james.wilson@humana.com",
    department: "Engineering",
    position: "DevOps Engineer",
    joinDate: "2022-09-05",
    phone: "+62 815-6789-0123",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James"
  },
  {
    id: "SAL005",
    name: "Emma Rodriguez",
    email: "emma.rodriguez@humana.com",
    department: "Sales",
    position: "Sales Executive",
    joinDate: "2023-01-12",
    phone: "+62 816-7890-1234",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
  },
  {
    id: "FIN006",
    name: "David Kim",
    email: "david.kim@humana.com",
    department: "Finance",
    position: "Financial Analyst",
    joinDate: "2021-11-08",
    phone: "+62 817-8901-2345",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
  },
  {
    id: "FIN008",
    name: "Kim Jong Un",
    email: "Kim.jong@humana.com",
    department: "Finance",
    position: "Financial Analyst",
    joinDate: "2021-11-08",
    phone: "+62 817-8901-2345",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kim"
  },
  {
    id: "ENG009",
    name: "John Nathan",
    email: "john.nathan@humana.com",
    department: "Engineering",
    position: "Software Engineer",
    joinDate: "2021-11-08",
    phone: "+62 819-3456-6666",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  }
];

export const attendance = [
  {
    id: "ATT001",
    employeeId: "ENG001",
    employeeName: "Sarah Johnson",
    date: "2024-11-24",
    checkIn: "08:45",
    checkOut: "17:30",
    status: "Present",
    location: { lat: -6.2088, lng: 106.8456, address: "Jakarta Office" }
  },
  {
    id: "ATT002",
    employeeId: "MKT002",
    employeeName: "Michael Chen",
    date: "2024-11-24",
    checkIn: "09:00",
    checkOut: "18:00",
    status: "Present",
    location: { lat: -6.2287, lng: 106.8456, address: "South Jakarta Office" }
  },
  {
    id: "ATT003",
    employeeId: "HR003",
    employeeName: "Priya Patel",
    date: "2024-11-24",
    checkIn: "08:30",
    checkOut: "17:15",
    status: "Present",
    location: { lat: -6.1944, lng: 106.8229, address: "Central Jakarta Office" }
  },
  {
    id: "ATT004",
    employeeId: "ENG004",
    employeeName: "James Wilson",
    date: "2024-11-24",
    checkIn: "08:50",
    checkOut: null,
    status: "Present",
    location: { lat: -6.2615, lng: 106.7810, address: "West Jakarta Office" }
  },
  {
    id: "ATT005",
    employeeId: "SAL005",
    employeeName: "Emma Rodriguez",
    date: "2024-11-24",
    checkIn: "09:15",
    checkOut: "17:45",
    status: "Late",
    location: { lat: -6.1751, lng: 106.8650, address: "North Jakarta Office" }
  },
  {
    id: "ATT006",
    employeeId: "FIN006",
    employeeName: "David Kim",
    date: "2024-11-24",
    checkIn: null,
    checkOut: null,
    status: "Absent",
    location: null
  }
];

export const leaveRequests = [
  {
    id: "LR001",
    employeeId: "ENG001",
    employeeName: "Sarah Johnson",
    type: "Annual Leave",
    startDate: "2024-12-01",
    endDate: "2024-12-05",
    days: 5,
    reason: "Family vacation at Bali",
    status: "Pending",
    requestDate: "2024-11-20"
  },
  {
    id: "LR002",
    employeeId: "MKT002",
    employeeName: "Michael Chen",
    type: "Sick Leave",
    startDate: "2024-11-22",
    endDate: "2024-11-22",
    days: 1,
    reason: "Medical appointment (Dental)",
    status: "Approved",
    requestDate: "2024-11-21"
  },
  {
    id: "LR003",
    employeeId: "HR003",
    employeeName: "Priya Patel",
    type: "Maternity Leave",
    startDate: "2024-12-10",
    endDate: "2025-03-10",
    days: 90,
    reason: "Maternity leave",
    status: "Pending",
    requestDate: "2024-11-23"
  },
  {
    id: "LR004",
    employeeId: "SAL005",
    employeeName: "Emma Rodriguez",
    type: "Bereavement Leave",
    startDate: "2024-11-18",
    endDate: "2024-11-20",
    days: 3,
    reason: "Family emergency",
    status: "Approved",
    requestDate: "2024-11-10"
  },
  {
    id: "LR005",
    employeeId: "ENG004",
    employeeName: "James Wilson",
    type: "Unpaid Leave",
    startDate: "2024-11-25",
    endDate: "2024-11-26",
    days: 2,
    reason: "Personal sabbatical",
    status: "Rejected",
    requestDate: "2024-11-24"
  },
  {
    id: "LR006",
    employeeId: "FIN006",
    employeeName: "David Kim",
    type: "Remote Work",
    startDate: "2024-12-05",
    endDate: "2024-12-06",
    days: 2,
    reason: "Working from hometown",
    status: "Approved",
    requestDate: "2024-12-01"
  }
];

export const recruitments = [
  {
    id: "JOB001",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Jakarta",
    type: "Full-time",
    status: "Open",
    applicants: 24,
    posted: "2024-11-10",
    description: "Looking for experienced frontend developer with React expertise"
  },
  {
    id: "JOB002",
    title: "Product Manager",
    department: "Product",
    location: "Remote",
    type: "Full-time",
    status: "Open",
    applicants: 18,
    posted: "2024-11-15",
    description: "Seeking product manager to lead product strategy and development"
  },
  {
    id: "JOB003",
    title: "UI/UX Designer",
    department: "Design",
    location: "Jakarta",
    type: "Contract",
    status: "Open",
    applicants: 31,
    posted: "2024-11-05",
    description: "Creative designer needed for web and mobile applications"
  },
  {
    id: "JOB004",
    title: "Data Analyst",
    department: "Analytics",
    location: "Jakarta",
    type: "Full-time",
    status: "Closed",
    applicants: 45,
    posted: "2024-10-28",
    description: "Data analyst to drive insights and decision making"
  },
  {
    id: "JOB005",
    title: "HR Coordinator",
    department: "HR",
    location: "Jakarta",
    type: "Full-time",
    status: "Open",
    applicants: 12,
    posted: "2024-11-20",
    description: "Support HR team with recruitment and employee engagement"
  }
];
