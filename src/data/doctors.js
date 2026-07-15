const uploadBase = '/images/renew/uploads/'

const photo = path => `${uploadBase}${path}`
const slug = name => name.toLowerCase().replace(/dr\.?\s*/g, 'dr-').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const doctorBios = {
  'Dr. Rajeev Agarwal': `Dr. Rajeev Agarwal is the Medical Director at Renew Healthcare, a premier one-stop fertility and women's health clinic. With more than a decade of specialized experience as a fertility specialist, he has established himself as one of the most respected names in reproductive medicine across India.

Beyond his exceptional IVF expertise, Dr. Agarwal specializes in advanced laparoscopic procedures and is widely recognized for his mastery in performing fertility-preserving surgeries. His approach combines cutting-edge medical technology with deeply compassionate, patient-centered care that addresses both the physical and emotional aspects of infertility.

Dr. Agarwal's journey into medicine was shaped by the profound influence of his father, a distinguished gynecologist. This early inspiration led him to complete his MBBS from Calcutta National Medical College, where he received 3 awards for excellence in Anatomy. His commitment to excellence continued through his specialized training at Kasturba Medical College, Manipal, under the mentorship of renowned fertility expert Dr. Sadhana Desai.

His training extends internationally, having studied at Cardiff Assisted Reproduction Centre in Wales, where he observed cutting-edge IVF practices and stayed abreast of global standards. This blend of Indian medical rigor and international best practices enables him to deliver world-class fertility treatments.`,
  'Dr. Neha Yadav': `Having an experience of over 11 years, Dr. Neha Yadav is a bright academician, a noteworthy obstetrician, and a gynaecologist with a healing touch.

She pursued her undergraduation from Belgaum Institute of Medical Sciences, Belgaum. After completing her postgraduation from Adichunchanagiri Institute of Medical Sciences under Rajiv Gandhi University of Health Sciences, she completed her DNB from the prestigious St. Martha's Hospital, Bangalore.

She has practised as a junior consultant in many hospitals, including Motherhood Hospitals, Bangalore. She has also worked at Bhagirathi Neotia Hospitals, Newtown, with an immense reputation.

Her expertise in counselling and empathy towards patients have helped her grow substantially in the field of infertility and high-risk pregnancies.

She is deeply interested in infertility care and works as an infertility specialist at Renew Healthcare Kolkata, with an aim to support mothers who carry the agony of not being able to bear children in their own womb and couples who cannot achieve pregnancy and childbirth naturally.`,
  'Dr. Dorothy P Ghosh': `Dr. Dorothy leads fertility services at Renew Healthcare's Jamshedpur center with a proven track record: 800+ successful IVF births under her direct care. But numbers alone do not tell her story.

What makes her practice different is personal attention. Dr. Dorothy herself manages patient assessments, develops customized IVF and IUI protocols, and provides pre- and post-treatment counseling. She does not delegate the complex cases; she seeks them out. Couples facing recurrent IVF failures, complex medical histories, or unusual diagnoses specifically request her expertise.

Her commitment to clinical excellence extends beyond patient care. Dr. Dorothy actively mentors junior doctors and fertility specialists, ensuring they learn not just the technical aspects of fertility medicine, but the compassionate approach that defines modern reproductive healthcare. This dedication has shaped a generation of fertility doctors across Eastern India.

The proof is in patient outcomes: 92% patient satisfaction and a practice built almost entirely on word-of-mouth referrals from satisfied patients and trusted colleagues.`,
}

