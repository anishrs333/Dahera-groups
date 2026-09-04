import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from decimal import Decimal

def generate_salary_slip_pdf(salary_slip) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles with Rich Dark Red accents (#881337)
    title_style = ParagraphStyle(
        'CompanyHeader',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#881337'), # Rich Dark Red
        alignment=1
    )
    subtitle_style = ParagraphStyle(
        'CompanySub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#52525B'),
        alignment=1
    )
    section_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#1C1917')
    )
    cell_bold = ParagraphStyle(
        'CellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#1C1917')
    )
    cell_normal = ParagraphStyle(
        'CellNormal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#44403C')
    )

    elements = []

    # Company Banner
    elements.append(Paragraph("THAHIRA GROUPS ENTERPRISE", title_style))
    elements.append(Paragraph("Official Employee Payslip & Earnings Statement", subtitle_style))
    elements.append(Spacer(1, 10))
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#881337'), spaceAfter=15))

    emp = salary_slip.employee
    month_name = salary_slip.get_month_name()
    login_time = emp.get_scheduled_login_time()

    # Employee Bio Meta Table
    meta_data = [
        [
            Paragraph("<b>Employee Name:</b>", cell_bold), Paragraph(emp.get_full_name() or emp.username, cell_normal),
            Paragraph("<b>Employee ID:</b>", cell_bold), Paragraph(emp.employee_id or "N/A", cell_normal)
        ],
        [
            Paragraph("<b>Gender:</b>", cell_bold), Paragraph(emp.get_gender_display(), cell_normal),
            Paragraph("<b>Scheduled Login Time:</b>", cell_bold), Paragraph(f"<b>{login_time}</b>", cell_normal)
        ],
        [
            Paragraph("<b>Designation:</b>", cell_bold), Paragraph(emp.designation, cell_normal),
            Paragraph("<b>Department:</b>", cell_bold), Paragraph(emp.department, cell_normal)
        ],
        [
            Paragraph("<b>Pay Period:</b>", cell_bold), Paragraph(f"{month_name} {salary_slip.year}", cell_normal),
            Paragraph("<b>Payment Status:</b>", cell_bold), Paragraph(salary_slip.status, cell_normal)
        ]
    ]

    meta_table = Table(meta_data, colWidths=[130, 140, 130, 140])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FAF9F6')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E7E5E4')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#F5F5F4')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 20))

    # Salary Financial Breakdown
    elements.append(Paragraph("Salary Components & Deductions", section_style))
    elements.append(Spacer(1, 8))

    breakdown_data = [
        [Paragraph("<b>Earnings Description</b>", cell_bold), Paragraph("<b>Amount (INR)</b>", cell_bold), Paragraph("<b>Deductions Description</b>", cell_bold), Paragraph("<b>Amount (INR)</b>", cell_bold)],
        [Paragraph("Basic Salary", cell_normal), Paragraph(f"₹{salary_slip.basic_salary:,.2f}", cell_normal), Paragraph("Provident Fund (PF)", cell_normal), Paragraph(f"₹{(salary_slip.deductions * Decimal('0.6')):,.2f}", cell_normal)],
        [Paragraph("HRA & Allowances", cell_normal), Paragraph(f"₹{salary_slip.allowances:,.2f}", cell_normal), Paragraph("Professional Tax / Insurance", cell_normal), Paragraph(f"₹{(salary_slip.deductions * Decimal('0.4')):,.2f}", cell_normal)],
        [Paragraph("<b>Total Gross Earnings</b>", cell_bold), Paragraph(f"<b>₹{(salary_slip.basic_salary + salary_slip.allowances):,.2f}</b>", cell_bold), Paragraph("<b>Total Deductions</b>", cell_bold), Paragraph(f"<b>₹{salary_slip.deductions:,.2f}</b>", cell_bold)]
    ]

    breakdown_table = Table(breakdown_data, colWidths=[150, 120, 150, 120])
    breakdown_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#881337')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#D6D3D1')),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#F5F5F4')),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
    ]))
    elements.append(breakdown_table)
    elements.append(Spacer(1, 20))

    # Net Salary Summary Box
    net_data = [
        [
            Paragraph("<b>NET TAKE-HOME SALARY:</b>", ParagraphStyle('NetLbl', parent=styles['Heading2'], fontSize=12, textColor=colors.HexColor('#881337'))),
            Paragraph(f"<b>₹{salary_slip.net_salary:,.2f}</b>", ParagraphStyle('NetVal', parent=styles['Heading1'], fontSize=16, textColor=colors.HexColor('#15803D'), alignment=2))
        ]
    ]
    net_table = Table(net_data, colWidths=[250, 290])
    net_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFF1F2')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#E11D48')),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(net_table)
    elements.append(Spacer(1, 35))

    # Signatures
    sig_data = [
        [Paragraph("__________________________<br/><b>Employee Signature</b>", cell_normal), Paragraph("__________________________<br/><b>Authorized Signatory (Thahira HR)</b>", cell_normal)]
    ]
    sig_table = Table(sig_data, colWidths=[270, 270])
    elements.append(sig_table)

    doc.build(elements)
    pdf_value = buffer.getvalue()
    buffer.close()
    return pdf_value
