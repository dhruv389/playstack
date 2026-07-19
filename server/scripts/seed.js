/**
 * Seed script — 65 employees across all departments, proper hierarchy,
 * realistic salaries, mixed status, spread joining dates 2018-2025.
 *
 * Run: node scripts/seed.js
 */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env') })

import Employee from '../models/Employee.js'
import User from '../models/User.js'

const av = (n) => `https://i.pravatar.cc/150?img=${n}`

// key, employeeId, name, email, phone, dept, designation, salary, joining, status, role, managerKey, avatar
const DATA = [
  // ── TOP LEVEL ──────────────────────────────────────────────────────────────
  ['e001','ORB-1001','Aarav Sharma',      'aarav.sharma@orbit.io',      '+91 98200 11001','Engineering',      'C-Level',        5200000,'2018-01-15','Active',  'Super Admin', null,   1],
  // ── HR ─────────────────────────────────────────────────────────────────────
  ['e002','ORB-1002','Priya Nair',         'priya.nair@orbit.io',        '+91 98200 11002','Human Resources',  'Director',       3800000,'2018-03-20','Active',  'HR Manager',  'e001', 47],
  ['e003','ORB-1003','Neha Kapoor',        'neha.kapoor@orbit.io',       '+91 98200 11003','Human Resources',  'Manager',        2200000,'2019-02-18','Active',  'HR Manager',  'e002', 48],
  ['e004','ORB-1004','Sanya Chopra',       'sanya.chopra@orbit.io',      '+91 98200 11004','Human Resources',  'Senior Associate',1250000,'2020-05-11','Active',  'Employee',    'e003', 33],
  ['e005','ORB-1005','Fatima Noor',        'fatima.noor@orbit.io',       '+91 98200 11005','Human Resources',  'Associate',       880000,'2022-09-30','Active',  'Employee',    'e003', 44],
  ['e006','ORB-1006','Tanvi Mehrotra',     'tanvi.mehrotra@orbit.io',    '+91 98200 11006','Human Resources',  'Associate',       820000,'2023-06-12','Active',  'Employee',    'e003', 49],
  ['e007','ORB-1007','Raghav Pillai',      'raghav.pillai@orbit.io',     '+91 98200 11007','Human Resources',  'Intern',          380000,'2024-07-01','Active',  'Employee',    'e003', 50],
  // ── ENGINEERING ─────────────────────────────────────────────────────────────
  ['e008','ORB-1008','Kabir Mehta',        'kabir.mehta@orbit.io',       '+91 98200 11008','Engineering',      'Director',       4100000,'2018-06-01','Active',  'Employee',    'e001', 13],
  ['e009','ORB-1009','Arjun Iyer',         'arjun.iyer@orbit.io',        '+91 98200 11009','Engineering',      'Senior Manager', 2900000,'2019-04-22','Active',  'Employee',    'e008', 15],
  ['e010','ORB-1010','Meera Pillai',       'meera.pillai@orbit.io',      '+91 98200 11010','Engineering',      'Manager',        2450000,'2019-07-08','Active',  'Employee',    'e008', 29],
  ['e011','ORB-1011','Yash Khanna',        'yash.khanna@orbit.io',       '+91 98200 11011','Engineering',      'Team Lead',      2000000,'2020-06-15','Active',  'Employee',    'e009', 18],
  ['e012','ORB-1012','Tara Bhatt',         'tara.bhatt@orbit.io',        '+91 98200 11012','Engineering',      'Senior Associate',1650000,'2020-08-03','Active',  'Employee',    'e009', 34],
  ['e013','ORB-1013','Karan Joshi',        'karan.joshi@orbit.io',       '+91 98200 11013','Engineering',      'Associate',      1200000,'2021-01-19','Active',  'Employee',    'e010', 19],
  ['e014','ORB-1014','Riya Saxena',        'riya.saxena@orbit.io',       '+91 98200 11014','Engineering',      'Associate',      1150000,'2021-03-08','Inactive','Employee',    'e010', 35],
  ['e015','ORB-1015','Zara Hussain',       'zara.hussain@orbit.io',      '+91 98200 11015','Engineering',      'Intern',          420000,'2023-06-19','Active',  'Employee',    'e011', 42],
  ['e016','ORB-1016','Ibrahim Qureshi',    'ibrahim.qureshi@orbit.io',   '+91 98200 11016','Engineering',      'Intern',          420000,'2023-06-19','Active',  'Employee',    'e011', 28],
  ['e017','ORB-1017','Sameer Jain',        'sameer.jain@orbit.io',       '+91 98200 11017','Engineering',      'Senior Associate',1720000,'2021-08-22','Active',  'Employee',    'e010', 20],
  ['e018','ORB-1018','Pooja Krishnan',     'pooja.krishnan@orbit.io',    '+91 98200 11018','Engineering',      'Associate',       980000,'2022-11-14','Active',  'Employee',    'e011', 36],
  ['e019','ORB-1019','Dhruv Malviya',      'dhruv.malviya@orbit.io',     '+91 98200 11019','Engineering',      'Team Lead',      1980000,'2020-10-05','Active',  'Employee',    'e009', 21],
  ['e020','ORB-1020','Ananya Krishnan',    'ananya.krishnan@orbit.io',   '+91 98200 11020','Engineering',      'Senior Associate',1600000,'2022-03-17','Active',  'Employee',    'e019', 37],
  ['e021','ORB-1021','Rohan Tiwari',       'rohan.tiwari@orbit.io',      '+91 98200 11021','Engineering',      'Intern',          400000,'2024-06-03','Active',  'Employee',    'e019', 22],
  ['e022','ORB-1022','Kriti Sharma',       'kriti.sharma@orbit.io',      '+91 98200 11022','Engineering',      'Associate',       950000,'2023-01-09','Active',  'Employee',    'e010', 38],
  // ── PRODUCT ──────────────────────────────────────────────────────────────────
  ['e023','ORB-1023','Sara Thomas',        'sara.thomas@orbit.io',       '+91 98200 11023','Product',          'Director',       3950000,'2018-09-10','Active',  'Employee',    'e001', 25],
  ['e024','ORB-1024','Vikram Rao',         'vikram.rao@orbit.io',        '+91 98200 11024','Product',          'Manager',        2350000,'2019-08-19','Active',  'Employee',    'e023', 16],
  ['e025','ORB-1025','Aditya Kulkarni',    'aditya.kulkarni@orbit.io',   '+91 98200 11025','Product',          'Senior Associate',1550000,'2021-04-26','Active',  'Employee',    'e024', 23],
  ['e026','ORB-1026','Nisha Gowda',        'nisha.gowda@orbit.io',       '+91 98200 11026','Product',          'Associate',      1080000,'2022-08-22','Active',  'Employee',    'e024', 43],
  ['e027','ORB-1027','Prakash Venkat',     'prakash.venkat@orbit.io',    '+91 98200 11027','Product',          'Senior Associate',1480000,'2021-11-30','Active',  'Employee',    'e024', 24],
  ['e028','ORB-1028','Aditi Banerjee',     'aditi.banerjee@orbit.io',    '+91 98200 11028','Product',          'Associate',       990000,'2023-03-20','Active',  'Employee',    'e024', 51],
  ['e029','ORB-1029','Nikhil Goswami',     'nikhil.goswami@orbit.io',    '+91 98200 11029','Product',          'Intern',          390000,'2024-07-15','Active',  'Employee',    'e024', 52],
  // ── DESIGN ───────────────────────────────────────────────────────────────────
  ['e030','ORB-1030','Ishita Desai',       'ishita.desai@orbit.io',      '+91 98200 11030','Design',           'Manager',        2300000,'2019-11-02','Active',  'Employee',    'e023', 31],
  ['e031','ORB-1031','Pooja Reddy',        'pooja.reddy@orbit.io',       '+91 98200 11031','Design',           'Senior Associate',1500000,'2021-05-30','Active',  'Employee',    'e030', 36],
  ['e032','ORB-1032','Nikhil Anand',       'nikhil.anand@orbit.io',      '+91 98200 11032','Design',           'Associate',      1050000,'2021-07-12','Active',  'Employee',    'e030', 21],
  ['e033','ORB-1033','Shruti Vyas',        'shruti.vyas@orbit.io',       '+91 98200 11033','Design',           'Senior Associate',1600000,'2020-12-01','Active',  'Employee',    'e030', 53],
  ['e034','ORB-1034','Amit Kulkarni',      'amit.kulkarni@orbit.io',     '+91 98200 11034','Design',           'Associate',       920000,'2023-04-10','Active',  'Employee',    'e030', 54],
  ['e035','ORB-1035','Prerna Mishra',      'prerna.mishra@orbit.io',     '+91 98200 11035','Design',           'Intern',          380000,'2024-08-01','Active',  'Employee',    'e030', 55],
  // ── SALES ────────────────────────────────────────────────────────────────────
  ['e036','ORB-1036','Rohan Verma',        'rohan.verma@orbit.io',       '+91 98200 11036','Sales',            'Director',       3700000,'2019-01-11','Active',  'Employee',    'e001', 14],
  ['e037','ORB-1037','Dev Malhotra',       'dev.malhotra@orbit.io',      '+91 98200 11037','Sales',            'Manager',        2100000,'2020-01-14','Active',  'Employee',    'e036', 17],
  ['e038','ORB-1038','Divya Menon',        'divya.menon@orbit.io',       '+91 98200 11038','Sales',            'Associate',       980000,'2021-09-01','Active',  'Employee',    'e037', 37],
  ['e039','ORB-1039','Farhan Ali',         'farhan.ali@orbit.io',        '+91 98200 11039','Sales',            'Associate',       950000,'2021-10-18','Inactive','Employee',    'e037', 22],
  ['e040','ORB-1040','Suresh Pillai',      'suresh.pillai@orbit.io',     '+91 98200 11040','Sales',            'Senior Associate',1380000,'2021-03-25','Active',  'Employee',    'e037', 56],
  ['e041','ORB-1041','Meghna Patil',       'meghna.patil@orbit.io',      '+91 98200 11041','Sales',            'Associate',       900000,'2023-02-13','Active',  'Employee',    'e037', 57],
  ['e042','ORB-1042','Vivek Chauhan',      'vivek.chauhan@orbit.io',     '+91 98200 11042','Sales',            'Intern',          370000,'2024-06-20','Active',  'Employee',    'e037', 58],
  // ── MARKETING ────────────────────────────────────────────────────────────────
  ['e043','ORB-1043','Ananya Bose',        'ananya.bose@orbit.io',       '+91 98200 11043','Marketing',        'Manager',        2050000,'2020-02-27','Active',  'Employee',    'e036', 32],
  ['e044','ORB-1044','Simran Kaur',        'simran.kaur@orbit.io',       '+91 98200 11044','Marketing',        'Associate',       990000,'2022-01-05','Active',  'Employee',    'e043', 38],
  ['e045','ORB-1045','Advait Rane',        'advait.rane@orbit.io',       '+91 98200 11045','Marketing',        'Senior Associate',1350000,'2021-11-15','Active',  'Employee',    'e043', 45],
  ['e046','ORB-1046','Renu Sharma',        'renu.sharma@orbit.io',       '+91 98200 11046','Marketing',        'Associate',       870000,'2023-05-22','Active',  'Employee',    'e043', 59],
  ['e047','ORB-1047','Kartik Nanda',       'kartik.nanda@orbit.io',      '+91 98200 11047','Marketing',        'Intern',          360000,'2024-07-08','Active',  'Employee',    'e043', 60],
  // ── FINANCE ──────────────────────────────────────────────────────────────────
  ['e048','ORB-1048','Om Prakash',         'om.prakash@orbit.io',        '+91 98200 11048','Finance',          'Director',       2900000,'2019-12-09','Active',  'Employee',    'e001', 23],
  ['e049','ORB-1049','Lavanya Pillai',     'lavanya.pillai@orbit.io',    '+91 98200 11049','Finance',          'Manager',        2150000,'2020-10-22','Active',  'Employee',    'e048', 39],
  ['e050','ORB-1050','Chirag Shah',        'chirag.shah@orbit.io',       '+91 98200 11050','Finance',          'Senior Associate',1400000,'2021-06-14','Active',  'Employee',    'e049', 61],
  ['e051','ORB-1051','Ankita Roy',         'ankita.roy@orbit.io',        '+91 98200 11051','Finance',          'Associate',       980000,'2022-12-01','Active',  'Employee',    'e049', 62],
  ['e052','ORB-1052','Harsh Agarwal',      'harsh.agarwal@orbit.io',     '+91 98200 11052','Finance',          'Associate',       920000,'2023-07-18','Inactive','Employee',    'e049', 63],
  // ── OPERATIONS ────────────────────────────────────────────────────────────────
  ['e053','ORB-1053','Aryan Bajaj',        'aryan.bajaj@orbit.io',       '+91 98200 11053','Operations',       'Manager',        1980000,'2020-03-16','Active',  'Employee',    'e001', 24],
  ['e054','ORB-1054','Kritika Suri',       'kritika.suri@orbit.io',      '+91 98200 11054','Operations',       'Senior Associate',1250000,'2021-08-09','Active',  'Employee',    'e053', 40],
  ['e055','ORB-1055','Rahul Dubey',        'rahul.dubey@orbit.io',       '+91 98200 11055','Operations',       'Associate',       890000,'2022-02-14','Active',  'Employee',    'e053', 64],
  ['e056','ORB-1056','Sneha Tomar',        'sneha.tomar@orbit.io',       '+91 98200 11056','Operations',       'Associate',       860000,'2023-09-04','Active',  'Employee',    'e053', 65],
  ['e057','ORB-1057','Mohit Srivastava',   'mohit.srivastava@orbit.io',  '+91 98200 11057','Operations',       'Intern',          370000,'2024-08-19','Active',  'Employee',    'e053', 66],
  // ── CUSTOMER SUPPORT ──────────────────────────────────────────────────────────
  ['e058','ORB-1058','Rehan Siddiqui',     'rehan.siddiqui@orbit.io',    '+91 98200 11058','Customer Support', 'Manager',        1750000,'2020-07-27','Active',  'Employee',    'e001', 26],
  ['e059','ORB-1059','Aisha Fernandes',    'aisha.fernandes@orbit.io',   '+91 98200 11059','Customer Support', 'Senior Associate',1100000,'2021-10-12','Active',  'Employee',    'e058', 41],
  ['e060','ORB-1060','Manav Chandra',      'manav.chandra@orbit.io',     '+91 98200 11060','Customer Support', 'Associate',       760000,'2022-06-01','Inactive','Employee',    'e058', 27],
  ['e061','ORB-1061','Gauri Pandey',       'gauri.pandey@orbit.io',      '+91 98200 11061','Customer Support', 'Associate',       800000,'2023-01-23','Active',  'Employee',    'e058', 67],
  ['e062','ORB-1062','Vinay Nair',         'vinay.nair@orbit.io',        '+91 98200 11062','Customer Support', 'Associate',       780000,'2023-08-07','Active',  'Employee',    'e058', 68],
  ['e063','ORB-1063','Priyanka Das',       'priyanka.das@orbit.io',      '+91 98200 11063','Customer Support', 'Intern',          360000,'2024-07-22','Active',  'Employee',    'e058', 69],
  // ── 2025 NEW JOINERS (for Recent Joiners widget) ───────────────────────────────
  ['e064','ORB-1064','Aryan Mehta',        'aryan.mehta@orbit.io',       '+91 98200 11064','Engineering',      'Associate',       950000,'2025-01-06','Active',  'Employee',    'e010', 70],
  ['e065','ORB-1065','Divya Sharma',       'divya.sharma@orbit.io',      '+91 98200 11065','Product',          'Associate',       980000,'2025-02-17','Active',  'Employee',    'e024', 71],
  ['e066','ORB-1066','Rahul Gupta',        'rahul.gupta@orbit.io',       '+91 98200 11066','Design',           'Intern',          390000,'2025-03-03','Active',  'Employee',    'e030', 72],
  ['e067','ORB-1067','Sneha Reddy',        'sneha.reddy@orbit.io',       '+91 98200 11067','Marketing',        'Associate',       870000,'2025-04-14','Active',  'Employee',    'e043', 73],
  ['e068','ORB-1068','Kunal Verma',        'kunal.verma@orbit.io',       '+91 98200 11068','Sales',            'Associate',       910000,'2025-05-28','Active',  'Employee',    'e037', 74],
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    await Employee.deleteMany({})
    await User.deleteMany({})
    console.log('🗑️  Cleared existing data')

    // ── Step 1: Insert all employees WITHOUT managers ──────────────────────────
    const idMap = {} // key → ObjectId

    for (const row of DATA) {
      const [key, employeeId, name, email, phone, dept, designation, salary, joiningDate, status, role, , avatar] = row
      const doc = await Employee.create({
        employeeId,
        name,
        email,
        phone,
        department: dept,
        designation,
        salary,
        joiningDate,
        status,
        role,
        profileImage: av(avatar),
        reportingManagerId: null,
      })
      idMap[key] = doc._id
    }
    console.log(`✅ Inserted ${DATA.length} employees`)

    // ── Step 2: Wire up managers ────────────────────────────────────────────────
    for (const row of DATA) {
      const [key, , , , , , , , , , , managerKey] = row
      if (managerKey) {
        await Employee.findByIdAndUpdate(idMap[key], {
          reportingManagerId: idMap[managerKey],
        })
      }
    }
    console.log('✅ Manager hierarchy wired up')

    // ── Step 3: Create 3 auth user accounts ─────────────────────────────────────
    const users = [
      { key: 'e001', email: 'aarav.sharma@orbit.io',  password: 'admin123', role: 'Super Admin', name: 'Aarav Sharma',  avatar: av(1)  },
      { key: 'e002', email: 'priya.nair@orbit.io',    password: 'hr123',    role: 'HR Manager',  name: 'Priya Nair',    avatar: av(47) },
      { key: 'e013', email: 'karan.joshi@orbit.io',   password: 'emp123',   role: 'Employee',    name: 'Karan Joshi',   avatar: av(19) },
    ]

    for (const u of users) {
      const user = await User.create({
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
        profileImage: u.avatar,
        employeeRecordId: idMap[u.key],
      })
      await Employee.findByIdAndUpdate(idMap[u.key], { userId: user._id })
    }
    console.log('✅ Created 3 auth user accounts')

    console.log('\n🎉 Seed complete! 68 employees across 9 departments.\n')
    console.log('  Super Admin → aarav.sharma@orbit.io / admin123')
    console.log('  HR Manager  → priya.nair@orbit.io   / hr123')
    console.log('  Employee    → karan.joshi@orbit.io  / emp123')
    console.log()

    process.exit(0)
  } catch (err) {
    console.error('❌ Seed failed:', err.message || err)
    process.exit(1)
  }
}

seed()