const rows = [
  ['Our Experts', 'Dr. Rajeev Agarwal', '', 'Medical Director | Fertility Specialist | IVF Doctor', '2024/07/Dr-rajeev-agarwal.png'],
  ['Our Experts', 'Dr. Neha Yadav', '', 'Associate Consultant', '2024/07/Dr-Neha-Yadav-1.jpg'],
  ['Our Experts', 'Dr. Dorothy P Ghosh', 'MBBS DNB', 'Infertility Specialist', '2024/07/Dr-Dorothy-Ghosh-1.jpg'],
  ['Our Experts', 'Dr. Sonam Agarwal', '', 'Associate Consultant', '2026/05/Dr-Sonam.jpg'],
  ['Our Experts', 'Dr. Arnab Kundu', '', 'Associate Consultant', '2025/06/Dr-Arnab-Side-View-rotated.jpg'],
  ['Genetics', 'Dr. Dipanjana Dutta', 'Ph.D. | PDF (USA) | Former NSGC-Certified (USA) | BGCI Level II Certified Genetic Counselor (CGC)', 'Geneticist', '2024/12/Dr-Dipanjana-Datta-1.jpg'],
  ['Visiting Consultant', 'Dr. Roohi Khanna', 'MD', 'Obesity Medicine & Family Medicine', '2026/05/Dr-Roohi-Khanna.png'],
  ['Visiting Consultant', 'Dr. Goutam Das', '', 'Consultant Homeopath', '2024/12/Dr-Goutam-Das.jpg'],
  ['Visiting Consultant', 'Dr. Santanu Ray', '', 'Child Specialist & Neonatologist', '2024/12/Dr-Santunu-Ray.jpg'],
  ['Visiting Consultant', 'Dr. Aditya Verma', '', 'Consultant Cardiologist', '2024/12/Aditya-Verma.jpg'],
  ['Visiting Consultant', 'Dr. Omkar De Hazra', '', 'Consultant General Physician', '2024/12/Dr.-Omkar-De-Hazra.jpg'],
  ['Visiting Consultant', 'Dr. Sayan Ghosh', '', 'Consultant Endocrinologist', '2024/12/Dr-Sayan-Ghosh.jpg'],
  ['Visiting Consultant', 'Priyanka Goenka', '', 'Nutritionist', '2024/08/Priyanka-Goenka.jpg'],
  ['Visiting Consultant', 'Ankita Malik', '', 'Lactation Specialist', '2024/12/Ankita-Malik.jpg'],
  ['Visiting Consultant', 'Pooja Raja', '', 'Psychological Counsellor', '2024/07/Dr-Pooja-Raja.jpg'],
  ['Visiting Consultant', 'Supriya Swarup', '', 'Mental Health Counsellor', '2024/12/Dr-Supriya-Swarup.jpg'],
  ['Visiting Consultant', 'Veenu Goenka', '', 'Pre & Post Partum Corrective Exercise Specialist', '2024/12/Veenu-Goenka.jpg'],
  ['Embryology', 'Saroj Agarwal', '', 'Scientific Director & Chief Embryologist', '2024/07/Saroj-Agarwal.jpg'],
  ['Embryology', 'Animesh Bera', '', 'Embryologist', '2024/07/Animesh.jpg'],
  ['Embryology', 'Raina Chakraborty', '', 'Junior Embryologist', '2024/12/Raina.jpg'],
  ['Andrology', 'Palash Mondal', '', 'Semenologist', '2024/07/Polash.jpg'],
  ['Andrology', 'Swadhin Ghosh', '', 'Semenologist', '2024/07/Swadhin.jpg'],
  ['Dept Of Ultrasonography', 'Dr. Nitin Gupta', '', 'Visiting Radiologist', '2024/08/Dr-Nitin-Gupta.jpg'],
  ['Dept Of Ultrasonography', 'Dr. Amitrasudan Roychowdhury', '', 'Visiting Radiologist', '2024/08/Dr-Amrit-Sudan-RoyChowdhury.jpg'],
  ['Dept Of Ultrasonography', 'Dr. Prem Kamani', '', 'Visiting Radiologist', '2024/08/Prem-Kamani.jpg'],
  ['Dept Of Ultrasonography', 'Dr. Jayshree Nandy', '', 'Visiting Radiologist', '2024/12/Jayshree-Nandy.jpg'],
  ['Dept Of Ultrasonography', 'Sriyanka Das', '', 'Department Manager', '2024/08/Sriyanka-Das.jpg'],
  ['Receptionist', 'Mayuri Roy Banerjee', '', 'Front Desk Incharge & ART Bank Manager', '2024/08/Mayuri-Roy-Banerjee.jpg'],
  ['Receptionist', 'Jaita Mukherjee', '', 'Receptionist', '2024/08/Joyeta.jpg'],
  ['Receptionist', 'Jhuma Das', '', 'Receptionist', '2024/12/Jhuma-Di.jpg'],
  ['Receptionist', 'Anasua Daptary', '', 'Receptionist', '2024/12/Anasua.jpg'],
  ['Admin Department', 'Chandra Bhushan Tiwari', '', 'Chief Operating Officer', '2024/08/Chandra-Bhusan-Tiwari-Da.jpg'],
  ['Admin Department', 'Tirsha Das', '', 'General Manager HR', '2024/12/Tirsha-Maam-03.jpg'],
  ['Pharmacy', 'Sudip Sahoo', '', 'Pharmacist', '2024/12/Sudip-Sahoo.jpg'],
  ['Manager Incharge', 'Sunil Balmiki', '', 'IVF & Data Manager', '2024/08/Sunil.jpg'],
  ['Manager Incharge', 'Santosh Gorai', '', 'Center Incharge, Jamshedpur', '2024/08/Santosh-Gorai.jpg'],
  ['Coordinator & Counsellor', 'Gouri Tiwari', '', 'Senior Manager International Business & IPD', '2024/08/Gouri-Tiwari.jpg'],
  ['Coordinator & Counsellor', 'Mithu Ghosh', '', 'Senior Manager, Salt Lake', '2024/08/Mithu-Ghosh.jpg'],
  ['Coordinator & Counsellor', 'Sushmita Bhattacharya', '', 'Senior Counsellor', '2024/08/Susmita.jpg'],
  ['Coordinator & Counsellor', 'Dona Chatterjee', '', 'Senior Counsellor', '2024/08/Dona.jpg'],
  ['Coordinator & Counsellor', 'Ranjana Sarkar', '', 'Counsellor, Jamshedpur', '2024/12/Ranjana.jpg'],
  ['Coordinator & Counsellor', 'Munmun Das', '', 'Front Office Executive', '2024/08/Munmun.jpg'],
  ['Coordinator & Counsellor', 'Abhay Kumar', '', 'Office Admin, Jamshedpur', '2024/12/Abhay.jpg'],
  ['Nurses', 'Jhuma Halder', '', 'Nursing in Charge', '2024/12/Jhuma-Halder.jpg'],
  ['Nurses', 'Rupa Tudu', '', 'Staff Nurse', '2024/12/Rupa-Tudu.jpg'],
  ['Nurses', 'Manisha Mistri', '', 'Staff Nurse', '2024/12/Manisha-Mistri.jpg'],
  ['Nurses', 'Pallabi Ghosh', '', 'Staff Nurse', '2024/12/Pallabi-Ghosh.jpg'],
  ['Nurses', 'Suparna Mondal', '', 'Staff Nurse', '2024/12/Suparana-Mondal.jpg'],
  ['Nurses', 'Dipannita Mondal', '', 'Nurse', '2025/06/Dwipanita-Mondal.jpg'],
  ['Social Media', 'Sahil Agarwal', '', 'Social Media Head', '2024/12/Sahil.jpg'],
  ['Social Media', 'Trisha Agarwal', '', 'Creative Manager', '2024/12/Trisha-Agarwal-1.jpg'],
  ['Social Media', 'Susmita Ghosh Mallick', '', 'Social Media Manager', '2024/08/Susmita-Ghosh-Mallick.jpg'],
  ['Social Media', 'Rahul Adak', '', 'Graphic Designer', '2024/12/Rahul-Adak.jpg'],
  ['Finance & Accounts', 'Soniya Agarwal', '', 'Chartered Accountant', '2025/06/Soniya-Agarwal.jpg'],
  ['Finance & Accounts', 'Rajesh Kumar Jha', '', 'Senior Accountant', '2024/08/Rajesh.jpg'],
  ['Finance & Accounts', 'Vivek Kr Mishra', '', 'Accountant', '2024/08/Vivek.jpg'],
  ['Finance & Accounts', 'Shanti Nath Jha', '', 'Accountant', '2024/08/Shanti.jpg'],
  ['Sales', 'Milun Sarkar', '', 'Senior Executive Business Development', '2024/12/Milun-Sarkar.jpg'],
]

export const doctors = rows.map(([category, name, qualification, role, photoPath]) => ({
  slug: slug(name),
  name,
  qualification,
  role,
  category,
  photo: photo(photoPath),
  bio: doctorBios[name] || '',
}))

export const doctorCategories = [...new Set(doctors.map(doctor => doctor.category))]
