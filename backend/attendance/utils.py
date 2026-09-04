import io
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_attendance_report_pdf(records, start_date=None, end_date=None, status_filter='ALL', employee_filter='ALL') -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(letter),
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'HeaderTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#881337'),
        alignment=1
    )
    subtitle_style = ParagraphStyle(
        'HeaderSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#52525B'),
        alignment=1
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

    elements.append(Paragraph("THAHIRA GROUPS ENTERPRISE", title_style))
    elements.append(Paragraph("Official Employee Attendance Log Report", subtitle_style))
    elements.append(Spacer(1, 8))
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#881337'), spaceAfter=12))

    # Filter Meta Summary Table
    meta_info = [
        [
            Paragraph("<b>Date Range:</b>", cell_bold),
            Paragraph(f"{start_date or 'Beginning'} to {end_date or 'Today'}", cell_normal),
            Paragraph("<b>Status Filter:</b>", cell_bold),
            Paragraph(str(status_filter).upper(), cell_normal),
            Paragraph("<b>Total Records:</b>", cell_bold),
            Paragraph(str(len(records)), cell_normal)
        ]
    ]
    meta_table = Table(meta_info, colWidths=[90, 160, 90, 140, 90, 150])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FAF9F6')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E7E5E4')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 12))

    # Main Attendance Log Data Table
    headers = [
        Paragraph("<b>Date</b>", cell_bold),
        Paragraph("<b>Employee Name</b>", cell_bold),
        Paragraph("<b>Employee ID</b>", cell_bold),
        Paragraph("<b>Shift Schedule</b>", cell_bold),
        Paragraph("<b>Check-In Time</b>", cell_bold),
        Paragraph("<b>Check-Out Time</b>", cell_bold),
        Paragraph("<b>Status</b>", cell_bold),
        Paragraph("<b>Working Hours</b>", cell_bold)
    ]
    table_data = [headers]

    present_count = 0
    late_count = 0
    absent_count = 0

    for rec in records:
        emp = rec.get('employee_obj') or rec.get('employee')
        emp_name = rec.get('employee_name') or (emp.get_full_name() if hasattr(emp, 'get_full_name') else 'Staff')
        emp_id = rec.get('employee_id') or (getattr(emp, 'employee_id', 'N/A') if emp else 'N/A')
        shift_time = rec.get('expected_login_time') or (emp.get_scheduled_login_time() if hasattr(emp, 'get_scheduled_login_time') else '10:00 AM')
        
        status_val = str(rec.get('status', 'ON_TIME')).upper()
        if 'LATE' in status_val:
            late_count += 1
            status_text = f"<font color='#991B1B'><b>LATE</b></font>"
        elif 'ABSENT' in status_val:
            absent_count += 1
            status_text = f"<font color='#991B1B'><b>ABSENT</b></font>"
        else:
            present_count += 1
            status_text = f"<font color='#15803D'><b>PRESENT ({status_val})</b></font>"

        check_in_str = rec.get('check_in_formatted') or '-'
        check_out_str = rec.get('check_out_formatted') or '-'
        hrs = f"{rec.get('working_hours', 0)} hrs"

        table_data.append([
            Paragraph(str(rec.get('date', '-')), cell_normal),
            Paragraph(str(emp_name), cell_bold),
            Paragraph(str(emp_id), cell_normal),
            Paragraph(str(shift_time), cell_normal),
            Paragraph(check_in_str, cell_normal),
            Paragraph(check_out_str, cell_normal),
            Paragraph(status_text, cell_normal),
            Paragraph(hrs, cell_normal)
        ])

    att_table = Table(table_data, colWidths=[80, 140, 80, 90, 100, 100, 100, 80])
    att_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#881337')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#D6D3D1')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(att_table)
    elements.append(Spacer(1, 15))

    # Summary Statistics Box
    summary_data = [
        [
            Paragraph("<b>Total Present Records:</b>", cell_bold),
            Paragraph(f"<font color='#15803D'><b>{present_count}</b></font>", cell_bold),
            Paragraph("<b>Total Late Arrivals:</b>", cell_bold),
            Paragraph(f"<font color='#D97706'><b>{late_count}</b></font>", cell_bold),
            Paragraph("<b>Total Absences:</b>", cell_bold),
            Paragraph(f"<font color='#991B1B'><b>{absent_count}</b></font>", cell_bold)
        ]
    ]
    summary_table = Table(summary_data, colWidths=[120, 120, 120, 120, 120, 120])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFF1F2')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E11D48')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(summary_table)

    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
