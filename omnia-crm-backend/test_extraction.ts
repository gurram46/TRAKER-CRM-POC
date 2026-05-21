import { extractRFQFromEmail } from './src/services/geminiService';
import dotenv from 'dotenv';
dotenv.config();

const emailFormat2 = `
Greeting From L&T SUFIN!
We are having below requirement for our CMRL Project in Chennai.
Kindly submit your techno commercial offer with make mentioned in the following format with acceptance of T&C by today EOD.
*Note: Make shall be from Surya pipes, HI Tech pipes, JSW, JSPL, Ravindra tubes, Tata, SAIL, VMC steel, Navaratan, APL Apollo tubes only

Sl. No. Item Description with specifications UOM QTY
1 MS HOLLOW SECTION; SUB-TYPE :- Square hollow section; STANDARD :- IS 2062; GRADE :- E350; SUB-GRADE :- A; SIDE 1 :- 32 mm; SIDE 2 :- 32 mm; THICKNESS :- 3.2 mm; MT 2.10
2 MS HOLLOW SECTION; SUB-TYPE :- Rectangular hollow section; STANDARD :- IS 2062; GRADE :- E350; SUB-GRADE :- A; SIDE 1 :- 80 mm; SIDE 2 :- 40 mm; THICKNESS :- 4.8 mm; MT 5.10
3 MS HOLLOW SECTION; SUB-TYPE :- Rectangular hollow section; STANDARD :- IS 2062; GRADE :- E350; SUB-GRADE :- A; SIDE 1 :- 25 mm; SIDE 2 :- 25 mm; THICKNESS :- 3.2 mm; MT 0.50

A Basic Value
1 Packing and forwarding charges Included
2 Freight Charges to job site (CMRL project- Chennai) Included
8 Payment Terms: 100% After receipt of materials after 45 days (MSME) or 60 credit days (Non-MSME) through VFS-SuFin

Thanks & Regards,
Khan Rafi
Central Supply Chain
+91- 9004991861
rafiullah.khan@larsentoubro.com
`;

const emailFormat3 = `
Dear Sir,
Greetings for the day !!
Please find the below Rail requirement for our ongoing project, kindly confirm your competitive offer and lead time for supply of the same.

1 RAIL; SUB-TYPE :- Industrial Use (IU) Rail; GRADE :- 880; SECTION WEIGHT :- 52 kg/m; LENGTH :- 13 m. MT 299

The material of the Rail shall be Mn steel ("Industrial Use" grade of rail) having yield strength close to 85 Kg/mm2.
The Rail shall be of free from any defect & to be perfectly straight throughout the entire length.
**MTC and RITES inspection certificate are mandatory requirement.
Delivery - F.O.R. Larsen & Toubro Limited., Engineering Workshop, NH4 Bangalore Highway, Nirvaloor village, Kanchipuram. 631561

Thanks & regards,
K Sivasubramaniyan
Larsen & Toubro Limited.
Mobile:+91-8349992357
`;

async function runTests() {
  console.log("=== TESTING L&T SUFIN FORMAT (ENTERPRISE) ===");
  const res2 = await extractRFQFromEmail(emailFormat2);
  console.log(JSON.stringify(res2, null, 2));

  console.log("\n=== TESTING L&T RAIL FORMAT (RAIL/INSPECTION) ===");
  const res3 = await extractRFQFromEmail(emailFormat3);
  console.log(JSON.stringify(res3, null, 2));
}

runTests();
