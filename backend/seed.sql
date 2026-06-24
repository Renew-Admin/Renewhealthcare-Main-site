-- ============================================================================
-- Renew Healthcare — SEED DATA (run ONCE, AFTER schema.sql)
--
-- Loads your existing in-code doctors, testimonials and FAQs into Supabase so
-- you can edit them in the admin panel instead of retyping them. Each block
-- only runs when its table is still empty, so it is safe to re-run.
--
-- After seeding, the website reads these from Supabase; the in-code copies are
-- used only as a fallback when a table is empty.
-- ============================================================================

-- doctors (only when the table is empty)
do $$
begin
  if (select count(*) from public.doctors) = 0 then
    insert into public.doctors (name, role, qualification, category, photo, display_order, active) values
    ('Dr. Rajeev Agarwal', 'Medical Director | Fertility Specialist | IVF Doctor', '', 'Our Experts', '/images/renew/uploads/2024/07/Dr-rajeev-agarwal.png', 0, true),
    ('Dr. Ruby Yadav', 'Associate Consultant', '', 'Our Experts', '/images/renew/uploads/2024/07/Dr-Ruby-Yadav-1.jpg', 1, true),
    ('Dr. Neha Yadav', 'Associate Consultant', '', 'Our Experts', '/images/renew/uploads/2024/07/Dr-Neha-Yadav-1.jpg', 2, true),
    ('Dr. Dorothy P Ghosh', 'Associate Consultant, Jamshedpur', '', 'Our Experts', '/images/renew/uploads/2024/07/Dr-Dorothy-Ghosh-1.jpg', 3, true),
    ('Dr. Sonam Agarwal', 'Associate Consultant', '', 'Our Experts', '/images/renew/uploads/2026/05/Dr-Sonam.jpg', 4, true),
    ('Dr. Arnab Kundu', 'Associate Consultant', '', 'Our Experts', '/images/renew/uploads/2025/06/Dr-Arnab-Side-View-rotated.jpg', 5, true),
    ('Dr. Dipanjana Dutta', 'Geneticist', '', 'Genetics', '/images/renew/uploads/2024/12/Dr-Dipanjana-Datta-1.jpg', 6, true),
    ('Dr. Roohi Khanna', 'Obesity Medicine Specialist', '', 'Visiting Consultant', '/images/renew/uploads/2026/05/Dr-Roohi-Khanna.png', 7, true),
    ('Dr. Goutam Das', 'Consultant Homeopath', '', 'Visiting Consultant', '/images/renew/uploads/2024/12/Dr-Goutam-Das.jpg', 8, true),
    ('Dr. Santanu Ray', 'Child Specialist & Neonatologist', '', 'Visiting Consultant', '/images/renew/uploads/2024/12/Dr-Santunu-Ray.jpg', 9, true),
    ('Dr. Aditya Verma', 'Consultant Cardiologist', '', 'Visiting Consultant', '/images/renew/uploads/2024/12/Aditya-Verma.jpg', 10, true),
    ('Dr. Omkar De Hazra', 'Consultant General Physician', '', 'Visiting Consultant', '/images/renew/uploads/2024/12/Dr.-Omkar-De-Hazra.jpg', 11, true),
    ('Dr. Sayan Ghosh', 'Consultant Endocrinologist', '', 'Visiting Consultant', '/images/renew/uploads/2024/12/Dr-Sayan-Ghosh.jpg', 12, true),
    ('Priyanka Goenka', 'Nutritionist', '', 'Visiting Consultant', '/images/renew/uploads/2024/08/Priyanka-Goenka.jpg', 13, true),
    ('Ankita Malik', 'Lactation Specialist', '', 'Visiting Consultant', '/images/renew/uploads/2024/12/Ankita-Malik.jpg', 14, true),
    ('Pooja Raja', 'Psychological Counsellor', '', 'Visiting Consultant', '/images/renew/uploads/2024/07/Dr-Pooja-Raja.jpg', 15, true),
    ('Supriya Swarup', 'Mental Health Counsellor', '', 'Visiting Consultant', '/images/renew/uploads/2024/12/Dr-Supriya-Swarup.jpg', 16, true),
    ('Veenu Goenka', 'Pre & Post Partum Corrective Exercise Specialist', '', 'Visiting Consultant', '/images/renew/uploads/2024/12/Veenu-Goenka.jpg', 17, true),
    ('Saroj Agarwal', 'Scientific Director & Chief Embryologist', '', 'Embryology', '/images/renew/uploads/2024/07/Saroj-Agarwal.jpg', 18, true),
    ('Animesh Bera', 'Embryologist', '', 'Embryology', '/images/renew/uploads/2024/07/Animesh.jpg', 19, true),
    ('Raina Chakraborty', 'Junior Embryologist', '', 'Embryology', '/images/renew/uploads/2024/12/Raina.jpg', 20, true),
    ('Palash Mondal', 'Semenologist', '', 'Andrology', '/images/renew/uploads/2024/07/Polash.jpg', 21, true),
    ('Swadhin Ghosh', 'Semenologist', '', 'Andrology', '/images/renew/uploads/2024/07/Swadhin.jpg', 22, true),
    ('Dr. Nitin Gupta', 'Visiting Radiologist', '', 'Dept Of Ultrasonography', '/images/renew/uploads/2024/08/Dr-Nitin-Gupta.jpg', 23, true),
    ('Dr. Amitrasudan Roychowdhury', 'Visiting Radiologist', '', 'Dept Of Ultrasonography', '/images/renew/uploads/2024/08/Dr-Amrit-Sudan-RoyChowdhury.jpg', 24, true),
    ('Dr. Prem Kamani', 'Visiting Radiologist', '', 'Dept Of Ultrasonography', '/images/renew/uploads/2024/08/Prem-Kamani.jpg', 25, true),
    ('Dr. Jayshree Nandy', 'Visiting Radiologist', '', 'Dept Of Ultrasonography', '/images/renew/uploads/2024/12/Jayshree-Nandy.jpg', 26, true),
    ('Sriyanka Das', 'Department Manager', '', 'Dept Of Ultrasonography', '/images/renew/uploads/2024/08/Sriyanka-Das.jpg', 27, true),
    ('Mayuri Roy Banerjee', 'Front Desk Incharge & ART Bank Manager', '', 'Receptionist', '/images/renew/uploads/2024/08/Mayuri-Roy-Banerjee.jpg', 28, true),
    ('Jaita Mukherjee', 'Receptionist', '', 'Receptionist', '/images/renew/uploads/2024/08/Joyeta.jpg', 29, true),
    ('Jhuma Das', 'Receptionist', '', 'Receptionist', '/images/renew/uploads/2024/12/Jhuma-Di.jpg', 30, true),
    ('Anasua Daptary', 'Receptionist', '', 'Receptionist', '/images/renew/uploads/2024/12/Anasua.jpg', 31, true),
    ('Chandra Bhushan Tiwari', 'Chief Operating Officer', '', 'Admin Department', '/images/renew/uploads/2024/08/Chandra-Bhusan-Tiwari-Da.jpg', 32, true),
    ('Tirsha Das', 'General Manager HR', '', 'Admin Department', '/images/renew/uploads/2024/12/Tirsha-Maam-03.jpg', 33, true),
    ('Sudip Sahoo', 'Pharmacist', '', 'Pharmacy', '/images/renew/uploads/2024/12/Sudip-Sahoo.jpg', 34, true),
    ('Sunil Balmiki', 'IVF & Data Manager', '', 'Manager Incharge', '/images/renew/uploads/2024/08/Sunil.jpg', 35, true),
    ('Santosh Gorai', 'Center Incharge, Jamshedpur', '', 'Manager Incharge', '/images/renew/uploads/2024/08/Santosh-Gorai.jpg', 36, true),
    ('Gouri Tiwari', 'Senior Manager International Business & IPD', '', 'Coordinator & Counsellor', '/images/renew/uploads/2024/08/Gouri-Tiwari.jpg', 37, true),
    ('Mithu Ghosh', 'Senior Manager, Salt Lake', '', 'Coordinator & Counsellor', '/images/renew/uploads/2024/08/Mithu-Ghosh.jpg', 38, true),
    ('Sushmita Bhattacharya', 'Senior Counsellor', '', 'Coordinator & Counsellor', '/images/renew/uploads/2024/08/Susmita.jpg', 39, true),
    ('Dona Chatterjee', 'Senior Counsellor', '', 'Coordinator & Counsellor', '/images/renew/uploads/2024/08/Dona.jpg', 40, true),
    ('Ranjana Sarkar', 'Counsellor, Jamshedpur', '', 'Coordinator & Counsellor', '/images/renew/uploads/2024/12/Ranjana.jpg', 41, true),
    ('Munmun Das', 'Front Office Executive', '', 'Coordinator & Counsellor', '/images/renew/uploads/2024/08/Munmun.jpg', 42, true),
    ('Abhay Kumar', 'Office Admin, Jamshedpur', '', 'Coordinator & Counsellor', '/images/renew/uploads/2024/12/Abhay.jpg', 43, true),
    ('Jhuma Halder', 'Nursing in Charge', '', 'Nurses', '/images/renew/uploads/2024/12/Jhuma-Halder.jpg', 44, true),
    ('Rupa Tudu', 'Staff Nurse', '', 'Nurses', '/images/renew/uploads/2024/12/Rupa-Tudu.jpg', 45, true),
    ('Manisha Mistri', 'Staff Nurse', '', 'Nurses', '/images/renew/uploads/2024/12/Manisha-Mistri.jpg', 46, true),
    ('Pallabi Ghosh', 'Staff Nurse', '', 'Nurses', '/images/renew/uploads/2024/12/Pallabi-Ghosh.jpg', 47, true),
    ('Suparna Mondal', 'Staff Nurse', '', 'Nurses', '/images/renew/uploads/2024/12/Suparana-Mondal.jpg', 48, true),
    ('Dipannita Mondal', 'Nurse', '', 'Nurses', '/images/renew/uploads/2025/06/Dwipanita-Mondal.jpg', 49, true),
    ('Sahil Agarwal', 'Social Media Head', '', 'Social Media', '/images/renew/uploads/2024/12/Sahil.jpg', 50, true),
    ('Trisha Agarwal', 'Creative Manager', '', 'Social Media', '/images/renew/uploads/2024/12/Trisha-Agarwal-1.jpg', 51, true),
    ('Susmita Ghosh Mallick', 'Social Media Manager', '', 'Social Media', '/images/renew/uploads/2024/08/Susmita-Ghosh-Mallick.jpg', 52, true),
    ('Rahul Adak', 'Graphic Designer', '', 'Social Media', '/images/renew/uploads/2024/12/Rahul-Adak.jpg', 53, true),
    ('Soniya Agarwal', 'Chartered Accountant', '', 'Finance & Accounts', '/images/renew/uploads/2025/06/Soniya-Agarwal.jpg', 54, true),
    ('Rajesh Kumar Jha', 'Senior Accountant', '', 'Finance & Accounts', '/images/renew/uploads/2024/08/Rajesh.jpg', 55, true),
    ('Vivek Kr Mishra', 'Accountant', '', 'Finance & Accounts', '/images/renew/uploads/2024/08/Vivek.jpg', 56, true),
    ('Shanti Nath Jha', 'Accountant', '', 'Finance & Accounts', '/images/renew/uploads/2024/08/Shanti.jpg', 57, true),
    ('Milun Sarkar', 'Senior Executive Business Development', '', 'Sales', '/images/renew/uploads/2024/12/Milun-Sarkar.jpg', 58, true);
  end if;
