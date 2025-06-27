const defaultCertificates = [
  {
    id: '2',
    title: 'Meta Front-End Development',
    issuer: 'Meta',
    date: '2023-11-22',
    category: 'Development',
    status: 'In Progress',
    imageUrl: 'https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg',
    /* master-programme summary shown when this parent cert is opened */
    takeaway: `Built a full front-end stack: HTML5, modern CSS (Flexbox, Grid), Mastered JavaScript ES6+, DOM manipulation & debugging techniques, learned React component model, hooks & routing; authored a capstone SPA  
  • Applied UX/UI heuristics, wire-framing and responsive design principles  
  • Used Git/GitHub for real-world version control and peer collaboration  
  • Completed coding-interview prep with algorithmic problem-solving exercises`,
    
    /* sub-certificates shown as a carousel in the modal */
    children: [
      {
        id: '2-1',
        title: 'Introduction to Front-End Development',
        takeaway: 'Front-end vs back-end roles, how the web works, basic HTML/CSS.',
        certificateLink: 'https://coursera.org/share/fd7ee9d775c78021fae48139f5953a7b',
        status: 'Completed'
      },
      {
        id: '2-2',
        title: 'Programming with JavaScript',
        imageUrl: 'https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg',
        takeaway: 'JS syntax, data structures, functions, OOP, debugging.',
        certificateLink: 'https://coursera.org/share/e00e1e065c7d33319d8f68fc4f295588',
        status: 'Completed'
      },
      {
        id: '2-3',
        title: 'Version Control',
        imageUrl: 'https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg',
        takeaway: 'Git basics, branching, merging, GitHub collaboration workflow.',
        certificateLink: 'https://coursera.org/share/ba8f1d90a0d34dd512f00c854003f900',
        status: 'Completed'
      },
      {
        id: '2-4',
        title: 'HTML & CSS in Depth',
        imageUrl: 'https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg',
        takeaway: 'Semantic HTML, Flexbox, Grid, media queries, accessibility.',
        certificateLink: 'https://coursera.org/share/<your-cert-link-4>',
        status: 'In Progress'
      },
      {
        id: '2-5',
        title: 'React Basics',
        imageUrl: 'https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg',
        takeaway: 'Components, JSX, props, state, simple UI interactions.',
        certificateLink: 'https://coursera.org/share/63c238e2094e735116181846e8d77b03',
        status: 'Completed'
      },
      {
        id: '2-6',
        title: 'Advanced React',
        imageUrl: 'https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg',
        takeaway: 'Hooks, Context API, React Router, performance optimisation.',
        certificateLink: 'https://coursera.org/share/<your-cert-link-6>',
        status: 'In Progress'
      },
      {
        id: '2-7',
        title: 'Principles of UX/UI Design',
        imageUrl: 'https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg',
        takeaway: 'Design thinking, wire-frames, prototypes, usability testing.',
        certificateLink: 'https://coursera.org/share/<your-cert-link-7>',
        status: 'In Progress'
      },
      {
        id: '2-8',
        title: 'Front-End Developer Capstone',
        imageUrl: 'https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg',
        takeaway: 'Built & deployed a production-ready React SPA as final project.',
        certificateLink: 'https://coursera.org/share/<your-cert-link-8>',
        status: 'In Progress'
      },
      {
        id: '2-9',
        title: 'Coding Interview Preparation',
        imageUrl: 'https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg',
        takeaway: 'Algorithm practice, white-boarding, behavioural interview tips.',
        certificateLink: 'https://coursera.org/share/<your-cert-link-9>',
        status: 'In Progress'
      }
    ]
  },
  {
    id: '3',
    title: 'Microsoft Power BI Data Analyst',
    issuer: 'Microsoft',
    date: '2023-08-10',
    category: 'Data',
    imageUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',
    takeaway: 'Learned end-to-end analytics process from asking questions to driving decisions with data.',
    status: 'In Progress',
    children: [
    { id: '3-1',
      title: 'Preparing Data for Analysis with Microsoft Excel',
      imageUrl: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg',
      takeaway: 'Excel techniques for cleaning, profiling & reshaping data prior to Power BI.',
      certificateLink: 'https://coursera.org/share/<CERT-LINK-1>',
      status: 'Completed'
    },
    { id: '3-2',
      title: 'Harnessing the Power of Data with Power BI',
      imageUrl: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg',
      takeaway: 'Power BI analyst roles, data-analysis lifecycle & core service overview.',
      certificateLink: 'https://coursera.org/share/<CERT-LINK-2>',
      status: 'Completed'
    },
    { id: '3-3',
      title: 'Extract, Transform and Load Data in Power BI',
      imageUrl: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg',
      takeaway: 'Storage modes, Power Query transforms, dataflows & anomaly detection.',
      certificateLink: 'https://coursera.org/share/<CERT-LINK-3>',
      status: 'In Progress'
    },
    { id: '3-4',
      title: 'Data Modeling in Power BI',
      imageUrl: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg',
      takeaway: 'Star-schema modelling, DAX calculations & model performance tuning.',
      certificateLink: 'https://coursera.org/share/<CERT-LINK-4>',
      status: 'In Progress'
    },
    { id: '3-5',
      title: 'Data Analysis and Visualization with Power BI',
      imageUrl: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg',
      takeaway: 'Built interactive visuals, reports and dashboards for data storytelling.',
      certificateLink: 'https://coursera.org/share/<CERT-LINK-5>',
      status: 'In Progress'
    },
    { id: '3-6',
      title: 'Creative Designing in Power BI',
      imageUrl: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg',
      takeaway: 'Advanced visuals, custom themes, streaming tiles and multimedia add-ins.',
      certificateLink: 'https://coursera.org/share/<CERT-LINK-6>',
      status: 'In Progress'
    },
    { id: '3-7',
      title: 'Deploy and Maintain Power BI Assets & Capstone',
      imageUrl: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg',
      takeaway: 'Created & published apps, implemented row-level security, completed capstone.',
      certificateLink: 'https://coursera.org/share/<CERT-LINK-7>',
      status: 'In Progress'
    },
    { id: '3-8',
      title: 'Microsoft PL-300 Exam Preparation & Practice',
      imageUrl: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg',
      takeaway: 'Mock exams and practice labs covering the full PL-300 exam blueprint.',
      certificateLink: 'https://coursera.org/share/<CERT-LINK-8>',
      status: 'In Progress'
    }
  ]
  },
  {
    id: '4',
    title: 'Excel Skills for Business',
    issuer: 'Macquarie University',
    date: '2023-09-15',
    category: 'Data',
    imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    takeaway: `• Progressed from Excel essentials to power-user level across four courses
               • Built dashboards, cleaned large datasets and automated tasks with advanced formulas & macros
               • Applied data-validation, what-if analysis, forecasting and modelling techniques
               • Completed real-world business case projects using full downloadable workbooks`,
    status: 'Completed',
    children: [
      { id: '4-1',
        title: 'Excel Skills for Business: Essentials',
        imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
        takeaway: 'Navigation, formatting, basic formulas, charts & foundational spreadsheet skills.',
        certificateLink: 'https://coursera.org/share/e9b946c8df2c85e70d1ba00b29b29eb9',
        status: 'Completed'
      },
      { id: '4-2',
        title: 'Excel Skills for Business: Intermediate I',
        imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
        takeaway: 'Large-dataset management, logical & lookup functions, productivity features.',
        certificateLink: 'https://coursera.org/share/70874b50c9a484f601f77670f1cf45a3',
        status: 'Completed'
      },
      { id: '4-3',
        title: 'Excel Skills for Business: Intermediate II',
        imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
        takeaway: 'Error-proofing, advanced formulas, automation with macros, forecasting models.',
        certificateLink: 'https://coursera.org/share/477cc362c9e434e81edeeb1efd2ba20c',
        status: 'Completed',
      },
      { id: '4-4',
        title: 'Excel Skills for Business: Advanced',
        imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
        takeaway: 'Power-user techniques: advanced lookups, data cleaning, professional dashboards.',
        certificateLink: 'https://coursera.org/share/0368fc9498f32572d799b0b75c0ed176',
        status: 'Completed'
      }
    ]
  },
  {
  id: '5',
  title: 'AWS Cloud Practitioner Essentials',
  issuer: 'Coursera',
  date: '2025-06-20',
  category: 'Cloud',
  imageUrl: 'https://images.pexels.com/photos/325111/pexels-photo-325111.jpeg',
  takeaway: 'Gaining foundational knowledge of AWS services, cloud concepts, security, and architecture best practices.',
  status: 'In Progress',
  children: [
    {
      id: '5-1',
      title: 'AWS Cloud Technical Essentials',
      imageUrl: 'https://images.pexels.com/photos/325111/pexels-photo-325111.jpeg',
      takeaway: 'Learning core AWS services, terminology, compute, storage, database, and security basics.',
      certificateLink: 'https://coursera.org/share/<CERT-LINK-A1>',
      status: 'In Progress'
    }
    ]
  },
  {
    id: '6',
    title: 'Masters in Data Analytics',
    issuer: 'National College of Ireland (NCI)',
    date: '2025-02-06',
    category: 'Academic',
    imageUrl: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg',
    takeaway: 'Learned end-to-end analytics process from asking questions to driving decisions with data.',
    status: 'Completed',
  },
  {
    id: '7',
    title: 'Bachelors in Computer Science',
    issuer: 'SASTRA University',
    date: '2023-08-10',
    category: 'Academic',
    imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    takeaway: 'Learned end-to-end analytics process from asking questions to driving decisions with data.',
    status: 'Completed'
  },
];
export default defaultCertificates;
