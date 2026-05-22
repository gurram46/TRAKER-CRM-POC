import React from "react";

export interface LineItem {
  slNo: number;
  description: string;
  uom: string;
  qty: number | string;
  hsnCode?: string;
  unitRate?: number;
  projectGroup?: string;
  remarks?: string;
}

export interface VendorInfo {
  vendorName: string;
  contactPerson: string;
  contactNo: string;
  contactMailId: string;
}

export interface TCRemark {
  rowNo: number;
  vendorRemark: string;
}

export interface Format2DocumentProps {
  items: LineItem[];
  vendorInfo: VendorInfo;
  freight?: number;
  gstPercent?: number;
  vendorRemarks?: TCRemark[];
  projectName: string;
  deliveryAddress: string;
  noteText?: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const TC_ROWS = [
  { no: 1,  label: "Vendor Scope",                            lt: "" },
  { no: 2,  label: "L&T Scope",                              lt: "" },
  { no: 3,  label: "Price basis",                            lt: "" },
  { no: 4,  label: "Price Validity for the offer",           lt: "" },
  { no: 5,  label: "Place of delivery",                      lt: "__DELIVERY__" },
  { no: 6,  label: "Lead time for supply (in weeks)",        lt: "" },
  { no: 7,  label: "Delivery Period",                        lt: "" },
  { no: 8,  label: "Payment Terms",                          lt: "" },
  { no: 9,  label: "Contract cum Performance Bank Guarantee",lt: "" },
  { no: 10, label: "Liquidated Damages",                     lt: "" },
  { no: 11, label: "Defect Liability Period",                lt: "" },
  { no: 12, label: "Mode of Measurement",                    lt: "" },
  { no: 13, label: "Quantity Variation",                     lt: "" },
  { no: 14, label: "Price Variation",                        lt: "" },
];

const b = "1px solid #000";

// td helper
const t = (s: React.CSSProperties = {}): React.CSSProperties => ({
  border: b, padding: "4px 6px", fontSize: "11px",
  verticalAlign: "middle", color: "#000", ...s,
});

const Format2Document: React.FC<Format2DocumentProps> = ({
  items, vendorInfo, freight = 0, gstPercent = 18,
  vendorRemarks = [], projectName, deliveryAddress, noteText,
}) => {
  const basic    = items.reduce((s, i) => s + ((Number(i.qty) || 0) * (i.unitRate ?? 0)), 0);
  const revised  = basic + freight;
  const gst      = revised * (gstPercent / 100);
  const net      = revised + gst;
  const hasRates = items.some(i => (i.unitRate ?? 0) > 0);
  const getVR    = (n: number) => vendorRemarks.find(r => r.rowNo === n)?.vendorRemark ?? "";
  const getLT    = (row: typeof TC_ROWS[0]) => row.lt === "__DELIVERY__" ? deliveryAddress : row.lt;

  const tblStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    border: b,
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#000", background: "#fff", padding: "20px", maxWidth: "900px", margin: "0 auto" }}>


      {/* ─────────────────── MAIN TABLE ─────────────────── */}
      <table style={tblStyle}>
        {/*
          7 columns:
          1: SlNo (40px)
          2: Description (auto)
          3: UOM (55px)
          4: QTY (55px)
          5: HSN (75px)
          6: UnitRate (100px)
          7: Amount (110px)
        */}
        <colgroup>
          <col style={{ width: "40px" }} />
          <col />
          <col style={{ width: "55px" }} />
          <col style={{ width: "55px" }} />
          <col style={{ width: "75px" }} />
          <col style={{ width: "100px" }} />
          <col style={{ width: "110px" }} />
        </colgroup>

        <tbody>
          {/* ── HEADER ROW 1 ── */}
          <tr>
            <td rowSpan={2} style={t({ textAlign: "center", fontWeight: "bold", background: "#fff" })}>
              Sl.<br />No.
            </td>
            <td rowSpan={2} style={t({ textAlign: "center", fontWeight: "bold", background: "#fff" })}>
              Item Description with specifications
            </td>
            <td rowSpan={2} style={t({ textAlign: "center", fontWeight: "bold", background: "#fff" })}>
              UOM
            </td>
            <td rowSpan={2} style={t({ textAlign: "center", fontWeight: "bold", background: "#fff" })}>
              QTY
            </td>
            {/* Vendor info — spans last 3 cols, light green */}
            <td colSpan={3} style={t({ background: "#e2efda", verticalAlign: "top", lineHeight: "1.8" })}>
              <div>Vendor Name: {vendorInfo.vendorName}</div>
              <div>Contact Person: {vendorInfo.contactPerson}</div>
              <div>Contact No.: {vendorInfo.contactNo}</div>
              <div>Contact Mail id: {vendorInfo.contactMailId}</div>
            </td>
          </tr>

          {/* ── HEADER ROW 2: sub-headers for last 3 cols ── */}
          <tr>
            <td style={t({ textAlign: "center", fontWeight: "bold" })}>HSN Code</td>
            <td style={t({ textAlign: "center", fontWeight: "bold" })}>Unit Rate (in<br />INR)</td>
            <td style={t({ textAlign: "center", fontWeight: "bold" })}>Amount (in INR)</td>
          </tr>

          {/* ── LINE ITEMS ── */}
          {items.map((item, index) => {
            const showProjectGroup = item.projectGroup && item.projectGroup !== items[index - 1]?.projectGroup;
            return (
              <React.Fragment key={item.slNo}>
                {showProjectGroup && (
                  <tr>
                    <td colSpan={7} style={t({ background: "#dce6f1", fontWeight: "bold" })}>
                      {item.projectGroup}
                    </td>
                  </tr>
                )}
                <tr>
                  <td style={t({ textAlign: "center" })}>{item.slNo}</td>
                  <td style={t()}>
                    {item.description}
                    {item.remarks && item.remarks !== item.projectGroup && (
                      <div style={{ color: "#333", fontSize: "10px", marginTop: "2px" }}>{item.remarks}</div>
                    )}
                  </td>
                  <td style={t({ textAlign: "center" })}>{item.uom}</td>
                  <td style={t({ textAlign: "center" })}>{item.qty}</td>
                  <td style={t({ textAlign: "center" })}>{item.hsnCode ?? ""}</td>
                  <td style={t({ textAlign: "right" })}>{item.unitRate ? fmt(item.unitRate) : ""}</td>
                  <td style={t({ textAlign: "right" })}>{item.unitRate ? fmt((Number(item.qty) || 0) * item.unitRate) : ""}</td>
                </tr>
              </React.Fragment>
            );
          })}

          {/* ── A: Basic Value — col1=A, col2-6=label(colSpan5), col7=value ── */}
          <tr style={{ background: "#fffacd" }}>
            <td style={t({ fontWeight: "bold" })}>A</td>
            <td colSpan={5} style={t({ fontWeight: "bold" })}>Basic Value</td>
            <td style={t({ textAlign: "right", fontWeight: "bold" })}>{hasRates ? fmt(basic) : ""}</td>
          </tr>

          {/* ── CHARGE ROWS — col1=num, col2-6=label(colSpan5), col7=value ── */}
          <tr>
            <td style={t({ textAlign: "center" })}>1</td>
            <td colSpan={5} style={t()}>Packing and forwarding charges</td>
            <td style={t({ textAlign: "right" })}>Included</td>
          </tr>
          <tr>
            <td style={t({ textAlign: "center" })}>2</td>
            <td colSpan={5} style={t()}>Freight Charges to job site ({projectName})</td>
            <td style={t({ textAlign: "right" })}>{freight > 0 ? fmt(freight) : "Included"}</td>
          </tr>
          <tr>
            <td style={t({ textAlign: "center" })}>3</td>
            <td colSpan={5} style={t()}>Testing charges (if any)</td>
            <td style={t({ textAlign: "right" })}>NA</td>
          </tr>
          <tr>
            <td style={t({ textAlign: "center" })}>4</td>
            <td colSpan={5} style={t()}>Supervision of Installation, testing &amp; commissioning charges (if any)</td>
            <td style={t({ textAlign: "right" })}>NA</td>
          </tr>
          <tr>
            <td style={t({ textAlign: "center" })}>5</td>
            <td colSpan={5} style={t()}>Transit insurance</td>
            <td style={t({ textAlign: "right" })}>Included</td>
          </tr>

          {/* ── B: Revised Basic Value ── */}
          <tr style={{ background: "#fffacd" }}>
            <td style={t({ fontWeight: "bold" })}>B</td>
            <td colSpan={5} style={t({ fontWeight: "bold" })}>Revised Basic Value</td>
            <td style={t({ textAlign: "right", fontWeight: "bold" })}>{hasRates ? fmt(revised) : ""}</td>
          </tr>

          {/* ── GST ── */}
          <tr>
            <td style={t()}></td>
            <td colSpan={5} style={t()}>GST</td>
            <td style={t({ textAlign: "right" })}>{hasRates ? fmt(gst) : ""}</td>
          </tr>

          {/* ── C: Net Value ── */}
          <tr style={{ background: "#e2efda" }}>
            <td style={t({ fontWeight: "bold" })}>C</td>
            <td colSpan={5} style={t({ fontWeight: "bold" })}>NET VALUE = TOTAL VALUE INCLUDING GST</td>
            <td style={t({ textAlign: "right", fontWeight: "bold" })}>{hasRates ? fmt(net) : ""}</td>
          </tr>

        </tbody>
      </table>

      {/* ─────────────────── VENDOR DETAILS ─────────────────── */}
      {/*
        Original layout: number RIGHT-aligned | label | value right-aligned
        Using a 2-col table: col1=number+label, col2=value — NO, original has 3 cols:
        SlNo (right) | Label | Value (right)
      */}
      <table style={{ ...tblStyle, marginTop: "-1px" }}>
        <tbody>
          <tr style={{ background: "#dce6f1" }}>
            <td colSpan={3} style={t({ fontWeight: "bold" })}>Vendor Details</td>
          </tr>
          {[
            { n: 1, label: "L&T Vendor Code",           val: "" },
            { n: 2, label: "MSME Registered Supplier",  val: "Yes / No" },
            { n: 3, label: "Last GST Filing Date",       val: "MM/YYYY" },
            { n: 4, label: "ABMS Complied",              val: "Yes / No" },
            { n: 5, label: "ESG Complied",               val: "Yes / No" },
          ].map(row => (
            <tr key={row.n}>
              <td style={t({ textAlign: "right", width: "40%" })}>{row.n}</td>
              <td style={t({ width: "40%" })}>{row.label}</td>
              <td style={t({ textAlign: "right", width: "20%" })}>{row.val}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ─────────────────── T&C TABLE ─────────────────── */}
      <table style={{ ...tblStyle, marginTop: "-1px" }}>
        <tbody>
          <tr style={{ background: "#fce4d6" }}>
            <td style={t({ width: "40px" })}></td>
            <td style={t({ textAlign: "center" })}>
              <span style={{ color: "#1f3e7c", fontWeight: "bold", textDecoration: "underline" }}>Terms &amp; Conditions</span>
            </td>
            <td colSpan={2} style={t({ textAlign: "center" })}>
              <span style={{ color: "#1f3e7c", fontWeight: "bold", textDecoration: "underline" }}>Remarks</span>
            </td>
          </tr>
          {TC_ROWS.map(row => (
            <tr key={row.no}>
              <td style={t({ textAlign: "center", width: "40px" })}>{row.no}</td>
              <td style={t()}>{row.label}</td>
              <td colSpan={2} style={t({ textAlign: "center" })}>{getLT(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Omnia Steels footer */}
      <div style={{ marginTop: "20px", fontSize: "11px", lineHeight: "1.9" }}>
        <p>Thanks &amp; Regards,</p>
        <p>Sales Team,</p>
        <p><b>Omnia Steels Private Limited</b></p>
        <p>Phone: 8790552907 &nbsp;|&nbsp; Email: salesteam@omniasteels.com</p>
        <p>Website: www.omniasteels.com</p>
      </div>
    </div>
  );
};

export default Format2Document;