end $$;

-- testimonials (only when the table is empty)
do $$
begin
  if (select count(*) from public.testimonials) = 0 then
    insert into public.testimonials (name, location, treatment, quote, photo, rating, display_order, active) values
    ('Krishna Bhattacharjee', 'Aug 2024', '', 'Thank you for guidance very well behaved staffs', '/images/renew/reviews/krishna-bhattacharjee.jpg', 5, 0, true),
    ('Rahul Das', 'Jul 2024', '', 'Best facility one person can get under one roof. After visiting quite a few clinics across the country i can assure there is none even close to what Dr Rajeev has created “RENEW HEALTH CARE”', '/images/renew/reviews/rahul-das.jpg', 5, 1, true),
    ('Ankit Gupta', 'Jul 2024', '', 'It is a one stop solution for the would be parents. The staff members and the customer relation desk is highly efficient and are available day/night for assistance. Doctors here are very helpful and calm. Our experience couldnt have been better.', '/images/renew/reviews/ankit-gupta.jpg', 5, 2, true),
    ('Shubham Narnoli', 'Jul 2024', '', 'Renovare Healthcare Services Pvt Ltd (Renew Health) - A Beacon of Hope in Fertility Care My journey with Renovare Healthcare Services Pvt Ltd has been nothing short of exceptional. From the moment I stepped into their clinic, I was greeted with warmth and professionalism that immediately put me at ease. The facilities are modern and…', '/images/renew/reviews/shubham-narnoli.jpg', 5, 3, true),
    ('devpriya Singhania', 'Jun 2024', '', 'My experience with Dr Rajeev and the whole team of Renew healthcare has been great . Dr rajeev made sure I was at ease , whenever I felt nervous or anxious. He always used to smile and tell me that he will take care of everything . And he definitely did ! He always answered all my questions very patiently. Even queries over wtsap, was…', '/images/renew/reviews/devpriya-singhania.jpg', 5, 4, true),
    ('Debolina Bhattacharya', 'Jun 2024', '', 'Very nice clinic. Everyone at Renew salt Lake are very much cooperative.', '/images/renew/reviews/debolina-bhattacharya.jpg', 5, 5, true),
    ('Gurleen Sachdeva', 'Jun 2024', '', 'Dr. Rajeev agarwal and his team are outstanding. They make sure that your journey at renew is smooth and comforting. Their knowledge and calm demeanour makes you feel confident and at ease throughout. The postpartum care is equally excellent with attentive follow up and support.', '/images/renew/reviews/gurleen-sachdeva.jpg', 5, 6, true),
    ('pooja mehta', 'May 2024', '', 'My pregnancy journey with renew was so smooth.I hadn''t imagined the journey to be so easy. Dr Rajeev and the entire renew team made pregnancy feel like a cake walk. Sir is really approachable and was available for me everytime I needed help. Managed a normal delivery only because the entire team was so supportive..the best part is that…', '/images/renew/reviews/pooja-mehta.jpg', 5, 7, true),
    ('Kushal Choudhury', 'May 2024', '', 'Any kind of medical visit is always unnerving. Our journey with Renew started in 2021/22 and I can say with a lot of confidence and gratitude that the doctors and the whole team will take care of you like their own family member. They understand what you are experiencing and treat you not just with what you require medically but are also…', '/images/renew/reviews/kushal-choudhury.jpg', 5, 8, true),
    ('Rupa Basak', 'Apr 2024', '', 'Every woman dreams of happy Motherhood....And Dr. Rajeev Agarwal is a boon to those women...his expertisation in his field, exceptional compassionate care, commitment to his patients'' well being have made him the top most in his profession...Atleast for me he is a blessing who fulfilled my desire by helping me to get the meaning of my…', '/images/renew/reviews/rupa-basak.jpg', 5, 9, true),
    ('sudarshana basu', 'Mar 2024', '', 'Destiny plans all...believe my destiny got me to Renew, saltlake for the most caring and extraordinary treatment plan..got in touch with Mithudi in the first place she has been an angel through my entire journey...Dr Rajeev Agarwal and Dr Atri had given the best possible, personalised treatment .For all my untimely requests and queries…', '/images/renew/reviews/sudarshana-basu.jpg', 5, 10, true),
    ('Preeti Sewak', 'Feb 2024', '', 'I would like to thank Dr. RAJEEV AGARWAL from the core of my heart. I have been under the treatment of Dr rajeev for the past one year. I had a high risk pregnancy. Now I am mother of a baby boy. It seems I got a new life. My personal opinion is Renew Health Care is the best clinic in kolkata and Dr. Rajeev Agarwal is one of the best…', '/images/renew/reviews/preeti-sewak.jpg', 5, 11, true);
  end if;
