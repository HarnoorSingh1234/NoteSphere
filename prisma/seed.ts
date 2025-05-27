import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');
  console.log('Current Date: 2025-05-27 12:44:34');
  console.log('User: HarnoorSingh1234');

  // Step 1: Create 4 academic years
  console.log('Creating academic years...');
  
  const years = [
    { number: 1 }, // First Year
    { number: 2 }, // Second Year
    { number: 3 }, // Third Year
    { number: 4 }, 
  ];

  const createdYears = [];
  
  for (const year of years) {
    const createdYear = await prisma.year.upsert({
      where: { number: year.number },
      update: {},
      create: { number: year.number }
    });
    console.log(`Created year: ${createdYear.number}`);
    createdYears.push(createdYear);
  }

  // Step 2: Create 7 semesters associated with their respective years
  console.log('Creating semesters...');

  // Map of old semester IDs to their new information (year number and semester number)
  const semesterMapping = {
    'cmb6ar2b50001if04j8emm2xy': { yearNumber: 1, semesterNumber: 1 }, // First Year - Semester 1
    'cmb5o9zwf00020wqoigiw541m': { yearNumber: 1, semesterNumber: 2 }, // First Year - Semester 2
    'cmb6a2myt00010w5gp9q1k800': { yearNumber: 2, semesterNumber: 3 }, // Second Year - Semester 3
    'cmb6b45jn00010wq0vmnmvnza': { yearNumber: 2, semesterNumber: 4 }, // Second Year - Semester 4
    'cmb6b533n00030wq04hx9ho10': { yearNumber: 3, semesterNumber: 5 }, // Third Year - Semester 5
    'cmb6ep37e0001l804mjlubtzt': { yearNumber: 3, semesterNumber: 6 }, // Third Year - Semester 6
    'cmb6epf9o0003l8041tx93q5c': { yearNumber: 4, semesterNumber: 7 }, // Fourth Year - Semester 7
  };
  const semesterIdMap: Record<string, string> = {}; // To store the mapping from old to new semester IDs

  for (const [oldSemesterId, info] of Object.entries(semesterMapping)) {
    const year = createdYears.find(y => y.number === info.yearNumber);
    
    if (!year) {
      console.error(`Year ${info.yearNumber} not found!`);
      continue;
    }

    const createdSemester = await prisma.semester.upsert({
      where: {
        number_yearId: {
          number: info.semesterNumber,
          yearId: year.id
        }
      },
      update: {},
      create: {
        number: info.semesterNumber,
        yearId: year.id,
      }
    });
    
    console.log(`Created semester ${createdSemester.number} for year ${info.yearNumber}`);
    semesterIdMap[oldSemesterId] = createdSemester.id;
  }

  console.log('Creating subjects...');

  // Correctly mapped subjects according to syllabus
  const courses = [
    // SEMESTER 1
    {"id":"cmb6b7v630001i804oj7rfvn8","name":"Engineering Mechanics","code":"CEL1020","semesterId":"cmb6ar2b50001if04j8emm2xy"},
    {"id":"cmb6b8zgh0003i80497ds8tau","name":"Engineering Graphics & Drafting Using Auto CAD","code":"MEL1021","semesterId":"cmb6ar2b50001if04j8emm2xy"},
    {"id":"cmb6eswlj0001i904ha17clah","name":"Mathematics-I","code":"MTL1001","semesterId":"cmb6ar2b50001if04j8emm2xy"},
    {"id":"cmb6euqfm0001id04vxr6h1wq","name":"Physics","code":"PHL1083","semesterId":"cmb6ar2b50001if04j8emm2xy"},
    {"id":"cmb6evie20003id04etivdd53","name":"Introduction to Engg. Materials","code":"MEL1010","semesterId":"cmb6ar2b50001if04j8emm2xy"},
    {"id":"cmb6ew6a80001l7045fjofiw1","name":"Punjabi Compulsory-I","code":"PBL1021","semesterId":"cmb6ar2b50001if04j8emm2xy"},
    {"id":"cmb6ey9450003l704v9dkmm0d","name":"Mudhli Punjabi-I","code":"PBL1022","semesterId":"cmb6ar2b50001if04j8emm2xy"},
    {"id":"cmb6ezkh00005l704pvbvm05t","name":"Punjab History & Culture (1450-1716)","code":"HSL4060","semesterId":"cmb6ar2b50001if04j8emm2xy"},
    
    // SEMESTER 2
    {"id":"cmb6f0x3i0009l7047364gwhp","name":"Engineering Chemistry","code":"CYL1097","semesterId":"cmb5o9zwf00020wqoigiw541m"},
    {"id":"cmb6f5yf0000bl7042cuto3po","name":"Mathematics-II","code":"MTL1002","semesterId":"cmb5o9zwf00020wqoigiw541m"},
    {"id":"cmb6f6shb000dl704ykrkhjwi","name":"Basic Electrical & Electronics Engineering","code":"ECL1019","semesterId":"cmb5o9zwf00020wqoigiw541m"},
    {"id":"cmb6f8wyh000fl7040wj7fzoh","name":"Fundamentals of Information Technology & Programming using Python","code":"CSL1026","semesterId":"cmb5o9zwf00020wqoigiw541m"},
    {"id":"cmb6f9qr9000hl70426jols9n","name":"Communicative English-I","code":"ENL1001","semesterId":"cmb5o9zwf00020wqoigiw541m"},
    {"id":"cmb6falsn000jl704j1sp604e","name":"Manufacturing Practices","code":"MEP1002","semesterId":"cmb5o9zwf00020wqoigiw541m"},
    {"id":"cmb6fbo7u000ll704mnxvrxea","name":"Punjabi Compulsory-II","code":"PBL1031","semesterId":"cmb5o9zwf00020wqoigiw541m"},
    {"id":"cmb6fdczq000nl7041pxci77r","name":"Mudhli Punjabi-II","code":"PBL1032","semesterId":"cmb5o9zwf00020wqoigiw541m"},
    {"id":"cmb6fe6by000pl704vwsjyy10","name":"Punjab History & Culture (1717-1947)","code":"HSL5020","semesterId":"cmb5o9zwf00020wqoigiw541m"},
    
    // SEMESTER 3
    {"id":"cmb5odv8b00060wqo7kh32fx2","name":"Data Structures & Programming Methodology","code":"CSL2031","semesterId":"cmb6a2myt00010w5gp9q1k800"},
    {"id":"cmb5oc38f00040wqo1fokkbyd","name":"Programming in C++","code":"CSL2033","semesterId":"cmb6a2myt00010w5gp9q1k800"},
    {"id":"cmb5oeg2l00080wqono2myawc","name":"Digital Circuits & Logic Design","code":"ECL2091","semesterId":"cmb6a2myt00010w5gp9q1k800"},
    {"id":"cmb5ogkmr000e0wqo4mtx9u4i","name":"Written & Oral Technical Communication","code":"ENL2001","semesterId":"cmb6a2myt00010w5gp9q1k800"},
    {"id":"cmb5oeye1000a0wqoqqfw8ist","name":"Environmental Studies","code":"ESL2020","semesterId":"cmb6a2myt00010w5gp9q1k800"},
    {"id":"cmb5oftj9000c0wqomh5e1kp8","name":"Drug Abuse: Problem, Management and Prevention","code":"SOL1006","semesterId":"cmb6a2myt00010w5gp9q1k800"},
    {"id":"new001","name":"Mini Project","code":"CSP2034","semesterId":"cmb6a2myt00010w5gp9q1k800"},
    
    // SEMESTER 4
    {"id":"cmb6d81bu0001jp043co384fr","name":"Operating System","code":"CSL2040","semesterId":"cmb6b45jn00010wq0vmnmvnza"},
    {"id":"cmb6d9k070003jp04r9kl01pa","name":"Data Communication","code":"CSL2041","semesterId":"cmb6b45jn00010wq0vmnmvnza"},
    {"id":"cmb6da5ue0005jp04vnws2zdo","name":"System Programming","code":"CSL2043","semesterId":"cmb6b45jn00010wq0vmnmvnza"},
    {"id":"cmb6darl30007jp044g1zgssq","name":"Discrete Structures","code":"CSL2044","semesterId":"cmb6b45jn00010wq0vmnmvnza"},
    {"id":"cmb6dbckv0009jp04otjhxa95","name":"Computer Architecture","code":"CSL2045","semesterId":"cmb6b45jn00010wq0vmnmvnza"},
    {"id":"cmb6dcu5a0001jl04zjxcoh2q","name":"Human Rights and Constitutional Duties","code":"PSL0059","semesterId":"cmb6b45jn00010wq0vmnmvnza"},
    
    // SEMESTER 5
    {"id":"cmb6fiwsx000rl704tlwh55mb","name":"System Analysis And Design","code":"CSL3030","semesterId":"cmb6b533n00030wq04hx9ho10"},
    {"id":"cmb6fkey8000tl704fvwgft15","name":"Relational Database Management Systems","code":"CSL3032","semesterId":"cmb6b533n00030wq04hx9ho10"},
    {"id":"cmb6flu3m000vl704nnrhzkvq","name":"Design & Analysis of Algorithm","code":"CSL3033","semesterId":"cmb6b533n00030wq04hx9ho10"},
    {"id":"cmb6fmi7j000xl704svin05pz","name":"Formal Languages & Automata Theory","code":"CSL3051","semesterId":"cmb6b533n00030wq04hx9ho10"},
    {"id":"cmb6fnhfg000zl704y1hnzcxo","name":"Programming in ASP.Net","code":"CSL3036","semesterId":"cmb6b533n00030wq04hx9ho10"},
    {"id":"new002","name":"Interdisciplinary Course-I","code":"IC-I","semesterId":"cmb6b533n00030wq04hx9ho10"},
    
    // SEMESTER 6
    {"id":"cmb6fsgyk0011l704par1frye","name":"Object Oriented Analysis & Design","code":"CSL3042","semesterId":"cmb6ep37e0001l804mjlubtzt"},
    {"id":"cmb6ftjlm0013l704ybylwsvt","name":"Object Oriented Programming using JAVA","code":"CSL3044","semesterId":"cmb6ep37e0001l804mjlubtzt"},
    {"id":"cmb6fuijb0015l704txfs0frz","name":"Software Engineering and Testing","code":"CSL3050","semesterId":"cmb6ep37e0001l804mjlubtzt"},
    {"id":"cmb6fvdpo0017l704tcrz8fxx","name":"Real Time Systems","code":"CSL3047","semesterId":"cmb6ep37e0001l804mjlubtzt"},
    // Electives for Semester 6
    {"id":"cmb6fx31h001bl704v4i2k7xz","name":"Natural Language Processing","code":"CSL3045","semesterId":"cmb6ep37e0001l804mjlubtzt"},
    {"id":"cmb6fyaoi001dl704sp7qrniv","name":"System Hardware Design","code":"CSL3046","semesterId":"cmb6ep37e0001l804mjlubtzt"},
    {"id":"cmb6fzke4001fl704de75c0qb","name":"Operation Research","code":"CSL3048","semesterId":"cmb6ep37e0001l804mjlubtzt"},
    {"id":"cmb6g0nq9001hl704c3qf0f8a","name":"Language Processor","code":"CSL3049","semesterId":"cmb6ep37e0001l804mjlubtzt"},
    
    // SEMESTER 7
    {"id":"cmb6g1s6a001jl704068esx03","name":"Computer Graphics","code":"CSL4081","semesterId":"cmb6epf9o0003l8041tx93q5c"},
    {"id":"cmb6g2mgk001ll704l7iuo7cq","name":"Cloud Computing","code":"CSL4074","semesterId":"cmb6epf9o0003l8041tx93q5c"},
    {"id":"cmb6g3ejh001nl704ip99vk8b","name":"Artificial Intelligence","code":"CSL4077","semesterId":"cmb6epf9o0003l8041tx93q5c"},
    {"id":"cmb6g40na001pl704xgs42e9r","name":"Machine Learning","code":"CSL4078","semesterId":"cmb6epf9o0003l8041tx93q5c"},
    // Electives for Semester 7
    {"id":"cmb6g4vwa001rl704sbxeo46i","name":"Internet Protocol","code":"CSL4072","semesterId":"cmb6epf9o0003l8041tx93q5c"},
    {"id":"cmb6g5k86001tl704hxzcrb1c","name":"Advanced Microprocessors","code":"CSL4073","semesterId":"cmb6epf9o0003l8041tx93q5c"},
    {"id":"cmb6g5k86001tl704hxzcrb1d","name":"Robotics","code":"CSL4076","semesterId":"cmb6epf9o0003l8041tx93q5c"},
  ];

  let subjectCount = 0;
  for (const course of courses) {
    // Map the old semester ID to the new one
    const newSemesterId = semesterIdMap[course.semesterId];
    
    if (!newSemesterId) {
      console.error(`No mapping found for old semester ID: ${course.semesterId}`);
      continue;
    }    
    
    try {
      await prisma.subject.upsert({
        where: {
          code_semesterId: {
            code: course.code.trim(),
            semesterId: newSemesterId
          }
        },
        update: {
          name: course.name.trim()
        },
        create: {
          name: course.name.trim(),
          code: course.code.trim(),
          semesterId: newSemesterId
        }
      });
      subjectCount++;
    } catch (error: any) {
      console.error(`Error creating subject ${course.name}: ${error.message}`);
    }
  }

  console.log(`Created ${subjectCount} subjects successfully!`);
  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });