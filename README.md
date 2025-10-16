# Advanced Payroll Management System

A comprehensive, modern payroll management system built with PHP, MySQL, Bootstrap 5, and Chart.js.

![PHP](https://img.shields.io/badge/PHP-7.4%2B-purple)
![MySQL](https://img.shields.io/badge/MySQL-5.7%2B-orange)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)
![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen)

## 🚀 Features

### Core Functionality
- ✅ **Employee Management**: Add, edit, view, and delete employees
- ✅ **Automatic Calculations**: Real-time payroll calculations (gross pay, deductions, net pay)
- ✅ **Advanced Search & Filtering**: Search by name, reference number, postcode, NI number, or employer
- ✅ **Bulk Operations**: Select and delete multiple employees at once
- ✅ **Pagination**: Customizable records per page (10, 25, 50, 100)
- ✅ **Sortable Columns**: Click column headers to sort data
- ✅ **Export to CSV**: Download employee data
- ✅ **Print Functionality**: Print-friendly table view

### Analytics & Reporting
- 📊 **Monthly Trends**: Visual charts showing payroll trends over 6 months
- 📊 **Gender Distribution**: Pie chart showing employee demographics
- 📊 **Department Analysis**: Bar chart showing top departments by payroll

### User Experience
- 🎨 **Modern UI**: Gradient backgrounds, smooth animations, card-based design
- 🌓 **Dark Mode**: Toggle between light and dark themes
- ⌨️ **Keyboard Shortcuts**: 
  - `Ctrl+K` - Focus search
  - `Ctrl+N` - Add new employee
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🔔 **Toast Notifications**: User-friendly success/error messages

## 📋 Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🛠️ Installation

### Step 1: Database Setup

1. Create a new MySQL database:
```sql
CREATE DATABASE ps_III;
```

2. Import the database schema:
```bash
mysql -u root -p ps_III < Data_Bases.sql
```

Or run the SQL commands directly in phpMyAdmin or MySQL console.

### Step 2: Configuration

1. Edit `config.php` and update your database credentials:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');      // Your MySQL username
define('DB_PASS', '');          // Your MySQL password
define('DB_NAME', 'ps_III');    // Database name
```

### Step 3: File Structure

Ensure your files are organized as follows:
```
PMS_III/
├── index.php           # Main application file
├── config.php          # Database configuration
├── style.css           # Stylesheet
├── js.js              # JavaScript functionality
└── Data_Bases.sql     # Database schema
```

### Step 4: Web Server Setup

**For Apache/XAMPP:**
1. Place this project folder under `htdocs` (already true for this workspace)
2. Start Apache and MySQL in XAMPP
3. Access via: `http://localhost/PMS_III/`

**For PHP Built-in Server (Development):**
```bash
php -S localhost:8000 -t c:/xampp/htdocs/PMS_III
```
Access via: `http://localhost:8000/`

## 💼 Usage Guide

### Adding an Employee

1. Click the **+** floating button or press `Ctrl+N`
2. Fill in employee details:
   - **Personal Information**: Name, address, gender, reference number
   - **Employer Information**: Company name and address
   - **Tax & NI Details**: Tax period, tax code, NI number, NI code
   - **Salary Details**: Pay date, inner city allowance, basic salary, overtime
3. Watch the live calculation preview update automatically
4. Click **Save Employee**

### Payroll Calculations

The system automatically calculates:
- **Gross Pay** = Inner City Allowance + Basic Salary + Overtime
- **Tax** = 9% of Gross Pay
- **Pension** = 5.5% of Gross Pay
- **Student Loan** = 2.5% of Gross Pay
- **National Insurance** = 2.3% of Gross Pay
- **Total Deductions** = Tax + Pension + Student Loan + NI
- **Net Pay** = Gross Pay - Total Deductions

### Searching & Filtering

1. Use the search bar to find employees by:
   - Name
   - Reference number
   - Postcode
   - NI number
   - Employer name

2. Apply filters:
   - **Gender**: Male/Female/All
   - **Employer**: Select specific employer
   - **Records per page**: 10/25/50/100

3. Click the filter button or press Enter to apply

### Sorting

Click any column header with a sort icon to sort by that field. Click again to reverse the sort order.

### Bulk Operations

1. Check the boxes next to employees you want to delete
2. Click **Delete Selected** button
3. Confirm the deletion

### Viewing Analytics

1. Click the **Analytics** button in the header
2. View:
   - Monthly payroll trends (line chart)
   - Gender distribution (doughnut chart)
   - Top departments by total payroll (bar chart)

### Exporting Data

- **CSV Export**: Click the **Export** button to download all visible records
- **Print**: Click the **Print** button to open print dialog

### Theme Switching

Click the **Theme** button to toggle between light and dark modes. Your preference is saved automatically.

## 🎨 Customization

### Changing Calculation Percentages

Edit the `calc_from_components()` function in `index.php`:

```php
$taxable = ($gross * 9) / 100.0;     // Change 9 to your tax %
$pension = ($gross * 5.5) / 100.0;   // Change 5.5 to your pension %
$student = ($gross * 2.5) / 100.0;   // Change 2.5 to your student loan %
$ni = ($gross * 2.3) / 100.0;        // Change 2.3 to your NI %
```

### Changing Colors

Edit CSS variables in `style.css`:

```css
:root {
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-success: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
  --gradient-warning: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
}
```

### Adding Fields

1. Add column to database in `Data_Bases.sql`
2. Add field name to `$all_fields` array in `index.php`
3. Add form input in the modal HTML
4. Update JavaScript if needed

## 🔒 Security Features

- ✅ SQL injection prevention (PDO prepared statements)
- ✅ XSS protection (HTML escaping)
- ✅ CSRF protection (form tokens recommended for production)
- ✅ Input validation
- ✅ Error handling

## 🐛 Troubleshooting

### Database Connection Failed
- Check `config.php` credentials
- Ensure MySQL service is running
- Verify database exists

### Live Calculations Not Working
- Check browser console for JavaScript errors
- Ensure `js.js` is loaded correctly
- Clear browser cache

### Charts Not Displaying
- Verify Chart.js CDN is accessible
- Check for JavaScript errors in console
- Ensure data exists in database

### Dark Mode Not Saving
- Check browser localStorage is enabled
- Clear browser cache and cookies

## 📝 Database Schema

### `employees` Table

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Auto-increment primary key |
| employee_name | VARCHAR(255) | Employee full name |
| address | VARCHAR(255) | Home address |
| postcode | VARCHAR(20) | Postal code |
| gender | ENUM('m','f') | Gender |
| reference_no | VARCHAR(50) | Unique reference number |
| employer | VARCHAR(255) | Company name |
| emp_address | VARCHAR(255) | Company address |
| tax_period | VARCHAR(10) | Tax period (e.g., 2024-25) |
| tax_code | VARCHAR(50) | Tax code (e.g., 1257L) |
| pay_date | DATE | Payment date |
| inner_city | DECIMAL(10,2) | Inner city allowance |
| basic_salary | DECIMAL(10,2) | Basic salary amount |
| overtime | DECIMAL(10,2) | Overtime pay |
| gross_pay | DECIMAL(10,2) | Total gross pay |
| taxable_pay | DECIMAL(10,2) | Tax deduction |
| pensionable_pay | DECIMAL(10,2) | Pension contribution |
| student_loan | DECIMAL(10,2) | Student loan deduction |
| ni_payment | DECIMAL(10,2) | National Insurance |
| deduction | DECIMAL(10,2) | Total deductions |
| net_pay | DECIMAL(10,2) | Net pay (take home) |
| tax_todate | DECIMAL(10,2) | Tax to date |
| pension_todate | DECIMAL(10,2) | Pension to date |
| student_ref | VARCHAR(50) | Student loan reference |
| ni_code | VARCHAR(20) | NI code |
| ni_number | VARCHAR(50) | NI number |
| ref_note | TEXT | Additional notes |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

## 🚀 Future Enhancements

Potential features for future versions:
- PDF payslip generation
- Email notifications
- Multi-currency support
- Advanced reporting (yearly, quarterly)
- Employee self-service portal
- Audit logs
- Role-based access control
- Backup/restore functionality

## 📄 License

This project is open-source and available for personal and commercial use.

## 🤝 Support

For issues, questions, or contributions:
1. Check this README
2. Review the code comments
3. Test in a development environment first

## 🎉 Credits

- **Bootstrap 5** - UI Framework
- **Chart.js** - Data visualization
- **Bootstrap Icons** - Icon library
- **PHP & MySQL** - Backend technology

---

**Version**: 3.0  
**Last Updated**: 2024  
**Status**: Production Ready ✅