end $$;

-- faqs (only when the table is empty)
do $$
begin
  if (select count(*) from public.faqs) = 0 then
    insert into public.faqs (question, answer, category, display_order, active) values
    ('What exactly is IVF?', 'IVF (In Vitro Fertilisation) is a fertility treatment where eggs are collected from the ovaries and fertilised with sperm in a specialised laboratory. The resulting embryo is then transferred into the uterus. It is recommended for blocked tubes, low sperm count, ovulation problems, unexplained infertility, and several other conditions.', 'home', 0, true),
    ('Which is the best IVF Centre in Kolkata?', 'Renew Healthcare is among the most trusted IVF centres in Kolkata, led by Dr. Rajeev Agarwal with more than 27 years of experience. We are known for transparent costing, published month-on-month success rates, and a self-cycle-first approach that prioritises your own eggs and sperm.', 'home', 1, true),
    ('What is the cost of IVF in Kolkata?', 'IVF cost depends on the protocol, medication, injections, lab requirements, and your individual treatment plan. At Renew Healthcare we explain every aspect of cost during financial counselling on your first visit, so there are no hidden charges later.', 'home', 2, true),
    ('Is IVF successful and safe?', 'IVF is a safe, well-established treatment with high success rates when carried out by an experienced team. Success depends on age, ovarian reserve, sperm quality, and uterine health. Our embryology lab follows strict international protocols to give every cycle the best possible conditions.', 'home', 3, true),
    ('How long does IVF take?', 'A single IVF cycle typically takes around 4 to 6 weeks, from the start of ovarian stimulation to embryo transfer. The exact timeline varies based on your treatment plan, body’s response, and whether a fresh or frozen transfer is planned.', 'home', 4, true),
    ('Is infertility limited to female partners only?', 'No. Infertility affects men and women almost equally. Male factors such as low sperm count, poor motility, or hormonal issues contribute to nearly 40–50% of cases, which is why both partners should be evaluated together.', 'home', 5, true),
    ('Is IVF painful?', 'IVF involves minor discomfort rather than significant pain. Hormonal injections may cause mild soreness, and egg retrieval is done under short sedation, so it is not painful. Most patients resume normal activities quickly afterwards.', 'home', 6, true),
    ('Can I work during an IVF process?', 'Yes, most patients continue their normal work routine during IVF. We may advise rest around egg retrieval and embryo transfer, but the rest of the cycle usually does not require time off work.', 'home', 7, true);
  end if;
end $$;

-- Done. Refresh /admin to see and edit your existing content.
